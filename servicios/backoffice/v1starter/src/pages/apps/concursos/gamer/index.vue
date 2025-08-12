<script setup>
import { logAction } from '@/middleware/activityLogger';
import { parseISO } from 'date-fns';
import debounce from 'lodash/debounce';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
moment.tz.setDefault('America/Guayaquil');

const tipoModel = ref("Por Fecha");
const tipoItems = ref(null);

// const limit = ref(10);
// const page = ref(1);
const totalRegistros = ref(0);
const totalPaginado = ref(0);
const dataParticipantes = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const rowPerPage = ref(10);
const modelCurso = ref(null);
const dataCurso = ref("");
const dataCursoCopy = ref("");
const selectRefModulo = ref(null);
const cursoModelLoading = ref(true);
const searchCursoModel = ref("");
const isFullLoading = ref(false);

/*Variables de búsqueda*/
const modelSearch = ref("");//
const btnDisabled = ref({
  loading: false,
  disabled: false
});
/*Variables de búsqueda*/

/*VIDEOS*/
const searchVideoModel = ref(null)
const selectRefVideo = ref(null);
const videosModel = ref(null);
const videosModelLoading = ref(false);
const videosItems = ref([]);
const videosItemsCopy = ref([]);
/*VIDEOS*/

const loadingModulo = ref(false);
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

const urlApiExport = ref("");
const urlTitleExport = ref("usuarios_gamer");
const dominioPrincipal = "https://concursos-usuarios.vercel.app/formulario-gamers";
// const dominioPrincipal = "http://localhost:8080/formulario-gamers/";

const headersGlobal = ref({
  _id: "_id",
  tipo: "registro",
  estado: "estado_registro",
  updated_at: "updated_at",
  created_at: "created_at",
  link_youtube: "link_youtube",
  nombres: "nombres",
  apellidos: "apellidos",
  contacto_celular: "contacto_celular",
  contacto_email: "contacto_email",
  genero: "genero",
  ciudad: "ciudad",
  edad: "edad",
  check_consentimiento: "check_consentimiento",
  check_politica_apto_juegos: "check_politica_apto_juegos",
  check_terminos_condiciones:"check_terminos_condiciones",
  created_at_formated:"created_at_formated",
  updated_at_formated:"updated_at_formated"
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

// 👉 watching current page

watch(currentPage, async () => {
  if (currentPage.value > totalPage.value) {
    currentPage.value = totalPage.value
  }
  await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
});

watch(rowPerPage, async () => {
  currentPage.value = 1;
  await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = dataParticipantes.value.length ? (currentPage.value) * rowPerPage.value : 0
  const lastIndex = dataParticipantes.value.length + (currentPage.value) * rowPerPage.value

  // return `Mostrando ${ firstIndex } de ${ lastIndex } de ${ totalRegistros.value } registros `
  // console.log(rowPerPage.value)
  if (totalRegistros.value < rowPerPage.value) {
    return `Mostrandos ${totalRegistros.value} de ${totalRegistros.value} registros `
  }
  return `Mostrando ${firstIndex} de ${totalRegistros.value} registros `
})

onMounted(async () => {
  // await getCursosAll();
  await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value, estado: estadoModel.value });
});

async function getParticipantes(json = {}) {
  let { page = 1, limit = 10, fechai = "", fechaf = "", search = "" } = json
  try {
    let estado = estadoModel.value;
    estado = estado === 'Todos' ? '' : `&estado=${estado}`;
    loadingModulo.value = true;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    // var response = null;

    if (tipoModel.value == "Por Fecha") {
      urlApiExport.value = `${dominioPrincipal}/backoffice/listado?fechai=${fechai}&fechaf=${fechaf}&search=${search}${estado}`;
      urlTitleExport.value = "concurso_GAMER_por_fecha";
      console.log(1)
    } else {
      urlApiExport.value = `${dominioPrincipal}/backoffice/listado?fechai=&fechaf=&search=${search}${estado}`;
      urlTitleExport.value = "concurso_GAMER";
      console.log(2)
    }

    var response = await fetch(`${urlApiExport.value}&page=${page}&limit=${limit}`, requestOptions);
    const data = await response.json();

    if (data.resp) {
      dataParticipantes.value = data.data;
      totalRegistros.value = parseInt(data.total);
      totalPage.value = Math.ceil(parseInt(data.total) / parseInt(data.limit));
    } else {
      configSnackbar.value = {
        message: "No se pudo recuperar los registros, recargue de nuevo.",
        type: "error",
        model: true
      };
      loadingModulo.value = false;
      return false;
    }
    loadingModulo.value = false;
  } catch (error) {
    configSnackbar.value = {
      message: "No se pudo recuperar los usuarios, recargue de nuevo.",
      type: "error",
      model: true
    };
    loadingModulo.value = false;
    return console.error(error.message);
  }
}

const existeFecha = ref(true);

//Fechas
async function obtenerFechas(selectedDates, dateStr, instance) {
  if (selectedDates.length > 1) {
    videosModel.value = null;
    existeFecha.value = true;
    currentPage.value = 1;
    fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
    fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY');
    fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
    fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD')
    await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
  }

  if (selectedDates.length == 2) {
    videosModel.value = null;
    fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
    fechaIFModel.value.fechasVModel = [selectedDates[1]];
    existeFecha.value = true;
  }

  if (selectedDates.length == 0) {
    existeFecha.value = false;
    await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: "", fechaf: "", search: modelSearch.value });
  }

}

const docsExportNumberLength = ref({
  tamanioActual: 0,
  tamanioTotal: 0
});

const usersFull = ref([]);

async function getParticipantesExportar(page = 1, limit = 10) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    var response = await fetch(`${urlApiExport.value}&page=${page}&limit=${limit}`, requestOptions);

    const data = await response.json();

    if (data.resp) {
      return data;
    } else {
      configSnackbar.value = {
        message: "No se pudo recuperar los participantes, recargue de nuevo.",
        type: "error",
        model: true
      };
      return null;
    }
  } catch (error) {
    configSnackbar.value = {
      message: "No se pudo recuperar los participantes, recargue de nuevo.",
      type: "error",
      model: true
    };
    console.error(error.message);
    return null;
  }
}

function eliminarDuplicadosPorWylexId(array) {
  const vistos = new Set();
  return array.filter(item => {
    if (vistos.has(item._id)) {
      return false; // Eliminar duplicado
    } else {
      vistos.add(item._id);
      return true; // Mantener el primer encuentro
    }
  });
}

async function fetchFullRegistros() {

  docsExportNumberLength.value = {
    tamanioActual: 0,
    tamanioTotal: 0
  };

  usersFull.value = [];

  var pages = 1;
  while (true) {
    const res = await getParticipantesExportar(
      pages,
      500
    );

    const array = res.data;
    const totalUser = res.total;

    array.forEach((item) => {
      let newItem = {};
      // Asignamos valores específicamente para cada cabecera
      let estadoText = estadoItems.value;

      newItem._id = item._id || "";
      newItem.tipo = item.tipo || "";
      newItem.estado = estadoText.find(e => e.value == item.estado)?.title || "";
      newItem.updated_at = item.updated_at || "";
      newItem.created_at = item.created_at || "";
      newItem.link_youtube = item.link_youtube || "";
      newItem.nombres = item.nombres || "";
      newItem.apellidos = item.apellidos || "";
      newItem.contacto_celular = item.contacto_celular || "";
      newItem.contacto_email = item.contacto_email || "";
      newItem.genero = item.genero || "";
      newItem.ciudad = item.ciudad || "";
      newItem.edad = item.edad || "";
      newItem.check_consentimiento = item.check_consentimiento == "1" ? "Si" : "No" || "Si";
      newItem.check_politica_apto_juegos = item.check_politica_apto_juegos == "1" ? "Si" : "No" || "Si";
      newItem.check_terminos_condiciones = item.check_terminos_condiciones == "1" ? "Si" : "No" || "Si";
      newItem.updated_at_formated = item.updated_at_formated || "";
      newItem.created_at_formated = item.created_at_formated || "";
      usersFull.value.push(newItem);
    });

    docsExportNumberLength.value.tamanioActual = usersFull.value.length;
    docsExportNumberLength.value.tamanioTotal = totalUser;

    usersFull.value.sort((a, b) => moment(b.created_at_campaign, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at_campaign, 'DD/MM/YYYY-HH:mm:ss')));

    pages++;

    if (array.length < 1) {
      break;
    }
  }

  return true;
};

function convertToCSV(objArray) {
  var array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      // Escapamos comillas dobles y envolvemos el valor en comillas
      let value = array[i][index] !== null ? array[i][index].toString() : "";
      value = value.replace(/"/g, '""'); // Escapar comillas dobles
      line += `"${value}"`; // Envolver valor
    }
    str += line + "\r\n";
  }

  return str;
}


function exportCSVFile(headers, items, fileTitle) {
  if (headers && items[0]._id !== "_id") {
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

function generateSlug(text) {
  // Crear un mapa de caracteres con tilde y ñ a sus reemplazos
  const map = {
    'á': 'a',
    'é': 'e',
    'í': 'i',
    'ó': 'o',
    'ú': 'u',
    'Á': 'A',
    'É': 'E',
    'Í': 'I',
    'Ó': 'O',
    'Ú': 'U',
    'ñ': 'n',
    'Ñ': 'N'
  };

  // Reemplazar cada carácter del mapa en el texto
  const slug = text.split('').map(char => map[char] || char).join('');

  // Convertir a minúsculas, eliminar caracteres no deseados y reemplazar espacios por guiones
  return slug.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres que no sean letras, números, espacios o guiones
    .replace(/\s+/g, '-')         // Reemplazar espacios por guiones
    .replace(/-+/g, '-') + "-" + moment().format("YYYY-MM-DD-HH-mm-ss");         // Reemplazar múltiples guiones por uno solo
}

async function downloadSearch() {
  try {

    if (dataParticipantes.value.length < 1) {
      configSnackbar.value = {
        message: "No hay datos que exportar.",
        type: "error",
        model: true
      };
      return false;
    }
    // loadingModulo.value = true;
    isFullLoading.value = true;
    await fetchFullRegistros();
    isFullLoading.value = false;
    // loadingModulo.value = false;

    let doc = [];
    doc = usersFull.value
    var title = `${urlTitleExport.value}`;

    logAction('descarga-completa-formulario-gamer');

    exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

  } catch (error) {
    console.log(error)
    configSnackbar.value = {
      message: "No se pudo recuperar los datos de los participantes, recargue de nuevo {{downloadSearch}}.",
      type: "error",
      model: true
    };
    isFullLoading.value = false;
    // loadingModulo.value = false;
    return false;
  }
};

watch(tipoModel, async () => {
  currentPage.value = 1;
  if (tipoModel.value) {
    await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
  }
});

/*video*/

/****************************************************************/
/****************************************************************/
// INICIO BUSCADOR
/****************************************************************/
/****************************************************************/

const searchQuery = ref('');

// Función para realizar la consulta
const buscarUsuarios = async () => {
  try {
    modelSearch.value = searchQuery.value?.toLowerCase();
    //disabledPagination.value = true;
    currentPage.value = 1;
    await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
    //disabledPagination.value = false;
  } catch (error) {
    console.error("Error en buscarUsuarios:", error);
    configSnackbar.value = {
      message: "No se pudo recuperar los datos de los participantes al realizar la búsqueda, recargue de nuevo.",
      type: "error",
      model: true
    };
    return null;
  }
};

// Crear una función con debounce
const buscarUsuariosDebounced = debounce(buscarUsuarios, 500); // 500ms de retraso

/****************************************************************/
/****************************************************************/
// FIN BUSCADOR
/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/
// INICIO CÓDIGO DE ELIMINAR
/****************************************************************/
/****************************************************************/
const isDialogVisibleDelete = ref(false);
const idUserCampaign = ref(false);
const disabledViewList = ref(false);
const idUserListModel = ref({});
// Función para manejar el cambio de paginación
const eliminarRegistro = async (id) => {
  isDialogVisibleDelete.value = true;
  idUserCampaign.value = id;
  // console.log(id)
};

const eliminarRegistroSi = async () => {
  try {
    if (!idUserCampaign.value) {
      configSnackbar.value = {
        message: "Id no especificado para eliminar",
        type: "error",
        model: true
      };
      return false;
    }
    disabledViewList.value = true;
    isFullLoading.value = true;
    idUserListModel.value[idUserCampaign.value] = true;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    var response = await fetch(`${dominioPrincipal}/backoffice/delete-concurso/${idUserCampaign.value}`, requestOptions);
    const data = await response.json();

    if (data.resp) {
      currentPage.value = 1;
      await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
    } else {
      configSnackbar.value = {
        message: "No se pudo eliminar el registro, intente de nuevo",
        type: "error",
        model: true
      };
    }

    idUserCampaign.value = null;
    isFullLoading.value = false;
    disabledViewList.value = false;
    idUserListModel.value[idUserCampaign.value] = false;
    isDialogVisibleDelete.value = false;
    return true;
  } catch (error) {
    configSnackbar.value = {
      message: "No se pudo eliminar el registro, intente de nuevo",
      type: "error",
      model: true
    };

    isFullLoading.value = false;
    idUserListModel.value[idUserCampaign.value] = false;
    isDialogVisibleDelete.value = false;
    disabledViewList.value = false;

    return console.error(error.message);
  }
};

/****************************************************************/
/****************************************************************/
// FIN CÓDIGO DE ELIMINAR
/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/
// CÓDIGO PARA CAMBIAR EL ESTADO
/****************************************************************/
/****************************************************************/

const btnEstadoModel = ref([]);
const btnEstadoLoading = ref([]);
const btnEstadoDisabled = ref(false);

const actualizarEstado = async (id, status) => {
  try {
    const userBackoffice = JSON.parse(localStorage.getItem('userData'));
    if (!id) {
      configSnackbar.value = {
        message: "Id no especificado para eliminar",
        type: "error",
        model: true
      };
      return false;
    }

    btnEstadoDisabled.value = true;
    btnEstadoLoading.value[id] = true;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestData = {
      "status": status,
      "user": userBackoffice.email || ''
    };

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(requestData),
      redirect: 'follow'
    };

    var response = await fetch(`${dominioPrincipal}/backoffice/update-status-concurso/${id}`, requestOptions);
    const data = await response.json();

    if (data.resp) {
      currentPage.value = 1;
      await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
    } else {
      configSnackbar.value = {
        message: "No se pudo eliminar el registro, intente de nuevo",
        type: "error",
        model: true
      };
    }

    btnEstadoDisabled.value = false;
    btnEstadoLoading.value[id] = false;
    return true;
  } catch (error) {
    configSnackbar.value = {
      message: "No se pudo eliminar el registro, intente de nuevo",
      type: "error",
      model: true
    };

    btnEstadoDisabled.value = false;
    btnEstadoLoading.value[id] = false;

    return console.error(error.message);
  }
};

/****************************************************************/
/****************************************************************/
// FIN CÓDIGO PARA CAMBIAR EL ESTADO
/****************************************************************/
/****************************************************************/
const estadoModel = ref('Todos');
const estadoItems = ref([{title: 'Todos', value: 'Todos'}, {title: 'No revisado', value: '0'}, {title: 'Revisado, aprobado', value: '1'}, {title: 'Rechazado', value: '2'}]);
watch(estadoModel, async () => {
  currentPage.value = 1;
  if (estadoModel.value) {
    await getParticipantes({ page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value });
  }
});
</script>

<template>
  <section>
    <VDialog v-model="isDialogVisibleDelete" persistent class="v-dialog-sm">

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn color="secondary" variant="tonal" @click="isDialogVisibleDelete = false">
            No, Cerrar
          </VBtn>
          <VBtn @click="eliminarRegistroSi" :loading="disabledViewList" :disabled="disabledViewList">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat"
      :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>
    <VRow>
      <VCol cols="12" sm="12" lg="12">
        <h1>
          Registrados, gamers
        </h1>
        <!-- <small class="mb-4 d-block">
          "Formulario de registro Juegos"
        </small> -->
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;">
          <div :class="'me-3 d-flex gap-4 flex-wrap' + (isFullLoading ? ' disabled' : '')">
            <VSelect :disabled="loadingModulo" class="bg-white" v-model="rowPerPage" density="compact"
              variant="outlined" :items="[10, 20, 30, 50]" />

            <VSelect :disabled="loadingModulo" label="Mostrar" item-text="title" style="min-width: 9rem;"
              item-value="value" class="bg-white" density="compact" v-model="tipoModel" variant="outlined"
              :items="['Todos los registros', 'Por Fecha']" />

            <AppDateTimePicker v-if="tipoModel == 'Por Fecha' && !loadingModulo" clearable class="bg-white"
              style="width: 19rem;" label="Buscar por fecha de registro" prepend-inner-icon="tabler-calendar"
              density="compact" v-model="fechaIFModel.fechasModel" show-current=true @on-change="obtenerFechas" :config="{
                position: 'auto right',
                mode: 'range',
                altFormat: 'd F j, Y',
                maxDate: new Date,
                dateFormat: 'l, j \\d\\e F \\d\\e Y',
                valueFormat: 'd-m-Y',
                reactive: true
              }" />

            <VSelect :disabled="loadingModulo" label="Buscar por revisón" item-text="title" style="min-width: 9rem;"
              item-value="value" class="bg-white d-none" density="compact" v-model="estadoModel" variant="outlined"
              :items="estadoItems" />

            <VTextField
                clearable
                title="Buscar por nombres"
                :disabled="loadingModulo"
                class="bg-white"
                v-model="searchQuery"
                label="Buscar por nombres"
                prepend-inner-icon="mdi-magnify"
                single-line
                hide-details
                @input="buscarUsuariosDebounced" 
                @click:clear="buscarUsuariosDebounced"
                style="min-width: 16rem;"
              />

          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
            <!-- 👉 Search  -->


            <!-- 👉 Export button -->
            <VBtn 
            title="Exportar registros según los filtros aplicados"
            :loading="isFullLoading" 
            :disabled="isFullLoading || loadingModulo" variant="tonal" color="success"
              prepend-icon="tabler-screen-share" @click="downloadSearch">
              <span style="cursor:pointer" class="px-0 py-p m-0">Exportar</span>
            </VBtn>
            <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
              Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }}
              registros
            </small>
          </div>
        </VCardText>


        <!-- 👉 Add user button -->

        <small v-if="tipoModel == 'Por Fecha'" class="text-disabled">Se ha filtrado <b>{{
          modelCurso ? (dataCurso.length > 0 ? dataCurso.filter(c => modelCurso.includes(c.value))[0].title : "") : ""
        }}</b> , desde {{ fechaIFModel.fechai }} hasta {{ fechaIFModel.fechaf }} con un total de {{ totalRegistros }}
          registros
        </small>

        <VCard class="mt-1">
          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <!-- <th scope="col" title="Nombre de la unidad educativa">
                  <div class="d-flex flex-column">
                    Documentación revisada
                    <div class="d-flex" style="align-items: center;">
                      <VIcon icon="tabler-click" color="disabled" size="15" />
                      <small class="text-disabled" style="line-height: 1;">Click para cambiar el estado</small>
                    </div>
                  </div>
                </th> -->
                <th scope="col" title="Nombres">
                  Nombres
                </th>
                <th scope="col" title="Apellidos">
                  Apellidos
                </th>
                <th scope="col" title="Género">
                  Género
                </th>
                <th scope="col" title="Edad">
                  Edad
                </th>
                <th scope="col" title="E-mail de contacto">
                  E-mail
                </th>
                <!-- <th scope="col" title="Link del DEMO(YouTube)">
                  Link del DEMO(YouTube)
                </th> -->
                <th scope="col">
                  Fecha de registro
                </th>
                <th scope="col">
                  Fecha de actualización
                </th>
                <th scope="col">
                  Acciones
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody v-if="loadingModulo == false">
              <tr v-for="registro in dataParticipantes" :key="registro._id" style="height: 3.75rem;">

                <!-- <td>
                  <div class="d-flex flex-column gap-0 align-center py-2" title="Click para cambiar de estado">
                    <VBtn
                      v-model="btnEstadoModel[registro._id]"
                      :loading="btnEstadoLoading[registro._id]"
                      :disabled="btnEstadoDisabled"
                      :icon="registro.estado == '1' ? 'tabler-toggle-right' : 'tabler-toggle-left'"
                      :color="registro.estado == '1' ? 'success' : (registro.estado == '2' ? 'error' : 'warning')"
                      variant="text"
                      class="px-0 py-0 d-block"
                      style="margin-bottom: -12px;"
                      @click="actualizarEstado(registro._id, registro.estado == '1' ? '2' : '1')"
                    />

                    <small v-if="registro.estado == '0'">No revisado</small>
                    <small v-if="registro.estado == '1'">Revisado, aprobado</small>
                    <small v-if="registro.estado == '2'">Rechazado</small>
                  </div>
                </td> -->

                <td>
                  <span class="text-base">{{ registro.nombres }}</span>
                </td>

                <td>
                  <span class="text-base">{{ registro.apellidos }}</span>
                </td>

                <td>
                  <span class="text-base">{{ registro.genero }}</span>
                </td>

                <td>
                  <span class="text-base">{{ registro.edad }}</span>
                </td>

                <td>
                  <span class="text-base">{{ registro.contacto_email }}</span>
                </td>

                <!-- <td>
                  <span class="text-base">{{ registro.link_youtube }}</span>
                </td> -->

                <td>
                  <span class="text-base">{{ moment(registro.created_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
                </td>

                <td>
                  <span class="text-base">{{ moment(registro.updated_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
                </td>


                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem;">
                  <VBtn
                    icon
                    variant="plain"
                    color="default"
                    size="x-small"
                    :title="registro.institucion_nombre"
                    v-model="idUserListModel[registro._id]"
                  >
                    <VIcon
                      :size="22"
                      icon="tabler-dots-vertical"
                    />
                    <VMenu activator="parent">
                      <VList density="compact">
                        <VListItem
                          :href="registro.link_youtube"
                          target="_blank"
                        >
                          <VIcon size="18" class="mr-1" icon="mdi-link" />
                          Ver DEMO (YouTube o Drive) 
                        </VListItem>
                        <VDivider />
                        <VListItem
                          href="#"
                          @click="eliminarRegistro(registro._id)"
                        >
                          <VIcon size="18" class="mr-1" color="error" icon="mdi-trash-can-outline" />
                          Eliminar registro
                        </VListItem>
                      </VList>
                    </VMenu>
                  </VBtn>

                  <VBtn disabled="true" icon size="x-small" color="default" variant="text" class="d-none">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem title="View" :to="{ name: 'apps-user-view-id', params: { id: registro._id } }" />
                        <VListItem title="Suspend" href="javascript:void(0)" />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!dataParticipantes.length && loadingModulo == false">
              <tr>
                <td colspan="9" class="text-center">
                  No hay datos que mostrar
                </td>
              </tr>
            </tfoot>

            <tfoot v-show="loadingModulo">
              <tr>
                <td colspan="9" class="text-center">
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

            <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>
<style lang="scss">
// .app-user-search-filter {
//   inline-size: 31.6rem;
// }

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.bg-white .v-field {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 6px;
}

.justify-content-flex-end {
  justify-content: flex-end;
}
</style>
