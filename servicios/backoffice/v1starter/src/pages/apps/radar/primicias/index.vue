<script setup>
import DynamicCardGrid from "@/views/apps/radar/template_card.vue";
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

    const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
    moment.tz.setDefault('America/Guayaquil');

  const data = ref([])
  const searchTerm = ref('')
  const tableSearches = ref({})
  const selectedItemPagina = ref(null)

  const itemsPagina = ref([]);
  const ultimasNoticias = ref([]);
  const currentTab = ref(null)

  const lastUpdate = ref('--:--')
  const nextUpdate = ref(null)
  const horaActual = moment();
  const route = useRoute();
  const router = useRouter();

  function replaceAmp(input) {
    return input.replace(/&amp;/g, "&");
  }

  // IDs válidos
  const validIds = ["primicias", "el-universo", "expreso", "ecuavisa"];

  const idsName = {
    "el-universo": {
      title: "El Universo",
      url: "https://www.eluniverso.com/"
    },
    "primicias": {
      title: "Primicias",
      url: "https://www.primicias.ec/"
    },
    "el-expreso": {
      title: "Expreso",
      url: "https://www.expreso.ec/"
    },
    "ecuavisa": {
      title: "Ecuavisa",
      url: "https://www.ecuavisa.com/"
    },
  };

  const idRouter = ref("primicias");

  // Verificar si el ID es válido
  const idParamsEsValido = ref(validIds.includes(idRouter.value));

  // Observa cambios en el parámetro `id` y redirige si no es válido
  // watch(() => idRouter.value, (newId) => {
  //   idParamsEsValido.value = validIds.includes(newId);
  //   if (route.path.startsWith('/apps/radar/primicias') && !idParamsEsValido.value) {
  //     router.replace('/404'); // Redirigir a la página 404
  //   }
  // }, { immediate: true }); // Ejecutar también en la carga inicial

  const primeraCargaCronConfig = ref(false);

  const updateInterval = ref(300)
  const updateIntervalDisabled = ref(false)
  const updateIntervals = [
    { title: '5 minutos', value: 300 },
    { title: '10 minutos', value: 60 * 10 },
    { title: '15 minutos', value: 60 * 15 },
  ]

  const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
    timeout: 3000
  })

  const filterTableItems = (items, vertical) => {
    const tableSearch = tableSearches.value[vertical]?.toLowerCase() || ''
    return tableSearch
      ? items.filter(item => item.titulo?.toLowerCase().includes(tableSearch))
      : items
  }

  const processedData = computed(() => {
    const seen = new Map();
    
    data.value.forEach(item => {
      const existing = seen.get(item.enlace);
      
      if (!existing || (existing.picture === null && item.picture !== null)) {
        // Si no existe o si el existente tiene picture null y el actual no lo tiene, actualizamos
        seen.set(item.enlace, {
          ...item,
          subVertical: item.subVertical === 'NN' ? '' : item.subVertical,
          isDuplicate: false
        });
      }
    });

    // Devolvemos los valores únicos como un array
    return Array.from(seen.values());
  });


  const groupedData = computed(() => {
   return processedData.value.reduce((acc, item) => {
     // if (!item.isDuplicate) {
     //   if (!acc[item.vertical]) acc[item.vertical] = []
     //   acc[item.vertical].push(item)
     // }
      if (!acc[item.vertical]) acc[item.vertical] = []
      acc[item.vertical].push(item)
      return acc
   }, {})
  })

  const groupedDataSubSeccion = computed(() => {
   return processedData.value.reduce((acc, item) => {
     // if (!item.isDuplicate) {
     //   if (!acc[item.vertical]) acc[item.vertical] = []
     //   acc[item.vertical].push(item)
     // }
      if (!acc[item.subVertical]) acc[item.subVertical] = []
      acc[item.subVertical].push(item)
      return acc
   }, {})
  })

  const filteredData = computed(() => {
    var objeto = [];

    if (!searchTerm.value){
      objeto =  Object.entries(groupedData.value).reduce((acc, [vertical, items]) => {
        if (selectedItemPagina.value.includes(vertical.toUpperCase())){
           acc[vertical] = items
        }
        return acc
      }, {})
    }else{
      objeto = Object.entries(groupedData.value).reduce((acc, [vertical, items]) => {
        const filtered = items.filter(item =>
          item.titulo?.toLowerCase().includes(searchTerm.value?.toLowerCase() || '') || false
        )
        if (filtered.length) acc[vertical] = filtered
        return acc
      }, {});
    }
    

    return {
      'Últimas noticias': ultimasNoticias.value, 
      ...objeto
    };
  })


  const formatDate = (dateString) => {
    return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
  }

  function unificarYFiltrarDuplicados(data) {
    const enlacesUnicos = new Set(); // Para rastrear enlaces únicos
    const resultado = {
      total: 0,
      timestamp: new Date().toISOString(),
      articles: []
    };

    data.forEach((grupo) => {
      grupo.articles.forEach((articulo) => {
        if (!enlacesUnicos.has(articulo.enlace)) {
          enlacesUnicos.add(articulo.enlace); // Registrar enlace

          // Si subVertical está vacío o no definido, asignar "no definido"
          if (!articulo.subVertical || articulo.subVertical.trim() === "") {
            articulo.subVertical = "N/A";
          }

          if (!articulo.vertical || articulo.vertical.trim() === "") {
            articulo.vertical = "home";
          }

          resultado.articles.push(articulo); // Agregar artículo único
        }
      });
    });

    resultado.total = resultado.articles.length; // Actualizar total
    return resultado.articles;
  }

  const loadingBtn = ref(false);
  const principalData = async function(){
    try{
      loadingBtn.value = true;
      const response = await fetch('https://services.ecuavisa.com/gestor/competencias/'+idRouter.value+'/config.php?api=all')
      // const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/radar/radarPrimicias.php')
      // const response = await fetch('https://bigdata.ecuavisa.com:10003/api/v1/BA/ObtenerPublicacion?baseUrl=https%3A%2F%2Fwww.primicias.ec&maxPaginas=1')
      const dataResp = await response.json();
      console.log(dataResp.filter(Boolean))
      data.value = unificarYFiltrarDuplicados(dataResp.filter(Boolean));
      lastUpdate.value = moment(dataResp[0].timestamp).format("DD/MM/YYYY HH:mm");
      nextUpdate.value = dataResp.nextRefresh;

      primeraCargaCronConfig.value = true;
      updateInterval.value = dataResp.minutes * 60;

      // Ordenar por fecha de publicación (de mayor a menor)
      const sortedItems = processedData.value.sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA; // Mayor a menor
      });

      // Obtener los 20 primeros (en este caso es menos)
      const top20Items = sortedItems.slice(0, 12);
      // groupedData.value["Últimas noticias"] = top20Items;
      ultimasNoticias.value = top20Items;


      itemsPagina.value = Object.keys(groupedData.value).map(e => e.toUpperCase());
      selectedItemPagina.value = itemsPagina.value.slice(0, 2);
      loadingBtn.value = false;
      return true;
    }catch(error){
      loadingBtn.value = false;
      return null;
    }
  }


  let timeoutId;

  onMounted(async () => {
    try {
      await principalData();
      // Llamado recurrente cada segundo
      // timeoutId = setTimeout(() => checkRefreshTime(), 1000);
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  })

  watch(selectedItemPagina, (newValue) => {
    if(newValue.length > 0 && !itemsPagina.value.includes(newValue.at(-1))){
      newValue.pop();
      selectedItemPagina.value = newValue;
    }else{
      uniqueKey.value = Date.now();
    }
    // return false;
  })

  async function checkRefreshTime() {
      // Convertir strings a momentos
      const refreshMinutes = (updateInterval.value + (1 * 60)) / 60;
      const nextCronMoment = moment(nextUpdate.value);
      const currentDateTimeMoment = moment();

      // Calcular la diferencia en minutos entre la ejecución del cron y el tiempo actual
      let minutesUntilNextExecution = 0;
      if (nextCronMoment.isAfter(currentDateTimeMoment)) {
          const diffInSeconds = nextCronMoment.diff(currentDateTimeMoment);
          minutesUntilNextExecution = Math.floor(diffInSeconds / 60000);
      }

      // Comprobar si es hora de hacer el refresh
      if (minutesUntilNextExecution <= refreshMinutes && minutesUntilNextExecution >= 0) {
          // Si queremos detener el timeout en algún momento
          clearTimeout(timeoutId);
          // Hacer el refresh de la página
          await principalData();
          console.log("Es tiempo de hacer refresh")
          // location.reload();
      }
  }

  async function editCronUpdate() {
    try{

      if(primeraCargaCronConfig.value){
        primeraCargaCronConfig.value = false;
        return false;
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "minutes": updateInterval.value / 60
      });

      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };
      //console.log('data enviar ',raw);    
      const send = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/radar-digital/'+idRouter.value+'/config.php', requestOptions);
      const respuesta = await send.json();

      if(respuesta.resp){
        snackbar.value = {
          show: true,
          text: `Intervalo actualizado a ${updateInterval.value / 60} minutos`,
          color: 'success'
        }
        await principalData();
      }else{
        snackbar.value = {
          show: true,
          text: `Ocurrió un error, intente nuevamente`,
          color: 'error'
        }
      }
      
      return true;
    }catch(error){
      snackbar.value = {
          show: true,
          text: `Ocurrió un error, intente nuevamente`,
          color: 'error'
        }
      return null;
    }
  }

  watch(updateInterval, async () => {
    // Llamado recurrente cada segundo
    updateIntervalDisabled.value = true;
    await editCronUpdate();
    updateIntervalDisabled.value = false;
  })


  // INICIO DE GRÁFICOS
  import { hexToRgb } from '@layouts/utils';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
  const isLoading = ref(false);
  const uniqueKey = ref(0);

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

  function groupBySubVertical(data) {
      // Crear un objeto para contar los totales por vertical
      const groupedData = data.reduce((acc, item) => {
          const subVertical = item.subVertical;
          // Si la vertical no existe en el acumulador, inicializarla
          if (!acc[subVertical] && selectedItemPagina.value.includes(item.vertical.toUpperCase())) {
              acc[subVertical] = 0;
          }
          // Incrementar el contador de esa vertical
          acc[subVertical]++;
          return acc;
      }, {});

      // Convertir el objeto resultante en el formato deseado
      return Object.keys(groupedData).map(key => ({
          name: key.toUpperCase(),
          total: groupedData[key]
      }));
  }

  function groupByVertical(data) {
      // Crear un objeto para contar los totales por vertical
      const groupedData = data.reduce((acc, item) => {
          const vertical = item.vertical;
          // Si la vertical no existe en el acumulador, inicializarla
          if (!acc[vertical]) {
              acc[vertical] = 0;
          }
          // Incrementar el contador de esa vertical
          acc[vertical]++;
          return acc;
      }, {});

      // Convertir el objeto resultante en el formato deseado
      return Object.keys(groupedData).map(key => ({
          name: key.toUpperCase(),
          total: groupedData[key]
      }));
  }

  const vuetifyTheme = useTheme();

  const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

  const resolveData = computed(() => {

    var dataChart = groupByVertical(processedData.value);

    dataChart = dataChart.filter(e=> selectedItemPagina.value.includes(e.name))

    let dataRaw = Array.from(dataChart);
    const seriesFormat = {
        name: 'Artículos',
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
          height: (seriesFormat.data.length > 0 && seriesFormat.data.length < 6)?300:300,
          events: {
            click: function(event, chartContext, opts) {
              // alert()
              // const category = config.xaxis.categories[dataPointIndex];
              // const value = config.series[seriesIndex].data[dataPointIndex];
              // console.log(`Clicked on ${category} with value ${value}`);
              // Aquí puedes añadir tu lógica personalizada al hacer click en un punto
            }
          }
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
              ((seriesFormat.data.length > 0 && seriesFormat.data.length < 2) || seriesFormat.data.length > 15 )
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

  /////

  const resolveData_2 = computed(() => {

    var dataChart = groupBySubVertical(processedData.value).filter(e => e.total > 0);


    let dataRaw = Array.from(dataChart);

    const seriesFormat = {
        name: 'Artículos',
        data: []
    };

    const categoriesRaw = [];
    for (let i in dataRaw) {
        let num = parseInt(dataRaw[i].total);
        seriesFormat.data.push(num);
        categoriesRaw.push(dataRaw[i].name);   
    }

    const heightChart = (seriesFormat.data.length > 0 && seriesFormat.data.length < 10)?400:800;

    const options= {
        chart: {
          parentHeightOffset: 0,
          toolbar: { show: false },
          height: heightChart
        },
        dataLabels: { 
          enabled: true
        },
        colors: [chartJsCustomColors.primary],   
        plotOptions: {
          bar: {
            borderRadius: 0,
            barHeight: '30%',
            horizontal: (
              ((seriesFormat.data.length > 0 && seriesFormat.data.length < 2) || seriesFormat.data.length > 10 )
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


    return {series: [seriesFormat], options: options, intereses: categoriesRaw, height:heightChart};
  });

  watch(currentTab, (newValue) => {
    uniqueKey.value = Date.now();
  })

  // FIN DE GRÁFICOS

  // INICIO DE EVENTO CLICK GRAFICO 1
  const isDialogVisibleChart1 = ref({
    modal: false,
    search: null,
    data:{
      title: "",
      items: []
    }
  })

  const eventClick = function(event, chartContext, opts) {
    // console.log(event, chartContext, opts)
    // console.log(opts.dataPointIndex)
    // console.log(opts.config.xaxis.categories)
    if(opts.dataPointIndex > -1){
      console.log(opts.config.xaxis.categories[opts.dataPointIndex])
      itemsForVertical(opts.config.xaxis.categories[opts.dataPointIndex])
    }
    // const category = config.xaxis.categories[dataPointIndex];
    // const value = config.series[seriesIndex].data[dataPointIndex];
    // console.log(`Clicked on ${category} with value ${value}`);
    // Aquí puedes añadir tu lógica personalizada al hacer click en un punto
  }

  const itemsForVertical = (verticalChart) => {
    try{
      // var objeto =  Object.entries(groupedData.value).reduce((acc, [vertical, items]) => {
      //   if (vertical.toUpperCase() == verticalChart.toUpperCase()){
      //      acc[vertical.toUpperCase()] = items
      //   }
      //   return acc
      // }, {})
      var objeto = [];
      Object.keys(groupedData.value).forEach(element => {
        if (element.toUpperCase() == verticalChart.toUpperCase()){
          objeto = groupedData.value[element]
        }
      })
      isDialogVisibleChart1.value.data.search = null;

      isDialogVisibleChart1.value.data.items = objeto.sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA; // Mayor a menor
      });

      isDialogVisibleChart1.value.data.title = verticalChart;
      isDialogVisibleChart1.value.modal = true;
      console.log(objeto)
      return objeto;
    }catch(error){
      return [];
    }
  }

  const filteredDataModalChart1 = computed(() => {
    if(!isDialogVisibleChart1.value.data.search){
      return isDialogVisibleChart1.value.data.items;
    }

    const query = isDialogVisibleChart1.value.data.search.toLowerCase();
    return isDialogVisibleChart1.value.data.items.filter(item =>
      item.vertical.toLowerCase().includes(query) || 
      item.autor.toLowerCase().includes(query) || 
      item.titulo.toLowerCase().includes(query)
    );
  });

  // FIN DE EVENTO CLICK GRAFICO 1

  // INICIO DE EVENTO CLICK GRAFICO 2
  const isDialogVisibleChart2 = ref({
    modal: false,
    search: null,
    data:{
      title: "",
      items: []
    }
  })

  const eventClick_2 = function(event, chartContext, opts) {
    // console.log(event, chartContext, opts)
    // console.log(opts.dataPointIndex)
    if(opts.dataPointIndex > -1){
      itemsForVertical_2(opts.config.xaxis.categories[opts.dataPointIndex])
    }
    // const category = config.xaxis.categories[dataPointIndex];
    // const value = config.series[seriesIndex].data[dataPointIndex];
    // console.log(`Clicked on ${category} with value ${value}`);
    // Aquí puedes añadir tu lógica personalizada al hacer click en un punto
  }

  const itemsForVertical_2 = (verticalChart) => {
    try{
      // var objeto =  Object.entries(groupedData.value).reduce((acc, [vertical, items]) => {
      //   if (vertical.toUpperCase() == verticalChart.toUpperCase()){
      //      acc[vertical.toUpperCase()] = items
      //   }
      //   return acc
      // }, {})
      var objeto = [];
      Object.keys(groupedDataSubSeccion.value).forEach(element => {
        if (element.toUpperCase() == verticalChart.toUpperCase() || element.toUpperCase() == ""){
          objeto = groupedDataSubSeccion.value[element]
        }
      })
      isDialogVisibleChart2.value.data.search = null;
      isDialogVisibleChart2.value.data.items = objeto.sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA; // Mayor a menor
      });
      isDialogVisibleChart2.value.data.title = verticalChart;
      isDialogVisibleChart2.value.modal = true;
      // console.log(objeto)
      return objeto;
    }catch(error){
      return [];
    }
  }

  const filteredDataModalChart2 = computed(() => {
    if(!isDialogVisibleChart2.value.data.search){
      return isDialogVisibleChart2.value.data.items;
    }

    const query = isDialogVisibleChart2.value.data.search.toLowerCase();
    return isDialogVisibleChart2.value.data.items.filter(item =>
      item.vertical.toLowerCase().includes(query) || 
      item.autor.toLowerCase().includes(query) || 
      item.titulo.toLowerCase().includes(query)
    );
  });

  // FIN DE EVENTO CLICK GRAFICO 2

</script>

<template>
  <section class="sectionprimicias">
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top end"
    >
      {{ snackbar.text }}
    </VSnackbar>
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
                  <small style="font-size: 10px;">Página</small>
                  <VChip size="x-small" color="primary">
                    {{ filteredDataModalChart1.length }} Artículo(s)
                  </VChip>
                </div>
              </div>

              
            </div>

            <VTextField v-model="isDialogVisibleChart1.data.search" :label="`Buscar en ${isDialogVisibleChart1.data.title}`"
              prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 0px 0;"
              clearable />

          </div>

          <small style="font-size: 13px;" v-if="vertical == 'Últimas noticias'">Información recopilada de todas las páginas</small>
        </VCardItem>
        <VCardText style="max-height: 550px;">
          <VList lines="two" class="py-4">
            <div v-if="filteredDataModalChart1.length">
              <template v-for="item in filteredDataModalChart1">
                <VListItem>
                  <template #prepend>

                    <VAvatar
                      v-if="item.picture"
                      :image="replaceAmp(item.picture)"
                      size="64"
                      rounded
                    />
                    <VIcon
                      v-else
                      icon="tabler-news"
                      size="32"
                    />

                  </template>

                  <VTooltip location="top">
                    <template v-slot:activator="{ props }">
                      <VListItemTitle v-bind="props" class="text-truncate">
                        {{ item.titulo }}
                      </VListItemTitle>
                    </template>
                    <span>{{ item.titulo }}</span>
                  </VTooltip>

                  <VListItemSubtitle>
                    <div class="d-flex gap-2 align-center">
                      <span class="text-xs">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                      <VChip v-if="item.subVertical" class="ml-2" size="small" color="success">{{ item.subVertical }}</VChip>
                    </div>
                    <small style="font-size: 10px;" v-if="vertical == 'Últimas noticias'">Página: {{ item.vertical }}</small>
                    <div title="Autor" class="align-center mt-1" v-if="item.autor" style="font-size: 12px;">
                      <VIcon
                        icon="tabler-user"
                        size="15"
                      />
                      <small style="margin-top: 5px">{{ item.autor }}</small>
                    </div>
                  </VListItemSubtitle>

                  <template #append>
                    <VBtn :href="item.enlace" target="_blank" icon variant="text" size="small">
                      <VIcon icon="tabler-external-link" />
                    </VBtn>
                  </template>
                </VListItem>
              </template>

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
    <VDialog
      v-model="isDialogVisibleChart2.modal"
      scrollable
      max-width="650"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleChart2.modal = !isDialogVisibleChart2.modal" />

      <!-- Dialog Content -->
      <VCard>
        <VCardItem >
          <div class="d-flex content-title flex-wrap">
            <div class="d-flex gap-3">
              <div class="d-flex flex-column" style="line-height: 1.3;">
                <h3 class="h2">
                  {{ isDialogVisibleChart2.data.title }}
                </h3>
                <div class="d-flex gap-2 align-center mt-2">
                  <small style="font-size: 10px;">Página</small>
                  <VChip size="x-small" color="primary">
                    {{ filteredDataModalChart2.length }} Artículo(s)
                  </VChip>
                </div>
              </div>

              
            </div>

            <VTextField v-model="isDialogVisibleChart2.data.search" :label="`Buscar en ${isDialogVisibleChart2.data.title}`"
              prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 0px 0;"
              clearable />

          </div>

          <small style="font-size: 13px;" v-if="vertical == 'Últimas noticias'">Información recopilada de todas las páginas</small>
        </VCardItem>
        <VCardText style="max-height: 550px;">
          <VList lines="two" class="py-4">
            <div v-if="filteredDataModalChart2.length">
              <template v-for="item in filteredDataModalChart2">
                <VListItem>
                  <template #prepend>
                    <VAvatar
                      v-if="item.picture"
                      :image="replaceAmp(item.picture)"
                      size="64"
                      rounded
                    />
                    <VIcon
                      v-else
                      icon="tabler-news"
                      size="32"
                    />
                  </template>

                  <VTooltip location="top">
                    <template v-slot:activator="{ props }">
                      <VListItemTitle v-bind="props" class="text-truncate">
                        {{ item.titulo }}
                      </VListItemTitle>
                    </template>
                    <span>{{ item.titulo }}</span>
                  </VTooltip>

                  <VListItemSubtitle>
                    <div class="d-flex gap-2 align-center">
                      <span class="text-xs">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                      <VChip v-if="item.subVertical" class="ml-2" size="small" color="success">{{ item.subVertical }}</VChip>
                    </div>
                    <small style="font-size: 10px;" v-if="vertical == 'Últimas noticias'">Página: {{ item.vertical }}</small>
                    <div title="Autor" class="align-center mt-1" v-if="item.autor" style="font-size: 12px;">
                        <VIcon
                          icon="tabler-user"
                          size="15"
                        />
                        <small style="margin-top: 5px">{{ item.autor }}</small>
                      </div>
                  </VListItemSubtitle>

                  <template #append>
                    <VBtn :href="item.enlace" target="_blank" icon variant="text" size="small">
                      <VIcon icon="tabler-external-link" />
                    </VBtn>
                  </template>
                </VListItem>
              </template>

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
    <!-- Control Panel -->
    <VCard class="mb-4" v-if="currentTab != 2">
      <VCardText>
        <div class="d-flex justify-content-between gap-1 flex-column">
          <div class="d-flex align-start flex-wrap gap-4 w-100">
            <div class="d-flex flex-column">
              <small>web</small>
              <h3 style="line-height: 1.3;">{{idsName[idRouter].title}}</h3>
              <VChip size="x-small" color="primary">
                {{ processedData.length }} Artículo(s)
              </VChip>
            </div> 
            <VBtn :href="idsName[idRouter].url" target="_blank" icon variant="text" size="small">
              <VIcon icon="tabler-external-link" />
            </VBtn>
            <VTextField v-model="searchTerm" label="Buscar en todos los ártículos" prepend-inner-icon="tabler-search"
              density="compact" style="max-width: 300px" clearable />

              <VSelect
                class="d-none"
                :disabled="updateIntervalDisabled"
                v-model="updateInterval"
                :items="updateIntervals"
                label="Intervalo de actualización"
                style="max-width: 200px"
                density="compact"
            />

            <VSpacer />

            <div class="d-flex align-center gap-2 flex-column">
              <VChip
                color="primary"
                size="small"
                prepend-icon="tabler-clock"
              >
                Última actualización: {{ lastUpdate }}
              </VChip>
              <VChip
                class="d-none"
                color="success"
                size="small"
                prepend-icon="tabler-clock"
              >
                Próxima actualización: {{ nextUpdate }}
              </VChip>
            </div>
          </div>
          <div class="w-100 mt-4 ">
            <label>Filtrar por página</label>
            <VCombobox
              v-model="selectedItemPagina"
              :items="itemsPagina"
              multiple
              chips
              :menu-props="{ maxHeight: '300' }"
            />
          </div>
          <div class="content-btn mt-3">
            <VBtn :loading="loadingBtn" title="Recargar datos" @click="principalData" target="_blank" color="primary" variant="tonal" size="small">
              <VIcon icon="tabler-reload" /> Recargar datos
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>
    <VTabs
      v-model="currentTab"
      class="v-tabs-pill mb-5"
    >
      <VTab>Artículos</VTab>
      <VTab>Estadística</VTab>
      <VTab class="d-none">Últimas noticias</VTab>
    </VTabs>

    <VWindow v-model="currentTab">
      <VWindowItem
        :key="0"
      >
        <VRow v-if="selectedItemPagina" :class="loadingBtn ? 'disabled-card' : ''">
          <VCol cols="12" md="12" :lg="vertical != 'Últimas noticias'?6:12" v-for="(items, vertical) in filteredData" :key="vertical">

            <VCard>

              <VCardItem >
                <div class="d-flex content-title flex-wrap">
                  <div class="d-flex gap-3">
                    <div class="d-flex flex-column" style="line-height: 1.3;">
                      {{ vertical.toUpperCase() }}
                      <div class="d-flex gap-2 align-center mt-2">
                        <small style="font-size: 10px;" v-if="vertical != 'Últimas noticias'">Página</small>
                        <VChip size="x-small" color="primary">
                          {{ items.length }} Artículo(s)
                        </VChip>
                      </div>
                    </div>

                    
                  </div>

                  <VTextField v-model="tableSearches[vertical]" :label="`Buscar en ${vertical.toUpperCase()}`"
                    prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 0px 0;"
                    clearable />

                </div>

                <small style="font-size: 13px;" v-if="vertical == 'Últimas noticias'">Información recopilada de todas las páginas.</small>
              </VCardItem>

              <VDivider />

              <VCardText class="board-content">

                <!-- <VTable class=" tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th>SubVertical</th>
                      <th>Título</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
            
                  <tbody>
                    <tr v-for="item in items" :key="item.enlace">
                      <td>{{ item.subVertical }}</td>
                      <td>
                        <a :href="item.enlace" target="_blank">{{ item.titulo }}</a>
                      </td>
                      <td>{{ formatDate(item.fechaPublicacion) }}</td>
                    </tr>
                  </tbody>
                </VTable> -->

                <div v-if="filterTableItems(items, vertical).length">
                  <DynamicCardGrid :items="filterTableItems(items, vertical)" :vertical="vertical" />
                </div>
                <div v-else>
                  <td colspan="4" class="no-results">No se encontraron resultados</td>
                </div>

              </VCardText>




            </VCard>

          </VCol>
        </VRow>
      </VWindowItem>
      <VWindowItem
        :key="1"
      >
        <VRow v-if="selectedItemPagina">
          <VCol cols="12" md="12" lg="12">
            <VCard
              title="Páginas"
              subtitle="Número de artículos por página"
            >
              <VCardText>
                <VueApexCharts
                  :key="uniqueKey"
                  :height="300"
                  type="bar"
                  :options="resolveData.options"
                  :series="resolveData.series"
                  @click="eventClick"
                />
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="12" md="12" lg="12">
            <VCard
              title="SubSecciones"
              subtitle="Número de artículos por subsección"
            >
              <VCardText>
                <VueApexCharts
                  :key="uniqueKey"
                  type="bar"
                  :height="resolveData_2.height"
                  @click="eventClick_2"
                  :options="resolveData_2.options"
                  :series="resolveData_2.series"
                />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
      <VWindowItem
        :key="2"
      >
        
      </VWindowItem>
    </VWindow>
            

  </section>
</template>

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

.disabled-card {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}
/* th {
  background-color: #f2f2f2;
} */
</style>