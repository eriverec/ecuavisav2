<script setup>
import { getPaisConfig } from "@core/libs/campaigns/config";
import { useRouter } from 'vue-router';
const router = useRouter()
import debounce from 'lodash/debounce';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000
})

const currentTab = ref('tab-lista');
const isDialogVisibleDelete = ref(false);
const checkbox = ref(1);
const dataCampaigns = ref([]);
const currentPage = ref(1);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const idCampaign = ref("");
const disabledPagination = ref(false);
const disabledViewList = ref(false);
const switchOnDisabled = ref(false);
const derviceExistData = ref(false);

const banderas = {
  "Ecuador":"EC",
  "Japan":"JP",
  "Cuba":"CU",
  "Colombia":"CU",
}

onMounted(getCampaigns)

async function getCampaigns(page = 1, limit= 10, s= null){
  try {
      derviceExistData.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://ads-service.vercel.app/campaign/get/all?page=${page}&limit=${limit}`+ (s ? ("&s="+ s) : ""), requestOptions);
      const data = await response.json();

      for(var i in data.data){
        data.data[i]["type_local"] = "server";
      }

      const dataClone = readRecords();
      console.log("dataClone",dataClone)
      for(var i in dataClone){
        dataClone[i]["type_local"] = "local";
      }
      if(page == 1){
        dataCampaigns.value = dataClone.concat(data.data);
      }else{
        dataCampaigns.value = data.data;
      }
      
      data.total = data.total * 1 + dataClone.length;
      totalRegistrosHtml.value = data.total;
      totalRegistros.value = Math.ceil(data.total / data.limit);
      derviceExistData.value = false;
      return true;
  } catch (error) {
    derviceExistData.value = false;
    return console.error(error.message);    
  }
}

// Función para manejar el cambio de paginación
const handlePaginationClick = async () => {
  // Aquí puedes realizar las acciones que deseas cuando se hace clic en la paginación
  // console.log('Se hizo clic en la paginación'+currentPage.value);
  disabledPagination.value = true;
  await getCampaigns(currentPage.value)
  disabledPagination.value = false;
};

// Función para manejar el cambio de paginación
const eliminarRegistro = async (id) => {
  isDialogVisibleDelete.value = true;
  idCampaign.value = id;
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

      var response = await fetch(`https://ads-service.vercel.app/campaign/delete/${idCampaign.value}`, requestOptions);
      const data = await response.json();

      disabledViewList.value = false;
      await getCampaigns(currentPage.value);

  } catch (error) {
      return console.error(error.message);    
  }
};

const handleSwitchChange = async (index) => {
  const campaign = dataCampaigns.value[index];
  const id = campaign._id;
  const estado = campaign.statusCampaign;
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

  var response = await fetch(`https://ads-service.vercel.app/campaign/update/status/${id}`, requestOptions);
  const data = await response.json();
  if(data.resp){
    // alert("Registro guardado");
  }else{
    alert("Un error se presentó: "+data.error);
    campaign.statusCampaign = !campaign.statusCampaign;
  };
  switchOnDisabled.value = false;
  // Realiza las operaciones necesarias con el ID y el estado
};

/****************************************************************/
/****************************************************************/
// INICIO CRUD EN LOCALSTORAGE PARA EL DUPLICADO
/****************************************************************/
/****************************************************************/
const isDialogVisibleClone = ref(false);

const localStorageKey = "crudDataCampanias";

// Inicializa el localStorage si no tiene datos
if (!localStorage.getItem(localStorageKey)) {
  localStorage.setItem(localStorageKey, JSON.stringify([]));
}

var newRecordModalObject = null;

function openModal(newRecord) {
  newRecordModalObject = newRecord;
  isDialogVisibleClone.value = true;
}

const getUserIds = async (id, page = 1, limit = 10000) => {
  try{
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    var response = await fetch(`https://ads-service.vercel.app/campaign/${id}/user-ids?limit=${limit}&page=${page}`, requestOptions);
    const data = await response.json();
    if(data && data.length > 0){
      return data;
    }else{
      return [];
    };
  }catch(error){
    return [];
  }
};

// Funciones CRUD

// Crear un nuevo registro
async function createRecord() {
  disabledViewList.value = true;
  newRecordModalObject["statusCampaign"] = false;
  newRecordModalObject["userId"] = [];
  newRecordModalObject["created_at"] = moment();

  let skip = 1;
  let batchSize = 20000;
  let dataFull = [];

  while (true) {
    const batchRegister = await getUserIds(newRecordModalObject._id, skip, batchSize);

    if (batchRegister.length === 0) {
      break;
    }

    dataFull.push(...batchRegister);
    newRecordModalObject["userId"] = dataFull;

    skip += 1;

    console.log(dataFull.length)
  }

  newRecordModalObject["campaignTitle"] = `${newRecordModalObject["campaignTitle"]} ${moment().format("HHmmss")}`;

  const newRecord = newRecordModalObject;

  // Recuperar los datos existentes del localStorage o inicializar con un array vacío
  const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];

  // Agregar el nuevo registro al inicio
  data.unshift(newRecord);

  // Actualizar el localStorage
  localStorage.setItem(localStorageKey, JSON.stringify(data));

  console.log("Registro creado:", newRecord);

  // Actualizar el estado de la interfaz
  isDialogVisibleClone.value = false;
  snackbar.value = {
    show: true,
    text: `Registro duplicado`,
    color: 'success'
  };

  // Llamar a la función para actualizar la vista y habilitar nuevamente la lista
  // await getCampaigns(1);
  // disabledViewList.value = false;

  router.push({ 
    name: 'apps-campaigns-duplicate-id', 
    params: { id: newRecordModalObject._id }
  })
}


// Leer todos los registros
function readRecords() {
  return JSON.parse(localStorage.getItem(localStorageKey));
}

// Actualizar un registro existente por su índice
function updateRecord(index, updatedRecord) {
  const data = JSON.parse(localStorage.getItem(localStorageKey));
  if (index >= 0 && index < data.length) {
    data[index] = updatedRecord;
    localStorage.setItem(localStorageKey, JSON.stringify(data));
    console.log(`Registro en índice ${index} actualizado:`, updatedRecord);
  } else {
    console.error("Índice inválido.");
  }
}

// Eliminar un registro por su índice
async function deleteRecord(customIndex) {
  disabledViewList.value = true;
  
  const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];

  // Buscar el índice basado en el identificador personalizado
  const index = data.findIndex(record => record._id === customIndex);

  if (index !== -1) {
    // Eliminar el registro si se encuentra
    const deletedRecord = data.splice(index, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(data));
    console.log(`Registro eliminado con id ${customIndex}:`, deletedRecord[0]);
    snackbar.value = {
      show: true,
      text: `Registro eliminado`,
      color: 'success'
    }
  } else {
    console.error(`No se encontró un registro con el id: ${customIndex}`);
  }

  await getCampaigns(1);

  disabledViewList.value = false;
}


// Limpiar todos los registros
function clearRecords() {
  localStorage.setItem(localStorageKey, JSON.stringify([]));
  console.log("Todos los registros han sido eliminados.");
}

// // Ejemplo de uso

// // Crear registros
// createRecord({ id: 1, nombre: "Producto 1", precio: 10.99 });
// createRecord({ id: 2, nombre: "Producto 2", precio: 15.99 });

// // Leer registros
// console.log("Registros actuales:", readRecords());

// // Actualizar un registro
// updateRecord(0, { id: 1, nombre: "Producto Actualizado", precio: 12.99 });

// // Eliminar un registro
// deleteRecord(1);

// // Leer nuevamente para verificar cambios
// console.log("Registros después de los cambios:", readRecords());

// // Limpiar todos los registros
// clearRecords();

/****************************************************************/
/****************************************************************/
// FIN CRUD EN LOCALSTORAGE PARA EL DUPLICADO
/****************************************************************/
/****************************************************************/


/****************************************************************/
/****************************************************************/
// INICIO BUSCADOR
/****************************************************************/
/****************************************************************/

const searchQuery = ref('');

// Función para realizar la consulta
const buscarUsuarios = async () => {
  try {
    const query = searchQuery.value?.toLowerCase();
    disabledPagination.value = true;
    await getCampaigns(1, 10, query); // Pasamos el término de búsqueda
    disabledPagination.value = false;
  } catch (error) {
    console.error("Error en buscarUsuarios:", error);
    return null;
  }
};

// Crear una función con debounce
const buscarUsuariosDebounced = debounce(buscarUsuarios, 500); // 500ms de retraso

/****************************************************************/
/****************************************************************/
// FIN BUSCADOR
/****************************************************************/
/****************************************************************/

</script>

<template>
  <section>
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top end"
    >
      {{ snackbar.text }}
    </VSnackbar>
    <VDialog
      v-model="isDialogVisibleClone"
      persistent
      class="v-dialog-sm"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleClone = !isDialogVisibleClone" />

      <!-- Dialog Content -->
      <VCard title="Clonar registro">
        <VCardText>
          ¿Desea clonar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisibleClone = false"
          >
            No, Cerrar
          </VBtn>
          <VBtn @click="createRecord()" :loading="disabledViewList" :disabled="disabledViewList">
            Si, clonar registro
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
            No, Cerrar
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
        <VTabs
          v-model="currentTab"
          class="v-tabs-pill  d-none"
        >
          <VTab
            value="tab-lista"
            class=" d-none"
          >
            Listado
          </VTab>
          <VTab
            value="tab-agregar"
            class=" d-none"
          >
            Estadísticas
          </VTab>
        </VTabs>

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
                      Listado de campañas
                    </VCardTitle>
                    <VCardSubtitle> Elige la campaña sobre la que necesites información  </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <div class="d-flex align-center gap-2">
                    <VBtn color="primary" class="mb-4" :to="{ name: 'apps-campaigns-create' }">
                      Crear campaña
                      <VIcon
                        :size="22"
                        icon="tabler-plus"
                      />
                    </VBtn>
                    <VSpacer />
                     <VTextField
                        clearable
                        :disabled="disabledPagination"
                        class="mb-4"
                        v-model="searchQuery"
                        label="Buscar por título o descripción"
                        prepend-inner-icon="mdi-magnify"
                        single-line
                        hide-details
                        @input="buscarUsuariosDebounced" 
                        @click:clear="buscarUsuariosDebounced"
                        style="max-width: 300px;"
                      />
                  </div>
                  <VList lines="two" border v-if="derviceExistData">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>
                  <VDivider v-if="!derviceExistData" />
                  <!-- SECTION Table -->
                  <VTable class="text-no-wrap" v-if="!derviceExistData">
                    <!-- 👉 Table head -->
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          class="font-weight-semibold"
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          class="font-weight-semibold"
                        >
                          Campaña
                        </th>
                        <th
                          scope="col"
                          class="font-weight-semibold"
                        >
                          Descripción
                        </th>
                        <th
                          scope="col"
                          class="font-weight-semibold"
                        >
                          Sector
                        </th>
                        <th
                          scope="col"
                          class="font-weight-semibold"
                        >
                          Num. Audiencia
                        </th>
                        <th
                          scope="col"
                          class="font-weight-semibold"
                        >
                          Tipo de contenido
                        </th>
                        <th
                          scope="col"
                          class="font-weight-semibold"
                        >
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <!-- 👉 Table Body -->
                    <tbody>
                      <tr
                        v-for="(c, index) of dataCampaigns"
                        :key="index"
                        style="height: 3.5rem;"
                        :class="c.type_local != 'server' ? 'text-opacity-25':''"
                      >
                        

                        <!-- 👉 Progress -->
                        <td class="text-center" 
                          style="width: 5.5rem;">
                          <div :title="c.statusCampaign?'Activo':'Inactivo'" class="switch-estatus" style="margin-bottom:-10px">
                            <VSwitch :disabled="switchOnDisabled || c.type_local == 'local'" :loading="switchOnDisabled?'warning':false" :color="c.statusCampaign?'success':'error'" v-model="c.statusCampaign" size="x-small" class="custom-vswitch" @change="handleSwitchChange(index)" />
                            <VChip
                              title="Publicidad pausada"
                              v-if="c.statusCampaign != true"
                              size="x-small"
                              label
                              color="error"
                              class="d-none"
                            >
                              <span style="font-weight:medium">{{ c.statusCampaign?'Activo':'Inactivo' }}</span>
                            </VChip>

                            <small class="d-none" title="Publicidad activa, iniciada" color="success" v-if="c.statusCampaign == true">
                              <span style="font-weight:medium">{{ c.statusCampaign?'Activo':'Inactivo' }}</span>
                            </small>
                          </div>
                        </td>

                        <!-- 👉 Name -->
                        <td>
                          <div class="d-flex text-xs align-center gap-3 pb-2">
                            <div v-if="c.criterial.country != null && c.criterial.country != -1" class="d-flex flex-column gap-0 align-center mr-2">
                              <VAvatar 
                                :title="'Ubicación: '+c.criterial.country+', '+c.criterial.city" 
                                class="" 
                                size="24" 
                                :image=" 'https://flagcdn.com/w320/' + getPaisConfig(c.criterial.country)['alpha-2'].toLowerCase() + '.png' " 
                              />
                              <small>{{getPaisConfig(c.criterial.country)['alpha-2']}}</small>
                            </div>

                            <div>
                              <div style="font-size:10px" class="pt-2 text-primary" v-if="c.type_local != 'server'"><VIcon size="10" icon="mdi-warning" /> No guardado</div>
                              <div class="active-opacity">
                                <h6 class="text-base text-medium-emphasis font-weight-semibold">
                                  {{ c.campaignTitle }}
                                </h6>
                                <span class="text-disabled" style="font-size: 12px;">{{ moment(c.created_at).format("YYYY-MM-DD, HH:mm:ss") }}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td class="text-medium-emphasis active-opacity"
                          style="width: 3.5rem;" >
                          <span class="text-xs pl-2">
                            {{ c.description }}
                          </span>
                        </td>

                        <!-- 👉 Leader -->
                        <td class="text-medium-emphasis">
                          <div class=" active-opacity" v-if="c.criterial.country != null && c.criterial.country != -1">
                            <span class="text-xs text-disabled">
                              <VIcon icon="mdi-location" /> {{c.criterial.country}}{{ c.criterial.city == "0" ? "": ", "+c.criterial.city }} 
                            </span>
                          </div>
                        </td>

                        <!-- 👉 Team -->
                        <td class="text-medium-emphasis active-opacity">
                          <span class="text-xs pl-2">
                            <VIcon icon="mdi-account-group" />: {{ c.sizeUsersId }}
                          </span>
                        </td>

                        <td class="text-medium-emphasis active-opacity">
                          <span class="text-xs text-disabled">
                            {{ c.type }}
                          </span>
                        </td>

                        <!-- 👉 Actions -->
                        <td
                          class="text-center"
                          style="width: 3.5rem;"
                        >
                          <VBtn
                            icon
                            variant="plain"
                            color="default"
                            size="x-small"
                          >
                            <VIcon
                              :title="c.campaignTitle"
                              :size="22"
                              icon="tabler-dots-vertical"
                            />

                            <VMenu activator="parent">
                              <VList density="compact">
                                <VListItem
                                  v-if="c.type_local == 'server'"
                                  :to="{
                                    name: 'apps-campaigns-edit-id',
                                    params: { id: c._id },
                                  }"
                                >
                                  <VIcon size="15" class="mr-1" icon="mdi-edit" />
                                  Editar campaña
                                </VListItem>
                                <VListItem
                                  v-else
                                  :to="{
                                    name: 'apps-campaigns-duplicate-id',
                                    params: { id: c._id },
                                  }"
                                >
                                  <VIcon size="18" class="mr-1" icon="mdi-content-save-outline" />
                                  Terminar de guardar la campaña
                                </VListItem>
                                <VListItem
                                  v-if="c.type_local == 'server'"
                                  href="#"
                                  @click="openModal(c)"
                                >
                                  <VIcon size="15" class="mr-1" icon="mdi-content-copy" />
                                  Clonar campaña
                                </VListItem>
                                <VListItem
                                  v-if="c.type_local == 'server'"
                                  :to="{ name: 'apps-campaigns-view-id', params: { id: c._id } }"
                                >
                                  <VIcon size="18" class="mr-1" icon="mdi-eye-outline" />
                                  Ver campaña
                                </VListItem>
                                <VDivider />
                                <VListItem
                                  v-if="c.type_local == 'server'"
                                  href="#"
                                  @click="eliminarRegistro(c._id)"
                                >
                                  <VIcon size="18" class="mr-1" color="error" icon="mdi-trash-can-outline" />
                                  Eliminar campaña
                                </VListItem>
                                <VListItem
                                  v-else
                                  href="#"
                                  @click="deleteRecord(c._id)"
                                >
                                  <VIcon size="18" class="mr-1" color="error" icon="mdi-trash-can-outline" />
                                  Eliminar campaña
                                </VListItem>
                              </VList>
                            </VMenu>
                          </VBtn>
                        </td>

                        
                      </tr>
                    </tbody>

                    <!-- 👉 table footer  -->
                    <tfoot v-show="!dataCampaigns.length">
                      <tr>
                        <td
                          colspan="8"
                          class="text-center text-body-1"
                        >
                          No hay registros que mostrar
                        </td>
                      </tr>
                    </tfoot>
                  </VTable>
                  <!-- !SECTION -->
                  <VDivider v-show="dataCampaigns.length > 1 && !derviceExistData" />
                <span class="text-sm text-disabled mt-4 d-block" v-show="dataCampaigns.length">
                  Total de registros {{ totalRegistrosHtml }}
                </span>
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
  .text-opacity-25 .active-opacity {
      opacity: 0.4;
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
