<script setup>
import { extendMoment } from 'moment-range'
import Moment from 'moment-timezone'
import esLocale from "moment/locale/es"
import { computed, onMounted, ref, watch } from 'vue'

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])
moment.tz.setDefault('America/Guayaquil')

// Referencias
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


// Estado seleccionado (2 - pendiente por defecto)
const selectedState = ref('2')

// Lista de estados
const stateOptions = [
  { value: '2', text: 'Pendiente' },
  { value: '1', text: 'Proceso terminado' },
  { value: '3', text: 'Rechazado' },
  { value: '0', text: 'Sin proceso' }
]

// Alert para procesar reembolso
// Función para procesar devolución
async function procesarDevolucion(transactionId) {
  console.log('Iniciando proceso de devolución:', transactionId);
  const confirmacion = window.confirm(`¿Procesar devolución (${transactionId})?`);
  
  if (confirmacion) {
    try {
      console.log('Enviando solicitud de procesamiento al servidor...');
      const response = await fetch('https://ecuavisa-suscripciones.vercel.app/reembolso/backoffice-user/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transaction_id: transactionId,
          estado_reembolso: '1'  // '1' para proceso terminado
        }),
      });

      console.log('Respuesta recibida:', response);

      if (!response.ok) {
        throw new Error(`Error al procesar la devolución: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos de respuesta:', data);
      
      configSnackbar.value = {
        message: 'Devolución procesada exitosamente',
        type: 'success',
        model: true
      };
      
      getAllReembolsos();
    } catch (error) {
      console.error('Error detallado al procesar la devolución:', error);
      
      configSnackbar.value = {
        message: `Error al procesar la devolución: ${error.message}`,
        type: 'error',
        model: true
      };
    }
  }
}

// Función para rechazar devolución
async function rechazarDevolucion(transactionId) {
  console.log('Iniciando rechazo de devolución:', transactionId);
  const confirmacion = window.confirm(`¿Rechazar devolución (${transactionId})?`);
  
  if (confirmacion) {
    try {
      console.log('Enviando solicitud de rechazo al servidor...');
      const response = await fetch('https://ecuavisa-suscripciones.vercel.app/reembolso/backoffice-user/accept-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transaction_id: transactionId,
          estado_reembolso: '3'  // '3' para rechazado
        }),
      });

      console.log('Respuesta recibida:', response);

      if (!response.ok) {
        throw new Error(`Error al rechazar la devolución: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos de respuesta:', data);
      
      configSnackbar.value = {
        message: 'Devolución rechazada exitosamente',
        type: 'success',
        model: true
      };
      
      getAllReembolsos();
    } catch (error) {
      console.error('Error detallado al rechazar la devolución:', error);
      
      configSnackbar.value = {
        message: `Error al rechazar la devolución: ${error.message}`,
        type: 'error',
        model: true
      };
    }
  }
}
// Función para formatear la fecha
function formatDate(dateString) {
  return moment(dateString).format('DD/MM/YYYY HH:mm:ss');
}


async function getReembolsosPage(page, limit, estado) {
  const url = `https://ecuavisa-suscripciones.vercel.app/reembolso/backoffice/solicitudes-list?estado=${estado}&page=${page}&limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.resp ? data : null;
}

async function getAllReembolsos() {
  loadingReembolsos.value = true;
  try {
    let allReembolsos = [];
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const data = await getReembolsosPage(page, 100, selectedState.value);
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

watch(selectedState, (newValue) => {
  getAllReembolsos();
})

// Computed
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

// Nuevo computed para el mensaje cuando no hay datos
const noDataMessage = computed(() => {
  switch (selectedState.value) {
    case '2':
      return "No hay reembolsos pendientes que mostrar. Escoge otro estado.";
    case '1':
      return "No hay reembolsos procesados que mostrar. Escoge otro estado.";
    case '3':
      return "No hay reembolsos rechazados que mostrar. Escoge otro estado.";
    case '0':
      return "No hay reembolsos sin proceso que mostrar. Escoge otro estado.";
    default:
      return "No hay datos que mostrar";
  }
})

// Lifecycle hooks
onMounted(() => {
  getAllReembolsos();
})

async function getAllReembolsosForExport() {
  let allReembolsos = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    const data = await getReembolsosPage(page, 100, selectedState.value);
    if (data && data.data && data.data.length > 0) {
      allReembolsos = [...allReembolsos, ...data.data];
      page++;
    } else {
      hasMoreData = false;
    }
  }

  return allReembolsos;
}

async function exportarDatos() {
  try {
    isLoadingExport.value = true;
    const allReembolsos = await getAllReembolsosForExport();
    
    const columns = [
      'ID',
      'Nombre',
      'Apellido',
      'Email',
      'ID Transacción',
      'Nombre de Paquete'
    ];

    let csvContent = columns.join(',') + '\n';

    allReembolsos.forEach(item => {
      const row = [
        item._id,
        item.user.first_name,
        item.user.last_name,
        item.user.email,
        item.transaction_id,
        item.transaction[0].transaction.product_description
      ];
      csvContent += row.join(',') + '\n';
    });

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
            
            <VSelect
              v-model="selectedState"
              :items="stateOptions"
              item-title="text"
              item-value="value"
              label="Estado"
              density="compact"
              variant="outlined"
              style="width: 200px;"
              @update:model-value="getAllReembolsos"
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
                <th scope="col">Fecha de solicitud</th>
                <th scope="col">Nombre de Paquete</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody v-if="!loadingReembolsos">
              <tr v-for="item in paginatedReembolsos" :key="item._id" style="height: 3.75rem;">
                <td>{{ item.user.first_name }}</td>
                <td>{{ item.user.last_name }}</td>
                <td>{{ item.user.email }}</td>
                <td>{{ item.transaction[0].transaction.id }}</td>
                <td>{{ formatDate(item.created_at) }}</td>
                <td>{{ item.transaction[0].transaction.product_description }}</td>
                <td class="text-center" style="width: 5rem;">
                  <template v-if="selectedState === '2'">
                    <VBtn icon size="x-small" color="default" variant="text" @click="procesarDevolucion(item.transaction_id)">
                      <VIcon size="22" icon="mdi-credit-card-refund" />
                    </VBtn>
                    <VBtn icon size="x-small" color="error" variant="text" @click="rechazarDevolucion(item.transaction_id)">
                        <VIcon size="22" icon="mdi-close" />
                      </VBtn>
              
                  </template>
                  <VIcon v-else-if="selectedState === '1'" size="22" icon="mdi-check-circle" color="success" />
                  <VIcon v-else-if="selectedState === '3'" size="22" icon="mdi-close-circle" color="error" />
                </td>
              </tr>
            </tbody>
            <tfoot v-show="!paginatedReembolsos.length && !loadingReembolsos">
              <tr>
                <td colspan="7" class="text-center">{{ noDataMessage }}</td>
              </tr>
            </tfoot>
            <tfoot v-show="loadingReembolsos">
              <tr>
                <td colspan="7" class="text-center">Cargando datos, por favor espere un momento...</td>
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