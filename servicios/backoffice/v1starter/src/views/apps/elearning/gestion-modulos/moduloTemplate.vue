<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const currentTab = ref('tab-lista');
const checkbox = ref(1);
const dataVideoList = ref([]);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const idCampaign = ref("");
const disabledPagination = ref(false);
const disabledText = ref(true);
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
const videosModel = ref(null);

const tituloModel = ref(null);
const videosSelectList = ref([]);
const descripcionModel = ref(null);
const thumbnailModel = ref(null);

const idToEdit = ref('');

const emit = defineEmits([
  'get:eventModalCR',
])

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});
const videosItems = ref([]);

onMounted(async ()=>{
  await getVideos();
  onAdd();
  disabledText.value = false;
});

async function getVideos(page = 1, limit= 10){
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

      videosItems.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);
      
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

//FUNCIONES FORM
function resetForm(){
    idToEdit.value = "";
    tituloModel.value = "";
    idRudoModel.value = "";
    duracionModel.value = "";
    descripcionModel.value = "";
    thumbnailModel.value = "";
    duracionModel.value = "";
    videosModel.value = null;
    categoriaModel.value = "";
    videosSelectList.value = [];
  
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


function filtrarDesafios(listaDesafios, elementos) {
    const valoresDesafiosFiltrados = listaDesafios
        .filter(desafio => elementos.includes(desafio.value))
        .map(desafio => desafio.value);
    return valoresDesafiosFiltrados;
}

function obtenerListaOrdenada(listaA, listaB) {
    // Ordenar listaB por posición
    listaB.sort((a, b) => a.posicion - b.posicion);

    // Crear una lista vacía para almacenar el resultado
    let resultado = [];

    // Iterar sobre cada elemento de listaB
    for (let i = 0; i < listaB.length; i++) {
        // Encontrar el elemento correspondiente en listaA utilizando el _id
        let elementoListaA = listaA.find(item => item === listaB[i]._id);

        // Si se encuentra el elemento en listaA
        if (elementoListaA) {
            // Crear un nuevo objeto con el formato deseado y agregarlo a la lista resultado
            resultado.push({ title: listaB[i].titulo, value: elementoListaA });
        }
    }

    // Devolver la lista resultado
    return resultado;
}

//SEND

async function onComplete(){
  try{
      if ( !tituloModel.value ||  !descripcionModel.value ||  !videosModel.value  ){
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
            "videos": obtenerValorYPosicion()
        }
        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
        };

        const send = await fetch('https://servicio-elearning.vercel.app/modulo/create', requestOptions);
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
      }
  } catch (error) {
      configSnackbar.value = {
          message: error.message,
          type: "error",
          model: true
      };
      return console.error(error.message);    
  }
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
      urlContent: data.urlRudo,
    };
    isDialogVisibleVistaPreviaVideo.value = true;
}

// Función para inicializar la lista de videos seleccionados
function inicializarVideosSelectList() {
    const videosItemsLocal = videosItems.value;
    const videosItemsID = videosModel.value;
    if (videosItemsID) {
        //Si se selecciona nuevos elementos del select
        if(videosSelectList.value.length < videosItemsID.length){
          for(var j in videosItemsLocal){
            if(videosItemsID[videosItemsID.length - 1] == videosItemsLocal[j].value){
              videosSelectList.value.push(videosItemsLocal[j]);
            }
          }
        }

        //Si se elimina elementos del select
        if(videosSelectList.value.length > videosItemsID.length){
          // Filtrar los elementos de videosSelectList.value que no están presentes en listaB
          const elementosFaltantes = videosSelectList.value.filter(itemA => !videosItemsID.includes(itemA.value));

          for(var i in elementosFaltantes){
            for(var j in videosSelectList.value){
              if(elementosFaltantes[i].value == videosSelectList.value[j].value){
                videosSelectList.value.splice(j, 1); // Eliminar el elemento en la posición j
                break; // Salir del bucle una vez que se elimina el elemento
              }
            }
          }
        }
    }
}

watch(async () => videosModel.value, async () => {
  if(videosModel.value){
    inicializarVideosSelectList()
  }
});

function obtenerValorYPosicion() {
    const lista = videosSelectList.value;
    // Crear un nuevo array para almacenar los objetos con el valor y la posición
    const resultado = [];
    // Iterar sobre la lista y agregar cada elemento al resultado con su valor y posición
    lista.forEach((item, index) => {
        resultado.push({ value: item.value, posicion: index });
    });
    // Devolver el array de objetos con el valor y la posición de cada elemento
    return resultado;
}

function cambiarPosicion(valor, direccion) {
    const lista = videosSelectList.value;
    // Buscar el índice del elemento con el valor especificado
    const index = lista.findIndex(item => item.value === valor);
    // Si no se encuentra el valor en la lista, salir de la función
    if (index === -1) {
        console.log("El valor especificado no se encontró en la lista.");
        return;
    }

    // Si la dirección es "arriba" y el elemento no está en la primera posición, intercambiarlo con el elemento anterior
    if (direccion === "arriba" && index > 0) {
        [lista[index], lista[index - 1]] = [lista[index - 1], lista[index]];
    } 
    // Si la dirección es "abajo" y el elemento no está en la última posición, intercambiarlo con el elemento siguiente
    else if (direccion === "abajo" && index < lista.length - 1) {
        [lista[index], lista[index + 1]] = [lista[index + 1], lista[index]];
    }
    // Si la dirección es inválida, mostrar un mensaje de error
    else {
        console.log("La dirección especificada es inválida o el elemento está en el extremo de la lista.");
        return;
    }
}


</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>

    <VRow>
      <VCol
        class="m-0 p-0"
        cols="12"
        md="12"
        lg="12"
      >
        <VCard  class="px-5 py-4">
            <VCardItem class="text-center">
                <VCardTitle class="text-h5 mb-3">
                    Crear módulo
                </VCardTitle>
            </VCardItem>
            <VCardText>
                <!-- 👉 Form -->
                <VForm class="mt-6" @submit.prevent="onComplete">
                    <VRow class="">
                        <VRow>
                            <VCol cols="6">
                              <VTextField :disabled="disabledText" v-model="tituloModel" label="Título del modulo" />
                            </VCol>

                            <VCol cols="6">
                              <VTextField :disabled="disabledText" v-model="descripcionModel" label="Descripción" />
                            </VCol>
                            <VCol cols="12">
                                <VSelect
                                  :disabled="disabledText" 
                                  item-text="title"
                                  item-value="value"
                                  v-model="videosModel" 
                                  :items="videosItems"
                                  chips
                                  multiple
                                  label="Videos educativos">
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
                                </VSelect>
                            </VCol>
                            <VCol cols="12" v-if="videosModel">
                              <VList
                                lines="two"
                                border
                              >
                                <template
                                  v-for="(videoSelect, index) of videosSelectList"
                                  :key="videoSelect.value"
                                >
                                  <VListItem>
                                    <template #prepend>
                                      <VIcon
                                        :size="35"
                                        icon="mdi-file-video"
                                        color="success"
                                      />
                                    </template>
                                    <VListItemTitle>
                                      {{ videoSelect.title }}
                                    </VListItemTitle>
                                    <VListItemSubtitle class="mt-1">
                                      <VBadge
                                        dot
                                        location="start center"
                                        offset-x="2"
                                        color="success"
                                        class="me-3"
                                      >
                                        <span class="ms-4">Video</span>
                                      </VBadge>

                                      <span class="text-xs text-disabled">{{ videoSelect.value }}</span>
                                    </VListItemSubtitle>

                                    <template #append>
                                      <div class="btn-order" style="">
                                        <VBtn size="x-small" :disabled="index == 0" variant="text" @click="cambiarPosicion(videoSelect.value, 'arriba')">
                                          <VIcon :size="25" icon="mdi-arrow-up-bold-box" />
                                        </VBtn>
                                        <VBtn size="x-small" :disabled="index == videosSelectList.length - 1" variant="text" @click="cambiarPosicion(videoSelect.value, 'abajo')">
                                          <VIcon :size="25" icon="mdi-arrow-down-bold-box" />
                                        </VBtn>
                                      </div>
                                    </template>
                                  </VListItem>
                                  <VDivider v-if="index !== videosSelectList.length - 1" />
                                </template>
                              </VList>
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
  .btn-order {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
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
