// useSendPulse.js
import { ref } from 'vue';

const tokenUrl = 'https://api.sendpulse.com/oauth/access_token';
const clientId = 'c79f7382012df0ea4c6fa37afec6374e';
const clientSecret = '164551af334e1ec93e1b3099afd93a88';

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

async function getCampaigns() {
  const accessToken = await getAccessToken();
  const campaignsResponse = await fetch('https://api.sendpulse.com/campaigns?order=desc', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const campaignsData = await campaignsResponse.json();
  return campaignsData.slice(0, 20).map(campaign => ({
    id: campaign.id,
    title: campaign.name,
  }));
}

async function getCampaignStatistics(campaignId) {
  const accessToken = await getAccessToken();
  const statisticsResponse = await fetch(`https://api.sendpulse.com/campaigns/${campaignId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const statisticsData = await statisticsResponse.json();
  return statisticsData;
}

export { getCampaigns, getCampaignStatistics };
