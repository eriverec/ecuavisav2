<script>
import { ref } from 'vue';

export default {
  name: 'SendPulseData',
  setup() {
    const tokenUrl = 'https://api.sendpulse.com/oauth/access_token';
    const clientId = 'c79f7382012df0ea4c6fa37afec6374e';
    const clientSecret = '164551af334e1ec93e1b3099afd93a88';
    const accessToken = ref('');

    const getAccessToken = async () => {
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
        accessToken.value = data.access_token;
      } catch (error) {
        console.error('Error obteniendo el token de acceso:', error);
        throw error;
      }
    };

    return {
      getAccessToken,
      accessToken,
    };
  },
};
</script>
