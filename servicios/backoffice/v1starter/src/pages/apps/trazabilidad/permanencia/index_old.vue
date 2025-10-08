<script setup>
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";

import Moment from 'moment-timezone';

import { hexToRgb } from '@layouts/utils';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
const moment = extendMoment(Moment);
// Establecer la zona horaria por defecto
moment.tz.setDefault('America/Guayaquil');
moment.locale('es', [esLocale]);

// Función para convertir el timestamp a la zona horaria deseada
const convertirTimestamp = (timestamp) => {
    return moment.tz(timestamp, 'America/Guayaquil');
};

const currentTab = ref('tab-lista');
const dataRegistros = ref([]);
const dataRegistrosChartViews = ref([]);
const dataRegistrosBackup = ref([]);
const disabledViewList = ref(false);

const currentPage = ref(1); // Página actual
const perPage = ref(15); // Registros por página

const loadingData = ref(false);
const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY
const fecha = ref({
  i: valoresHoy.i,
  f: valoresHoy.f,
  title: "hoy"
});

const fechaGraficos_2 = ref({
  i: valoresHoy.i,
  f: valoresHoy.f,
  title: "hoy"
});

const selectedfechaIniFin = ref('Hoy');
const selectComboTotales = ref('Ayer');

const fechaIniFinList = useSelectCalendar();
const limit = ref(valoresHoy.limit);
const currentTabSectionSubSection = ref(0)

const selectOrder = ref('');
const selectGroup = ref('');
const selectSeccion = ref('');
const itemsSeccion = ref([]);
const groupSectionChartPieData = ref([]);
const groupSubSectionChartPieData = ref([]);

const optionOrderNormal = [
  { title: 'Ordenar ASC por nombre de usuario', value: 1 },
  { title: 'Ordenar DESC por nombre de usuario', value: 2 },
  { title: 'Ordenar ASC por fecha de registro', value: 3 },
  { title: 'Ordenar DESC por fecha de registro', value: 4 },
  { title: 'Ordenar ASC por tiempo de permanencia', value: 5 },
  { title: 'Ordenar DESC por tiempo de permanencia', value: 6 },
];
const optionOrderGroup = [
  { title: 'Ordenar ASC por nombre de página', value: 7 },
  { title: 'Ordenar DESC por nombre de página', value: 8 },
  { title: 'Ordenar ASC por tiempo promedio', value: 9 },
  { title: 'Ordenar DESC por tiempo promedio', value: 10 },
  { title: 'Ordenar ASC por visitas', value: 11 },
  { title: 'Ordenar DESC por visitas', value: 12 },
];

const selectedOptionperPage = ref(
  { title: perPage.value, value: perPage.value }
)

const itemsPage = [{ title: '10', value: 10 },
{ title: '30', value: 30 },
{ title: '50', value: 50 },
{ title: '100', value: 100 },
{ title: '200', value: 200 }]

const itemsOrder = ref(optionOrderNormal);
const itemsGroup = ref([
  { title: 'Agrupar por página', value: 1 }
]);


onMounted(getCampaigns)

onMounted(async () =>{
  let selectedCombo = useSelectValueCalendar("Ayer");
  fechaGraficos_2.value = {
    i: selectedCombo.i,
    f: selectedCombo.f,
    title: selectComboTotales.value
  }

  loadingData.value = true;

  await getChartLineTimeViews({
    fechai: fechaGraficos_2.value.i.format("YYYY-MM-DD"),
    fechaf: fechaGraficos_2.value.f.format("YYYY-MM-DD")
  });

  loadingData.value = false;
  
  currentTabSectionSubSection.value = "1";
})

function formatSecciones(data) {
  // Utilizar un conjunto (Set) para almacenar secciones únicas
  const seccionesUnicas = new Set();

  // Filtrar secciones únicas y crear un nuevo arreglo
  return data.data
    .map(item => item.section)
    .filter(seccion => {
      if (!seccionesUnicas.has(seccion)) {
        seccionesUnicas.add(seccion);
        return true;
      }
      return false;
    })
    .map(seccion => {
      if (seccion.includes("-1")) {
        return { title: "Otros", value: seccion }
      }
      return { title: seccion, value: seccion }
    });
}

function formatGroupSeccionesChart(data) {
  const resultadoAgrupado = data.data.reduce((acumulador, actual) => {
    const sectionActual = actual.section;
    const indexEnAcumulador = acumulador.findIndex(item => item.section === sectionActual);

    if (indexEnAcumulador === -1) {
      acumulador.push({
        section: sectionActual,
        total: 1,
        sumSeconds: actual.seconds,
        porcentaje: 0, // Inicializamos el porcentaje en 0
        promedio: 0, // Inicializamos el promedio en 0
      });
    } else {
      acumulador[indexEnAcumulador].total += 1;
      acumulador[indexEnAcumulador].sumSeconds += actual.seconds;
    }

    return acumulador;
  }, []);
  // Calculamos el porcentaje para cada elemento
  const totalRegistros = data.data.length;

  resultadoAgrupado.forEach(elemento => {
    elemento.porcentaje = parseFloat((elemento.total / totalRegistros) * 100).toFixed(2);
    elemento.promedio = elemento.sumSeconds / elemento.total;
  });
  return resultadoAgrupado;
}

function formatGroupSubSeccionesChart(data) {
  const resultadoAgrupadoSubSection = data.data.reduce((acumulador, actual) => {
    const subSectionActual = actual.subsection;
    const indexEnAcumulador = acumulador.findIndex(item => item.subsection === subSectionActual);

    if (indexEnAcumulador === -1) {
      acumulador.push({
        subsection: subSectionActual,
        total: 1,
        sumSeconds: actual.seconds,
        porcentaje: 0, // Inicializamos el porcentaje en 0
        promedio: 0, // Inicializamos el promedio en 0
      });
    } else {
      acumulador[indexEnAcumulador].total += 1;
      acumulador[indexEnAcumulador].sumSeconds += actual.seconds;
    }

    return acumulador;
  }, []).reduce((acumulador, reg) => {
    if (reg.subsection) {
      const regTem = {
        porcentaje: reg.porcentaje,
        promedio: reg.promedio,
        subsection: reg.subsection,
        sumSeconds: reg.sumSeconds,
        total: reg.total
      };

      acumulador.push(regTem);
    }
    return acumulador;
  }, []);
  // Calculamos el porcentaje para cada elemento
  const totalRegistrosSubSeccion = resultadoAgrupadoSubSection.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
  resultadoAgrupadoSubSection.forEach(elemento => {
    elemento.porcentaje = parseFloat((elemento.total / totalRegistrosSubSeccion) * 100).toFixed(2);
    elemento.promedio = elemento.sumSeconds / elemento.total;
  });
  return resultadoAgrupadoSubSection;
}

// para definir una fecha especifica se la coloca dentro de moment así -- moment('2024-01-04').format('YYYY-MM-DD')
async function getCampaigns(options = {}) {
  try {
    const { tipo = "fecha", section = "", fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')), limit = 2000 } = options;
    var response = await fetch(`https://servicio-permanencia.vercel.app/get/section/${fechai}/${fechaf}?section=${section}&limit=${limit}`);
    const data = await response.json();

    data.data.forEach(elemento => {
      elemento["date"] = moment(elemento.timestamp, "dd/mm/YYYY, HH:mm:ss").format("YYYY-MM-DD");
    });

    dataRegistros.value = data.data;
    dataRegistrosBackup.value = data.data;

    // Filtrar secciones únicas y crear un nuevo arreglo
    const secciones = formatSecciones(data);

    groupSubSectionChartPieData.value = formatGroupSubSeccionesChart(data);

    groupSectionChartPieData.value = formatGroupSeccionesChart(data);


    if (tipo == "fecha") {
      itemsSeccion.value = secciones;
      selectSeccion.value = "";
      selectOrder.value = "";
    }
  } catch (error) {
    return console.error(error.message);
  }
}
// Paginación de registros
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = currentPage.value * perPage.value;
  return dataRegistros.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(dataRegistros.value.length / perPage.value));

function changePage(pageNumber) {
  currentPage.value = pageNumber;
}

function calcularDiferencia(diferencia) {
  // const inicio = horaInicio.split(':');
  // const fin = horaFin.split(':');
  // // Convertir horas y minutos a segundos
  // const segundosInicio = parseInt(inicio[0]) * 3600 + parseInt(inicio[1]) * 60 + parseInt(inicio[2]);
  // const segundosFin = parseInt(fin[0]) * 3600 + parseInt(fin[1]) * 60 + parseInt(fin[2]);
  // // Calcular la diferencia en segundos
  // let diferencia = segundosFin - segundosInicio;
  // Si la diferencia es negativa, sumamos 24 horas (en segundos)
  if (diferencia < 0) { diferencia += 24 * 3600; }
  // Convertir la diferencia en segundos a horas, minutos y segundos
  const horas = Math.floor(diferencia / 3600);
  const minutos = Math.floor((diferencia % 3600) / 60);
  const segundos = diferencia % 60;
  return `${horas} horas, ${minutos} minutos y ${segundos} segundos`;
}

const obtenerFechaDispositivos = async function (selectedDates, dateStr, instance) {
  //var respJson = await nuevoArchivoJson(archivoJson);
  if (selectedDates.length > 1) {
    console.log(selectedDates)
  }
}

/*COMBO EVENTO*/
watch(async () => selectedfechaIniFin.value, async () => {
  let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
  fecha.value = {
    i: selectedCombo.i,
    f: selectedCombo.f,
    title: selectedfechaIniFin.value
  }

  limit.value = selectedCombo.limit;

  loadingData.value = true;
  await getCampaigns({
    limit: 10,
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    tipo: "fecha",
    limit: limit.value
  });

  loadingData.value = false;
  selectGroup.value = null

  // itemsSeccion.value = [{title:"sds",value:"wddw"}]
});

/*COMBO SECCION*/
watch(async () => selectSeccion.value, async () => {
  const section = selectSeccion.value;
  // Utilizar un conjunto (Set) para almacenar valores únicos
  const valoresUnicos = new Set(section.map(item => item.value));

  // Convertir el conjunto a un array y unir los valores con coma
  const stringFinal = [...valoresUnicos].join(', ');
  loadingData.value = true;
  await getCampaigns({
    limit: 10,
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    section: stringFinal,
    limit: limit.value,
    tipo: "section"
  });
  loadingData.value = false;
  selectGroup.value = null;
});

watch(async () => selectComboTotales.value, async () => {
  let selectedCombo = useSelectValueCalendar(selectComboTotales.value);
  fechaGraficos_2.value = {
    i: selectedCombo.i,
    f: selectedCombo.f,
    title: selectComboTotales.value
  }

  limit.value = selectedCombo.limit;

  loadingData.value = true;

  await getChartLineTimeViews({
    fechai: fechaGraficos_2.value.i.format("YYYY-MM-DD"),
    fechaf: fechaGraficos_2.value.f.format("YYYY-MM-DD"),
  });

  loadingData.value = false;
  selectGroup.value = null

  // itemsSeccion.value = [{title:"sds",value:"wddw"}]
});

function comparador(opcion) {
  switch (opcion) {
    case 1:
      return (a, b) => a.user.first_name > b.user.first_name ? 1 : -1;
    case 2:
      return (a, b) => b.user.first_name > a.user.first_name ? 1 : -1;
    case 3:
      return (a, b) => new Date(a.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, "$2/$1/$3 $4")) - new Date(b.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, "$2/$1/$3 $4"));
    case 4:
      return (a, b) => new Date(b.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, "$2/$1/$3 $4")) - new Date(a.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, "$2/$1/$3 $4"));
    case 5:
      return (a, b) => a.seconds - b.seconds;
    case 6:
      return (a, b) => b.seconds - a.seconds;
    //Item Group
    case 7:
      return (a, b) => a.title > b.title ? 1 : -1;
    case 8:
      return (a, b) => b.title > a.title ? 1 : -1;
    case 9:
      return (a, b) => a.promedio - b.promedio;
    case 10:
      return (a, b) => b.promedio - a.promedio;
    case 11:
      return (a, b) => a.total - b.total;
    case 12:
      return (a, b) => b.total - a.total;
    default:
      return null;
  }
}

/*COMBO ORDENAR*/
watch(async () => selectOrder.value, async () => {
  const datos = dataRegistros.value;
  if (selectOrder.value) {
    const seleccion = selectOrder.value.value;
    const opcionSeleccionada = seleccion; // Puedes cambiar esto según la opción seleccionada


    const datosOrdenados = [...datos].sort(comparador(opcionSeleccionada));
    dataRegistros.value = datosOrdenados;
  } else {
    selectGroup.value = null;
    const datosOrdenados = [...datos].sort(comparador(4));
    dataRegistros.value = datosOrdenados;
  }

});

const countAndFilterData = (data) => {
  const counts = {};
  return data.filter(item => {
    const date = item.date;
    if (!counts[date]) {
      counts[date] = 1;
      return true;
    }
    counts[date]++;
    return false;
  }).map(item => ({ date: item.date, total: counts[item.date] }));
};

/*COMBO AGRUPAR*/
function agrupador(opcion) {
  const datos = Array.from(dataRegistros.value);
  switch (opcion) {
    //AGRUPAR POR TITULO DE PAGINA
    case 1:
      const resultadoAgrupadoPorTitle = datos.reduce((acumulador, actual) => {
        const indexEnAcumulador = acumulador.findIndex(item => item.title === actual.title);

        // if(actual.title.includes("Los guías penitenciarios")){
        //   console.log(actual.seconds, actual)
        // }
        if (indexEnAcumulador === -1) {
          acumulador.push({
            title: actual.title,
            promedio: actual.seconds,
            section: actual.section,
            total: 1,
            url: actual.url,
            sumSeconds: actual.seconds,
            data: [actual],
          });
          // console.log(actual.title)
        } else {
          acumulador[indexEnAcumulador].promedio =
            (acumulador[indexEnAcumulador].promedio * acumulador[indexEnAcumulador].data.length + actual.seconds) /
            (acumulador[indexEnAcumulador].data.length + 1);
          acumulador[indexEnAcumulador].sumSeconds += actual.seconds;
          acumulador[indexEnAcumulador].data.push(actual);
          acumulador[indexEnAcumulador].total += 1;
          // console.log(sumatotal2++)
        }

        return acumulador;
      }, []);
      return resultadoAgrupadoPorTitle;
    //AGRUPAR POR CATEGORÍA
    case 2:
      const resultadoAgrupadoPorSection = datos.reduce((acumulador, actual) => {
        const indexEnAcumulador = acumulador.findIndex(item => item.section === actual.section);

        // if(actual.title.includes("Los guías penitenciarios")){
        //   console.log(actual.seconds, actual)
        // }
        if (indexEnAcumulador === -1) {
          acumulador.push({
            title: actual.title,
            date: actual.date,
            promedio: actual.seconds,
            section: actual.section,
            total: 1,
            url: actual.url,
            sumSeconds: actual.seconds,
            data: [actual],
          });
          // console.log(actual.title)
        } else {
          acumulador[indexEnAcumulador].promedio =
            (acumulador[indexEnAcumulador].promedio * acumulador[indexEnAcumulador].data.length + actual.seconds) /
            (acumulador[indexEnAcumulador].data.length + 1);
          acumulador[indexEnAcumulador].sumSeconds += actual.seconds;
          acumulador[indexEnAcumulador].data.push(actual);
          acumulador[indexEnAcumulador].total += 1;
          // console.log(sumatotal2++)
        }

        return acumulador;
      }, []);
      // Ordenar el array de datos por fecha
      resultadoAgrupadoPorSection.forEach(item => {
        if (item.data) {
          item.data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          });
          item.data = countAndFilterData(item.data);
        }
      });
      return resultadoAgrupadoPorSection;
    default:
      return null;
  }
}

watch(async () => selectGroup.value, async () => {
  const datos = selectGroup.value;
  if (selectGroup.value) {
    const seleccion = selectGroup.value.value;
    const opcionSeleccionada = seleccion; // Puedes cambiar esto según la opción seleccionada
    const datosOrdenados = agrupador(opcionSeleccionada);
    dataRegistros.value = datosOrdenados;
    itemsOrder.value = optionOrderGroup;
    // console.log(datosOrdenados)
  } else {
    dataRegistros.value = dataRegistrosBackup.value;
    itemsOrder.value = optionOrderNormal;
  }

});

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

/*GRÁFICO DE PIE*/

function formatearTiempo(valorSegundos) {
  if (typeof valorSegundos !== 'number' || isNaN(valorSegundos)) {
    return 'El valor no es un número válido.';
  }

  if (valorSegundos < 0) {
    console.log(valorSegundos)
    return 'El valor no es un número válido.';
  }

  let resultado;
  let tipo;

  if (valorSegundos < 60) {
    resultado = valorSegundos;
    tipo = 'segundos';
  } else if (valorSegundos < 3600) {
    resultado = valorSegundos / 60;
    tipo = 'minutos';
  } else {
    resultado = valorSegundos / 3600;
    tipo = 'horas';
  }

  return `${parseInt(resultado)} ${tipo}`;
}

const resolveDevice = computed(() => {

  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
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

  let dataRaw = Array.from(groupSectionChartPieData.value);
  const seriesFormat = {
    name: 'Device',
    data: []
  };

  const categoriesRaw = [];
  for (let i in dataRaw) {
    let num = parseFloat(dataRaw[i].porcentaje);
    seriesFormat.data.push(num);
    categoriesRaw.push(dataRaw[i].section);
  }

  // const options = {
  //   chart: {
  //     parentHeightOffset: 0,
  //     type: 'donut',
  //   },
  //   dataLabels: {
  //     enabled: true,
  //     style: {
  //       fontSize: '16px',
  //       fontFamily: 'Helvetica, Arial, sans-serif',
  //       fontWeight: 'bold',
  //       colors: ['#fff']
  //     },
  //   },
  //   legend: {
  //     position: 'bottom',
  //     horizontalAlign: 'left',
  //     offsetX: 40,
  //     show: true,
  //     labels: {
  //       colors: themeDisabledTextColor,
  //       useSeriesColors: false
  //     },
  //   },
  //   // plotOptions: {},
  //   // title: {
  //   //   text: 'Visitas por Dispositivos',
  //   //   align: 'center',
  //   //   style: {
  //   //     fontSize: '16px',
  //   //     fontWeight: 'bold',
  //   //     fontFamily: 'Helvetica, Arial, sans-serif',
  //   //     color: themeDisabledTextColor
  //   //   },
  //   // },
  //   yaxis: {
  //     labels: {
  //       style: { colors: themeDisabledTextColor },
  //     },
  //   },
  //   colors: ['#33b2df', '#546E7A'],
  //   labels: categoriesRaw,
  // }

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'donut',
      events: {
        dataPointSelection: function (event, chartContext, config) {
          // console.log(config.w.config)
          // alert('Clic en ' + config.w.config.labels[config.dataPointIndex]);
        }
      }
    },
    labels: categoriesRaw,
    colors: [
      "#7365ed",
      "#9d92f2",
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
      formatter: function (value, { seriesIndex, dataPointIndex, w }) {
        // Obtén el valor de la barra actual
        const barValue = w.config.series[seriesIndex];

        // Define el umbral para mostrar el dataLabel (ajusta según tus necesidades)
        const umbral = 5; // Por ejemplo, mostrar solo si el valor es mayor al 5%

        // Mostrar el valor solo si supera el umbral
        return barValue > umbral ? `${barValue}%` : '';
      },
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '11px',
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
      formatter: function (seriesName, opts) {
        return [seriesName, " <br> ", `<div style="margin-top:10px;font-size:17px;color:rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity))">${opts.w.globals.series[opts.seriesIndex]}%<small style="font-size:14px"></small></div>`]
      },
      labels: {
        colors: themeDisabledTextColor,
        useSeriesColors: false
      },
    },
    tooltip: {
      theme: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // series[seriesIndex]
        return `<div class="tooltip-content">
          <div class="tooltip-body">
            <div class="tooltip-title">
              Permanencia de ${fecha.value.title}<br>
              <small>Muestra de ${limit.value} registros</small>
            </div>
            <div class="tooltip-subtitle">
              Sección
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                ${w.config.labels[seriesIndex]}
              </div>
              <div class="tooltip-data-value">
                ${series[seriesIndex]}%
              </div>
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                Visitas
              </div>
              <div class="tooltip-data-value">
                ${dataRaw[seriesIndex].total}
              </div>
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                Tiempo promedio
              </div>
              <div class="tooltip-data-value">
                ${formatearTiempo(dataRaw[seriesIndex].promedio)} 
              </div>
            </div>
          </div>
        </div>`
      }
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
  }
  return { series: seriesFormat.data, options: options };
});

const resolveDeviceGroupSubSection = computed(() => {

  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
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

  let dataRaw = Array.from(groupSubSectionChartPieData.value);
  const seriesFormat = {
    name: 'Device',
    data: []
  };

  const categoriesRaw = [];
  for (let i in dataRaw) {
    let num = parseFloat(dataRaw[i].porcentaje);
    seriesFormat.data.push(num);
    categoriesRaw.push(dataRaw[i].subsection);
  }

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'donut',
    },
    labels: categoriesRaw,
    colors: [
      "#173F5F",
      "#00fa9a", // Verde medio
      "#7365ed",
      "#ff69b4", // Rosa claro
      "#000f08",
      "#32cd32", // Verde esmeralda
      "#136f63", // Naranja claro
      "#ffd700", // Amarillo
      "#ff4500", // Rojo oscuro
      "#ff0000", // Rojo
      "#ff8c00", // Naranja oscuro
      "#ffff00", // Amarillo
      "#8b4513", // Marrón
      "#0000ff", // Azul
      "#8a2be2", // Azul violeta
      "#ffa500", // Naranja
      "#ffd800", // Amarillo intenso
      "#ff1493", // Rosa brillante
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    stroke: { width: 0 },
    dataLabels: {
      enabled: true,
      formatter: function (value, { seriesIndex, dataPointIndex, w }) {
        // Obtén el valor de la barra actual
        const barValue = w.config.series[seriesIndex];

        // Define el umbral para mostrar el dataLabel (ajusta según tus necesidades)
        const umbral = 5; // Por ejemplo, mostrar solo si el valor es mayor al 5%

        // Mostrar el valor solo si supera el umbral
        return barValue > umbral ? `${barValue}%` : '';
      },
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '11px',
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
      formatter: function (seriesName, opts) {
        return [seriesName, " <br> ", `<div style="margin-top:10px;font-size:17px;color:rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity))">${opts.w.globals.series[opts.seriesIndex]}%<small style="font-size:14px"></small></div>`]
      },
      labels: {
        colors: headingColor,
        useSeriesColors: false
      },
    },
    tooltip: {
      theme: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // series[seriesIndex]
        return `<div class="tooltip-content">
          <div class="tooltip-body">
            <div class="tooltip-title">
              Permanencia de ${fecha.value.title}<br>
              <small>Muestra de ${limit.value} registros</small>
            </div>
            <div class="tooltip-subtitle">
              Sección
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                ${w.config.labels[seriesIndex]}
              </div>
              <div class="tooltip-data-value">
                ${series[seriesIndex]}%
              </div>
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                Visitas
              </div>
              <div class="tooltip-data-value">
                ${dataRaw[seriesIndex].total}
              </div>
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                Tiempo promedio
              </div>
              <div class="tooltip-data-value">
                ${formatearTiempo(dataRaw[seriesIndex].promedio)} 
              </div>
            </div>
          </div>
        </div>`
      }
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
  }
  return { series: seriesFormat.data, options: options };
});

/*COMBO SELECT PERPAGE*/
watch(async () => selectedOptionperPage.value, async () => {
  const datos = selectedOptionperPage.value;
  if (selectedOptionperPage.value) {
    const seleccion = selectedOptionperPage.value.value;
    perPage.value = seleccion;
  }
});

watch(async () => currentTabSectionSubSection.value, async () => {
  console.log(currentTabSectionSubSection.value)
});

async function getChartLineTimeViews(options = {}) {
  try {
    const { fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')) } = options;
    var response = await fetch(`https://servicio-permanencia.vercel.app/chart/agrupacion/dias?fechai=${fechai}&?fechaf=${fechaf}`);
    const data = await response.json();

    if(data.resp){
      dataRegistrosChartViews.value = data.data;
    }
  } catch (error) {
    return console.error(error.message);
  }
}

// Función para obtener la fecha de mañana en formato YYYY-MM-DD
function obtenerFechaManana() {
    return moment().add(1, 'day').format('YYYY-MM-DD');
}

const resolveDeviceTimeLine = computed(() => {

  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
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

  let dataRaw = Array.from(dataRegistrosChartViews.value);

  const transformedData = {};
  dataRaw.forEach(item => {
      item.data.forEach(subitem => {
          if (!transformedData[subitem.section]) {
              transformedData[subitem.section] = {
                  name: subitem.section,
                  data: []
              };
          }
          transformedData[subitem.section].data.push([
              moment(item.fecha).add(1, 'days').valueOf(),
              subitem.totalVistas
          ]);
      });
  });

  const result = Object.values(transformedData);

  if(selectComboTotales.value == "Hoy"){
    // Iterar sobre cada sección en el arreglo result
    result.forEach(seccion => {
        // Obtener la fecha de mañana en formato YYYY-MM-DD
        const fechaManana = obtenerFechaManana();

        // Agregar un nuevo elemento al arreglo data con la fecha de mañana y un valor de 0
        seccion.data.push([moment(fechaManana).valueOf(), 0]);
    });
  }

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    // labels: categoriesRaw,
    dataLabels: {
      enabled: true
    },
    colors: [
      "#173F5F",
      "#00fa9a", // Verde medio
      "#7365ed",
      "#ff69b4", // Rosa claro
      "#000f08",
      "#32cd32", // Verde esmeralda
      "#136f63", // Naranja claro
      "#ffd700", // Amarillo
      "#ff4500", // Rojo oscuro
      "#ff0000", // Rojo
      "#ff8c00", // Naranja oscuro
      "#ffff00", // Amarillo
      "#8b4513", // Marrón
      "#0000ff", // Azul
      "#8a2be2", // Azul violeta
      "#ffa500", // Naranja
      "#ffd800", // Amarillo intenso
      "#ff1493", // Rosa brillante
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      },
    },
    yaxis: {
      title: {
        text: 'Visitas',
        style: {
          color: headingColor,
          useSeriesColors: false
        }
      },
      labels: {
        style: {
          // colors: headingColor,
          colors: headingColor,
          useSeriesColors: false
        },
        offsetX: 0,
        formatter: function (val) {
          return (val).toFixed(0);
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false
      }
    },
    xaxis: {
      type: 'datetime',
      tickAmount: result[0].data.length - 1,
      // min: new Date("01/01/2014").getTime(),
      // max: new Date("01/07/2014").getTime(),
      labels: {
        style: {
          // colors: headingColor,
          colors: headingColor,
          useSeriesColors: false
        },
        rotate: -15,
        rotateAlways: true,
        formatter: function (val, timestamp) {
          const fechaTimeZone = convertirTimestamp(timestamp).format("DD MMM YYYY");
          // console.log(fechaTimeZone, timestamp)
          return fechaTimeZone;
        }
      }
    },
    tooltip: {
      shared: true
    },
    legend: {
      labels: {
        colors: headingColor,
        useSeriesColors: false
      },
      position: 'top',
      horizontalAlign: 'right',
      offsetX: -10
    }
  }

  return {
    series: result, options: options
  };
});

const resolveDeviceTimeLinePromedioSection = computed(() => {

  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
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

  let dataRaw = Array.from(dataRegistrosChartViews.value);

  const transformedData = {};
  dataRaw.forEach(item => {
      item.data.forEach(subitem => {
          if (!transformedData[subitem.section]) {
              transformedData[subitem.section] = {
                  name: subitem.section,
                  data: []
              };
          }
          transformedData[subitem.section].data.push([
              moment(item.fecha).add(1, 'days').valueOf(),
              parseFloat((subitem.promedioSegundos / 60).toFixed(2))
          ]);
      });
  });

  const result = Object.values(transformedData);

  if(selectComboTotales.value == "Hoy"){
    // Iterar sobre cada sección en el arreglo result
    result.forEach(seccion => {
        // Obtener la fecha de mañana en formato YYYY-MM-DD
        const fechaManana = obtenerFechaManana();

        // Agregar un nuevo elemento al arreglo data con la fecha de mañana y un valor de 0
        seccion.data.push([moment(fechaManana).valueOf(), 0]);
    });
  }

  // console.log(result)

  // console.log(agrupador(2))
  // const seriesFormat = {
  //   name: 'Device',
  //   data: []
  // };

  // const categoriesRaw = [];
  // for (let i in dataRaw) {
  //   let num = parseFloat(dataRaw[i].porcentaje);
  //   seriesFormat.data.push(num);
  //   categoriesRaw.push(dataRaw[i].subsection);
  // }

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    // labels: categoriesRaw,
    dataLabels: {
      enabled: true,
      formatter: function (value, { seriesIndex, dataPointIndex, w }) {
        // // Obtén el valor de la barra actual
        // const barValue = w.config.series[seriesIndex];
        return `${value} min`;

        // // Define el umbral para mostrar el dataLabel (ajusta según tus necesidades)
        // const umbral = 5; // Por ejemplo, mostrar solo si el valor es mayor al 5%

        // // Mostrar el valor solo si supera el umbral
        // return barValue > umbral ? `${barValue}%` : '';
      }
    },
    colors: [
      "#173F5F",
      "#00fa9a", // Verde medio
      "#7365ed",
      "#ff69b4", // Rosa claro
      "#000f08",
      "#32cd32", // Verde esmeralda
      "#136f63", // Naranja claro
      "#ffd700", // Amarillo
      "#ff4500", // Rojo oscuro
      "#ff0000", // Rojo
      "#ff8c00", // Naranja oscuro
      "#ffff00", // Amarillo
      "#8b4513", // Marrón
      "#0000ff", // Azul
      "#8a2be2", // Azul violeta
      "#ffa500", // Naranja
      "#ffd800", // Amarillo intenso
      "#ff1493", // Rosa brillante
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      },
    },
    yaxis: {
      title: {
        text: 'Tiempo promedio en minutos',
        style: {
          color: headingColor,
          useSeriesColors: false
        }
      },
      labels: {
        style: {
          // colors: headingColor,
          colors: headingColor,
          useSeriesColors: false
        },
        offsetX: 0,
        formatter: function (val) {
          return `${(val).toFixed(2)} min`;
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false
      }
    },
    xaxis: {
      type: 'datetime',
      tickAmount: result[0].data.length - 1,
      // min: new Date("01/01/2014").getTime(),
      // max: new Date("01/07/2014").getTime(),
      labels: {
        style: {
          // colors: headingColor,
          colors: headingColor,
          useSeriesColors: false
        },
        rotate: -15,
        rotateAlways: true,
        formatter: function (val, timestamp) {
          const fechaTimeZone = convertirTimestamp(timestamp).format("DD MMM YYYY");
          // console.log(fechaTimeZone, timestamp)
          return fechaTimeZone;
        }
      }
    },
    tooltip: {
      shared: true
    },
    legend: {
      labels: {
        colors: headingColor,
        useSeriesColors: false
      },
      position: 'top',
      horizontalAlign: 'right',
      offsetX: -10
    }
  }

  return {
    series: result, options: options
  };
});

const resolveDeviceTimeLineTotales = computed(() => {

  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
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

  let dataRaw = Array.from(dataRegistrosChartViews.value);

  const transformedData = {};

  dataRaw.forEach(item => {
      item.data.forEach(subitem => {
          const timestamp = moment(item.fecha).add(1, 'days').valueOf();
          if (!transformedData[timestamp]) {
              transformedData[timestamp] = 0;
          }
          transformedData[timestamp] += subitem.totalVistas;
      });
  });

  const result = [{
      name: 'Total de visitas',
      data: Object.entries(transformedData).map(([timestamp, totalVistas]) => [
          parseInt(timestamp),
          totalVistas
      ])
  }];

  if(selectComboTotales.value == "Hoy"){
    // Iterar sobre cada sección en el arreglo result
    result.forEach(seccion => {
        // Obtener la fecha de mañana en formato YYYY-MM-DD
        const fechaManana = obtenerFechaManana();

        // Agregar un nuevo elemento al arreglo data con la fecha de mañana y un valor de 0
        seccion.data.push([moment(fechaManana).valueOf(), 0]);
    });
  }

  // const result = Object.values(transformedData);
  // console.log(result)

  // console.log(agrupador(2))
  // const seriesFormat = {
  //   name: 'Device',
  //   data: []
  // };

  // const categoriesRaw = [];
  // for (let i in dataRaw) {
  //   let num = parseFloat(dataRaw[i].porcentaje);
  //   seriesFormat.data.push(num);
  //   categoriesRaw.push(dataRaw[i].subsection);
  // }

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    // labels: categoriesRaw,
    dataLabels: {
      enabled: true,
      formatter: function (value, { seriesIndex, dataPointIndex, w }) {
        // // Obtén el valor de la barra actual
        // const barValue = w.config.series[seriesIndex];
        return `${value} visitas`;

        // // Define el umbral para mostrar el dataLabel (ajusta según tus necesidades)
        // const umbral = 5; // Por ejemplo, mostrar solo si el valor es mayor al 5%

        // // Mostrar el valor solo si supera el umbral
        // return barValue > umbral ? `${barValue}%` : '';
      }
    },
    colors: [
      "#173F5F",
      "#00fa9a", // Verde medio
      "#7365ed",
      "#ff69b4", // Rosa claro
      "#000f08",
      "#32cd32", // Verde esmeralda
      "#136f63", // Naranja claro
      "#ffd700", // Amarillo
      "#ff4500", // Rojo oscuro
      "#ff0000", // Rojo
      "#ff8c00", // Naranja oscuro
      "#ffff00", // Amarillo
      "#8b4513", // Marrón
      "#0000ff", // Azul
      "#8a2be2", // Azul violeta
      "#ffa500", // Naranja
      "#ffd800", // Amarillo intenso
      "#ff1493", // Rosa brillante
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      },
    },
    yaxis: {
      title: {
        text: 'Visitas totales',
        style: {
          color: headingColor,
          useSeriesColors: false
        }
      },
      labels: {
        style: {
          // colors: headingColor,
          colors: headingColor,
          useSeriesColors: false
        },
        offsetX: 0,
        formatter: function (val) {
          return `${(val).toFixed(0)} visitas`;
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false
      }
    },
    xaxis: {
      type: 'datetime',
      tickAmount: result[0].data.length - 1,
      // min: new Date("01/01/2014").getTime(),
      // max: new Date("01/07/2014").getTime(),
      labels: {
        style: {
          // colors: headingColor,
          colors: headingColor,
          useSeriesColors: false
        },
        rotate: -15,
        rotateAlways: true,
        formatter: function (val, timestamp) {
          const fechaTimeZone = convertirTimestamp(timestamp).format("DD MMM YYYY");
          // console.log(fechaTimeZone, timestamp)
          return fechaTimeZone;
        }
      }
    },
    tooltip: {
      shared: true
    },
    legend: {
      labels: {
        colors: headingColor,
        useSeriesColors: false
      },
      position: 'top',
      horizontalAlign: 'right',
      offsetX: -10
    }
  }

  return {
    series: result, options: options
  };
});

import { computed, reactive, ref } from 'vue';
    
    const data = ref([]);
    
    // Simula la llamada a la API y la asignación de datos
    fetch('https://servicio-permanencia.vercel.app/get/document/2024-01-12/2024-01-12')
    .then(response => response.json())
    .then(dataFromApi => {
      data.value = dataFromApi.data;
    });
    
    const groupedData = computed(() => {
      const ranges = {
        '0 a 30 segundos': { total: 0, urls: {} },
        '30 segundos a 1 minuto': { total: 0, urls: {} },
        '1 a 5 minutos': { total: 0, urls: {} },
        '5 a 10 minutos': { total: 0, urls: {} },
        '10 a 30 minutos': { total: 0, urls: {} },
        '30 minutos en adelante': { total: 0, urls: {} }
      };
      
      data.value.forEach(user => {
        let range;
        const seconds = user.seconds;
        if (seconds <= 30) range = '0 a 30 segundos';
        else if (seconds <= 60) range = '30 segundos a 1 minuto';
        else if (seconds <= 300) range = '1 a 5 minutos';
        else if (seconds <= 600) range = '5 a 10 minutos';
        else if (seconds <= 1800) range = '10 a 30 minutos';
        else range = '30 minutos en adelante';
        
        if (!ranges[range].urls[user.url]) {
          ranges[range].urls[user.url] = [];
        }
        ranges[range].urls[user.url].push(user);
        ranges[range].total++;
      });
      return ranges;
    });
    
    const isCollapsed = reactive({});
    
    const toggleCollapse = (key) => {
      if (isCollapsed[key] === undefined) {
        isCollapsed[key] = true;
      } else {
        isCollapsed[key] = !isCollapsed[key];
      }
    };

</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-0" cols="12" md="12" lg="12">
        <VTabs v-model="currentTab" class="v-tabs-pill d-none">
          <VTab value="tab-lista" class=" "> Listado </VTab>
          <VTab value="tab-agregar" class=" "> Estadísticas </VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <VCardItem class="header_card_item px-3">
                  <div class="d-flex">
                    <div class="descripcion">
                      <VCardTitle class="pb-2">Permanencia de usuarios, {{ fecha.title }}</VCardTitle>
                      <VCardSubtitle>*Muestra el tiempo que ha permanecido un usuario registrado en las páginas de
                        ecuavisa.com.</VCardSubtitle>
                      <VCardSubtitle>*Mostrando data desde, {{ fecha.i.format('YYYY-MM-DD') }} hasta
                        {{ fecha.f.format('YYYY-MM-DD') }}</VCardSubtitle>
                      <VCardSubtitle>*Este informe se basa en una muestra de {{ limit }} registros</VCardSubtitle>
                    </div>
                  </div>
                  <VDivider class="my-5" />
                  <template #append>

                  </template>
                  <div class="bg-ecuavisa py-4 d-flex gap-4 flex-wrap">
                    <div class="date-picker-wrappe" style="width: 190px;">
                      <VCombobox :disabled="loadingData" v-model="selectedfechaIniFin" :items="fechaIniFinList"
                        variant="outlined" label="Fecha" persistent-hint hide-selected hint="" />

                      <!-- <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngesada"
                        show-current=true @on-change="obtenerFechaDispositivos" style="display: none;" :config="{
                          position: 'auto right',
                          mode: 'range',
                          altFormat: 'F j, Y',
                          dateFormat: 'm-d-Y',
                          maxDate: new Date(),
                          reactive: true

                        }" /> -->
                    </div>

                    <div style="min-width: 230px;width: auto;">
                      <VCombobox clearable multiple density="compact" :disabled="loadingData" v-model="selectSeccion"
                        :items="itemsSeccion" variant="outlined" label="Seleccionar secciones" persistent-hint
                        hide-selected hint="" />
                    </div>

                    <div v-if="currentTabSectionSubSection != 1" style="min-width: 230px;width: auto;">
                      <VCombobox clearable density="compact" :disabled="loadingData" v-model="selectOrder"
                        :items="itemsOrder" variant="outlined" label="Ordenar registros" persistent-hint hide-selected
                        hint="" />
                    </div>

                    <div v-if="currentTabSectionSubSection != 1" style="min-width: 230px;width: auto;">
                      <VCombobox clearable density="compact" :disabled="loadingData" v-model="selectGroup"
                        :items="itemsGroup" variant="outlined" label="Agrupar registros" persistent-hint hide-selected
                        hint="" />
                    </div>

                    

                  </div>
                </VCardItem>
                <div class="d-flex flex-wrap py-0 gap-4 align-items-center" style="justify-content: space-between;;">
                  <div style="display: none">
                    <VCardTitle>
                      Permanencia de usuarios del día de hoy
                    </VCardTitle>
                    <VCardSubtitle>Muestra el tiempo que ha permanecido un usuario registrado en las páginas de
                      ecuavisa.com </VCardSubtitle>
                  </div>
                </div>
                <!-- inicio lista de Módulos -->

                <div class="px-4">
                  <!-- preloader -->

                  <VRow>
                    <VCol cols="12" sm="12" class="">
                      <VTabs v-model="currentTabSectionSubSection" class="v-tabs-pill">
                        <!-- <VTab key="0" value="0">
                          <VIcon start icon="mdi-format-list-bulleted" /> Lista
                        </VTab> -->
                        <VTab key="1" value="1">
                          <VIcon start icon="mdi-chart-scatterplot-hexbin" /> Estadisticas
                        </VTab>
                        <VTab key="2" value="2">
                          <VIcon start icon="mdi-clock-time-eight-outline" /> Agrupación por tiempo
                        </VTab>
                      </VTabs>
                      <br>
                      <VWindow v-model="currentTabSectionSubSection">
                        <VWindowItem class="d-none" key="0" value="0">
                          <VList lines="two" border v-if="dataRegistros.length < 1">
                            <VListItem>
                              <VListItemTitle>
                                <div class="loading">Cargando información</div>
                              </VListItemTitle>
                            </VListItem>
                          </VList>
                          <VRow>
                            <VCol cols="12" sm="12" class="">
                              <div class="item-limit">
                                <label>Mostrar</label>
                                <VSelect style="min-width: 90px;" v-model="selectedOptionperPage" :items="itemsPage"
                                  item-title="title" item-value="value" label="" persistent-hint return-object
                                  single-line />
                                <label>registros</label>
                              </div>
                              <div v-if="selectGroup">
                                <!-- SECTION Table -->
                                <VTable class="text-no-wrap invoice-list-table">
                                  <!-- 👉 Table head -->
                                  <thead class="text-uppercase">
                                    <tr>

                                      <th scope="col">
                                        Página
                                      </th>


                                      <th scope="col">
                                        Sección
                                      </th>

                                      <th scope="col" class="text-center">
                                        Tiempo promedio
                                      </th>

                                      <th scope="col" class="text-center">
                                        Visitas
                                      </th>

                                      <th scope="col">
                                        Acción
                                      </th>
                                    </tr>
                                  </thead>

                                  <!-- 👉 Table Body -->
                                  <tbody>
                                    <tr v-for="(c, index) in paginatedData" :key="index" style="height: 3.75rem;">
                                      <!-- 👉 Page name -->
                                      <td style="min-width: 17rem;max-width: 17rem;">
                                        <VCardTitle :title="c.title" style="font-size: 18px;">
                                          <small>{{ c.title }}</small>
                                        </VCardTitle>

                                      </td>

                                      <!-- 👉 Section -->
                                      <td>
                                        {{ c.section }}
                                      </td>

                                      <!-- 👉 Promedio -->
                                      <td class="text-center">
                                        <VChip label v-bind="{
                                          status: 'Paid',
                                          chip: { color: 'success' },
                                        }" size="small">
                                          {{ formatearTiempo(parseInt(c.promedio)) }}
                                        </VChip>
                                      </td>
                                      <td class="text-center">
                                        <VChip label v-bind="{
                                          status: 'Paid',
                                          chip: { color: 'success' },
                                        }" size="small">
                                          {{ c.total }} visitas
                                        </VChip>
                                      </td>

                                      <!-- 👉 Actions -->
                                      <td class="text-center" style="width: 5rem;">
                                        <VBtn icon size="x-small" color="info" variant="text" :href="c.url" target="_blank">
                                          <VIcon size="22" icon="mdi-link-variant" />
                                        </VBtn>
                                      </td>
                                    </tr>
                                  </tbody>

                                  <!-- 👉 table footer  -->
                                  <tfoot v-show="!paginatedData.length">
                                    <tr>
                                      <td colspan="8" class="text-center text-body-1">
                                        No data available
                                      </td>
                                    </tr>
                                  </tfoot>
                                </VTable>
                                <!-- !SECTION -->
                              </div>
                              <div v-else>
                                <!-- listado de datos -->
                                <VList lines="two" border v-if="dataRegistros.length > 0">
                                  <template v-for="(c, index) in paginatedData" :key="index">
                                    <VListItem :disabled="disabledViewList">
                                      <VListItemTitle> {{ c.user.first_name || "Not Found" }} {{ c.user.last_name || "" }}
                                        <VChip> estuvo {{ calcularDiferencia(c.seconds) }} </VChip>
                                      </VListItemTitle>
                                      <VListItemSubtitle class="mt-1" title="Estado de campaña">
                                        <span class="text-xs text-primary pl-2">
                                          <VIcon icon="mdi-web" />: {{ c.title }}
                                        </span>
                                      </VListItemSubtitle>

                                      <template #append>
                                        <div class="espacio-right-2">
                                          <VBtn icon size="x-small" color="info" variant="text" :href="c.url"
                                            target="_blank">
                                            <VIcon size="22" icon="mdi-link-variant" />
                                          </VBtn>

                                          <VBtn icon size="x-small" color="info" variant="text" :href="'/apps/user/view/'+ c.user.userId"
                                            target="_blank">
                                            <VIcon size="22" icon="mdi-account-outline" />
                                          </VBtn>
                                        </div>
                                      </template>
                                    </VListItem>
                                    <VDivider v-if="index !== dataRegistros.length - 1" />
                                  </template>
                                </VList>
                              </div>

                              <!-- Paginación -->
                              <VPagination class="mt-5" v-model="currentPage" :length="totalPages" :total-visible="7" />
                            </VCol>
                          </VRow>
                        </VWindowItem>
                        <VWindowItem key="1" value="1">
                          <VRow>
                            <VCol cols="12" sm="12" class="">
                              <VCard
                                class="px-0 py-0 pb-4 v-card--flat mb-4 v-theme--light v-card--border v-card--density-default v-card--variant-elevated">
                                <VCardItem class="header_card_item pb-0">
                                  <div class="d-flex pr-0" style="justify-content: space-between;">
                                    <div class="descripcion">
                                      <VCardTitle>Tiempo de permanencia<br> por sección</VCardTitle>
                                      <small class="mt-3">Este informe se basa en una muestra de {{ limit }} registros</small>
                                    </div>
                                    <!-- <div class="">
                                      <VSwitch class="mt-n4 pt-5" disabled @click="toggleRealtime"></VSwitch>
                                    </div> -->

                                  </div>
                                </VCardItem>
                                <VueApexCharts :options="resolveDevice.options" :series="resolveDevice.series" :height="475"
                                  width="100%" />
                              </VCard>
                            </VCol>
                            <VCol cols="12" sm="12" class="">
                              <VCard
                                class="px-0 py-0 pb-4 v-card--flat v-theme--light v-card--border v-card--density-default v-card--variant-elevated">
                                <VCardItem class="header_card_item pb-0">
                                  <div class="d-flex pr-0" style="justify-content: space-between;">
                                    <div class="descripcion">
                                      <VCardTitle>Tiempo de permanencia <br>por subsección<br></VCardTitle>
                                      <small class="mt-3">Este informe se basa en una muestra de {{ limit }} registros</small>
                                    </div>
                                    <!-- <div class="">
                                      <VSwitch class="mt-n4 pt-5" disabled @click="toggleRealtime"></VSwitch>
                                    </div> -->

                                  </div>
                                </VCardItem>
                                <VueApexCharts :options="resolveDeviceGroupSubSection.options"
                                  :series="resolveDeviceGroupSubSection.series" :height="475" width="100%" />
                              </VCard>
                            </VCol>
                            <VCol cols="12" sm="12" class="" style="">
                              <VCard
                                class="px-0 py-0 pb-4 v-card--flat v-theme--light v-card--border v-card--density-default v-card--variant-elevated">
                                <VCardItem class="header_card_item pb-0">
                                  <div class="d-flex pr-0" style="justify-content: space-between;">
                                    <div class="descripcion">
                                      <VCardTitle>Totales por visitas</VCardTitle>
                                      <small class="mt-3">Mostrando data desde, {{ fechaGraficos_2.i.format('YYYY-MM-DD') }} hasta {{ fechaGraficos_2.f.format('YYYY-MM-DD') }}</small>
                                    </div>
                                    <!-- <div class="">
                                <VSwitch class="mt-n4 pt-5" disabled @click="toggleRealtime"></VSwitch>
                              </div> -->

                                  </div>
                                  <template #append>
                                    <div class="date-picker-wrapper" style="min-width:200px;width: auto;max-width: 100%;">
                                      <VCombobox :disabled="loadingData" v-model="selectComboTotales" :items="fechaIniFinList"
                        variant="outlined" label="Fecha" persistent-hint hide-selected hint="" />
                                    </div>
                                  </template>
                                </VCardItem>
                                <VueApexCharts :options="resolveDeviceTimeLineTotales.options"
                                  :series="resolveDeviceTimeLineTotales.series" :height="475" width="100%" />
                              </VCard>
                            </VCol>
                            <VCol cols="12" sm="12" class="" style="">
                              <VCard
                                class="px-0 py-0 pb-4 v-card--flat v-theme--light v-card--border v-card--density-default v-card--variant-elevated">
                                <VCardItem class="header_card_item pb-0">
                                  <div class="d-flex pr-0" style="justify-content: space-between;">
                                    <div class="descripcion">
                                      <VCardTitle>Visitas por sección</VCardTitle>
                                      <small class="mt-3">Mostrando data desde, {{ fechaGraficos_2.i.format('YYYY-MM-DD') }} hasta {{ fechaGraficos_2.f.format('YYYY-MM-DD') }}</small>
                                    </div>
                                    <!-- <div class="">
                                <VSwitch class="mt-n4 pt-5" disabled @click="toggleRealtime"></VSwitch>
                              </div> -->

                                  </div>

                                  <template #append>
                                    <div class="date-picker-wrapper" style="min-width:200px;width: auto;max-width: 100%;">
                                      <VCombobox :disabled="loadingData" v-model="selectComboTotales" :items="fechaIniFinList"
                        variant="outlined" label="Fecha" persistent-hint hide-selected hint="" />
                                    </div>
                                  </template>
                                </VCardItem>
                                <VueApexCharts :options="resolveDeviceTimeLine.options"
                                  :series="resolveDeviceTimeLine.series" :height="475" width="100%" />
                              </VCard>
                            </VCol>
                            <VCol cols="12" sm="12" class="" style="">
                              <VCard
                                class="px-0 py-0 pb-4 v-card--flat v-theme--light v-card--border v-card--density-default v-card--variant-elevated">
                                <VCardItem class="header_card_item pb-0">
                                  <div class="d-flex pr-0" style="justify-content: space-between;">
                                    <div class="descripcion">
                                      <VCardTitle>Tiempo promedio por sección</VCardTitle>
                                      <small class="mt-3">Mostrando data desde, {{ fechaGraficos_2.i.format('YYYY-MM-DD') }} hasta {{ fechaGraficos_2.f.format('YYYY-MM-DD') }}</small>
                                    </div>
                                    <!-- <div class="">
                                <VSwitch class="mt-n4 pt-5" disabled @click="toggleRealtime"></VSwitch>
                              </div> -->

                                  </div>

                                  <template #append>
                                    <div class="date-picker-wrapper" style="min-width:200px;width: auto;max-width: 100%;">
                                      <VCombobox :disabled="loadingData" v-model="selectComboTotales" :items="fechaIniFinList"
                        variant="outlined" label="Fecha" persistent-hint hide-selected hint="" />
                                    </div>
                                  </template>
                                </VCardItem>
                                <VueApexCharts :options="resolveDeviceTimeLinePromedioSection.options"
                                  :series="resolveDeviceTimeLinePromedioSection.series" :height="475" width="100%" />
                              </VCard>
                            </VCol>
                          </VRow>
                        </VWindowItem>
                        <VWindowItem key="2" value="2">

                          <VList lines="two" border v-for="(groups, range) in groupedData" :key="range">
                            <VListItem >
                              <VListItemTitle @click="toggleCollapse(range)">
                                {{ range }}: {{ groups.total }} usuario(s)
                              </VListItemTitle>
                              <div v-if="isCollapsed[range]">
                                  <div v-for="(users, url) in groups.urls" :key="url">
                                                      <button class="btn btn-secondary my-2" type="button" @click="toggleCollapse(url)">
                                                        {{ url }} ({{ users.length }} usuario(s))
                                                      </button>
                                                      <ul class="list-group" v-show="isCollapsed[url]">
                                                        <li class="list-group-item" v-for="user in users" :key="user.id">
                                                          {{ user.user.first_name }} - {{ user.seconds }} segundos
                                                        </li>
                                                      </ul>
                                  </div>
                                </div>
                            </VListItem>
                          </VList>


                        </VWindowItem>
                      </VWindow>

                    </VCol>

                  </VRow>

                </div>
                <!-- fin lista usuarios -->

              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



<style>
.apexcharts-legend-series {
  transition: 1s ease all;
  padding: 5px;
  border-radius: 7px;
}



.apexcharts-legend-series:hover {
  background-color: #8c8c8c3b;
}

.item-limit {
  max-width: 210px;
  display: flex;
  font-size: 15px;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}
</style>
