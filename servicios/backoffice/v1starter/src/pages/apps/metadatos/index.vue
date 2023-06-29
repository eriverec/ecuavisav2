<script setup>
// import chartMetadatos from "@/views/charts/apex-chart/ChartMetadatosIdAnalytics.vue";
import ApexCharts from 'apexcharts'

const tab = ref('tab-meta-data')
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const itemsPerPage = 8;
const currentPage = ref(1);
const metadatos = ref([]);
const isLoading = ref(false);
const fechaIngresada = ref('');
const fechaIni = ref('');
const fechaFin = ref('');
const ultimasVisitas = ref([]);
const titleSelected = ref('');
const ultimasVisitasVisible = ref(false);
const visitasExport = ref([]);
const userSelected = ref('');
const actividadUsuario = ref([]);
const actividadUsuarioVisible = ref(false);
const selectedRow = ref(null);
const selectedRowUser = ref(null);
async function getMetadatos(fechai = '', fechaf = '') {
  isLoading.value = true;
  /*
  if(!fechai && !fechaf){
    fechai = moment().subtract(7, 'days').format("YYYY-MM-DD").toString();
    fechaf = moment().format("YYYY-MM-DD").toString();

    let formatedI = moment(fechai).format("DD-MM-YYYY").toString();
    let formatedF = moment(fechaf).format("DD-MM-YYYY").toString();

    fechaIngresada.value = formatedI + ' a ' + formatedF;
  }*/

  await fetch('https://servicio-de-actividad.vercel.app/meta/all/?' + new URLSearchParams({ fechai: fechai, fechaf: fechaf }))
    .then(response => response.json())
    .then(data => {
      metadatos.value = data.data;
      isLoading.value = false;
    })
    .catch(error => { return error });

}

const initData = () => {
  let fechai = moment().subtract(7, 'days').format("DD-MM-YYYY").toString();
  let fechaf = moment().format("DD-MM-YYYY").toString();
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
}

onMounted(() => {
  initData();
});

const paginatedMeta = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return metadatos.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < metadatos.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

async function obtenerPorFechaMeta(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      let fechaI = moment(selectedDates[0]).format('YYYY-MM-DD');
      let fechaF = moment(selectedDates[1]).format('YYYY-MM-DD');
      fechaIni.value = fechaI;
      fechaFin.value = fechaF;
      await getMetadatos(fechaI, fechaF);
      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

async function resolveVisitas(titulo) {
  titleSelected.value = titulo;
  selectedRow.value = titulo;
  isLoading.value = true;
  await fetch(`https://servicio-de-actividad.vercel.app/meta/usuario/${titulo}?fechai=${fechaIni.value}&fechaf=${fechaFin.value}`)
    .then(response => response.json())
    .then(data => {
      let rawData = Array.from(data.data);
      visitasExport.value = rawData;
      //console.log(visitasExport.value);
      const arrayFiltro = [];
      for (let p of rawData) {
        let user = p.user;
        var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'D/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'M/D/YYYY'];
        var allowedFullDateFormats = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY H:mm:ss'];
        let rawFecha = p.lastTimestamp.split(',');
        let fecha = rawFecha[0];
        let hora = rawFecha[1];
        let fechaFormat = moment(fecha, allowedDateFormats, true).format('DD/MM/YYYY');
        let horaFix = hora.split(':');
        if (horaFix[2].indexOf(' ') >= 0) {
          let slot3 = horaFix[2].split(' ');
          horaFix[2] = slot3[0];
        }
        let horaFinal = horaFix[0] + ':' + horaFix[1] + ':' + horaFix[2];
        let fullFecha = fechaFormat + ' ' + horaFinal.trim();
        let fullFechaFormat = moment(fullFecha, allowedFullDateFormats, true).format();

        let data = {
          userId: p.userId,
          first_name: user.first_name,
          last_name: user.last_name,
          fecha: fechaFormat,
          fullFecha: fullFechaFormat,
          hora: horaFinal,
          visitas: p.visitas
        }
        arrayFiltro.push(data);
      }

      arrayFiltro.sort((a, b) => {
        var timestampA = new Date(a.fullFecha);
        var timestampB = new Date(b.fullFecha);
        return timestampB - timestampA;
      });
      //console.log(arrayFiltro);
      ultimasVisitas.value = arrayFiltro.slice(0, 25);
      ultimasVisitasVisible.value = true;
      isLoading.value = false;
    })
    .catch(error => { return console.error(error) });
}

async function resolveUsuario(id, nombre, apellido) {
  userSelected.value = nombre + ' ' + apellido;
  selectedRowUser.value = id;
  console.log('ID:', id);
  isLoading.value = true;
  try {

    const existingChart = document.querySelector('#chart');
    if (existingChart) {
      // Si hay un gráfico existente, eliminarlo
      existingChart.innerHTML = '';
      // chart.destroy()
    }
    // const getIdRowUser = localStorage.getItem('idRowUser');
    const response = await fetch(`https://servicio-de-actividad.vercel.app/meta/navegation/group/${id}?fechai=${fechaIni.value}&fechaf=${fechaFin.value}`);
    const data = await response.json();
    
    if (data.resp) {
      const seriesData = data.data.map(item => item.count)
      const categories = data.data.map(item => item._id)
      console.log("seriesData:",seriesData);
      console.log("categories:",categories);


      // const series = [{
      //   name: 'Count',
      //   data: seriesData
      // }]

      const chartOptions = {
        chart: {
          toolbar: { show: false },
          type: 'bar',
          height: 500
        },
        series: [{
          name: 'Count',
          data: seriesData
        }],
        plotOptions: {
          bar: {
            borderRadius: 1,
            barHeight: '30%',
            horizontal: true,
            startingShape: 'rounded',
          },
        },
        grid: {
          borderColor: "#eee",
          xaxis: {
            lines: { show: false },
          },
          padding: {
            top: -10,
          },
        },
        xaxis: {
          categories: categories
        }
      }


      const chart = new ApexCharts(document.querySelector('#chart'), chartOptions)
      chart.render()
    }
  } catch (error) {
    console.error(error)
  }
  await fetch(`https://servicio-de-actividad.vercel.app/meta/navegation/${id}?fechai=${fechaIni.value}&fechaf=${fechaFin.value}`)
    .then(response => response.json())
    .then(data => {

      let rawData = Array.from(data.data);

      //console.log(rawData);
      const arrayFiltro = [];

      for (let p of rawData) {
        for (let i of p.navigationRecord) {

          var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'M/D/YYYY', 'D/M/YYYY'];
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
            first_name: p.first_name,
            last_name: p.last_name,
            url: i.url,
            title: i.title,
            fecha: fechaFormat,
            fechaRaw: i.fecha,
            fullFecha: fullFechaFormat,
            hora: horaFinal
          }
          arrayFiltro.push(data);
        }

      }

      arrayFiltro.sort((a, b) => {
        var timestampA = new Date(a.fullFecha);
        var timestampB = new Date(b.fullFecha);
        return timestampB - timestampA;
      });
      //console.log(arrayFiltro);
      actividadUsuario.value = arrayFiltro.slice(0, 10);
      actividadUsuarioVisible.value = true;
      isLoading.value = false;
    })
    .catch(error => { return console.error(error) });
}



// const fetchDataMetadatos = async () => {

// }

// fetchDataMetadatos()

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers && items[0].wylexId !== "wylexId") {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

async function downloadSelection() {
  const arrayExport = [];
  for (let i of visitasExport.value) {
    let user = i.user;
    let data = {
      userId: i.userId,
      first_name: user?.first_name,
      last_name: user?.last_name,
      avatar: user?.avatar,
      country: user?.country,
      email: user?.email,
      gender: user?.gender,
      identification_number: user?.identification_number,
      phone_number: user?.phone_number,
      provider: user?.provider,
      site: user?.site,
      lastTimestamp: i.lastTimestamp,
      visitas: i.visitas
    }
    arrayExport.push(data);
  }
  let headers = {
    userId: "userId",
    first_name: "first_name",
    last_name: "last_name",
    avatar: "avatar",
    country: "country",
    email: "email",
    gender: "gender",
    identification_number: "identification_number",
    phone_number: "phone_number",
    provider: "provider",
    site: "site",
    lastTimestamp: "lastTimestamp",
    visitas: "visitas"
  };

  let title = "ultimas_visitas_metadatos" + titleSelected.value.replace(/[^A-Z0-9]+/ig, "_");

  //if(usersFull.length > totalUsers){
  //console.log("arrayExport", arrayExport);
  exportCSVFile(headers, arrayExport, title);
  // }



};




</script>

<template>
  <div title="Metadatos, navegación de usuarios">
    <VTabs v-model="tab">
      <VTab value="tab-meta-data">
        Trazabilidad
      </VTab>
      <VTab value="account-details">
        Temas destacados
      </VTab>
      <!-- <VTab value="account-details">
        Account Details
      </VTab>
      <VTab value="social-links">
        Social Links
      </VTab> -->
    </VTabs>


    <br>

    <VWindow v-model="tab">
      <VWindowItem value="tab-meta-data">

        <VRow>
          <VCol lg="6" cols="12" sm="6">
            <VDialog v-model="isLoading" width="300">
              <VCard color="primary" width="300">
                <VCardText class="pt-3">
                  Espere porfavor
                  <VProgressLinear indeterminate color="white" class="mb-0" />
                </VCardText>
              </VCard>
            </VDialog>





            <VCard>



              <VCardText class="d-flex flex-wrap justify-space-between gap-4">

                <VCardItem class="pb-sm-0 pl-0 pt-0">
                  <VCardTitle>Metadatos</VCardTitle>
                  <VCardSubtitle>Un total de {{ metadatos.length }} registros</VCardSubtitle>
                </VCardItem>

                <div class="date-picker-wrapper" style="width: 300px;" v-if="!isLoading">
                  <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresada"
                    show-current=true @on-change="obtenerPorFechaMeta" :config="{
                      position: 'auto right',
                      mode: 'range',
                      altFormat: 'F j, Y',
                      dateFormat: 'd-m-Y',
                      maxDate: new Date(),
                      reactive: true

                    }" />
                </div>
                <!-- botonera de filtros guardados ##estado desactivado##-->
                <!--
        <VCol cols="12">
  
  <VBtnToggle v-if="!isLoading"   
        v-model="btnFiltros"
        color="primary"
        class="d-none"
        divided
      >
   <VBtn :value="item._id" @click="resolveFiltroSelection(item._id)" v-for="item  in filtrosVisitas">
    {{ item.nombre }}
   </VBtn>

   </VBtnToggle>

    </VCol>
  -->
              </VCardText>

              <VCardText>
                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">TÍTULO DE PÁGINA</th>
                      <th scope="col">VISITAS</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item  in paginatedMeta" class="clickable" :class="{ active: item._id === selectedRow }"
                      @click="resolveVisitas(item._id)">
                      <td>

                        {{ item._id }}

                      </td>

                      <td class="text-medium-emphasis">
                        {{ item.navegaciones }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                  Página {{ currentPage }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                    :disabled="(currentPage * itemsPerPage) >= metadatos.length">
                  </VBtn>


                </div>

              </VCardText>
            </VCard>
          </VCol>
          <VCol lg="6" cols="12" sm="6">
            <!-- trazabilidad independiente -->
            <VExpandTransition>
              <VCard v-show="ultimasVisitasVisible">
                <VCardItem class="pb-sm-0">
                  <div style="display: flex; flex-wrap: wrap;">
                    <div style="width: max-content;">
                      <VCardTitle>Últimas visitas a la página {{ titleSelected }}</VCardTitle>
                    </div>
                    <div style="margin-left: auto; margin-top: 1rem; margin-bottom: 1rem;">
                      <VBtn color="primary" @click="downloadSelection">
                        Exportar
                      </VBtn>
                    </div>
                  </div>

                  <div style="max-height: 520px;overflow: auto;">
                    <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                      <thead>
                        <tr>
                          <th scope="col">Nombre</th>
                          <th scope="col">Fecha</th>
                          <th scope="col">Visitas</th>
                          <th scope="col">Hora</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr class="clickable" :class="{ active: user.userId === selectedRowUser }"
                          v-for="user in ultimasVisitas"
                          @click="resolveUsuario(user.userId, user.first_name, user.last_name)">
                          <td class="text-high-emphasis">
                            {{ user.first_name }} {{ user.last_name }}
                          </td>
                          <td class="text-medium-emphasis">
                            {{ user.fecha }}
                          </td>
                          <td class="text-medium-emphasis">
                            {{ user.visitas }}
                          </td>
                          <td class="text-medium-emphasis">
                            {{ user.hora }}
                          </td>
                        </tr>
                      </tbody>
                    </VTable>
                  </div>
                </VCardItem>
              </VCard>
            </VExpandTransition>
          </VCol>
          <VCol lg="6" cols="12" sm="6">
            <!-- trazabilidad independiente -->
            <VExpandTransition id="actividadusuario">
              <VCard v-show="actividadUsuarioVisible">
                <VCardItem>
                  <VCardTitle>Actividad del usuario {{ userSelected }}</VCardTitle>
                </VCardItem>

                <VCardText v-if="actividadUsuario.length > 0">
                  <VTimeline density="compact" align="start" truncate-line="both" class="v-timeline-density-compact">
                    <VTimelineItem :dot-color="user.title === titleSelected ? 'success' : 'primary'" size="x-small" v-for="user in actividadUsuario">
                      <div class="d-flex justify-space-between align-center flex-wrap">
                        <h4 class="text-base font-weight-semibold me-1">
                          {{ user.title || user.url }}
                        </h4>


                      </div>

                      <p class="mb-1">{{ user.fecha }} {{ user.hora }}</p>

                    </VTimelineItem>

                  </VTimeline>
                </VCardText>
                <VCardText v-else>No existen datos</VCardText>
              </VCard>
            </VExpandTransition>
          </VCol>

          <VCol lg="6" cols="12" sm="6">
            <!-- trazabilidad independiente -->
            <VExpandTransition>
              <VCard v-show="actividadUsuarioVisible">
                <VCardItem>
                  <VCardTitle>
                    <h4>Temas con mayor interes para el cliente:</h4>
                    {{ userSelected }}
                  </VCardTitle>
                </VCardItem>
                <VCardText>
                  <!-- <chartMetadatos /> -->
                  <div id="chart"></div>

                  <!-- <VueApexCharts type="line" height="400" :options="chartOptions" :series="series" /> -->
                </VCardText>
              </VCard>
            </VExpandTransition>
          </VCol>
        </VRow>



      </VWindowItem>

      <VWindowItem value="account-details">
        Soy El gráfico
      </VWindowItem>
      <!-- <VWindowItem value="account-details">
            Soy detalis  ssss
          </VWindowItem>

          <VWindowItem value="social-links">
            Soy social sdddsdd
          </VWindowItem> -->
    </VWindow>


  </div>
</template>

<style scoped>
tr.clickable.active {
  background-color: #00000012;
}

.clickable {
  cursor: pointer;
}

@media (max-width: 1000px) {
  td span {
    max-width: 200px;
  }
}
</style>

<style>

.v-theme--dark .apexcharts-text.apexcharts-yaxis-label {
  fill: white;
}

.v-theme--dark .apexcharts-text.apexcharts-xaxis-label {
  fill: white;
}
</style>