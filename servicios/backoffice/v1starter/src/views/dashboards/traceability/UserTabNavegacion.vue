<script setup>
import { useTheme } from 'vuetify';

import CrmActivityTimeline from '@/views/dashboards/traceability/UserTabNavegacionTimeline.vue';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
const vuetifyTheme = useTheme();
const fecha = ref({});
fecha.value = {
  i: moment().add(-5, 'days'),
  f: moment(),
}


// const url = 'https://servicio-de-actividad.vercel.app/actividad/all';

const urlCounts = ref([]);
const isLoading = ref(true);
const itemsPerPage = 8;
const currentPage = ref(1);
const totalCount = computed(() => urlCounts.value.length);

function mergeAndSum(obj1, obj2) {
  const merged = {};

  // Unificar los registros de obj1 en el objeto merged
  for (const item of obj1) {
    const id = item._id;
    if (!merged[id]) {
      merged[id] = { ...item };
    } else {
      merged[id].count += item.count;
    }
  }

  // Unificar los registros de obj2 en el objeto merged
  for (const item of obj2) {
    const id = item._id;
    if (!merged[id]) {
      merged[id] = { ...item };
    } else {
      merged[id].count += item.count;
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

async function fetchData() {
  try {
    var metadatosFetch = [];
    let skip = 1;
    let batchSize = 700;
    isLoading.value = false;
    while (true) {

      const response = await fetch(`https://servicio-de-actividad.vercel.app/paginas/vistas/v2/all?${ new URLSearchParams({ 
        fechai: (fecha.value.i).format('MM-DD-YYYY'), 
        fechaf: (fecha.value.f).format('MM-DD-YYYY'),
        limit: batchSize,
        page: skip
      })}`);
      const data = await response.json();
      console.log("Nombre: ",skip, data.data)
      if (data.data.length === 0) {
        break;
      }
      metadatosFetch = mergeAndSum(metadatosFetch, data.data);
      urlCounts.value = Array.from(metadatosFetch);
      skip += 1;
    }
    
    // urlCounts.value.sort((a, b) => b.count - a.count); // Ordenar los datos
  } catch (error) {
    console.error(error);
  }
}

async function accionBackoffice (){
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "dashboard-navegacion",
            "fecha": dateNow
					});
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
}

onMounted(async ()=>{
  await fetchData();
  await accionBackoffice();
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

</script>

<template>
  <VRow>
    <VCol lg="12" cols="12" sm="6">
      <VCard>
        <VCardItem class="pb-sm-0">
          <VCardTitle>Páginas más vistas de los útimos 5 días</VCardTitle>
          <VCardSubtitle>Un total de {{ totalCount }} registros, mostrando data desde {{fecha.i.format('YYYY-MM-DD')}} hasta {{fecha.f.format('YYYY-MM-DD')}}</VCardSubtitle>
        </VCardItem>

        <VCardText v-if="isLoading">Cargando datos...</VCardText>

        <VCardText  v-else>
          <VTable class="text-no-wrap tableNavegacion mb-5">
            <thead>
              <tr>
                <th scope="col">TÍTULO DE PÁGINA</th>
                <th scope="col">VISITAS</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item  in paginatedUrlCounts" :key="item.url">
                <td class="text-high-emphasis">
                  <span> <a :href="item.url" target="_blank" title="Click para ir a la página"> {{ item._id ? item._id : item.url }}</a> </span>
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

@media (max-width: 1000px) {
  td span {
    max-width: 200px;
  }
}
</style>
