

<template>
  <!-- -- -->
  <VRow style="margin-bottom: 0.5rem;">
    <VCol lg="12" cols="12" sm="6">
      <VTabs v-model="tabvisitas" class="v-tabs-pill">
        <VTab >
          Ecuavisa.com
        </VTab>
        <VTab >
          Notas drivers
        </VTab>
      </VTabs>
    </VCol>

  </VRow>

  <VWindow v-model="tabvisitas">
    <VWindowItem>
      <VRow>
        <VCol lg="12" cols="12" sm="6">

          <VCard>
            <VCardText class="d-flex flex-wrap justify-space-between gap-4">
              <VCardItem class="pb-sm-0">
                <VCardTitle>Páginas más vistas (Ecuavisa.com)</VCardTitle>
                <VCardSubtitle>Un total de {{ totalCount }} registros</VCardSubtitle>
              </VCardItem>

              <div class="date-picker-wrapper" style="width: 300px;" v-if="!isLoading">
                <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresada"
                  show-current=true @on-change="obtenerFechaDispositivos" :config="{
                    position: 'auto right',
                    mode: 'range',
                    altFormat: 'F j, Y',
                    dateFormat: 'm-d-Y',
                    maxDate: new Date(),
                    reactive: true

                  }" />
              </div>
              <VCol cols="12">
                <!-- botonera de filtros guardados ##estado desactivado##-->
                <VBtnToggle v-if="!isLoading" v-model="btnFiltros" color="primary" class="d-none" divided>
                  <VBtn :value="item._id" @click="resolveFiltroSelection(item._id)" v-for="item  in filtrosVisitas">
                    {{ item.nombre }}
                  </VBtn>

                </VBtnToggle>

              </VCol>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <div style="width: 20rem">
                  <VTextField v-model="searchQuery" placeholder="Buscar..." density="compact" />
                </div>
                <!-- 👉 Search button -->
                <VBtn prepend-icon="tabler-search" @click="searchData">
                  Buscar
                </VBtn>
                <VBtn @click="reset">
                  Reiniciar
                </VBtn>
              </VCol>
            </VCardText>
            <VCardText v-if="isLoading">Cargando datos...</VCardText>
            <VCardText v-else>
              <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                <thead>
                  <tr>
                    <th scope="col">TÍTULO DE PÁGINA</th>
                    <th scope="col">VISITAS</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="item  in paginatedUrlCounts">
                    <td class="clickable" @click="resolveUltimosUsuarios(item.title || item.url)">

                      {{ item.title ? item.title : item.url }}

                    </td>

                    <td class="text-medium-emphasis">
                      {{ item.count }}
                    </td>
                  </tr>
                </tbody>
              </VTable>
              <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                Página {{ currentPage }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                  :disabled="(currentPage * itemsPerPage) >= urlCounts.length">
                </VBtn>


              </div>

            </VCardText>
          </VCard>
        </VCol>
        <VCol lg="6" cols="12" sm="6">
          <!-- trazabilidad independiente -->
          <VExpandTransition>
            <VCard v-show="ultimosUsuariosVisible">
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

                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">Nombre</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Hora</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr class="clickable" v-for="user in ultimosUsuarios"
                      @click="resolveUltimasVisitasUser(user.first_name, user.last_name)">
                      <td class="text-high-emphasis">
                        {{ user.first_name }} {{ user.last_name }}
                      </td>
                      <td class="text-medium-emphasis">
                        {{ user.fecha }}
                      </td>
                      <td class="text-medium-emphasis">
                        {{ user.cantidad }}
                      </td>
                      <td class="text-medium-emphasis">
                        {{ user.hora }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCardItem>
            </VCard>
          </VExpandTransition>
        </VCol>
        <VCol lg="6" cols="12" sm="6">
          <!-- trazabilidad independiente -->
          <VExpandTransition>
            <VCard v-show="ultimasVisitasVisible">
              <VCardItem>
                <VCardTitle>Actividad del usuario {{ userSelected }}</VCardTitle>
              </VCardItem>
              <VCardText>
                <VTimeline density="compact" align="start" truncate-line="both" class="v-timeline-density-compact">
                  <VTimelineItem dot-color="primary" size="x-small" v-for="user in ultimasVisitas">
                    <div class="d-flex justify-space-between align-center flex-wrap">
                      <h4 class="text-base font-weight-semibold me-1">
                        {{ user.title || user.url }}
                      </h4>


                    </div>

                    
                    <VCard
                      class=""
                      variant="text"
                    >
                      <VCardText>

                        <!-- 👉 Person -->
                        <div class="d-flex justify-space-between align-center">
                          <VTimeline
                            side="end"
                            align="start"
                            truncate-line="both"
                            density="compact"
                            class="v-timeline-density-compact timeline-2"
                          >
                            <!-- SECTION Timeline Item: Flight -->
                            <VTimelineItem
                              dot-color="info"
                              size="x-small"
                              v-for="un,index_2 in nuevaLista({data:user.data, index})"
                            >
                              <div class="d-flex justify-space-between align-center flex-wrap">
                                <h4 class="text-base font-weight-semibold me-1">
                                  {{ un.fechai }}
                                </h4>
                              </div>
                              <!-- 👉 Content -->
                              <p class="mt-0 mb-0">
                                {{ un.title }}
                              </p>
                                <!-- 👉 Divider -->
                                <VDivider />
                              <small style="font-size:10px;font-style: italic;">{{un.fechai}} {{un.fechaf ? 'hasta '+un.fechaf: ''}}</small>
                            </VTimelineItem>
                            <!-- !SECTION -->

                            
                          </VTimeline>
                        </div>
                      </VCardText>
                    </VCard>

                  </VTimelineItem>

                </VTimeline>
              </VCardText>
            </VCard>
          </VExpandTransition>


        </VCol>


      </VRow>
    </VWindowItem>
    <VWindowItem>
      <notasDrivers />
    </VWindowItem>

  </VWindow>

  <!-- -- -->
</template>

<script setup>
  import { useSelectCalendar, useSelectValueCalendar, getTranscursoDeFechas } from "@/views/apps/otros/useSelectCalendar.js";
import notasDrivers from '@/pages/apps/visitas/tabs/notas-drivers.vue';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
const vuetifyTheme = useTheme()
const tabvisitas = ref(0);
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

// const url = 'https://servicio-de-actividad.vercel.app/actividad/all';

const urlCounts = ref([]);
const rawData = ref([]);
const isLoading = ref(true);
const itemsPerPage = 8;
const currentPage = ref(1);
const fechaIngresada = ref('');
const ultimosUsuarios = ref([])
const ultimasVisitas = ref([])
const totalCount = computed(() => urlCounts.value.length);
const fechaIni = ref('');
const fechaFin = ref('');
const ultimosUsuariosVisible = ref(false);
const ultimasVisitasVisible = ref(false);
const titulo = ref('');
const filtrosVisitas = ref([]);
const filtroSelected = ref({});
const btnFiltros = ref('');
const filtroDefault = ref({});
const titleSelected = ref('');
const ultimosUsuariosDownload = ref([]);
const userSelected = ref('');
const router = useRouter();
const searchQuery = ref('');
const urlRaw = ref([]);

async function fetchFiltros() {
  await fetch('https://servicio-filtros.vercel.app/visitas/all')
    .then(response => response.json())
    .then(data => {
      filtrosVisitas.value = Array.from(data);
    })
    .catch(error => { return error });

  let filtros = Array.from(filtrosVisitas.value);
  if (filtros.length > 0) {
    let checkDefault = filtros.filter(a => a.isDefault === true);
    filtroDefault.value = checkDefault[0];
    btnFiltros.value = checkDefault[0]._id;
    fechaIngresada.value = String(checkDefault[0].fecha);
  }
}

async function fetchData(fechai, fechaf) {
  isLoading.value = true;
  let fechaI;
  let fechaF;
  if (fechai && fechaf) {
    fechaI = fechai;
    fechaF = fechaf;
  } else if (filtroDefault.value) {
    let fechas = filtroDefault.value.fecha.split('a');
    fechaI = moment(fechas[0]).add(+1, 'days').format('MM/DD/YYYY');
    fechaF = moment(fechas[1]).add(-1, 'days').format('MM/DD/YYYY');
  }
  else {
    fechaI = moment().add(-6, 'days').format("MM-DD-YYYY");
    fechaF = moment().add(1, 'days').format("MM-DD-YYYY");
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var fechasCount = JSON.stringify({
    "fechai": fechaI,
    "fechaf": fechaF
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: fechasCount,
    redirect: 'follow'
  };
  const navArray = [];
  await fetch('https://servicio-de-actividad.vercel.app/count', requestOptions)
    .then(response => response.text())
    .then(async count => {
      let pages = parseInt(count);


      var myHeaders2 = new Headers();
      myHeaders2.append("Content-Type", "application/json");

      for (let i = 1; i < pages + 1; i++) {
        var fechasFetch = JSON.stringify({
          "fechai": fechaI,
          "fechaf": fechaF,
          "page": i
        });
        var requestOptions2 = {
          method: 'POST',
          headers: myHeaders2,
          body: fechasFetch,
          redirect: 'follow'
        };
        await fetch('https://servicio-de-actividad.vercel.app/actividad/full', requestOptions2)
          .then(response => response.json())
          .then(async response => {

            let array = Array.from(response.data);

            array.forEach((item) => {
              rawData.value.push(item);
            })

            for (const a of array) {
              for (const b of a.navigationRecord) {
                let data = {
                  title: b.title,
                  url: b.url,
                }
                navArray.push(data);
              }
            }

          }).catch((error) => { return error });
      }

      const finArray = navArray.reduce((a, b) => {
        var i = a.findIndex((x) => x.title == b.title || x.url == b.url);
        return i === -1 ? a.push({ url: b.url, title: b.title, count: 1 }) : a[i].count++, a;
      }, []);

      urlRaw.value = Array.from(finArray);
      urlRaw.value.sort((a, b) => b.count - a.count);
      urlCounts.value = Array.from(finArray);
      urlCounts.value.sort((a, b) => b.count - a.count);
      isLoading.value = false;
    }).catch((error) => { return error });

}

async function initData() {
  await fetchFiltros();
  let formatI = moment().add(-7, 'days').format("MM-DD-YYYY");
  let formatF = moment().format("MM-DD-YYYY");
  fechaIngresada.value = String(formatI + ' a ' + formatF);
  fetchData();
}

async function fetchDataFecha(fechai, fechaf) {
  try {
    const response = await fetch('https://servicio-de-actividad.vercel.app/actividad/full', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: fechas
    });
    const data = await response.json();
    const urlMap = new Map();
    rawData.value = data.data;

    for (const activity of data.data) {
      for (const record of activity.navigationRecord) {
        const url = record.url;
        const title = record.title;
        if (urlMap.has(url)) {
          urlMap.get(url).count++;
        } else {
          urlMap.set(url, { url, title, count: 1 });
        }
      }
    }

    urlCounts.value = Array.from(urlMap.values());
    urlCounts.value.sort((a, b) => b.count - a.count); // Ordenar los datos
  } catch (error) {
    console.error(error);
  }
  isLoading.value = false;
}

async function obtenerFechaDispositivos(selectedDates, dateStr, instance) {
  try {
    btnFiltros.value = '';
    if (selectedDates.length > 1) {

      let fechaI = moment(selectedDates[0]).add(+1, 'days').format('MM/DD/YYYY');
      let fechaF = moment(selectedDates[1]).format('MM/DD/YYYY');
      fechaIni.value = fechaI;
      fechaFin.value = fechaF;
      await fetchData(fechaI, fechaF);

      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

async function obtenerFechaFiltroDispositivos(fechas) {
  try {
    let array = fechas.toString().split('a');
    if (array.length > 1) {
      let fechaI = moment(array[0]).add(+1, 'days').format('MM/DD/YYYY');
      let fechaF = moment(array[1]).format('MM/DD/YYYY');
      fechaIni.value = fechaI;
      fechaFin.value = fechaF;
      await fetchData(fechaI, fechaF);

      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

async function resolveFiltroSelection(id) {

  await fetch('https://servicio-filtros.vercel.app/visitas/id?' + new URLSearchParams({ id: id }))
    .then(response => response.json())
    .then(data => {
      filtroSelected.value = data;
    })
    .catch(error => { return error });
  let filtro = filtroSelected.value;
  fechaIngresada.value = String(filtro.fecha);

  await obtenerFechaFiltroDispositivos(filtro.fecha);

}

const authorizedCheck = () => {
  let rol = localStorage.getItem('role');
  if (rol !== 'administrador' && rol !== 'webmaster') {
    router.push({ path: '/pages/errors/not-authorized' })
  }
}

onMounted(() => {
  authorizedCheck();
  initData();
});

const paginatedUrlCounts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return urlCounts.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < urlCounts.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const searchData = () => {
  if (searchQuery.value !== '') {
    currentPage.value = 1;
    const normalizedSearchQuery = searchQuery.value.endsWith('/')? searchQuery.value.replace(/\/$/, '').trim() : searchQuery.value.trim();
    const filtered = urlRaw.value.filter((item) => {
      const normalizedItemName = item.url.trim();
      return normalizedItemName.includes(normalizedSearchQuery);
    });

    urlCounts.value = filtered;
  }
};

const reset = () => {
  currentPage.value = 1;
  searchQuery.value = '';
  ultimasVisitasVisible.value = false;
  ultimosUsuariosVisible.value = false;
  urlCounts.value = urlRaw.value;
};

const resolveUltimosUsuarios = (title) => {
  titleSelected.value = title;
  const inicio = rawData.value.map(({ first_name, last_name, navigationRecord }) => {
    return { first_name, last_name, navigationRecord };
  });

  const arrayFiltro = [];

  //console.log('title',title)
  for (let p of inicio) {
    for (let i of p.navigationRecord) {
      if (i.title === title || i.url === title) {

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

        if (p.first_name !== undefined && p.last_name !== undefined && p.first_name !== null && p.last_name !== null && p.first_name !== '' && p.last_name !== '') {
          let data = {
            first_name: p.first_name,
            last_name: p.last_name,
            url: i.url,
            title: i.title,
            fecha: fechaFormat,
            fechaRaw: i.fecha,
            fullFecha: fullFechaFormat,
            hora: horaFinal,
            horaRaw: i.hora
          }
          arrayFiltro.push(data);
        }
      }

    }
  }
  //console.log('Antes',arrayFiltro);
  /*let pruebaF = [];
  for (let i of arrayFiltro) {
    let p = {
      prueba: new Date(i.fullFecha)
    };
    pruebaF.push(p);
  }*/
  //console.log('pruebaF',pruebaF);

  let grupos = {};

  arrayFiltro.forEach(obj => {
    let clave = obj.first_name + '-' + obj.last_name;

    if (grupos.hasOwnProperty(clave)) {
      if (new Date(obj.fullFecha) > new Date(grupos[clave].fullFecha)) {
        grupos[clave] = obj;
      }
      grupos[clave].cantidad = (grupos[clave].cantidad || 1) + 1;
    } else {
      obj.cantidad = 1;
      grupos[clave] = obj;
    }
  });

  let resultado = Object.values(grupos);



  resultado.sort((a, b) => {
    var timestampA = new Date(a.fullFecha);
    var timestampB = new Date(b.fullFecha);
    return timestampB - timestampA;
  });
  //console.log('res',resultado);

  //console.log('Sorted F',arrayFiltro);
  ultimosUsuarios.value = resultado.slice(0, 25);

  //console.log('ultimosUsuarios',ultimosUsuarios.value);

  ultimosUsuariosDownload.value = ultimosUsuarios.value.map(({ first_name, last_name, fecha, hora, cantidad, title, url }) => ({ first_name, last_name, fecha, hora, cantidad, title, url }));
  ultimosUsuariosVisible.value = true;
  titulo.value = title;
};

function agruparPorTitulo(registros) {
  const grupos = [];
  let grupoActual = null;

  registros.forEach((registro, index) => {
    if (index === 0 || registro.title !== registros[index - 1].title) {
      // Si es el primer registro o el título es diferente al anterior
      grupoActual = {
        title: registro.title,
        url: registro.url,
        fecha: registro.fecha,
        hora: registro.hora,
        fullFecha: registro.fullFecha,
        data: [registro],
      };

      grupos.push(grupoActual);
    } else {
      // Si el título es igual al anterior, agrégalo al grupo actual
      grupoActual.data.push(registro);
    }
  });

  return grupos;
}

  var timeSince = function (json_data = {}) {
    const {fecha, indice, dataActual, dataTotal, indiceDelTotal, tamanioTotal, objectoActual = null} = json_data;
    const dat =  JSON.stringify(dataActual);
    const valData = JSON.parse(dat);

    if(valData.length - 1 > indice){
      const sumIndex = valData[indice*1+1];
      const fechaSiguiente = `${sumIndex.fecha} ${sumIndex.hora}`;
      return getTranscursoDeFechas(fechaSiguiente, fecha, valData[indice], sumIndex);
    }

    var objetoTotal = {};
    var fechaSiguienteTotal = null;
    if(tamanioTotal - 1 > indiceDelTotal){
      objetoTotal = dataTotal[indiceDelTotal*1+1];
      fechaSiguienteTotal = `${objetoTotal.fecha} ${objetoTotal.hora}`;
    }

    if(tamanioTotal - 1 == indiceDelTotal && valData.length - 1 == indice){
      // console.log(indiceDelTotal, dataTotal.length)
      return {
        tiempoTranscurrido: "Fin de la navegación",
        fechai: fecha,
        fechaf:null,
        tipo: ""
      }
    }

    // `${valData[valData.length - 1].fecha} ${valData[valData.length - 1].hora}`
    return getTranscursoDeFechas(fechaSiguienteTotal,fecha, dataTotal[indiceDelTotal], dataTotal[indiceDelTotal*1+1]);
    
  };

var nuevaLista = function(json = {}){
  const { data, index } = json;
  var lista = [];
  var todoLista = ultimasVisitas.value;
  var todoListaTamanio = todoLista.length;

  for(var i in data){
    const fecha = `${data[i].fecha} ${data[i].hora}`;
    const tiempoTimeline = timeSince({
      "fecha":fecha,
      "indice": i,
      "indiceDelTotal": index,
      "dataTotal": todoLista,
      "tamanioTotal": todoListaTamanio,
      "dataActual": data,
      "objectoActual": null,
    });

    const title = `${tiempoTimeline.tiempoTranscurrido}`;

    lista.push({
      title: title,
      fechai: tiempoTimeline.fechai,
      fechaf: tiempoTimeline.fechaf
    });
  }
  // console.log(lista);
  return lista;

}

const resolveUltimasVisitasUser = (first, last) => {

  const inicio = rawData.value.map(({ first_name, last_name, navigationRecord }) => {
    return { first_name, last_name, navigationRecord };
  });

  const arrayFiltro = [];
  userSelected.value = first + ' ' + last;
  let fullNameViene = first + ' ' + last;
  //console.log('name',fullNameViene);
  //console.log('inicio' ,inicio); 
  for (let p of inicio) {
    let fullName = p.first_name + ' ' + p.last_name;
    if (fullName == fullNameViene) {
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
  }

  arrayFiltro.sort((a, b) => {
    var timestampA = new Date(a.fullFecha);
    var timestampB = new Date(b.fullFecha);
    return timestampB - timestampA;
  });

  //console.log('Sorted F',arrayFiltro);
  // ultimasVisitas.value = arrayFiltro;
  ultimasVisitas.value = agruparPorTitulo(arrayFiltro);

  ultimasVisitasVisible.value = true;
}

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

  let headers = {
    first_name: "first_name",
    last_name: "last_name",
    fecha: "fecha",
    hora: "hora",
    cantidad: "cantidad",
    title: "title",
    url: "url"
  };
  let doc = [];
  doc = Array.from(ultimosUsuariosDownload.value);
  let title = "ultimos_usuarios_" + titleSelected.value.replace(/[^A-Z0-9]+/ig, "_");
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){

  exportCSVFile(headers, doc, title);
  // }



};

</script>

<style scoped>
.tableNavegacion a {
  color: initial !important;
  text-decoration: underline !important;
}


td span {
  display: block;
  max-width: 300px;
  /* width: 560px; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
