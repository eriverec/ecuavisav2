<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const selectRefModulo = ref(null);
const moduloModelLoading = ref(false);
const searchModuloModel = ref(null)
const moduloItemsCopy = ref([]);
const dataModuloModel = ref([]);
const dataModuloItems = ref([]);
const modulosSelectList = ref([]);

const currentTab = ref(0)
const loadingGrafico = ref(false)
const refVueApexChart = ref()

const alumnosRegistrados = ref({
  categories:[],
  data:[],
  colors:["#7367F0"]
})

const cursoRegistrados = ref({
  categories:[],
  completados:[],
  registrados:[]
})

const mesesNum = {
  "enero": "01",
  "febrero": "02",
  "marzo": "03",
  "abril": "04",
  "mayo": "05",
  "junio": "06",
  "julio": "07",
  "agosto": "08",
  "septiembre": "09",
  "octubre": "10",
  "noviembre": "11",
  "diciembre": "12"
};

const mesesMin = {
  "enero": "Ene",
  "febrero": "Feb",
  "marzo": "Mar",
  "abril": "Abr",
  "mayo": "May",
  "junio": "Jun",
  "julio": "Jul",
  "agosto": "Ago",
  "septiembre": "Sep",
  "octubre": "Oct",
  "noviembre": "Nov",
  "diciembre": "Dic"
};

const vuetifyTheme = useTheme()
// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

const currentTheme = vuetifyTheme.current.value.colors
const variableTheme = vuetifyTheme.current.value.variables
const labelPrimaryColor = `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['dragged-opacity'] })`
const legendColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`
const borderColor = `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`
const labelColor = `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`
const labelSuccessColor = `rgba(${hexToRgb(currentTheme.success)},0.2)`
const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`

const chartColors = {
  donut: {
    series1: currentTheme.success,
    series2: '#28c76fb3',
    series3: '#28c76f80',
    series4: labelSuccessColor,
  },
}
onMounted(async ()=>{
  // setTimeout(async function(){
  await getCursoEstudiante();
  // currentTab.value = 0;
  // }, 500);

  for (var i = 2023; i <= 2034; i++) {
    dataModuloItems.value.push({
      title:i.toString(),
      value:i.toString(),
    });

    moduloItemsCopy.value.push({
      title:i.toString(),
      value:i.toString(),
    });

    dataModuloModel.value = moment().format("YYYY").toString();
  }
})

async function getAlumnosRegistradosMes(anio = 2024 ) {
  try {
      loadingGrafico.value = false;

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/grafico/students/mes/grouped?anio=${anio}`, requestOptions);
      const data = await response.json();
      if(data.resp){
        const categories = data.data.map(mes => {
            return mesesMin[mes.mes];
        });

        const valuesStudents = data.data.map(mes => {
            return mes.registros || 0;
        });

        const mesesSelectColorsStudents = data.data.map(mes => {
            if(mesesNum[mes.mes] == moment().format("MM")){
              return currentTheme.primary;
            }
            return labelPrimaryColor;
        });

        alumnosRegistrados.value = {
          categories:categories,
          data:valuesStudents,
          colors: mesesSelectColorsStudents
        };

        // console.log(alumnosRegistrados.value.data)
      }else{
        alert("No se pudo cargar el gráfico, intente nuevamente")
      }

      loadingGrafico.value = true
      
  } catch (error) {
      alert("No se pudo cargar el gráfico, intente nuevamente")
      return console.error(error.message);    
  }
}

async function getCursoEstudiante(){
  try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/grafico/cursos/numero-estudiantes/grouped`, requestOptions);
      const data = await response.json();
      if(data.resp){
        const categories = data.data.map(curso => {
            return curso.titulo;
        });

        const valuesStudents = data.data.map(curso => {
            return curso.registrados || 0;
        });

        const valuesStudentsCompletados = data.data.map(curso => {
            return curso.completados || 0;
        });

        cursoRegistrados.value = {
          categories:categories,
          registrados:valuesStudents,
          completados:valuesStudentsCompletados,
        };

      }else{
        alert("No se pudo cargar el gráfico, intente nuevamente")
      }
      
  } catch (error) {
      alert("No se pudo cargar el gráfico, intente nuevamente")
      return console.error(error.message);    
  }
}

const chartConfigs = computed(() => {
  const colores = [
    currentTheme["grey-300"], // Rojo coral
    currentTheme.primary
  ];

  return [
    {
      title: 'Usuarios',
      icon: 'tabler-users',
      chartOptions: {
        chart: {
          parentHeightOffset: 0,
          type: 'bar',
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            columnWidth: '32%',
            startingShape: 'rounded',
            borderRadius: 4,
            distributed: true,
            dataLabels: { position: 'top' },
          },
        },
        grid: {
          show: false,
          padding: {
            top: 0,
            bottom: 0,
            left: -10,
            right: -10,
          },
        },
        colors: alumnosRegistrados.value.colors,
        dataLabels: {
          enabled: true,
          formatter(val) {
            return `${ val }`
          },
          offsetY: -25,
          style: {
            fontSize: '15px',
            colors: [legendColor],
            fontWeight: '600',
            fontFamily: 'Public Sans',
          },
        },
        legend: { show: false },
        tooltip: { enabled: false },
        xaxis: {
          categories: alumnosRegistrados.value.categories,
          axisBorder: {
            show: true,
            color: borderColor,
          },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: labelColor,
              fontSize: '14px',
              fontFamily: 'Public Sans',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Usuarios registrados',
            style: {
                fontSize: '11px',
                fontFamily: 'Public Sans',
                color: labelColor
            }
          },
          labels: {
            // offsetX: -15,
            formatter(val) {
              return `${ parseInt(val / 1) }`
            },
            style: {
              fontSize: '14px',
              colors: labelColor,
              fontFamily: 'Public Sans',
            },
            min: 0,
            max: 60000,
            tickAmount: 6,
          },
        },
        responsive: [
          {
            breakpoint: 1441,
            options: { plotOptions: { bar: { columnWidth: '41%' } } },
          },
          {
            breakpoint: 590,
            options: {
              plotOptions: { bar: { columnWidth: '61%' } },
              yaxis: { labels: { show: false } },
              grid: {
                padding: {
                  right: 0,
                  left: -20,
                },
              },
              dataLabels: {
                style: {
                  fontSize: '12px',
                  fontWeight: '400',
                },
              },
            },
          },
        ],
      },
      series: [{
        data: alumnosRegistrados.value.data,
      }],
      height:270
    },
    {
      title: 'Curso',
      icon: 'tabler-forms',
      chartOptions: {
        chart: {
          parentHeightOffset: 0,
          zoom: {
            enabled: false
          },
          toolbar:{
            show: false
          },
          type: 'bar',
          height: 350,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              // console.log(config.w.config)
              // alert('Clic en ' + config.w.config.labels[config.dataPointIndex]);
            }
          }
        },
        // labels: categoriesRaw,
        colors: colores,
        stroke: {
          show: true,
          width: 1,
          colors: ['transparent']
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: cursoRegistrados.value.categories,
          axisBorder: {
            show: true,
            color: borderColor,
          },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: labelColor,
              fontSize: '11px',
              fontFamily: 'Public Sans',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Mejores 5 cursos',
            style: {
                fontSize: '11px',
                fontFamily: 'Public Sans',
                color: labelColor
            }
          },
          labels: {
            // offsetX: -15,
            formatter(val) {
              return `${ parseInt(val / 1) }`
            },
            style: {
              fontSize: '14px',
              colors: labelColor,
              fontFamily: 'Public Sans',
            },
            min: 0,
            max: 60000,
            tickAmount: 6,
          },
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " Visitas"
            }
          },
          theme: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            // series[seriesIndex]
            // console.log()
            return `<div class="tooltip-content">
              <div class="tooltip-body">
                <div class="tooltip-title">
                  ${w.config.xaxis.categories[dataPointIndex]}
                </div>
                <!--<div class="tooltip-subtitle">
                  Campaña
                </div>-->
                <div class="tooltip-data-flex">
                  <div class="tooltip-data-title">
                    ${w.config.series[seriesIndex].name}
                  </div>
                  <div class="tooltip-data-value">
                    ${series[seriesIndex][dataPointIndex]}
                  </div>
                </div>
              </div>
            </div>`
          }
        },
        legend: {
          labels: {
            colors: headingColor,
            useSeriesColors: false
          },
        },
        states: { hover: { filter: { type: 'none' } } },
        
        grid: {
          show: false,
          padding: {
            top: 0,
            bottom: 0,
            left: -10,
            right: -10,
          },
        },


        // tooltip: { theme: true },
        // grid: {
        //   padding: {
        //     top: 15,
        //     right: -20,
        //     left: -20,
        //   },
        // },
        // states: { hover: { filter: { type: 'none' } } },
        // plotOptions: {
        //   bar: {
        //     horizontal: false,
        //     columnWidth: '55%',
        //     endingShape: 'rounded'
        //   }
        // },
      },
      series: [{
        name: 'Usuarios Registrados',
        data: cursoRegistrados.value.registrados
      }, {
        name: 'Usuarios que completaron el curso',
        data: cursoRegistrados.value.completados
      }],
      height:270
    },
  ]
});

async function getExportarTopVidesoCompletados(json = {}){
  try {
      const { limit = 1000, page = 1 } = json;

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/grafico-export-all/students/mes/grouped?page=${page}&limit=${limit}&anio=${dataModuloModel.value}`, requestOptions);
      const data = await response.json();

      if(data.resp){
        return data.data.length < 1 ? null : data.data;
      }else{
        return null;
      }
      
  } catch (error) {
      console.log("No se pudo cargar el gráfico, intente nuevamente")
      return null;    
  }
}

function convertToCSV(array) {
    const header = Object.keys(array[0]).join(','); // Obtener las claves del primer objeto para el encabezado
    const rows = array.map(obj => Object.values(obj).join(',')); // Mapear cada objeto a una cadena de valores
    return [header, ...rows].join('\n'); // Unir el encabezado y las filas con saltos de línea
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function exportarTopVidesoCompletados() {
  if(currentTab.value == "0"){
    //Para usuarios
  }

  if(currentTab.value == "1"){
    //Para cursos
  }
  var limit = 1000;
  var page = 1;
  var dataGlobal = [];

  var data = await getExportarTopVidesoCompletados({
    limit,
    page
  });

  if(!data){
    alert("No hay datos que exportar")
    return true;
  }

  while(true){
    page++;

    var dataTemp = await getExportarTopVidesoCompletados({
      limit,
      page
    });

    if(!dataTemp){
      break;
    }

    data.push(...dataTemp);

  }

  const csv = convertToCSV(data);
  downloadCSV(csv, 'estudiantes_registrados.csv');

}

//Buscador anio

watch(async () => dataModuloModel.value, async () => {
  if (dataModuloModel.value) {
    await getAlumnosRegistradosMes(dataModuloModel.value);
  }
});

watch(async () => searchModuloModel.value, async () => {
  if (!searchModuloModel.value) {
    dataModuloItems.value = moduloItemsCopy.value;
  }else{
    dataModuloItems.value = moduloItemsCopy.value.filter((video) => {
      return (video.title.toLowerCase().indexOf(searchModuloModel.value.toLowerCase()) > -1) || video.value.indexOf(searchModuloModel.value) > -1;
    });
  }
});

watch(selectRefModulo, (active) => {
  if(!active){
    setTimeout(()=>{
      searchModuloModel.value = "";
    }, 1000)
  }
});

</script>

<template>
  <VCard
    title="Reporte de alumnos"
    subtitle="Mira los alumnos registrados, cursos y logros"
  >
    <template #append>
      <div class="mt-n4 me-n2 d-flex align-center">
        <VSelect
          class="mr-3"
          style="min-width: 150px;"
          v-model:menu="selectRefModulo"
          no-data-text="No existen el año que deseas buscar"
          :disabled="moduloModelLoading"
          item-text="title"
          item-value="value"
          v-model="dataModuloModel" 
          :items="dataModuloItems"
          label="Filtrar por año"
          :menu-props="{ maxHeight: '400' }">
          <template v-slot:prepend-item>
            <v-list-item>
              <v-list-item-content>
                <VTextField v-model="searchModuloModel" clearable placeholder="Buscar"/>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-2"></v-divider>
          </template>
          <template #selection="{ item }">
                <div>
                    {{ item.title }}
                </div>
            </template>
            <template #item="{ item, props }">
                <v-list-item v-bind="props">
                    <v-list-item-content>
                        <v-list-item-subtitle>
                            <p>_id: {{ item.value }}</p>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </VSelect>
        <VBtn icon size="x-small" variant="plain" color="default" @click="exportarTopVidesoCompletados">
          <VIcon size="22" color="success" icon="tabler-download" />
        </VBtn>
        <!-- <VBtn
          icon
          size="x-small"
          variant="plain"
          color="default"
        >
          <VIcon
            size="22"
            icon="tabler-dots-vertical"
          />

          <VMenu activator="parent">
            <VList>
              <VListItem>
                <VListItemTitle>Actualizar gráfico</VListItemTitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Exportar registros</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn> -->
      </div>
    </template>

    <VCardText>
      <VSlideGroup
        v-model="currentTab"
        show-arrows
        mandatory
      >
        <VSlideGroupItem
          v-for="(report, index) in chartConfigs"
          :key="report.title"
          v-slot="{ isSelected, toggle }"
          :value="index"
        >
          <div
            style=" width: 110px;height: 94px;"
            :style="isSelected ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
            :class="isSelected ? 'border' : 'border border-dashed'"
            class="d-flex flex-column justify-center align-center cursor-pointer rounded px-5 py-2 me-6"
            @click="toggle"
          >
            <VAvatar
              rounded
              size="38"
              :color="isSelected ? 'primary' : 'secondary'"
              variant="tonal"
              class="mb-2"
            >
              <VIcon :icon="report.icon" />
            </VAvatar>
            <p class="mb-0">
              {{ report.title }}
            </p>
          </div>
        </VSlideGroupItem>
      </VSlideGroup>

      <VueApexCharts
        v-if="loadingGrafico"
        ref="refVueApexChart"
        :key="currentTab"
        :options="chartConfigs[Number(currentTab)].chartOptions"
        :series="chartConfigs[Number(currentTab)].series"
        :height="chartConfigs[Number(currentTab)].height"
        class="mt-3"
      />
      <div v-else class="py-4">
        Cargando datos...
      </div>
    </VCardText>
  </VCard>
</template>

<style>
  .apexcharts-legend-series{
    transition: 1s ease all;
    padding: 5px;
    border-radius: 7px;
  }
  .apexcharts-legend-series:hover{
    background-color: #e9e9ea;
  }

  .item-limit{
    max-width: 210px;
    display: flex;
    font-size: 15px;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }
</style>