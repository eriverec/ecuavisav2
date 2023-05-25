<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { useTheme } from 'vuetify';
const vuetifyTheme = useTheme()
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


async function fetchData(fechai, fechaf) {
    isLoading.value = true;
    
    if(!fechai && !fechaf){
    var fechaI = moment().add(-6, 'days').format("MM-DD-YYYY");
    var fechaF = moment().add(1, 'days').format("MM-DD-YYYY");
    }
    

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechasCount = JSON.stringify({
              "fechai": fechai || fechaI,
              "fechaf": fechaf || fechaF
          });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: fechasCount,
      redirect: 'follow'
    };        
    const navArray = []; 
    await fetch('https://servicio-de-actividad.vercel.app/count',requestOptions)
    .then(response => response.text())
    .then(async count => { 
            let pages = parseInt(count); 
            console.log('pages',pages);
            
            var myHeaders2 = new Headers();
            myHeaders2.append("Content-Type", "application/json");
        
            for (let i = 1; i < pages+1; i++){  
            var fechasFetch = JSON.stringify({
                      "fechai": fechai || fechaI,
                      "fechaf": fechaf || fechaF,
                      "page": i
                  });      
             var requestOptions2 = {
                    method: 'POST',
                    headers: myHeaders2,
                    body: fechasFetch,
                    redirect: 'follow'
             };       
            await fetch('https://servicio-de-actividad.vercel.app/actividad/full',requestOptions2)
                  .then(response => response.json())
                  .then(async response=>{

                    let array = Array.from(response.data); 
                    console.log('array',array);    
                    array.forEach((item)=>{
                    rawData.value.push(item);
                    })

                          for (const a of array) {
                            for(const b of a.navigationRecord){
                            let data = {
                              title: b.title,
                              url: b.url,
                            }
                            navArray.push(data);
                            }
                          }

                  }).catch((error) => {return error});       
          }
          console.log(navArray.length) ;
                    const finArray = navArray.reduce( (a,b) => {    
                      var i = a.findIndex((x) => x.title == b.title || x.url == b.url);
                      return i === -1 ? a.push({ url : b.url, title: b.title, count: 1}) : a[i].count++ , a;
                      }, []);
                  
                    urlCounts.value = Array.from(finArray);
                    urlCounts.value.sort((a, b) => b.count - a.count); 
                    isLoading.value = false; 
        }).catch((error) => {return error});   
    
}

async function initData (){
  let formatI = moment().add(-7, 'days').format("MM-DD-YYYY");
  let formatF = moment().format("MM-DD-YYYY");
  fechaIngresada.value = String(formatI+' a '+formatF); 
  fetchData();  
}

async function fetchDataFecha(fechai, fechaf) {
  try {   
    const response = await fetch('https://servicio-de-actividad.vercel.app/actividad/full' ,{
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

async function obtenerFechaDispositivos (selectedDates, dateStr, instance){
    try {
        
        if(selectedDates.length > 1){
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
onMounted(initData);

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

const resolveUltimosUsuarios = (title) =>{
  const inicio = rawData.value.map(({first_name, last_name, navigationRecord})=>{ 
  return {first_name, last_name, navigationRecord};
  });
  //console.log('inicio' ,inicio); 
  const arrayFiltro = [];

  //console.log('title',title)
  for (let p of inicio) {
    for (let i of p.navigationRecord) {
      if (i.title === title || i.url === title) { 

          var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY' ];    
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
              hora: horaFinal
          }
          arrayFiltro.push(data);}
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

  arrayFiltro.sort((a, b) => {
    var timestampA = new Date(a.fullFecha);
    var timestampB = new Date(b.fullFecha);
    return  timestampB - timestampA;
  });

  //console.log('Sorted F',arrayFiltro);
  ultimosUsuarios.value = arrayFiltro.slice(0,10);

  ultimosUsuariosVisible.value = true;
  titulo.value = title;
};

const resolveUltimasVisitasUser =(first, last)=>{
  
  const inicio = rawData.value.map(({first_name, last_name, navigationRecord})=>{ 
  return {first_name, last_name, navigationRecord};
  });

  const arrayFiltro = [];
  
  let fullNameViene = first+' '+last;
  //console.log('name',fullNameViene);
  //console.log('inicio' ,inicio); 
  for (let p of inicio) {
    let fullName = p.first_name+' '+p.last_name;
    if (fullName == fullNameViene) { 
    for (let i of p.navigationRecord) {
      
          var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY' ];    
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
              hora: horaFinal
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

  //console.log('Sorted F',arrayFiltro);
  ultimasVisitas.value = arrayFiltro.slice(0,10);

  ultimasVisitasVisible.value = true;
}
</script>

<template>
  <VRow>
    <VCol lg="12" cols="12" sm="6">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4">
        <VCardItem class="pb-sm-0">
          <VCardTitle>Páginas más vistas</VCardTitle>
          <VCardSubtitle>Un total de {{ totalCount }} registros</VCardSubtitle>
        </VCardItem>
        
        <div class="date-picker-wrapper" style="width: 300px;" v-if="!isLoading">
        <AppDateTimePicker
        prepend-inner-icon="tabler-calendar"
        density="compact"
        v-model="fechaIngresada"
        show-current= true
        @on-change="obtenerFechaDispositivos"
        :config="{ 
          position: 'auto right',
          mode:'range',
          altFormat: 'F j, Y',
          dateFormat: 'm-d-Y',
          maxDate: new Date(),
          reactive :true
          
        }"
        />
        </div>
    </VCardText>
        <VCardText v-if="isLoading">Cargando datos...</VCardText>
        <VCardText  v-else>
          <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
            <thead>
              <tr>
                <th scope="col">TÍTULO DE PÁGINA</th>
                <th scope="col">VISITAS</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item  in paginatedUrlCounts" >
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
          <VCardTitle>Últimas 10 visitas a la página</VCardTitle>
          <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
              </tr>
            </thead>

            <tbody>
              <tr class="clickable" v-for="user in ultimosUsuarios" @click="resolveUltimasVisitasUser(user.first_name, user.last_name)">
                <td class="text-high-emphasis">
                  {{ user.first_name }} {{ user.last_name }}
                </td>
                <td class="text-medium-emphasis">
                  {{ user.fecha}}
                </td>
                <td class="text-medium-emphasis">
                  {{ user.hora}}
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
      <VCard title="Actividad del usuario" v-show="ultimasVisitasVisible">
        
        <VCardText>
          <VTimeline
            density="compact"
            align="start"
            truncate-line="both"
            class="v-timeline-density-compact"
          > 
            <VTimelineItem dot-color="primary" size="x-small"
            v-for="user in ultimasVisitas">
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
