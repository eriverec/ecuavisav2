<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

import { Spanish } from 'flatpickr/dist/l10n/es.js';

import { getScatterChartConfig } from "@core/libs/apex-chart/apexCharConfig";

// import ChartNewInteres from '@/views/charts/apex-chart/ChartNewInteres.vue'
const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
const vuetifyTheme = useTheme();
const scatterChartConfig = computed(() =>
  getScatterChartConfig(vuetifyTheme.current.value)
);
const currentTab = ref(0);
const isLoading = ref(false);
const series = ref([]);
const refVueApexChart = ref();

function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = baseval;
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

/*const series = [{
              name: 'TEAM 1',
              data: generateDayWiseTimeSeries(new Date('2023-04-14').getTime(), 2, {
                min: 10,
                max: 60
              })
            },
            {
              name: 'TEAM 2',
              data: generateDayWiseTimeSeries(new Date('2023-04-14').getTime(), 2, {
                min: 10,
                max: 60
              })
            }];*/
var getData = async function getDataGrafico(fechai="", fechaf="") {
  /*FORMATO DE FECHA A ENVIAR ES MM/DD/YYYY*/
  var raw = JSON.stringify({
      "fechai": fechai || moment().add(-7, 'days').format("MM/DD/YYYY"),
      "fechaf": fechaf || moment().format("MM/DD/YYYY")
  });
  var resp = await fetch(`https://ecuavisa-temas.vercel.app/grafico/intereses`,{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: raw
  }); 
  var obtener = await resp.json();
  series.value = obtener.grafico
  return obtener;
}

var filtrarDatos = async function obtenerFechaDispositivos(selectedDates, dateStr, instance){
  //var respJson = await nuevoArchivoJson(archivoJson);
  if(selectedDates.length > 1){
    var fechai = moment(selectedDates[0]).format('MM/DD/YYYY');
    var fechaf = moment(selectedDates[1]).format('MM/DD/YYYY');
    //var panelGrafico = document.querySelector("#apexchartscrejemplo");
    //panelGrafico.classList.add("disabled");

    isLoading.value = true;
    var obtenerData = await getData(fechai, fechaf);
    isLoading.value = false;
  }
}

onMounted(async () =>
  await getData()
);


</script>

<template>
  <VCard>
    <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
      <VCardTitle>Intereses de los usuarios suscritos</VCardTitle>

      <template #append>
        <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
          <div class="date-picker-wrapper" style="width: 273px">
            <AppDateTimePicker id="date-picker" placeholder="Seleccionar un rango de fecha" prepend-inner-icon="tabler-calendar"
              density="compact" 
              @on-change="filtrarDatos"
              :config="{ 
                locale: Spanish,
                mode:'range',
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
                maxDate: new Date()
              }"
            />
        </div>
      </template>
    </VCardItem>

    <VCardText :class="isLoading==true?'disabled':'' ">
      <VueApexCharts type="scatter" height="400" :options="scatterChartConfig" :series="series" />
    </VCardText>
  </VCard>
</template>
