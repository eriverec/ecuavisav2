<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const currentTab = ref('tab-lista');
const isDialogVisibleDelete = ref(false);
const checkbox = ref(1);
const dataDesafio = ref([]);
const currentPage = ref(1);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const idCampaign = ref("");
const disabledPagination = ref(false);
const disabledViewList = ref(false);
const switchOnDisabled = ref(false);


onMounted(getDesafio)

async function getDesafio(page = 1, limit= 10){
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

      dataDesafio.value = data.data;
      
      totalRegistros.value = Math.ceil(data.total / data.limit);
  } catch (error) {
      return console.error(error.message);    
  }
}

// Función para manejar el cambio de paginación
const handlePaginationClick = async () => {
  // Aquí puedes realizar las acciones que deseas cuando se hace clic en la paginación
  // console.log('Se hizo clic en la paginación'+currentPage.value);
  disabledPagination.value = true;
  await getDesafio(currentPage.value)
  disabledPagination.value = false;
};

// Función para manejar el cambio de paginación
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

const handleSwitchChange = async (index) => {
  const desafio = dataDesafio.value[index];
  const id = desafio._id;
  const estado = desafio.statusDesafio;
  switchOnDisabled.value = true;
  var jsonEnviar = {
        status: estado
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'POST',
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

</script>

<template>
  <section>
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
          <VBtn @click="eliminarRegistroSi">
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
                  <VBtn color="primary" class="mb-4" :to="{ name: 'apps-campaigns-create' }">
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
                    v-for="(desafio, index) of dataDesafio"
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
                          
                          <VBtn
                            icon
                            size="x-small"
                            color="info"
                            variant="text"
                          >
                          <RouterLink
                            :to="{
                              name: 'apps-campaigns-edit-id',
                              params: { id: desafio._id },
                            }"
                            class="font-weight-medium user-list-name"
                            >
                            <VIcon
                              size="22"
                              icon="tabler-edit"
                            />
                          </RouterLink>
                          </VBtn>

                          <VBtn
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="eliminarRegistro(desafio._id)"
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
                
                <VPagination
                    :disabled="disabledPagination"
                    v-model="currentPage"
                    :length="totalRegistros"
                    class="mt-4"
                    @click="handlePaginationClick"
                  />
                </div>
                <!-- fin lista usuarios -->
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
