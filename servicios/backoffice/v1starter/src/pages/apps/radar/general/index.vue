<script setup>
import { hexToRgb } from '@layouts/utils';
import { computed, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const totalesSitios = ref([]);
const totalValue = ref(0);
const totalesPorHora = ref([]);
const totalValuePorHora = ref(0);
const selectedMedios = ref([]);
const allMedios = ref([]);

// Lista de medios con sus colores
const mediosEsperados = [
  { sitio: "ecuavisa", color: "warning" },
  { sitio: "cnnespanol", color: "error" },
  { sitio: "eluniverso", color: "info" },
  { sitio: "elcomercio", color: "success" },
  { sitio: "teleamazonas", color: "primary" },
];

// Add this new function after fetchMediaData
async function fetchHourlyData() {
  try {
    const response = await fetch('https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/config.php?api=all');
    const data = await response.json();
    
    const twoHoursAgo = moment().subtract(2, 'hours');
    const agrupados = {};
    
    // Process articles
    data.forEach(mediaOutlet => {
      if (!mediaOutlet.articles || !mediaOutlet.media_communication) return;
      
      const medio = mediaOutlet.media_communication.toLowerCase();
      const medioConfig = mediosEsperados.find(m => m.sitio === medio) || { color: "info" };
      
      mediaOutlet.articles.forEach(article => {
        if (!article.fechaPublicacion) return;
        
        const articleDate = moment(article.fechaPublicacion, 'DD/MM/YYYY HH:mm:ss');
        if (articleDate.isAfter(twoHoursAgo)) {
          if (!agrupados[medio]) {
            agrupados[medio] = {
              label: medio,
              total: 0,
              color: medioConfig.color
            };
          }
          agrupados[medio].total += 1;
        }
      });
    });

    totalesPorHora.value = Object.values(agrupados);
    console.log('Recent articles data:', totalesPorHora.value);
  } catch (error) {
    console.error('Error fetching recent data:', error);
    totalesPorHora.value = [];
  }
}

// Add this new computed property
const hourlyChartConfig = computed(() => getHourlyChartConfig(vuetifyTheme.current.value))


// Add this new chart configuration function
const getHourlyChartConfig = themeColors => {
  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  const totalValueLocal = totalesPorHora.value.reduce((sum, item) => sum + item.total, 0);
  totalValuePorHora.value = totalValueLocal;
  const series = totalesPorHora.value.map(item => item.total);
  
  return {
    options: {
      stroke: { width: 0 },
      labels: totalesPorHora.value.map(item => item.label),
      colors: ['#7367f0'],
      dataLabels: {
        enabled: true,
        formatter: val => `${parseFloat(val).toFixed(2)} %`,
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
              show: true,
              name: {
                fontSize: '1.5rem',
              },
              value: {
                fontSize: '1.5rem',
                color: themeSecondaryTextColor,
                formatter: val => `${parseInt(val, 10)}`,
              },
              total: {
                show: true,
                fontSize: '1.5rem',
                label: 'Total por Intervalos',
                color: themePrimaryTextColor,
                formatter: () => `${totalValueLocal}`,
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: { height: 380 },
            legend: { position: 'bottom' },
          },
        },
        {
          breakpoint: 576,
          options: {
            chart: { height: 320 },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    name: { fontSize: '1rem' },
                    value: { fontSize: '1rem' },
                    total: { fontSize: '1rem' },
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


async function fetchMediaData() {
  try {
    const response = await fetch('https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/config.php?api=all');
    const data = await response.json();
    console.log('Raw API data:', data);
    
    // Filter data for current day
    const today = moment().startOf('day');

    // Update allMedios with unique media_communication values
    allMedios.value = [...new Set(data.map(item => item.media_communication?.toLowerCase()))].filter(Boolean);
    
    // Process each media outlet's articles
    const agrupados = data.reduce((acc, mediaOutlet) => {
      if (!mediaOutlet || !mediaOutlet.media_communication) return acc;
      
      const medio = mediaOutlet.media_communication.toLowerCase();
      const medioConfig = mediosEsperados.find(m => m.sitio === medio) || { color: "info" };
      
      // Filter today's articles
      const todayArticles = (mediaOutlet.articles || []).filter(article => {
        if (!article.fechaPublicacion) return false;
        return moment(article.fechaPublicacion, 'DD/MM/YYYY HH:mm:ss').isSame(today, 'day');
      });

      if (!acc[medio]) {
        acc[medio] = {
          sitio: medio,
          color: medioConfig.color,
          total: 0
        };
      }
      
      acc[medio].total = todayArticles.length;
      return acc;
    }, {});
    
    console.log('Grouped data:', agrupados);

    // Convertir a array y ordenar
    totalesSitios.value = Object.values(agrupados).sort((a, b) => b.total - a.total);

    if (selectedMedios.value.length > 0) {
      totalesSitios.value = totalesSitios.value.filter(item => 
        selectedMedios.value.includes(item.sitio)
      );
    }

    console.log('Final totalesSitios:', totalesSitios.value);
  } catch (error) {
    console.error('Error fetching media data:', error);
    totalesSitios.value = [];
  }
}

const vuetifyTheme = useTheme()

const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themePrimaryTextColor }
}

const expenseRationChartConfig = computed(() => getDonutChartConfig(vuetifyTheme.current.value))

const getDonutChartConfig = themeColors => {
  const donutColors = {
    primary: '#7367f0',
    info: '#00cfe8',
    error: '#f25455',
    warning: '#ff9f43',
    success: '#28c76f',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  const totalValueLocal = totalesSitios.value.reduce((sum, item) => sum + item.total, 0);
  totalValue.value = totalValueLocal;
  const series = totalesSitios.value.map(item => item.total);
  
  return {
    options: {
      stroke: { width: 0 },
      labels: totalesSitios.value.map(item => item.sitio),
      colors: totalesSitios.value.map(item => donutColors[item.color]),
      dataLabels: {
        enabled: true,
        formatter: val => `${parseFloat(val).toFixed(2)} %`,
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
              show: true,
              name: {
                fontSize: '1.5rem',
              },
              value: {
                fontSize: '1.5rem',
                color: themeSecondaryTextColor,
                formatter: val => `${parseInt(val, 10)}`,
              },
              total: {
                show: true,
                fontSize: '1.5rem',
                label: 'Total Artículos',
                color: themePrimaryTextColor,
                formatter: () => `${totalValueLocal}`,
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: { height: 380 },
            legend: { position: 'bottom' },
          },
        },
        {
          breakpoint: 576,
          options: {
            chart: { height: 320 },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    name: { fontSize: '1rem' },
                    value: { fontSize: '1rem' },
                    total: { fontSize: '1rem' },
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

watch(selectedMedios, () => {
  fetchMediaData();
}, { deep: true });

// Actualizar datos cada 5 minutos
onMounted(async () => {
  await Promise.all([fetchMediaData(), fetchHourlyData()]);
});
</script>

<template>
 <div class="d-flex gap-2 mt-0 flex-column pb-3">
    <small style="font-size: 13px;">Medios digitales</small>
    <div v-if="totalesSitios.length === 0" class="text-center pa-4">
      No hay datos disponibles para el día de hoy
    </div>
    <div v-else class="d-flex align-center gap-2 mt-0 flex-wrap">
      <div v-for="(item, index) in totalesSitios" :key="item.sitio" class="d-flex align-center">
        <VChip size="x-small" :color="item.color">
          {{item.sitio}}: {{item.total}} Artículo(s)
        </VChip>
        <small style="font-size: 15px;">{{totalesSitios.length > index + 1 ? ', ' : ''}}</small>
      </div>
    </div>
  </div>
  <VueApexCharts
    v-if="totalesSitios.length > 0"
    type="donut"
    height="310"
    :options="expenseRationChartConfig.options"
    :series="expenseRationChartConfig.series"
  />


  <VueApexCharts
    v-if="totalesPorHora.length > 0"
    type="donut"
    height="310"
    :options="hourlyChartConfig.options"
    :series="hourlyChartConfig.series"
  />
    
    <VCombobox
      v-model="selectedMedios"
      :items="allMedios"
      multiple
      chips
      :menu-props="{ maxHeight: '300' }"
      label="Seleccionar medios"
      class="mb-4"
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