<template>
  <div>
    <VRow class="align-items-start">
      <VCol sm="8" cols="12">
        <VCard class="mb-3">
          <VCardTitle>Datos estadísticos de Campañas</VCardTitle>
          <VCardSubtitle>Muestra detalles estadísticos relevantes sobre la campaña seleccionada</VCardSubtitle>
          <VCardText v-if="formattedCampaigns.length > 1">
            <VSelect v-model="selectedCampaignId" :items="formattedCampaigns" item-text="title" item-value="id" label="Selecciona una campaña" />
          </VCardText>
          <VCardText v-else>Cargando...</VCardText>
        </VCard>

        <VCard v-if="statsList.length > 0" class="d-flex flex-wrap">
          <VCol md="4" cols="12" class="mb-3">
            <VCardTitle>Resumen</VCardTitle>
            <div>
              <p><strong>Send Date:</strong> {{ campaignInfo.sendDate }}</p>
              <p><strong>Permalink:</strong> <a :href="campaignInfo.permalink" target="_blank">Link</a></p>
              <!-- Muestra aquí más información de la campaña según necesites -->
            </div>
          </VCol>
          <VCol md="8" cols="12" class="mb-3">
            <VCardTitle>Gráfico de entregas de email</VCardTitle>
            <ApexChart type="donut" :options="donutOptions" :series="donutSeries" />
          </VCol>
          <VCol md="6" cols="12" class="mb-3">
            <VCardTitle>Gráfico de Aperturas y No Aperturas</VCardTitle>
            <ApexChart type="bar" :options="barOptions" :series="barSeries" />
          </VCol>
          <VCol md="6" cols="12">
            <VCardTitle>Errores de Servidor de Correo</VCardTitle>
            <ApexChart type="bar" :options="serverErrorsOptions" :series="serverErrorsSeries" />
          </VCol>
        </VCard>
      </VCol>

      <VCol sm="4" cols="12">
        <VCard v-if="statsList">
          <VCardText>
            <div class="d-flex gap-3 justify-center align-start flex-column mt-4">
              <span class="text-h5 font-bold">Datos de Campaña</span>
              <VChip size="large" v-if="loading">Calculando...</VChip>
              <div v-if="statsList.length > 0" class="list-group mb-3">
                <div v-for="(stat, index) in statsList" :key="index" class="list-group-item list-group-item-action flex-column align-items-start">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ stat.explain }}</h5>
                    <VChip size="small" color="secondary">#{{ stat.count }}</VChip>
                  </div>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ApexChart from 'vue3-apexcharts';

const tokenUrl = 'https://api.sendpulse.com/oauth/access_token';
const clientId = 'c79f7382012df0ea4c6fa37afec6374e';
const clientSecret = '164551af334e1ec93e1b3099afd93a88';

const formattedCampaigns = ref([]);
const selectedCampaignId = ref(null);
const loading = ref(false);
const statsList = ref([]);
const campaignInfo = ref({});

const donutOptions = ref({
  chart: {
    type: 'donut',
  },
  labels: [],
  legend: {
    position: 'bottom'
  },
});
const donutSeries = ref([]);

const barOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      distributed: true,
    },
  },
  colors: ['#FFC107', '#4CAF50', '#FF5722'],
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['Emails Entregados', 'Emails Abiertos', 'Emails No Abiertos'],
  },
});
const barSeries = ref([{
  data: [],
}]);

const serverErrorsOptions = ref({
  chart: {
    type: 'bar',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [],
  },
});
const serverErrorsSeries = ref([{ data: [] }]);

async function getAccessToken() {
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error obteniendo el token de acceso:', error);
    throw error;
  }
}

onMounted(async () => {
  loading.value = true;
  const accessToken = await getAccessToken();
  const campaignsResponse = await fetch('https://api.sendpulse.com/campaigns?order=desc', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const campaignsData = await campaignsResponse.json();
  formattedCampaigns.value = campaignsData.slice(0, 20).map(campaign => ({
    id: campaign.id,
    title: campaign.name,
  }));
  loading.value = false;
});

watch(selectedCampaignId, async (newVal) => {
  if (!newVal) return;
  loading.value = true;
  const accessToken = await getAccessToken();
  const statisticsResponse = await fetch(`https://api.sendpulse.com/campaigns/${newVal}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const statisticsData = await statisticsResponse.json();
  statsList.value = statisticsData.statistics.general;
  campaignInfo.value = {
    sendDate: statisticsData.send_date,
    permalink: statisticsData.permalink,
    // Aquí puedes añadir más campos según necesites
  };
  loading.value = false;
  updateChartData();
});

function updateChartData() {
  const delivered = statsList.value.find(stat => stat.explain === 'Delivered')?.count || 0;
  const opened = statsList.value.find(stat => stat.explain === 'Opened')?.count || 0;
  const notOpened = delivered - opened;

  barSeries.value[0].data = [delivered, opened, notOpened];

  donutOptions.value.labels = ['Entregados', 'Catalogado como spam', 'Fallo de entrega', 'No existe email', 'Mailbox is full'];
  donutSeries.value = [
    delivered,
    statsList.value.filter(stat => stat.explain.includes('Mail server answer')).reduce((acc, curr) => acc + curr.count, 0),
    statsList.value.find(stat => stat.explain === 'Delivery failure')?.count || 0,
    statsList.value.find(stat => stat.explain === 'Not valid email')?.count || 0,
    statsList.value.find(stat => stat.explain === 'Temporary blocked')?.count || 0,
  ];

  const errorCategories = ['Mail server answer :: Rejected by server as spam', 'Mail server answer :: No such email', 'Mail server answer :: Mailbox is full', 'Not valid email', 'Temporary blocked'];
  serverErrorsOptions.value.xaxis.categories = errorCategories;
  serverErrorsSeries.value[0].data = errorCategories.map(error =>
    statsList.value.find(stat => stat.explain === error)?.count || 0
  );
}
</script>
