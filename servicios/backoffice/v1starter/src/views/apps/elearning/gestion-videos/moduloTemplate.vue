<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);


const categoriaModelLoading = ref(false);
const etiquetasModelLoading = ref(false);

const currentTab = ref('tab-lista');
const disabledText = ref(true);
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
const thumbnailModel = ref("https://estadisticas.ecuavisa.com/sites/gestor/Recursos/ecuavisa.com.jpg");

const idToEdit = ref('');

const props = defineProps({
  action: String,
  idVideo: String
});

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const etiquetasItems = ref([]);

const categoriasItems = ref([]);

const emit = defineEmits([
  'get:eventModalCR',
])

onMounted(async ()=>{
  await getEtiquetas();
  await getCategorias();
  if(props.action == "add"){
    await onAdd();
  }else{
    await onEdit(props.idVideo)
  }
  disabledText.value = false;
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

      var response = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/elearning/etiqueta/listar.php`, requestOptions);
      const data = await response.json();
      etiquetasItems.value = data;
      etiquetasModelLoading.value = false;
      
  } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar las etiquetas, recargue de nuevo.",
          type: "error",
          model: true
      };
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

      var response = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/elearning/categoria/listar.php`, requestOptions);
      const data = await response.json();
      categoriasItems.value = data;
      categoriaModelLoading.value = false;
      
  } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar las categorías, recargue de nuevo.",
          type: "error",
          model: true
      };
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
      configSnackbar.value = {
          message: "No se pudo recuperar los videos, recargue de nuevo.",
          type: "error",
          model: true
      };
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

//FUNCIONES FORM
function resetForm(){
    idToEdit.value = "";
    tituloModel.value = "";
    idRudoModel.value = "";
    duracionModel.value = "";
    descripcionModel.value = "";
    thumbnailModel.value = "https://estadisticas.ecuavisa.com/sites/gestor/Recursos/ecuavisa.com.jpg";
    duracionModel.value = "";
    etiquetasModel.value = "";
    categoriaModel.value = "";
  
}
function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
    nextTick(() => {
        emit('get:eventModalCR', {
          modalShow:false,
          action:"modal"
        })
    })
}

//ADD
async function onAdd(){     
    resetForm(); 
    accionForm.value = 'add';
    isDialogActive.value = true;
}

//EDIT
async function onEdit(id){
    try{
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
      // thumbnailModel.value = data.thumbnail;
      thumbnailModel.value = "https://estadisticas.ecuavisa.com/sites/gestor/Recursos/ecuavisa.com.jpg";
      etiquetasModel.value = data.etiquetas;
      categoriaModel.value = data.categoria;

      isDialogActive.value = true;  
    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los datos para editar, recargue de nuevo.",
          type: "error",
          model: true
      };
      return console.error(error.message);    
    }
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
    disabledText.value = true;
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

      isDialogActive.value = false;
      disabledText.value = false;

      nextTick(() => {
          emit('get:eventModalCR', {
            modalShow:false,
            id: respuesta.id,
            action:"add"
          })
      })
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
            nextTick(() => {
                emit('get:eventModalCR', {
                  modalShow:false,
                  data: respuesta,
                  action:"edit"
                })
            })    
        } else {
            configSnackbar.value = {
                message: respuesta.mensaje,
                type: "error",
                model: true
            };
            console.error(respuesta.error);
        }
    }
    // await getDesafioVideos();
    // await getEtiquetas();
    // await getCategorias();
    isDialogActive.value = false;
    return false;
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
}

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 4000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>

    <VDialog
      v-model="isDialogVisibleVistaPreviaVideo"
      width="500"
      persistent
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
          <VBtn @click="deleteConfirmed">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VRow>
      <VCol cols="12" md="12"  lg="12" >
          <div style="height: 300px;" class="d-flex align-center" v-if="disabledText">
            <VCard width="300" class="mx-auto mt-5 mb-5" color="primary">
              <VCardText 
                class="pt-3"
              >
                Cargando datos... espere
                <VProgressLinear
                  indeterminate
                  color="white"
                  class="mb-0"
                />
              </VCardText>
            </VCard>
          </div>
         <VCard v-else class="px-2 py-2">
            <VCardItem class="text-center">
                <VCardTitle class="text-h5 mb-3">
                    {{ accionForm === "add" || accionForm === "duplicate" ? "Crear video" : "Editar video" + nombre }}
                </VCardTitle>
            </VCardItem>

            <VCardText>
                <div class="px-4">
                  <!-- 👉 Form -->
                  <VForm class="mt-6" @submit.prevent="onComplete">
                    <VRow class="">
                        <VRow>
                            <VCol cols="6">
                              <VTextField :disabled="disabledText" v-model="tituloModel" label="Título del video" />
                            </VCol>

                            <VCol cols="6">
                              <VTextField :disabled="disabledText" v-model="descripcionModel" label="Descripción" />
                            </VCol>
                            
                            <!-- <VCol cols="6">
                              <VTextField :disabled="disabledText" v-model="thumbnailModel" label="Imagen principal" />
                            </VCol> -->

                            <VCol cols="12" >
                                <VTextField :disabled="disabledText" v-model="idRudoModel" label="Id video de RUDO" />
                            </VCol>

                            <VCol cols="12">
                              <VTextField :disabled="disabledText" v-model="duracionModel" label="Tiempo en minutos del video" suffix="minutos" append-inner-icon="tabler-clock" type="number" />
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
                            <VBtn type="submit" :disabled="disabledText"> Guardar </VBtn>
                            <VBtn color="secondary" :disabled="disabledText" variant="tonal" @click="closeDiag">
                                Cancelar
                            </VBtn>
                        </VCol>
                    </VRow>
                </VForm>
                </div>
                
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
