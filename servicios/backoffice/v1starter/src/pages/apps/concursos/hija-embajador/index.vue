<script setup>
  import { logAction } from '@/middleware/activityLogger';
import { avatarText } from '@core/utils/formatters';
import { parseISO } from 'date-fns';
import debounce from 'lodash/debounce';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  moment.tz.setDefault('America/Guayaquil');

  const tipoModel = ref("Ver todos los registros");
  const tipoItems = ref(null);

  // const limit = ref(10);
  // const page = ref(1);
  const totalRegistros = ref(0);
  const totalPaginado = ref(0);
  const dataUsuarios = ref([]);
  const currentPage = ref(1);
  const totalPage = ref(0);
  const rowPerPage = ref(10);
  const modelCurso = ref(null);
  const dataCurso = ref("");
  const dataCursoCopy = ref("");
  const selectRefModulo = ref(null);
  const cursoModelLoading = ref(true);
  const searchCursoModel  = ref("");
  const isFullLoading = ref(false);

  /*Variables de búsqueda*/
  const modelSearch = ref("");//
  const btnDisabled = ref({
    loading: false,
    disabled:false
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

  const loadingUsuarios = ref(false);
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
  const urlTitleExport = ref("usuarios_hija_embajador");

  const headersGlobal = ref({
    _id: "_id",
    wylexId: "wylexId",
    site: "site",
    site_id: "site_id",
    email: "email",
    first_name: "first_name",
    last_name: "last_name",
    avatar: "avatar",
    logged_at: "logged_at",
    logged_at_site: "logged_at_site",
    updated_at: "updated_at",
    validated_at: "validated_at",
    banned_at: "banned_at",
    country: "country",
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
    created_at: "created_at",
    created_at_campaign:"created_at_campaign",
    ciudad:"ciudad",
    telefono:"telefono",
    // birthDate:"birthDate"
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
    if (currentPage.value > totalPage.value){
      currentPage.value = totalPage.value
    }
    await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf:fecha.value.fin, search:modelSearch.value});
  });

  watch(rowPerPage, async () => {
    currentPage.value = 1;
    await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf:fecha.value.fin, search:modelSearch.value});
  });

  // 👉 Computing pagination data
  const paginationData = computed(() => {
    const firstIndex = dataUsuarios.value.length ? (currentPage.value) * rowPerPage.value : 0
    const lastIndex = dataUsuarios.value.length + (currentPage.value) * rowPerPage.value
    
    // return `Mostrando ${ firstIndex } de ${ lastIndex } de ${ totalRegistros.value } registros `
    // console.log(rowPerPage.value)
    if(totalRegistros.value < rowPerPage.value){
      return `Mostrandos ${ totalRegistros.value } de ${ totalRegistros.value } registros `
    }
    return `Mostrando ${ firstIndex } de ${ totalRegistros.value } registros `
  })

  onMounted(async () => {
    // await getCursosAll();
    await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf:fecha.value.fin, search:modelSearch.value});
  });

  async function getUsuarios(json = {}) {
    const { page = 1, limit = 10, fechai = "", fechaf = "", search = "" } = json
    try {

      loadingUsuarios.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      // var response = null;

      if(tipoModel.value == "Por Fecha"){
        urlApiExport.value = `https://usuarios-backoffice.vercel.app/campaign-landings/all-users/hija_embajador?fechai=${fechai}&fechaf=${fechaf}&search=${search}`;
        urlTitleExport.value = "usuarios_hija_embajador_por_fecha";
        console.log(1)
      }else{
        urlApiExport.value = `https://usuarios-backoffice.vercel.app/campaign-landings/all-users/hija_embajador?fechai=&fechaf=&search=${search}`;
        urlTitleExport.value = "usuarios_hija_embajador";
        console.log(2)
      }
      
      var response = await fetch(`${urlApiExport.value}&page=${page}&limit=${limit}`, requestOptions);
      const data = await response.json();

      if(data.resp){
        dataUsuarios.value = data.data;
        totalRegistros.value = data.total;
        totalPage.value = Math.ceil(data.total / data.limit);
      }else{
        configSnackbar.value = {
            message: "No se pudo recuperar los usuarios, recargue de nuevo.",
            type: "error",
            model: true
        };
        loadingUsuarios.value = false;
        return false;
      }
      loadingUsuarios.value = false;
    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los usuarios, recargue de nuevo.",
          type: "error",
          model: true
      };
      loadingUsuarios.value = false;
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
        await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf: fecha.value.fin, search: modelSearch.value});
      }

      if(selectedDates.length == 2){
        videosModel.value = null;
        fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
        fechaIFModel.value.fechasVModel = [selectedDates[1]];
        existeFecha.value = true;
      }

      if(selectedDates.length == 0){
        existeFecha.value = false;
        await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: "", fechaf: "", search: modelSearch.value});
      }

  }

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

  async function fetchFullUsers(){

    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    usersFull.value = [];

    var pages = 1;
    while(true){
      const res = await getUsuariosExportar(
        pages,
        500
      );

      const array = res.data;
      const totalUser = res.total;

      array.forEach((registro) => {
        const item = registro.user;
        let newItem = {}; // Nuevo objeto para cada elemento de array
        // Recorremos las claves de headers
        for (let key in headersGlobal.value) {
          // Verificamos si la clave existe en item y la agregamos al nuevo objeto
          if (item.hasOwnProperty(key)) {
            newItem[key] = item[key];
          }else{
            if(key == "created_at_campaign"){
              newItem[key] = registro.created_at_campaign;
            }else{
              newItem[key] = "";
            }
          }
        }
        // Agregamos el nuevo objeto a usersFull.value
        usersFull.value.push(newItem);
      });

      docsExportNumberLength.value.tamanioActual = usersFull.value.length;
      docsExportNumberLength.value.tamanioTotal = totalUser;

      usersFull.value.sort((a, b) => moment(b.created_at_campaign, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at_campaign, 'DD/MM/YYYY-HH:mm:ss')));

      pages++;

      if(array.length < 1){
        break;
      }
    }

    // for (let i = 1; i < pages + 1; i++) {
      // {
      //   todaBase: 1,
      //   pageSize: rowPerPageExport.value,
      //   page: i,
      //   query: "",
      //   provider: "",
      //   news: "",
      //   sort: (sortDesc.value?-1:1),
      //   columnSort: "",
      //   fechai: "",
      //   fechaf: "",
      // }

      
    // }

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
                 .replace(/-+/g, '-')+"-"+moment().format("YYYY-MM-DD-HH-mm-ss");         // Reemplazar múltiples guiones por uno solo
  }

  async function downloadSearch() {
    try {
      
      if(dataUsuarios.value.length < 1){
         configSnackbar.value = {
            message: "No hay datos que exportar.",
            type: "error",
            model: true
        };
        return false;
      }
      // loadingUsuarios.value = true;
      isFullLoading.value=true;
      await fetchFullUsers();
      isFullLoading.value=false;
      // loadingUsuarios.value = false;

      let doc = [];
      doc = usersFull.value
      var title = `${urlTitleExport.value}`;

      logAction('descarga-completa-usuarios-hija-embajador'); 

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

  watch(tipoModel, async () => {
    currentPage.value = 1;
    if(tipoModel.value){
      await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf:fecha.value.fin, search:modelSearch.value});
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
    await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf:fecha.value.fin, search:modelSearch.value});
    //disabledPagination.value = false;
  } catch (error) {
    console.error("Error en buscarUsuarios:", error);
    configSnackbar.value = {
        message: "No se pudo recuperar los datos de usuario al realizar la búsqueda, recargue de nuevo.",
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
      if(!idUserCampaign.value){
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

      var response = await fetch(`https://usuarios-backoffice.vercel.app/campaign-landings/delete-user/${idUserCampaign.value}/hija_embajador`, requestOptions);
      const data = await response.json();

      if(data.resp){
        currentPage.value = 1;
        await getUsuarios({page: currentPage.value, limit: rowPerPage.value, fechai: fecha.value.inicio, fechaf:fecha.value.fin, search:modelSearch.value});
      }else{
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
</script>

<template>
  <section>
    <VDialog
      v-model="isDialogVisibleDelete"
      persistent
      class="v-dialog-sm"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisibleDelete = false"
          >
            No, Cerrar
          </VBtn>
          <VBtn @click="eliminarRegistroSi" :loading="disabledViewList" :disabled="disabledViewList">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
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
        <h1 class="mb-4">Usuarios registrados para la campaña "La Hija del Embajador"</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;" >
          <div :class="'me-3 d-flex gap-4'+ (isFullLoading ? ' disabled' : '')">
            <VSelect
              :disabled="loadingUsuarios"
              class="bg-white"
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />

            <VSelect
              :disabled="loadingUsuarios"
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
              v-if="tipoModel == 'Por Fecha' && !loadingUsuarios"
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

            <VTextField
              clearable
              title="Buscar por correo, email, apellido, teléfono o cédula"
              :disabled="loadingUsuarios"
              class="bg-white"
              v-model="searchQuery"
              label="Buscar por correo, email, apellido, teléfono o cédula"
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
              :loading="isFullLoading"
              :disabled="isFullLoading || loadingUsuarios"
              variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share"
              @click="downloadSearch"
            >
              <span style="cursor:pointer" class="px-0 py-p m-0">Exportar usuarios</span>
            </VBtn>
            <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
              Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
            </small> 
          </div>
        </VCardText>


        <!-- 👉 Add user button -->

        <small v-if="tipoModel == 'Por Fecha'" class="text-disabled">Se ha filtrado usuarios <b>{{ 
            modelCurso? (dataCurso.length > 0 ? dataCurso.filter(c => modelCurso.includes(c.value))[0].title: "" ) :""
          }}</b> , desde {{fechaIFModel.fechai}} hasta {{fechaIFModel.fechaf}} con un total de {{totalRegistros}} registros
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
              <tbody v-if="loadingUsuarios==false">
                <tr
                  v-for="registro in dataUsuarios"
                  :key="registro.user._id"
                  style="height: 3.75rem;"
                >
                  <!-- 👉 User -->
                  <td>
                    <div class="d-flex align-center">
                      <VAvatar
                        variant="tonal"
                        color="success"
                        class="me-3"
                        size="38"
                      > 
                        <VImg
                          v-if="registro.user.avatar"
                          :src="registro.user.avatar"
                        />
                        <span v-else>{{ avatarText(`${registro.user.first_name} ${registro.user.last_name}`) }}</span>
                      </VAvatar>

                      <div class="d-flex flex-column">
                        <h6 class="text-base" title="Ver detalles del usuario">
                          <RouterLink
                            :to="{ name: 'apps-user-view-id', params: { id: registro.user.wylexId } }"
                            class="font-weight-medium user-list-name"
                          >
                            {{ registro.user.first_name }} {{registro.user.last_name}}
                          </RouterLink>
                        </h6>
                        <span class="text-sm text-disabled">{{ registro.user.email }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- 👉 Fecha de nacimiento -->
                  <td>
                    <span class="text-base">{{ registro.user.birth_date }}</span>
                  </td>

                  <!-- 👉 Teléfono -->
                  <td>
                    <span class="text-base">{{ registro.user.phone_number || registro.user.telefono }}</span>
                  </td>

                  <!-- 👉 Fecha de registro -->
                  <td>
                    <span class="text-base">{{ moment(registro.created_at_campaign).format("YYYY-MM-DD HH:mm:ss") }}</span>
                  </td>

                  <!-- 👉 Ciudad -->
                  <td>
                    <span class="text-base">{{ registro.user.ciudad }}</span>
                  </td>

                  <!-- 👉 Actions -->
                  <td
                    class="text-center"
                    style="width: 5rem;"
                  >
                    <VBtn
                      title="Ver detalles del usuario"
                      icon
                      size="x-small"
                      color="default"
                      variant="text"
                      :to="{ name: 'apps-user-view-id', params: { id: registro.user.wylexId } }"
                    >
                      <VIcon
                        size="22"
                        icon="tabler-eye"
                      />
                    </VBtn>

                    <VBtn
                    title="Eliminar registro"
                      icon
                      size="x-small"
                      color="default"
                      variant="text"
                      v-model="idUserListModel[registro.user.wylexId]"
                      @click="eliminarRegistro(registro.user.wylexId)"
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
                      class="d-none"
                    >
                      <VIcon
                        size="22"
                        icon="tabler-dots-vertical"
                      />

                      <VMenu activator="parent">
                        <VList>
                          <VListItem
                            title="View"
                            :to="{ name: 'apps-user-view-id', params: { id: registro.user.wylexId } }"
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
              <tfoot v-show="!dataUsuarios.length && loadingUsuarios == false">
                <tr>
                  <td
                    colspan="7"
                    class="text-center"
                  >
                    No hay datos que mostrar
                  </td>
                </tr>
              </tfoot>

              <tfoot v-show="loadingUsuarios">
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

  .bg-white .v-field{
    background-color: rgb(var(--v-theme-surface));
    border-radius: 6px;
  }

  .justify-content-flex-end{
    justify-content: flex-end;
  }
</style>
