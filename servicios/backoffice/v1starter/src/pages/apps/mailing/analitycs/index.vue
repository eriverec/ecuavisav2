<template>
  <div>
    <VRow class="align-center">
      <VCol sm="7" cols="12">
        <VCard>
          <VCardTitle>Datos estadísticos de Campañas </VCardTitle>
          <VCardSubtitle>Muestra detalles estadísticos relevantes sobre la campaña seleccionada </VCardSubtitle>
          <VCardText v-if="formattedCampaigns.length > 1">
            <div class="d-flex  align-center gap-4">
              <VSelect v-model="selectedCampaignId" :items="formattedCampaigns" item-text="title" item-value="id"
                style="width: 480px;flex: none;" density="compact" label="Selecciona una campaña" />
            </div>
          </VCardText>
          <VCardText v-else>Cargando...</VCardText>
        </VCard>
      </VCol>

      <VCol sm="5" cols="12">
        <VCard v-if="statsList">
          <VCardText>
            <div class="d-flex gap-3 justify-center align-start flex-column mt-4">
              <span class="text-h5 font-bold">Datos de Campaña</span>
              <VChip size="large" v-if="loading">Calculando...</VChip>

              <div v-if="statsList.length > 0" class="list-group mb-3">
                <div v-for="(stat, index) in statsList" :key="index" class="list-group-item list-group-item-action flex-column align-items-start active">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ stat.explain }}</h5><VChip size="small" color="secondary">#{{ stat.count }}</VChip>
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
import { ref, onMounted } from 'vue';
// import { VDialogTransition } from 'vuetify/lib/components';

const tokenUrl = 'https://api.sendpulse.com/oauth/access_token';
const clientId = 'c79f7382012df0ea4c6fa37afec6374e';
const clientSecret = '164551af334e1ec93e1b3099afd93a88';
const formattedCampaigns = ref([]);
const selectedCampaignId = ref(null);
const loading = ref(false);
const formattedCodes = ref([]);
const resultadoCalculo = ref('0');
const seExplain = ref('1');
const valorIni = ref('');
const msjRes = ref('');

const campaignData = ref([]); // información de la  campaña
const statsList = ref([]); //estadisticas de campaña

const getAccessToken = async () => {
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
};

// Llamadas a la API
onMounted(async () => {
  // Paso 1: Obtener lista de campañas
  const campaignsResponse = await fetch('https://api.sendpulse.com/campaigns?order=desc', {
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
  const campaignsData = await campaignsResponse.json();
  // console.log(campaignsData.slice(0, 5));
  formattedCampaigns.value = campaignsData.slice(0, 20).map(campaign => ({
    id: campaign.id,
    title: campaign.name,
  }));

  // Paso 2: Obtener estadísticas de la campaña seleccionada
  watch(selectedCampaignId, async () => {
    loading.value = true;
    if (selectedCampaignId.value) {
      const campaignId = selectedCampaignId.value;
      // console.log("campaignId", campaignId);
      const statisticsResponse = await fetch(`https://api.sendpulse.com/campaigns/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${await getAccessToken()}`,
        },
      });
      const statisticsData = await statisticsResponse.json();
      // console.log(statisticsData.all_email_qty);
      loading.value = false;
      statsList.value = statisticsData.statistics.general; //agregamos a variable los datos estadísticos de la campaña
      console.log("statisticsData", statisticsData.statistics.general);

      formattedCodes.value = statisticsData.statistics.general.map(statistic => ({
        code: statistic.code,
        title: statistic.explain,
      }));
      // console.log(formattedCodes.value);
    }
  });
});

</script>
