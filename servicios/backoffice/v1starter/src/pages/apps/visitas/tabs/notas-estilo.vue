<script setup>
  import { logAction } from '@/middleware/activityLogger';
  import { getTranscursoDeFechas, useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  const fechaIni = ref('');
  const fechaFin = ref('');
  const fechaIngresada = ref('');
  const isLoading = ref(false);
  const driversRaw = ref([]);
  const drivers = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = 8;
  const rawData = ref([]);
  const totalCount = computed(() => drivers.value.length);
  const titleSelected = ref('');
  const ultimosUsuarios = ref([]);
  const ultimosUsuariosVisible = ref(false);
  const ultimosUsuariosDownload = ref([]);
  const titulo = ref('');
  const ultimasVisitas = ref([]);
  const ultimasVisitasVisible = ref(false);
  const userSelected = ref('');
  const searchQuery = ref('');
  const selectedRow = ref(null);
  const selectedRowUser = ref(null);
  const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());
  const userBackoffice = ref(JSON.parse(localStorage.getItem('userData')));

  const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY
  const fecha = ref({
    i: valoresHoy.i,
    f: valoresHoy.f,
    title: valoresHoy.title
  });

  const configSnackbar = ref({
      message: "Datos guardados",
      type: "success",
      model: false
  });

  const selectedfechaIniFin = ref('Hoy');
  const fechaIniFinList = useSelectCalendar();

  async function getDrivers(fechai = '', fechaf = '') {
    isLoading.value = true;
    const navArray = [];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "fechai": fechai,
      "fechaf": fechaf,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch('https://servicio-de-actividad.vercel.app/actividad/seccion/full/Tendencias', requestOptions)
      .then(response => response.json())
      .then(data => {

        let arrayIn = Array.from(data.data);
        arrayIn.forEach((item) => {
          rawData.value.push(item);
        })

        for (const a of arrayIn) {
          for (const b of a.navigationRecord) {
            let data = {
              title: b.title,
              url: b.url,
            }
            navArray.push(data);
          }
        }

      })
      .catch(error => { 
        configSnackbar.value = {
            message: "No se pudo obtener los registros de tendencias, por favor intente nuevamente.",
            type: "error",
            timeout: 4000,
            model: true
        };
        console.error(error)
      });

    const finArray = navArray.reduce((a, b) => {
      var i = a.findIndex((x) => x.title == b.title || x.url == b.url);
      return i === -1 ? a.push({ url: b.url, title: b.title, count: 1 }) : a[i].count++, a;
    }, []);

    driversRaw.value = Array.from(finArray);
    driversRaw.value.sort((a, b) => b.count - a.count);

    drivers.value = Array.from(finArray);
    drivers.value.sort((a, b) => b.count - a.count);
    //console.log('drivers',drivers.value)
    isLoading.value = false;

  }

  async function obtenerPorFecha(selectedDates) {
    try {
      if (selectedDates.length > 1) {
        currentPage.value = 1;
        let fechaI = moment(selectedDates[0]).format('MM/DD/YYYY');
        let fechaF = moment(selectedDates[1]).format('MM/DD/YYYY');
        fechaIni.value = fechaI;
        fechaFin.value = fechaF;
        await getDrivers(fechaI, fechaF);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const paginatedEstadio = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return drivers.value.slice(start, end);
  });

  const nextPage = () => {
    if (currentPage.value * itemsPerPage < drivers.value.length) currentPage.value++;
  };

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };

  const initData = () => {
    // let fechai = moment().subtract(7, 'days').format("DD-MM-YYYY").toString();
    // let fechaf = moment().format("DD-MM-YYYY").toString();
    // fechaIni.value = fechai;
    // fechaFin.value = fechaf;
    // fechaIngresada.value = fechai + ' a ' + fechaf;
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
    let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
    fecha.value = {
        i: selectedCombo.i,
        f: selectedCombo.f,
        title: selectedCombo.title
    }

    currentPage.value = 1;
    let fechaI = selectedCombo.i.format('MM/DD/YYYY');
    let fechaF = selectedCombo.f.format('MM/DD/YYYY');
    fechaIni.value = fechaI;
    fechaFin.value = fechaF;

    initData();
    await getDrivers(fechaI, fechaF);
    /*
    await accionBackoffice({
              "usuario": userBackoffice.value.email,   
              "pagina": "trazabilidad-visitas-list-notasEstilo",
              "fecha": dateNowF.value
  					});
            */
  });

  const searchData = () => {
    if (searchQuery.value !== '') {
      currentPage.value = 1;
      const normalizedSearchQuery = searchQuery.value.endsWith('/') ? searchQuery.value.replace(/\/$/, '').trim() : searchQuery.value.trim();

      const filtered = driversRaw.value.filter((item) => {
        const normalizedItemName = item.url.trim();
        return normalizedItemName.includes(normalizedSearchQuery);
      });

      drivers.value = filtered;
    }
  };

  const reset = () => {
    currentPage.value = 1;
    searchQuery.value = '';
    ultimasVisitasVisible.value = false;
    ultimosUsuariosVisible.value = false;
    drivers.value = driversRaw.value;
  };

  const resolveUltimosUsuarios = (title) => {
    titleSelected.value = title;
    selectedRow.value = title;
    ultimasVisitasVisible.value = false;
    setTimeout(() => {
      const targetElement = document.getElementById('target'); // ID del elemento al que quieres hacer scroll
      targetElement.scrollIntoView({ behavior: 'smooth' }); // Hace scroll suavemente hacia el elemento
    }, 100);
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
    let title = "estilo_ultimos_usuarios_" + titleSelected.value.replace(/[^A-Z0-9]+/ig, "_");
    //console.log("doc", doc);
    //if(usersFull.length > totalUsers){
    logAction("export-notasEstilo");  
    /*
    await accionBackoffice({
     "usuario": userBackoffice.value.email,   
     "pagina": "trazabilidad-visitas-list-notasEstilo",
     "accion": "export",
     "fecha": dateNowF.value
  	});  
    */  
    exportCSVFile(headers, doc, title);
    // }
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

    selectedRowUser.value = first;

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

    arrayFiltro.sort((b, a) => {
      var timestampA = new Date(a.fullFecha);
      var timestampB = new Date(b.fullFecha);
      return timestampB - timestampA;
    });

    //console.log('Sorted F',arrayFiltro);
    // ultimasVisitas.value = arrayFiltro.slice(0, 10);
    ultimasVisitas.value = agruparPorTitulo(arrayFiltro);

    ultimasVisitasVisible.value = true;
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

    watch(async () => selectedfechaIniFin.value, async () => {
      isLoading.value = true;
      let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);

      fecha.value = {
          i: selectedCombo.i,
          f: selectedCombo.f,
          title: selectedCombo.title
      }
      let fechaI = selectedCombo.i.format('MM/DD/YYYY');
      let fechaF = selectedCombo.f.format('MM/DD/YYYY');

      fechaIni.value = fechaI;
      fechaFin.value = fechaF;

      await getDrivers(fechaI, fechaF);
    });
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
      <VCol lg="12" cols="12">
        <VCard>
          <VCardItem class="header_card_item">
            <div class="d-flex">
              <div class="descripcion">
                <VCardTitle>Páginas más vistas</VCardTitle>
                <VCardSubtitle>Un total de {{ totalCount }} registros, mostrando data desde {{fecha.i.format('YYYY-MM-DD')}} hasta {{fecha.f.format('YYYY-MM-DD')}}</VCardSubtitle>
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

          <VCardText class="d-flex flex-wrap justify-space-between gap-4">
            <VCardItem class="pb-sm-0" style="display: none;">
              <VCardTitle>Páginas más vistas</VCardTitle>
              <VCardSubtitle>Un total de {{ totalCount }} registros</VCardSubtitle>
            </VCardItem>

            <div class="date-picker-wrapper" style="width: 300px;display: none" v-if="!isLoading">
              <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresada"
                show-current=true @on-change="obtenerPorFecha" :config="{
                  position: 'auto right',
                  mode: 'range',
                  altFormat: 'F j, Y',
                  dateFormat: 'd-m-Y',
                  maxDate: new Date(),
                  reactive: true

                }" />
            </div>

            <VCol cols="12" class="d-flex flex-wrap gap-4">
              <div style="width: 20rem">
                <VTextField v-model="searchQuery" placeholder="Buscar..." density="compact" />
              </div>
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
                <tr v-for="item  in paginatedEstadio" class="clickable" :class="{ active: item.title === selectedRow }"
                  @click="resolveUltimosUsuarios(item.title || item.url)">
                  <td>
                    {{ item.title ? item.title : item.url }}
                  </td>
                  <td class="text-medium-emphasis">
                    {{ item.count }}
                  </td>
                </tr>
              </tbody>
            </VTable>
            <div class="d-flex align-center justify-space-between botonescurrentPage" id="target">
              <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
              Página {{ currentPage }}
              <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                :disabled="(currentPage * itemsPerPage) >= drivers.length">
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
                  <VBtn color="success" @click="downloadSelection">
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
                  <tr v-for="user in ultimosUsuarios" :key="user.first" class="clickable"
                    :class="{ active: user.first_name === selectedRowUser }"
                    @click="resolveUltimasVisitasUser(user.first_name, user.last_name, user.first)">
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
                <VTimelineItem dot-color="primary" size="x-small" v-for="user,index in ultimasVisitas">
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
  </section>
</template>

<style scoped>
.tableNavegacion a {
  color: initial !important;
  text-decoration: underline !important;
}

tr.clickable.active {
  background-color: #00000012;
}

.clickable {
  cursor: pointer;
}

td span {
  display: block;
  max-width: 300px;
  /* width: 560px; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.v-card-title{
  white-space: initial;
}


@media (max-width: 1000px) {
  td span {
    max-width: 200px;
  }
}
</style>
