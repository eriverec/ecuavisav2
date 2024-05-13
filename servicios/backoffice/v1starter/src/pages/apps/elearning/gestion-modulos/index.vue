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
const disabledViewList = ref(false);
const switchOnDisabled = ref(false);
const isDialogVisibleVistaPreviaVideo = ref(false)
const iframeOptions = ref(null)
const searchVideoModel = ref(null)

const isDialogActive = ref(false);
const selectRefVideo = ref(null);
const accionForm = ref('');

const dataCuestionarioModel = ref([]);
const dataCuestionarioItems = ref([]);

const selectRefCuestionario = ref(null);
const cuestionarioModelLoading = ref(false);
const searchCuestionarioModel = ref(null)
const cuestionarioItemsCopy = ref([]);

const nombre = ref('');

const idRudoModel = ref('');
const duracionModel = ref('');
const descripcionDesafio = ref('');
const statusDesafio = ref(true);
const tituloSticker = ref('');
const URLSticker = ref('');
const categoriaModel = ref('');
const videosModel = ref(null);
const videosModelLoading = ref(false);

const tituloModel = ref(null);
const videosSelectList = ref([]);
const descripcionModel = ref(null);
const thumbnailModel = ref(null);

const idToEdit = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});
const videosItems = ref([]);
const videosItemsCopy = ref([]);

onMounted(async ()=>{
  await getCuestionario();
  await getVideos();
  await getGestionModulos();
})

async function getGestionModulos(page = 1, limit= 10){
  try {
      currentPage.value = 1;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/modulo/all?limit=200&page=1`, requestOptions);
      const data = await response.json();

      dataVideoList.value = data.data;
      
      totalRegistros.value = Math.ceil(data.total / data.limit);
  } catch (error) {
      return console.error(error.message);    
  }
}

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
      return console.error(error.message);    
  }
}

async function getVideos(page = 1, limit= 10){
  try {
      videosModelLoading.value = true;
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

      videosItemsCopy.value = videosItems.value;
      videosModelLoading.value = false;
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
    dataCuestionarioModel.value = null;
  
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

//EDIT
async function onEdit(id){
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

}

//SEND

async function onComplete(){
  if (
        !tituloModel.value || 
        !descripcionModel.value || 
        !videosModel.value
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
    await getGestionModulos();
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

async function deleteConfirmed() {
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://servicio-elearning.vercel.app/modulo/delete/' + idToDelete.value, requestOptions);
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
    await getGestionModulos();
    isDialogVisibleDelete.value = false;
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
          <VBtn @click="deleteConfirmed">
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
                      Listado de modulos E-Learning
                    </VCardTitle>
                    <VCardSubtitle> Mantenimiento de modulos E-Learning </VCardSubtitle>
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
                    v-for="(modulo, index) of paginatedDesafios"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <div class="nombre-desafio d-flex flex-column">
                          <div class="d-flex">
                            <small>Módulo</small>
                            <small class="text-disabled"><code class="p-0"><b>_id:</b>{{ modulo._id }}</code></small>
                          </div>
                          <label>{{ modulo.titulo }}</label>
                          <small class="mr-2">{{ modulo.descripcion }}</small> 
                        </div>
                      </VListItemTitle>

                      <template #append>
                        <div class="espacio-right-2">
                          <VBtn 
                            title="Editar registro" color="success" variant="text" icon  @click="onEdit(modulo._id)">
                            <VIcon size="22" icon="tabler-edit" />
                          </VBtn>

                          <VBtn
                            title="Eliminar el registro"
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="onDelete(modulo._id)"
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
                            :to="{ name: 'apps-elearning-gestion-modulos-view-id', params: { id: modulo._id } }"
                          >
                            <VIcon
                              :size="22"
                              icon="tabler-eye"
                            />
                          </VBtn>
                        </div>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== dataVideoList.length - 1" />
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
                              {{ accionForm === "add" || accionForm === "duplicate" ? "Crear registro" : "Editar: " + tituloModel }}
                          </VCardTitle>
                      </VCardItem>

                      <VCardText>

                          <!-- 👉 Form -->
                          <VForm class="mt-6" @submit.prevent="onComplete">
                              <VRow class="">
                                  <VRow>
                                      <VCol cols="6">
                                        <VTextField v-model="tituloModel" label="Título del modulo" />
                                      </VCol>

                                      <VCol cols="6">
                                        <VTextField v-model="descripcionModel" label="Descripción" />
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
                                        <VSelect 
                                          v-model:menu="selectRefVideo"
                                          item-text="title"
                                          item-value="value"
                                          v-model="videosModel" 
                                          :items="videosItems"
                                          chips
                                          multiple
                                          attach
                                          label="Videos educativos"
                                          no-data-text="No existen videos que mostrar"
                                          append-icon="mdi-refresh"
                                          @click:append="getVideos"
                                          :disabled="videosModelLoading"
                                          :menu-props="{ maxHeight: '300' }">
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
