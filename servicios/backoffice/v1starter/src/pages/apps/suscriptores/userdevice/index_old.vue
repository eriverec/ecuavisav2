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
const dataUsuarios = ref([])
const filteredUsuarios = ref([])
const currentPage = ref(1)
const totalPage = ref(0)
const rowPerPage = ref(10)
const loadingUsuarios = ref(false)
const isFullLoading = ref(false)
const isLoadingExport = ref(false)

const searchQuery = ref('')
const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false
})

// Función para obtener usuarios de una página específica
async function getUsuariosPage(page, limit) {
  const url = `https://ecuavisa-suscripciones.vercel.app/suscripciones/all?page=${page}&limit=${limit}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.resp ? data : null;
}

// Función para obtener todos los usuarios
async function getAllUsuarios() {
  loadingUsuarios.value = true;
  try {
    let allUsers = [];
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const data = await getUsuariosPage(page, 100); // Usamos un límite más alto para reducir el número de llamadas
      if (data && data.data && data.data.length > 0) {
        allUsers = [...allUsers, ...data.data];
        page++;
      } else {
        hasMoreData = false;
      }
    }

    dataUsuarios.value = allUsers;
    filteredUsuarios.value = allUsers;
    totalRegistros.value = allUsers.length;
    totalPage.value = Math.ceil(allUsers.length / rowPerPage.value);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    configSnackbar.value = {
      message: "No se pudo recuperar los usuarios, recargue de nuevo.",
      type: "error",
      model: true
    };
  } finally {
    loadingUsuarios.value = false;
  }
}

// Función para buscar usuarios
function buscarUsuarios() {
  isFullLoading.value = true;
  const query = searchQuery.value.toLowerCase();

  filteredUsuarios.value = dataUsuarios.value.filter(item => {
    if (item.user && item.user.length > 0) {

      const firstName = item.user[0].first_name.toLowerCase();
      const lastName = item.user[0].last_name.toLowerCase();

      return firstName.includes(query) || lastName.includes(query);
    }
    return false;
  }
  );
  currentPage.value = 1;
  totalPage.value = Math.ceil(filteredUsuarios.value.length / rowPerPage.value);
  isFullLoading.value = false;
}

// Watchers
watch(rowPerPage, () => {
  currentPage.value = 1;
  totalPage.value = Math.ceil(filteredUsuarios.value.length / rowPerPage.value);
})

// Computed properties
const paginationData = computed(() => {
  const firstIndex = filteredUsuarios.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, filteredUsuarios.value.length);
  return `Mostrando ${firstIndex} a ${lastIndex} de ${filteredUsuarios.value.length} registros`;
})

const paginatedUsuarios = computed(() => {
  const start = (currentPage.value - 1) * rowPerPage.value;
  const end = start + rowPerPage.value;
  return filteredUsuarios.value.slice(start, end);
})

// Lifecycle hooks
onMounted(() => {
  getAllUsuarios();
})

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


// Función para obtener el nombre completo de la tarjeta
const getCardTypeName = (code) => {
  return cardTypes[code] || code || 'N/A';
};


const estadosUsuario = {
  0: "Esperando para ser Pagada",
  1: "Se requiere verificación, por favor revise la sección de Verificar",
  2: "Pagada Parcialmente",
  3: "Pagada",
  4: "En Disputa",
  5: "Sobrepagada",
  6: "Fraude",
  7: "Reverso",
  8: "Contracargo",
  9: "Rechazada por el procesador",
  10: "Error en el sistema",
  11: "Fraude detectado por Nuvei",
  12: "Blacklist de Nuvei",
  13: "Tiempo de tolerancia",
  14: "Expirada por Nuvei",
  15: "Expirado por el carrier",
  16: "Rechazado por Nuvei",
  17: "Abandonada por Nuvei",
  18: "Abandonada por el cliente",
  19: "Código de autorización invalido",
  20: "Código de autorización expirado",
  21: "Fraude Nuvei - Reverso pendiente",
  22: "AuthCode Inválido - Reverso pendiente",
  23: "AuthCode Expirado - Reverso pendiente",
  24: "Fraude Nuvei - Reverso solicitado",
  25: "AuthCode Inválido - Reverso solicitado",
  26: "AuthCode Expirado - Reverso solicitado",
  27: "Comercio - Reverso pendiente",
  28: "Comercio - Reverso solicitado",
  29: "Anulada",
  30: "Transacción asentada (solo para Ecuador)",
  31: "Esperando OTP",
  32: "OTP validado correctamente",
  33: "OTP no validado",
  34: "Reverso parcial",
  35: "Método 3DS solicitado, esperando para continuar",
  36: "Desafío 3DS solicitado, esperando el CRES",
  37: "Rechazada por 3DS",
  47: "Validación de CPF fallida",
  48: "Autenticado por 3DS"
};

// Función para obtener todos los usuarios para exportación
async function getAllUsuariosForExport() {
  let allUsers = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    const data = await getUsuariosPage(page, 100); // Usamos un límite más alto para reducir el número de llamadas
    if (data && data.data && data.data.length > 0) {
      allUsers = [...allUsers, ...data.data];
      page++;
    } else {
      hasMoreData = false;
    }
  }

  return allUsers;
}

// Función para exportar datos
async function exportarDatos() {
  try {
    isLoadingExport.value = true;
    const allUsers = await getAllUsuariosForExport();

    // Definir las columnas del CSV
    const columns = [
      'ID',
      'Nombre',
      'Apellido',
      'Email',
      // 'Estado',
      // 'Pagos',
      'País',
      'Ciudad'
      // 'Fecha de suscripcion',
      // 'Hora de suscripcion'
    ];

    // Crear el contenido del CSV
    let csvContent = columns.join(',') + '\n';


    allUsers.forEach(item => {
      const createdAt = new Date(item.created_at);
      const formattedDate = createdAt.toISOString().replace('T', ' ').substr(0, 19);
      
      const pagosTarjetas = item.pagos_tarjetas.map(pago => 
        `${pago.card_details.bank_name || 'N/A'} (${ getCardTypeName(pago.card_details.type) || 'N/A'})`
      ).join(' - ');
      
      
      const row = [
        item._id,
        item.user && item.user.length > 0 ? item.user[0].first_name : 'N/A',
        item.user && item.user.length > 0 ? item.user?.[0].last_name : 'N/A',
        item.user && item.user.length > 0 ? item.user?.[0].email : 'N/A',
        //item.estado ? 'Activo' : 'Inactivo',
        estadosUsuario[item.estado] || 'Estado desconocido',
         pagosTarjetas,
        item.billing_details.pais,
        item.billing_details.ciudad,
        moment(item.billing_details.created_at).format('DD/MM/YYYY'),
        moment(item.billing_details.created_at).format('HH:mm:ss')

      ];
      csvContent += row.join(',') + '\n';
    });

    // Crear y descargar el archivo CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_suscritos_${moment().format('YYYYMMDD_HHmmss')}.csv`);
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
    <!-- <Datos />
    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat"
      :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar> -->

    <VRow>
      <VCol cols="12" sm="12" lg="12">
        <VCard style="padding:25px;">
          <VCardTitle>
      <VIcon
        icon="tabler-devices"
        color="primary"
        size="24"
        class="me-2"
      />
      <span class="text-primary">Ver dispositivos</span>
      <span class="text-medium-emphasis"> de usuarios suscritos</span>
    </VCardTitle>
          <VCardText class="d-flex py-4 gap-4  flex-wrap" style="align-items: flex-start;">
          <div class="me-3 d-flex gap-4">
            <VSelect class="bg-white" v-model="rowPerPage" density="compact" variant="outlined"
              :items="[10, 20, 30, 50]" />

            <VTextField v-model="searchQuery" label="Buscar por nombre o apellido" prepend-inner-icon="mdi-magnify"
              single-line hide-details @keyup.enter="buscarUsuarios" style="width: 300px;" />

            <VBtn color="primary" :loading="isFullLoading" :disabled="isFullLoading || loadingUsuarios"
              @click="buscarUsuarios">
              Buscar
            </VBtn>


          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top">
            <!-- <VBtn :loading="isLoadingExport" :disabled="isLoadingExport || loadingUsuarios" variant="tonal"
              color="success" prepend-icon="tabler-screen-share" @click="exportarDatos">
              Exportar datos
            </VBtn> -->
          </div>
        </VCardText>
        <VDivider />
        <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Email</th>
                <!-- <th scope="col">Estado</th>
                <th scope="col">Pagos</th> -->
<!-- 
                <th scope="col">Pais</th>
                <th scope="col">Ciudad</th> -->
                <!-- <th scope="col">Fecha de suscripcion</th> -->
                <!-- <th scope="col">ID Medio Pago</th> -->
                <th scope="col">Ver dispositivos</th>
              </tr>
            </thead>
            <tbody v-if="!loadingUsuarios">
              <tr v-for="item in paginatedUsuarios" :key="item._id" style="height: 3.75rem;">

                <td>{{ item.user && item.user.length > 0 ? item.user[0].first_name : 'N/A' }} </td>
                <td>{{ item.user && item.user.length > 0 ? item.user[0].last_name : 'N/A' }}</td>
                <td>{{ item.user && item.user.length > 0 ? item.user[0].email : 'N/A' }}</td>
                <!-- <td>
                  <VChip :color="item.estado == '3' ? 'success' : 'error'">
                   {{ estadosUsuario[item.estado] || 'Estado desconocido' }}
                  </VChip>
                </td>

                <td>
                  <ul>
                    <li style="list-style: circle;" v-for="pago in item.pagos_tarjetas"
                      :key="pago.transaction.transaction_id">
                      {{ pago.card_details.bank_name || 'N/A' }} ({{ getCardTypeName(pago.card_details.type) }})
                    </li>
                  </ul>
                </td> -->
<!-- 
                <td>{{ item.billing_details.pais }}</td>
                <td>{{ item.billing_details.ciudad }}</td> -->
                <!-- <td>{{ moment(item.billing_details.created_at).format('DD/MM/YYYY HH:mm:ss') }}</td> -->

                <!-- <td>{{ item.idMediopago }}</td> -->
                <td class="text-center" style="width: 5rem;">
                  <VBtn icon size="x-small" color="default" variant="text"
                    :to="{ name: 'apps-suscriptores-userdevice-id', params: { id: item.user && item.user.length > 0 ? item.user[0].wylexId : '0' } }">
                    <VIcon size="22" icon="tabler-devices" />
                  </VBtn>
                </td>
              </tr>
            </tbody>
            <tfoot v-show="!paginatedUsuarios.length && !loadingUsuarios">
              <tr>
                <td colspan="9" class="text-center">No hay datos que mostrar</td>
              </tr>
            </tfoot>
            <tfoot v-show="loadingUsuarios">
              <tr>
                <td colspan="9" class="text-center">Cargando datos, por favor espere un momento...</td>
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
