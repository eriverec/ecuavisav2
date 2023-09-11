<template>
  <div>
    <h2>Crear Campaña</h2>
    <form @submit.prevent="createCampaign">
      <div>
        <label for="newsletterName">Nombre del Newsletter:</label>
        <input type="text" id="newsletterName" v-model="newsletterName" required />
      </div>
      <div>
        <label for="shortDescription">Descripción Corta:</label>
        <input type="text" id="shortDescription" v-model="shortDescription" required />
      </div>
      <div>
        <label for="subject">Asunto:</label>
        <input type="text" id="subject" v-model="subject" required />
      </div>
      <div>
        <label for="userList">Lista de Usuarios:</label>
        <select id="userList" v-model="selectedUserList" required>
          <option value="">Seleccionar Lista de Usuarios</option>
          <!-- Renderiza las opciones de listas de usuarios desde la API de SendPulse -->
          <option v-for="userList in userLists" :key="userList.id" :value="userList.id">{{ userList.name }}</option>
        </select>
      </div>
      <div>
        <label for="template">Plantilla:</label>
        <select id="template" v-model="selectedTemplate" required>
          <option value="">Seleccionar Plantilla</option>
          <!-- Renderiza las opciones de plantillas desde la API de SendPulse -->
          <option v-for="template in templates" :key="template.real_id" :value="template.real_id">{{ template.name }}</option>
        </select>
      </div>
      <button type="submit">Crear Campaña</button>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const newsletterName = ref('');
const shortDescription = ref('');
const subject = ref('');
const selectedUserList = ref('');
const selectedTemplate = ref('');
const userLists = ref([]);
const templates = ref([]);

// Define tu cliente ID y cliente secreto de SendPulse
const clientID = 'c79f7382012df0ea4c6fa37afec6374e';
const clientSecret = '164551af334e1ec93e1b3099afd93a88';
let sendPulseAccessToken = null;

// Función para obtener el token de acceso
const fetchSendPulseAccessToken = async () => {
  try {
    const response = await axios.post('https://api.sendpulse.com/oauth/access_token', {
      grant_type: 'client_credentials',
      client_id: clientID,
      client_secret: clientSecret,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    sendPulseAccessToken = response.data.access_token;
  } catch (error) {
    console.error('Error al obtener el token de acceso de SendPulse', error);
  }
};

// Llama a la API de SendPulse para obtener las listas de usuarios y las plantillas disponibles
onMounted(async () => {
  await fetchSendPulseAccessToken(); // Obtiene el token de acceso antes de realizar otras solicitudes
  if (!sendPulseAccessToken) {
    return; // Detener si no se pudo obtener el token de acceso
  }
  try {
    const userListsResponse = await axios.get('https://api.sendpulse.com/addressbooks', {
      headers: {
        Authorization: `Bearer ${sendPulseAccessToken}`,
      },
    });
    userLists.value = userListsResponse.data;

    const templatesResponse = await axios.get('https://api.sendpulse.com/templates/?owner=me', {
      headers: {
        Authorization: `Bearer ${sendPulseAccessToken}`,
      },
    });
    templates.value = templatesResponse.data;
    console.log("templatesResponse.data:",templatesResponse.data);
    console.log("userListsResponse.data:",userListsResponse.data);

  } catch (error) {
    console.error('Error al obtener datos de la API de SendPulse', error);
  }
});

// Función para crear la campaña
const createCampaign = () => {
  
  if (!sendPulseAccessToken) {
    console.error('Token de acceso no disponible');
    return;
  }

  const campaignData = {
    sender_name: shortDescription.value,
    sender_email: "ecuavisainforma@ecuavisa.com",
    name: newsletterName.value,
    subject: subject.value,
    list_id: selectedUserList.value,
    template_id: selectedTemplate.value,
    // Otros datos necesarios para crear la campaña
  };

  console.log("campaignData:",campaignData);

  // Llama a la API de SendPulse para crear la campaña con campaignData
  axios.post('https://api.sendpulse.com/campaigns', campaignData, {
    headers: {
      Authorization: `Bearer ${sendPulseAccessToken}`,
    },
  })
    .then((response) => {
      // Maneja la respuesta de la API después de crear la campaña
      console.log('Campaña creada con éxito', response.data);
    })
    .catch((error) => {
      console.error('Error al crear la campaña', error);
    });
};
</script>
