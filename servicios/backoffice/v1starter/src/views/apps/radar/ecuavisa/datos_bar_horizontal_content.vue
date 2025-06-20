<script setup>
import VueApexCharts from 'vue3-apexcharts';
import { hexToRgb } from '@layouts/utils';
import { useTheme } from 'vuetify';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from 'moment/locale/es';
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const isVisible = ref(false);
const containerRef = ref(null);
let observer = null;

const props = defineProps({
  dataChart: { type: Array, required: true },
  height: { type: String, required: true, default: '310' },
  typeBar: { type: String, required: true, default: 'horizontal' },
  title: { type: String, required: true, default: 'multimedia' },
});

const dataChartLocal = ref([]);
const totalValue = ref(0);
const customColors = ['#836af9'];

const vuetifyTheme = useTheme();

const colorVariables = themeColors => {
  const currentTheme = themeColors.colors;
  const variableTheme = themeColors.variables;
  const themeDisabledTextColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`;
  const themeBorderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`;
  const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`;
  return { themeDisabledTextColor, themeBorderColor, labelColor };
};

const isDialogVisibleChart1 = ref({
  modal: false,
  search: null,
  data: { title: '', items: [] },
});

const filteredDataModalChart1 = computed(() => {
  const search = isDialogVisibleChart1.value.data.search;
  return !search
    ? isDialogVisibleChart1.value.data.items
    : isDialogVisibleChart1.value.data.items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.sitio.toLowerCase().includes(search.toLowerCase())
      );
});

const eventClick = (event, chartContext, opts) => {
  // Activar modal si quieres
};

const resolveData = computed(() => {
  const { themeBorderColor, themeDisabledTextColor, labelColor } = colorVariables(vuetifyTheme.current.value);
  const totalValueLocal = dataChartLocal.value.reduce((sum, item) => sum + item.total, 0);
  totalValue.value = totalValueLocal;

  const series = dataChartLocal.value.map(item => item.total);
  const categories = dataChartLocal.value.map(item => item.content);
  const colors = dataChartLocal.value.map((_, i) => customColors[i % customColors.length]);

  return {
    series: [{ name: props.title, data: series }],
    options: {
      chart: { parentHeightOffset: 0, toolbar: { show: false } },
      colors,
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 0,
          barHeight: '50%',
          startingShape: 'rounded',
        },
      },
      grid: {
        borderColor: themeBorderColor,
        xaxis: { lines: { show: false } },
        padding: { top: -10 },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { color: themeBorderColor },
        labels: { style: { colors: themeDisabledTextColor } },
        title: {
          text: props.title,
          style: {
            fontSize: '11px',
            fontFamily: 'Public Sans',
            color: labelColor,
            cssClass: 'apexcharts-xaxis-laber-cursor',
            cursor: 'pointer',
          },
        },
      },
      yaxis: {
        labels: { style: { colors: themeDisabledTextColor } },
      },
      tooltip: {
        theme: false,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => `
          <div class="tooltip-content">
            <div class="tooltip-body">
              <div class="tooltip-title">${w.config.series[seriesIndex].name}</div>
              <div class="tooltip-data-flex">
                <div class="tooltip-data-title">${w.config.xaxis.categories[dataPointIndex]?.toUpperCase()}:</div>
                <div class="tooltip-data-value">${series[seriesIndex][dataPointIndex]}</div>
              </div>
            </div>
          </div>
        `,
      },
    },
  };
});

const initObserver = () => {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      isVisible.value = true;
      observer.unobserve(containerRef.value);
    }
  }, { threshold: 0.1 });

  if (containerRef.value) observer.observe(containerRef.value);
};

onMounted(() => {
  dataChartLocal.value = props.dataChart;
  nextTick(initObserver);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});

watch(() => props.dataChart, newVal => {
  if (newVal) {
    dataChartLocal.value = newVal;
    nextTick(initObserver);
  }
});
</script>

<template>
  <div ref="containerRef">
    <div v-if="isVisible">
      <VDialog v-model="isDialogVisibleChart1.modal" scrollable max-width="650">
        <!-- Modal contenido omitido por brevedad -->
      </VDialog>

      <VRow class="mt-2">
        <VCol :key="dataChartLocal.length + '_' + props.title" cols="12">
          <VCard class="elevation-0 border rounded no-truncate my-0 px-1 py-1 pr-2 pb-1">
            <VCardTitle><small>{{ props.title }}</small></VCardTitle>
            <VCardText class="mx-0 px-0 pt-0 mt-0 pb-1 pt-0">
              <VueApexCharts
                v-if="dataChartLocal.length > 0"
                :key="dataChartLocal.length + '_' + props.title"
                :type="'bar'"
                :height="props.height"
                :options="resolveData.options"
                :series="resolveData.series"
                @click="eventClick"
              />
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<style scoped>
.tooltip-content { background-color: #fff; border: 1px solid #ccc; padding: 5px; }
.apexcharts-xaxis-laber-cursor { cursor: pointer; }
</style>
