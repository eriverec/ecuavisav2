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
    articulos: { type: Array, required: true }
  });

  const availableColors = ['primary', 'info', 'error', 'warning', 'success'];
  const articulosLocal = ref([]);
  const totalValue = ref(0);
  const customColors = [
    '#836af9',
    '#ffe802',
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

  async function agruparYFiltrarPorTiempo(data, tiempo = "") {
    if(!tiempo){
      tiempo = moment().startOf('day');
    }

    // Get unique sites from the data
    const uniqueSites = [...new Set(data.map(item => item.sitio))];
    
    // Create dynamic sitiosEsperados
    const sitiosEsperados = uniqueSites.map((sitio, index) => ({
      sitio,
      color: customColors[index % customColors.length]
    }));

    // Filtrar los registros cuya fechaPublicacion sea de tiempo
    const datosFiltrados = data.filter(({ fechaPublicacion, sitio }) =>{
        console.log("fechaPublicacion",fechaPublicacion,sitio, moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss").isSameOrAfter(tiempo))
        return moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss").isSameOrAfter(tiempo);
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

  const resolveData = computed(() => {
    const { themeBorderColor, themeDisabledTextColor, labelColor } = colorVariables(vuetifyTheme.current.value);

    const totalValueLocal = articulosLocal.value.reduce((sum, item) => sum + item.total, 0);
    totalValue.value = totalValueLocal;
    const series = articulosLocal.value.map(item => item.total);
    const colors = articulosLocal.value.map((item, index) => {
      if(customColors.length < index){
        return customColors[index % customColors.length];
      }
      return customColors[index];
    });

    const seriesFormat = {
        name: 'Artículos de hoy',
        data: series
    };

    const categoriesRaw = articulosLocal.value.map(item => item.sitio);

    const options= {
        chart: {
          parentHeightOffset: 0,
          toolbar: { show: false }
        },
        dataLabels: { 
          enabled: true,
          formatter: val => {
            return val+" Artículos";
          },
        },
        colors: colors,   
        plotOptions: {
          bar: {
            borderRadius: 0,
            barHeight: '30%',
            horizontal: false,
            startingShape: 'rounded',
          },
        },
        grid: {
          borderColor: themeBorderColor,
          xaxis: {
            lines: { show: true },
          },
          padding: {
            top: -10,
          },
        },
        yaxis: {
          title: {
            text: 'Número de artículos',
            style: {
                fontSize: '11px',
                fontFamily: 'Public Sans',
                color: labelColor
            }
          },
          labels: {
            style: { colors: themeDisabledTextColor },
          },
        },
        xaxis: {
          axisBorder: { show: false },
          axisTicks: { color: themeBorderColor },
          categories: categoriesRaw,
          labels: {
            style: { colors: themeDisabledTextColor },
            formatter: function(value, timestamp, opts) {
              return value.toUpperCase()
            }
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " Artículos"
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

  watch(() => props.articulos, async (newValue) => {
    if (newValue) {
      isLoading.value = true;
      const resultado = await agruparYFiltrarPorTiempo(props.articulos);
      articulosLocal.value = resultado;
      isLoading.value = false;
    }
  })

  onMounted(async () => {
    isLoading.value = true;
    const resultado = await agruparYFiltrarPorTiempo(props.articulos);
    articulosLocal.value = resultado;
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

  /*
  @INICIO SELECTOR DE TIEMPO
  */
  const model_select_hora = ref({ title:"Hoy", value: moment().startOf('day')  });
  const items_select_hora = ref([
    { title:"Hoy", value: moment().startOf('day')  },
    { title:"Hace 20 minutos", value: moment().subtract(20, "minutes")  },
    { title:"Hace 30 minutos", value: moment().subtract(30, "minutes")  },
    { title:"Hace 1 hora", value: moment().subtract(1, "hours")  },
    { title:"Hace 3 horas", value: moment().subtract(3, "hours")  },
    { title:"Hace 5 horas", value: moment().subtract(5, "hours")  },
    { title:"Hace 12 horas", value: moment().subtract(12, "hours")  },
    { title:"Hace 20 horas", value: moment().subtract(20, "hours")  },
  ]);

  watch(() => model_select_hora.value, async (newValue) => {
    if (newValue) {
      isLoading.value = true;
      const resultado = await agruparYFiltrarPorTiempo(props.articulos, newValue);
      articulosLocal.value = resultado;
      console.log("resultado", resultado)
      isLoading.value = false;
    }
  })
  /*
  @FIN SELECTOR DE TIEMPO
  */

</script>
<template>
  <VRow>
    <VCol cols="12" md="12" :class="isLoading?'disabled':''">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Artículos de hoy</VCardTitle>
              <VCardSubtitle>
                Agrupados por medios digitales según la fecha de publicación de los artículos
              </VCardSubtitle>
            </div>
          </div>

          <template #append>
            <VSelect 
              style="min-width: 150px;"
              label="Filtrar por hora"
              v-model="model_select_hora"
              :items="items_select_hora"
              item-text="title"
              item-value="value"
            />
          </template>
        </VCardItem>

        <VCardItem class="pt-0">
          <div class="bg-ecuavisa py-2">
            
          </div>
        </VCardItem>

        <VCardText>
          <VueApexCharts
            v-if="articulosLocal.length > 0"
            :key="generarIDHora()"
            type="bar"
            height="310"
            :options="resolveData.options"
            :series="resolveData.series"
          />

        </VCardText>
      </VCard>
        
    </VCol>
  </VRow>
</template>
