<template>
  <div>
    <AppDateTimePicker style="width: 260px;" prepend-inner-icon="tabler-calendar" density="compact"
      v-model="fechaIngesada" show-current=true @on-change="obtenerFecha" :config="{
        position: 'auto right',
        mode: 'range',
        altFormat: 'F j, Y',
        dateFormat: 'm-d-Y',
        maxDate: new Date(),
        reactive: true
      }" />
    <!--  -->
    <div v-if="dataChart.length == 0" class="pt-6 pb-6 text-center">Cargando...</div>
    <VueApexCharts v-else type="area" height="200" :options="resolveData.options" :series="resolveData.series" />
  </div>
</template>
<script setup>
import axios from 'axios';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify'

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
const dataChart = ref([]);
const vuetifyTheme = useTheme();

let formatI = moment().add(-3, 'days').format("MM-DD-YYYY");
let formatF = moment().format("MM-DD-YYYY");
const fechaIngesada = ref(String(formatI + ' a ' + formatF))

// const fechai = ref('2023-12-10');
// const fechaf = ref('2023-12-20');

const fechai = ref(moment().add(-3, 'days').format("YYYY-MM-DD"));
const fechaf = ref(moment().format("YYYY-MM-DD"));

// const act = moment().add(-3, 'days').format("YYYY-MM-DD");
// const fin = moment().format("YYYY-MM-DD");

// console.log("act",act,fin);

const dataGG = ref([]);

const resolveData = computed(() => {
  let dataRaw = Array.from(dataChart.value);
  dataGG.value = dataRaw

  console.log("dataRaw:", dataChart.value);
  const seriesFormat = {
    name: 'Visitas',
    data: []
  };

  const categoriesRaw = [];
  for (let i in dataRaw) {
    let num = parseInt(dataRaw[i].y);
    seriesFormat.data.push(num);
    const end = moment(dataRaw[i].x, "YYYYY-MM-DD hh:mm:00");
    var now = moment(); // fecha de hoy 
    // console.log()
    var duration = moment.duration(now.diff(end));
    duration = parseInt(duration.asMinutes());
    if (duration < 1) {
      duration = 0;
    }
    var min = duration;
    // console.log(dataRaw[i].x)
    categoriesRaw.push(`${(dataRaw[i].x)}`);
  }

  const currentTheme = vuetifyTheme.current.value.colors

  const options = {
    chart: {
      type: 'area',
      toolbar: false,
    },
    markers: { strokeColor: 'transparent' },
    dataLabels: { enabled: false },
    grid: {
      show: false,
      strokeDashArray: 0,
      borderColor: '#90a4ae82',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      },
      padding: {
        left: -8,
        right: 0,
      },
    },
    stroke: {
      width: 3,
      curve: 'straight',
      show: true,
      curve: 'smooth',
    },
    colors: [currentTheme.warning],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.15,
        stops: [
          0,
          95,
          100,
        ],
      },
    },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      lines: { show: false },
      categories: categoriesRaw
    },
    yaxis: {
      labels: { show: false },
      tickAmount: 5,
    },
    tooltip: {
      enabled: true
    },
  }

  return { series: [seriesFormat], options: options, intereses: categoriesRaw };
});


// URL de la API
async function getChart() {
  await fetch(`https://mongo-users-drab.vercel.app/usuario/agrupados?fechai=${fechai.value}&fechaf=${fechaf.value}`)
    .then(response => response.json())
    .then(data => {
      dataChart.value = data.data;
      // console.log(dataChart.value);
      // console.log("dataChart.value:", dataChart.value);
    }).catch(error => {
      return error;
    });
}

// Llamar a la función fetchData al montar el componente
onMounted(async () => {
  await getChart();
});

const obtenerFecha = async (selectedDates, dateStr, instance) => {
  // Actualizar fechai y fechaf
  fechai.value = moment(selectedDates[0]).format('YYYY-MM-DD');
  fechaf.value = moment(selectedDates[1]).format('YYYY-MM-DD');

  // Volver a obtener el gráfico con las nuevas fechas
  await getChart();
  console.log("Rango seleccionado:", dateStr);
};

</script>