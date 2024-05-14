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

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

var opcionesEstudiantes = [
  { title: 'Por mes', value: 'mes' },
  { title: 'Por curso', value: 'curso' },
  { title: 'Por categoría', value: 'categoria' }
];

const selectedOption = ref('mes');
const estudiantesDatos = ref([]);
const topVideosCompletados = ref([]);
const topCursosCompletados = ref([]);

var dataTemp = [
        {
            "userId": 191509,
            "cursoId": "6626d013bdb9b474719e38d3",
            "tituloCurso": "Diseño Web Profesional El Curso Completo, Práctico y desde 0"
        },
        {
            "userId": 188450,
            "cursoId": "66288f73e8540c5cb8f428a4",
            "tituloCurso": "Primeros Auxilios con Gaby Díaz"
        },
        {
            "userId": 185086,
            "cursoId": "6626d013bdb9b474719e38d3",
            "tituloCurso": "Diseño Web Profesional El Curso Completo, Práctico y desde 0"
        },
        {
            "userId": 157280,
            "cursoId": "6626d013bdb9b474719e38d3",
            "tituloCurso": "Diseño Web Profesional El Curso Completo, Práctico y desde 0"
        }
    ]

async function getEstudiantesGrafico(){
  const consulta = await fetch("https://servicio-elearning.vercel.app/grafico/students/curso");
  const datos = await consulta.json();
  estudiantesDatos.value = datos.data;
}

async function getVideosCompletadosGrafico(){
  const consulta = await fetch("https://servicio-elearning.vercel.app/grafico/videos_completados");
  const datos = await consulta.json();
  topVideosCompletados.value = datos.data;
}

async function getCursosCompletadosGrafico(){
  const consulta = await fetch("https://servicio-elearning.vercel.app/cursos_completados/get");
  const datos = await consulta.json();
  topCursosCompletados.value = datos.data;
}


onMounted(async() => { 
    await getEstudiantesGrafico();
    await getVideosCompletadosGrafico();
    await getCursosCompletadosGrafico();
    crearChartEstudiantes();
    crearChartTopCursosInscritos();
    crearChartTopVideosCompletados();
    crearChartTopCursosCompletados();
});

// Gráficos de estudiantes

var chartEstudiantes; 

function crearChartEstudiantes(){
  const chartData = prepareDataEstudiantes(estudiantesDatos.value, selectedOption.value);

  const scatterColors = {
    series1: '#ff9f43',
    series2: '#7367f0',
    series3: '#28c76f',
    series4: '#d86055',
  }
  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value)

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
            data: chartData.map(item => parseInt(item.value))
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

            axisBorder: { show: false },
            axisTicks: { color: themeBorderColor },
            crosshairs: {
                stroke: { color: themeBorderColor },
            },
            labels: {
              style: { colors: themeDisabledTextColor },
              formatter: function(val) {
                return val.toFixed(0);
              }
            }   
        }
  };

  //console.log('chartData', chartData);
 
  chartEstudiantes = new ApexCharts(document.querySelector('#chartEstudiantes'), chartOptions);
  chartEstudiantes.render();       
}
function renderChartEstudiantes() {
    
  const chartData = prepareDataEstudiantes(estudiantesDatos.value, selectedOption.value);
  //console.log('ejecutando chart', chartData);
  const series = [{
      name: 'Estudiantes',
      data: chartData,
      total: chartData.reduce((acc, item) => acc + item.y, 0)
  }];
  
  const scatterColors = {
    series1: '#ff9f43',
    series2: '#7367f0',
    series3: '#28c76f',
    series4: '#d86055',
  }
  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value)

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
            data: chartData.map(item => parseInt(item.value))
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
            
            axisBorder: { show: false },
            axisTicks: { color: themeBorderColor },
            crosshairs: {
                stroke: { color: themeBorderColor },
            },
            labels: {
              style: { colors: themeDisabledTextColor },
              formatter: function(val) {
                return val.toFixed(0);
              }
            }   
        }
  };

  //console.log('chartData', chartData);
  chartEstudiantes.updateOptions(chartOptions);
  
}

function prepareDataEstudiantes(data, option) {
  //console.log(data);
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

function exportarEstudiantesCSV() {
  const chartData = prepareDataEstudiantes(estudiantesDatos.value, selectedOption.value);
  let csvContent = "data:text/csv;charset=utf-8,";

  // Encabezado CSV
  if (selectedOption.value === 'mes') {
    csvContent += "Mes,Estudiantes\n";
  } else if (selectedOption.value === 'curso') {
    csvContent += "Curso,Estudiantes\n";
  } else if (selectedOption.value === 'categoria') {
    csvContent += "Categoría,Estudiantes\n";
  }

  // Agregar datos al contenido CSV
  chartData.forEach(row => {
    csvContent += `${row.label.replace(/,/g, '')},${row.value}\n`;
  });

  // Crear enlace de descarga
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "datos_estudiantes.csv");
  document.body.appendChild(link);

  // Simular clic en el enlace para iniciar la descarga
  link.click();
}
//------------------------------------------------------------------------------------------------------------------
//------------------------------            Gráficos de totales         --------------------------------------------
//------------------------------------------------------------------------------------------------------------------

    // -------------------------------          Top Cursos Inscritos         --------------------------------------------
var chartTopCursosInscritos;

function crearChartTopCursosInscritos(){
  const chartData = prepareDataEstudiantes(estudiantesDatos.value, "curso").slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);

  const donutColors = {
    series1: '#fdd835',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#32baff',
    series5: '#ffa1a1',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(vuetifyTheme.current.value)
  
  const chartOptions = {
    chart: {
      type: 'donut',
      height: 500
    },
    colors: [donutColors.series1, donutColors.series2, donutColors.series3, donutColors.series4],
    legend: {
      width: 250,
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
    },
    series: chartData.map(item => parseInt(item.value)),
    labels: chartData.map(item => item.label),
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
            name: {
              fontSize: '1.5rem',
            },
            value: {
              fontSize: '1.5rem',
              color: themeSecondaryTextColor,
              //formatter: val => `${parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              //label: 'Operational',
              //formatter: () => '31%',
              color: themePrimaryTextColor,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 200,
          },
          legend: {
            show: false,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1rem',
                  },
                },
              },
            },
          },
        },
      },
    ]
  };

  //console.log('chartData', chartData);
  chartTopCursosInscritos = new ApexCharts(document.querySelector('#chartTopCursosInscritos'), chartOptions);
  chartTopCursosInscritos.render();       
}

function exportarTopCursosInscritos() {
  const chartData = prepareDataEstudiantes(estudiantesDatos.value, "curso").slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);
  let csvContent = "data:text/csv;charset=utf-8,";
  // Encabezado CSV
  csvContent += "Curso,Estudiantes\n";
   // Agregar datos al contenido CSV
  chartData.forEach(row => {
    csvContent += `${row.label.replace(/,/g, '')},${row.value}\n`;
  });
  // Crear enlace de descarga
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "cursos_mas_tomados.csv");
  document.body.appendChild(link);

  // Simular clic en el enlace para iniciar la descarga
  link.click();
}

    // -------------------------------          Top videos completados         ----------------------------------------

var chartTopVideosCompletados;
function prepareDataTopVideosCompletados(data) {
  //console.log('data videosCompletados', data);
  const videoCounts = {};
  data.forEach(item => {
    item.videosCompletados.forEach(video => {
      videoCounts[video._id] = (videoCounts[video._id] || 0) + 1;
    });
  });

  return Object.keys(videoCounts).map(videoId => ({
    label: data.find(item => item.videosCompletados.find(video => video._id === videoId)).videosCompletados.find(video => video._id === videoId).titulo,
    value: videoCounts[videoId]
  }));
} 

function crearChartTopVideosCompletados(){
  const chartData = prepareDataTopVideosCompletados(topVideosCompletados.value).slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);

  const donutColors = {
    series1: '#fdd835',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#32baff',
    series5: '#ffa1a1',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(vuetifyTheme.current.value)
  
  const chartOptions = {
    chart: {
      type: 'donut',
      height: 500
    },
    colors: [donutColors.series1, donutColors.series2, donutColors.series3, donutColors.series4],
    legend: {
      width: 250,
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
    },
    series: chartData.map(item => parseInt(item.value)),
    labels: chartData.map(item => item.label),
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
            name: {
              fontSize: '1.5rem',
            },
            value: {
              fontSize: '1.5rem',
              color: themeSecondaryTextColor,
              //formatter: val => `${parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              //label: 'Operational',
              //formatter: () => '31%',
              color: themePrimaryTextColor,
            },
          },
        },
        
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 200,
          },
          legend: {
            show: false,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1rem',
                  },
                },
              },
            },
          },
        },
      },
    ]
  };

  //console.log('chartData', chartData);
  chartTopVideosCompletados = new ApexCharts(document.querySelector('#chartTopVideosVistos'), chartOptions);
  chartTopVideosCompletados.render();       
}

function exportarTopVidesoCompletados() {
  const chartData = prepareDataTopVideosCompletados(topVideosCompletados.value).slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);
  
  let csvContent = "data:text/csv;charset=utf-8,";
  // Encabezado CSV
  csvContent += "Video,Veces_visto\n";
   // Agregar datos al contenido CSV
  chartData.forEach(row => {
    csvContent += `${row.label.replace(/,/g, '')},${row.value}\n`;
  });
  // Crear enlace de descarga
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "videos_mas_vistos.csv");
  document.body.appendChild(link);

  // Simular clic en el enlace para iniciar la descarga
  link.click();
}

    // -------------------------------          Top cursos completados         ----------------------------------------
var chartTopCursosCompletados;
function prepareDataTopCursosCompletados(data) {
  //console.log('data Cursos Completados', data);
  const cursoCounts = {};
  data.forEach(item => {
    cursoCounts[item.cursoId] = (cursoCounts[item.cursoId] || 0) + 1;
  });

  return Object.keys(cursoCounts).map(cursoId => ({
    label: data.find(item => item.cursoId === cursoId).tituloCurso,
    value: cursoCounts[cursoId]
  }));
} 

function crearChartTopCursosCompletados(){

  const chartData = prepareDataTopCursosCompletados(dataTemp).slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);

  console.log('data cursos completados', chartData);
  const donutColors = {
    series1: '#fdd835',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#32baff',
    series5: '#ffa1a1',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(vuetifyTheme.current.value)
  
  const chartOptions = {
    chart: {
      type: 'donut',
      height: 500
    },
    colors: [donutColors.series1, donutColors.series2, donutColors.series3, donutColors.series4],
    legend: {
      width: 250,
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
    },
    series: chartData.map(item => parseInt(item.value)),
    labels: chartData.map(item => item.label),
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
            name: {
              fontSize: '1.5rem',
            },
            value: {
              fontSize: '1.5rem',
              color: themeSecondaryTextColor,
              //formatter: val => `${parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              //label: 'Operational',
              //formatter: () => '31%',
              color: themePrimaryTextColor,
            },
          },
        },
        
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 200,
          },
          legend: {
            show: false,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1rem',
                  },
                },
              },
            },
          },
        },
      },
    ]
  };

  //console.log('chartData', chartData);
  chartTopCursosCompletados = new ApexCharts(document.querySelector('#chartTopCursosVistos'), chartOptions);
  chartTopCursosCompletados.render();       
}

function exportarTopCursosCompletados() {
  const chartData = prepareDataTopVideosCompletados(dataTemp).slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);
  
  let csvContent = "data:text/csv;charset=utf-8,";
  // Encabezado CSV
  csvContent += "Cursos,Veces_finalizado\n";
   // Agregar datos al contenido CSV
  chartData.forEach(row => {
    csvContent += `${row.label.replace(/,/g, '')},${row.value}\n`;
  });
  // Crear enlace de descarga
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "cursos_finalizados.csv");
  document.body.appendChild(link);

  // Simular clic en el enlace para iniciar la descarga
  link.click();
}

</script>

<template>
    <VRow>
    <!-- 👉  Area chart -->
    <VCol cols="12">
      <VCard>
        <VCardText class="">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Métricas de estudiantes</VCardTitle>
          </VCardItem>
          
          <VCardItem >
            <VRow class="d-flex flex-wrap gap-4 mt-2">
              <VCol cols="4">
                <VSelect v-model="selectedOption" @update:modelValue="renderChartEstudiantes" :items="opcionesEstudiantes" label="Filtro" />
              </VCol>

              <VCol cols="4">
                <VBtn color="primary" @click="exportarEstudiantesCSV">Exportar</VBtn>
              </VCol>
            </VRow>
            

          </VCardItem>
          
            <div class="mt-6" id="chartEstudiantes" ></div>

        </VCardText>
      </VCard>     
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardText class="">
          <VCardItem class="pt-0">
            <div style="display: flex; flex-wrap: wrap;">
              <div style="width: max-content;">
                <VCardTitle>Cursos más tomados</VCardTitle>
                
              </div>
              <div style="margin-left: auto; margin-bottom: 0.80rem;">
                  <VBtn color="primary" @click="exportarTopCursosInscritos">
                    Exportar
                  </VBtn>
              </div>
            </div>
          </VCardItem>
                      
            <div class="mt-6" id="chartTopCursosInscritos" ></div>

        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardText class="">
          <VCardItem class="pt-0">
            
            <div style="display: flex; flex-wrap: wrap;">
              <div style="width: max-content;">
                <VCardTitle>Videos más vistos</VCardTitle>
                
              </div>
              <div style="margin-left: auto; margin-bottom: 0.80rem;">
                  <VBtn color="primary" @click="exportarTopVidesoCompletados">
                    Exportar
                  </VBtn>
              </div>
            </div>

          </VCardItem>
                  
            <div class="mt-6" id="chartTopVideosVistos" ></div>

        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardText class="">
          <VCardItem class="pt-0">
            
            <div style="display: flex; flex-wrap: wrap;">
              <div style="width: max-content;">
                <VCardTitle>Cursos completados</VCardTitle>
                
              </div>
              <div style="margin-left: auto; margin-bottom: 0.80rem;">
                  <VBtn color="primary" @click="exportarTopCursosCompletados">
                    Exportar
                  </VBtn>
              </div>
            </div>

          </VCardItem>
                  
            <div class="mt-6" id="chartTopCursosVistos" ></div>

        </VCardText>
      </VCard>
    </VCol>

    </VRow>
    
  </template>