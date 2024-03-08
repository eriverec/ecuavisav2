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


const isDialogActive = ref(false);
const accionForm = ref('');

const nombre = ref('');

const frecuenciaDesafio = ref('');
const frecuenciaValor = ref(null);
const tituloDesafio = ref('');
const descripcionDesafio = ref('');
const statusDesafio = ref(true);
const tituloSticker = ref('');
const URLSticker = ref('');

const idToEdit = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});


onMounted(getDesafio)

async function getDesafio(page = 1, limit= 10){
  try {
      currentPage.value = 1;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-desafios.vercel.app/desafios`, requestOptions);
      const data = await response.json();

      dataDesafio.value = data.data;
      
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
      await getDesafio(currentPage.value);

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
    frecuenciaDesafio.value = '';
    frecuenciaValor.value = null;
    tituloDesafio.value = '';
    descripcionDesafio.value = '';
    statusDesafio.value = true;
    tituloSticker.value = '';
    URLSticker.value = '';
  
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
    const consulta = await fetch('https://servicio-desafios.vercel.app/desafios/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = data._id;
    nombre.value = data.tituloDesafio;
    frecuenciaDesafio.value = data.frecuenciaDesafio;
    frecuenciaValor.value = data.frecuenciaValor;
    tituloDesafio.value = data.tituloDesafio;
    descripcionDesafio.value = data.descripcionDesafio;
    statusDesafio.value = data.statusDesafio;
    tituloSticker.value = data.tituloSticker;
    URLSticker.value = data.URLSticker;

    isDialogActive.value = true;  
}

//SEND

async function onComplete(){

  if ( !frecuenciaDesafio.value || frecuenciaValor.value == null || !tituloDesafio.value || !descripcionDesafio.value || 
    !tituloSticker.value || !URLSticker.value) {
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

    let jsonEnviar ={
            "frecuenciaDesafio": frecuenciaDesafio.value,
            "frecuenciaValor": frecuenciaValor.value,
            "tituloDesafio": tituloDesafio.value,
            "descripcionDesafio": descripcionDesafio.value,
            "statusDesafio": statusDesafio.value,
            "tituloSticker": tituloSticker.value,
            "URLSticker": URLSticker.value  
    }

    var raw = JSON.stringify(jsonEnviar);

    var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
    };

    const send = await fetch('https://servicio-desafios.vercel.app/add', requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
            configSnackbar.value = {
                message: "Desafío creada correctamente",
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

  let jsonEnviar ={
            "frecuenciaDesafio": frecuenciaDesafio.value,
            "frecuenciaValor": frecuenciaValor.value,
            "tituloDesafio": tituloDesafio.value,
            "descripcionDesafio": descripcionDesafio.value,
            "statusDesafio": statusDesafio.value,
            "tituloSticker": tituloSticker.value,
            "URLSticker": URLSticker.value  
    }

    var raw = JSON.stringify(jsonEnviar);

    var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
    };

    const send = await fetch('https://servicio-desafios.vercel.app/desafios/' + idToEdit.value, requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
            configSnackbar.value = {
                message: "Desafío actualizado correctamente",
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
await getDesafio();
isDialogActive.value = false;

}

// DELETE

const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

function onDelete(id) {    
    isDialogVisibleDelete.value = true;
    idToDelete.value = id;   
}

async function deleteConfirmed() {
    
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://servicio-desafios.vercel.app/desafios/' + idToDelete.value, requestOptions);
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
    await getDesafio();
    isDialogVisibleDelete.value = false;

}

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>
    
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
                      Listado de desafíos
                    </VCardTitle>
                    <VCardSubtitle> Elige el desafío del que necesites información </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <VBtn color="primary" class="mb-4" @click="onAdd">
                    Nuevo desafío
                    <VIcon
                      :size="22"
                      icon="tabler-plus"
                    />
                  </VBtn>
                  <VList lines="two" border v-if="dataDesafio.length < 1">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  <VList lines="two" border  v-if="dataDesafio.length > 0">
                  <template
                    v-for="(desafio, index) of paginatedDesafios"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <div class="nombre-desafio">
                          {{desafio.tituloDesafio }}
                          
                          
                        </div>
                      </VListItemTitle>
                      <VListItemSubtitle class="mt-1" title="Estado del Desafío">
                        <div class="switch-estatus" style="margin-bottom:-10px">
                          <VSwitch :disabled="switchOnDisabled" :loading="switchOnDisabled?'warning':false" :color="desafio.statusDesafio?'success':'error'" v-model="desafio.statusDesafio" size="x-small" class="custom-vswitch" @change="handleSwitchChange(index)" />
                          <VChip
                            title="Desafío desactivado"
                            v-if="desafio.statusDesafio != true"
                            size="x-small"
                            label
                            color="error"
                          >
                            <span style="font-weight:medium">{{ desafio.statusDesafio?'Activo':'Inactivo' }}</span>
                          </VChip>

                          <small title="Desafío activo" color="success" v-if="desafio.statusDesafio == true">
                            <span style="font-weight:medium">{{ desafio.statusDesafio?'Activo':'Inactivo' }}</span>
                          </small>
                        </div>

                      

                        
                      </VListItemSubtitle>

                      <template #append>
                        <div class="espacio-right-2">
                          
                          <VBtn color="success" variant="text" icon  @click="onEdit(desafio._id)">
                                    <VIcon size="22" icon="tabler-edit" />
                          </VBtn>

                          <VBtn
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="onDelete(desafio._id)"
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
                            :to="{ name: 'apps-reglasYDesafios-GestionDesafios-view-id', params: { id: desafio._id } }"
                          >
                            <VIcon
                              :size="22"
                              icon="tabler-eye"
                            />
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

                  <VCard  class="pa-sm-14 pa-5">
                      <VCardItem class="text-center">
                          <VCardTitle class="text-h5 mb-3">
                              {{ accionForm === "add" || accionForm === "duplicate" ? "Nuevo desafío" : "Editar " + nombre }}
                          </VCardTitle>
                      </VCardItem>

                      <VCardText>

                          <!-- 👉 Form -->
                          <VForm class="mt-6" @submit.prevent="onComplete">
                              <VRow class="d-flex flex-wrap justify-center gap-4">
                                  <VRow>
                                                                                                         
                                      <VCol cols="6" >
                                          <VTextField v-model="frecuenciaDesafio" label="Frecuencia de desafio" />
                                      </VCol>

                                      <VCol cols="6" >
                                          <VTextField v-model="frecuenciaValor" label="Frecuencia de valor" type="number"  />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VTextField v-model="tituloDesafio" label="Título del desafío" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VTextField v-model="descripcionDesafio" label="Descripción del desafío" />
                                      </VCol>

                                      <VCol cols="6" >
                                          <VSwitch v-model="statusDesafio" label="Estatus del desafío" />
                                      </VCol>

                                      <VCol cols="6" >
                                          <VTextField v-model="tituloSticker" label="Título del sticker" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VTextField v-model="URLSticker" label="URL del sticker" />
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
