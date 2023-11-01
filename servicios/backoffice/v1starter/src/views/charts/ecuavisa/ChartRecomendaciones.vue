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
    fechaIni: String,
    fechaFin: String,
    buttonClicked: String
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
        name: 'Interacciones de usuarios',
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

  async function getChart(fechaIni, fechaFin) {
    await fetch(`https://servicio-de-actividad.vercel.app/grafico/metadato/seccion/5?fechai=${fechaIni}&fechaf=${fechaFin}`)
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
    // Imprime las nuevas fechas
    if(newProps.buttonClicked == "btn"){
      await downloadFull();
    }
    
    if(newProps.buttonClicked == "grafico"){
      isLoading.value = true;
      await getChart(newProps.fechaIni, newProps.fechaFin);
      isLoading.value = false;
    }
    
  });

  onMounted(async () => {
    isLoading.value = true;
    await getChart(props.fechaIni, props.fechaFin);
    isLoading.value = false;
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
