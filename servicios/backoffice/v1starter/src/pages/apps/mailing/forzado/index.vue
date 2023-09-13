<template>
  <div>
    <VRow>
      <VCol class="mt-0" cols="12" md="12" lg="12">
        <div class="demo-space-x">
          <VBtn color="primary" variant="text" class="mb-4 d-none" :to="{ name: 'apps-mailing-list' }">
            Lista de Newsletter
          </VBtn>
          <VBtn color="primary" class="mb-4" :to="{ name: 'apps-mailing-forzado' }">
            Enviar Forzado
          </VBtn>
          <VBtn color="primary" variant="text" class="mb-4" :to="{ name: 'apps-mailing-tabs-edit' }">
            Editar newsletter
          </VBtn>
        </div>

        <VCard class="mt-5">
          <VCardText>
            <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
              <div>
                <VCardTitle>
                  Crear campaña v2
                </VCardTitle>
                <VCardSubtitle> Esta modulo nos permite enviar boletines de manera manual </VCardSubtitle>
              </div>
            </div>

            <!-- inicio lista de Módulos -->

            <div class="px-4">
              <VCardText class="align-center px-0 pb-0 pt-2">
                <form @submit.prevent="createCampaign">
                  <VRow class="al-center">

                    <VCol cols="12" sm="6" md="6">
                      <VCol cols="12" sm="12" md="12">
                        <VTextField prepend-inner-icon="tabler-clipboard-text" v-model="newsletterName"
                          label="Nombre del Newsletter" autocomplete="off" />
                      </VCol>
                      <VCol cols="12" sm="12" md="12">
                        <VTextField prepend-inner-icon="tabler-mail-check" v-model="nameRemitente"
                          label="Escribir el remitente" persistent-hint autocomplete="off" />
                      </VCol>
                      <VCol cols="12" sm="12" md="12">
                        <VTextField prepend-inner-icon="tabler-mail-check" v-model="subject" label="Escribir el asunto"
                          persistent-hint autocomplete="off" />
                      </VCol>
                      <VCol cols="12" sm="12" md="12">
                        <VAutocomplete prepend-inner-icon="tabler-users" v-model="selectedUserList"
                          :items="dataBookUserList" label="Lista de usuarios" />
                      </VCol>

                      <VCol cols="12" sm="12" md="12">
                        <VAutocomplete prepend-inner-icon="tabler-template"
                          v-model="selectedTemplate" :items="dataTemplateList"
                          label="Lista de plantillas del sendpulse" />
                      </VCol>


                      <div class="bloque_editar_template" v-if="selectedTemplate">
                        <VCardTitle>Campos para editar el template </VCardTitle>
                        <VCol cols="12" sm="12" md="12">
                          <VTextField prepend-inner-icon="tabler-list" v-model="imgenArticulo" label="Imagen del articulo"
                            persistent-hint autocomplete="off" />
                        </VCol>

                        <VCol cols="12" sm="12" md="12">
                          <VTextField prepend-inner-icon="tabler-list" v-model="urlArticulo" label="Url del articulo"
                            persistent-hint autocomplete="off" />
                        </VCol>

                        <VCol cols="12" sm="12" md="12">
                          <VTextField prepend-inner-icon="tabler-list" v-model="tituloArticulo" label="Titulo del articulo"
                            persistent-hint autocomplete="off" />
                        </VCol>

                        <VCol cols="12" sm="12" md="12">
                          <VTextarea v-model="subtituloArticulo" label="Subtitulo del articulo"
                            persistent-hint autocomplete="off" />
                        </VCol>

                      </div>


                      <VCol cols="12" sm="12" md="12">
                        <VBtn color="success" type="submit">
                          <VIcon :size="22" icon="tabler-mail-fast" /> Crear Campaña
                        </VBtn>
                      </VCol>
                    </VCol>

                    <VCol cols="12" sm="6" md="6" class="fondo-gris">
                      <VCol cols="12" sm="12" md="12">
                        <!-- <div v-if="selectedTemplatePreview">
                          <img class="imgPreview" :src="selectedTemplatePreview" alt="Vista Previa del Template" />
                        </div> -->
                        <div v-if="htmlBody">
                          <p v-html="htmlBody"></p>
                        </div>
                        <div v-else>
                          <p class="text-center">Debe de seleccionar una plantilla</p>
                        </div>
                      </VCol>
                    </VCol>
                  </VRow>
                </form>
              </VCardText>

            </div>

          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
const newsletterName = ref('');
const nameRemitente = ref('');
const subject = ref('');
const selectedUserList = ref('');
const selectedTemplate = ref('');
const userLists = ref([]);
const templates = ref([]);
const dataBookUserList = ref([]);
const dataList = ref([]);
const dataTemplateList = ref([]);
const htmlBody = ref('');
const imgenArticulo = ref("https://www.ecuavisa.com/binrepository/1200x842/0c121/1200d600/none/11705/CCLO/2023082070755-cuenca-elecciones-antic_1138756_20230911181429.jpg");
const tituloArticulo = ref("Lorem ipsum dolor sit amet consectetur adipisicing elit. Non animi suscipit nam adipisci.");
const urlArticulo = ref("https://www.ecuavisa.com");
const subtituloArticulo = ref("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequatur qui adipisci ut, veniam ad nesciunt. Illum dolore voluptatibus eligendi repellat iure. Sint aliquam repellendus vitae quidem similique temporibus explicabo aspernatur.");

// Arreglo con las opciones para el campo VAutocomplete
// const dataBoletinList = ['Diario', 'Opinión'];

watch(selectedTemplate, async (value) => {
  if (value) {
    try {
      const response = await axios.get(`https://api.sendpulse.com/template/${value}`, {
        headers: {
          Authorization: `Bearer ${sendPulseAccessToken}`, // Agregamos el encabezado de autorización
        },
      });
      function base64ToBytes(base64) {
        const binString = atob(base64);
        return Uint8Array.from(binString, (m) => m.codePointAt(0));
      }
      htmlBody.value = new TextDecoder().decode(base64ToBytes(response.data.body));
      updateImageSrc();
      updateTitulo();
      updateUrl();
      updateSubtitulo();
      updateFecha();
      // return templateBody; // Devuelve el cuerpo del template
    } catch (error) {
      console.error('Error al obtener el cuerpo del template', error);
    }
  }
  // alert(value)
});

watch(imgenArticulo, () => {
  updateImageSrc();
});

watch(tituloArticulo, () => {
  updateTitulo();
});

watch(urlArticulo, () => {
  updateUrl();
});

watch(subtituloArticulo, () => {
  updateSubtitulo();
});

function updateImageSrc() {
  // Buscar la clase "back_img" dentro de htmlBody.value
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlBody.value, 'text/html');
  const imgElement = doc.querySelector('.back_img');

  if (imgElement) {
    imgElement.src = imgenArticulo.value;
    htmlBody.value = doc.body.innerHTML;
  }
}
function updateTitulo() {
  // Buscar la clase "back_titulo" dentro de htmlBody.value
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlBody.value, 'text/html');
  const tituloElement = doc.querySelector('.back_titulo');
  if (tituloElement) {
    tituloElement.textContent = tituloArticulo.value;
    // Actualizar el contenido de htmlBody.value con el nuevo HTML modificado
    htmlBody.value = doc.body.innerHTML;
  }
}

function updateSubtitulo() {
  // Buscar la clase "back_titulo" dentro de htmlBody.value
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlBody.value, 'text/html');
  const subtituloElement = doc.querySelector('.back_body');
  if (subtituloElement) {
    subtituloElement.textContent = subtituloArticulo.value;
    // Actualizar el contenido de htmlBody.value con el nuevo HTML modificado
    htmlBody.value = doc.body.innerHTML;
  }
}
function updateUrl() {
  // Buscar la clase "back_titulo_url" dentro de htmlBody.value
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlBody.value, 'text/html');
  const urlElement = doc.querySelector('.back_titulo_url');
  const urlVerMasElement = doc.querySelector('.back_url_vermas');

  if (urlElement) {
    urlElement.href = urlArticulo.value;
    htmlBody.value = doc.body.innerHTML;
  }
  if(urlVerMasElement){
    urlVerMasElement.href = urlArticulo.value;
    htmlBody.value = doc.body.innerHTML;
  }
}

function obtenerFechaConFormato() {
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const fechaActual = new Date();
  const diaSemana = diasSemana[fechaActual.getDay()];
  const dia = fechaActual.getDate().toString().padStart(2, "0");
  const mes = meses[fechaActual.getMonth()];
  const año = fechaActual.getFullYear();

  return `${diaSemana}, ${dia} de ${mes} de ${año}`;
}


function updateFecha() {
  // Obtener la fecha actual
  // const fechaActual = new Date().toLocaleDateString();
  const fechaActual = obtenerFechaConFormato();

  // Buscar la clase "fechaDelDia" dentro de htmlBody.value
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlBody.value, 'text/html');
  const fechaElement = doc.querySelector('.fechaDelDia');
  if (fechaElement) {
    fechaElement.textContent = fechaActual;
    // Actualizar el contenido de htmlBody.value con el nuevo HTML modificado
    htmlBody.value = doc.body.innerHTML;
  }
}


const dataBoletinList = [
  { text: 'Diario', value: '3499' },
  { text: 'Opinión', value: '8323' },
];

for (var i in dataBoletinList) {
  dataList.value.push({ title: `${dataBoletinList[i].text} - ${dataBoletinList[i].value}`, value: dataBoletinList[i].value })
}
dataList.value.sort((a, b) => a.title.localeCompare(b.title));

const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false
});



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

    /*------------------------lista user--------------------------- */
    const userListsResponse = await axios.get('https://api.sendpulse.com/addressbooks', {
      headers: {
        Authorization: `Bearer ${sendPulseAccessToken}`,
      },
    });
    userLists.value = userListsResponse.data;

    for (var i in userListsResponse.data) {
      dataBookUserList.value.push({ title: `${userListsResponse.data[i].name}`, value: userListsResponse.data[i].id })
    }
    dataBookUserList.value.sort((a, b) => a.title.localeCompare(b.title));

    /*------------------------lista template--------------------------- */
    const templatesResponse = await axios.get('https://api.sendpulse.com/templates/?owner=me', {
      headers: {
        Authorization: `Bearer ${sendPulseAccessToken}`,
      },
    });

    templates.value = templatesResponse.data;

    for (var i in templatesResponse.data) {
      dataTemplateList.value.push({
        title: `${templatesResponse.data[i].name} - ${templatesResponse.data[i].real_id}`,
        value: templatesResponse.data[i].real_id
      })
    }

    dataTemplateList.value.sort((a, b) => a.title.localeCompare(b.title));


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

  function bytesToBase64(bytes) {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
    return btoa(binString);
  }

  const campaignData = {
    sender_name: nameRemitente.value,
    sender_email: "ecuavisainforma@ecuavisa.com",
    name: newsletterName.value,
    subject: subject.value,
    list_id: selectedUserList.value,
    body: bytesToBase64(new TextEncoder().encode(htmlBody.value))
    // Otros datos necesarios para crear la campaña
  };

  console.log("campaignData:", campaignData);

  // Llama a la API de SendPulse para crear la campaña con campaignData
  axios.post('https://api.sendpulse.com/campaigns', campaignData, {
    headers: {
      Authorization: `Bearer ${sendPulseAccessToken}`,
    },
  })
    .then((response) => {
      // Maneja la respuesta de la API después de crear la campaña
      console.log('Campaña creada con éxito', response.data);
      configSnackbar.value = {
        message: "Enviado con exito",
        type: "success",
        model: true
      };
      
    })
    .catch((error) => {
      console.error('Error al crear la campaña', error);
    });
};


// Propiedad computada para obtener la vista previa de la plantilla seleccionada
const selectedTemplatePreview = computed(() => {
  const selectedTemplateId = selectedTemplate.value;
  if (selectedTemplateId) {
    // Buscar la plantilla seleccionada en la lista de plantillas
    const selectedTemplate = templates.value.find(template => template.real_id === selectedTemplateId);
    if (selectedTemplate) {
      return selectedTemplate.preview;
    }
  }
  return ''; // Si no se selecciona una plantilla o no se encuentra la vista previa, devuelve una cadena vacía
});


</script>

<style>
.imgPreview {
  width: 100%;
}
</style>
