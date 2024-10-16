<script setup>
import { avatarText } from '@core/utils/formatters'
import { ref, watch, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { extendMoment } from 'moment-range'
import Moment from 'moment-timezone'
import esLocale from "moment/locale/es"

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])
moment.tz.setDefault('America/Guayaquil')

const meses = {
  'January': 'enero', 'February': 'febrero', 'March': 'marzo', 'April': 'abril',
  'May': 'mayo', 'June': 'junio', 'July': 'julio', 'August': 'agosto',
  'September': 'septiembre', 'October': 'octubre', 'November': 'noviembre', 'December': 'diciembre'
}

// Referencias reactivas
const transactions = ref([])
const filteredTransactions = ref([])
const currentPage = ref(1)
const totalPage = ref(0)
const rowPerPage = ref(10)
const loadingTransactions = ref(false)
const searchQuery = ref('')
const isDownloading = ref(false);

// Agregar estas nuevas referencias reactivas
const selectedTransaction = ref(null)
const isModalOpen = ref(false)

const buscarErrorPaymentez = function (num_error){
    const listaError = {
        "0" : "Esperando pago.",
        "1" : "Se requiere verificación, consulte la sección Verificación.",
        "2" : "Pagado parcialmente",
        "3" : "Pagado.",
        "4" : "En disputa.",
        "5" : "Pagado en exceso",
        "6" : "Fraude.",
        "7" : "Reembolso.",
        "8" : "Contracargo",
        "9" : "Rechazado por el transportista.",
        "10" : "Error del sistema.",
        "11" : "Fraude Nuvei.",
        "12" : "Lista negra de Nuvei.",
        "13" : "Tolerancia del tiempo.",
        "14" : "Caducado por Nuvei",
        "15" : "Caducado por el transportista.",
        "16" : "Rechazado por Nuvei",
        "17" : "Abandonado por Nuvei",
        "18" : "Abandonado por el cliente",
        "19" : "Código de autorización no válido.",
        "20" : "El código de autorización expiró.",
        "21" : "Fraude Nuvei - Reembolso pendiente.",
        "22" : "Código de autenticación no válido: reembolso pendiente.",
        "23" : "El código de autenticación expiró: reembolso pendiente.",
        "24" : "Fraude Nuvei: reembolso solicitado.",
        "25" : "Código de autenticación no válido: reembolso solicitado.",
        "26" : "El código de autenticación expiró: se solicitó un reembolso.",
        "27" : "Comerciante - Reembolso pendiente.",
        "28" : "Comerciante: reembolso solicitado.",
        "29" : "Anulado.",
        "30" : "Transacción asentada (solo Ecuador).",
        "31" : "Esperando OTP.",
        "32" : "OTP successfully validated.",
        "33" : "OTP no validada.",
        "34" : "Partial refund.",
        "35" : "Método 3DS solicitado, esperando continuar.",
        "36" : "Desafío 3DS solicitado, esperando CRES.",
        "37" : "Rechazado por 3DS.",
        "47" : "Falla en la validación del CPF.",
        "48" : "Autenticado por 3DS",
    };

    if(!listaError.hasOwnProperty(num_error)){
        return {
            estado_suscripcion:0,
            num_error,
            msj: "No encontrado"
        }
    }

    return {
        estado_suscripcion: num_error == 3 ? 1 : 0,
        num_error,
        msj: listaError[num_error]
    }
}


// Función para obtener transacciones
async function getTransactions(page, limit) {
  loadingTransactions.value = true
  try {
    const url = `https://ecuavisa-suscripciones.vercel.app/backoffice/transaction-all?page=${page}&limit=${limit}`
    const response = await fetch(url)
    const data = await response.json();

    if (data.resp) {
      var allTransactions = [];

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
        const dateA = a.transaction && a.created_at ? new Date(a.created_at) : new Date(0)
        const dateB = b.transaction && b.created_at ? new Date(b.created_at) : new Date(0)
        return dateB - dateA
      })

      allTransactions = eliminarDuplicados(allTransactions);

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
      (user?._id?.toLowerCase().includes(query)) ||
      (user?.email?.toLowerCase().includes(query)) ||
      (trans?.id?.toLowerCase().includes(query))
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

// Agregar esta nueva función para abrir el modal
function openModal(transaction) {
  selectedTransaction.value = transaction
  isModalOpen.value = true
}

// Función auxiliar para formatear la fecha
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss')
}

// Función auxiliar para formatear la fecha
function formatPaymentDate(dateString) {
  if (!dateString) return 'Fecha no disponible'
  const fecha = moment(dateString)
  const mesEnIngles = fecha.format('MMMM')
  const mesEnEspanol = meses[mesEnIngles]
  return `Pagado el ${fecha.format('D [de] ')}${mesEnEspanol}${fecha.format(' [de] YYYY')}`
}

function formatDateCSV(dateString) {
  if (!dateString) return 'Fecha no disponible'
  const fecha = moment(dateString)
  const mesEnIngles = fecha.format('MMMM')
  const mesEnEspanol = meses[mesEnIngles]
  return `${fecha.format('D [de] ')}${mesEnEspanol}${fecha.format(' [de] YYYY')}`
}

// Función para generar y descargar el CSV
function downloadExcel() {
  if (!selectedTransaction.value) return;

  const transaction = selectedTransaction.value;
  const user = Array.isArray(transaction.user) ? transaction.user[0] : transaction.user;
  const trans = transaction.transaction;

  // Crear las filas del CSV
  const rows = [
    ['Factura'],
    ['Número de factura', trans?.id || 'N/A'],
    ['Fecha de emisión', formatDateCSV(transaction.created_at)],
    ['Fecha de vencimiento', formatDateCSV(transaction.created_at)],
    [],
    ['Facturado a'],
    ['Nombre', `${user?.first_name || ''} ${user?.last_name || ''}`],
    ['Email', user?.email || 'N/A'],
    [],
    ['Descripción', 'Cantidad', 'Precio unitario', 'Importe'],
    [
      `${transaction.paquete?.nombre || 'N/A'}`,
      '1',
      trans?.amount || '0.00'
    ],
    [],
    ['', '', 'Subtotal', trans?.amount || '0.00'],
    ['', '', 'Total', trans?.amount || '0.00'],
    ['', '', 'Importe debido', `${trans?.amount || '0.00'} USD`]
  ];

  // Convertir las filas a formato CSV
  const csvContent = rows.map(row => row.join(',')).join('\n');

  // Crear un Blob con el contenido CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Crear un enlace para descargar el archivo
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `factura-${trans?.id || 'desconocido'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Definimos la variable con los datos de las tarjetas
const cardTypes = {
  ex: 'Exito',
  ak: 'Alkosto',
  cd: 'Codensa',
  sx: 'Sodexo',
  ol: 'Olimpica',
  ep: 'EPM',
  csd: 'Colsubsidio',
  bbva: 'BBVA',
  cmr: 'Falabella',
  cn: 'Carnet',
  cs: 'Credisensa',
  so: 'Solidario',
  up: 'Union Pay',
  el: 'Elo',
  jc: 'JCB',
  au: 'Aura',
  hpc: 'Hipercard',
  vi: 'Visa',
  mc: 'Mastercard',
  ax: 'American Express',
  di: 'Diners',
  dc: 'Discover',
  ms: 'Maestro'
};

const allTransactions = ref([]);

// Función para obtener el nombre completo de la tarjeta
const getCardTypeName = (code) => {
  return cardTypes[code] || code || 'N/A';
};

const eliminarDuplicados = (registros) => {
  // Crear un objeto para rastrear los IDs de transacción únicos
  const idsUnicos = new Set();

  // Filtrar el array para mantener solo el primer registro con cada transaction.id
  const resultado = registros.filter(item => {
    const idTransaccion = item.transaction.id;
    
    if (!idsUnicos.has(idTransaccion)) {
      idsUnicos.add(idTransaccion);
      return true;  // Deja el primer registro
    }
    return false;  // Ignora los duplicados
  });

  return resultado;
}

async function downloadCSV() {
  isDownloading.value = true
  allTransactions.value = []
  let currentPage = 1
  const limit = 500
  
  try {
    while (true) {
      const url = `https://ecuavisa-suscripciones.vercel.app/backoffice/transaction-all?page=${currentPage}&limit=${limit}`
      const response = await fetch(url)
      const data = await response.json()
      
      if (!data.resp || (!data.transacciones_realizadas.length && !data.transacciones_fallidas.length)) {
        break
      }
      
      allTransactions.value = eliminarDuplicados(allTransactions.value.concat(data.transacciones_realizadas, data.transacciones_fallidas))
      currentPage++
    }
    
    const csvContent = generateCSV(allTransactions.value);
    downloadFile(csvContent, 'transacciones.csv')
  } catch (error) {
    console.error('Error al descargar el CSV:', error)
    // Aquí puedes manejar el error, por ejemplo, mostrando una notificación al usuario
  } finally {
    isDownloading.value = false
  }
}

function generateCSV(transactions) {
  const headers = [
    'Nombre', 'Apellido', 'Email', 'ID Transacción', 'Banco',
    'Tipo Tarjeta', 'Paquete', 'Fecha de Pago', 'Precio con IVA', 'Estado'
  ]
  
  const rows = transactions.map(item => {
    const user = Array.isArray(item.user) ? item.user[0] : item.user
    const trans = item.transaction
    return [
      user?.first_name || 'N/A',
      user?.last_name || 'N/A',
      user?.email || 'N/A',
      trans?.id || 'N/A',
      item.card_details?.bank_name || 'N/A',
      getCardTypeName(item.card_details?.type.toLowerCase()),
      item.paquete?.nombre || 'N/A',
      item.created_at ? moment(item.created_at).format('DD-MM-YYYY HH:mm:ss') : 'N/A',
      trans?.amount || 'N/A',
      // trans?.status_detail == '3' ? 'Realizada' : 'Fallida'
      buscarErrorPaymentez(trans?.status_detail).msj
    ]
  })
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

function downloadFile(content, fileName) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Función para calcular los totales
function calculateTotals() {
  totalTransactions.value = transactions.value.length
  activeUsers.value = transactions.value.filter(t => 
    t.transaction && t.transaction.status_detail === '3'
  ).length
}


// Lifecycle hooks
onMounted(() => {
  getTransactions(1, 10000)  // Inicialmente cargamos 100 transacciones
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

              <VTextField v-model="searchQuery" label="Buscar..." prepend-inner-icon="mdi-magnify" single-line
              hide-details @keyup.enter="buscarUsuarios" style="width: 300px;" />

          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top flex-column">

            <VBtn @click="downloadCSV" variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share" :loading="isDownloading">
              Exportar datos
            </VBtn>
            <small v-if="isDownloading">Descargando {{allTransactions.length}} registros</small>
          </div>
        </VCardText>



        <h6 class="text-caption text-secondary font-weight-semibold">Puedes filtrar por nombre, apellido, email, id de
          usuario y id de transacción</h6>

        <VCard class="mt-1">
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Email</th>
                <th scope="col">ID Transacción</th>
                <th scope="col">Banco</th>
                <th scope="col">Tipo Tarjeta</th>
                <th scope="col">Paquete</th>
                <th scope="col">Fecha de Pago</th>
                <th scope="col">Precio con iva</th>
                <th scope="col">Estado</th>
                <th scope="col">Acción</th>


              </tr>
            </thead>
            <tbody v-if="!loadingTransactions">
              <tr v-for="item in paginatedTransactions" :key="item._id" style="height: 3.75rem;">
                <td>{{ (Array.isArray(item.user) ? item.user[0]?.first_name : item.user?.first_name) || 'N/A' }}</td>
                <td>{{ (Array.isArray(item.user) ? item.user[0]?.last_name : item.user?.last_name) || 'N/A' }}</td>
                <td>{{ (Array.isArray(item.user) ? item.user[0]?.email : item.user?.email) || 'N/A' }}</td>
                <td>{{ item.transaction?.id || 'N/A' }}</td>

                <td>{{ item.card_details?.bank_name || 'N/A' }}</td>

                <td>{{ getCardTypeName(item.card_details?.type.toLowerCase()) }}</td>


                <td>{{ item.paquete?.nombre || 'N/A' }}</td>
                <td>{{ item.created_at ? moment(item.created_at).format('DD-MM-YYYY HH:mm:ss') :
                  'N/A' }}
                </td>
                <td>${{ item.transaction.amount }}</td>
                <td>
                  <VChip :color="item.transaction.status_detail == '3' ? 'success' : 'error'">
                    {{ buscarErrorPaymentez(item.transaction.status_detail).msj }}
                  </VChip>
                </td>

                <td>
                  <VBtn @click="openModal(item)" variant="plain" color="info" size="small">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="icon icon-tabler icons-tabler-outline icon-tabler-credit-card-pay">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
                      <path d="M3 10h18" />
                      <path d="M16 19h6" />
                      <path d="M19 16l3 3l-3 3" />
                      <path d="M7.005 15h.005" />
                      <path d="M11 15h2" />
                    </svg>
                  </VBtn>
                </td>

              </tr>
            </tbody>
            <tfoot v-show="!paginatedTransactions.length && !loadingTransactions">
              <tr>
                <td colspan="11" class="text-center">No hay datos que mostrar</td>
              </tr>
            </tfoot>
            <tfoot v-show="loadingTransactions">
              <tr>
                <td colspan="11" class="text-center">Cargando datos, por favor espere un momento...</td>
              </tr>
            </tfoot>
          </VTable>
          <VDivider />
          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
            <span class="text-sm text-disabled">{{ paginationData }}</span>
            <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" />
          </VCardText>
        </VCard>

        <!-- Modal para mostrar los detalles de la transacción -->
        <VDialog v-model="isModalOpen" max-width="500px">
          <VCard v-if="selectedTransaction">
            <!-- <VCardTitle>Detalles de la transacción</VCardTitle> -->
            <VCardText>
              <VList>
                <VListItem>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <VListItemTitle>Detalles de la transacción</VListItemTitle>
                      <h2 class="text-5xl mb-2 mt-2">${{ selectedTransaction.transaction?.amount || 'N/A' }}</h2>
                      <VListItemSubtitle>{{ formatPaymentDate(selectedTransaction.transaction?.payment_date) }}
                      </VListItemSubtitle>

                      <VBtn class="mt-3" color="secondary" variant="tonal" @click="downloadExcel" size="small">
                        Descargar Factura
                        <VIcon end icon="tabler-arrow-down" />
                      </VBtn>

                    </div>
                    <div>
                      <svg style="width: 120px ;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                      </svg>

                    </div>

                  </div>
                </VListItem>
                <div height="1" class="mt-3 mb-3"
                  style="border:0;border-collapse:collapse;margin:0;padding:0;height:1px;font-size:1px;background-color:rgb(235 235 235 / 20%);line-height:1px">
                  &nbsp;</div>
                <VListItem>
                  <div class="d-flex justify-space-between align-center">
                    <VListItemTitle>Estado</VListItemTitle>
                    <VListItemSubtitle>
                      <VChip :color="selectedTransaction.transaction.status_detail === 3 ? 'success' : 'error'">
                        {{ buscarErrorPaymentez(selectedTransaction.transaction.status_detail).msj }}
                      </VChip>
                    </VListItemSubtitle>

                  </div>
                </VListItem>
                <VListItem>
                  <div class="d-flex justify-space-between align-center">
                    <VListItemTitle>ID</VListItemTitle>
                    <VListItemSubtitle>{{ selectedTransaction.transaction?.id || 'N/A' }}</VListItemSubtitle>
                  </div>

                </VListItem>

                <VListItem>
                  <div class="d-flex justify-space-between align-center">
                    <VListItemTitle>Producto</VListItemTitle>
                    <VListItemSubtitle>{{ selectedTransaction.paquete?.nombre || 'N/A' }}</VListItemSubtitle>
                  </div>
                </VListItem>
                <div v-if="selectedTransaction.user">
                  <VListItem>
                    <div class="d-flex justify-space-between align-center">
                      <VListItemTitle>Nombres</VListItemTitle>
                      <VListItemSubtitle> {{ selectedTransaction.user?.first_name }} {{
                        selectedTransaction.user?.last_name }}</VListItemSubtitle>

                    </div>
                  </VListItem>
                  <VListItem>
                    <div class="d-flex justify-space-between align-center">
                      <VListItemTitle>Email</VListItemTitle>
                      <VListItemSubtitle> {{ selectedTransaction.user?.email }}</VListItemSubtitle>

                    </div>
                  </VListItem>

                </div>
              </VList>


            </VCardText>
            <VCardActions>
              <VSpacer></VSpacer>
              <VBtn color="blue darken-1" text @click="isModalOpen = false">Cerrar</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>





      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
// ... (mantener los estilos existentes)</style>