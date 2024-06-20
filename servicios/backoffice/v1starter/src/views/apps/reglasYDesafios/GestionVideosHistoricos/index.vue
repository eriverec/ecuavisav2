<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const currentTab = ref('tab-lista');
const checkbox = ref(1);
const dataDesafio = ref([]);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const idCampaign = ref("");
const disabledPagination = ref(false);
const disabledViewList = ref(false);
const switchOnDisabled = ref(false);
const isDialogVisibleVistaPreviaVideo = ref(false)
const iframeOptions = ref(null)

const isDialogActive = ref(false);
const accionForm = ref('');

const nombre = ref('');

const idVideo = ref('');
const timeVal = ref('');
const descripcionDesafio = ref('');
const statusDesafio = ref(true);
const tituloSticker = ref('');
const URLSticker = ref('');
const desafioModel = ref('');
const tipoEvaluacion = ref('');

const idToEdit = ref('');

const desafioItems = ref([]);

const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false
});

const tipoEvaluacionItems = [{
  title: "Definir un tiempo",
  value: "time"
}, {
  title: "Ver todo el video",
  value: "full"
}]

onMounted(async () => {
  await getDesafioVideos();
  await getDesafio();
})

async function getDesafioVideos(page = 1, limit = 10) {
  try {
    currentPage.value = 1;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    var response = await fetch(`https://servicio-niveles-puntuacion.vercel.app/desafio-video-historico/all?limit=20000&page=1`, requestOptions);
    const data = await response.json();

    dataDesafio.value = data.data;

    totalRegistros.value = Math.ceil(data.total / data.limit);
  } catch (error) {
    return console.error(error.message);
  }
}

async function getDesafio(page = 1, limit = 10) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    var response = await fetch(`https://servicio-desafios.vercel.app/desafios`, requestOptions);
    const data = await response.json();

    desafioItems.value = data.data.reduce((acumulador, actual) => {
      acumulador.push({
        title: `${actual.tituloDesafio}`,
        value: actual._id,
      });
      return acumulador;
    }, [])

    // dataDesafio.value = data.data;
  } catch (error) {
    return console.error(error.message);
  }
}

// Funciones para manejar el cambio de paginación
const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedDesafios = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataDesafio.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataDesafio.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Función para manejar el cambio de paginación
/*
const eliminarRegistro = async (id) => {
  isDialogVisibleDelete.value = true;
  idDesafio.value = id;
  // console.log(id)
};

const eliminarRegistroSi = async () => {
  try {
      isDialogVisibleDelete.value = false;
      disabledViewList.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-desafios.vercel.app/desafios/${idDesafio.value}`, requestOptions);
      const data = await response.json();

      disabledViewList.value = false;
      await getDesafioVideos(currentPage.value);

  } catch (error) {
      return console.error(error.message);    
  }
};
*/

const handleSwitchChange = async (index) => {
  const desafio = dataDesafio.value[index];

  const id = desafio._id;
  const estado = desafio.statusDesafio;
  switchOnDisabled.value = true;
  var jsonEnviar = {
    statusDesafio: estado
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(jsonEnviar),
    redirect: 'follow'
  };

  var response = await fetch(`https://servicio-desafios.vercel.app/desafios/${id}`, requestOptions);
  const data = await response.json();
  if (data.resp) {
    // alert("Desafío editado correctamente");
  } else {
    alert("Un error se presentó: " + data.error);
    desafio.statusDesafio = !desafio.statusDesafio;
  };
  switchOnDisabled.value = false;
  // Realiza las operaciones necesarias con el ID y el estado
};

//FUNCIONES FORM
function resetForm() {
  idToEdit.value = "";
  idVideo.value = "";
  timeVal.value = "";
  desafioModel.value = "";
  tipoEvaluacion.value = "time";

}
function closeDiag() {
  resetForm();
  isDialogActive.value = false;
}

//ADD
async function onAdd() {
  resetForm();
  accionForm.value = 'add';
  isDialogActive.value = true;
}

//EDIT
async function onEdit(id) {
  resetForm();
  accionForm.value = 'edit';
  const consulta = await fetch('https://servicio-niveles-puntuacion.vercel.app/desafio-video-historico/get/' + id);
  const consultaJson = await consulta.json();
  const data = consultaJson.data[0];
  //console.log(paquete);
  idToEdit.value = data._id;
  idVideo.value = data.idVideo;
  timeVal.value = data.timeVal;
  desafioModel.value = data.idDesafio;
  tipoEvaluacion.value = data.tipoEval;
  isDialogActive.value = true;
}

//SEND

async function onComplete() {
  if (
    !desafioModel.value ||
    !idVideo.value
  ) {
    configSnackbar.value = {
      message: "Llenar todos los campos para crear el desafío",
      type: "error",
      model: true
    };
    return false;
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (accionForm.value === 'add') {
    let jsonEnviar = {
      "idVideo": idVideo.value,
      "timeVal": timeVal.value,
      "idDesafio": desafioModel.value,
      "tipoEval": tipoEvaluacion.value
    }
    var raw = JSON.stringify(jsonEnviar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const send = await fetch('https://servicio-niveles-puntuacion.vercel.app/desafio-video-historico/create', requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
      configSnackbar.value = {
        message: "Video desafío creada correctamente",
        type: "success",
        model: true
      };

    } else {
      configSnackbar.value = {
        message: respuesta.mensaje,
        type: "error",
        model: true
      };
      console.error(respuesta.error);
      return false;
    }
  } else if (accionForm.value === 'edit') {
    let jsonEnviar = {
      "idVideo": idVideo.value,
      "timeVal": timeVal.value,
      "idDesafio": desafioModel.value,
      "tipoEval": tipoEvaluacion.value
    }
    var raw = JSON.stringify(jsonEnviar);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    const send = await fetch('https://servicio-niveles-puntuacion.vercel.app/desafio-video-historico/update/' + idToEdit.value, requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
      configSnackbar.value = {
        message: "Video desafío actualizado correctamente",
        type: "success",
        model: true
      };

    } else {
      configSnackbar.value = {
        message: respuesta.mensaje,
        type: "error",
        model: true
      };
      console.error(respuesta.error);
      return false;

    }
  }
  await getDesafioVideos();
  isDialogActive.value = false;
}

// DELETE

const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

function onDelete(id) {
  isDialogVisibleDelete.value = true;
  idToDelete.value = id;
}

function onView(data) {
  iframeOptions.value = {
    _id: data._id,
    idVideo: data.idVideo,
    urlContent: data.urlContent,
  };
  isDialogVisibleVistaPreviaVideo.value = true;
}

async function deleteConfirmed() {
  var requestOptions = {
    method: 'DELETE',
    redirect: 'follow'
  };

  const deleted = await fetch('https://servicio-niveles-puntuacion.vercel.app/desafio-video-historico/delete/' + idToDelete.value, requestOptions);
  const respuesta = await deleted.json();
  if (respuesta.resp) {
    configSnackbar.value = {
      message: "Desafío eliminado correctamente",
      type: "success",
      model: true
    };
  } else {
    configSnackbar.value = {
      message: respuesta.mensaje,
      type: "error",
      model: true
    };
  }
  await getDesafioVideos();
  isDialogVisibleDelete.value = false;
}

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat"
      :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>

    <VDialog v-model="isDialogVisibleVistaPreviaVideo" width="500">
      <!-- Activator -->
      <template #activator="{ props }">
        <!-- <VBtn v-bind="props">
          Click Me
        </VBtn> -->
      </template>

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleVistaPreviaVideo = !isDialogVisibleVistaPreviaVideo" />

      <!-- Dialog Content -->
      <VCard :title="iframeOptions.idVideo">
        <iframe class="mt-3" :title="'Video ' + iframeOptions.idVideo" width="100%" height="300"
          :src="iframeOptions.urlContent"></iframe>

        <VCardText class="d-flex justify-end">
          <VBtn @click="isDialogVisibleVistaPreviaVideo = false">
            Aceptar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog v-model="isDialogVisibleDelete" persistent class="v-dialog-sm">

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn color="secondary" variant="tonal" @click="isDialogVisibleDelete = false">
            No, cerrar
          </VBtn>
          <VBtn @click="deleteConfirmed">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VRow>
      <VCol class="mt-0" cols="12" md="12" lg="12">


      
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
        


                <!-- inicio lista de Módulos -->

                <div class="px-0">
                  <VBtn color="primary" class="mb-4" @click="onAdd">
                    Crear registro
                    <VIcon :size="22" icon="tabler-plus" />
                  </VBtn>
                  <VList lines="two" border v-if="dataDesafio.length < 1">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  <VList lines="two" border v-if="dataDesafio.length > 0">
                    <template v-for="(desafio, index) of paginatedDesafios" :key="index">
                      <VListItem :disabled="disabledViewList">
                        <VListItemTitle>
                          <div class="nombre-desafio d-flex flex-column">
                            <small>Desafío</small>
                            <label>{{ desafio.desafio[0].tituloDesafio }}</label>
                            <div class="content-items d-flex">
                              <div class="content-video">
                                <VIcon size="20" icon="tabler-video" />
                                <a class="pl-2" target="_blank" :href="desafio.urlContent">{{ desafio.idVideo }}</a>
                              </div>
                              <div class="content-time pl-3">
                                <VIcon size="20" icon="tabler-clock" />
                                <label v-if="desafio.tipoEval != 'full'">
                                  <b>Permanencia: </b> {{ desafio.timeVal }} min
                                </label>
                                <label v-else>
                                  Ver todo el video
                                </label>
                              </div>
                            </div>
                          </div>
                        </VListItemTitle>

                        <template #append>
                          <div class="espacio-right-2">
                            <VBtn title="Ver vista previa del video" icon size="x-small" color="warning" variant="text"
                              @click="onView(desafio)">
                              <VIcon size="22" icon="tabler-movie" />
                            </VBtn>

                            <VBtn title="Editar registro" color="success" variant="text" icon
                              @click="onEdit(desafio._id)">
                              <VIcon size="22" icon="tabler-edit" />
                            </VBtn>

                            <VBtn title="Eliminar el registro" icon size="x-small" color="error" variant="text"
                              @click="onDelete(desafio._id)">
                              <VIcon size="22" icon="tabler-trash" />
                            </VBtn>

                            <VBtn icon variant="text" color="default" size="x-small"
                              :to="{ name: 'apps-reglasYDesafios-GestionVideosHistoricos-view-id', params: { id: desafio._id } }">
                              <VIcon :size="22" icon="tabler-eye" />
                            </VBtn>
                          </div>
                        </template>
                      </VListItem>
                      <VDivider v-if="index !== dataDesafio.length - 1" />
                    </template>
                  </VList>

                  <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                    Página {{ currentPage }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                      :disabled="(currentPage * itemsPerPage) >= dataDesafio.length">
                    </VBtn>
                  </div>
                </div>
                <!-- fin lista usuarios -->

                <VDialog v-model="isDialogActive" persistent no-click-animation max-width="800">

                  <!-- Dialog close btn -->
                  <DialogCloseBtn @click="closeDiag" />

                  <VCard class="pa-sm-14 pa-5">
                    <VCardItem class="text-center">
                      <VCardTitle class="text-h5 mb-3">
                        {{ accionForm === "add" || accionForm === "duplicate" ? "Crear registro" : "Editar " + nombre }}
                      </VCardTitle>
                    </VCardItem>

                    <VCardText>

                      <!-- 👉 Form -->
                      <VForm class="mt-6" @submit.prevent="onComplete">
                        <VRow class="d-flex flex-wrap justify-center gap-4">
                          <VRow>

                            <VCol cols="12">
                              <v-select v-model="desafioModel" :items="desafioItems"
                                label="Seleccione el desafío vinculado">
                                <template #selection="{ item }">
                                  <div>
                                    {{ item.title }} - {{ item.value }}
                                  </div>
                                </template>
                                <template #item="{ item, props }">
                                  <v-list-item v-bind="props">
                                    <v-list-item-content>
                                      <v-list-item-subtitle>
                                        <p>_id: {{ item.value }}</p>
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-list-item>
                                </template>
                              </v-select>
                            </VCol>

                            <VCol cols="12">
                              <VTextField v-model="idVideo" label="Id del video de RUDO" />
                            </VCol>

                            <VCol cols="12">
                              <VSelect item-text="title" item-value="value" v-model="tipoEvaluacion"
                                :items="tipoEvaluacionItems" label="Tipo de evaluación" />
                            </VCol>

                            <VCol cols="12" v-if="tipoEvaluacion != 'full'">
                              <VTextField v-model="timeVal" label="Tiempo en minutos de vista para el video"
                                type="number" />
                            </VCol>

                          </VRow>
                          <!-- 👉 Submit and Cancel -->
                          <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                            <VBtn type="submit"> Guardar </VBtn>
                            <VBtn color="secondary" variant="tonal" @click="closeDiag">
                              Cancelar
                            </VBtn>
                          </VCol>
                        </VRow>
                      </VForm>
                    </VCardText>
                  </VCard>
                </VDialog>
              </VWindowItem>
            </VWindow>
       
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.flat-picker-custom-style {
  position: sticky;
}

.flatpickr-calendar {
  position: fixed;
  top: 0;
}

.flatpickr-calendar.open {
  z-index: 10000;
}
</style>

<style scoped>
.loading {
  border: 2px solid #7367F0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border-right-color: transparent;
  animation: rot 1s linear infinite;
}

@keyframes rot {
  100% {
    transform: rotate(360deg);
  }
}

.v-card.v-theme--dark .iframe-dark {
  display: block;
}

.v-card.v-theme--dark .iframe-light {
  display: none;
}

.v-card.v-theme--light .iframe-dark {
  display: none;
}

.v-card.v-theme--light .iframe-light {
  display: block;
}

.column-width {
  max-width: 200px;
  min-width: 120px;
  text-align: left;
}

.nombre-campania,
.espacio-right-2 {
  gap: 10px;
  display: flex;
  align-items: center;
}

.v-avatar {
  border-radius: initial !important;
}

.ava {
  margin-inline-end: 16px;
}

.paginador-campaign {
  display: flex;
}

.custom-vswitch {
  transform: scale(0.55);
  /* Ajusta el valor según tus necesidades */
  transform-origin: left center;
}

.switch-estatus {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  padding-left: 5px;
}
</style>
