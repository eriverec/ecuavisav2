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
    fechaIniSub: String,
    fechaFinSub: String,
  });

  const dataChart = ref([]);

  const isMobile = window.innerWidth <= 768;
  const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());

  // 👉 Colors variables
  const colorVariables = themeColors => {
    const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
    const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
    const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
    const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
    
    return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
  }

  const vuetifyTheme = useTheme();

  const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

  const resolveData = computed(() => {

    let dataRaw = Array.from(dataChart.value);
    const seriesFormat = {
        name: 'Nivel de interés',
        data: []
    };

    const categoriesRaw = [];
    for (let i in dataRaw) {
        let num = parseInt(dataRaw[i].total);
        seriesFormat.data.push(num);
        categoriesRaw.push(dataRaw[i].name);   
    }

    const options= {
        chart: {
          parentHeightOffset: 0,
          toolbar: { show: false },
          height: (seriesFormat.data.length > 0 && seriesFormat.data.length < 6)?400:500
        },
        dataLabels: { 
          enabled: true
        },
        colors: ['#00cfe8','#fdd835'],   
        plotOptions: {
          bar: {
            borderRadius: 0,
            barHeight: '30%',
            horizontal: (
              ((seriesFormat.data.length > 0 && seriesFormat.data.length < 4) || seriesFormat.data.length > 10 )
              || isMobile
            ),
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
          },
        },
        minHeight: 300,
      }


    return {series: [seriesFormat], options: options, intereses: categoriesRaw};
  });

  async function getChart(fechaIniSub, fechaFinSub) {
    await fetch(`https://servicio-de-actividad.vercel.app/grafico/metadato/subseccion/5?fechai=${fechaIniSub}&fechaf=${fechaFinSub}`)
      .then(response => response.json())
      .then(data => {
        if(data.resp){
          dataChart.value = data.data;
        }
      }).catch(error => { 
        // isDialogVisibleChart2.value = false;
        return error;
      });
  }

  watch(props, async (newProps, oldProps) => {
    // Imprime las nuevas fechas
    isLoading.value = true;
    await getChart(newProps.fechaIniSub, newProps.fechaFinSub);
    isLoading.value = false;
      // console.log(resolveData.value.options, resolveData.value.series)
    // Realiza cualquier acción adicional que desees aquí, por ejemplo, actualizar el componente ChartRecomendaciones
  });


</script>
<template>
  <VRow>
    <VCol cols="12" md="12" :class="isLoading?'disabled':''">
        <VueApexCharts
          :key="uniqueKey"
          type="bar"
          :options="resolveData.options"
          :series="resolveData.series"
        />
    </VCol>
  </VRow>
</template>
