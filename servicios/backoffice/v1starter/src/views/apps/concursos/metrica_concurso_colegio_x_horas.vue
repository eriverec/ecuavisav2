<script setup>
import { logAction } from '@/middleware/activityLogger';
import { useDateStore } from '@/views/apps/concursos/stores/dateStore_hija_embajador.js';
import { hexToRgb } from '@layouts/utils';
import { parseISO } from 'date-fns';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const dateStore = useDateStore()

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
    var response = await fetch(`https://concursos-usuarios.vercel.app/concurso-bandas/backoffice/metricas-agrupadas-por-horas/0?tipo=Banda&fechai=${fechai}&fechaf=${fechaf}&page=1&limit=10000`);

    //https://concursos-usuarios.vercel.app/concurso-bandas/backoffice/metricas-agrupadas-por-horas/0?tipo=Banda&fechai=2025-04-14&fechaf=2025-04-14&page=1&limit=10000

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
      height: 320,
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: [
      "#ff1493", // Rosa brillante
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
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
                    Concurso de Bandas
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

/*********************************************************************/
/**************** INICIO DE CONFIGURACION DESCARGA ***********************/
/*********************************************************************/
const isFullLoading = ref(false);
  const urlApiExport = ref("");
  const urlTitleExport = ref("usuarios_concurso_bandas");

  const headersGlobal = ref({
    id: "id",
    ip: "ip",
    created_at: "created_at",
    created_at_formated: "created_at_formated"
  });
  
  async function downloadSearch() {
    try {
      // loadingUsuarios.value = true;
      isFullLoading.value=true;
      await fetchFullUsers();
      isFullLoading.value=false;
      // loadingUsuarios.value = false;

      let doc = [];
      doc = usersFull.value
      var title = `${urlTitleExport.value}`;

      logAction('descarga-completa-usuarios-concurso-bandas'); 

      exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

    } catch (error) {
        console.log(error)
        configSnackbar.value = {
            message: "No se pudo recuperar los datos de usuario, recargue de nuevo.",
            type: "error",
            model: true
        };
        isFullLoading.value=false;
        // loadingUsuarios.value = false;
        return false;
    }
  };

  const docsExportNumberLength = ref({
    tamanioActual : 0,
    tamanioTotal : 0
  });

  const usersFull = ref([]);

  async function getUsuariosExportar(page = 1, limit = 10) {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      urlApiExport.value = `https://concursos-usuarios.vercel.app/concurso-bandas/backoffice/exportar-metricas-listar-concurso-votos?tipo=Banda&fechai=${fecha.value.inicio}&fechaf=${fecha.value.fin}`;
      urlTitleExport.value = "usuarios_concurso_bandas_por_hora";

      var response = await fetch(`${urlApiExport.value}&page=${page}&limit=${limit}`, requestOptions);
      
      const data = await response.json();

      if(data.resp){
        return data;
      }else{
        configSnackbar.value = {
            message: "No se pudo recuperar los usuarios, recargue de nuevo.",
            type: "error",
            model: true
        };
        return null;
      }
    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los usuarios, recargue de nuevo.",
          type: "error",
          model: true
      };
      console.error(error.message);
      return null;
    }
  }

  function eliminarDuplicadosPorWylexId(array) {
    return array; // Removemos esta función ya que no necesitamos eliminar duplicados por wylexId
  }

  async function fetchFullUsers(){
    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    usersFull.value = [];
    let totalRegistros = 0;
    var pages = 1;

    try {
      while(true){
        const res = await getUsuariosExportar(pages, 500);
        
        if (!res || !res.resp || !Array.isArray(res.data)) {
          throw new Error('Error en la respuesta del servidor');
        }

        const array = res.data;
        if (array.length === 0) break; // Si no hay más datos, salimos del bucle

        totalRegistros += array.length;
        usersFull.value = [...usersFull.value, ...array];

        docsExportNumberLength.value.tamanioActual = usersFull.value.length;
        docsExportNumberLength.value.tamanioTotal = res.total || totalRegistros;

        if (res.total && usersFull.value.length >= res.total) break; // Si ya tenemos todos los registros, salimos
        pages++;
      }

      // Ordenar todos los registros por fecha de creación
      usersFull.value.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));
      return true;

    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      configSnackbar.value = {
        message: "Error al obtener los datos de usuarios. Por favor, intente nuevamente.",
        type: "error",
        model: true
      };
      return false;
    }
  };

  function exportCSVFile(headers, items, fileTitle) {
    // Crear array para CSV
    let csvData = [];
    
    // Agregar headers
    csvData.push(Object.keys(headers));
    
    // Agregar items
    items.forEach(item => {
      let row = [];
      for (let key in headers) {
        row.push(item[key] || '');
      }
      csvData.push(row);
    });

    // Convertir a CSV
    let csv = csvData.map(row => row.join(',')).join('\n');

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
/*********************************************************************/
/**************** FIN DE CONFIGURACION DESCARGA ***********************/
/*********************************************************************/

watchEffect(async () => {
  if (dateStore.selectedDate) {
    // Aquí puedes usar la nueva fecha
    const selectedDates = dateStore.selectedDate;
    existeFecha.value = true;
    fechaIFModel.value.fechai = moment(selectedDates, "YYYY-MM-DD").format('DD-MM-YYYY');
    fechaIFModel.value.fechaf = moment(selectedDates, "YYYY-MM-DD").format('DD-MM-YYYY'); 
    fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
    fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD');

    await getChartLineTimeViews({
        fechai: fecha.value.inicio,
        fechaf: fecha.value.fin
    });

    console.log('Fecha actualizada:', selectedDates)
  }
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
            <!-- <VCardSubtitle class="text-wrap" style="word-break: break-all;">
                Diseñada para mostrar la cantidad de usuarios registrados, organizados de acuerdo con la fecha de registro, agrupados por horas.
            </VCardSubtitle> -->
            <template #append>
              <div class="d-flex align-center gap-4">
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
                <div class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
                      <!-- 👉 Export button -->
                      <VBtn
                        :loading="isFullLoading"
                        :disabled="isFullLoading || loadingUsuarios"
                        variant="tonal"
                        color="success"
                        prepend-icon="tabler-screen-share"
                        @click="downloadSearch"
                      >
                        <span style="cursor:pointer" class="px-0 py-p m-0">Exportar</span>
                      </VBtn>
                      <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
                        Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
                      </small> 
                    </div>
              </div>
            </template>
        </VCardItem>

        <VCardText>
            <div class="h5"> Mostrando: {{ fecha.inicio }}</div>
            <VueApexCharts v-if="loadingGrafico" :options="resolveDeviceTimeLine.options" :series="resolveDeviceTimeLine.series" :height="320" width="100%" />
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