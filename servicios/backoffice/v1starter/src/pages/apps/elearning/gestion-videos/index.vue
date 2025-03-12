<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);


const categoriaModelLoading = ref(false);
const etiquetasModelLoading = ref(false);

const eliminarDisabled = ref(false);

const currentTab = ref('tab-lista');
const checkbox = ref(1);
const dataVideoList = ref([]);
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

const idRudoModel = ref('');
const duracionModel = ref('');
const descripcionDesafio = ref('');
const statusDesafio = ref(true);
const tituloSticker = ref('');
const URLSticker = ref('');
const categoriaModel = ref('');
const etiquetasModel = ref('');

const tituloModel = ref(null);
const descripcionModel = ref(null);
const thumbnailModel = ref("https://micuenta.ecuavisa.com/Recursos/ecuavisa.com.jpg");

const idToEdit = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const etiquetasItems = ref([]);

const categoriasItems = ref([]);

onMounted(async ()=>{
  await getEtiquetas();
  await getCategorias();
  await getDesafioVideos();
})

async function getEtiquetas(page = 1, limit= 10){
  try {
      etiquetasModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://micuenta.ecuavisa.com/elearning/etiqueta/listar.php`, requestOptions);
      const data = await response.json();
      etiquetasItems.value = data;
      etiquetasModelLoading.value = false;
      
  } catch (error) {
      return console.error(error.message);    
  }
}

async function getCategorias(page = 1, limit= 10){
  try {

      categoriaModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://micuenta.ecuavisa.com/elearning/categoria/listar.php`, requestOptions);
      const data = await response.json();
      categoriasItems.value = data;
      categoriaModelLoading.value = false;
      
  } catch (error) {
      return console.error(error.message);    
  }
}

async function getDesafioVideos(page = 1, limit= 10){
  try {
      currentPage.value = 1;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/video/all?limit=200&page=1`, requestOptions);
      const data = await response.json();

      dataVideoList.value = data.data;
      
      totalRegistros.value = Math.ceil(data.total / data.limit);
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

  return dataVideoList.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataVideoList.value.length) currentPage.value++;
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
  const desafio = dataVideoList.value[index];
  
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
  if(data.resp){
    // alert("Desafío editado correctamente");
  }else{
    alert("Un error se presentó: "+data.error);
    desafio.statusDesafio = !desafio.statusDesafio;
  };
  switchOnDisabled.value = false;
  // Realiza las operaciones necesarias con el ID y el estado
};

//FUNCIONES FORM
function resetForm(){
    idToEdit.value = "";
    tituloModel.value = "";
    idRudoModel.value = "";
    duracionModel.value = "";
    descripcionModel.value = "";
    thumbnailModel.value = "https://micuenta.ecuavisa.com/Recursos/ecuavisa.com.jpg";
    duracionModel.value = "";
    etiquetasModel.value = "";
    categoriaModel.value = "";
  
}
function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}

//ADD
async function onAdd(){     
    resetForm(); 
    accionForm.value = 'add';
    isDialogActive.value = true;
}

//EDIT
async function onEdit(id){
    resetForm();     
    accionForm.value = 'edit';
    const consulta = await fetch('https://servicio-elearning.vercel.app/video/get/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;

    idToEdit.value = data._id;

    tituloModel.value = data.titulo;
    idRudoModel.value = data.idRudo;
    duracionModel.value = data.duracion;
    descripcionModel.value = data.descripcion;
    thumbnailModel.value = "https://micuenta.ecuavisa.com/Recursos/ecuavisa.com.jpg";
    // thumbnailModel.value = data.thumbnail;
    etiquetasModel.value = data.etiquetas;
    categoriaModel.value = data.categoria;

    isDialogActive.value = true;  
}

//SEND

async function onComplete(){
  if (
        !categoriaModel.value || 
        !idRudoModel.value || 
        !descripcionModel.value || 
        !thumbnailModel.value || 
        !duracionModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos para crear el registro",
            type: "error",
            model: true
        };
        return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {
      let jsonEnviar = {
          "titulo": tituloModel.value,
          "descripcion": descripcionModel.value,
          "idRudo": idRudoModel.value,
          "thumbnail": thumbnailModel.value,
          "duracion": duracionModel.value,
          "categoria": categoriaModel.value,
          "etiquetas": etiquetasModel.value
      }
      var raw = JSON.stringify(jsonEnviar);

      var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
      };

      const send = await fetch('https://servicio-elearning.vercel.app/video/create', requestOptions);
      const respuesta = await send.json();
      if (respuesta.resp) {
        configSnackbar.value = {
            message: "Registro creado correctamente",
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
    }else if(accionForm.value === 'edit'){
        let jsonEnviar = {
          "titulo": tituloModel.value,
          "descripcion": descripcionModel.value,
          "idRudo": idRudoModel.value,
          "thumbnail": thumbnailModel.value,
          "duracion": duracionModel.value,
          "categoria": categoriaModel.value,
          "etiquetas": etiquetasModel.value
        }
        var raw = JSON.stringify(jsonEnviar);
        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
        };
        const send = await fetch('https://servicio-elearning.vercel.app/video/update/' + idToEdit.value, requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
                configSnackbar.value = {
                    message: "Registro actualizado correctamente",
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
    await getEtiquetas();
    await getCategorias();
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
      _id:data._id,
      idRudoModel: data.idRudo,
      urlContent: data.url,
    };
    isDialogVisibleVistaPreviaVideo.value = true;
}

async function deleteConfirmed() {
    eliminarDisabled.value = true;
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://servicio-elearning.vercel.app/video/delete/' + idToDelete.value, requestOptions);
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
    eliminarDisabled.value = false;
}

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>

    <VDialog
      v-model="isDialogVisibleVistaPreviaVideo"
      width="500"
    >
      <!-- Activator -->
      <template #activator="{ props }">
        <!-- <VBtn v-bind="props">
          Click Me
        </VBtn> -->
      </template>

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleVistaPreviaVideo = !isDialogVisibleVistaPreviaVideo" />

      <!-- Dialog Content -->
      <VCard :title="iframeOptions.idRudoModel">
        <iframe
          class="mt-3"
          :title="'Video '+ iframeOptions.idRudoModel"
          width="100%"
          height="300"
          :src="iframeOptions.urlContent"
        ></iframe>

        <VCardText class="d-flex justify-end">
          <VBtn @click="isDialogVisibleVistaPreviaVideo = false">
            Aceptar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    
    <VDialog
      v-model="isDialogVisibleDelete"
      persistent
      class="v-dialog-sm"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisibleDelete = false"
          >
            No, cerrar
          </VBtn>
          <VBtn :disabled="eliminarDisabled" @click="deleteConfirmed">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
    

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div
                  class="d-flex flex-wrap py-4 gap-4 align-items-center"
                  style="justify-content: space-between;"
                >
                  <div>
                    <VCardTitle>
                      Listado de videos educativos
                    </VCardTitle>
                    <VCardSubtitle> Mantenimiento de videos que se enlazan con Desafíos </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <VBtn color="primary" class="mb-4" @click="onAdd">
                    Crear registro
                    <VIcon
                      :size="22"
                      icon="tabler-plus"
                    />
                  </VBtn>
                  <VList lines="two" border v-if="dataVideoList.length < 1">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  <VList lines="two" border  v-if="dataVideoList.length > 0">
                  <template
                    v-for="(video, index) of paginatedDesafios"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <div class="nombre-desafio d-flex flex-column">
                          <div class="d-flex">
                            <small>Video</small>
                            <small class="text-disabled"><code class="p-0"><b>_id:</b>{{ video._id }}</code></small>
                          </div>
                          <label>{{ video.titulo }}</label>
                          <span class="text-xs text-disabled">{{ video.descripcion }}</span>
                          <div class="content-items d-flex">
                            <div class="content-video">
                              <VIcon
                                size="20"
                                icon="tabler-video"
                              />
                              <a class="pl-2" target="_blank" :href="video.url">{{ video.idRudo }}</a>
                            </div>
                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="tabler-clock"
                              />
                              <b>Duración: </b> {{ video.duracion }} min
                            </div>

                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="mdi-animation"
                              />
                              <b>Categoría: </b> {{ video.categoria }}
                            </div>

                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="mdi-thumb-up-outline"
                              />
                              {{ video.likes }}
                            </div>

                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="mdi-thumb-down-outline"
                              />
                              {{ video.dislikes }}
                            </div>
                          </div>
                        </div>
                      </VListItemTitle>

                      <template #append>
                        <div class="espacio-right-2">
                          <VBtn
                            title="Ver vista previa del video"
                            icon
                            size="x-small"
                            color="warning"
                            variant="text"
                            @click="onView(video)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-movie"
                            />
                          </VBtn>

                          <VBtn 
                            title="Editar registro" color="success" variant="text" icon  @click="onEdit(video._id)">
                            <VIcon size="22" icon="tabler-edit" />
                          </VBtn>

                          <VBtn
                            title="Eliminar el registro"
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="onDelete(video._id)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-trash"
                            />
                          </VBtn>

                          <VBtn
                            icon
                            variant="text"
                            color="default"
                            size="x-small"
                            :to="{ name: 'apps-elearning-gestion-videos-view-id', params: { id: video._id } }"
                          >
                            <VIcon
                              :size="22"
                              icon="tabler-eye"
                            />
                          </VBtn>
                        </div>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== paginatedDesafios.length - 1" />
                  </template>
                </VList>
                
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                    Página {{ currentPage }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                        :disabled="(currentPage * itemsPerPage) >= dataVideoList.length">
                    </VBtn>
                </div>
                </div>
                <!-- fin lista usuarios -->

                <VDialog v-model="isDialogActive" persistent no-click-animation max-width="800">

                  <!-- Dialog close btn -->
                  <DialogCloseBtn @click="closeDiag" />

                  <VCard  class="pa-sm-14 pa-5">
                      <VCardItem class="text-center">
                          <VCardTitle class="text-h5 mb-3">
                              {{ accionForm === "add" || accionForm === "duplicate" ? "Crear registro" : "Editar " + nombre }}
                          </VCardTitle>
                      </VCardItem>

                      <VCardText>

                          <!-- 👉 Form -->
                          <VForm class="mt-6" @submit.prevent="onComplete">
                              <VRow class="">
                                  <VRow>
                                      <VCol cols="6">
                                        <VTextField v-model="tituloModel" label="Título del video" />
                                      </VCol>

                                      <VCol cols="6">
                                        <VTextField v-model="descripcionModel" label="Descripción" />
                                      </VCol>
                                      
                                      <!-- <VCol cols="12">
                                        <VTextField v-model="thumbnailModel" label="Imagen principal" />
                                      </VCol> -->

                                      <VCol cols="12" >
                                          <VTextField v-model="idRudoModel" label="Id video de RUDO" />
                                      </VCol>

                                      <VCol cols="12">
                                        <VTextField v-model="duracionModel" label="Tiempo en minutos del video" suffix="minutos" append-inner-icon="tabler-clock" type="number" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VCombobox 
                                          v-model="categoriaModel" 
                                          :items="categoriasItems" 
                                          chips
                                          label="Seleccione la categoría del video"
                                          :menu-props="{ maxHeight: '300' }" 
                                          @keydown.enter.prevent="categoriaModel"
                                          :disabled="categoriaModelLoading"
                                          append-icon="mdi-refresh"
                                          @click:append="getCategorias"
                                          />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VCombobox 
                                            item-text="title"
                                            item-value="value"
                                            v-model="etiquetasModel" 
                                            :items="etiquetasItems"
                                            chips
                                            multiple
                                            label="Etiquetas"
                                            :menu-props="{ maxHeight: '300' }"
                                            :disabled="etiquetasModelLoading"
                                            append-icon="mdi-refresh"
                                            @click:append="getEtiquetas" />
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
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">

.flat-picker-custom-style {
  position: sticky;
}

.flatpickr-calendar{
  position: fixed;
  top: 0; 
}

.flatpickr-calendar.open {     
  z-index: 10000;
}
</style>

<style scoped> 
 
  .loading{
    border:2px solid #7367F0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border-right-color: transparent;
    animation: rot 1s linear infinite;
  }

  @keyframes rot {
    100%{
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

.paginador-campaign{
  display: flex;
}

.custom-vswitch  {
  transform: scale(0.55); /* Ajusta el valor según tus necesidades */
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
