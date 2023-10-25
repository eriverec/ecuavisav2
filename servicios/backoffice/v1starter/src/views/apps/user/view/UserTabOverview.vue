<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
//import UserInvoiceTable from './UserInvoiceTable.vue'
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);


const p = defineProps({
  userData: {
    type: Object,
    required: true,
  },
});
const createD = ref(0);
const updateD = ref(0);
const loginD = ref(0);
const currentTab = ref('');
const dataIntereses = ref([]);
const dataTrazabilidad = ref([]);
const itemsPerPage = 8;
const currentPage = ref(1);
const isLoading = ref(false);

async function getIntereses() {
  await fetch(`https://sugerencias-ecuavisa.vercel.app/interes/all?userId=${p.userData.wylexId}`)
    .then(response => response.json())
    .then(resp => {
      let dataRaw = resp.data;
      let dataInt = Array.from(resp.dataInteresSeguido);
      const finalArray = [];
      for (let i in dataInt) {
        let match = dataRaw.find(a => { return a.interesId == dataInt[i].interesId });
        finalArray.push(match);
      }
      dataIntereses.value = finalArray;

    });
}

async function getTrazabilidad() {
  isLoading.value = true;

  const consulta = await fetch('https://servicio-de-actividad.vercel.app/actividad/usuario/' + p.userData.wylexId);
  const consultaJSON = await consulta.json();

  if (consultaJSON.resp === false) {
    isLoading.value = false;
  }

  if (consultaJSON.resp === true) {
    const dataRaw = consultaJSON.data;
    console.log('trazabilidad ', dataRaw);
    const arrayFiltro = [];
    for (let i of dataRaw.navigationRecord) {

      var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'D/M/YYYY'];
      var allowedFullDateFormats = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY H:mm:ss', 'DD/MM/YYYY H:mm:ss a', 'DD/MM/YYYY HH:mm:ss a'];
      let fechaFormat = moment(i.fecha, allowedDateFormats, true).format('DD/MM/YYYY');
      let horaFix = i.hora.split(':');
      if (horaFix[2].indexOf(' ') >= 0) {
        let slot3 = horaFix[2].split(' ');
        horaFix[2] = slot3[0];
      }
      let horaFinal = horaFix[0] + ':' + horaFix[1] + ':' + horaFix[2];
      let fullFecha = fechaFormat + ' ' + horaFinal;
      let fullFechaFormat = moment(fullFecha, allowedFullDateFormats, true).format();

      let data = {
        url: i.url,
        title: i.title,
        fecha: fechaFormat,
        fechaRaw: i.fecha,
        fullFecha: fullFechaFormat,
        hora: horaFinal,
      }
      arrayFiltro.push(data);
    }



    arrayFiltro.sort((a, b) => {
      var timestampA = new Date(a.fullFecha);
      var timestampB = new Date(b.fullFecha);
      return timestampB - timestampA;
    });

    let grupos = {};
    //console.log('arrayFiltro',arrayFiltro)
    arrayFiltro.forEach(obj => {
      let clave = obj.title;
      if (grupos.hasOwnProperty(clave)) {
        grupos[clave].cantidad = (grupos[clave].cantidad || 1) + 1;
      } else {
        obj.cantidad = 1;
        grupos[clave] = obj;
      }
    });

    let resultado = Object.values(grupos);

    resultado.sort((a, b) => {
      return b.cantidad - a.cantidad;
    });

    dataTrazabilidad.value = resultado;
    isLoading.value = false;

  }
}
const currentPageRecomendada = ref(1);
const notasRecomendadas = ref([]);
const isLoadingRecomendada = ref(false);
async function getNotasRecomendadas(){
  try {
    isLoadingRecomendada.value = true;
    const consulta = await fetch('https://servicio-de-actividad.vercel.app/recomendadas/'+p.userData.wylexId);
    const consultaJson = await consulta.json();
    if(consultaJson.resp){
      notasRecomendadas.value = consultaJson.data;
    }
    //console.log('recomendadas', consultaJson);
    isLoadingRecomendada.value = false;
  } catch (error) {
    console.error(error);
  }
}

const paginatedRecomendadas = computed(() => {
  const start = (currentPageRecomendada.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return notasRecomendadas.value.slice(start, end);
});

const nextPageRecomendada = () => {
  if (currentPageRecomendada.value * itemsPerPage < notasRecomendadas.value.length) currentPageRecomendada.value++;
};

const prevPageRecomendada = () => {
  if (currentPageRecomendada.value > 1) currentPageRecomendada.value--;
};

const currentPageNotasIntereses = ref(1);
const notasIntereses = ref([]);
const isLoadingNotasIntereses = ref(false);
async function getNotasIntereses(){
  try {
    isLoadingNotasIntereses.value = true;
    const consulta = await fetch('https://servicio-de-actividad.vercel.app/recomendadasIntereses/'+p.userData.wylexId);
    const consultaJson = await consulta.json();
    if(consultaJson.resp){
      notasIntereses.value = consultaJson.data;
    }
    //console.log('NotasIntereses', consultaJson);
    isLoadingNotasIntereses.value = false;
  } catch (error) {
    console.error(error);
  }
}

const paginatedNotasIntereses = computed(() => {
  const start = (currentPageNotasIntereses.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return notasIntereses.value.slice(start, end);
});

const nextPageNotasIntereses = () => {
  if (currentPageNotasIntereses.value * itemsPerPage < notasIntereses.value.length) currentPageNotasIntereses.value++;
};

const prevPageNotasIntereses = () => {
  if (currentPageNotasIntereses.value > 1) currentPageNotasIntereses.value--;
};

onMounted(async () => {
  await getIntereses();
  await getTrazabilidad();
  await getNotasRecomendadas();
  await getNotasIntereses();
});

const paginatedTrazabilidad = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataTrazabilidad.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataTrazabilidad.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const formatDate = function (date) {
  let dateF;
  if (date.includes("T")) {
    let splitT = date.split("T");
    if (splitT[1].includes('-')) {
      let splitF = splitT[1].split('-');
      dateF = splitT[0] + " " + splitF[0];
    } else {
      dateF = splitT[0] + " " + splitT[1];
    }
  } else {
    dateF = date;
  }
  return dateF;
};


var timeSince = function (date) {
  if (date) {
    if (typeof date !== 'object') {
      date = new Date(date);
    }


    var seconds = Math.floor((new Date() - date) / 1000);

    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = 'año';
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = 'mes';
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = 'día';
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = "hora";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = "minuto";
            } else {
              interval = seconds;
              intervalType = "segundo";
            }
          }
        }
      }
    }

    if (interval > 1 || interval === 0) {
      if (intervalType == "mes") { intervalType += 'es'; }
      else { intervalType += 's'; }
    }

    return 'Hace ' + interval + ' ' + intervalType;

  } else return null;
};

const resolveUserProgressVariant = (progress) => {
  if (progress <= 25) return "error";
  if (progress > 25 && progress <= 50) return "warning";
  if (progress > 50 && progress <= 75) return "primary";
  if (progress > 75 && progress <= 100) return "success";

  return "secondary";
};
</script>

<template>
  <VRow>
    <!--
    <VCol cols="12">
      <VCard title="User's Projects List">
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                PROJECT
              </th>
              <th scope="col">
                TOTAL TASK
              </th>
              <th scope="col">
                PROGRESS
              </th>
              <th scope="col">
                HOURS
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in projects"
              :key="project.name"
              style="height: 3.75rem;"
            >
              <td>
                <div class="d-flex align-center">
                  <VAvatar
                    :size="38"
                    class="me-3"
                    :image="project.logo"
                  />
                  <div>
                    <p class="text-base mb-0">
                      {{ project.name }}
                    </p>
                    <p class="text-sm text-disabled mb-0">
                      {{ project.project }}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                {{ project.totalTask }}
              </td>
              <td>
                <span>{{ project.progress }}%</span>
                <VProgressLinear
                  :height="8"
                  :model-value="project.progress"
                  rounded
                  :color="resolveUserProgressVariant(project.progress)"
                />
              </td>
              <td class="text-medium-emphasis">
                {{ project.hours }}
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
    -->


    <VCol cols="12">
      <!-- 👉 Activity timeline -->

      <VCard>
        <div class="pt-4 pl-4">
          <VTabs v-model="currentTab" class="v-tabs-pill">
            <VTab value="tab-actividad"> 
              <VIcon size="16"  class="me-2" icon="tabler-activity-heartbeat" />
              Actividad
            </VTab>
            <VTab value="tab-intereses">
              <VIcon size="16"  class="me-2" icon="tabler-eye-star" />
              Intereses
            </VTab>
            <VTab value="tab-trazabilidad">
              <VIcon size="16"  class="me-2" icon="tabler-binary-tree-2" />
              Trazabilidad
            </VTab>
            <VTab value="tab-notasRecomendadas">
              <VIcon size="16"  class="me-2" icon="tabler-binary-tree-2" />
              Notas recomendadas
            </VTab>
            <VTab value="tab-notasIntereses">
              <VIcon size="16"  class="me-2" icon="tabler-binary-tree-2" />
              Notas por intereses
            </VTab>
          </VTabs>
        </div>

        <VCardItem>
          <VWindow v-model="currentTab">
            <VWindowItem value="tab-actividad">

              <VTimeline density="compact" align="start" truncate-line="both" class="v-timeline-density-compact"> <!--
            <VTimelineItem dot-color="error" size="x-small">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <h4 class="text-base font-weight-semibold me-1">
                  12 Invoices have been paid
                </h4>
                <span class="text-sm text-disabled text-no-wrap"
                  >12 min ago</span
                >
              </div>
              <p class="mb-2">Invoices have been paid to the company</p>
              <div class="d-flex align-center mt-2">
                <VIcon
                  color="error"
                  icon="tabler-file"
                  size="18"
                  class="me-2"
                />
                <h6 class="font-weight-semibold text-sm">Invoices.pdf</h6>
              </div>
            </VTimelineItem>
 -->
                <VTimelineItem dot-color="primary" size="x-small">
                  <div class="d-flex justify-space-between align-center flex-wrap">
                    <h4 class="text-base font-weight-semibold me-1">
                      Último inicio de sesión
                    </h4>
                    <span class="text-sm text-disabled text-no-wrap">{{ timeSince(p.userData.logged_at) }}</span>
                  </div>

                  <p class="mb-1">{{ formatDate(p.userData.logged_at) }}</p>
                  <!--
              <div class="d-flex align-center mt-3">
                <VAvatar size="34" class="me-2" :image="avatar2" />
                <div>
                  <h6 class="text-sm font-weight-semibold mb-0">
                    John Doe (Client)
                  </h6>
                  <span>CEO of Kelly Group</span>
                </div>
              </div>
               -->

                </VTimelineItem>

                <VTimelineItem dot-color="info" size="x-small">
                  <div class="d-flex justify-space-between align-center flex-wrap">
                    <h4 class="text-base font-weight-semibold me-1">
                      Última modificación del usuario
                    </h4>
                    <span class="text-sm text-disabled text-no-wrap">{{ timeSince(p.userData.updated_at) }}</span>
                  </div>
                  <p class="mb-0">{{ formatDate(p.userData.updated_at) || 'No se han realizado modificaciones' }}</p>
                </VTimelineItem>

                <VTimelineItem dot-color="success" size="x-small">
                  <div class="d-flex justify-space-between align-center flex-wrap">
                    <h4 class="text-base font-weight-semibold me-1">
                      Creación del usuario
                    </h4>
                    <span class="text-sm text-disabled text-no-wrap">{{ timeSince(p.userData.created_at) }}</span>
                  </div>
                  <p class="mb-0">
                    {{ formatDate(p.userData.created_at) }}
                  </p>
                </VTimelineItem>
              </VTimeline>

            </VWindowItem>

            <VWindowItem value="tab-intereses">

              <VTable v-if="dataIntereses.length" class="text-no-wrap">
                <!-- 👉 table head -->
                <thead>
                  <tr>
                    <th scope="col">Título</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in dataIntereses" style="height: 3rem">
                    <!-- 👉 User -->
                    <td>
                      {{ item.title }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
              <div v-else>No hay intereses que mostrar.</div>
            </VWindowItem>

            <VWindowItem value="tab-trazabilidad">
              <div v-if="isLoading">Cargando datos..</div>
              <VCardText v-else-if="dataTrazabilidad.length > 0">
                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">Página</th>
                      <th scope="col">Cantidad</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr class="clickable" v-for="item in paginatedTrazabilidad">
                      <td class="text-high-emphasis">
                        {{ item.title ? item.title : item.url }}
                      </td>
                      <td class="text-medium-emphasis">
                        {{ item.cantidad }}
                      </td>

                    </tr>
                  </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                  Página {{ currentPage }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                    :disabled="(currentPage * itemsPerPage) >= dataTrazabilidad.length">
                  </VBtn>
                </div>
              </VCardText>
              <div v-else>No existen datos de trazabilidad</div>

            </VWindowItem>

            <VWindowItem value="tab-notasRecomendadas">
              <div v-if="isLoadingRecomendada">Cargando datos..</div>
              <VCardText v-else-if="notasRecomendadas.length > 0">
                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">Título</th>
                      
                    </tr>
                  </thead>

                  <tbody>
                    <tr class="clickable" v-for="item in paginatedRecomendadas">
                      <td class="text-high-emphasis">
                        {{ item.title }}
                      </td>
                      

                    </tr>
                  </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageRecomendada" :disabled="currentPageRecomendada === 1"></VBtn>
                  Página {{ currentPageRecomendada }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageRecomendada"
                    :disabled="(currentPageRecomendada * itemsPerPage) >= notasRecomendadas.length">
                  </VBtn>
                </div>
              </VCardText>
              <div v-else>No ha navegado lo suficiente para recomendar notas</div>

            </VWindowItem>

            <VWindowItem value="tab-notasIntereses">
              <div v-if="isLoadingNotasIntereses">Cargando datos..</div>
              <VCardText v-else-if="notasIntereses.length > 0">
                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">Título</th>
                      
                    </tr>
                  </thead>

                  <tbody>
                    <tr class="clickable" v-for="item in paginatedNotasIntereses">
                      <td class="text-high-emphasis">
                        {{ item.title }}
                      </td>
                      
                    </tr>
                  </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageNotasIntereses" :disabled="currentPageNotasIntereses === 1"></VBtn>
                  Página {{ currentPageNotasIntereses }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageNotasIntereses"
                    :disabled="(currentPageNotasIntereses * itemsPerPage) >= notasIntereses.length">
                  </VBtn>
                </div>
              </VCardText>
              <div v-else>No existen notas para mostrar</div>

            </VWindowItem>
          </VWindow>
        </VCardItem>





      </VCard>
    </VCol>
    <!--
    <VCol cols="12">
      <UserInvoiceTable />
    </VCol>
     -->
  </VRow>
</template>
