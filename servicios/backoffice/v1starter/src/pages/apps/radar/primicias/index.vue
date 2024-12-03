<script setup>
  import { ref, computed, onMounted } from 'vue'
  import moment from 'moment'

  const data = ref([])
  const searchTerm = ref('')
  const tableSearches = ref({})
  const selectedItemPagina = ref(null)

  const itemsPagina = ref([]);
  const ultimasNoticias = ref([]);
  const currentTab = ref(0)

  const filterTableItems = (items, vertical) => {
    const tableSearch = tableSearches.value[vertical]?.toLowerCase() || ''
    return tableSearch
      ? items.filter(item => item.titulo?.toLowerCase().includes(tableSearch))
      : items
  }

  const processedData = computed(() => {
   const seen = new Set()
   return data.value.map(item => {
     // const isDuplicate = seen.has(item.titulo)
     // if (!isDuplicate) seen.add(item.titulo)
     return {
       ...item,
       subVertical: item.subVertical === 'NN' ? '' : item.subVertical,
       isDuplicate: false
     }
   })
  })

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

  onMounted(async () => {
    try {
      const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/radar/radarPrimicias.php')
      // const response = await fetch('https://bigdata.ecuavisa.com:10003/api/v1/BA/ObtenerPublicacion?baseUrl=https%3A%2F%2Fwww.primicias.ec&maxPaginas=1')
      data.value = await response.json();

      // Ordenar por fecha de publicación (de mayor a menor)
      const sortedItems = data.value.sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA; // Mayor a menor
      });

      // Obtener los 20 primeros (en este caso es menos)
      const top20Items = sortedItems.slice(0, 20);
      // groupedData.value["Últimas noticias"] = top20Items;
      ultimasNoticias.value = top20Items;


      itemsPagina.value = Object.keys(groupedData.value).map(e => e.toUpperCase());
      selectedItemPagina.value = itemsPagina.value.slice(0, 3);

    } catch (error) {
      console.error('Error fetching data:', error)
    }
  })

  watch(selectedItemPagina, (newValue) => {
    if(newValue.length > 0 && !itemsPagina.value.includes(newValue.at(-1))){
      newValue.pop();
      selectedItemPagina.value = newValue;
    }
    // return false;
  })


  ///////////////////
  import VueApexCharts from 'vue3-apexcharts';
  import { hexToRgb } from '@layouts/utils';
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
          if (!acc[subVertical]) {
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

    var dataChart = groupByVertical(data.value);

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
              alert()
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


    return {series: [seriesFormat], options: options, intereses: categoriesRaw};
  });

  /////

  const resolveData_2 = computed(() => {

    var dataChart = groupBySubVertical(data.value);


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
          height: (seriesFormat.data.length > 0 && seriesFormat.data.length < 6)?300:300
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


    return {series: [seriesFormat], options: options, intereses: categoriesRaw};
  });

  watch(currentTab, (newValue) => {
    uniqueKey.value = Date.now();
    // return false;
  })

  const eventClick = function(event, chartContext, opts) {
      // console.log(event, chartContext, opts)
      // console.log(opts.dataPointIndex)
      // console.log(opts.config.xaxis.categories)
      if(opts.dataPointIndex > -1){
        console.log(opts.config.xaxis.categories[opts.dataPointIndex])
      }
      // const category = config.xaxis.categories[dataPointIndex];
      // const value = config.series[seriesIndex].data[dataPointIndex];
      // console.log(`Clicked on ${category} with value ${value}`);
      // Aquí puedes añadir tu lógica personalizada al hacer click en un punto
    }
</script>

<template>
  <section class="sectionprimicias">
    <!-- Control Panel -->
    <VCard class="mb-4">
      <VCardText>
        <div class="d-flex justify-content-between gap-1 flex-column">
          <div class="d-flex align-end flex-wrap gap-4 w-100">
            <div class="d-flex flex-column">
              <small>web</small>
              <h3 style="line-height: 1.3;">Primicias</h3>
            </div> 
            <VBtn href="https://www.primicias.ec/" target="_blank" icon variant="text" size="small">
              <VIcon icon="tabler-external-link" />
            </VBtn>
            <VTextField v-model="searchTerm" label="Buscar en todos los ártículos" prepend-inner-icon="tabler-search"
              density="compact" style="max-width: 300px" clearable />
          </div>
          <div class="w-100 mt-4 ">
            <label>Filtrar por página</label>
            <VCombobox
              v-model="selectedItemPagina"
              :items="itemsPagina"
              multiple
              chips
            />
          </div>
        </div>
      </VCardText>
    </VCard>
    <VTabs
      v-model="currentTab"
      class="v-tabs-pill mb-5"
    >
      <VTab>Listado de artículo</VTab>
      <VTab>Estadística</VTab>
    </VTabs>

    <VWindow v-model="currentTab">
      <VWindowItem
        :key="0"
      >
        <VRow v-if="selectedItemPagina">
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

                <small style="font-size: 13px;" v-if="vertical == 'Últimas noticias'">Información recopilada de todas las páginas</small>
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

                <VList lines="two">
                  <div v-if="filterTableItems(items, vertical).length">
                    <template v-for="item in filterTableItems(items, vertical)">
                      <VListItem>
                        <template #prepend>

                          <VIcon icon="tabler-news" size="32" />
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
                  :height="300"
                  type="bar"
                  :options="resolveData_2.options"
                  :series="resolveData_2.series"
                />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
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

/* th {
  background-color: #f2f2f2;
} */
</style>