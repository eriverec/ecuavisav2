<template>
  <div>
    <label for="campaignSelect">Selecciona una campaña:</label>
    <select id="campaignSelect" v-model="selectedCampaignId" @change="fetchCampaignData">
      <option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
        {{ campaign.id }}
      </option>
    </select>
    <div class="d-flex gap-3">
      <p>Total a calcular: </p>
      <p v-if="loading">Calculando...</p>
      <span v-else>{{ total }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Configuración de la API
// const apiUrl = 'https://api.sendpulse.com/campaigns/3028399';
const tokenUrl = 'https://api.sendpulse.com/oauth/access_token';
const clientId = 'c79f7382012df0ea4c6fa37afec6374e';
const clientSecret = '164551af334e1ec93e1b3099afd93a88';

// Configuración de la API de campañas
const campaignsUrl = 'https://api.sendpulse.com/campaigns?order=desc';
const campaignDetailUrl = 'https://api.sendpulse.com/campaigns/';

// Estado local
const campaigns = ref([]);
const selectedCampaignId = ref(null);
const total = ref(0);
const loading = ref(false);
const formattedTotal = ref('');

// Función para obtener la lista de campañas
const fetchCampaigns = async () => {
  try {
    const response = await fetch(campaignsUrl, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    const data = await response.json();
    campaigns.value = data;
  } catch (error) {
    console.error('Error al obtener la lista de campañas:', error);
  }
};

// Función para obtener y procesar los datos de la campaña seleccionada
const fetchCampaignData = async () => {
  if (!selectedCampaignId.value) return;

  try {
    loading.value = true; // Inicia la carga
    const response = await fetch(campaignDetailUrl + selectedCampaignId.value, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    const data = await response.json();
    const code5Count = data.statistics.general.find(item => item.code === 5)?.count || 0;
    total.value = (code5Count / data.all_email_qty) * 100;
    formattedTotal.value = total.value.toLocaleString();
  } catch (error) {
    console.error('Error al obtener los datos de la campaña:', error);
  } finally {
    loading.value = false; // Finaliza la carga, independientemente de si hubo un error o no
  }
};

// Función para obtener el token de acceso
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

// Llamar a la función fetchCampaigns cuando el componente está montado
onMounted(() => {
  fetchCampaigns();
});

// Llamar a la función fetchCampaignData cuando se selecciona una campaña
onMounted(() => {
  if (selectedCampaignId.value) {
    fetchCampaignData();
  }
});
</script>
