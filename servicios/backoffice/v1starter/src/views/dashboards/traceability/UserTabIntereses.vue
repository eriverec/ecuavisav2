<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

import { Spanish } from 'flatpickr/dist/l10n/es.js';

import { getBarChartConfigV2 } from "@core/libs/apex-chart/apexCharConfig";

// import ChartNewInteres from '@/views/charts/apex-chart/ChartNewInteres.vue'
const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
const vuetifyTheme = useTheme();


const scatterChartConfig = computed(() => getBarChartConfigV2(vuetifyTheme.current.value));


const currentTab = ref(0);
const seccionesModel = ref({ title: `Todos`, value: "" });
const isLoading = ref(false);
const secciones = ref([]);
const series = ref([]);
const categories = ref([]);
const labels = ref([]);
const refVueApexChart = ref();

const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const getBarChartConfig = themeColors => {
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        barHeight: '50%',
        horizontal: true,
        startingShape: 'rounded',
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      categories: categories.value,
      labels: {
        style: { 
          colors: themeDisabledTextColor 
        },
      },
    },
    labels: labels.value
  }
}


const horizontalBarChartConfig = computed(() => getBarChartConfig(vuetifyTheme.current.value));


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

var getData = async function getDataGrafico(fechai="", fechaf="", seccion="") {
  /*FORMATO DE FECHA A ENVIAR ES MM/DD/YYYY*/
  var raw = JSON.stringify({
      "fechai": fechai || moment().add(-7, 'days').format("MM/DD/YYYY"),
      "fechaf": fechaf || moment().format("MM/DD/YYYY"),
      "seccion": seccion,
  });
  var resp = await fetch(`https://ecuavisa-temas.vercel.app/grafico/intereses/type/bar`,{
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: raw
  }); 
  var obtener = await resp.json();
  series.value = obtener.respuesta;
  labels.value = obtener.labels;
  categories.value = obtener.categories;
  return obtener;
}

var getDataSecciones = async function(fechai="", fechaf="") {
  var resp = await fetch(`https://ecuavisa-temas.vercel.app/grafico/intereses/group/seccion`,{
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
    }
  }); 
  var obtener = await resp.json();
  var data = []
  data.push({title:"Todos", value:""})
  for(var i in obtener.categories){
    data.push({title:obtener.categories[i].name, value:obtener.categories[i].name})
  }
  secciones.value = data;
  return data;
}
var fechai = "";
var fechaf = "";

var filtrarDatos = async function obtenerFechaDispositivos(selectedDates, dateStr, instance){
  //var respJson = await nuevoArchivoJson(archivoJson);
  if(selectedDates.length > 1){
    fechai = moment(selectedDates[0]).format('MM/DD/YYYY');
    fechaf = moment(selectedDates[1]).format('MM/DD/YYYY');
    //var panelGrafico = document.querySelector("#apexchartscrejemplo");
    //panelGrafico.classList.add("disabled");

    isLoading.value = true;
    var obtenerData = await getData(fechai, fechaf);
    isLoading.value = false;
  }
}

async function filtrarDatosSelect(){
  isLoading.value = true;
  var obtenerData = await getData(fechai, fechaf, seccionesModel.value);
  isLoading.value = false;
}

onMounted(async () =>{
  await getData();
  await getDataSecciones();
});

</script>

<template>
  <VCard>
    <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
      <VCardTitle>Intereses de los usuarios suscritos</VCardTitle>

      <template #append>
        <VCardText class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
          <div class="d-flex align-center flex-wrap gap-2">
            <!-- 👉 Reset button -->
            <VSelect style="width: 190px;" v-model="seccionesModel" :items="secciones" label="Secciones"
              clearable clear-icon="tabler-x" :searchable="true" />
            <!-- 👉 Export button -->
            <VBtn variant="tonal" color="success" prepend-icon="tabler-search" @click="filtrarDatosSelect">
              Buscar
            </VBtn>
            <!-- 👉 Add user button -->
          </div>

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
        </VCardText>
        <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
          
      </template>
    </VCardItem>

    <VCardText :class="isLoading==true?'disabled':'' ">
      <VueApexCharts type="bar" height="600" :options="horizontalBarChartConfig" :series="series" />
    </VCardText>
  </VCard>
</template>

<style scope>
.apexcharts-tooltip.apexcharts-theme-light {
  background: #333 !important;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
}
.apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title{
  background: #333 !important;
}

</style>
