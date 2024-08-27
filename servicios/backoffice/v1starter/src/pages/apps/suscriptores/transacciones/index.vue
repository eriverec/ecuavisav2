<script setup>
import { avatarText } from '@core/utils/formatters'
import { ref, watch, computed, onMounted } from 'vue'
import { extendMoment } from 'moment-range'
import Moment from 'moment-timezone'
import esLocale from "moment/locale/es"

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])
moment.tz.setDefault('America/Guayaquil')

// Referencias reactivas
const transactions = ref([])
const filteredTransactions = ref([])
const currentPage = ref(1)
const totalPage = ref(0)
const rowPerPage = ref(10)
const loadingTransactions = ref(false)
const searchQuery = ref('')

// Función para obtener transacciones
async function getTransactions(page, limit) {
  loadingTransactions.value = true
  try {
    const url = `https://servicios-ecuavisa-suscripciones.vercel.app/backoffice/transaction-all?page=${page}&limit=${limit}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.resp) {
      const allTransactions = [];

      // Procesar transacciones no fallidas
      if (Array.isArray(data.transacciones_realizadas)) {
        allTransactions.push(...data.transacciones_realizadas.map(t => ({ ...t, estado: 'Realizado' })))
      }

      // Procesar transacciones fallidas
      if (Array.isArray(data.transacciones_fallidas)) {
        allTransactions.push(...data.transacciones_fallidas.map(t => ({ ...t, estado: 'Fallida' })))
      }

      // Ordenar por fecha de pago descendente
      allTransactions.sort((a, b) => {
        const dateA = a.transaction && a.transaction.payment_date ? new Date(a.transaction.payment_date) : new Date(0)
        const dateB = b.transaction && b.transaction.payment_date ? new Date(b.transaction.payment_date) : new Date(0)
        return dateB - dateA
      })

      transactions.value = allTransactions
      filteredTransactions.value = allTransactions
      totalPage.value = Math.ceil(allTransactions.length / rowPerPage.value)
    } else {
      console.log('La respuesta de la API no fue exitosa')
    }
  } catch (error) {
    console.error('Error al obtener las transacciones:', error)
  } finally {
    loadingTransactions.value = false
  }
}

// Función para buscar transacciones
function searchTransactions() {
  const query = searchQuery.value.toLowerCase()
  filteredTransactions.value = transactions.value.filter(item => {
    const user = Array.isArray(item.user) ? item.user[0] : item.user
    const trans = Array.isArray(item.transaction) ? item.transaction[0] : item.transaction

    return (user?.first_name?.toLowerCase().includes(query)) ||
           (user?.last_name?.toLowerCase().includes(query)) ||
           (trans?.id?.toLowerCase().includes(query)) ||
           (user?.email?.toLowerCase().includes(query))
  })
  currentPage.value = 1
  totalPage.value = Math.ceil(filteredTransactions.value.length / rowPerPage.value)
}

// Watchers
watch(rowPerPage, () => {
  currentPage.value = 1
  totalPage.value = Math.ceil(filteredTransactions.value.length / rowPerPage.value)
})

watch(searchQuery, searchTransactions)

// Computed properties
const paginationData = computed(() => {
  const firstIndex = filteredTransactions.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, filteredTransactions.value.length)
  return `Mostrando ${firstIndex} a ${lastIndex} de ${filteredTransactions.value.length} registros`
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * rowPerPage.value
  const end = start + rowPerPage.value
  return filteredTransactions.value.slice(start, end)
})

// Lifecycle hooks
onMounted(() => {
  getTransactions(1, 100)  // Inicialmente cargamos 100 transacciones
})
</script>

<template>
  <section>


    <VRow>
      <VCol cols="12" sm="12" lg="12">
        <h1>Listado de Transaciones Totales</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;">
          <div class="me-3 d-flex gap-4">
            <VSelect class="bg-white" v-model="rowPerPage" density="compact" variant="outlined"
              :items="[10, 20, 30, 50]" />

            <VTextField v-model="searchQuery" label="Buscar por nombre o apellido" prepend-inner-icon="mdi-magnify"
              single-line hide-details @keyup.enter="buscarUsuarios" style="width: 300px;" />


          </div>

          <VSpacer />

    
        </VCardText>

        <VCard class="mt-1">
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Email</th>
                <th scope="col">ID Transacción</th>
                <th scope="col">Paquete</th>
                <th scope="col">Fecha de Pago</th>
                <th scope="col">Estado</th>

              </tr>
            </thead>
            <tbody v-if="!loadingTransactions">
              <tr v-for="item in paginatedTransactions" :key="item._id" style="height: 3.75rem;">
                <td>{{ (Array.isArray(item.user) ? item.user[0]?.first_name : item.user?.first_name) || 'N/A' }}</td>
                <td>{{ (Array.isArray(item.user) ? item.user[0]?.last_name : item.user?.last_name) || 'N/A' }}</td>
                <td>{{ (Array.isArray(item.user) ? item.user[0]?.email : item.user?.email) || 'N/A' }}</td>
                <td>{{ item.transaction?.id || 'N/A' }}</td>
                <td>{{ item.paquete?.nombre || 'N/A' }}</td>
                <td>{{ item.transaction?.payment_date ? moment(item.transaction.payment_date).format('YYYY-MM-DD HH:mm:ss') : 'N/A' }}</td>
                <td>
                  <VChip :color="item.estado === 'Realizado' ? 'success' : 'error'">
                    {{ item.estado }}
                  </VChip>
                </td>
              </tr>
            </tbody>
            <tfoot v-show="!paginatedTransactions.length && !loadingTransactions">
              <tr>
                <td colspan="7" class="text-center">No hay datos que mostrar</td>
              </tr>
            </tfoot>
            <tfoot v-show="loadingTransactions">
              <tr>
                <td colspan="7" class="text-center">Cargando datos, por favor espere un momento...</td>
              </tr>
            </tfoot>
          </VTable>
          <VDivider />
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
            <span class="text-sm text-disabled">{{ paginationData }}</span>
            <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
// ... (mantener los estilos existentes)</style>