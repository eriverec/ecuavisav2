<template>
  <div>
    <VRow class="align-center">
      <VCol cols="7">
        <VCard title="Churnrate">
          <VCardText v-if="formattedCampaigns.length > 1">
            <div class="d-flex justify-center align-center gap-4">
              <label for="campaignSelect">Selecciona una campaña:</label>
              <VSelect v-model="selectedCampaignId" :items="formattedCampaigns" item-text="title" item-value="id"
                style="width: 400px;flex: none;" density="compact" label="Lista de campañas" />

            </div>
            <div v-if="selectedCampaignId" class="d-flex justify-center align-center gap-4 mt-5">
              <label for="campaignSelect">Selecciona la estadistica:</label>
              <VSelect v-model="selectedCode" :items="formattedCodes" item-text="title" item-value="code"
                style="width: 400px;flex: none;" density="compact" label="Estadisticas" />

            </div>
            <div class="d-flex d-none justify-center align-center mt-5">
              <v-btn @click="calcularValor" v-if="selectedCode">Calcular</v-btn>
            </div>
          </VCardText>
          <VCardText v-else>Cargando...</VCardText>
        </VCard>
      </VCol>

      <VCol cols="5">
        <VCard>
          <VCardText>
            <div class="d-flex gap-3 justify-center align-center flex-column mt-4">
              <span class="text-h5 font-bold">RESULTADO</span>
              <VChip size="large" v-if="loading">Calculando...</VChip>
              <VChip color="success" size="large" v-else> {{ resultadoCalculo }}</VChip>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tokenUrl = 'https://api.sendpulse.com/oauth/access_token';
const clientId = 'c79f7382012df0ea4c6fa37afec6374e';
const clientSecret = '164551af334e1ec93e1b3099afd93a88';
const formattedCampaigns = ref([]);
const selectedCampaignId = ref(null);
const loading = ref(false);
const formattedCodes = ref([]);
const selectedCode = ref(null);
const resultadoCalculo = ref('0');

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
  formattedCampaigns.value = campaignsData.slice(0, 10).map(campaign => ({
    id: campaign.id,
    title: campaign.name,
  }));

  // Paso 2: Obtener estadísticas de la campaña seleccionada
  watch(selectedCampaignId, async () => {
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
      formattedCodes.value = statisticsData.statistics.general.map(statistic => ({
        code: statistic.code,
        title: statistic.explain,
      }));
      // console.log(formattedCodes.value);
    }
  });
});

// Paso 3: Calcular y mostrar resultado
const calcularValor = async () => {
  loading.value = true;
  const selectedCodeValue = selectedCode.value;
  const statisticsResponse = await fetch(`https://api.sendpulse.com/campaigns/${selectedCampaignId.value}`, { headers: { Authorization: `Bearer ${await getAccessToken()}`, }, });
  const statisticsData = await statisticsResponse.json();

  // console.log("statisticsData", statisticsData);

  const selectedCodeCount = statisticsData.statistics.general.find(statistic => statistic.code === selectedCodeValue)?.count || 0;
  // console.log("selectedCodeCount", selectedCodeCount);
  const allEmailQty = statisticsData.all_email_qty || 0;
  const res = (selectedCodeCount / allEmailQty) * 100;

  resultadoCalculo.value = res != 0 ? res : 'El contador inial es 0' ;
  loading.value = false;
};

</script>
