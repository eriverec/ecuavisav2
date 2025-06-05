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

// 👉 watching current page
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
              <span style="cursor:pointer" class="px-0 py-p m-0">Exportar respuestas</span>
            </VBtn>
            <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
              Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
            </small> 
          </div>
        </VCardText>

        <small v-if="tipoModel == 'Por Fecha'" class="text-disabled">
          Se ha filtrado respuestas desde {{fechaIFModel.fechai}} hasta {{fechaIFModel.fechaf}} con un total de {{totalRegistros}} registros
        </small>
        
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
</style>