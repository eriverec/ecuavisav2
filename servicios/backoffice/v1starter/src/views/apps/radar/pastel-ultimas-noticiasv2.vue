<script setup>
import { hexToRgb } from '@layouts/utils';
import { defineProps } from "vue";
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const props = defineProps({
  data: { type: Array, required: true },
  lastUpdate: { type: String, required: true },
});

const availableColors = ['primary', 'info', 'error', 'warning', 'success'];

const totalesSitios = ref([]);

async function agruparYFiltrarPorTiempo(data) {
  const haceCincoMinutos = moment().subtract(30, "minutes");

  // Get unique sites from the data
  const uniqueSites = [...new Set(data.map(item => item.sitio))];
  
  // Create dynamic sitiosEsperados
  const sitiosEsperados = uniqueSites.map((sitio, index) => ({
    sitio,
    color: availableColors[index % availableColors.length]
  }));

  // Filtrar los registros cuya fechaPublicacion sea de haceCincoMinutos
  const datosFiltrados = data.filter(({ fechaPublicacion }) =>
    {
      // console.log("fechaPublicacion", moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss").isSameOrAfter(haceCincoMinutos))
      return moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss").isSameOrAfter(haceCincoMinutos);
    }
  );

  // Agrupar por sitio y color
  const agrupados = datosFiltrados.reduce((acc, { sitio }) => {
    const siteConfig = sitiosEsperados.find(s => s.sitio === sitio);
    if (siteConfig) {
      const key = `${sitio}-${siteConfig.color}`;
      if (!acc[key]) {
        acc[key] = { sitio, color: siteConfig.color, total: 0 };
      }
      acc[key].total++;
    }
    return acc;
  }, {});

  // Convertir a array y completar con sitios que faltan
  const resultado = sitiosEsperados.map(({ sitio, color }) => {
    const key = `${sitio}-${color}`;
    return agrupados[key] || { sitio, color, total: 0 };
  });

  // Convertir a array, completar sitios que falten y ordenar de mayor a menor
  return sitiosEsperados
    .map(({ sitio, color }) => agrupados[`${sitio}-${color}`] || { sitio, color, total: 0 })
    .sort((a, b) => b.total - a.total);
}

const vuetifyTheme = useTheme()

const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const totalValue = ref(0);

const expenseRationChartConfig = computed(() => getDonutChartConfig(vuetifyTheme.current.value))

const getDonutChartConfig = themeColors => {
  const donutColors = {
    primary: '#7367f0',
    info: '#00cfe8',
    error: '#f25455',
    warning: '#ff9f43',
    success: '#28c76f',
  }

  const customColors = [
    '#ffe802',
    '#836af9',
    '#2c9aff',
    '#ffcf5c',
    '#4f5d70',
    '#299aff',
    '#d4e157',
    '#28dac6',
    '#9e69fd',
    '#ff9800',
    '#26c6da',
    '#ff8131',
    '#28c76f',
    '#ffbd1f',
    '#84d0ff',
    '#edf1f4',
    '#ff9f43',
  ]

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  const totalValueLocal = totalesSitios.value.reduce((sum, item) => sum + item.total, 0);
  totalValue.value = totalValueLocal;
  const series = totalesSitios.value.map(item => item.total);
  const colors = totalesSitios.value.map((item, index) => {
    if(customColors.length < index){
      return customColors[index % customColors.length];
    }
    return customColors[index];
  });
  return {
    options: {
      stroke: { width: 0 },
      labels: totalesSitios.value.map(item => item.sitio),
      colors: colors,
      dataLabels: {
        enabled: true,
        formatter: val => {
          return `${parseFloat(val).toFixed(2)} %`;
        },
      },
      legend: {
        position: 'bottom',
        markers: { offsetX: -3 },
        labels: { colors: themeSecondaryTextColor },
        itemMargin: {
          vertical: 3,
          horizontal: 10,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: false,
              name: {
                fontSize: '1.5rem',
              },
              value: {
                fontSize: '1.5rem',
                color: themeSecondaryTextColor,
                formatter: val => {
                  return `${parseInt(val, 10)}`
                },
              },
              total: {
                show: true,
                fontSize: '1.5rem',
                label: 'Total',
                color: themePrimaryTextColor,
                formatter: () => `${totalValueLocal} Art.`, // 🔹 Mostrar el total dinámico
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 380,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 320,
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    name: {
                      fontSize: '1rem',
                    },
                    value: {
                      fontSize: '1rem',
                    },
                    total: {
                      fontSize: '1rem',
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    series
  }
}

watch(() => props.data, async (newValue) => {
  if (newValue) {
    const resultado = await agruparYFiltrarPorTiempo(props.data);
    totalesSitios.value = resultado;
  }
})

onMounted(async () => {
  const resultado = await agruparYFiltrarPorTiempo(props.data);
  totalesSitios.value = resultado;
});
// Identificador único basado en new Time 
function generarIDHora(){
  const ahora = new Date();
  
  const horas = ahora.getHours().toString().padStart(2, '0'); 
  const minutos = ahora.getMinutes().toString().padStart(2, '0'); 
  const segundos = ahora.getSeconds().toString().padStart(2, '0'); 
  const milisegundos = ahora.getMilliseconds().toString().padStart(3, '0');

  return `${horas}${minutos}${segundos}${milisegundos}`;
}
</script>

<template>
  <div class="d-flex gap-2 mt-0 flex-column pb-3">
    <!-- <small style="font-size: 13px;">Medios digitales</small> -->
    <!-- <div class="d-flex align-center gap-2 mt-0 flex-wrap">
      <div v-for="(item, index) in totalesSitios" :key="item.sitio" class="d-flex align-center">
        <VChip size="x-small" :color="item.color">
          {{item.sitio}}: {{item.total}} Artículo(s)
        </VChip>
        <small style="font-size: 15px;">{{totalesSitios.length > index + 1 ? ', ' : ''}}</small>
      </div>
    </div> -->
  </div>
  <VueApexCharts
    v-if="totalesSitios.length > 0"
    :key="generarIDHora()"
    type="donut"
    height="310"
    :options="expenseRationChartConfig.options"
    :series="expenseRationChartConfig.series"
  />
</template>

<style lang="scss">
  .no-truncate .v-card-title,
  .no-truncate .v-card-subtitle {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: unset !important;
  }
</style>