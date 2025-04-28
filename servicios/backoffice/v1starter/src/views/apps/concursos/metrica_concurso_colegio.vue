<script setup>
import { logAction } from '@/middleware/activityLogger';
import { useDateStore } from '@/views/apps/concursos/stores/dateStoreColegio.js';
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

    var response = await fetch(`https://concursos-usuarios.vercel.app/concurso-bandas/backoffice/metricas-agrupadas-por-dias/0?tipo=VIVA LA PAZ&fechai=${fechai}&fechaf=${fechaf}&limit=10000`);

    //https://concursos-usuarios.vercel.app/concurso-bandas/backoffice/metricas-agrupadas-por-dias/0?tipo=VIVA LA PAZ&fechai=2025-04-13&fechaf=2025-04-15&page=1&limit=10000

    const data = await response.json();

    if(data.resp){
      dataRegistrosChartViews.value = data.data.concurso;
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
    if (!transformedData["concurso"]) {
        transformedData["concurso"] = {
            name: "concurso",
            data: []
        };
    }
    transformedData["concurso"].data.push([
        // moment(item.fecha).add(1, 'days').valueOf(),
        moment(item.date).valueOf(),
        item.total
    ]);
  });

  const result = Object.values(transformedData);

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'area',
      stacked: false,
      height: 320,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    // labels: categoriesRaw,
    // dataLabels: {
    //   enabled: true
    // },
    colors: [
      "#32cd32", // Verde esmeralda
      "#ffd700", // Amarillo
      "#ff4500", // Rojo oscuro
      "#ff0000", // Rojo
      "#ff8c00", // Naranja oscuro
      "#ffff00", // Amarillo
      "#173F5F",
      "#00fa9a", // Verde medio
      "#7365ed",
      "#ff69b4", // Rosa claro
      "#000f08",
      "#136f63", // Naranja claro
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
        text: 'Votos de usuarios',
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
        tooltip: {
            enabled: false, // Desactiva el resaltado en el eje X
        },
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
        // y: {
        //     formatter: function (val) {
        //     return val + " Ventas"
        //     }
        // },
        theme: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            // console.log(w)
            // series[seriesIndex]
            // console.log(w.globals.categoryLabels[dataPointIndex])
            //${w.config.series[seriesIndex].name}
            const timestamp = w.globals.labels[dataPointIndex];
            const fechaTimeZone = convertirTimestamp(timestamp).format("DD MMM YYYY");
            return `<div class="tooltip-content">
                <div class="tooltip-body">
                <div class="tooltip-title">
                     Concurso de Bandas
                </div>
                <div class="tooltip-subtitle">
                  ${fechaTimeZone} <!-- Muestra la fecha -->
                </div>
                <div class="tooltip-data-flex">
                    <div class="tooltip-data-title">
                    Número de votos
                    </div>
                    <div class="tooltip-data-value">
                    ${series[seriesIndex][dataPointIndex]} Voto(s)
                    </div>
                </div>
                </div>
            </div>`
        }
    },
    dataLabels: {
        enabled: true,
        formatter(val) {
            if(val > 0){
                return `${val} usuario(s)`
            }
            return ``
        },
    },
    // stroke: {
    //     show: false,
    //     curve: 'straight',
    // },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: { colors: themeSecondaryTextColor },
        markers: {
            offsetY: 1,
            offsetX: -3,
        },
        itemMargin: {
            vertical: 3,
            horizontal: 10,
        },
    },
  }

  return {
    series: result, options: options
  };
});


/**************** CONFIGURACION DEL CAMPO FECHA ***********************/
/*********************************************************************/
const limiteDaysDate = ref(5);
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
    if (selectedDates.length > 1) {
        const diferenciaDias = moment(selectedDates[1]).diff(moment(selectedDates[0]), 'days');
        
        if(diferenciaDias > limiteDaysDate.value){
            fechaIFModel.value["fechasModel"] = [parseISO(fecha.value.inicio), parseISO(fecha.value.fin)];
            fechaIFModel.value["fechasVModel"] = [parseISO(fecha.value.inicio)];
            configSnackbar.value = {    
                message: `El rango de fechas debe ser de ${limiteDaysDate.value} dias o menos.`,
                type: "error",
                model: true
            };
            return console.error(`El rango de fechas debe ser de ${limiteDaysDate.value} dias o menos.`);
        }else{
            existeFecha.value = true;
            fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
            fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
            fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
            fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD');

            await getChartLineTimeViews({
                fechai: fecha.value.inicio,
                fechaf: fecha.value.fin
            });
        }

    }else{
        if (selectedDates.length === 1) {
            // Calcula el rango máximo permitido
            const maxRangeDate = moment(selectedDates[0]).add(limiteDaysDate.value, 'days').toDate();
            fechaIFModel.value.fechasVConfig["maxDate"] = maxRangeDate; // Limita el rango de selección
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
/**************** FIN DE CONFIGURACION DEL CAMPO FECHA ***********************/


/*********************************************************************/
/**************** INICIO DE CONFIGURACION DESCARGA ***********************/
/*********************************************************************/
  const isFullLoading = ref(false);
  const urlApiExport = ref("");
  const urlTitleExport = ref("usuarios_concurso_bandas");

  const headersGlobal = ref({
    _id: "_id",
    concurso: "concurso",
    estado: "estado_registro",
    updated_at: "updated_at",
    created_at: "created_at",
    link_youtube: "link_youtube",
    institucion_nombre: "institucion_nombre",
    nombre_rector: "nombre_rector",
    contacto_celular: "contacto_celular",
    contacto_email: "contacto_email",
    categoria: "categoria",
    talento_nombre: "talento_nombre",
    link_formulario_1: "Consentimiento_parental_para_el_IVP",
    link_formulario_2: "Autorizacion_de_uso_de_imagen_IVP",
    link_formulario_3: "Autorizacion_de_la_Unidad_Educativa_para_el_IVP",
    check_consentimiento: "check_consentimiento",
    check_politica_privacidad: "check_politica_privacidad",
    updated_at_formated:"updated_at_formated",
    created_at_formated:"created_at_formated"
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
  const estadoItems = ref([{title: 'Todos', value: 'Todos'}, {title: 'No revisado', value: '0'}, {title: 'Revisado, aprobado', value: '1'}, {title: 'Rechazado', value: '2'}]);

  async function getUsuariosExportar(page = 1, limit = 10) {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      urlApiExport.value = `https://concursos-usuarios.vercel.app/concurso-bandas/backoffice/exportar-metricas-listar-concurso-votos?tipo=VIVA LA PAZ&fechai=${fecha.value.inicio}&fechaf=${fecha.value.fin}`;
      urlTitleExport.value = "usuarios_concurso_bandas_por_fecha";

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
        array.forEach((item) => {
          let newItem = {};
          // Asignamos valores específicamente para cada cabecera
          let estadoText = estadoItems.value;

          newItem._id = item._id || "";
          newItem.concurso = item.tipo || "";
          newItem.estado = estadoText.find(e => e.value == item.estado)?.title || "";
          newItem.updated_at = item.updated_at || "";
          newItem.created_at = item.created_at || "";
          newItem.link_youtube = item.link_youtube || "";
          newItem.institucion_nombre = item.institucion_nombre || "";
          newItem.nombre_rector = item.nombre_rector || "";
          newItem.contacto_celular = item.contacto_celular || "";
          newItem.contacto_email = item.contacto_email || "";
          newItem.categoria = item.categoria || "";
          newItem.talento_nombre = item.talento_nombre || "";
          newItem.link_formulario_1 = item.link_formulario_1 || "";
          newItem.link_formulario_2 = item.link_formulario_2 || "";
          newItem.link_formulario_3 = item.link_formulario_3 || "";
          newItem.check_consentimiento = item.check_consentimiento == "1" ? "Si" : "No" || "Si";
          newItem.check_politica_privacidad = item.check_politica_privacidad == "1" ? "Si" : "No" || "Si";
          newItem.updated_at_formated = item.updated_at_formated || "";
          newItem.created_at_formated = item.created_at_formated || "";
          usersFull.value.push(newItem);
        });
        if (array.length === 0) break; // Si no hay más datos, salimos del bucle

        totalRegistros += array.length;
        // usersFull.value = [...usersFull.value, ...array];

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
            let value = item[key] !== undefined ? item[key] : '';
            value = String(value);

            // Escapar valores que contienen comas, saltos de línea o comillas
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                value = `"${value.replace(/"/g, '""')}"`; // Doble las comillas internas
            }

            row.push(value);
        }
        csvData.push(row);
    });

    // Convertir a CSV
    let csv = csvData.map(row => row.join(',')).join('\n');

    var exportedFilename = fileTitle + ".csv" || "export.csv";

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilename);
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

const eventClick = function(event, chartContext, opts) {
    // console.log(event, chartContext, opts)
    // console.log(opts.dataPointIndex)
    // console.log(opts.config.xaxis.categories)
    if(opts.dataPointIndex > -1){
      // console.log(opts.config.xaxis.categories[opts.dataPointIndex])
      const fechaTimeZone = convertirTimestamp(opts.config.series[0]["data"][opts.dataPointIndex][0]).format("YYYY-MM-DD");
      dateStore.setDate(fechaTimeZone)
    }
    // const category = config.xaxis.categories[dataPointIndex];
    // const value = config.series[seriesIndex].data[dataPointIndex];
    // console.log(`Clicked on ${category} with value ${value}`);
    // Aquí puedes añadir tu lógica personalizada al hacer click en un punto
  }
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
                Votos agrupados por fecha
            </VCardTitle>
            <!-- <VCardSubtitle class="text-wrap" style="word-break: break-all;">
                Diseñada para mostrar la cantidad de usuarios registrados, organizados de acuerdo con la fecha de registro. Esta vista permite analizar el comportamiento de registro de los usuarios dentro de un rango específico, con la restricción de seleccionar únicamente un intervalo máximo de {{limiteDaysDate}} días.
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
                        mode: 'range',
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
            <div class="h5"> Mostrando datos de: {{ fecha.inicio }} - {{ fecha.fin }}</div>
            <VueApexCharts v-if="loadingGrafico" :options="resolveDeviceTimeLine.options" :series="resolveDeviceTimeLine.series" :height="320" width="100%" @click="eventClick" />
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