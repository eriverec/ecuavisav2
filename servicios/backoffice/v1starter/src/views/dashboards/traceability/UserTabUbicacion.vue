<script setup>
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const cities = ref([]);
const isLoading = ref(true);
const activeIndex = ref(0); // Inicialmente, el primer tab está activado

const orderField = ref("");
const orderAsc = ref(true);

const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY

const fecha = ref({
  i: valoresHoy.i,
  f: valoresHoy.f,
  title: valoresHoy.title
});

const selectedfechaIniFin = ref('Hoy');
const fechaIniFinList = useSelectCalendar();

async function fetchData() {
  try {
    const response = await fetch(
      `https://servicio-de-actividad.vercel.app/ubicaciones/demograficos/v2/all?fechai=${(fecha.value.i).format('MM-DD-YYYY')}&fechaf=${(fecha.value.f).format('MM-DD-YYYY')}`
    );
    const data = await response.json();
    // orderDirection.value = orderDirection.value === 'desc' ? 'desc' : 'asc'
    cities.value = Array.from(data.data);
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  await fetchData();
  isLoading.value = false;
  await accionBackoffice();
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
    return cities.value;
  } else {
    return cities.value;
  }
});

watch(async () => selectedfechaIniFin.value, async () => {
  let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
  fecha.value = {
      i: selectedCombo.i,
      f: selectedCombo.f,
      title: selectedCombo.title
  }

  isLoading.value = true;
  await fetchData();
  isLoading.value = false;

});

const sortedCitiesByLength = computed(() => {
  return sortedCities.value.slice().sort((a, b) => b.data.length - a.data.length);
});
</script>

<template>
  <VCard>
      <VCardItem class="header_card_item">
        <div class="d-flex">
          <div class="descripcion">
            <VCardTitle>Resumen de datos demográficos de {{fecha.title}}</VCardTitle>
            <VCardSubtitle>Un total de {{ sortedCities.length }} registros, mostrando data desde <br> {{fecha.i.format('YYYY-MM-DD')}} hasta {{fecha.f.format('YYYY-MM-DD')}}</VCardSubtitle>
          </div>
        </div>

        <template #append>
          <div class="bg-ecuavisa py-2">
            <div class="date-picker-wrapper" style="width: 100%;">
              <VCombobox :disabled="isLoading" v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint
                hide-selected hint="" />
            </div>
          </div>
        </template>
      </VCardItem>

    <VCardText>
      <div v-if="isLoading">Cargando datos...</div>
      <VList class="card-list" v-else>
        <VExpansionPanels variant="accordion" v-model="activeIndex">
          <VExpansionPanel
            v-for="country in sortedCitiesByLength"
            :key="country.country"
          >
            <VExpansionPanelTitle class="d-flex flex-wrap justify-space-between gap-4">
              <div>
                <VAvatar class="ava" size="34" :image=" 'https://flagcdn.com/w320/' + country.countryCode.toLowerCase() + '.png' " /> {{ country.country }} 
              </div>
              <div style="" :class="`d-flex align-center text-secondary`">
                <VChip label>{{ country.data.length }} {{ country.data.length > 1?"Ciudades":"Ciudad" }} </VChip>
              </div>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div style="border:1px solid rgba(var(--v-theme-on-background), var(--v-disabled-opacity));border-radius: 7px;">
                <VTable class="text-no-wrap">
                  <thead>
                    <tr>
                      <th scope="col">Ciudad</th>
                      <th scope="col">Sesiones</th>
                      <th scope="col">Visitas de Páginas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="city in country.data" :key="city.city">
                      <td> {{ city.city }} </td>
                      <td>
                        <div :class="`d-flex align-center font-weight-semibold ${city.sesiones > 0 ? 'text-success' : 'text-error' }`">
                          <VChip label>{{ city.sesiones }} </VChip>
                        </div>
                      </td>

                      <td>
                        <div :class="`d-flex align-center font-weight-semibold ${city.sesiones > 0 ? 'text-warning' : 'text-error' }`">
                          <VChip label>{{ city.totalNavigationRecord }} </VChip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
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
