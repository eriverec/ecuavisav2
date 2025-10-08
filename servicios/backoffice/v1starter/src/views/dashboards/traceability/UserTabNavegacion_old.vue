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
  i: moment().add(-30, 'days'),
  f: moment(),
}


// const url = 'https://servicio-de-actividad.vercel.app/actividad/all';

const urlCounts = ref([]);
const isLoading = ref(true);
const itemsPerPage = 8;
const currentPage = ref(1);
const totalCount = computed(() => urlCounts.value.length);

async function fetchData() {
  try {
    const response = await fetch('https://servicio-de-actividad.vercel.app/actividad/all');
    const data = await response.json();
    const urlMap = new Map();
    
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
  //await accionBackoffice();
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
          <VCardTitle>Páginas más vistas --</VCardTitle>
          <VCardSubtitle>Un total de {{ totalCount }} registros</VCardSubtitle>
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
                  <span> <a :href="item.url" target="_blank" title="Click para ir a la página"> {{ item.title ? item.title : item.url }}</a> </span>
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
    <VCol class="d-none" lg="6" cols="12" sm="6">
    <!-- trazabilidad independiente -->
      <VCard>
        <VCardItem class="pb-sm-0">
          <VCardTitle>Últimas visitas</VCardTitle>
          <!-- <VCardSubtitle>Weekly Earnings Overview</VCardSubtitle> -->
        </VCardItem>
        <CrmActivityTimeline />

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
