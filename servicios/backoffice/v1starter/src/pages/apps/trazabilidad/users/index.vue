<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { useTheme } from 'vuetify';
const vuetifyTheme = useTheme()
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

// const url = 'https://servicio-de-actividad.vercel.app/actividad/all';


const rawData = ref([]);
const isLoading = ref(false);
const isLoaded= ref(false);
const itemsPerPage = 8;
const currentPage = ref(1);
const currentPageA = ref(1);
const fechaIngresada = ref('');
const actividadUser = ref([])
const totalCount = computed(() => usersData.value.length);
const actividadVisible = ref(false);
const titulo = ref('');
const titleSelected = ref('');
const ultimosUsuariosDownload = ref([]);
const userSelected = ref('');
const searchQuery = ref('');
const usersData = ref([]);  
const paginasUser = ref('');
const actividadUserRaw = ref([]);
const ultimasVisitasPag = ref([]);
const ultimasVisitasPagVisible = ref(false);
const fechaInicial = ref('');
const fechaFinal = ref('');
async function searchUsers() {
    isLoading.value = true;
    isLoaded.value = false;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var query = JSON.stringify({
              "query": searchQuery.value,
          });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: query,
      redirect: 'follow'
    };        
    const navArray = []; 
    await fetch('https://servicio-de-actividad.vercel.app/actividad/full/extra',requestOptions)
    .then(response => response.json())
    .then(resp => { 
      let inicio = resp.data;
      rawData.value = resp.data;
      let grupos = {};

      inicio.forEach(obj => {
      let clave = obj.first_name + '-' + obj.last_name;

      if (grupos.hasOwnProperty(clave)) {   
      grupos[clave].cantidad = (grupos[clave].cantidad || 1) + 1;
      } else {
       obj.cantidad = 1;
      grupos[clave] = obj;
      }
      });

      let resultado = Object.values(grupos);
      usersData.value = resultado;

      isLoading.value = false;
      isLoaded.value = true;
        }).catch((error) => {return error});   
    
}

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return usersData.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < usersData.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const resolveActividad =(first, last)=>{
  fechaIngresada.value = '';
  const inicio = rawData.value.map(({first_name, last_name, country, navigationRecord})=>{ 
  return {first_name, last_name, country, navigationRecord};
  });
  

  const arrayFiltro = [];
  userSelected.value = first+' '+last;
  let fullNameViene = first+' '+last;
  //console.log('name',fullNameViene);
  //console.log('inicio' ,inicio); 
  for (let p of inicio) {
    let fullName = p.first_name+' '+p.last_name;
    if (fullName == fullNameViene) { 
    for (let i of p.navigationRecord) {
      
          var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY' , 'D/M/YYYY' ];    
          var allowedFullDateFormats = ['DD/MM/YYYY HH:mm:ss','DD/MM/YYYY H:mm:ss', 'DD/MM/YYYY H:mm:ss a', 'DD/MM/YYYY HH:mm:ss a'];    
          let fechaFormat = moment(i.fecha, allowedDateFormats, true).format( 'DD/MM/YYYY');
          let horaFix = i.hora.split(':');
          if(horaFix[2].indexOf(' ')>= 0){
            let slot3 = horaFix[2].split(' ');
            horaFix[2] = slot3[0];
          }
          let horaFinal = horaFix[0]+':'+horaFix[1]+':'+horaFix[2];
          let fullFecha = fechaFormat+' '+horaFinal;
          let fullFechaFormat = moment(fullFecha, allowedFullDateFormats, true).format();

          let data = {
              first_name: p.first_name,
              last_name: p.last_name,
              url: i.url,
              title: i.title,
              fecha: fechaFormat,
              fechaRaw: i.fecha,
              fullFecha: fullFechaFormat,
              hora: horaFinal,
              country : p.country
          }
          arrayFiltro.push(data);
        }
      }
  }

  arrayFiltro.sort((a, b) => {
    var timestampA = new Date(a.fullFecha);
    var timestampB = new Date(b.fullFecha);
    return  timestampB - timestampA;
  });
  
  let grupos = {};
  //console.log('arrayFiltro',arrayFiltro)
  arrayFiltro.forEach(obj => {
      let clave = obj.title;
      if( obj.country !== undefined  && obj.country !== null && obj.country !== '' ){
      if (grupos.hasOwnProperty(clave)) {   
      grupos[clave].cantidad = (grupos[clave].cantidad || 1) + 1;
      } else {
       obj.cantidad = 1;
      grupos[clave] = obj;
      }
      }
      });
      
      let resultado = Object.values(grupos);

      resultado.sort((a, b) => {  
       return  b.cantidad - a.cantidad;
        });

  paginasUser.value = resultado;


  
  //console.log('Sorted F',arrayFiltro);
  actividadUser.value = arrayFiltro.slice(0,10);
  //console.log('actividadUser',actividadUser.value);
  actividadUserRaw.value = arrayFiltro;      
  actividadVisible.value = true;
}

const resolveActividadFecha =(dates)=>{
    if(dates.length > 1){
      
    let fechaI = dates[0].toString();
    let fechaF = dates[1].toString();  
    
    if(fechaI === fechaF){ 
      fechaF = new Date(new Date(fechaI).getTime() + 60 * 60 * 24 * 1000);
    }
    fechaInicial.value = fechaI;
    fechaFinal.value = fechaF;
    let filtroActividad = actividadUserRaw.value.filter((item) => {
      return new Date(item.fullFecha) >= new Date(fechaI) && new Date(item.fullFecha) <= new Date(fechaF);         
    });
    actividadUser.value = filtroActividad.slice(0,10);

    let grupos = {};
    filtroActividad.forEach(obj => {
      let clave = obj.title;
      if( obj.country !== undefined  && obj.country !== null && obj.country !== '' ){
      if (grupos.hasOwnProperty(clave)) {   
      grupos[clave].cantidad = (grupos[clave].cantidad || 1) + 1;
      } else {
       obj.cantidad = 1;
      grupos[clave] = obj;
      }
      }
      });

      let paginaFiltrado = Object.values(grupos);

      paginaFiltrado.sort((a, b) => {  
       return  b.cantidad - a.cantidad;
        });

    paginasUser.value = paginaFiltrado;
    //console.log('paginasUser',paginasUser.value);

  } 
}

const paginatedActividad = computed(() => {
  const start = (currentPageA.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return paginasUser.value.slice(start, end);
});


const nextPageActividad = () => {
  if (currentPageA.value * itemsPerPage < paginasUser.value.length) currentPageA.value++;
};

const prevPageActividad = () => {
  if (currentPageA.value > 1) currentPageA.value--;
};




const resolveVisitas = (title) =>{
  titleSelected.value = title;

  let resultado = [];
  
  for (let a of rawData.value) {
    let clave = a.first_name + ' ' + a.last_name;
    if(clave == userSelected.value){
      resultado.push(a);
    }
  }
  
  const inicio = resultado.map(({device, country, navigationRecord})=>{ 
  return {device, country, navigationRecord};
  });
  //console.log('inicio',inicio);
  const arrayFiltro = [];

  //console.log('title',title)
  for (let p of inicio) {
    for (let i of p.navigationRecord) {
      if (i.title === title || i.url === title) { 

          var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'D/M/YYYY' ];    
          var allowedFullDateFormats = ['DD/MM/YYYY HH:mm:ss','DD/MM/YYYY H:mm:ss', 'DD/MM/YYYY H:mm:ss a', 'DD/MM/YYYY HH:mm:ss a'];    
          let fechaFormat = moment(i.fecha, allowedDateFormats, true).format( 'DD/MM/YYYY');
          let horaFix = i.hora.split(':');
          if(horaFix[2].indexOf(' ')>= 0){
            let slot3 = horaFix[2].split(' ');
            horaFix[2] = slot3[0];
          }
          let horaFinal = horaFix[0]+':'+horaFix[1]+':'+horaFix[2];
          let fullFecha = fechaFormat+' '+horaFinal;
          let fullFechaFormat = moment(fullFecha, allowedFullDateFormats, true).format();

          if( p.country !== undefined  && p.country !== null && p.country !== '' ){
          let data = {
              device: p.device,
              country: p.country,
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


  //console.log('arrayFiltro',arrayFiltro);
  arrayFiltro.sort((a, b) => {
    var timestampA = new Date(a.fullFecha);
    var timestampB = new Date(b.fullFecha);
    return  timestampB - timestampA;
  });
  //console.log('res',resultado);

  if(fechaInicial.value && fechaFinal.value){
    let filtroVisitas = arrayFiltro.filter((item) => {
      return new Date(item.fullFecha) >= new Date(fechaInicial.value) && new Date(item.fullFecha) <= new Date(fechaFinal.value);         
    });  
    ultimasVisitasPag.value = filtroVisitas.slice(0,25);
  }else{
    ultimasVisitasPag.value = arrayFiltro.slice(0,25);
  }

  ultimosUsuariosDownload.value = ultimasVisitasPag.value.map(({ first_name, last_name, fecha, hora, cantidad, title, url }) => ({ first_name, last_name, fecha, hora, cantidad, title, url }));
  ultimasVisitasPagVisible.value = true;
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

async function downloadSelection () {
   
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
  let title = "ultimos_usuarios_"+titleSelected.value.replace(/[^A-Z0-9]+/ig, "_");
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){

  exportCSVFile(headers, doc, title);
 // }



};


</script>

<template>
  <VRow>
    <VCol lg="6" cols="12" sm="6">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4">
        <VCardItem class="pb-sm-0">
          <VCardTitle>Trazabilidad usuarios</VCardTitle>
          
        </VCardItem>
        
        
            <div class="d-flex align-center flex-wrap gap-2">
            <div style="width: 15rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Buscar..."
                  density="compact"
                />
              </div>   
              <VBtn prepend-icon="tabler-search" @click="searchUsers">
                Buscar
              </VBtn> 
            </div>
       
         
    </VCardText>
    
        <VCardText v-if="isLoading">Cargando datos...</VCardText>
        <VCardText  v-if="isLoaded">
          <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item  in paginatedData" class="clickable" @click="resolveActividad(item.first_name, item.last_name)">
                <td >
                  
                   {{ item.first_name }} {{ item.last_name }}
                 
                </td>

                <td class="text-medium-emphasis">
                  {{ item.email }}
                </td>
              </tr>
            </tbody>
          </VTable>
          <div class="d-flex align-center justify-space-between botonescurrentPage">
            <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
            Página {{ currentPage }}
            <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
              :disabled="(currentPage * itemsPerPage) >= usersData.length">
            </VBtn>
            
       
          </div>

        </VCardText>
      
      </VCard>
      
    <!-- trazabilidad independiente -->
    <VExpandTransition>
      <VCard v-show="actividadVisible" style="margin-top: 1rem;">
        <VCardItem class="pb-sm-0">
          <div style="display: flex; flex-wrap: wrap;">   
          <div style="width: max-content;">
          <VCardTitle >Páginas más visitadas de {{ userSelected }}</VCardTitle>  
        </div>
        <!--
          <div style="margin-left: auto; margin-top: 1rem; margin-bottom: 1rem;">
          <VBtn 
            color="primary"							
            @click="downloadSelection"
            >
            Exportar
          </VBtn>
        </div>
        -->
    </div> 
         <VCardText>
          <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
            <thead>
              <tr>
                <th scope="col" >Página</th>
                <th scope="col">Cantidad</th>
              </tr>
            </thead>

            <tbody>
              <tr class="clickable" v-for="item in paginatedActividad" @click="resolveVisitas(item.title || item.url)">
                <td class="text-high-emphasis">
                  {{ item.title ? item.title : item.url }}
                </td>
                <td class="text-medium-emphasis">
                  {{ item.cantidad}}
                </td>
               
              </tr>
            </tbody>
          </VTable>
          <div class="d-flex align-center justify-space-between botonescurrentPage">
            <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageActividad" :disabled="currentPageA === 1"></VBtn>
            Página {{ currentPageA }}
            <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageActividad"
              :disabled="(currentPageA * itemsPerPage) >= paginasUser.length">
            </VBtn>
          </div>
        </VCardText>
        </VCardItem>
      </VCard>
    </VExpandTransition>
   
    </VCol>
    <VCol lg="6" cols="12" sm="6">
    <!-- trazabilidad independiente -->
    <VExpandTransition>
      <VCard v-show="actividadVisible">
        <VCardItem>
      <VCardTitle >Actividad del usuario {{ userSelected }}</VCardTitle>
     </VCardItem>
     <VCardItem>
     <div class="date-picker-wrapper" style="width: 300px;">
        <AppDateTimePicker
        prepend-inner-icon="tabler-calendar"
        density="compact"
        v-model="fechaIngresada"
        show-current= true
        @on-change="resolveActividadFecha"
        :config="{ 
          position: 'auto right',
          mode:'range',
          altFormat: 'F j, Y',
          dateFormat: 'd-m-Y',
          maxDate: new Date(),
          reactive :true
          
        }"
        />
        </div>
        </VCardItem>
        <VCardText>
          <VTimeline
            density="compact"
            align="start"
            truncate-line="both"
            class="v-timeline-density-compact"
          > 
            <VTimelineItem dot-color="primary" size="x-small"
            v-for="user in actividadUser">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <h4 class="text-base font-weight-semibold me-1">
                  {{ user.title || user.url }} 
                </h4>
                
                
              </div>

              <p class="mb-1">{{ user.fecha}} {{ user.hora}}</p>
            
            </VTimelineItem>

          </VTimeline>
        </VCardText>
      </VCard>
    </VExpandTransition>

    <VExpandTransition>
      <VCard v-show="ultimasVisitasPagVisible" style="margin-top: 1rem;">
        
        <VCardItem class="pb-sm-0">
          <div style="display: flex; flex-wrap: wrap;">   
          <div style="width: max-content;">
          <VCardTitle >Últimas visitas a la página {{ titleSelected }}</VCardTitle>  
        </div>
        <!--
          <div style="margin-left: auto; margin-top: 1rem; margin-bottom: 1rem;">
          <VBtn 
            color="primary"							
            @click="downloadSelection"
            >
            Exportar
          </VBtn>
        </div>
      -->
    </div> 
    <VCardText v-if="ultimasVisitasPag.length == 0">No existen datos</VCardText>
        <VCardText v-else>
          <VTable class="text-no-wrap tableNavegacion mb-5">
            <thead>
              <tr>
                <th scope="col">País</th>
                <th scope="col">Dispositivo</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
              </tr>
            </thead>

            <tbody>
              <tr class="clickable" v-for="item in ultimasVisitasPag">
                <td class="text-high-emphasis">
                  {{ item.country }} 
                </td>
                <td class="text-medium-emphasis">
                  {{ item.device}}
                </td>
                <td class="text-medium-emphasis">
                  {{ item.fecha}}
                </td>
                <td class="text-medium-emphasis">
                  {{ item.hora}}
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        </VCardItem>
      
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
.clickable { cursor: pointer; }
@media (max-width: 1000px) {
  td span {
    max-width: 200px;
  }
}
</style>
