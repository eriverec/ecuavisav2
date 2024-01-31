<template>
  <div>
    <VRow class="align-center">
      <VCol sm="7" cols="12">
        <VCard>
          <VCardTitle>Datos estadísticos de Campañas </VCardTitle>
          <VCardSubtitle>Muestra detalles estadísticos relevantes sobre la campaña seleccionada </VCardSubtitle>

          <VCardText v-if="formattedCampaigns.length > 1">
            <div class="d-flex  align-center gap-4">
              <!-- <label for="campaignSelect">Selecciona una campaña:</label> -->
              <VSelect v-model="selectedCampaignId" :items="formattedCampaigns" item-text="title" item-value="id"
                style="width: 480px;flex: none;" density="compact" label="Selecciona una campaña" />

            </div>
            <div v-if="selectedCampaignId" class="d-flex align-center gap-4 mt-5">
              <!-- <label for="campaignSelect">Selecciona la estadistica:</label> -->
              <VSelect v-model="selectedCode" :items="formattedCodes" item-text="title" item-value="code"
                style="width: 480px;flex: none;" density="compact" label="Selecciona la estadistica" />

            </div>
            <div class="d-flex d-none align-center mt-5">
              <v-btn @click="calcularValor" v-if="selectedCode">Calcular</v-btn>
            </div>
          </VCardText>
          <VCardText v-else>Cargando...</VCardText>
        </VCard>
      </VCol>

      <VCol sm="5" cols="12">
        <VCard v-if="seExplain">
          <VCardText>
            <div class="d-flex gap-3 justify-center align-start flex-column mt-4">
              <span class="text-h5 font-bold">Resultado de la tasa de abandono de {{ seExplain }} (Churnrate)</span>
              <VChip size="large" v-if="loading">Calculando...</VChip>
              <div v-else class="gap-3 d-flex justify-center align-center">
                <VChip :color="`${valorIni >= 0 && valorIni <= 8 ? 'success' : 'error'}`" size="large"> {{
                  resultadoCalculo }}
                  <span v-if="valorIni != 0">%</span>
                </VChip>
                <span v-if="valorIni != 0">
                  {{ msjRes }}
                </span>

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
const selectedCode = ref(null);
const resultadoCalculo = ref('0');
const seExplain = ref('');
const valorIni = ref('');
const msjRes = ref('')
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

  const selectedExplain = statisticsData.statistics.general.find(statistic => statistic.code === selectedCodeValue)?.explain || 0;

  seExplain.value = selectedExplain;

  console.log("selectedExplain", selectedExplain);
  const allEmailQty = statisticsData.all_email_qty || 0;
  const res = (selectedCodeCount / allEmailQty) * 100;
  console.log((selectedCodeCount / allEmailQty));

  const resultT = res;
  // resultadoCalculo.value = resultT;
  valorIni.value = resultT

  console.log("resultT", valorIni.value);

  function financial(x) {
    const formattedNumber = Number.parseFloat(x).toFixed(2);
    const [integerPart, decimalPart] = formattedNumber.split('.');

    if (decimalPart === '00') {
      if (integerPart === '0') {
        return 'El valor inial es 0';
      } else {
        return `${integerPart}`;
      }
    } else {
      return `${formattedNumber}`;
    }
    // return Number.parseFloat(x).toFixed(2);
  }

  resultadoCalculo.value = financial(resultT)
  msjRes.value = resultadoCalculo.value >= 0 && resultadoCalculo.value <= 8 ? 'Es aceptable, cuanto más bajo, mejor' : 'No es bueno, cuanto más bajo, mejor';
  console.log(resultadoCalculo.value);
  console.log(msjRes.value);

  loading.value = false;
};

</script>
