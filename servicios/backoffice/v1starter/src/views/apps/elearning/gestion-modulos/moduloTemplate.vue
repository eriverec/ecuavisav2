<script setup>
import moduloTemplate from "@/views/apps/elearning/gestion-videos/moduloTemplate.vue";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);


const isDialogVisibleAddVideo = ref(false)
const isDialogVisibleEditVideo = ref(false)

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

const selectRefCuestionario = ref(null);
const cuestionarioModelLoading = ref(false);
const searchCuestionarioModel = ref(null)
const cuestionarioItemsCopy = ref([]);

const dataCuestionarioModel = ref([]);
const dataCuestionarioItems = ref([]);

const selectRefVideo = ref(null);
const videoModelLoading = ref(false);
const searchVideoModel = ref(null)
const videosItemsCopy = ref([]);

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

const defaultVideoBloqueado = false;

const idToEdit = ref('');

const emit = defineEmits([
  'get:eventModalCR',
])

const props = defineProps({
  action: String,
  idModulo: String
});

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});
const videosItems = ref([]);

onMounted(async ()=>{
  await getCuestionario();
  await getVideos();
  if(props.action == "add"){
    await onAdd();
  }else{
    await onEdit(props.idModulo)
  }

  disabledText.value = false;
});

async function getCuestionario(page = 1, limit= 10){
  try {
      cuestionarioModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://e-learning-cuestionario.vercel.app/cuestionarios/all/get`, requestOptions);
      const data = await response.json();

      dataCuestionarioItems.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);

      cuestionarioItemsCopy.value = dataCuestionarioItems.value;
      cuestionarioModelLoading.value = false;
      
  } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los cuestionarios, recargue de nuevo.",
          type: "error",
          model: true
      };
      return console.error(error.message);    
  }
}

async function getVideos(page = 1, limit= 10){
  try {
      videoModelLoading.value = true;
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
          bloqueado: actual.bloqueado || defaultVideoBloqueado,
        });
        return acumulador;
      }, []);
      
      videosItemsCopy.value = videosItems.value;
      videoModelLoading.value = false;
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
    dataCuestionarioModel.value = null;
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
    return true;
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
            resultado.push({ 
              title: listaB[i].titulo,
              bloqueado: listaB[i].hasOwnProperty("bloqueado")?listaB[i].bloqueado: defaultVideoBloqueado,
              value: elementoListaA 
            });
        }
    }

    // Devolver la lista resultado
    return resultado;
}
//EDIT
async function onEdit(id){
    try{
      resetForm();     
      accionForm.value = 'edit';
      const consulta = await fetch('https://servicio-elearning.vercel.app/modulo/get/' + id);
      const consultaJson = await consulta.json();
      const data = consultaJson.data;

      idToEdit.value = data._id;

      tituloModel.value = data.titulo;
      descripcionModel.value = data.descripcion;
      if(data.cuestionario){
        dataCuestionarioModel.value = data.cuestionario._id;
      }

      videosModel.value = filtrarDesafios(videosItems.value, data.videos.reduce((acumulador, actual) => {
          acumulador.push(actual._id);
          return acumulador;
        }, []));

      isDialogActive.value = true; 

      videosSelectList.value= obtenerListaOrdenada(videosModel.value, data.videos);

      return true;
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
            "idCuestionario": dataCuestionarioModel.value || null,
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

          nextTick(() => {
              emit('get:eventModalCR', {
                modalShow:false,
                id: respuesta.id,
                action:"add"
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
        isDialogActive.value = false;
        disabledText.value = false;
        return false;
      }else if(accionForm.value === 'edit'){
        let jsonEnviar = {
          "titulo": tituloModel.value,
          "descripcion": descripcionModel.value,
          "idCuestionario": dataCuestionarioModel.value || null,
          "videos": obtenerValorYPosicion()
        }
        var raw = JSON.stringify(jsonEnviar);
        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
        };
        const send = await fetch('https://servicio-elearning.vercel.app/modulo/update/' + idToEdit.value, requestOptions);
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

        isDialogActive.value = false;
        disabledText.value = false;

        // await getVideos();
        // await getEtiquetas();
        // await getCategorias();
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
        resultado.push({ 
          value: item.value, 
          posicion: index,
          bloqueado: item.bloqueado 
        });
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



watch(async () => searchVideoModel.value, async () => {
  if (!searchVideoModel.value) {
    videosItems.value = videosItemsCopy.value;
  }else{
    videosItems.value = videosItemsCopy.value.filter((video) => {
      return (video.title.toLowerCase().indexOf(searchVideoModel.value.toLowerCase()) > -1) || video.value.indexOf(searchVideoModel.value) > -1;
    });
  }
});

watch(selectRefVideo, (active) => {
  if(!active){
    setTimeout(()=>{
      searchVideoModel.value = "";
    }, 1000)
  }
});

//Cuestionario
watch(async () => searchCuestionarioModel.value, async () => {
  if (!searchCuestionarioModel.value) {
    dataCuestionarioItems.value = cuestionarioItemsCopy.value;
  }else{
    dataCuestionarioItems.value = cuestionarioItemsCopy.value.filter((video) => {
      return (video.title.toLowerCase().indexOf(searchCuestionarioModel.value.toLowerCase()) > -1) || video.value.indexOf(searchCuestionarioModel.value) > -1;
    });
  }
});

watch(selectRefCuestionario, (active) => {
  if(!active){
    setTimeout(()=>{
      searchCuestionarioModel.value = "";
    }, 1000)
  }
});

const receiveTime = async (data) => {
  if(data.action == "modal"){
    isDialogVisibleAddVideo.value = data.modalShow;
    isDialogVisibleEditVideo.value = data.modalShow;
  }

  if(data.action == "add"){
    await getVideos();
    isDialogVisibleAddVideo.value = data.modalShow;
    videosModel.value.push(data.id);
    inicializarVideosSelectList()
  }

  if(data.action == "edit"){
    await getVideos();
    isDialogVisibleEditVideo.value = data.modalShow;
    inicializarVideosSelectList()
  }
};

//Switch
const handleSwitchChange = async (video, index) => {
  const bloqueado = !videosSelectList.value[index].bloqueado;
  videosSelectList.value[index].bloqueado = bloqueado;
  console.log(videosSelectList.value[index])
};

const idVideoEdit = ref("");

const editarVideo = (video) => {
  idVideoEdit.value = video;
  isDialogVisibleEditVideo.value = true;
}

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 4000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>

    <VDialog
      v-model="isDialogVisibleEditVideo"
      width="600"
      persistent
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleEditVideo = !isDialogVisibleEditVideo" />

      <VCard>
        <!-- Dialog Content -->
        <moduloTemplate @get:eventModalCR="receiveTime" action="edit" :idVideo="idVideoEdit" />
      </VCard>
    </VDialog>

    <VDialog
      v-model="isDialogVisibleAddVideo"
      width="600"
      persistent
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleAddVideo = !isDialogVisibleAddVideo" />

      <VCard>
        <!-- Dialog Content -->
        <moduloTemplate @get:eventModalCR="receiveTime" action="add" />
      </VCard>
    </VDialog>

    <VRow>
      <VCol
        class="m-0 p-0"
        cols="12"
        md="12"
        lg="12"
      >
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
        <VCard v-else class="px-5 py-4">
            <VCardItem class="text-center">
                <VCardTitle class="text-h5 mb-3">
                    {{ accionForm == "add"? "Crear módulo":"Editar módulo" }}
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
                            <VCol cols="12" >
                                <VSelect 
                                  v-model:menu="selectRefCuestionario"
                                  no-data-text="No existen cuestionario que mostrar"
                                  append-icon="mdi-refresh"
                                  item-text="title"
                                  item-value="value"
                                  v-model="dataCuestionarioModel" 
                                  :items="dataCuestionarioItems"
                                  :disabled="cuestionarioModelLoading"
                                  label="Cuestionario para al final del módulo"
                                  clearable                                          
                                  @click:append="getCuestionario"
                                  :menu-props="{ maxHeight: '400' }">
                                  <template v-slot:prepend-item>
                                    <v-list-item>
                                      <v-list-item-content>
                                        <VTextField v-model="searchCuestionarioModel" clearable placeholder="Buscar cuestionario"/>
                                      </v-list-item-content>
                                    </v-list-item>
                                    <v-divider class="mt-2"></v-divider>
                                  </template>
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
                            <VCol cols="12">
                              <VRow>
                                  <VCol cols="9" >
                                    <VSelect
                                      v-model:menu="selectRefVideo"
                                      no-data-text="No existen videos que mostrar"
                                      append-icon="mdi-refresh"
                                      @click:append="getVideos"
                                      :disabled="videoModelLoading"
                                      :menu-props="{ maxHeight: '300' }"
                                      item-text="title"
                                      item-value="value"
                                      v-model="videosModel" 
                                      :items="videosItems"
                                      chips
                                      multiple
                                      label="Videos educativos">
                                      <template v-slot:prepend-item>
                                        <v-list-item>
                                          <v-list-item-content>
                                            <VTextField v-model="searchVideoModel" clearable placeholder="Buscar video"/>
                                          </v-list-item-content>
                                        </v-list-item>
                                        <v-divider class="mt-2"></v-divider>
                                      </template>
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
                                  <VCol cols="3" >
                                    <VBtn title="Agregar módulo" block @click="isDialogVisibleAddVideo = true"> Agregar </VBtn>
                                  </VCol>
                                </VRow>
                                
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
                                    <VListItemTitle :class="videoSelect.bloqueado?'disabled':''">
                                      {{ videoSelect.title }}
                                    </VListItemTitle>
                                    <VListItemSubtitle :class="videoSelect.bloqueado?'disabled':''">

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
                                      <div class="content-order pl-4">
                                        <div class="content-edit">
                                          <VBtn class="px-0 btn-editar" size="x-small" :title="videoSelect.bloqueado?'Desbloquear video':'Bloquear video'" variant="text" @click="handleSwitchChange(videoSelect, index)">
                                            <VIcon top :size="25" icon="tabler-lock" title="Video bloqueado" color="error" v-if="videoSelect.bloqueado" />
                                            <VIcon top :size="25" icon="tabler-lock-open" title="Video público" color="success" v-else />
                                          </VBtn>
                                          <VBtn style="margin-top: -10px;" class="px-0 btn-editar" size="x-small" variant="text" @click="editarVideo(videoSelect.value)">
                                            <div class="content-btn">
                                              <VIcon top :size="25" icon="tabler-edit" title="Video público" color="primary" />
                                              Editar
                                            </div>
                                          </VBtn>
                                        </div>
                                        <div class="btn-order" style="">
                                          <VBtn size="x-small" class="px-1" :disabled="index == 0" variant="text" @click="cambiarPosicion(videoSelect.value, 'arriba')">
                                            <VIcon :size="25" icon="mdi-arrow-up-bold-box" />
                                          </VBtn>
                                          <VBtn size="x-small" class="px-1" :disabled="index == videosSelectList.length - 1" variant="text" @click="cambiarPosicion(videoSelect.value, 'abajo')">
                                            <VIcon :size="25" icon="mdi-arrow-down-bold-box" />
                                          </VBtn>
                                        </div>
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
  .content-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 7px !important;
  }

  /*.content-edit {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      text-align: center;
      color: rgb(var(--v-theme-primary));
  }*/

  .content-order {
      display: flex;
      align-items: center;
      gap: 0;
      justify-content: center;
  }
  .switch-estatus {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0;
      padding-left: 5px;
  }

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
