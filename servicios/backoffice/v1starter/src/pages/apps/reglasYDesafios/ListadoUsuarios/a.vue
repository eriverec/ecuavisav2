<script setup>
import { logAction } from '@/middleware/activityLogger';
import { avatarText } from '@core/utils/formatters';
import { parseISO } from 'date-fns';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";
import { onMounted, ref, watch, computed } from 'vue';

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
moment.tz.setDefault('America/Guayaquil');

const tipoModel = ref("Escoge una semana");
const tipoItems = ref(null);

const totalRegistros = ref(0);
const totalPaginado = ref(0);
const dataParticipantes = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const rowPerPage = ref(10);
const dataSemana = ref("");
const datasemanaCopy = ref("");
const selectRefDesafio = ref(null);
const isFullLoading = ref(false);

/*Variables de búsqueda*/
const modelSearch = ref(null);
const btnDisabled = ref({
  loading: false,
  disabled: false
});

/*nuevas variables*/
const semanasItems = ref([]);
const desafiosItems = ref([]);
const modelSemana = ref(null);
const semanaModelLoading = ref(true);
const searchSemanaModel = ref("");

/*DESAFIOS*/
const searchDesafioModel = ref(null)
const desafiosModel = ref(null);
const desafiosModelLoading = ref(false);

const loadingParticipantes = ref(false);
const fechaFin = moment().format("YYYY-MM-DD");
const fechaInicio = moment().subtract(30, 'days').format("YYYY-MM-DD");

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
const urlTitleExport = ref("semana_fecha");

const headersGlobal = ref({
  _id: "_id",
  wylexId: "wylexId",
  email: "email",
  first_name: "first_name",
  last_name: "last_name",
  avatar: "avatar",
  created_at: "created_at",
  country: "country",
  gender: "gender",
  birth_date: "birth_date",
  ciudad: "ciudad",
  telefono: "telefono",
  birthDate: "birthDate"
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

// Función para obtener las semanas
async function obtenerSemanas() {
  const url = 'https://servicio-desafios.vercel.app/semana/all/get';
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
    const datos = await respuesta.json();
    if (datos && datos.resp && Array.isArray(datos.data)) {
      return datos.data.map(item => ({
        title: item.titulo,
        value: item._id,
        desafios: item.desafios
      }));
    } else {
      throw new Error('La estructura de datos no es la esperada');
    }
  } catch (error) {
    console.error('Error al obtener las semanas:', error);
    return [];
  }
}

// Función para obtener los desafíos
async function obtenerDesafios(ids) {
  const url = 'https://servicio-desafios.vercel.app/desafios/search/ids';
  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
    const datos = await respuesta.json();
    if (datos && datos.resp && Array.isArray(datos.data)) {
      return datos.data.map(item => ({
        title: item.tituloDesafio,
        value: item._id
      }));
    } else {
      throw new Error('La estructura de datos no es la esperada');
    }
  } catch (error) {
    console.error('Error al obtener los desafíos:', error);
    return [];
  }
}

// 👉 watching current page
watch(currentPage, async () => {
  if (currentPage.value > totalPage.value) {
    currentPage.value = totalPage.value
  }
  await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value);
});

watch(rowPerPage, async () => {
  currentPage.value = 1;
  await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value);
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = dataParticipantes.value.length ? (currentPage.value) * rowPerPage.value : 0
  const lastIndex = dataParticipantes.value.length + (currentPage.value) * rowPerPage.value
  
  if(totalRegistros.value < rowPerPage.value){
    return `Mostrandos ${ totalRegistros.value } de ${ totalRegistros.value } registros `
  }
  return `Mostrando ${ firstIndex } de ${ totalRegistros.value } registros `
})

onMounted(async () => {
  semanaModelLoading.value = true;
  semanasItems.value = await obtenerSemanas();
  semanaModelLoading.value = false;
});

watch(modelSemana, async (newValue) => {
  if (newValue) {
    const semanaSeleccionada = semanasItems.value.find(semana => semana.value === newValue);
    if (semanaSeleccionada && semanaSeleccionada.desafios) {
      desafiosItems.value = await obtenerDesafios(semanaSeleccionada.desafios);
    }
  } else {
    desafiosItems.value = [];
  }
});

async function getParticipantes(page = 1, limit = 10, fechai, fechaf, idSemana, search="") {
  try {
    if(!idSemana){
      return false;
    }

    if(!desafiosModel.value && tipoModel.value == "Desafio"){
       configSnackbar.value = {
          message: "No se pudo seleccionar el desafío.",
          type: "error",
          model: true
      };
      return false;
    }
    loadingParticipantes.value = true;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    if(tipoModel.value == "Semana"){
      urlTitleExport.value = "semana_todos";
      urlApiExport.value = `https://servicio-desafios.vercel.app/grafico/exportar/participantes/all-registrados?idSemana=${idSemana}&search=${search}`;
    }

    if(tipoModel.value == "Desafio"){
      urlTitleExport.value = "semana_desafio";
      urlApiExport.value = `https://servicio-desafios.vercel.app/grafico/exportar/participantes/all-registrados-desafio?idSemana=${idSemana}&idDesafio=${desafiosModel.value}`;
    }
    
    var response = await fetch(`${urlApiExport.value}&page=${page}&limit=${limit}`, requestOptions);
    const data = await response.json();

    if(data.resp){
      dataParticipantes.value = data.data;
      totalRegistros.value = data.total;
      totalPage.value = Math.ceil(data.total / data.limit);
    }else{
      configSnackbar.value = {
          message: "No se pudo recuperar los participantes, recargue de nuevo.",
          type: "error",
          model: true
      };
      loadingParticipantes.value = false;
      return false;
    }
    loadingParticipantes.value = false;
  } catch (error) {
    configSnackbar.value = {
        message: "No se pudo recuperar los participantes, recargue de nuevo.",
        type: "error",
        model: true
    };
    loadingParticipantes.value = false;
    return console.error(error.message);
  }
}

watch(async () => searchSemanaModel.value, async () => {
  if (!searchSemanaModel.value) {
    dataSemana.value = datasemanaCopy.value;
  }else{
    dataSemana.value = datasemanaCopy.value.filter((c) => {
      return (c.title.toLowerCase().indexOf(searchSemanaModel.value.toLowerCase()) > -1) || c.value.indexOf(searchSemanaModel.value) > -1;
    });
  }
});

watch(selectRefDesafio, (active) => {
  if(!active){
    setTimeout(()=>{
      searchSemanaModel.value = "";
    }, 1000)
  }
});

watch(modelSemana, async () => {
  if(modelSemana.value){
    currentPage.value = 1;
    await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value);
  }
  await getDesafios();
});

const existeFecha = ref(true);

//Fechas
async function obtenerFechas(selectedDates, dateStr, instance) {
  if (selectedDates.length > 1) {
    desafiosModel.value = null;
    existeFecha.value = true;
    currentPage.value = 1;
    fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
    fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
    fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
    fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD')
    await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value);
  }

  if(selectedDates.length == 2){
    desafiosModel.value = null;
    fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
    fechaIFModel.value.fechasVModel = [selectedDates[1]];
    existeFecha.value = true;
  }

  if(selectedDates.length == 0){
    existeFecha.value = false;
    await getParticipantes(currentPage.value, rowPerPage.value, null, null, modelSemana.value);
  }
}

const docsExportNumberLength = ref({
  tamanioActual : 0,
  tamanioTotal : 0
});

const participantesFull = ref([]);

async function getParticipantesExportar(page = 1, limit = 10, fechai, fechaf, idSemana, search = "") {
  try {
    if(!idSemana){
      return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    var response = await fetch(`${urlApiExport.value}&page=${page}&limit=${limit}`, requestOptions);
    
    const data = await response.json();

    if(data.resp){
      return data;
    }else{
      configSnackbar.value = {
          message: "No se pudo recuperar los participantes, recargue de nuevo.",
          type: "error",
          model: true
      };
      isFullLoading.value = false;
      return null;
    }
  } catch (error) {
    configSnackbar.value = {
        message: "No se pudo recuperar los participantes, recargue de nuevo.",
        type: "error",
        model: true
    };
    console.error(error.message);
    isFullLoading.value = false;
    return null;
  }
}

function eliminarDuplicadosPorWylexId(array) {
  const vistos = new Set();
  return array.filter(item => {
    if (vistos.has(item.wylexId)) {
      return false; // Eliminar duplicado
    } else {
      vistos.add(item.wylexId);
      return true; // Mantener el primer encuentro
    }
  });
}

async function fetchFullParticipantes(){
  if(!modelSemana.value){
    configSnackbar.value = {
        message: "No se pudo recuperar los participantes, recargue de nuevo.",
        type: "error",
        model: true
    };
    return false;
  }

  docsExportNumberLength.value = {
    tamanioActual : 0,
    tamanioTotal : 0
  };

  participantesFull.value = [];

  var pages = 1;
  while(true){
    const res = await getParticipantesExportar(
      pages,
      500,
      fecha.value.inicio, 
      fecha.value.fin, 
      modelSemana.value,
      modelSearch.value || ""
    );

    const array = res.data;
    const totalParticipantes = res.total;

array.forEach((item) => {
      let newItem = {}; // Nuevo objeto para cada elemento de array
      // Recorremos las claves de headers
      for (let key in headersGlobal.value) {
        // Verificamos si la clave existe en item y la agregamos al nuevo objeto
        if (item.hasOwnProperty(key)) {
          newItem[key] = item[key];
        } else {
          newItem[key] = "";
        }
      }
      // Agregamos el nuevo objeto a participantesFull.value
      participantesFull.value.push(newItem);
    });

    docsExportNumberLength.value.tamanioActual = participantesFull.value.length;
    docsExportNumberLength.value.tamanioTotal = totalParticipantes;

    participantesFull.value.sort((a, b) => moment(b.created_at, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at, 'DD/MM/YYYY-HH:mm:ss')));

    pages++;

    if(array.length < 1){
      break;
    }
  }

  return true;
};

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

function generateSlug(text) {
  // Crear un mapa de caracteres con tilde y ñ a sus reemplazos
  const map = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
    'ñ': 'n', 'Ñ': 'N'
  };

  // Reemplazar cada carácter del mapa en el texto
  const slug = text.split('').map(char => map[char] || char).join('');

  // Convertir a minúsculas, eliminar caracteres no deseados y reemplazar espacios por guiones
  return slug.toLowerCase()
             .replace(/[^a-z0-9\s-]/g, '')
             .replace(/\s+/g, '-')
             .replace(/-+/g, '-') + "-" + moment().format("YYYY-MM-DD-HH-mm-ss");
}

async function downloadSearch () {
  try {
    if(dataParticipantes.value.length < 1){
       configSnackbar.value = {
          message: "No hay datos que exportar.",
          type: "error",
          model: true
      };
      return false;
    }
    isFullLoading.value = true;
    await fetchFullParticipantes();
    isFullLoading.value = false;

    let doc = participantesFull.value;
    var title = `${urlTitleExport.value}-`;

    if(urlTitleExport.value == "semana_fecha" || urlTitleExport.value == "semana_todos"){
      title += generateSlug(semanasItems.value.filter(c => modelSemana.value.includes(c.value))[0].title);
    }

    if(urlTitleExport.value == "semana_desafio"){
      title += generateSlug(desafiosItems.value.filter(c => desafiosModel.value == c.value)[0].title);
    }

    logAction('descarga-completa'); 

    exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

  } catch (error) {
    console.log(error)
    configSnackbar.value = {
      message: "No se pudo recuperar los datos de participantes, recargue de nuevo.",
      type: "error",
      model: true
    };
    return false;
  }
};

//Código para realizar la búsqueda
const buscarParticipante = async (e) => {
  const search = modelSearch.value || "";
  currentPage.value = 1;

  btnDisabled.value = {
    loading: true,
    disabled: true
  };

  if(!search){
    await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value, "");
  } else {
    await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value, search);
  }
  
  btnDisabled.value = {
    loading: false,
    disabled: false
  };
}

watch(modelSearch, async () => {
  if(!modelSearch.value){
    currentPage.value = 1;
    btnDisabled.value = {
      loading: true,
      disabled: true
    };

    await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value, "");
    
    btnDisabled.value = {
      loading: false,
      disabled: false
    };
  }
});

/*desafio*/
watch(async () => searchDesafioModel.value, async () => {
  if (!searchDesafioModel.value) {
    desafiosItems.value = desafiosItemsCopy.value;
  } else {
    desafiosItems.value = desafiosItemsCopy.value.filter((desafio) => {
      return (desafio.title.toLowerCase().indexOf(searchDesafioModel.value.toLowerCase()) > -1) || desafio.value.indexOf(searchDesafioModel.value) > -1;
    });
  }
});

watch(selectRefDesafio, (active) => {
  if(!active){
    setTimeout(()=>{
      searchDesafioModel.value = "";
    }, 1000)
  }
});

watch(desafiosModel, async () => {
  currentPage.value = 1;
  if(!desafiosModel.value){//Si es null
    if(existeFecha.value){
      fechaIFModel.value.fechasModel = optionsDefaultDate.fechasModel;
      await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value);
    } else {
      await getParticipantes(currentPage.value, rowPerPage.value, null, null, modelSemana.value);
    }
  } else {
    await getParticipantes(currentPage.value, rowPerPage.value, null, null, modelSemana.value);
  }
});

watch(tipoModel, async () => {
  currentPage.value = 1;
  if(tipoModel.value){
    if(tipoModel.value == "Desafio"){
      if(desafiosItems.value.length > 0){
        desafiosModel.value = desafiosItems.value[0].value;
      }
    }

    await getParticipantes(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelSemana.value);
  }
});
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
      <VCol cols="12" sm="12" lg="12">
        <h1>Exportación de participantes que han cumplido Desafíos por Semana</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;">
          <div class="me-3 d-flex gap-4" >
            <VSelect
              class="bg-white"
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />

            <VSelect
              style="width: 16rem;"
              class="bg-white"
              v-model:menu="selectRefDesafio"
              no-data-text="No existen semanas que mostrar"
              :disabled="semanaModelLoading"
              item-text="title"
              item-value="value"
              v-model="modelSemana" 
              :items="semanasItems"
              chips
              label="Seleccionar la semana de desafíos"
              :menu-props="{ maxHeight: '400' }">
              <template #selection="{ item }">
                <div>
                  {{ item.title }}
                </div>
              </template>
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      <p>_id: {{ item.value }}</p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </VSelect>

            <VSelect
              v-if="desafiosItems.length > 0"
              style="width: 16rem;"
              class="bg-white"
              v-model="desafiosModel"
              :items="desafiosItems"
              item-text="title"
              item-value="value"
              chips
              label="Seleccionar desafío"
              :menu-props="{ maxHeight: '400' }"
            />

            <VSelect 
              v-if="tipoModel=='Desafio'"
              style="width: 17rem;"
              class="bg-white"
              v-model:menu="selectRefDesafio"
              item-text="title"
              item-value="value"
              v-model="desafiosModel" 
              :items="desafiosItems"
              chips
              attach
              label="Desafíos de la semana"
              no-data-text="No existen desafíos que mostrar"
              :disabled="desafiosModelLoading"
              :menu-props="{ maxHeight: '300' }">
              <template v-slot:prepend-item>
                <v-list-item>
                  <v-list-item-content>
                    <VTextField v-model="searchDesafioModel" clearable placeholder="Buscar desafío"/>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
              <template #selection="{ item }">
                <div>
                  {{ item.title }} - {{ item.value }}
                </div>
              </template>
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      <p>_id: {{ item.value }}</p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </VSelect>
          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
            <VBtn
              :loading="isFullLoading"
              :disabled="isFullLoading || loadingParticipantes"
              variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share"
              @click="downloadSearch"
            >
              <span style="cursor:pointer" v-if="tipoModel=='Fecha'" class="px-0 py-p m-0">Exportar búsqueda</span>
              <span style="cursor:pointer" v-if="tipoModel=='Semana'" class="px-0 py-p m-0">Exportar semana</span>
              <span style="cursor:pointer" v-if="tipoModel=='Desafio'" class="px-0 py-p m-0">Exportar búsqueda</span>
            </VBtn>
            <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
              Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
            </small> 
          </div>
        </VCardText>

        <VRow class="pb-3 d-none">
    <VCol cols="12" sm="2" lg="2">
      <VRow>
        <VCol cols="10" sm="10" lg="10">
          <VTextField class="bg-white" v-model="modelSearch" label="Buscar...." type="text" clearable />
        </VCol>
        <VCol cols="2" sm="2" lg="2">
          <VBtn :loading="btnDisabled.loading" :disabled="btnDisabled.disabled" title="Buscar participante" block @click="buscarParticipante">
            <VIcon
              :size="25"
              icon="tabler-search"
            />
          </VBtn>
        </VCol>
      </VRow>
    </VCol>
    <VCol cols="3" sm="3" lg="3">
    </VCol>
  </VRow>

  <small v-if="!desafiosModel" class="text-disabled">Se ha filtrado participantes de <b>{{ 
      modelSemana ? (semanasItems.length > 0 ? semanasItems.filter(c => modelSemana.includes(c.value))[0].title : "") : ""
    }}</b>, desde {{fechaIFModel.fechai}} hasta {{fechaIFModel.fechaf}} con un total de {{totalRegistros}} registros
  </small>

  <small v-else class="text-disabled">Se ha filtrado participantes de la semana <b>{{ 
      modelSemana ? (semanasItems.length > 0 ? semanasItems.filter(c => modelSemana.includes(c.value))[0].title : "") : ""
    }}</b>, sobre el desafío <b>{{ desafiosItems.filter(c => desafiosModel == c.value)[0].title }}</b> con un total de {{totalRegistros}} registros
  </small>
  
  <VCard class="mt-1">
    <VTable class="text-no-wrap">
      <!-- 👉 table head -->
      <thead>
        <tr>
          <th scope="col">
            Nombres
          </th>
          <th scope="col">
            Fecha de nacimiento
          </th>
          <th scope="col">
            Teléfono
          </th>
          <th scope="col">
            Fecha de registro
          </th>
          <th scope="col">
            Ciudad
          </th>
          <th scope="col">
            Acciones
          </th>
        </tr>
      </thead>
      <!-- 👉 table body -->
      <tbody v-if="loadingParticipantes==false">
        <tr
          v-for="participante in dataParticipantes"
          :key="participante._id"
          style="height: 3.75rem;"
        >
          <!-- 👉 Participante -->
          <td>
            <div class="d-flex align-center">
              <VAvatar
                variant="tonal"
                color="success"
                class="me-3"
                size="38"
              >
                <VImg
                  v-if="participante.avatar"
                  :src="participante.avatar"
                />
                <span v-else>{{ avatarText(`${participante.first_name} ${participante.last_name}`) }}</span>
              </VAvatar>

              <div class="d-flex flex-column">
                <h6 class="text-base">
                  <RouterLink
                    :to="{ name: 'apps-user-view-id', params: { id: participante.wylexId } }"
                    class="font-weight-medium user-list-name"
                  >
                    {{ participante.first_name }} {{participante.last_name}}
                  </RouterLink>
                </h6>
                <span class="text-sm text-disabled">@{{ participante.email }}</span>
              </div>
            </div>
          </td>

          <!-- 👉 Fecha de nacimiento -->
          <td>
            <span class="text-base">{{ participante.birthDate }}</span>
          </td>

          <!-- 👉 Teléfono -->
          <td>
            <span class="text-base">{{ participante.telefono }}</span>
          </td>

          <!-- 👉 Fecha de registro -->
          <td>
            <span class="text-base">{{ moment(participante.created_at).format("YYYY-MM-DD HH:mm:ss") }}</span>
          </td>

          <!-- 👉 Ciudad -->
          <td>
            <span class="text-base">{{ participante.ciudad }}</span>
          </td>

          <!-- 👉 Actions -->
          <td
            class="text-center"
            style="width: 5rem;"
          >
            <VBtn
              icon
              size="x-small"
              color="default"
              variant="text"
              :to="{ name: 'apps-user-view-id', params: { id: participante.wylexId } }"
            >
              <VIcon
                size="22"
                icon="tabler-eye"
              />
            </VBtn>

            <VBtn
              disabled="true"
              icon
              size="x-small"
              color="default"
              variant="text"
            >
              <VIcon
                size="22"
                icon="tabler-trash"
              />
            </VBtn>

            <VBtn
              disabled="true"
              icon
              size="x-small"
              color="default"
              variant="text"
            >
              <VIcon
                size="22"
                icon="tabler-dots-vertical"
              />

              <VMenu activator="parent">
                <VList>
                  <VListItem
                    title="View"
                    :to="{ name: 'apps-user-view-id', params: { id: participante.wylexId } }"
                  />
                  <VListItem
                    title="Suspend"
                    href="javascript:void(0)"
                  />
                </VList>
              </VMenu>
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer  -->
      <tfoot v-show="!dataParticipantes.length && loadingParticipantes == false">
        <tr>
          <td
            colspan="7"
            class="text-center"
          >
            No hay datos que mostrar
          </td>
        </tr>
      </tfoot>

      <tfoot v-show="loadingParticipantes">
        <tr>
          <td
            colspan="7"
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
</template>

<style lang="scss">
.app-user-search-filter {
  /*inline-size: 31.6rem;*/
}

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