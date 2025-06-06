<script setup>
import { avatarText } from '@core/utils/formatters';
import { parseISO } from 'date-fns';
import debounce from 'lodash/debounce';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';

const moment = extendMoment(Moment);
// moment.locale('es', [esLocale]);
// moment.tz.setDefault('America/Guayaquil');

const tipoModel = ref("Ver todos los registros");

const totalRegistros = ref(0);
const dataRespuestas = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const rowPerPage = ref(10);
const isFullLoading = ref(false);
const loadingRespuestas = ref(false);

/*Variables de búsqueda*/
const modelSearch = ref("");
const searchQuery = ref('');

const fechaFin = moment().format("YYYY-MM-DD");
const fechaInicio = moment().subtract(7, 'days').format("YYYY-MM-DD");

const fecha = ref({
  inicio: fechaInicio,
  fin: fechaFin
});

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const headersExport = ref({
  id: "ID",
  email: "Email",
  nombre: "Nombre",
  apellido: "Apellido",
  fecha_participacion: "Fecha de Participación",
  puntaje_total: "Puntaje Total",
  tipo_resultado: "Tipo de Resultado"
});

// Variables para el gráfico
const chartData = ref({
  curioso: { count: 0, percentage: 0 },
  inquebrantable: { count: 0, percentage: 0 },
  tentacion: { count: 0, percentage: 0 }
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

const fechaIFModel = ref(optionsDefaultDate);
const respuestasFull = ref([]);

const docsExportNumberLength = ref({
  tamanioActual : 0,
  tamanioTotal : 0
});


watch(currentPage, async () => {
  if (currentPage.value > totalPage.value){
    currentPage.value = totalPage.value
  }
  await getRespuestas();
});

watch(rowPerPage, async () => {
  currentPage.value = 1;
  await getRespuestas();
});

const paginationData = computed(() => {
  const firstIndex = dataRespuestas.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = Math.min(currentPage.value * rowPerPage.value, totalRegistros.value)
  
  if(totalRegistros.value < rowPerPage.value){
    return `Mostrando ${totalRegistros.value} de ${totalRegistros.value} registros`
  }
  return `Mostrando ${firstIndex} - ${lastIndex} de ${totalRegistros.value} registros`
})

onMounted(async () => {
  await getRespuestas();
});

// Función para calcular datos del gráfico
async function calculateChartData() {
  try {
    const response = await fetch('https://services.ecuavisa.com/isla/config.php?api=all');
    const data = await response.json();

    if(Array.isArray(data)) {
      let filteredData = [...data];
      
      // Aplicar los mismos filtros que en getRespuestas
      if(modelSearch.value) {
        filteredData = filteredData.filter(item => 
          item.email.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.nombre.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.apellido.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.tipo_resultado.toLowerCase().includes(modelSearch.value.toLowerCase())
        );
      }

      if(tipoModel.value === "Por Fecha") {
        filteredData = filteredData.filter(item => {
          const fechaItem = moment.utc(item.fecha_participacion);
          const fechaInicioMoment = moment(fecha.value.inicio);
          const fechaFinMoment = moment(fecha.value.fin);
          return fechaItem.isBetween(fechaInicioMoment, fechaFinMoment, 'day', '[]');
        });
      }

      // Contar por tipo de resultado
      const counts = {
        curioso: filteredData.filter(item => item.tipo_resultado === 'curioso').length,
        inquebrantable: filteredData.filter(item => item.tipo_resultado === 'inquebrantable').length,
        tentacion: filteredData.filter(item => item.tipo_resultado === 'tentacion').length
      };

      const total = counts.curioso + counts.inquebrantable + counts.tentacion;

      // Calcular porcentajes
      chartData.value = {
        curioso: { 
          count: counts.curioso, 
          percentage: total > 0 ? (counts.curioso / total) * 100 : 0 
        },
        inquebrantable: { 
          count: counts.inquebrantable, 
          percentage: total > 0 ? (counts.inquebrantable / total) * 100 : 0 
        },
        tentacion: { 
          count: counts.tentacion, 
          percentage: total > 0 ? (counts.tentacion / total) * 100 : 0 
        }
      };
    }
  } catch (error) {
    console.error('Error calculating chart data:', error);
  }
}

async function getRespuestas() {
  try {
    loadingRespuestas.value = true;
    
    const response = await fetch('https://services.ecuavisa.com/isla/config.php?api=all');
    const data = await response.json();

    if(Array.isArray(data)) {
      let filteredData = [...data];
      
      // Filtro por búsqueda
      if(modelSearch.value) {
        filteredData = filteredData.filter(item => 
          item.email.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.nombre.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.apellido.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.tipo_resultado.toLowerCase().includes(modelSearch.value.toLowerCase())
        );
      }

      // Filtro por fecha
      if(tipoModel.value === "Por Fecha") {
        filteredData = filteredData.filter(item => {
          const fechaItem = moment.utc(item.fecha_participacion);
          const fechaInicioMoment = moment(fecha.value.inicio);
          const fechaFinMoment = moment(fecha.value.fin);
          return fechaItem.isBetween(fechaInicioMoment, fechaFinMoment, 'day', '[]');
        });
      }

      // Ordenar por fecha más reciente
      filteredData.sort((a, b) => moment.utc(b.fecha_participacion).diff(moment(a.fecha_participacion)));

      // Paginación
      totalRegistros.value = filteredData.length;
      totalPage.value = Math.ceil(filteredData.length / rowPerPage.value);
      
      const startIndex = (currentPage.value - 1) * rowPerPage.value;
      const endIndex = startIndex + rowPerPage.value;
      dataRespuestas.value = filteredData.slice(startIndex, endIndex);
      
      // Actualizar datos del gráfico
      await calculateChartData();
      
    } else {
      configSnackbar.value = {
          message: "No se pudo recuperar las respuestas, recargue de nuevo.",
          type: "error",
          model: true
      };
    }
    loadingRespuestas.value = false;
  } catch (error) {
    configSnackbar.value = {
        message: "No se pudo recuperar las respuestas, recargue de nuevo.",
        type: "error",
        model: true
    };
    loadingRespuestas.value = false;
    console.error(error.message);
  }
}

const existeFecha = ref(true);

//Fechas
async function obtenerFechas(selectedDates, dateStr, instance) {
    if (selectedDates.length > 1) {
      existeFecha.value = true;
      currentPage.value = 1;
      fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
      fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
      fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
      fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD')
      await getRespuestas();
    }

    if(selectedDates.length == 2){
      fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
      fechaIFModel.value.fechasVModel = [selectedDates[1]];
      existeFecha.value = true;
    }

    if(selectedDates.length == 0){
      existeFecha.value = false;
      await getRespuestas();
    }
}

async function getRespuestasExportar() {
  try {
    const response = await fetch('https://services.ecuavisa.com/isla/config.php?api=all');
    const data = await response.json();

    if(Array.isArray(data)) {
      let filteredData = [...data];
      
      // Filtro por búsqueda
      if(modelSearch.value) {
        filteredData = filteredData.filter(item => 
          item.email.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.nombre.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.apellido.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.tipo_resultado.toLowerCase().includes(modelSearch.value.toLowerCase())
        );
      }

      // Filtro por fecha
      if(tipoModel.value === "Por Fecha") {
        filteredData = filteredData.filter(item => {
          const fechaItem = moment(item.fecha_participacion);
          const fechaInicioMoment = moment(fecha.value.inicio);
          const fechaFinMoment = moment(fecha.value.fin);
          return fechaItem.isBetween(fechaInicioMoment, fechaFinMoment, 'day', '[]');
        });
      }

      return {
        resp: true,
        data: filteredData,
        total: filteredData.length
      };
    }
    return { resp: false };
  } catch (error) {
    console.error(error.message);
    return { resp: false };
  }
}

async function fetchFullRespuestas(){
  docsExportNumberLength.value = {
    tamanioActual : 0,
    tamanioTotal : 0
  };

  respuestasFull.value = [];

  const res = await getRespuestasExportar();
  
  if(res.resp) {
    const array = res.data;
    const totalRespuestas = res.total;

    array.forEach((registro) => {
      let newItem = {};
      // Recorremos las claves de headers
      for (let key in headersExport.value) {
        if (registro.hasOwnProperty(key)) {
          newItem[headersExport.value[key]] = registro[key];
        } else {
          newItem[headersExport.value[key]] = "";
        }
      }
      respuestasFull.value.push(newItem);
    });

    docsExportNumberLength.value.tamanioActual = respuestasFull.value.length;
    docsExportNumberLength.value.tamanioTotal = totalRespuestas;

    // Ordenar por fecha más reciente
    respuestasFull.value.sort((a, b) => moment.utc(b["Fecha de Participación"]).diff(moment(a["Fecha de Participación"])));
  }

  return true;
}

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";
      line += `"${array[i][index]}"`;
    }
    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers && items.length > 0) {
    items.unshift(headers);
  }

  var jsonObject = JSON.stringify(items);
  var csv = convertToCSV(jsonObject);
  
  // para que Excel detecte correctamente la codificación
  var csvWithBOM = '\uFEFF' + csv;
  
  var exportedFilename = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
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

async function downloadSearch() {
  try {
    
    if(dataRespuestas.value.length < 1){
       configSnackbar.value = {
          message: "No hay datos que exportar.",
          type: "error",
          model: true
      };
      return false;
    }
    
    isFullLoading.value = true;
    await fetchFullRespuestas();
    isFullLoading.value = false;

    let doc = [];
    doc = respuestasFull.value
    var title = `respuestas_formulario_${moment().format("YYYY-MM-DD-HH-mm-ss")}`;

    exportCSVFile(headersExport.value, doc, title);

  } catch (error) {
      console.log(error)
      configSnackbar.value = {
          message: "No se pudo recuperar los datos, recargue de nuevo.",
          type: "error",
          model: true
      };
      isFullLoading.value = false;
      return false;
  }
}

// Función para descargar CSV por tipo de resultado
async function downloadResultByType(tipoResultado) {
  try {
    const response = await fetch('https://services.ecuavisa.com/isla/config.php?api=all');
    const data = await response.json();

    if(Array.isArray(data)) {
      let filteredData = [...data];
      
      // Aplicar filtros actuales
      if(modelSearch.value) {
        filteredData = filteredData.filter(item => 
          item.email.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.nombre.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.apellido.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
          item.tipo_resultado.toLowerCase().includes(modelSearch.value.toLowerCase())
        );
      }

      if(tipoModel.value === "Por Fecha") {
        filteredData = filteredData.filter(item => {
          const fechaItem = moment.utc(item.fecha_participacion);
          const fechaInicioMoment = moment(fecha.value.inicio);
          const fechaFinMoment = moment(fecha.value.fin);
          return fechaItem.isBetween(fechaInicioMoment, fechaFinMoment, 'day', '[]');
        });
      }

      // Filtrar por tipo de resultado específico
      const dataByType = filteredData.filter(item => item.tipo_resultado === tipoResultado);

      if(dataByType.length === 0) {
        configSnackbar.value = {
          message: `No hay usuarios con resultado "${capitalizeText(tipoResultado)}" para exportar.`,
          type: "warning",
          model: true
        };
        return;
      }

      // Preparar datos para exportar
      let exportData = [];
      dataByType.forEach((registro) => {
        let newItem = {};
        for (let key in headersExport.value) {
          if (registro.hasOwnProperty(key)) {
            newItem[headersExport.value[key]] = registro[key];
          } else {
            newItem[headersExport.value[key]] = "";
          }
        }
        exportData.push(newItem);
      });

      // Ordenar por fecha más reciente
      exportData.sort((a, b) => moment.utc(b["Fecha de Participación"]).diff(moment(a["Fecha de Participación"])));

      const title = `usuarios_${tipoResultado}_${moment().format("YYYY-MM-DD-HH-mm-ss")}`;
      exportCSVFile(headersExport.value, exportData, title);

      configSnackbar.value = {
        message: `${dataByType.length} usuarios con resultado "${capitalizeText(tipoResultado)}" exportados exitosamente`,
        type: "success",
        model: true
      };

    }
  } catch (error) {
    console.error('Error downloading by type:', error);
    configSnackbar.value = {
      message: "Error al exportar usuarios por tipo de resultado",
      type: "error",
      model: true
    };
  }
}

watch(tipoModel, async () => {
  currentPage.value = 1;
  if(tipoModel.value){
    await getRespuestas();
  }
});

// Función para realizar la consulta
const buscarRespuestas = async () => {
  try {
    modelSearch.value = searchQuery.value?.toLowerCase();
    currentPage.value = 1;
    await getRespuestas();
  } catch (error) {
    console.error("Error en buscarRespuestas:", error);
    configSnackbar.value = {
        message: "No se pudo recuperar los datos al realizar la búsqueda, recargue de nuevo.",
        type: "error",
        model: true
    };
    return null;
  }
};

// Crear una función con debounce
const buscarRespuestasDebounced = debounce(buscarRespuestas, 500);

// Función para obtener el color del tipo de resultado
function getTipoResultadoColor(tipo) {
  switch(tipo) {
    case 'curioso':
      return '#311f5d'; // Tonalidad base
    case 'inquebrantable':
      return '#4a2f7a'; // Tonalidad más clara
    case 'tentacion':
      return '#771a26'; // Tonalidad rojo
    default:
      return '#311f5d';
  }
}

function capitalizeText(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Función para descargar respuestas de un usuario específico
function downloadUserResponses(usuario) {
  try {
    // Preparar los datos del usuario con sus respuestas
    const userData = {
      'ID': usuario.id,
      'Nombre': usuario.nombre,
      'Apellido': usuario.apellido,
      'Correo': usuario.email,
      'Fecha de Participación': moment.utc(usuario.fecha_participacion).format("DD/MM/YYYY HH:mm:ss"),
      'Puntaje Total': usuario.puntaje_total,
      'Tipo de Resultado': capitalizeText(usuario.tipo_resultado)
    };

    // Agregar las 8 preguntas con sus respuestas
    if(usuario.respuestas) {
      for(let i = 1; i <= 8; i++) {
        const preguntaKey = `pregunta_${i}`;
        if(usuario.respuestas[preguntaKey]) {
          userData[`Pregunta ${i} - Respuesta`] = usuario.respuestas[preguntaKey].respuesta;
          userData[`Pregunta ${i} - Puntos`] = usuario.respuestas[preguntaKey].puntos;
        } else {
          userData[`Pregunta ${i} - Respuesta`] = '';
          userData[`Pregunta ${i} - Puntos`] = '';
        }
      }
    }

    // Convertir a array para CSV
    const dataArray = [userData];
    
    // Crear el CSV con BOM UTF-8 para Excel
    const headers = Object.keys(userData);
    const csvContent = [
      headers.map(header => `"${header}"`).join(','),
      ...dataArray.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');
    
    const csvWithBOM = '\uFEFF' + csvContent;

    // Descargar el archivo
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const fileName = `respuestas_${usuario.nombre}_${usuario.apellido}_${moment().format("YYYY-MM-DD-HH-mm-ss")}.csv`;
    
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    configSnackbar.value = {
      message: `Respuestas de ${usuario.nombre} ${usuario.apellido} descargadas exitosamente`,
      type: "success",
      model: true
    };

  } catch (error) {
    console.error('Error al descargar respuestas del usuario:', error);
    configSnackbar.value = {
      message: "Error al descargar las respuestas del usuario",
      type: "error",
      model: true
    };
  }
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
    
    <VRow>
      <VCol
        cols="12"
        sm="12"
        lg="12"
      >
        <h1 class="mb-4">Usuarios del evento "Isla de la Tentación"</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;" >
          <div :class="'me-3 d-flex gap-4'+ (isFullLoading ? ' disabled' : '')">
            <VSelect
              :disabled="loadingRespuestas"
              class="bg-white"
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />

            <VSelect
              :disabled="loadingRespuestas"
              label="Tipo de búsqueda"
              item-text="title"
              style="min-width: 9rem;"
              item-value="value"
              class="bg-white"
              density="compact"
              v-model="tipoModel"
              variant="outlined"
              :items="['Ver todos los registros', 'Por Fecha']"
            />
            
            <AppDateTimePicker 
              v-if="tipoModel == 'Por Fecha' && !loadingRespuestas"
              clearable
              class="bg-white"
              style="width: 19rem;"
              label="Fecha de inicio y fin" 
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

            <VTextField
              clearable
              title="Buscar por correo, nombre, apellido o tipo de resultado"
              :disabled="loadingRespuestas"
              class="bg-white"
              v-model="searchQuery"
              label="Buscar por correo, nombre, apellido o tipo de resultado"
              prepend-inner-icon="mdi-magnify"
              single-line
              hide-details
              @input="buscarRespuestasDebounced" 
              @click:clear="buscarRespuestasDebounced"
              style="min-width: 18rem;"
            />
    
          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
            <VBtn
              :loading="isFullLoading"
              :disabled="isFullLoading || loadingRespuestas"
              variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share"
              @click="downloadSearch"
            >
              <span style="cursor:pointer" class="px-0 py-p m-0">Exportar listado</span>
            </VBtn>
            <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
              Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
            </small> 
          </div>
        </VCardText>

        <small v-if="tipoModel == 'Por Fecha'" class="text-disabled">
          Se ha filtrado respuestas desde {{fechaIFModel.fechai}} hasta {{fechaIFModel.fechaf}} con un total de {{totalRegistros}} registros
        </small>

        <!-- Gráfico de Barras Horizontal -->
        <VCard class="mt-4 mb-4">
          <VCardTitle class="d-flex align-center">
            <VIcon class="me-2" icon="mdi-chart-bar" />
            Gráfico de resultados
          </VCardTitle>
          <VCardText>
            <div v-if="loadingRespuestas" class="text-center py-8">
              <VProgressCircular indeterminate color="primary" />
              <p class="mt-2 text-disabled">Cargando estadísticas...</p>
            </div>
            
            <div v-else class="chart-container">
              <!-- Curioso -->
              <div class="chart-bar-item">
                <div class="chart-bar-track">
                  <div 
                    class="chart-bar-fill"
                    :style="{ 
                      width: Math.max(chartData.curioso.percentage, 10) + '%',
                      backgroundColor: getTipoResultadoColor('curioso')
                    }"
                  >
                    <div class="chart-bar-content">
                      <span class="chart-bar-label">{{ capitalizeText('curioso') }}</span>
                      <span class="chart-bar-stats">{{ chartData.curioso.count }} usuarios ({{ chartData.curioso.percentage.toFixed(1) }}%)</span>
                    </div>
                  </div>
                  <VBtn
                    v-if="chartData.curioso.count > 0"
                    title="Descargar usuarios con este resultado"
                    class="chart-download-btn"
                    icon
                    size="small"
                    color="default"
                    variant="text"
                    @click="downloadResultByType('curioso')"
                  >
                    <VIcon size="18" icon="tabler-user-down" />
                  </VBtn>
                </div>
              </div>

              <!-- Inquebrantable -->
              <div class="chart-bar-item">
                <div class="chart-bar-track">
                  <div 
                    class="chart-bar-fill"
                    :style="{ 
                      width: Math.max(chartData.inquebrantable.percentage, 10) + '%',
                      backgroundColor: getTipoResultadoColor('inquebrantable')
                    }"
                  >
                    <div class="chart-bar-content">
                      <span class="chart-bar-label">{{ capitalizeText('inquebrantable') }}</span>
                      <span class="chart-bar-stats">{{ chartData.inquebrantable.count }} usuarios ({{ chartData.inquebrantable.percentage.toFixed(1) }}%)</span>
                    </div>
                  </div>
                  <VBtn
                    v-if="chartData.inquebrantable.count > 0"
                    title="Descargar usuarios con este resultado"
                    class="chart-download-btn"
                    icon
                    size="small"
                    color="default"
                    variant="text"
                    @click="downloadResultByType('inquebrantable')"
                  >
                    <VIcon size="18" icon="tabler-user-down" />
                  </VBtn>
                </div>
              </div>

              <!-- Tentación -->
              <div class="chart-bar-item">
                <div class="chart-bar-track">
                  <div 
                    class="chart-bar-fill"
                    :style="{ 
                      width: Math.max(chartData.tentacion.percentage, 10) + '%',
                      backgroundColor: getTipoResultadoColor('tentacion')
                    }"
                  >
                    <div class="chart-bar-content">
                      <span class="chart-bar-label">{{ capitalizeText('tentacion') }}</span>
                      <span class="chart-bar-stats">{{ chartData.tentacion.count }} usuarios ({{ chartData.tentacion.percentage.toFixed(1) }}%)</span>
                    </div>
                  </div>
                  <VBtn
                    v-if="chartData.tentacion.count > 0"
                    title="Descargar usuarios con este resultado"
                    class="chart-download-btn"
                    icon
                    size="small"
                    color="default"
                    variant="text"
                    @click="downloadResultByType('tentacion')"
                  >
                    <VIcon size="18" icon="tabler-user-down" />
                  </VBtn>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
        
        <VCard class="mt-1">
            <VTable class="text-no-wrap">
              <!-- header -->
              <thead>
                <tr>
                  <th scope="col">
                    Participante
                  </th>
                  <th scope="col">
                    Fecha de Participación
                  </th>
                  <th scope="col">
                    Puntaje Total
                  </th>
                  <th scope="col">
                    Tipo de Resultado
                  </th>
                  <th scope="col">
                    Acciones
                  </th>
                </tr>
              </thead>
              <!-- cuerpo -->
              <tbody v-if="loadingRespuestas==false">
                <tr
                  v-for="respuesta in dataRespuestas"
                  :key="respuesta.id"
                  style="height: 3.75rem;"
                >
                  <!-- usuario-->
                  <td>
                    <div class="d-flex align-center">
                      <VAvatar
                        variant="tonal"
                        :style="{ backgroundColor: getTipoResultadoColor(respuesta.tipo_resultado) + '20', color: getTipoResultadoColor(respuesta.tipo_resultado) }"
                        class="me-3"
                        size="38"
                      > 
                        <span>{{ avatarText(`${respuesta.nombre} ${respuesta.apellido}`) }}</span>
                      </VAvatar>

                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                          {{ respuesta.nombre }} {{ respuesta.apellido }}
                        </h6>
                        <span class="text-sm text-disabled">{{ respuesta.email }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- fecha de llenado -->
                  <td>
                    <span class="text-base">{{ moment.utc(respuesta.fecha_participacion).format("DD/MM/YYYY HH:mm:ss") }}</span>
                  </td>

                  <!-- puntaje -->
                  <td>
                    <VChip
                      size="small"
                      variant="outlined"
                    >
                      {{ respuesta.puntaje_total }} puntos
                    </VChip>
                  </td>

                  <!-- tipo resultado -->
                  <td>
                    <VChip
                      :style="{ backgroundColor: getTipoResultadoColor(respuesta.tipo_resultado), color: 'white' }"
                      size="small"
                    >
                      {{ capitalizeText(respuesta.tipo_resultado) }}
                    </VChip>
                  </td>

                  <!-- acciones -->
                  <td
                    class="text-center"
                    style="width: 5rem;"
                  >
                    <VBtn
                      title="Descargar respuestas"
                      icon
                      size="x-small"
                      color="default"
                      variant="text"
                      @click="downloadUserResponses(respuesta)"
                    >
                      <VIcon
                        size="22"
                        icon="tabler-download"
                      />
                    </VBtn>
                  </td>
                </tr>
              </tbody>

              <!-- footer  -->
              <tfoot v-show="!dataRespuestas.length && loadingRespuestas == false">
                <tr>
                  <td
                    colspan="5"
                    class="text-center"
                  >
                    No hay datos que mostrar
                  </td>
                </tr>
              </tfoot>

              <tfoot v-show="loadingRespuestas">
                <tr>
                  <td
                    colspan="5"
                    class="text-center"
                  >
                    Cargando datos, por favor espere un momento...
                  </td>
                </tr>
              </tfoot>
            </VTable>
            <VDivider />

            <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
              <span class="text-sm text-disabled">
                {{ paginationData }}
              </span>

              <VPagination
                v-model="currentPage"
                size="small"
                :total-visible="5"
                :length="totalPage"
              />
            </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.bg-white .v-field{
  background-color: rgb(var(--v-theme-surface));
  border-radius: 6px;
}

.justify-content-flex-end{
  justify-content: flex-end;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.chart-container {
  padding: 1rem 0;
}

.chart-bar-item {
  margin-bottom: 2rem;
  position: relative;
}

.chart-bar-track {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  height: 60px;
  border-radius: 8px;
  overflow: visible;
  position: relative;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.chart-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.6s ease;
  min-width: 120px;
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-bar-content {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.chart-bar-label {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.2;
  text-transform: capitalize;
}

.chart-bar-stats {
  font-size: 0.75rem;
  opacity: 0.9;
  line-height: 1.2;
}

.chart-download-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  // background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  z-index: 10;
}

//.chart-download-btn:hover {
  //background-color: rgba(255, 255, 255, 1);
//}

@media (max-width: 768px) {
  .chart-container {
    padding: 0.5rem 0;
  }
  
  .chart-bar-track {
    height: 50px;
  }
  
  .chart-bar-fill {
    min-width: 100px;
  }
  
  .chart-bar-content {
    padding: 0 12px;
  }
  
  .chart-bar-label {
    font-size: 0.8rem;
  }
  
  .chart-bar-stats {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .chart-bar-track {
    height: 45px;
  }
  
  .chart-bar-fill {
    min-width: 90px;
  }
  
  .chart-bar-content {
    padding: 0 10px;
  }
  
  .chart-bar-label {
    font-size: 0.75rem;
  }
  
  .chart-bar-stats {
    font-size: 0.65rem;
  }
}
</style>