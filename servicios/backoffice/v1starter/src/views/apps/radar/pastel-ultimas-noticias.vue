<script setup>
import { hexToRgb } from '@layouts/utils';
import { defineProps } from "vue";
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const props = defineProps({
  data: { type: Array, required: true },
});

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

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  const totalValueLocal = props.data.reduce((sum, item) => sum + item.total, 0);
  totalValue.value = totalValueLocal;
  const series = props.data.map(item => item.total);
  
  return {
    options: {
      stroke: { width: 0 },
      labels: props.data.map(item => item.sitio),
      colors: props.data.map(item => {
        return donutColors[item.color];
      }),
      dataLabels: {
        enabled: true,
        formatter: val => `${parseInt(val, 10)}%`,
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
    series:series
  }
}
</script>

<template>
  <div class="d-flex gap-2 mt-0 flex-column pb-3">
    <small style="font-size: 13px;">Medios digitales</small>
    <div class="d-flex align-center gap-2 mt-0 flex-wrap">
      <div v-for="(item, index) in data" :key="item.sitio" class="d-flex align-center">
        <VChip size="x-small" :color="item.color">
          {{item.sitio}}: {{item.total}} Artículo(s)
        </VChip>
        <small style="font-size: 15px;">{{data.length > index + 1 ? ', ' : ''}}</small>
      </div>
    </div>
  </div>
  <VueApexCharts
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