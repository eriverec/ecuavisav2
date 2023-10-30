<script setup>
import ChartRecomendaciones from "@/views/charts/ecuavisa/ChartRecomendaciones.vue";
import ChartRecSubsecciones from "@/views/charts/ecuavisa/ChartRecSubsecciones.vue";
import ChartRecMeta from "@/views/charts/ecuavisa/ChartRecMeta.vue";
// import ChartRecSubsecccion from "@/views/charts/apex-chart/ChartRecSubsecccion.vue";

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const fechaIngresada = ref('');
const fechaIngresadaSubseccion = ref('');
const fechaIngresadaMetadato = ref('');

const fechaIni = ref('');
const fechaFin = ref('');

const fechaIniSub = ref('');
const fechaFinSub = ref('');

const fechaIniMeta = ref('');
const fechaFinMeta = ref('');

async function obtenerPorFechaMeta(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      // currentPage.value = 1;
      let fechaI = moment(selectedDates[0]).format('YYYY-MM-DD');
      let fechaF = moment(selectedDates[1]).format('YYYY-MM-DD');
      fechaIni.value = fechaI;
      fechaFin.value = fechaF;
      // await obtenerFechaDispositivos(fechaI, fechaF);
      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

async function obtenerPorSubsecciones(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      // currentPage.value = 1;
      let fechaI = moment(selectedDates[0]).format('YYYY-MM-DD');
      let fechaF = moment(selectedDates[1]).format('YYYY-MM-DD');
      fechaIniSub.value = fechaI;
      fechaFinSub.value = fechaF;
      // await obtenerFechaDispositivos(fechaI, fechaF);
      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

async function obtenerPorMeta(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      // currentPage.value = 1;
      let fechaI = moment(selectedDates[0]).format('YYYY-MM-DD');
      let fechaF = moment(selectedDates[1]).format('YYYY-MM-DD');
      fechaIniMeta.value = fechaI;
      fechaFinMeta.value = fechaF;
      // await obtenerFechaDispositivos(fechaI, fechaF);
      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

const initData = () => {
  let fechai = moment().subtract(7, 'days').format("YYYY-MM-DD").toString();
  let fechaf = moment().format("YYYY-MM-DD").toString();
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
  // console.log(fechaIngresada.value)
}

const initDataSub = () => {
  let fechai = moment().subtract(3, 'days').format("YYYY-MM-DD").toString();
  let fechaf = moment().format("YYYY-MM-DD").toString();
  fechaIniSub.value = fechai;
  fechaFinSub.value = fechaf;
  fechaIngresadaSubseccion.value = fechai + ' a ' + fechaf;
}

const initDataMeta = () => {
  let fechai = moment().subtract(3, 'days').format("YYYY-MM-DD").toString();
  let fechaf = moment().format("YYYY-MM-DD").toString();
  fechaIniMeta.value = fechai;
  fechaFinMeta.value = fechaf;
  fechaIngresadaMetadato.value = fechai + ' a ' + fechaf;
}

onMounted(async () => {
  initData();
  initDataSub();
  initDataMeta();
});
const items = [
  'Noticias',
  'Estadio',
  'Entretenimiento',
  'Mundo',
  'Estilo'
]

</script>

<style type="text/css">
.disabled {
  opacity: 0.1;
  pointer-events: none;
}

.clickable {
  cursor: pointer;
}
</style>
<template>
  <VRow>
    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Las 5 secciones que más navegan <br>los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper" style="width: 250px;">
              <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresada"
                @on-change="obtenerPorFechaMeta" show-current="true" :config="{
                  position: 'auto right',
                  mode: 'range',
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                  maxDate: new Date(),
                  reactive: true
                }" />

            </div>
          </template>
        </VCardItem>

        <VCardText>
          <ChartRecomendaciones :fechaIni="fechaIni" :fechaFin="fechaFin" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Las 5 subsecciones que más navegan <br>los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper" style="width: 250px;">
              <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresadaSubseccion"
                @on-change="obtenerPorSubsecciones" show-current="true" :config="{
                  position: 'auto right',
                  mode: 'range',
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                  maxDate: new Date(),
                  reactive: true
                }" />

            </div>

          </template>
        </VCardItem>

        <VCardText>
          <ChartRecSubsecciones :fechaIniSub="fechaIniSub" :fechaFinSub="fechaFinSub" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Los 5 metadatos que más navegan <br>los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper" style="width: 250px;">
              <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresadaMetadato"
                @on-change="obtenerPorMeta" show-current="true" :config="{
                  position: 'auto right',
                  mode: 'range',
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                  maxDate: new Date(),
                  reactive: true
                }" />
              <VSelect class="mt-3" :items="items" label="Noticias" />

            </div>
          </template>
        </VCardItem>

        <VCardText>
          <ChartRecMeta :fechaIniMeta="fechaIniMeta" :fechaFinMeta="fechaFinMeta" />
        </VCardText>
      </VCard>
    </VCol>

  </VRow>
</template>