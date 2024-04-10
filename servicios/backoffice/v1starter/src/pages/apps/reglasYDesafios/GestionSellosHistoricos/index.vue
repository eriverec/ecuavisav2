<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const currentTab = ref('tab-lista');


const datosUsuario = ref([]);
const datosUsuarioLoading = ref([]);
const datosSellosLoading = ref(true);

const semanaModel = ref('');
const semanaItems = ref([]);

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
  value: ""
},{
  title: "Ver todo el video",
  value: "full"
}]

onMounted(async ()=>{
  await getSemanas();
  await getSellosHistoricos();
  // await getDesafio();
})

async function getSellosHistoricos(dataJson = {}){
  try {
      const { page = 1, limit= 200, idSemanaDesafio = "" } = dataJson;
      datosSellosLoading.value = true;
      currentPage.value = 1;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-niveles-puntuacion.vercel.app/historico-sello/all?limit=${limit}&page=${page}&idSemanaDesafio=${idSemanaDesafio}`, requestOptions);
      const data = await response.json();

      dataDesafio.value = data.data;
      
      totalRegistros.value = Math.ceil(data.total / data.limit);
      datosSellosLoading.value = false;
  } catch (error) {
      return console.error(error.message);    
  }
}

async function getSemanas(page = 1, limit= 10){
  try {
      currentPage.value = 1;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-desafios.vercel.app/semana/all/get`, requestOptions);
      const data = await response.json();

      semanaItems.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, [])
  } catch (error) {
      return console.error(error.message);    
  }
}

// async function getDesafio(page = 1, limit= 10){
//   try {
//       var myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");

//       var requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//       };

//       var response = await fetch(`https://servicio-desafios.vercel.app/desafios`, requestOptions);
//       const data = await response.json();

//       desafioItems.value = data.data.reduce((acumulador, actual) => {
//         acumulador.push({
//           title: `${actual.tituloDesafio}`,
//           value: actual._id,
//         });
//         return acumulador;
//       }, [])

//       // dataDesafio.value = data.data;
//   } catch (error) {
//       return console.error(error.message);    
//   }
// }

// Funciones para manejar el cambio de paginación
const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedSellosHistoricos = computed(() => {
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
      await getSellosHistoricos(currentPage.value);

  } catch (error) {
      return console.error(error.message);    
  }
};
*/

// const handleSwitchChange = async (index) => {
//   const desafio = dataDesafio.value[index];
  
//   const id = desafio._id;
//   const estado = desafio.statusDesafio;
//   switchOnDisabled.value = true;
//   var jsonEnviar = {
//       statusDesafio: estado
//   }

//   var myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");
//   var requestOptions = {
//     method: 'PUT',
//     headers: myHeaders,
//     body: JSON.stringify(jsonEnviar),
//     redirect: 'follow'
//   };

//   var response = await fetch(`https://servicio-desafios.vercel.app/desafios/${id}`, requestOptions);
//   const data = await response.json();
//   if(data.resp){
//     // alert("Desafío editado correctamente");
//   }else{
//     alert("Un error se presentó: "+data.error);
//     desafio.statusDesafio = !desafio.statusDesafio;
//   };
//   switchOnDisabled.value = false;
//   // Realiza las operaciones necesarias con el ID y el estado
// };

//FUNCIONES FORM
// function resetForm(){
//     idToEdit.value = "";
//     idVideo.value = "";
//     timeVal.value = "";
//     desafioModel.value = "";
//     tipoEvaluacion.value = "";
  
// }
// function closeDiag(){
//     resetForm(); 
//     isDialogActive.value = false;
// }

//ADD
// async function onAdd(){     
//     resetForm(); 
//     accionForm.value = 'add';
//     isDialogActive.value = true;
// }

//EDIT
// async function onEdit(id){
//     resetForm();     
//     accionForm.value = 'edit';
//     const consulta = await fetch('https://servicio-niveles-puntuacion.vercel.app/historico-sello/get/' + id);
//     const consultaJson = await consulta.json();
//     const data = consultaJson.data[0];
//     //console.log(paquete);
//     idToEdit.value = data._id;
//     idVideo.value = data.idVideo;
//     timeVal.value = data.timeVal;
//     desafioModel.value = data.idDesafio;
//     tipoEvaluacion.value = data.tipoEval;
//     isDialogActive.value = true;  
// }

//SEND

// async function onComplete(){
//   if (
//         !desafioModel.value || 
//         !idVideo.value
//       ){
//         configSnackbar.value = {
//             message: "Llenar todos los campos para crear el desafío",
//             type: "error",
//             model: true
//         };
//         return false;
//     }
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     if (accionForm.value === 'add') {
//       let jsonEnviar = {
//               "idVideo": idVideo.value,
//               "timeVal": timeVal.value,
//               "idDesafio": desafioModel.value,
//               "tipoEval": tipoEvaluacion.value
//       }
//       var raw = JSON.stringify(jsonEnviar);

//       var requestOptions = {
//               method: 'POST',
//               headers: myHeaders,
//               body: raw,
//               redirect: 'follow'
//       };

//       const send = await fetch('https://servicio-niveles-puntuacion.vercel.app/historico-sello/create', requestOptions);
//       const respuesta = await send.json();
//       if (respuesta.resp) {
//         configSnackbar.value = {
//             message: "Video desafío creada correctamente",
//             type: "success",
//             model: true
//         };
              
//       } else {
//         configSnackbar.value = {
//             message: respuesta.mensaje,
//             type: "error",
//             model: true
//         };
//         console.error(respuesta.error);
//         return false;
//       }
//     }else if(accionForm.value === 'edit'){
//       let jsonEnviar = {
//                 "idVideo": idVideo.value,
//                 "timeVal": timeVal.value,
//                 "idDesafio": desafioModel.value,
//                 "tipoEval": tipoEvaluacion.value
//         }
//         var raw = JSON.stringify(jsonEnviar);
//         var requestOptions = {
//                 method: 'POST',
//                 headers: myHeaders,
//                 body: raw,
//                 redirect: 'follow'
//         };
//         const send = await fetch('https://servicio-niveles-puntuacion.vercel.app/historico-sello/update/' + idToEdit.value, requestOptions);
//         const respuesta = await send.json();
//         if (respuesta.resp) {
//                 configSnackbar.value = {
//                     message: "Video desafío actualizado correctamente",
//                     type: "success",
//                     model: true
//                 };
                
//         } else {
//                 configSnackbar.value = {
//                     message: respuesta.mensaje,
//                     type: "error",
//                     model: true
//                 };
//                 console.error(respuesta.error);
//                 return false;

//         }
//     }
//     await getSellosHistoricos();
//     isDialogActive.value = false;
// }

// DELETE

const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

// function onDelete(id) {    
//     isDialogVisibleDelete.value = true;
//     idToDelete.value = id;   
// }

// function onView(data) {
//     iframeOptions.value = {
//       _id:data._id,
//       idVideo: data.idVideo,
//       urlContent: data.urlContent,
//     };
//     isDialogVisibleVistaPreviaVideo.value = true;
// }

// async function deleteConfirmed() {
//     var requestOptions = {
//         method: 'DELETE',
//         redirect: 'follow'
//     };

//     const deleted = await fetch('https://servicio-niveles-puntuacion.vercel.app/historico-sello/delete/' + idToDelete.value, requestOptions);
//     const respuesta = await deleted.json();
//     if (respuesta.resp) {
//         configSnackbar.value = {
//             message: "Desafío eliminado correctamente",
//             type: "success",
//             model: true
//         };
//     } else {
//         configSnackbar.value = {
//             message: respuesta.mensaje,
//             type: "error",
//             model: true
//         };
//     }
//     await getSellosHistoricos();
//     isDialogVisibleDelete.value = false;
// }


//Ver datos del usuario

async function viewUserData(semana) {
  const userId = semana.userId;
  datosUsuarioLoading.value[userId.toString()] = true;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  var response = await fetch(`https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=${userId}`, requestOptions);
  const data = await response.json();
  datosUsuario.value[userId.toString()] = `${data.first_name} ${data.last_name} (${data.email})`;
  datosUsuarioLoading.value[userId.toString()] = false;
}

watch(() => semanaModel.value, async (newValue, oldValue) => {
  if(semanaModel.value){
    await getSellosHistoricos({idSemanaDesafio:semanaModel.value});
  }
});

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>

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
                      Sellos logrados de usuarios
                    </VCardTitle>
                    <VCardSubtitle> Sellos Logrados por Usuarios: Detalles de los Sellos y Usuarios Correspondientes </VCardSubtitle>
                  </div>
                </div>
                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <VRow>
                    <VCol cols="12" class="mb-4 d-flex mt-4" >
                        <VAvatar>
                          <VIcon
                            color="primary"
                            size="30"
                            icon="mdi-filter-outline"
                          />
                        </VAvatar>
                        
                        <v-select v-model="semanaModel" :items="semanaItems" label="Filtrar por semana" style="max-width: 400px;width: auto;">
                          <template #selection="{ item }">
                              <div>
                                  {{ item.title }}
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
                  </VRow>

                  <VList lines="two" border v-if="datosSellosLoading">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  

                  <VList lines="two" border  v-if="!datosSellosLoading">
                    <div v-if="dataDesafio.length < 1 && datosSellosLoading == false">
                      <VListItem>
                        <VListItemTitle>
                          No hay datos que mostrar
                        </VListItemTitle>
                      </VListItem>
                    </div>

                  <template
                    v-for="(desafio, index) of paginatedSellosHistoricos"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <div class="nombre-desafio d-flex flex-column">
                          <small>Semana</small>
                          <label style="margin-top:-5px">{{ desafio.semanaDesafio[0].titulo }}</label>
                          <div class="content-items d-flex">
                            <div class="content-video pt-0">
                              <VIcon
                                size="20"
                                icon="tabler-user"
                              />
                              <label class="pt-1 pl-2">{{ desafio.userId }}</label>
                              <VBtn title="Ver el nombre del usuario" 
                                size="small"
                                :loading="datosUsuarioLoading[desafio.userId.toString()]"
                                :disabled="datosUsuarioLoading[desafio.userId.toString()]"
                                @click="viewUserData(desafio)" 
                                v-if="!datosUsuario[desafio.userId.toString()]"
                                icon="tabler-eye"
                                variant="text"
                              />
                              <label class="pt-2 pl-2" v-else>| <strong>{{datosUsuario[desafio.userId.toString()]}}</strong></label>
                            </div>
                          </div>
                        </div>
                      </VListItemTitle>

                      <template #append>
                        <div class="d-flex flex-column flex-wrap gap-0 align-items-center text-center">
                          <a title="Ver la imagen" target="_blank" :href="desafio.semanaDesafio[0].imagen_descriptiva">
                            <img :src="desafio.semanaDesafio[0].imagen_descriptiva" width="65">
                          </a>
                          <div class="p-0 m-0" style="margin-top:-10px">
                            <VIcon size="16" icon="mdi-star-outline" />
                            <small style="font-size:10px">Sello logrado</small>
                          </div>
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
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

 <style lang="scss" scoped>
  .custom-loader {
    display: flex;
    animation: loader 1s infinite;
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
  </style>

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
