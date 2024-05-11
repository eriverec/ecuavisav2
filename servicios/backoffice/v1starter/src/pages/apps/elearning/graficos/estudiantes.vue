<script setup>
import ApexCharts from 'apexcharts';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted, ref } from 'vue';
import 'vue3-form-wizard/dist/style.css';

import { hexToRgb } from '@layouts/utils';
import { useTheme } from 'vuetify';


const vuetifyTheme = useTheme()

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const scatterColors = {
    series1: '#ff9f43',
    series2: '#7367f0',
    series3: '#28c76f',
    series4: '#d86055',
  }
const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value)


const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const data = [
        {
            "_id": "66283aba8c1ca75ec117bf2a",
            "userId": 191509,
            "cursoId": [
                {
                    "_id": "6626d013bdb9b474719e38d3",
                    "titulo": "Diseño Web Profesional El Curso Completo, Práctico y desde 0",
                    "categoria": "Programación"
                },
                {
                    "_id": "66288f73e8540c5cb8f428a4",
                    "titulo": "Primeros Auxilios con Gaby Díaz",
                    "categoria": "Fitness"
                }
            ],
            "created_at": "2024-04-23T22:48:26.113Z"
        },
        {
            "_id": "662aaa7ee5a1eb2cc288cbfa",
            "userId": 185086,
            "cursoId": [
                {
                    "_id": "6626d013bdb9b474719e38d3",
                    "titulo": "Diseño Web Profesional El Curso Completo, Práctico y desde 0",
                    "categoria": "Programación"
                }
            ],
            "created_at": "2024-04-25T19:09:50.673Z"
        },
        {
            "_id": "662ac082764d4824cac8d125",
            "userId": 10425152121990,
            "cursoId": [
                {
                    "_id": "66288f73e8540c5cb8f428a4",
                    "titulo": "Primeros Auxilios con Gaby Díaz",
                    "categoria": "Fitness"
                }
            ],
            "created_at": "2024-04-25T20:43:46.814Z"
        },
        {
            "_id": "6631518222296221c4753e3b",
            "userId": 22170756844,
            "cursoId": [
                {
                    "_id": "66288f73e8540c5cb8f428a4",
                    "titulo": "Primeros Auxilios con Gaby Díaz",
                    "categoria": "Fitness"
                }
            ],
            "created_at": "2024-04-30T20:16:02.333Z"
        },
        {
            "_id": "6632884b9cafceb0d16a63ac",
            "userId": 157280,
            "cursoId": [
                {
                    "_id": "6626d013bdb9b474719e38d3",
                    "titulo": "Diseño Web Profesional El Curso Completo, Práctico y desde 0",
                    "categoria": "Programación"
                }
            ],
            "created_at": "2024-05-01T18:22:03.847Z"
        },
        {
            "_id": "663bf6b3a00ae874f042863b",
            "userId": 188450,
            "cursoId": [
                {
                    "_id": "66288f73e8540c5cb8f428a4",
                    "titulo": "Primeros Auxilios con Gaby Díaz",
                    "categoria": "Fitness"
                }
            ],
            "created_at": "2024-05-08T22:03:31.615Z"
        },
        {
            "_id": "663bffbde82bc6df9caf1cf9",
            "userId": 22170756844,
            "cursoId": [
                {
                    "_id": "66288f73e8540c5cb8f428a4",
                    "titulo": "Primeros Auxilios con Gaby Díaz",
                    "categoria": "Fitness"
                }
            ],
            "created_at": "2024-05-08T22:42:05.424Z"
        }
];

var opcionesEstudiantes = [
  { title: 'Por mes', value: 'mes' },
  { title: 'Por curso', value: 'curso' },
  { title: 'Por categoría', value: 'categoria' }
];

let og = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    colors: [scatterColors.series1, scatterColors.series2, scatterColors.series3, scatterColors.series4],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 2,
        barHeight: '100%',
        horizontal: true,
        startingShape: 'rounded',
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
      // padding: {
      //   top: -10,
      // },
    },
    xaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd hh:mm:ss'
        // format: 'yyyy-MM-dd'

      },
      // y: {
      //   title: {
      //     formatter: function () {
      //       return 'Valor'
      //     }
      //   }
      // }
    },
    yaxis: {
      tickAmount: 10,
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      type: 'datetime',
      labels: {
        style: { colors: themeDisabledTextColor },
        format: 'yyyy-MM-dd'
      },
    },
  }
const selectedOption = ref('mes');

onMounted(() => { 
    crearChartEstudiantes();
});

var chartEstudiantes; 

function crearChartEstudiantes(){
  const chartData = prepareDataEstudiantes(data, selectedOption.value);

  const chartOptions = {     
        chart: {
          toolbar: { show: false },
          type: 'bar',
          height: 500
        },
        legend: {    
            markers: { offsetX: -3 },
            labels: { colors: themeSecondaryTextColor },          
        },
        colors: [scatterColors.series1, scatterColors.series2, scatterColors.series3, scatterColors.series4],
        plotOptions: {
          bar: {
            borderRadius: 1,
            barHeight: '30%',
            horizontal: false,
            startingShape: 'rounded',
          },
        },
        series:[{
            name: 'Estudiantes',
            data: chartData.map(item => item.value)
        }],
        grid: {
          borderColor: "#eee",
          xaxis: {
            lines: { show: false },
          },
          padding: {
            top: -10,
          },
        },
        xaxis: {
          labels: {
            style: { colors: themeDisabledTextColor },
          },
          categories: chartData.map(item => item.label)
        },
        yaxis: {
            tickAmount: 1,
            axisBorder: { show: false },
            axisTicks: { color: themeBorderColor },
            crosshairs: {
                stroke: { color: themeBorderColor },
            },
            labels: {
              style: { colors: themeDisabledTextColor },
            },      

        }
};

  //console.log('chartData', chartData);
 
  chartEstudiantes = new ApexCharts(document.querySelector('#chartEstudiantes'), chartOptions);
  chartEstudiantes.render();       
}
function renderChartEstudiantes() {
    
  const chartData = prepareDataEstudiantes(data, selectedOption.value);
  //console.log('ejecutando chart', chartData);
  const series = [{
      name: 'Estudiantes',
      data: chartData,
      total: chartData.reduce((acc, item) => acc + item.y, 0)
  }];
  
  const chartOptions = {     
        chart: {
          toolbar: { show: false },
          type: 'bar',
          height: 500
        },
        plotOptions: {
          bar: {
            borderRadius: 1,
            barHeight: '30%',
            horizontal: false,
            startingShape: 'rounded',
          },
        },
        series:[{
            name: 'Estudiantes',
            data: chartData.map(item => item.value)
        }],
        grid: {
          borderColor: "#eee",
          xaxis: {
            lines: { show: false },
          },
          padding: {
            top: -10,
          },
        },
        xaxis: {
          categories: chartData.map(item => item.label)
        }
};

  console.log('chartData', chartData);
  chartEstudiantes.updateOptions(chartOptions);
  
}

function prepareDataEstudiantes(data, option) {
  let result = [];

  if (option === 'mes') {
    // Agrupar por mes y contar estudiantes
    const groupedByMonth = data.reduce((acc, student) => {
      const month = new Date(student.created_at).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Convertir el objeto a un array de objetos
    result = Object.keys(groupedByMonth).map(month => ({
      label: getMonthName(parseInt(month)),
      value: groupedByMonth[month]
    }));
  } else if (option === 'curso') {
    // Agrupar por curso y contar estudiantes
    const groupedByCourse = data.reduce((acc, student) => {
      student.cursoId.forEach(course => {
        acc[course.titulo] = (acc[course.titulo] || 0) + 1;
      });
      return acc;
    }, {});

    // Convertir el objeto a un array de objetos
    result = Object.keys(groupedByCourse).map(course => ({
      label: course,
      value: groupedByCourse[course]
    }));
  } else if (option === 'categoria') {
    // Agrupar por categoría y contar estudiantes
    const groupedByCategory = data.reduce((acc, student) => {
      student.cursoId.forEach(course => {
        acc[course.categoria] = (acc[course.categoria] || 0) + 1;
      });
      return acc;
    }, {});

    // Convertir el objeto a un array de objetos
    result = Object.keys(groupedByCategory).map(category => ({
      label: category,
      value: groupedByCategory[category]
    }));
  }

  return result;
}

function getMonthName(month) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[month];
}

</script>

<template>
    <VRow>
    <!-- 👉  Area chart -->
    <VCol cols="12">
      <VCard>
        <VCardText class=" flex-wrap justify-space-between gap-4">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Métricas de estudiantes</VCardTitle>
          </VCardItem>
          <VDivider />
          <VCardItem class="pt-0 pb-0">
            <VCol cols="4">
                <VSelect v-model="selectedOption" @update:modelValue="renderChartEstudiantes" :items="opcionesEstudiantes" label="Filtro" />
            </VCol>
        </VCardItem>
          
            <div class="mt-6" id="chartEstudiantes" ></div>

        </VCardText>
      </VCard>
    </VCol>
    </VRow>
    
  </template>