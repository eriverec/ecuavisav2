<script setup>
import { logAction } from '@/middleware/activityLogger';
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
import chartMetadatos from "@/views/charts/apex-chart/ChartMetadatos.vue";
import ApexCharts from 'apexcharts';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted, ref } from 'vue';

const tab = ref('tab-meta-data')
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const itemsPerPage = 8;
const currentPage = ref(1);
const currentPageV = ref(1);
const currentPageT = ref(1);
const metadatos = ref([]);
const isLoading = ref(false);
const fechaIngresada = ref('');
const fechaIni = ref('');
const fechaFin = ref('');
const ultimasVisitas = ref([]);
const datosURLTemas = ref([]);
const datosURLTemasVisible = ref(false);
const titleSelected = ref('');
const ultimasVisitasVisible = ref(false);
const visitasExport = ref([]);
const userSelected = ref('');
const actividadUsuario = ref([]);
const actividadUsuarioFull = ref([]);
const actividadUsuarioVisible = ref(false);
const selectedRow = ref(null);
const selectedRowUser = ref(null);
const verMas = ref(false);
const searchQuery = ref('');
const metaRaw = ref([]);
const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());
const userBackoffice = ref(JSON.parse(localStorage.getItem('userData')));

const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY

const fecha = ref({
  i: valoresHoy.i,
  f: valoresHoy.f,
  title: valoresHoy.title
});

const selectedfechaIniFin = ref('Hoy');
const fechaIniFinList = useSelectCalendar();

function mergeAndSum(obj1, obj2) {
  const merged = {};

  // Unificar los registros de obj1 en el objeto merged
  for (const item of obj1) {
    const id = item._id;
    if (!merged[id]) {
      merged[id] = { ...item };
    } else {
      merged[id].navegaciones += item.navegaciones;
    }
  }

  // Unificar los registros de obj2 en el objeto merged
  for (const item of obj2) {
    const id = item._id;
    if (!merged[id]) {
      merged[id] = { ...item };
    } else {
      merged[id].navegaciones += item.navegaciones;
    }
  }

  // Convertir merged en un array de objetos
  const result = Object.values(merged);

  return result;
}

async function sortByVariable(data, variableName, order = 'asc') {
  if (order !== 'asc' && order !== 'desc') {
    throw new Error('Invalid order. Use "asc" for ascending or "desc" for descending.');
  }

  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (order === 'asc') {
      return a[variableName] < b[variableName] ? -1 : 1;
    } else {
      return a[variableName] > b[variableName] ? -1 : 1;
    }
  });

  return sortedData;
}

async function getMetadatos(fechai = '', fechaf = '') {
  // isLoading.value = true;
  /*
  if(!fechai && !fechaf){
    fechai = moment().subtract(7, 'days').format("YYYY-MM-DD").toString();
    fechaf = moment().format("YYYY-MM-DD").toString();

    let formatedI = moment(fechai).format("DD-MM-YYYY").toString();
    let formatedF = moment(fechaf).format("DD-MM-YYYY").toString();

    fechaIngresada.value = formatedI + ' a ' + formatedF;
  }*/

  var metadatosFetch = [];
  let skip = 1;
  let batchSize = 700;

  while (true) {
    // const batchTrazabilidad = await getAllPaginasSesionesHome(fechai, fechaf, batchSize, skip);
    const response = await fetch('https://servicio-de-actividad.vercel.app/meta/all/?' + new URLSearchParams({ 
      fechai: fechai, 
      fechaf: fechaf,
      limit: batchSize,
      page: skip
    }));
    const data = await response.json();
    // console.log("Nombre: ",skip, data.data.length)
    if (data.data.length === 0) {
      break;
    }

    const listadoDepurado = data.data.filter(item => (
        item.vocname !== "ecv_author" && 
        item.vocname != "usuarios_ecuavisa"
      ));
    metadatosFetch = mergeAndSum(metadatosFetch, listadoDepurado);

    metaRaw.value = await sortByVariable(Object.values(metadatosFetch), "navegaciones", "desc");
    metadatos.value = await sortByVariable(Object.values(metadatosFetch), "navegaciones", "desc");
    // metadatosFetch.push(...data.data);
    skip += 1;
  }
    console.log(metadatos.value)


  // isLoading.value = false;

  // await fetch('https://servicio-de-actividad.vercel.app/meta/all/?' + new URLSearchParams({ fechai: fechai, fechaf: fechaf }))
  //   .then(response => response.json())
  //   .then(data => {
  //     metaRaw.value = data.data;
  //     metadatos.value = data.data;
  //     isLoading.value = false;
  //   })
  //   .catch(error => { return error });

}

const initData = () => {
  // let fechai = moment().subtract(7, 'days').format("DD-MM-YYYY").toString();
  // let fechaf = moment().format("DD-MM-YYYY").toString();
  // fechaIni.value = fechai;
  // fechaFin.value = fechaf;
  fechaIngresada.value = fechaIni.value + ' a ' + fechaFin.value;
}

async function accionBackoffice (logData){
	if(userBackoffice.value.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify(logData);
			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: log,
				redirect: 'follow'
			};
			await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
			.then(response =>{			
			}).catch(error => console.log('error', error));
		}
};

onMounted(async() => {
  initData();

  let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
  fecha.value = {
      i: selectedCombo.i,
      f: selectedCombo.f,
      title: selectedCombo.title
  }

  currentPage.value = 1;
  let fechaI = selectedCombo.i.format('YYYY-MM-DD');
  let fechaF = selectedCombo.i.format('YYYY-MM-DD');
  fechaIni.value = fechaI;
  fechaFin.value = fechaF;
  await getMetadatos(fechaI, fechaF);
  /*
  await accionBackoffice({
            "usuario": userBackoffice.value.email,   
            "pagina": "trazabilidad-metadatos",
            "fecha": dateNowF.value
  });
  */
});

const searchMeta = () => {
  if (searchQuery.value !== '') {
    currentPage.value = 1;
    const normalizedSearchQuery = searchQuery.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const filtered = metaRaw.value.filter((item) => {
      const normalizedItemName = item._id.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedItemName.includes(normalizedSearchQuery);
    });

    metadatos.value = filtered;
  }
};

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

const reset = () => {
  currentPage.value = 1;
  searchQuery.value = '';
  ultimasVisitasVisible.value = false;
  actividadUsuarioVisible.value = false;
  metadatos.value = metaRaw.value;
};

async function obtenerPorFechaMeta(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      currentPage.value = 1;
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

/*PAGINADO TEMA FECHA*/
const paginatedMetas = computed(() => {
  const start = (currentPageT.value - 1) * (itemsPerPage);
  const end = start + (itemsPerPage);

  return datosURLTemas.value.slice(start, end);
});

const nextPageT = () => {
  if (currentPageT.value * itemsPerPage < datosURLTemas.value.length) currentPageT.value++;
};

const prevPageT = () => {
  if (currentPageT.value > 1) currentPageT.value--;
};
/*FIN PAGINA TEMA FECHA*/

async function recuperarURLPorTemas(titulo) {
  await fetch(`https://servicio-de-actividad.vercel.app/temas/navegation/${titulo}?fechai=${fechaIni.value}&fechaf=${fechaFin.value}`)
    .then(response => response.json())
    .then(d => {
      var data = d.data[0].navigationRecord;
      var newData = [];
      var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'M/D/YYYY', 'D/M/YYYY'];
      var allowedFullDateFormats = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY H:mm:ss', 'DD/MM/YYYY H:mm:ss a', 'DD/MM/YYYY HH:mm:ss a'];
      
      for(var i in data){
        const ins = data[i];

        var fechaFormat = moment(ins.fecha, allowedDateFormats, true).format('DD/MM/YYYY');
        var horaFix = ins.hora.split(':');
        if (horaFix[2].indexOf(' ') >= 0) {
          let slot3 = horaFix[2].split(' ');
          horaFix[2] = slot3[0];
        }
        let horaFinal = horaFix[0] + ':' + horaFix[1] + ':' + horaFix[2];
        let fullFecha = fechaFormat + ' ' + horaFinal;
        let fullFechaFormat = moment(fullFecha, allowedFullDateFormats, true).format();

        var dataTemp = {
          id: (i*1+1),
          url: ins.url,
          title: ins.title,
          fecha: fechaFormat,
          fechaRaw: ins.fecha,
          fullFecha: fullFechaFormat,
          hora: horaFinal
        }
        newData.push(dataTemp);
      }

      datosURLTemas.value = newData;
      
      isLoading.value = false;
    })
    .catch(error => { return console.error(error) });
}

async function resolveVisitas(titulo) {
  currentPageV.value = 1;
  currentPageT.value = 1;
  if (actividadUsuarioVisible.value == true) {
    actividadUsuarioVisible.value = false;
  }
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
        // console.log(fecha, fechaIni.value == fechaFin.value, fechaIni.value, moment(fecha, "DD-MM-YYYY").format("YYYY-MM-DD") == fechaIni.value)

        if( fechaIni.value == fechaFin.value ){
          if(moment(fecha, "DD-MM-YYYY").format("YYYY-MM-DD") == fechaIni.value){
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
        }else{
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
        
      }

      arrayFiltro.sort((a, b) => {
        var timestampA = new Date(a.fullFecha);
        var timestampB = new Date(b.fullFecha);
        return timestampB - timestampA;
      });
      //console.log(arrayFiltro);
      ultimasVisitas.value = arrayFiltro;
      ultimasVisitasVisible.value = true;
      isLoading.value = false;
    }).catch(error => { 
      isLoading.value = false;
      return console.error(error) 
    });

  await recuperarURLPorTemas(titulo);

}

const paginatedVisitas = computed(() => {
  const start = (currentPageV.value - 1) * (itemsPerPage);
  const end = start + (itemsPerPage);

  return ultimasVisitas.value.slice(start, end);
});

const nextPageV = () => {
  if (currentPageV.value * itemsPerPage < ultimasVisitas.value.length) currentPageV.value++;
};

const prevPageV = () => {
  if (currentPageV.value > 1) currentPageV.value--;
};

async function resolveUsuario(id, nombre, apellido) {
  verMas.value = false;
  userSelected.value = nombre + ' ' + apellido;
  selectedRowUser.value = id;
  //console.log('ID:', id);
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
      //console.log("seriesData:",seriesData);
      //console.log("categories:",categories);


      // const series = [{
      //   name: 'Count',
      //   data: seriesData
      // }]

      const chartOptions = {
        // tooltip: {
        //   enabled: true,
        //   y: {
        //     formatter: function(value) {
        //       // Personaliza el texto del tooltip aquí
        //       return value;
        //     }
        //   }
        // },
        chart: {
          toolbar: { show: false },
          type: 'bar',
          height: 500
        },
        series: [{
          name: 'Nivel de interés',
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

      setTimeout(function () {
        const chart = new ApexCharts(document.querySelector('#chart'), chartOptions)
        chart.render()
      }, 700);

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

          var tipo = "";
          var url = i.url;
          // Validar si la URL tiene más de 1 subcarpeta o contiene la palabra "metadatos"
          if (url.split("/").length > 5 || url.includes("metadatos")) {
            tipo = "Nota";
          } else {
            tipo = "Sección";
          }

          let data = {
            first_name: p.first_name,
            last_name: p.last_name,
            url: i.url,
            title: i.title,
            fecha: fechaFormat,
            fechaRaw: i.fecha,
            fullFecha: fullFechaFormat,
            hora: horaFinal,
            tipo
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
      actividadUsuarioFull.value = arrayFiltro;
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
  logAction("export");
  /*
  await accionBackoffice({
   "usuario": userBackoffice.value.email,   
   "pagina": "trazabilidad-metadatos",
   "accion": "export",
   "fecha": dateNowF.value
	});  
  */
  //if(usersFull.length > totalUsers){
  //console.log("arrayExport", arrayExport);
  exportCSVFile(headers, arrayExport, title);
  // }



};

watch(async () => selectedfechaIniFin.value, async () => {

  isLoading.value = true;
  let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
  fecha.value = {
      i: selectedCombo.i,
      f: selectedCombo.f,
      title: selectedCombo.title
  }

  currentPage.value = 1;
  let fechaI = selectedCombo.i.format('YYYY-MM-DD');
  let fechaF = selectedCombo.i.format('YYYY-MM-DD');
  fechaIni.value = fechaI;
  fechaFin.value = fechaF;
  await getMetadatos(fechaI, fechaF);

});

</script>

<template>
  <div title="Metadatos, navegación de usuarios">
    <VTabs v-model="tab">
      <VTab value="tab-meta-data">
        Trazabilidad
      </VTab>
      <VTab value="account-details" style="display: none;">
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
            <!-- <VDialog v-model="isLoading" width="300">
              <VCard color="primary" width="300">
                <VCardText class="pt-3">
                  Espere porfavor, obteniendo registros.. {{ metadatos.length }}
                  <VProgressLinear indeterminate color="white" class="mb-0" />
                </VCardText>
              </VCard>
            </VDialog> -->

            <VDialog v-model="isLoading" width="300">
              <VCardText class="pt-3 text-center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </VCardText>
            </VDialog>



            <VCard>



              <!-- <VCardText class="d-flex flex-wrap justify-space-between gap-4"> -->

                <!-- <VCardItem class="pb-sm-0 pl-0 pt-0">
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
                </div> -->
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
              <VCardItem class="header_card_item">
                <div class="d-flex">
                  <div class="descripcion">
                    <VCardTitle>Metadatos, Un total de {{ metadatos.length }} registros</VCardTitle>
                    <VCardSubtitle>Mostrando data desde {{fecha.i.format('YYYY-MM-DD')}} hasta {{fecha.f.format('YYYY-MM-DD')}}</VCardSubtitle>
                  </div>
                </div>

                <template #append>
                  <div class="bg-ecuavisa py-2">
                    <div class="date-picker-wrapper" style="width: 250px;">
                      <VCombobox :disabled="isLoading" v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint
                        hide-selected hint="" />
                    </div>
                  </div>
                </template>
              </VCardItem>

              <!-- </VCardText> -->
              <VCardText class="d-flex flex-wrap gap-4">
                <div style="width: 15rem">
                  <VTextField v-model="searchQuery" placeholder="Buscar..." density="compact" />
                </div>
                <!-- 👉 Search button -->
                <VBtn prepend-icon="tabler-search" @click="searchMeta">
                  Buscar
                </VBtn>
                <VBtn @click="reset">
                  Reiniciar
                </VBtn>
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

                <VCardText>
                  <div class="tab-titles">
                    <div @click="selectTabMeta(0)" :class="{ active: selectedTabMeta === 0 }">Últimas Visitas</div>
                    <div @click="selectTabMeta(1)" :class="{ active: selectedTabMeta === 1 }">Url</div>
                  </div>
                  <div class="tab-content">
                    <br>
                    <div v-if="selectedTabMeta === 0" class="tab-item">
                      <div style="display: flex; flex-wrap: wrap;">
                        <div style="width: max-content;">
                          <VCardTitle>
                            Visitantes en: <b>{{ titleSelected }}</b>

                          </VCardTitle>
                          <VCardSubtitle style="margin-top: -10px;font-size: 12px;">
                            Datos desde {{ fechaIni }} hasta {{ fechaFin }}
                          </VCardSubtitle>
                        </div>
                        <div style="margin-left: auto; margin-bottom: 0.80rem;">
                          <VBtn color="primary" @click="downloadSelection">
                            Exportar
                          </VBtn>
                        </div>
                      </div>
                      <div>
                        <!-- max-height: 520px;overflow: auto; -->
                        <div style="">
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
                                v-for="user in paginatedVisitas"
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
                        <div class="d-flex align-center justify-space-between botonescurrentPage">
                          <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageV" :disabled="currentPageV === 1">
                          </VBtn>
                          Página {{ currentPageV }}
                          <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageV"
                            :disabled="(currentPageV * itemsPerPage) >= ultimasVisitas.length">
                          </VBtn>
                        </div>
                      </div>
                    </div>
                    <div v-if="selectedTabMeta === 1" class="tab-item">
                      <div style="display: flex; flex-wrap: wrap;">
                        <div style="width: max-content;">
                          <VCardTitle>
                            URLs de: <b>{{ titleSelected }}</b>

                          </VCardTitle>
                          <VCardSubtitle style="margin-top: -10px;font-size: 12px;">
                            Datos desde {{ fechaIni }} hasta {{ fechaFin }}
                          </VCardSubtitle>
                        </div>
                        <!-- <div style="margin-left: auto; margin-bottom: 0.80rem;">
                          <VBtn color="primary" @click="downloadSelection">
                            Exportar
                          </VBtn>
                        </div> -->
                      </div>
                      <div>
                        <!-- max-height: 520px;overflow: auto; -->
                        <div style="">
                          <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                            <thead>
                              <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr 
                                v-if="datosURLTemas.length > 0"
                                v-for="item in paginatedMetas" 
                                :key="item.id" 
                              >
                                <td>
                                  <a style="" target="_blank" :href="item.url" class="d-flex align-center">
                                    <VIcon color="primary" icon="tabler-link" size="18" class="me-1" />
                                    <!-- <h6 class="text-primary font-weight-semibold text-sm">
                                      {{ item.title }}
                                    </h6> -->
                                    <small class="url-temas" style="margin-left:-12px">
                                      {{ item.url.replace(/https:\/\/www\.ecuavisa\.com/g, "") }}
                                    </small>
                                  </a>
                                </td>
                                <td class="text-medium-emphasis">
                                  {{ item.fechaRaw }}
                                </td>
                                <td class="text-medium-emphasis">
                                  {{ item.hora }}
                                </td>
                              </tr>
                              <tr v-else>
                                <td colspan="3">No hay datos</td>
                              </tr>
                            </tbody>
                          </VTable>
                        </div>
                        <div class="d-flex align-center justify-space-between botonescurrentPage">
                          <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageT" :disabled="currentPageT === 1">
                          </VBtn>
                          Página {{ currentPageT }}
                          <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageT"
                            :disabled="(currentPageT * itemsPerPage) >= datosURLTemas.length">
                          </VBtn>
                        </div>
                      </div>
                    </div>
                  </div>

                </VCardText>


              </VCard>
            </VExpandTransition>
          </VCol>
          <VCol lg="6" cols="12" sm="6">
            <!-- trazabilidad independiente -->
            <VExpandTransition id="actividadusuario">
              <VCard v-show="actividadUsuarioVisible">
                <VCardItem>
                  <VCardTitle>
                    Actividad del usuario <b>{{ userSelected }}</b>
                  </VCardTitle>
                  <VCardSubtitle style="margin-top: -2px;font-size: 12px;">
                    Datos desde {{ fechaIni }} hasta {{ fechaFin }}
                  </VCardSubtitle>
                </VCardItem>

                <VCardText v-if="actividadUsuario.length > 0">
                  <VTimeline density="compact" align="start" truncate-line="both" class="v-timeline-density-compact">
                    <VTimelineItem :dot-color="user.title === titleSelected ? 'success' : 'primary'" size="x-small"
                      v-for="user in verMas ? actividadUsuarioFull : actividadUsuario">
                      <div class="d-flex justify-space-between align-center flex-wrap">
                        <h4 class="text-base font-weight-semibold me-1">
                          {{ user.title || user.url }}
                        </h4>
                        <small><b>Tipo: </b>{{ user.tipo }}</small>
                      </div>

                      <p class="mb-1">{{ user.fecha }} {{ user.hora }}</p>
                      <div style="display:flex; gap: 20px;">
                        <a target="_blank" :href="user.url" class="d-flex align-center">
                          <VIcon color="primary" icon="tabler-link" size="18" class="me-1" />
                          <h6 class="text-primary font-weight-semibold text-sm">

                            <!-- {{ user.tipo=="Nota"?"Ir a la nota":"Ir a la sección" }} -->
                            {{ user.tipo == "Nota" ? "Visitar en la web" : "Ir a la sección" }}

                          </h6>
                        </a>
                        <a style="display: none!important;" v-if="user.tipo == 'Nota'" target="_blank"
                          :href="(user.url).replace(/\/[^\/]*$/, '')" class="d-flex align-center">
                          <VIcon color="primary" icon="tabler-link" size="18" class="me-1" />
                          <h6 class="text-primary font-weight-semibold text-sm">

                            Ir a la sección

                          </h6>
                        </a>
                      </div>
                      <br>
                      <VDivider />

                    </VTimelineItem>

                  </VTimeline>
                  <br>
                  <div style="text-align: center;">
                    <VBtn v-if="!verMas && actividadUsuarioFull.length > 10" color="primary" @click="verMas = true">Ver
                      más</VBtn>
                    <VBtn v-if="verMas && actividadUsuarioFull.length > 10" color="primary" @click="verMas = false">Ver
                      menos</VBtn>
                  </div>
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
                    Temas de mayor navegación del usuario: <b>{{ userSelected }}</b>
                  </VCardTitle>

                  <VCardSubtitle style="margin-top: -2px;font-size: 12px;">
                    Datos desde {{ fechaIni }} hasta {{ fechaFin }}
                  </VCardSubtitle>
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
        <chartMetadatos />
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

<script>
export default {
  data() {
    return {
      selectedTabMeta: 0,
    };
  },
  methods: {
    selectTabMeta(index) {
      this.selectedTabMeta = index;
    },
  },
};
</script>

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

.url-temas{
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  display: block;
  font-size: 12px;
  width: 280px;
  font-weight: 500;
  hyphens: auto;
  letter-spacing: 0.0125em;
  min-width: 0;
  overflow: hidden;
  padding: 0.5rem 1rem;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;
  word-break: normal;
  word-wrap: break-word;
}
</style>

<style>
.apexcharts-tooltip-title,
.apexcharts-tooltip-text span {
  color: white;
}

.v-theme--dark .apexcharts-text.apexcharts-yaxis-label {
  fill: white;
}

.v-theme--dark .apexcharts-text.apexcharts-xaxis-label {
  fill: white;
}
</style>

<style>
.tab-titles {
  display: flex;
}

.tab-titles div {
  cursor: pointer;
  /* background-color: lightgray; */
  margin-right: 8px;
  height: var(--v-tabs-height);
  padding: 10px 20px;
  text-transform: uppercase;
  font-size: .875rem;
  --v-btn-size: .875rem;
  --v-btn-height: 38px;
  font-weight: 500;
  letter-spacing: .0892857143em;
  line-height: normal;
}

.tab-titles div.active {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary)) !important;
  border-radius: 0.25rem !important;
}

.tab-content {
  margin-top: 16px;
}
</style>
  