<script setup>
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


async function getDrivers(fechai = '', fechaf = '') {
  isLoading.value = true;
 
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var fechasCount = JSON.stringify({
    "fechai": fechai,
    "fechaf": fechaf
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
    //console.log('count',count)
    let pages = parseInt(count);    
    var myHeaders2 = new Headers();
    myHeaders2.append("Content-Type", "application/json");
    for (let i = 1; i < pages + 1; i++) {    
    var raw = JSON.stringify({
                "fechai": fechai,
                "fechaf": fechaf,
                "page": i
            });

    var requestOptions2 = {
        method: 'POST',
        headers: myHeaders2,
        body: raw,
        redirect: 'follow'
        };        
    await fetch('https://servicio-de-actividad.vercel.app/actividad/driver/full',requestOptions2)
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
        .catch(error => { console.error(error) });

    }
    const finArray = navArray.reduce((a, b) => {
        var i = a.findIndex((x) => x.title == b.title || x.url == b.url);
        return i === -1 ? a.push({ url: b.url, title: b.title, count: 1 }) : a[i].count++, a;
      }, []);

    driversRaw.value = Array.from(finArray);
    driversRaw.value.sort((a, b) => b.count - a.count);

    drivers.value = Array.from(finArray);
    drivers.value.sort((a, b) => b.count - a.count);
    console.log('drivers',drivers.value)
    isLoading.value = false;
    }).catch((error) => { console.error(error) });
    
        
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

const paginatedDrivers = computed(() => {
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
  let fechai = moment().subtract(7, 'days').format("DD-MM-YYYY").toString();
  let fechaf = moment().format("DD-MM-YYYY").toString();
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
}

onMounted(() => {
  initData();
});

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
  let title = "drivers_ultimos_usuarios_" + titleSelected.value.replace(/[^A-Z0-9]+/ig, "_");
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){
  exportCSVFile(headers, doc, title);
  // }
};

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
ultimasVisitas.value = arrayFiltro.slice(0, 10);

ultimasVisitasVisible.value = true;
}

</script>

<template>
  <VRow>
    <VCol lg="12" cols="12">
       <VCard>
         <VCardText class="d-flex flex-wrap justify-space-between gap-4">
           <VCardItem class="pb-sm-0">
             <VCardTitle>Páginas más vistas</VCardTitle>
             <VCardSubtitle>Un total de {{ totalCount }} registros</VCardSubtitle>
           </VCardItem>

           <div class="date-picker-wrapper" style="width: 300px;" v-if="!isLoading">
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
         <!-- 
           <VCol cols="12" class="d-flex flex-wrap gap-4">
           <div style="width: 20rem">
             <VTextField
               v-model="searchQuery"
               placeholder="Buscar..."
               density="compact"
             />
           </div>
           <VBtn prepend-icon="tabler-search" @click="searchData">
             Buscar
           </VBtn>
           <VBtn @click="reset">
             Reiniciar
           </VBtn>
         </VCol>
        -->
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
               <tr v-for="item  in paginatedDrivers">
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

                    <p class="mb-1">{{ user.fecha }} {{ user.hora }}</p>

                  </VTimelineItem>

                </VTimeline>
              </VCardText>
            </VCard>
          </VExpandTransition>
       

      </VCol>
    </VRow>
</template>

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
