<script setup>
import elearning_grafico_1 from '@/views/apps/elearning/graficos/elearning_grafico_1.vue';
import elearning_grafico_curso_por_dia from '@/views/apps/elearning/graficos/elearning_grafico_curso_por_dia.vue';
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

const headersGlobal = ref({
  _id: "_id",
  wylexId: "wylexId",
  site: "site",
  site_id: "site_id",
  email: "email",
  first_name: "first_name",
  last_name: "last_name",
  avatar: "avatar",
  country: "country",
  city: "city",
  phone_prefix: "phone_prefix",
  phone_number: "phone_number",
  gender: "gender",
  birth_date: "birth_date",
  identification_type: "identification_type",
  identification_number: "identification_number",
  newsletter_opt_in: "newsletter_opt_in",
  provider: "provider",
  platform: "platform",
  created_in_os: "created_in_os",
});

async function getEstudiantesGrafico() {
  const consulta = await fetch("https://servicio-elearning.vercel.app/grafico/students/curso");
  const datos = await consulta.json();
  estudiantesDatos.value = datos.data;
}

async function getVideosCompletadosGrafico() {
  const consulta = await fetch("https://servicio-elearning.vercel.app/grafico/videos_completados");
  const datos = await consulta.json();
  topVideosCompletados.value = datos.data;
}

async function getCursosCompletadosGrafico() {
  const consulta = await fetch("https://servicio-elearning.vercel.app/grafico/cursos_completados");
  const datos = await consulta.json();
  topCursosCompletados.value = datos.data;
}

function renameField(obj, oldName, newName) {
  if (obj.hasOwnProperty(oldName)) {
    obj[newName] = obj[oldName];
    delete obj[oldName];
  }
}

async function getUsersData(ids) {
  try {
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: ids,
          mode: "user"
        })
      };

      const usersConsulta = await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/users/users_details/full/ids', requestOptions);
      const users = await usersConsulta.json();
      //console.log('users ',users);
      const camposDeseados = [
        '_id','wylexId','site','site_id','email','first_name','last_name','avatar','country','city','phone_prefix',
        'phone_number','gender','birth_date','identification_type','identification_number','newsletter_opt_in','provider','platform','created_in_os'  
      ];

      const formattedData = users.data.map(obj => {
        renameField(obj, 'userId', 'wylexId');
        renameField(obj, 'birthDate', 'birth_date');
        renameField(obj, 'telefono', 'phone_number');
        renameField(obj, 'ciudad', 'city');
        // Crear un nuevo objeto solo con los campos deseados y en el orden correcto
        const newObj = {};
        camposDeseados.forEach(field => {
          // Asignar un valor vacío si el campo no está presente
          newObj[field] = obj.hasOwnProperty(field) ? obj[field] : '';
        });
        return newObj;
      });

      return formattedData;
  } catch (error) {
    return console.error('Error al obtener los datos de los usuarios:', error);
  }
      
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

function exportCSVFile(headers, items, fileTitle) {
  if (headers && items[0].wylexId !== "wylexId") {
    items.unshift(headers);
  }

  // Convert Object to JSON
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

onMounted(async () => {
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

function crearChartEstudiantes() {
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
      height: 250,

    },

    legend: {
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
    },

    colors: [scatterColors.series1, scatterColors.series2, scatterColors.series3, scatterColors.series4],

    plotOptions: {
      bar: {
        borderRadius: 1,
        // barHeight: '30%',
        // horizontal: false,
        startingShape: 'rounded',
        columnWidth: '32%',
        borderRadius: 4,
        distributed: true,
        dataLabels: { position: 'center' },
      },
    },

    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        fontSize: '15px',
        colors: [themeSecondaryTextColor],
        fontWeight: '600',
        fontFamily: 'Public Sans',
      },
    },

    series: [{
      name: 'Estudiantes',
      data: chartData.map(item => parseInt(item.value))
    }],

    grid: {
      show: true,
      // borderColor: "#eee",
      // xaxis: {
      //   lines: { show: false },
      // },
      padding: {
        top: 0,
        bottom: 0,
        left: -10,
        right: -10,
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
        offsetX: -15,
        style: { colors: themeDisabledTextColor },
        min: 0,
        max: 60000,
        tickAmount: 6,
        formatter: function (val) {
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
    series: [{
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
        formatter: function (val) {
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
        acc[course.idCurso.titulo] = (acc[course.idCurso.titulo] || 0) + 1;
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

function crearChartTopCursosInscritos() {
  const chartData = prepareDataEstudiantes(estudiantesDatos.value, "curso").slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);

  const donutColors = {
    series1: '#fdd835',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#32baff',
    series5: '#ffa1a1',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value)

  const chartOptions = {
    chart: {
      parentHeightOffset: 0,
      height: 380,
      type: 'donut',
      events: {
        dataPointSelection: function (event, chartContext, config) {
          // console.log(config.w.config)
          // alert('Clic en ' + config.w.config.labels[config.dataPointIndex]);
        }
      }
    },
    colors: [
      "#7365ed",
      "#ff7f50", // Naranja claro
      "#EE2E31", // Amarillo
      "#ff6347", // Rojo coral
      "#00fa9a", // Verde medio
      "#ffa500", // Naranja
      "#1D7874", // 
      "#ff4500", // Rojo oscuro
      "#32cd32", // Verde esmeralda
      "#ff1493", // Rosa brillante
      "#00fa9a", // Verde medio
      "#ff69b4", // Rosa claro
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    stroke: { width: 0 },
      dataLabels: {
        enabled: true,
        textAnchor: 'middle',
        distributed: false,
        offsetX: 0,
        offsetY: 0,
        style: {
            fontSize: '15px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
            colors: undefined
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#fff',
          opacity: 1,
          dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.45
          }
        },
        dropShadow: {
            enabled: false,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.45
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetX: 0,
        // width: 300,
        markers: {
          width: 7,
          height: 7
        },
        show: true,
        // formatter: function (seriesName, opts) {
        //   return [seriesName, " <br> ", `<div style="margin-top:10px;font-size:17px;color:rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity))">${opts.w.globals.series[opts.seriesIndex]}<small style="font-size:14px"></small></div>`]
        // },
        labels: {
          colors: themeDisabledTextColor,
          useSeriesColors: false
        },
      },
      tooltip: {
        // theme: false,
        // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        //   // series[seriesIndex]
        //   return `<div class="tooltip-content">
        //     <div class="tooltip-body">
        //       <div class="tooltip-title">
        //         Permanencia de ${fecha.value.title}<br>
        //         <small>Muestra de ${limit.value} registros</small>
        //       </div>
        //       <div class="tooltip-subtitle">
        //         Sección
        //       </div>
        //       <div class="tooltip-data-flex">
        //         <div class="tooltip-data-title">
        //           ${w.config.labels[seriesIndex]}
        //         </div>
        //         <div class="tooltip-data-value">
        //           ${series[seriesIndex]}%
        //         </div>
        //       </div>
        //       <div class="tooltip-data-flex">
        //         <div class="tooltip-data-title">
        //           Visitas
        //         </div>
        //         <div class="tooltip-data-value">
        //           ${dataRaw[seriesIndex].total}
        //         </div>
        //       </div>
        //       <div class="tooltip-data-flex">
        //         <div class="tooltip-data-title">
        //           Tiempo promedio
        //         </div>
        //         <div class="tooltip-data-value">
        //           ${formatearTiempo(dataRaw[seriesIndex].promedio)} 
        //         </div>
        //       </div>
        //     </div>
        //   </div>`
        // }
      },
      // tooltip: { theme: true },
      grid: {
        padding: {
          top: 15,
          right: -20,
          left: -20,
        },
      },
      states: { hover: { filter: { type: 'none' } } },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            labels: {
              show: false,
              value: {
                fontSize: '1.375rem',
                fontFamily: 'Public Sans',
                color: headingColor,
                fontWeight: 600,
                offsetY: -15,
                formatter(val) {
                  return `${parseInt(val)}%`
                },
              },
              name: {
                offsetY: 20,
                fontFamily: 'Public Sans',
              },
              total: {
                show: false,
                showAlways: false,
                color: currentTheme.success,
                fontSize: '.8125rem',
                label: 'Total',
                fontFamily: 'Public Sans',
                formatter() {
                  return '184'
                },
              },
            },
          },
        },
      },
    series: chartData.map(item => parseInt(item.value)),
    labels: chartData.map(item => item.label),
    
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
const dataExportTopVideosCompletados = ref([]);
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

const noDataVideosCompletados = ref(false);
function crearChartTopVideosCompletados(fechai = null, fechaf = null) {

  var dataFormated;

  if (fechai != null && fechaf != null) {
    console.log(fechaf);
    dataFormated = topVideosCompletados.value.map(obj => ({
      ...obj,
      videosCompletados: obj.videosCompletados.filter(video => {
        console.log('video.created_at ', video.created_at);
        const createdAt = new Date(video.created_at);
        console.log('createdAt ', createdAt);
        return createdAt >= fechai && createdAt <= fechaf;
      })
    })).filter(obj => obj.videosCompletados.length > 0);
  } else {
    dataFormated = topVideosCompletados.value;
  }
  //console.log('noDataVideosCompletados ', noDataVideosCompletados.value);
  //console.log('dataFormated', dataFormated);
  if (dataFormated.length == 0) {
    noDataVideosCompletados.value = true;
    chartTopVideosCompletados = null;
    return;
  }

  dataExportTopVideosCompletados.value = dataFormated;
  const chartData = prepareDataTopVideosCompletados(dataFormated).slice(0, 5);
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
    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        fontSize: '13px',
        colors: [themeSecondaryTextColor],
        fontWeight: '500',
        fontFamily: 'Public Sans',
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

  if (!chartTopVideosCompletados) {
    chartTopVideosCompletados = new ApexCharts(document.querySelector('#chartTopVideosVistos'), chartOptions);
    chartTopVideosCompletados.render();
  } else {
    chartTopVideosCompletados.updateOptions(chartOptions);
  }

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

async function exportarUsuariosTopVideosCompletados() {
  const userIds = dataExportTopVideosCompletados.value.map(item => item.userId);
  //console.log('userIds ',[...new Set(userIds)]);
  var usersData = await getUsersData([...new Set(userIds)]);
  //return console.log('data ',usersData);
  exportCSVFile(headersGlobal.value, usersData, 'usuarios_videos_completados');
  
}

function filtroFechaVideosCompletados(selectedDates, dateStr, instance) {
  if (selectedDates.length > 1) {
    // console.log('selectedDates ',selectedDates[0]);
    var fechai = new Date(selectedDates[0]);
    var fechaf = new Date(selectedDates[1]);
    //console.log('fechaf ',fechaf);
    crearChartTopVideosCompletados(fechai, fechaf);
  }
}

// -------------------------------          Top cursos completados         ----------------------------------------
const dataExportTopCursosCompletados = ref([]);
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

function crearChartTopCursosCompletados(fechai = null, fechaf = null) {

  var dataFormated;

  if (fechai != null && fechaf != null) {
    console.log('fechaf ', fechaf);
    dataFormated = topCursosCompletados.value.filter(item => {
      const createdAt = new Date(moment(item.created_at, "YYYY-MM-DD").startOf('day').toDate());
      console.log('conversion de created_at ', createdAt);
      return createdAt >= fechai && createdAt <= fechaf;
    });
  } else {
    dataFormated = topCursosCompletados.value;
  }

  dataExportTopCursosCompletados.value = dataFormated;

  const chartData = prepareDataTopCursosCompletados(dataFormated).slice(0, 5);
  chartData.sort((a, b) => b.value - a.value);

  //console.log('data cursos completados', chartData);
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
    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        fontSize: '13px',
        colors: [themeSecondaryTextColor],
        fontWeight: '500',
        fontFamily: 'Public Sans',
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
  if (!chartTopCursosCompletados) {
    chartTopCursosCompletados = new ApexCharts(document.querySelector('#chartTopCursosVistos'), chartOptions);
    chartTopCursosCompletados.render();
  } else {
    chartTopCursosCompletados.updateOptions(chartOptions);
  }

}

function exportarTopCursosCompletados() {
  const chartData = prepareDataTopVideosCompletados(dataExportTopCursosCompletados.value).slice(0, 5);
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

async function exportarUsuariosTopCursosCompletados() {
  const userIds = dataExportTopCursosCompletados.value.map(item => item.userId);
  var usersData = await getUsersData(userIds);
  exportCSVFile(headersGlobal.value, usersData, 'usuarios_cursos_completados');
  //return console.log('data ',usersData);
}

function filtroFechaCursosCompletados(selectedDates, dateStr, instance) {
  if (selectedDates.length > 1) {
    // console.log('selectedDates ',selectedDates[0]);
    var fechai = new Date(selectedDates[0]);
    var fechaf = new Date(selectedDates[1]);
    //console.log('fechaf ',fechaf);
    crearChartTopCursosCompletados(fechai, fechaf);
  }
}

</script>

<template>
  <VRow>
    <!-- 👉  Area chart -->
    <VCol cols="12" md="8">
      <elearning_grafico_1 />
      <!-- <VCard title="Métricas de estudiantes" subtitle="Medición del rendimiento estudiantil mediante análisis y datos">
        <template #append>
          <div class="mt-n4 me-n2">
            <VBtn icon size="x-small" variant="plain" color="default">
              <VIcon size="22" color="success" icon="tabler-download" @click="exportarEstudiantesCSV" />
            </VBtn>
          </div>
        </template>
        <VCardText class="">
          <VCardItem class="py-0 px-0 ">
            <VRow class="d-flex flex-wrap gap-4 mt-2">
              <VCol cols="12" md="4">
                <VSelect v-model="selectedOption" @update:modelValue="renderChartEstudiantes"
                  :items="opcionesEstudiantes" label="Filtro" />
              </VCol>

              <VCol cols="6" md="4">
                <VBtn color="primary" @click="exportarEstudiantesCSV">Exportar</VBtn>
              </VCol>
            </VRow>


          </VCardItem>

          <div class="mt-6" id="chartEstudiantes"></div>

        </VCardText>
      </VCard> -->
    </VCol>

    <VCol cols="12" md="4">
      <VCard title="Cursos más tomados" subtitle="Cursos demandados: aprendizaje popular en acción">
        <template #append>
          <div class="mt-n4 me-n2">
            <VBtn icon size="x-small" variant="plain" color="default">
              <VIcon size="22" color="success" icon="tabler-download" @click="exportarTopCursosInscritos" />
            </VBtn>
          </div>
        </template>
        <VCardText class="">
          <!-- <VCardItem class="pt-0">
            <div style="display: flex; flex-wrap: wrap;">
              <div style="width: max-content;">

              </div>
              <div style="margin-left: auto; margin-bottom: 0.80rem;">
                <VBtn color="primary" @click="exportarTopCursosInscritos">
                  Exportar
                </VBtn>
              </div>
            </div>
          </VCardItem> -->

          <div class="mt-6" id="chartTopCursosInscritos"></div>

        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard title="Videos más vistos" subtitle="Top vídeos en popularidad">
        <template #append>
          <div class="mt-n4 me-n2">
            <VBtn icon size="x-small" variant="plain" color="default">
              <VIcon size="22" color="success" icon="tabler-download" @click="exportarTopVidesoCompletados" />
            </VBtn>
            <VBtn icon size="x-small" variant="plain" color="default">
              <VIcon size="22" color="success" icon="tabler-users" @click="exportarUsuariosTopVideosCompletados" />
            </VBtn>
          </div>
        </template>
        <VCardText class="">
          <!-- <VCardItem class="pt-0">

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

          </VCardItem> -->

          <VCardItem class="py-0 px-0">
            <VRow class="d-flex flex-wrap gap-4 mt-0">
              <VCol class="pt-0" cols="12" md="6">
                <div class="date-picker-wrapper" style="width: 100%;">
                  <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" show-current=true
                    @on-change="filtroFechaVideosCompletados" :config="{
                      position: 'auto right',
                      mode: 'range',
                      altFormat: 'F j, Y',
                      dateFormat: 'd-m-Y',
                      reactive: true
                    }" />
                </div>
              </VCol>
            </VRow>
          </VCardItem>

          <div v-if="!noDataVideosCompletados" class="mt-6" id="chartTopVideosVistos"></div>

          <div class="text-center mt-6" v-else>No hay datos para mostrar</div>

        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard title="Cursos completados" subtitle="Éxito educativo: Cursos completados.">
        <template #append>
          <div class="mt-n4 me-n2">
            <VBtn icon size="x-small" variant="plain" color="default">
              <VIcon size="22" color="success" icon="tabler-download" @click="exportarTopCursosCompletados" />
            </VBtn>
            <VBtn icon size="x-small" variant="plain" color="default">
              <VIcon size="22" color="success" icon="tabler-users" @click="exportarUsuariosTopCursosCompletados" />
            </VBtn>
          </div>
        </template>
        <VCardText class="">
          <!-- <VCardItem class="pt-0 pb-0">

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

          </VCardItem> -->

          <VCardItem class="py-0 px-0">
            <VRow class="d-flex flex-wrap gap-4 mt-0">
              <VCol class="pt-0" cols="12" md="6">
                <div class="date-picker-wrapper" style="width: 100%;">
                  <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" show-current=true
                    @on-change="filtroFechaCursosCompletados" :config="{
                      position: 'auto right',
                      mode: 'range',
                      altFormat: 'F j, Y',
                      dateFormat: 'd-m-Y',
                      reactive: true
                    }" />
                </div>
              </VCol>
            </VRow>
          </VCardItem>

          <div class="mt-6" id="chartTopCursosVistos"></div>

        </VCardText>
      </VCard>
    </VCol>

    <!-- <VCol cols="12" md="12">
      <elearning_grafico_curso_por_dia />
    </VCol> -->

  </VRow>

</template>