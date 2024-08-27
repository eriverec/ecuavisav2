<script setup>
import { extendMoment } from 'moment-range'
import Moment from 'moment-timezone'
import esLocale from "moment/locale/es"
import { computed, onMounted, ref, watch } from 'vue'

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])
moment.tz.setDefault('America/Guayaquil')

// Referencias reactivas
const totalRegistros = ref(0)
const dataReembolsos = ref([])
const filteredReembolsos = ref([])
const currentPage = ref(1)
const totalPage = ref(0)
const rowPerPage = ref(10)
const loadingReembolsos = ref(false)
const isFullLoading = ref(false)
const isLoadingExport = ref(false)

const searchQuery = ref('')
const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false
})

//Funcion para alerta de OK

// Dentro de <script setup>
function mostrarAlertaTransactionId(transactionId, endpointId) {
  alert(`Transacción procesada: ${transactionId}\nID de la solicitud: ${endpointId}`);
}


// Función para obtener reembolsos de una página específica
async function getReembolsosPage(page, limit) {
  const url = `https://servicios-ecuavisa-suscripciones.vercel.app/reembolso/backoffice/solicitudes-list?estado=2&page=${page}&limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.resp ? data : null;
}

// Función para obtener todos los reembolsos
async function getAllReembolsos() {
  loadingReembolsos.value = true;
  try {
    let allReembolsos = [];
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const data = await getReembolsosPage(page, 100); // Usamos un límite más alto para reducir el número de llamadas
      if (data && data.data && data.data.length > 0) {
        allReembolsos = [...allReembolsos, ...data.data];
        page++;
      } else {
        hasMoreData = false;
      }
    }

    dataReembolsos.value = allReembolsos;
    filteredReembolsos.value = allReembolsos;
    totalRegistros.value = allReembolsos.length;
    totalPage.value = Math.ceil(allReembolsos.length / rowPerPage.value);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    configSnackbar.value = {
      message: "No se pudo recuperar los datos, recargue de nuevo.",
      type: "error",
      model: true
    };
  } finally {
    loadingReembolsos.value = false;
  }
}

// Función para buscar reembolsos
function buscarReembolsos() {
  isFullLoading.value = true;
  const query = searchQuery.value.toLowerCase();
  filteredReembolsos.value = dataReembolsos.value.filter(item => 
    item.user.first_name.toLowerCase().includes(query) ||
    item.user.last_name.toLowerCase().includes(query)
  );
  currentPage.value = 1;
  totalPage.value = Math.ceil(filteredReembolsos.value.length / rowPerPage.value);
  isFullLoading.value = false;
}

// Watchers
watch(rowPerPage, () => {
  currentPage.value = 1;
  totalPage.value = Math.ceil(filteredReembolsos.value.length / rowPerPage.value);
})

// Computed properties
const paginationData = computed(() => {
  const firstIndex = filteredReembolsos.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, filteredReembolsos.value.length);
  return `Mostrando ${firstIndex} a ${lastIndex} de ${filteredReembolsos.value.length} registros`;
})

const paginatedReembolsos = computed(() => {
  const start = (currentPage.value - 1) * rowPerPage.value;
  const end = start + rowPerPage.value;
  return filteredReembolsos.value.slice(start, end);
})

// Lifecycle hooks
onMounted(() => {
  getAllReembolsos();
})

// Función para obtener todos los reembolsos para exportación
async function getAllReembolsosForExport() {
  let allReembolsos = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    const data = await getReembolsosPage(page, 100); // Usamos un límite más alto para reducir el número de llamadas
    if (data && data.data && data.data.length > 0) {
      allReembolsos = [...allReembolsos, ...data.data];
      page++;
    } else {
      hasMoreData = false;
    }
  }

  return allReembolsos;
}

// Función para exportar datos
async function exportarDatos() {
  try {
    isLoadingExport.value = true;
    const allReembolsos = await getAllReembolsosForExport();
    
    // Definir las columnas del CSV
    const columns = [
      'ID',
      'Nombre',
      'Apellido',
      'Email',
      'Estado',
      'ID Transacción',
      'Nombre de Paquete'
    ];

    // Crear el contenido del CSV
    let csvContent = columns.join(',') + '\n';

    allReembolsos.forEach(item => {
      const row = [
        item._id,
        item.user.first_name,
        item.user.last_name,
        item.user.email,
        item.estado ? 'Activo' : 'Inactivo',
        item.transaction_id,
        item.product_description
      ];
      csvContent += row.join(',') + '\n';
    });

    // Crear y descargar el archivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reembolsos_${moment().format('YYYYMMDD_HHmmss')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    configSnackbar.value = {
      message: "Exportación completada con éxito.",
      type: "success",
      model: true
    };
  } catch (error) {
    console.error('Error al exportar datos:', error);
    configSnackbar.value = {
      message: "Error al exportar datos. Por favor, intente de nuevo.",
      type: "error",
      model: true
    };
  } finally {
    isLoadingExport.value = false;
  }
}
</script>

<template>
  <section>
    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>
    
    <VRow>
      <VCol cols="12" sm="12" lg="12">
        <h1>Listado de Reembolsos</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;">
          <div class="me-3 d-flex gap-4">
            <VSelect
              class="bg-white"
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />
            
            <VTextField
              v-model="searchQuery"
              label="Buscar por nombre o apellido"
              prepend-inner-icon="mdi-magnify"
              single-line
              hide-details
              @keyup.enter="buscarReembolsos"
              style="width: 300px;"
            />
            
            <VBtn
              color="primary"
              :loading="isFullLoading"
              :disabled="isFullLoading || loadingReembolsos"
              @click="buscarReembolsos"
            >
              Buscar
            </VBtn>


          </div>

          <VSpacer />

          <div class="app-reembolso-search-filter d-flex align-top">
            <VBtn
              :loading="isLoadingExport"
              :disabled="isLoadingExport || loadingReembolsos"
              variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share"
              @click="exportarDatos"
            >
              Exportar datos
            </VBtn>
          </div>
        </VCardText>

        <VCard class="mt-1">
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Email</th>
                <th scope="col">ID Transacción</th>
                <th scope="col">Nombre de Paquete</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody v-if="!loadingReembolsos">
              <tr v-for="item in paginatedReembolsos" :key="item._id" style="height: 3.75rem;">
                <td>{{ item.user.first_name }}</td> <!-- Cambiado de item.user[0].first_name -->
                <td>{{ item.user.last_name }}</td> <!-- Cambiado de item.user[0].last_name -->
                <td>{{ item.user.email }}</td> <!-- Cambiado de item.user[0].email -->
                <td>{{ item.transaction[0].transaction.id }}</td> <!-- Acceso al transaction_id -->
                <td>{{ item.transaction[0].transaction.product_description }}</td> <!-- Acceso al product_description -->
  

              <td class="text-center" style="width: 5rem;">
                  <VBtn icon size="x-small" color="default" variant="text" @click="mostrarAlertaTransactionId(item.transaction_id, item._id)">
                    <VIcon size="22" icon="mdi-credit-card-refund" />
                  </VBtn>
                </td>

              </tr>
            </tbody>
            <tfoot v-show="!paginatedReembolsos.length && !loadingReembolsos">
              <tr>
                <td colspan="6" class="text-center">No hay datos que mostrar</td>
              </tr>
            </tfoot>
            <tfoot v-show="loadingReembolsos">
              <tr>
                <td colspan="6" class="text-center">Cargando datos, por favor espere un momento...</td>
              </tr>
            </tfoot>
          </VTable>
          <VDivider />
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
            <span class="text-sm text-disabled">{{ paginationData }}</span>
            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
// ... (mantener los estilos existentes)
</style>
