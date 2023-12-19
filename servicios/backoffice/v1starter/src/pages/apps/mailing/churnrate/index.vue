<template>
  <div>
    <VCard title="Churnrate">

        <VCardText class="">
          <div class="d-flex justify-center align-center gap-4">
            <label for="campaignSelect">Selecciona una campaña:</label>
            <VSelect 
              v-model="selectedCampaignId" 
              :items="formattedCampaigns"
              item-text="title" 
              item-value="id" 
              style="width: 400px;flex: none;" 
              density="compact" 
              label="Lista de campañas"/>

          </div>
          <div class="d-flex gap-3 justify-center align-center flex-column mt-4">
            <span class="text-h5 font-bold">TOTAL</span>
            <VChip size="large" v-if="loading">Calculando...</VChip>
            <VChip color="success" size="large" v-else> {{ total }}</VChip>
          </div>
        
        </VCardText>
      </VCard>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tokenUrl = 'https://api.sendpulse.com/oauth/access_token';
const clientId = 'c79f7382012df0ea4c6fa37afec6374e';
const clientSecret = '164551af334e1ec93e1b3099afd93a88';
const campaignsUrl = 'https://api.sendpulse.com/campaigns?order=desc';
const campaignDetailUrl = 'https://api.sendpulse.com/campaigns/';
const formattedCampaigns = ref([]);
const selectedCampaignId = ref(null);
const total = ref(0);
const loading = ref(false);
const formattedTotal = ref('');

const fetchCampaigns = async () => {
  try {
    const response = await fetch(campaignsUrl, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    const data = await response.json();
    // campaigns.value = data.slice(0,10);
    // formattedCampaigns.value = data.slice(0,10).map(campaign => (campaign.id));
    formattedCampaigns.value = data.slice(0, 10).map(campaign => ({ id: campaign.id, title: campaign.name })); 
    console.log(formattedCampaigns.value);
  } catch (error) {
    console.error('Error al obtener la lista de campañas:', error);
  }
};

const fetchCampaignData = async () => {
  if (!selectedCampaignId.value) return;

  try {
    loading.value = true; 
    console.log(selectedCampaignId.value);
    const response = await fetch(campaignDetailUrl + selectedCampaignId.value, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    const data = await response.json();
    const code5Count = data.statistics.general.find(item => item.code === 5)?.count || 0;
    total.value = (code5Count / data.all_email_qty) * 100 != 0 ? (code5Count / data.all_email_qty) * 100 : 'Todos los usuarios de la campaña han abierto el correo';
    formattedTotal.value = total.value.toLocaleString();
    console.log(total.value);
  } catch (error) {
    console.error('Error al obtener los datos de la campaña:', error);
  } finally {
    loading.value = false; // Finaliza la carga, independientemente de si hubo un error o no
  }
};


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


onMounted(() => {
  fetchCampaigns();
});

watch(selectedCampaignId, () => {
  fetchCampaignData();
});


</script>
