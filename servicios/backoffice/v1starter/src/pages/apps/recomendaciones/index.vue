<script setup>
import ChartRecomendaciones from "@/views/charts/ecuavisa/ChartRecomendaciones.vue";
// import ChartRecSubsecccion from "@/views/charts/apex-chart/ChartRecSubsecccion.vue";

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const fechaIngresada = ref('');
const fechaIni = ref('');
const fechaFin = ref('');

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

const initData = () => {
  let fechai = moment().subtract(7, 'days').format("YYYY-MM-DD").toString();
  let fechaf = moment().format("YYYY-MM-DD").toString();
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
  // console.log(fechaIngresada.value)
}

onMounted(async() => {
  initData();
});


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
                <VCardSubtitle>Datos desde: {{fechaIni}} hasta {{fechaFin}}</VCardSubtitle>
              </div>
            </div>

            <template #append>
              <div class="date-picker-wrapper" style="width: 250px;">
                <AppDateTimePicker 
                  prepend-inner-icon="tabler-calendar" 
                  density="compact" 
                  v-model="fechaIngresada" 
                  @on-change="obtenerPorFechaMeta"
                  show-current="true" :config="{
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

  </VRow>
</template>