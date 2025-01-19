<script setup>

import { hexToRgb } from '@layouts/utils';
import { parseISO } from 'date-fns';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const loadingGrafico = ref(false)
const moment = extendMoment(Moment);
// Establecer la zona horaria por defecto
moment.tz.setDefault('America/Guayaquil');

moment.lang('es', {
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
        weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
        weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
    }
);

moment.locale('es');

// Función para convertir el timestamp a la zona horaria deseada
const convertirTimestamp = (timestamp) => {
    return moment.tz(timestamp, 'America/Guayaquil');
};

const dataRegistrosChartViews = ref([]);
const loadingData = ref(false);

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme();

/*GRÁFICO DE PIE*/


/*COMBO SELECT PERPAGE*/


async function getChartLineTimeViews(options = {}) {
  try {
    const { fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')) } = options;
    var response = await fetch(`https://usuarios-backoffice.vercel.app/campaign-landings/metricas-agrupadas-por-dia/hija_embajador?fechai=${fechai}&fechaf=${fechaf}&limit=50000`);
    const data = await response.json();

    if(data.resp){
      dataRegistrosChartViews.value = data.data;
    }
  } catch (error) {
    configSnackbar.value = {
        message: "No se pudo recuperar los usuarios, recargue de nuevo.",
        type: "error",
        model: true
    };
    return console.error(error.message);
  }
}

const resolveDeviceTimeLine = computed(() => {
  const { themeBorderColor, themeDisabledTextColor, themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(vuetifyTheme.current.value);
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`;

  // Configuración de colores
  const chartColors = {
    success: currentTheme.success,
    primary: currentTheme.primary,
    secondary: currentTheme.secondary,
  };

  // Datos iniciales
  let dataRaw = Array.from(dataRegistrosChartViews.value);

  // Generar series a partir de los datos
  const series = [
    {
      name: "Usuarios registrados",
      data: dataRaw.map(item => item.total), // Extrae los valores de "total"
    }
  ];

  // Opciones del gráfico
  const options = {
    chart: {
      type: 'area',
      height: 285,
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: [
      "#8a2be2", // Azul violeta
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
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: dataRaw.map(item => item.rango), // Usa "rango" como categorías
      labels: {
        style: { colors: headingColor },
        rotate: -15,
        formatter: function (val) {
          if(!val){
            return "";
          }
          var rango = val.split('-');
          var horaInicio = rango[0];
          var horaFin = rango[1];
          var horaInicioFormateada = horaInicio >= 0 && horaInicio < 12 ? `${horaInicio} AM` : `${horaInicio} PM`;
          var horaFinFormateada = horaFin >= 0 && horaFin < 12 ? `${horaFin} AM` : `${horaFin} PM`;
          return `${horaInicioFormateada} - ${horaFinFormateada}`; // Devuelve el texto que deseas mostrar en la etiqueta
        },
      },
    },
    yaxis: {
      title: {
        text: 'Cantidad de usuarios registrados',
        style: { color: headingColor },
      },
      labels: {
        style: { colors: headingColor },
        formatter: val => `${val.toFixed(0)}`,
      },
    },
    tooltip: {
      theme: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class="tooltip-content">
                <div class="tooltip-body">
                <div class="tooltip-title">
                    La hija del embajador
                </div>
                <div class="tooltip-subtitle">
                  ${w.globals.categoryLabels[dataPointIndex]} <!-- Muestra la fecha -->
                </div>
                <div class="tooltip-data-flex">
                    <div class="tooltip-data-title">
                    Registrados
                    </div>
                    <div class="tooltip-data-value">
                    ${series[seriesIndex][dataPointIndex]} Usuario(s)
                    </div>
                </div>
                </div>
            </div>`
      },
    },
    dataLabels: {
      enabled: true,
      formatter: val => (val > 0 ? `${val} usuario(s)` : ''),
    },
    noData: {
      text: "No hay datos disponibles",
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: themeDisabledTextColor,
        fontSize: '16px',
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: themeSecondaryTextColor },
    },
  };

  return { series, options };
});



/**************** CONFIGURACION DEL CAMPO FECHA ***********************/
/*********************************************************************/
const limiteDaysDate = ref(0);
const fechaFin = moment().format("YYYY-MM-DD");
const fechaInicio = moment().subtract(limiteDaysDate.value, 'days').format("YYYY-MM-DD");

const fecha = ref({
    inicio: fechaInicio,
    fin: fechaFin
});

const optionsDefaultDate = {
    fechasModel: [parseISO(fechaInicio), parseISO(fechaFin)],
    fechasVModel: [parseISO(fechaFin)],
    fechasVConfig: {
        position: 'auto right',
        mode: 'single',
        minDate: parseISO(fechaFin),
        altFormat: 'd F j, Y',
        dateFormat: 'l, j \\d\\e F \\d\\e Y',
        valueFormat: 'd-m-Y',
        reactive: true
    },
    fechai: fechaInicio,
    fechaV: fechaFin,
    fechaf: fechaFin
};

const fechaIFModel = ref(optionsDefaultDate)

const existeFecha = ref(true);

async function obtenerFechas(selectedDates, dateStr, instance) {
    console.log(selectedDates);
    if (selectedDates.length > 1) {
      existeFecha.value = true;
      fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
      fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
      fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
      fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD');

      await getChartLineTimeViews({
          fechai: fecha.value.inicio,
          fechaf: fecha.value.fin
      });

    }else{
        if (selectedDates.length === 1) {
            // Calcula el rango máximo permitido
            fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
            fechaIFModel.value.fechaf = moment(selectedDates[0]).format('DD-MM-YYYY'); 
            fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
            fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD');

            await getChartLineTimeViews({
                fechai: fecha.value.inicio,
                fechaf: fecha.value.fin
            });
        }

        if(selectedDates.length == 2){
            fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
            fechaIFModel.value.fechasVModel = [selectedDates[1]];
            existeFecha.value = true;
        }

        if(selectedDates.length == 0){
            existeFecha.value = false;
        }
    }

    

}

/*********************************************************************/
/**************** CONFIGURACION DEL CAMPO FECHA ***********************/

onMounted(async () =>{
    loadingData.value = true;
    loadingGrafico.value = false

    await getChartLineTimeViews({
        fechai: fecha.value.inicio,
        fechaf: fecha.value.fin
    });

    loadingData.value = false;
    loadingGrafico.value = true
})
</script>

<template>
  <section>
    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type">
        {{ configSnackbar.message }}
    </VSnackbar>
    <VCard>
        <VCardItem>
            <VCardTitle>
                Usuarios registrados por fecha agrupados por horas
            </VCardTitle>
            <VCardSubtitle class="text-wrap" style="word-break: break-all;">
                Diseñada para mostrar la cantidad de usuarios registrados, organizados de acuerdo con la fecha de registro, agrupados por horas.
            </VCardSubtitle>
            <template #append>
                <AppDateTimePicker 
                    clearable
                    class="bg-white"
                    style="width: 19rem;"
                    label="Fecha de inicio y fin del curso" 
                    prepend-inner-icon="tabler-calendar" 
                    density="compact" 
                    v-model="fechaIFModel.fechasModel"
                    show-current=true 
                    @on-change="obtenerFechas" 
                    :config="{
                        position: 'auto right',
                        mode: 'single',
                        altFormat: 'd F j, Y',
                        maxDate: new Date,
                        dateFormat: 'l, j \\d\\e F \\d\\e Y',
                        valueFormat: 'd-m-Y',
                        reactive: true
                    }" />
            </template>
        </VCardItem>

        <VCardText>
            <VueApexCharts v-if="loadingGrafico" :options="resolveDeviceTimeLine.options" :series="resolveDeviceTimeLine.series" :height="285" width="100%" />
            <div v-else class="py-4">
                Cargando datos...
            </div>
        </VCardText>
    </VCard>
  </section>
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