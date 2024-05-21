<script setup>
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";

import Moment from 'moment-timezone';


const loadingGrafico = ref(false)
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
const selectComboTotales = ref('Hoy');

const fechaIniFinList = useSelectCalendar();
const limit = ref(valoresHoy.limit);
const currentTabSectionSubSection = ref("0")

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


onMounted(async () =>{

  loadingData.value = true;
  loadingGrafico.value = false

  await getChartLineTimeViews({
    fechai: fechaGraficos_2.value.i.format("YYYY-MM-DD"),
    fechaf: fechaGraficos_2.value.f.format("YYYY-MM-DD")
  });

  loadingData.value = false;
  loadingGrafico.value = true
  
  // currentTabSectionSubSection.value = "1";
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

watch(async () => selectComboTotales.value, async () => {
  let selectedCombo = useSelectValueCalendar(selectComboTotales.value);
  fechaGraficos_2.value = {
    i: selectedCombo.i,
    f: selectedCombo.f,
    title: selectComboTotales.value
  }

  limit.value = selectedCombo.limit;

  loadingData.value = true;
  loadingGrafico.value = false

  await getChartLineTimeViews({
    fechai: fechaGraficos_2.value.i.format("YYYY-MM-DD"),
    fechaf: fechaGraficos_2.value.f.format("YYYY-MM-DD"),
  });

  loadingData.value = false;
  selectGroup.value = null;
  loadingGrafico.value = true

  // itemsSeccion.value = [{title:"sds",value:"wddw"}]
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


/*COMBO SELECT PERPAGE*/


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

  // if(result.length < 1){
  //   loadingGrafico.value = false
  //   return {
  //     series: [], options: {}
  //   };
  // }else{
  //   loadingGrafico.value = true
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
        text: 'Cantidad de usuarios registrados',
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

</script>

<template>
  <VCard
    title="Usuarios registrados"
    subtitle="Mira los usuarios registrados, cursos y logros"
  >
    <template #append>
      <div class="mt-n4 me-n2 d-flex align-center">
        <div class="date-picker-wrapper" style="min-width:200px;width: auto;max-width: 100%;">
          <VCombobox :disabled="loadingData" v-model="selectComboTotales" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint hide-selected hint="" />
        </div>
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
      <VueApexCharts v-if="loadingGrafico" :options="resolveDeviceTimeLine.options" :series="resolveDeviceTimeLine.series" :height="475" width="100%" />
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