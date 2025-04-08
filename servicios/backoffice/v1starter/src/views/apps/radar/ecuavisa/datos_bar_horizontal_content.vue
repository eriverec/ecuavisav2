<script setup>
import VueApexCharts from 'vue3-apexcharts';
import { hexToRgb } from '@layouts/utils';
import { useTheme } from 'vuetify';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from 'moment/locale/es';
import { ref, computed, watch, onMounted } from 'vue';

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const isLoading = ref(false);
const hasIntersected = ref(false);
const isVisible = ref(false);
const containerRef = ref(null);

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
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`;
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`;
  const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`;
  return { themeDisabledTextColor, themeBorderColor, labelColor };
};

const isDialogVisibleChart1 = ref({
  modal: false,
  search: null,
  data: { title: '', items: [] },
});

const filteredDataModalChart1 = computed(() => {
  if (!isDialogVisibleChart1.value.data.search) return isDialogVisibleChart1.value.data.items;
  const query = isDialogVisibleChart1.value.data.search.toLowerCase();
  return isDialogVisibleChart1.value.data.items.filter(item =>
    item.title.toLowerCase().includes(query) || item.sitio.toLowerCase().includes(query)
  );
});

const eventClick = (event, chartContext, opts) => {
  if (opts.dataPointIndex > -1) {
    // isDialogVisibleChart1.value.modal = true;
    // const sitio = opts.config.xaxis.categories[opts.dataPointIndex];
    // const articulos = dataChartLocal.value.find(e => e.sitio === sitio);
    // isDialogVisibleChart1.value.data.items = articulos.articulos;
    // isDialogVisibleChart1.value.data.search = null;
    // isDialogVisibleChart1.value.data.title = sitio.toUpperCase();
  }
};

const resolveData = computed(() => {
  const { themeBorderColor, themeDisabledTextColor, labelColor } = colorVariables(vuetifyTheme.current.value);
  const totalValueLocal = dataChartLocal.value.reduce((sum, item) => sum + item.total, 0);
  totalValue.value = totalValueLocal;
  const series = dataChartLocal.value.map(item => item.total);
  const colors = dataChartLocal.value.map((_, index) => customColors[index % customColors.length]);
  const seriesFormat = { name: props.title, data: series };
  const categoriesRaw = dataChartLocal.value.map(item => item.content);

  return {
    series: [seriesFormat],
    options: {
      chart: { parentHeightOffset: 0, toolbar: { show: false } },
      colors,
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          startingShape: 'rounded',
          borderRadius: 0,
          barHeight: '50%',
          horizontal: true,
        },
      },
      grid: {
        borderColor: themeBorderColor,
        xaxis: { lines: { show: false } },
        padding: { top: -10 },
      },
      yaxis: { labels: { style: { colors: themeDisabledTextColor } } },
      xaxis: {
        title: {
          text: props.title,
          style: {
            fontSize: '11px',
            fontFamily: 'Public Sans',
            color: labelColor,
            cssClass: 'apexcharts-xaxis-laber-cursor',
            cursor: 'pointer'
          }
        },
        axisBorder: { show: false },
        axisTicks: { color: themeBorderColor },
        categories: categoriesRaw,
        labels: { style: { colors: themeDisabledTextColor } },
      },
      tooltip: {
        y: { formatter: val => val },
        theme: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return `<div class="tooltip-content">
            <div class="tooltip-body">
              <div class="tooltip-title">
                ${w.config.series[seriesIndex].name}
              </div>
              <div class="tooltip-data-flex">
                <div class="tooltip-data-title">
                  ${w.config.xaxis.categories[dataPointIndex]?.toUpperCase()}:
                </div>
                <div class="tooltip-data-value">
                  ${series[seriesIndex][dataPointIndex]}
                </div>
              </div>
            </div>
          </div>`;
        }
      },
    },
  };
});

watch(() => props.dataChart, newValue => {
  if (newValue) {
    isLoading.value = true;
    dataChartLocal.value = props.dataChart;
    isLoading.value = false;
  }
});

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 }
  );
  if (containerRef.value) {
    observer.observe(containerRef.value);
  }
});
</script>

<template>
  <div ref="containerRef">
    <div v-if="isVisible">
      <VDialog v-model="isDialogVisibleChart1.modal" scrollable max-width="650">
        <DialogCloseBtn @click="isDialogVisibleChart1.modal = false" />
        <VCard>
          <VCardItem>
            <div class="d-flex content-title flex-wrap">
              <div class="d-flex gap-3">
                <div class="d-flex flex-column" style="line-height: 1.3;">
                  <h3 class="h2">{{ isDialogVisibleChart1.data.title }}</h3>
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;">Artículos</small>
                    <VChip size="x-small" color="primary">
                      {{ filteredDataModalChart1.length }} Artículo(s)
                    </VChip>
                  </div>
                </div>
              </div>
              <VTextField
                v-model="isDialogVisibleChart1.data.search"
                label="Buscar.."
                prepend-inner-icon="tabler-search"
                density="compact"
                style="max-width: 300px; padding: 0px 0;"
                clearable
              />
            </div>
          </VCardItem>
          <VCardText style="max-height: 450px;">
            <VList lines="two" class="py-4">
              <div v-if="filteredDataModalChart1.length">
                <VListItem class="py-0"></VListItem>
              </div>
              <div v-else>
                <td colspan="4" class="no-results">No se encontraron resultados</td>
              </div>
            </VList>
          </VCardText>
          <VCardText class="py-4">
            <VBtn class="my-4" @click="isDialogVisibleChart1.modal = false">Cerrar modal.</VBtn>
          </VCardText>
        </VCard>
      </VDialog>

      <VRow class="mt-2">
        <VCol cols="12" md="12" :class="isLoading ? 'disabled' : ''">
          <VCard class="elevation-0 border rounded no-truncate my-0 px-1 py-1 pr-2 pb-1">
            <VCardTitle>
              <small>{{ props.title }}</small>
            </VCardTitle>
            <VCardText class="mx-0 px-0 pt-0 mt-0 pb-1 pt-0">
              <VueApexCharts
                v-if="dataChartLocal.length > 0"
                :type="'bar'"
                :height="props.height * 1"
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
.content-title { justify-content: space-between; align-items: center; }
.no-results { text-align: center; font-size: 14px; color: #888; }
.apexcharts-xaxis-laber-cursor { cursor: pointer; }
.disabled-card { pointer-events: none; opacity: 0.6; }

</style>
