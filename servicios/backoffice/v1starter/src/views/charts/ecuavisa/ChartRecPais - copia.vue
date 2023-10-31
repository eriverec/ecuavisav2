<script setup>
  import VueApexCharts from 'vue3-apexcharts';
  import { hexToRgb } from '@layouts/utils';
  import { useTheme } from 'vuetify';
  import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart'

  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  const isLoading = ref(false);
  const uniqueKey = ref(0);

  const props = defineProps({
    fechaIniPais: String,
    fechaFinPais: String,
    modelItemsSeccionPais: String,
    paisClicked: String,
  });

  const dataChart = ref([]);

  const isMobile = window.innerWidth <= 768;
  const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());

  const chartJsCustomColors = {
    white: '#fff',
    yellow: '#ffe802',
    primary: '#836af9',
    areaChartBlue: '#2c9aff',
    barChartYellow: '#ffcf5c',
    polarChartGrey: '#4f5d70',
    polarChartInfo: '#299aff',
    lineChartYellow: '#d4e157',
    polarChartGreen: '#28dac6',
    lineChartPrimary: '#9e69fd',
    lineChartWarning: '#ff9800',
    horizontalBarInfo: '#26c6da',
    polarChartWarning: '#ff8131',
    scatterChartGreen: '#28c76f',
    warningShade: '#ffbd1f',
    areaChartBlueLight: '#84d0ff',
    areaChartGreyLight: '#edf1f4',
    scatterChartWarning: '#ff9f43',
  }

  // 👉 Colors variables
  const colorVariables = themeColors => {
    const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
    const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
    const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
    const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
    
    return { labelColor: themeDisabledTextColor, borderColor: themeBorderColor, legendColor: themeSecondaryTextColor }
  }

  const vuetifyTheme = useTheme();

  const { legendColor } = colorVariables(vuetifyTheme.current.value);

  const chartConfig = computed(() => {

    let dataRaw = Array.from(dataChart.value);
    var paisRaw = [];
    var valorRaw = [];
    var total = 0;

    for (var i in dataRaw) {
        var num = parseInt(dataRaw[i].total);
        // console.log(num)
        // valorRaw.push(num);
        total += num;
        paisRaw.push(dataRaw[i].name); 
    }

    for (var i in dataRaw) {
        var num = parseInt(dataRaw[i].total);
        // console.log(num)
        valorRaw.push(((num*100)/total).toFixed(2));
        // total += num;
        // paisRaw.push(dataRaw[i].name); 
    }


    // console.log(valorRaw)

    const data = {
      labels: paisRaw,
      datasets: [{
        borderWidth: 0,
        label: 'Population (millions)',
        data: valorRaw,
        backgroundColor: [
          chartJsCustomColors.primary,
          chartJsCustomColors.yellow,
          chartJsCustomColors.polarChartWarning,
          chartJsCustomColors.polarChartInfo,
          chartJsCustomColors.polarChartGrey,
          chartJsCustomColors.polarChartGreen,
        ],
      }],
    }

    const config = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      layout: {
        padding: {
          top: -5,
          bottom: -45,
        },
      },
      scales: {
        r: {
          grid: { display: false },
          ticks: { display: false },
        },
      },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 25,
            boxWidth: 9,
            color: legendColor,
            usePointStyle: true,
          },
        },
      },
    };
    return {data:data, config};
  });

  

  async function getChart(fechaIniPais, fechaFinPais, seccion) {
    var link = `https://servicio-de-actividad.vercel.app/grafico/metadato/getpais/10?fechai=${fechaIniPais}&fechaf=${fechaFinPais}`;

    if(seccion.value != 0 && seccion != 0){
      link += `&seccion=${seccion}`;
    }

    await fetch(link)
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

  function convertToCSV(objArray) {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
      var line = "";
      for (var index in array[i]) {
        if (line != "") line += ",";

        line += array[i][index];
      }

      str += line + "\r\n";
    }

    return str;
  }

  async function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      items.unshift(headers);
    }

    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);
    var exportedFilenmae = fileTitle + ".csv" || "export.csv";
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  async function downloadFull () {
    let headers = {
      name: "name",
      total: "total"
    };
    let doc = [];
    doc = Array.from(dataChart.value);
    let title = `recomendaciones-${props.fechaIni}-${props.fechaFin}`;
    await exportCSVFile(headers, doc, title);
  };

  watch(props, async (newProps, oldProps) => {
    if(newProps.paisClicked == "btn"){
      await downloadFull();
    }
    if(newProps.paisClicked == "grafico"){
      // Imprime las nuevas fechas
      isLoading.value = true;
      await getChart(newProps.fechaIniPais, newProps.fechaFinPais, newProps.modelItemsSeccionPais);
      isLoading.value = false;
    }
      // console.log(resolveData.value.options, resolveData.value.series)
    // Realiza cualquier acción adicional que desees aquí, por ejemplo, actualizar el componente ChartRecomendaciones
  });


</script>
<template>
  <VRow>
    <VCol cols="12" md="12" :class="isLoading?'disabled':''">
        <PolarAreaChart
          :height="400"
          :chart-data="chartConfig.data"
          :chart-options="chartConfig.config"
        />
    </VCol>
  </VRow>
</template>
