<script setup>
import auFlag from "@/assets/images/icons/countries/au.png";
import brFlag from "@/assets/images/icons/countries/br.png";
import cnFlag from "@/assets/images/icons/countries/cn.png";
import frFlag from "@/assets/images/icons/countries/fr.png";
import inFlag from "@/assets/images/icons/countries/in.png";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
const salesByCountries = [
  {
    avatarImg: brFlag,
    stats: "$2,415k",
    subtitle: "Brazil",
    profitLoss: -6.2,
  },
  {
    avatarImg: inFlag,
    stats: "$865k",
    subtitle: "India",
    profitLoss: 12.4,
  },
  {
    avatarImg: auFlag,
    stats: "$745k",
    subtitle: "Australia",
    profitLoss: -11.9,
  },
  {
    avatarImg: frFlag,
    stats: "$45",
    subtitle: "France",
    profitLoss: 16.2,
  },
  {
    avatarImg: cnFlag,
    stats: "$12k",
    subtitle: "China",
    profitLoss: 14.8,
  },
];

const cities = ref([]);
const isLoading = ref(true);

const orderField = ref("");
const orderAsc = ref(true);

onMounted(async () => {
  const response = await fetch(
    "https://servicio-de-actividad.vercel.app/dispositivos/all"
  );
  const data = await response.json();
  await accionBackoffice();
  const citiesMap = new Map();
  data.data.forEach((activity) => {
    const key = `${activity.country}-${activity.city}`;
    const city = citiesMap.get(key) || {
      country: activity.country,
      city: activity.city,
      countryCode: activity.countryCode,
      count: 0,
      totalNavigationRecords: 0,
    };
    city.count++;
    city.totalNavigationRecords += activity.navigationRecord;
    citiesMap.set(key, city);
  });

  // orderDirection.value = orderDirection.value === 'desc' ? 'desc' : 'asc'
  cities.value = Array.from(citiesMap.values());
  isLoading.value = false;
});

async function accionBackoffice (){
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "dashboard-ubicacion",
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

const sortedCities = computed(() => {
  if (orderField.value) {
    const orderMultiplier = orderAsc.value ? 1 : -1;
    return cities.value.sort(
      (a, b) => (a[orderField.value] - b[orderField.value]) * orderMultiplier
    );
  } else {
    return cities.value;
  }
});

function toggleOrder(field) {
  if (orderField.value === field) {
    orderAsc.value = !orderAsc.value;
  } else {
    orderField.value = field;
    orderAsc.value = true;
  }
}
</script>

<template>
  <VCard title="Resumen de datos demográficos" subtitle="Datos de usuarios registrados desde la creación del proyecto hasta la actualidad">
    <VCardText>
      <div v-if="isLoading">Cargando datos...</div>
      <VList class="card-list" v-else>

        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">Pais</th>
              <th scope="col">Ciudad</th>
              <th scope="col">Sesiones</th>
              <th scope="col">Visitas de Páginas</th>
            </tr>
          </thead>
          <!-- <button @click="toggleOrder('count')">Count {{ orderField === 'count' ? (orderAsc ? '↑' : '↓') : '' }}</button>
      <button @click="toggleOrder('totalNavigationRecords')">Total Navigation Records {{ orderField === 'totalNavigationRecords' ? (orderAsc ? '↑' : '↓') : '' }}</button> -->
          <tbody>
            <tr id="getDispTable" v-for="city in sortedCities" :key="city.city">
              <td>
                <VAvatar class="ava" size="34" :image=" 'https://www.countryflagicons.com/FLAT/64/' + city.countryCode + '.png' " />
                <span class="font-weight-medium">{{ city.country }}</span>
              </td>
              <td> {{ city.city }} </td>
              <td>
                <div :class="`d-flex align-center font-weight-semibold ${city.count > 0 ? 'text-success' : 'text-error' }`">
                  <VChip label>{{ city.count }} </VChip>
                </div>
              </td>

              <td>
                <div :class="`d-flex align-center font-weight-semibold ${city.count > 0 ? 'text-warning' : 'text-error' }`">
                  <VChip label>{{ city.totalNavigationRecords }} </VChip>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VList>
    </VCardText>

  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 19px;
}

.grupoBotones {
  display: flex;
  justify-content: center;
}

.v-avatar {
  border-radius: initial !important;
}

.ava {
  margin-inline-end: 16px;
}
</style>
