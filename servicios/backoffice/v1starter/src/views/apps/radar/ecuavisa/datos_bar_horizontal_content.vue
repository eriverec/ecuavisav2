<script setup>
  import VueApexCharts from 'vue3-apexcharts';
  import { hexToRgb } from '@layouts/utils';
  import { useTheme } from 'vuetify';

  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  const isLoading = ref(false);
  const uniqueKey = ref(0);

  const props = defineProps({
    dataChart: { type: Array, required: true },
    height: { type: String, required: true, default: 310 },
    typeBar: { type: String, required: true, default: "horizontal" },
    title: { type: String, required: true, default: "multimedia" },
  });

  const availableColors = ['primary', 'info', 'error', 'warning', 'success'];
  const dataChartLocal = ref([]);
  const totalValue = ref(0);
  const customColors = [
    '#836af9',
    // '#ffe802',
    // '#2c9aff',
    // '#ffcf5c',
    // '#4f5d70',
    // '#299aff',
    // '#d4e157',
    // '#28dac6',
    // '#9e69fd',
    // '#ff9800',
    // '#26c6da',
    // '#ff8131',
    // '#28c76f',
    // '#ffbd1f',
    // '#84d0ff',
    // '#edf1f4',
    // '#ff9f43',
  ]


  const dataChart = ref([]);
  const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());
  const vuetifyTheme = useTheme()

  // 👉 Colors variables
  const colorVariables = themeColors => {
    const currentTheme = themeColors.colors
    const variableTheme = themeColors.variables
    const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
    const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
    const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
    const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
    const labelColor = `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`
    
    return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor, labelColor }
  }

  // INICIO DE EVENTO CLICK GRAFICO 1
  const isDialogVisibleChart1 = ref({
    modal: false,
    search: null,
    data:{
      title: "",
      items: []
    }
  })

  const filteredDataModalChart1 = computed(() => {
    if(!isDialogVisibleChart1.value.data.search){
      return isDialogVisibleChart1.value.data.items;
    }

    const query = isDialogVisibleChart1.value.data.search.toLowerCase();
    return isDialogVisibleChart1.value.data.items.filter(item =>{
      return item.title.toLowerCase().includes(query) || item.sitio.toLowerCase().includes(query);
    });
  });

  // FIN DE EVENTO CLICK GRAFICO 1

  const eventClick = function(event, chartContext, opts) {
    // console.log(event, chartContext, opts)
    // console.log(opts.dataPointIndex)
    // console.log(opts.config.xaxis.categories)
    if(opts.dataPointIndex > -1){
      isDialogVisibleChart1.value.modal = true;
      const sitio = opts.config.xaxis.categories[opts.dataPointIndex];
      const articulos = dataChartLocal.value.find(e => e.sitio == sitio);
      isDialogVisibleChart1.value.data.items = articulos.articulos;
      isDialogVisibleChart1.value.data.search = null;
      isDialogVisibleChart1.value.data.title = sitio.toUpperCase();
      
      // console.log(opts.config.xaxis.categories[opts.dataPointIndex])
    }
  }

  const resolveData = computed(() => {
    const { themeBorderColor, themeDisabledTextColor, labelColor } = colorVariables(vuetifyTheme.current.value);
    const currentTheme = vuetifyTheme.current.value.colors
    const variableTheme = vuetifyTheme.current.value.variables

    const totalValueLocal = dataChartLocal.value.reduce((sum, item) => sum + item.total, 0);
    totalValue.value = totalValueLocal;
    const series = dataChartLocal.value.map(item => item.total);
    const colors = dataChartLocal.value.map((item, index) => {
      if(customColors.length < index){
        return customColors[index % customColors.length];
      }
      return customColors[index];
    });

    const seriesFormat = {
        name: props.title,
        data: series
    };

    const categoriesRaw = dataChartLocal.value.map(item => item.content);
  
    let options = {
      chart: {
        parentHeightOffset: 0,
        toolbar: { show: false },
      },
      colors,
      dataLabels: { 
        enabled: true,
        formatter: val => {
          if(props.disabledAll){
            return val;
          }
          return val;
        },
      },
      plotOptions: {
        bar: {
          startingShape: 'rounded',
          borderRadius: 0,
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
      xaxis: {
        title: {
          text: props.title,
          style: {
              fontSize: '11px',
              fontFamily: 'Public Sans',
              color: labelColor,
              cssClass: 'apexcharts-xaxis-laber-cursor',
              cursor:"pointer"
          }
        },
        axisBorder: { show: false },
        axisTicks: { color: themeBorderColor },
        categories: categoriesRaw,
        labels: {
          style: { colors: themeDisabledTextColor },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        },
        theme: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          // series[seriesIndex]
          // console.log()
          return `<div class="tooltip-content">
            <div class="tooltip-body">
              <div class="tooltip-title">
                ${w.config.series[seriesIndex].name}
              </div>
              <!--<div class="tooltip-subtitle">
                Campaña
              </div>-->
              <div class="tooltip-data-flex">
                <div class="tooltip-data-title">
                  ${w.config.xaxis.categories[dataPointIndex]?.toUpperCase()}:
                </div>
                <div class="tooltip-data-value">
                  ${series[seriesIndex][dataPointIndex]}
                </div>
              </div>
            </div>
          </div>`
        }
      },

    }

    return {series: [seriesFormat], options: options, intereses: categoriesRaw};
  });

  watch(() => props.dataChart, async (newValue) => {
    if (newValue) {
      isLoading.value = true;
      const resultado = props.dataChart;
      dataChartLocal.value = resultado;
      isLoading.value = false;
    }
  })

  onMounted(async () => {
    isLoading.value = true;
    const resultado = props.dataChart;
    dataChartLocal.value = resultado;
    isLoading.value = false;
  });

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
  <VDialog
      v-model="isDialogVisibleChart1.modal"
      scrollable
      max-width="650"
    >

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisibleChart1.modal = !isDialogVisibleChart1.modal" />

    <!-- Dialog Content -->
    <VCard>
      <VCardItem >
        <div class="d-flex content-title flex-wrap">
          <div class="d-flex gap-3">
            <div class="d-flex flex-column" style="line-height: 1.3;">
              <h3 class="h2">
                {{ isDialogVisibleChart1.data.title }}
              </h3>
              <div class="d-flex gap-2 align-center mt-2">
                <small style="font-size: 10px;">Artículos</small>
                <VChip size="x-small" color="primary">
                  {{ filteredDataModalChart1.length }} Artículo(s)
                </VChip>
              </div>
            </div>

            
          </div>

          <VTextField v-model="isDialogVisibleChart1.data.search" label="Buscar.."
            prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 0px 0;"
            clearable />

        </div>
      </VCardItem>
      <VCardText style="max-height: 450px;">
        <VList lines="two" class="py-4">
          <div v-if="filteredDataModalChart1.length">
            <VListItem class="py-0">
              
            </VListItem>
          </div>
          <div v-else>
            <td colspan="4" class="no-results">No se encontraron resultados</td>
          </div>
        </VList>
      </VCardText>

      <VCardText class="py-4">
        <VBtn class="my-4" @click="isDialogVisibleChart1.modal = false">
          Cerrar modal.
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
  <VRow class="mt-2">
    <VCol cols="12" md="12" :class="isLoading?'disabled':''">
      <VCard class="elevation-0 border rounded no-truncate my-0 px-1 py-1 pr-2 pb-1">
        <VCardTitle>
          <small>{{props.title}}</small>
        </VCardTitle>
        <VCardText class="mx-0 px-0 pt-0 mt-0 pb-1 pt-0">
          <VueApexCharts
            v-if="dataChartLocal.length > 0"
            :key="generarIDHora()"
            type="bar"
            :height="props.height * 1"
            :options="resolveData.options"
            :series="resolveData.series"
          />

        </VCardText>
      </VCard>
        
    </VCol>
  </VRow>
</template>

<style scoped>
  svg#wordCloud {
    display: block;
    margin: auto;
    width: 100%;
    height: auto;
  }
</style>
<style scoped>
.sectionprimicias .v-card-item {
  font-size: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  height: 400px;
  display: block;
  overflow-y: auto;
}

.content-title {
  justify-content: space-between;
  align-items: center;
}

.board-content {
  height: 500px;
  overflow-y: auto;
}

th,
td {
  /* border: 1px solid #ddd; */
  padding: 8px;
  text-align: left;
}

.fixed-avatar {
    width: 100%;
    height: 130px;
    object-fit: cover;
    object-position: center;
}

.h4.titulo {
    font-size: 13px;
    line-height: 1.3;
}

.apexcharts-xaxis-laber-cursor{
  cursor: pointer;
}

.disabled-card {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}

/* th {
  background-color: #f2f2f2;
} */
</style>