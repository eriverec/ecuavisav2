<script setup>
import { logAction } from '@/middleware/activityLogger';
import { avatarText } from '@core/utils/formatters';
import { parseISO } from 'date-fns';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";
import { onMounted, ref, watch } from 'vue';

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  moment.tz.setDefault('America/Guayaquil');



  const tipoModel = ref("Escoge una semana");
  const tipoItems = ref(null);

  // const limit = ref(10);
  // const page = ref(1);
  const totalRegistros = ref(0);
  const totalPaginado = ref(0);
  const dataUsuarios = ref([]);
  const currentPage = ref(1);
  const totalPage = ref(0);
  const rowPerPage = ref(10);
  // const modelCurso = ref(null);
  const dataCurso = ref("");
  const dataCursoCopy = ref("");
  const selectRefModulo = ref(null);
  // const cursoModelLoading = ref(true);
  // const searchCursoModel  = ref("");
  const isFullLoading = ref(false);

  /*Variables de búsqueda*/
  const modelSearch = ref(null);
  const btnDisabled = ref({
    loading: false,
    disabled:false
  });
  /*Variables de búsqueda*/

  /*nuevas variables julio 30*/

const semanasItems = ref([]);
const desafiosItems = ref([]);
const modelCurso = ref(null);
const cursoModelLoading = ref(true);
const searchCursoModel = ref("");

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
  const urlTitleExport = ref("curso_fecha");

  const headersGlobal = ref({
    _id: "_id",
    wylexId: "wylexId",
    site: "site",
    site_id: "site_id",
    email: "email",
    first_name: "first_name",
    last_name: "last_name",
    avatar: "avatar",
    created_at: "created_at",
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
    created_at_suscriber_course:"created_at_suscriber_course",
    ciudad:"ciudad",
    telefono:"telefono",
    birthDate:"birthDate"
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

//NUEVO JULIO 30
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
    if (currentPage.value > totalPage.value){
      currentPage.value = totalPage.value
    }
    await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
  });

  watch(rowPerPage, async () => {
    currentPage.value = 1;
    await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
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
  cursoModelLoading.value = true;
  semanasItems.value = await obtenerSemanas();
  cursoModelLoading.value = false;
});

  
  watch(modelCurso, async (newValue) => {
  if (newValue) {
    currentPage.value = 1;
    const semanaSeleccionada = semanasItems.value.find(semana => semana.value === newValue);
    if (semanaSeleccionada && semanaSeleccionada.desafios) {
      desafiosItems.value = await obtenerDesafios(semanaSeleccionada.desafios);
    }
    await getUsuarios(currentPage.value, rowPerPage.value, newValue);
  } else {
    desafiosItems.value = [];
    dataUsuarios.value = [];
  }
});
  



  async function getUsuarios(page = 1, limit = 10, idSemana, idDesafio = null) {
  try {
    if (!idSemana) {
      return false;
    }

    loadingUsuarios.value = true;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let url = `https://servicios-ecuavisa.vercel.app/grafico-backoffice/usuarios-x-desafio-listado/${idSemana}/${idDesafio || 'null'}?page=${page}&limit=${limit}`;

    var response = await fetch(url, requestOptions);
    const data = await response.json();

    if (data.resp) {
      // Ajustamos la estructura de los datos para que sea más fácil de manejar en la tabla
      dataUsuarios.value = data.data.map(item => ({
        ...item.userId,
        subscribed: item.subscribed
      }));
      totalRegistros.value = data.total;
      totalPage.value = Math.ceil(data.total / data.limit);
    } else {
      configSnackbar.value = {
        message: "No se pudo recuperar los usuarios, recargue de nuevo.",
        type: "error",
        model: true
      };
    }
    loadingUsuarios.value = false;
  } catch (error) {
    configSnackbar.value = {
      message: "No se pudo recuperar los usuarios, recargue de nuevo.",
      type: "error",
      model: true
    };
    loadingUsuarios.value = false;
    console.error(error.message);
  }
}


  watch(async () => searchCursoModel.value, async () => {
    if (!searchCursoModel.value) {
      dataCurso.value = dataCursoCopy.value;
    }else{
      dataCurso.value = dataCursoCopy.value.filter((c) => {
        return (c.title.toLowerCase().indexOf(searchCursoModel.value.toLowerCase()) > -1) || c.value.indexOf(searchCursoModel.value) > -1;
      });
    }
  });


  watch(modelCurso, async () => {
    if(modelCurso.value){
      currentPage.value = 1;
      await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
    }
  });

  const existeFecha = ref(true);


  const usersFull = ref([]);


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
    if(!modelCurso.value){
      configSnackbar.value = {
          message: "No se pudo recuperar los usuarios, recargue de nuevo.",
          type: "error",
          model: true
      };
      return false;
    }

    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    usersFull.value = [];

    var pages = 1;
    // EXPORTAR USUARIOS GET

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

  // DOWNLOAD SEARCH

  //Código para realizar la búsqueda
  const buscarUsuario = async (e) =>{
    const search = modelSearch.value || "";
    currentPage.value = 1;

    btnDisabled.value ={
      loading: true,
      disabled: true
    };

    if(!search){
      await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value, "");
    }else{
      await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value, search);
    }
    
    btnDisabled.value ={
      loading: false,
      disabled: false
    };
  }

  watch(modelSearch, async () => {
    if(!modelSearch.value){
      currentPage.value = 1;
      btnDisabled.value ={
        loading: true,
        disabled: true
      };

      await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value, "");
      
      btnDisabled.value ={
        loading: false,
        disabled: false
      };
    }
  });
  //Código para realizar la búsqueda

  /*video*/
  watch(async () => searchVideoModel.value, async () => {
    if (!searchVideoModel.value) {
      videosItems.value = videosItemsCopy.value;
    }else{
      videosItems.value = videosItemsCopy.value.filter((video) => {
        return (video.title.toLowerCase().indexOf(searchVideoModel.value.toLowerCase()) > -1) || video.value.indexOf(searchVideoModel.value) > -1;
      });
    }
  });

  watch(selectRefVideo, (active) => {
    if(!active){
      setTimeout(()=>{
        searchVideoModel.value = "";
      }, 1000)
    }
  });

  watch(videosModel, async (newValue) => {
  if (newValue && modelCurso.value) {
    currentPage.value = 1;
    await getUsuarios(currentPage.value, rowPerPage.value, modelCurso.value, newValue);
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
      <VCol
        cols="12"
        sm="12"
        lg="12"
      >
        <h1>Exportación de usuarios que han cumplido Desafíos por Semana</h1>
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
              v-model:menu="selectRefModulo"
              no-data-text="No existen semanas que mostrar"
              :disabled="cursoModelLoading"
              item-text="title"
              item-value="value"
              v-model="modelCurso" 
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
              v-model="videosModel"
              :items="desafiosItems"
              item-text="title"
              item-value="value"
              chips
              label="Seleccionar desafío"
              :menu-props="{ maxHeight: '400' }"
            />
          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
            <!-- 👉 Search  -->
            <!-- 👉 Export button @click="downloadSearch"-->
            <VBtn
              :loading="isFullLoading"
              :disabled="isFullLoading || loadingUsuarios"
              variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share"
              
            >
              <span style="curso:pointer" v-if="tipoModel=='Fecha'" class="px-0 py-p m-0">Exportar búsqueda</span>
              <span style="curso:pointer" v-if="tipoModel=='Curso'" class="px-0 py-p m-0">Exportar curso</span>
              <span style="curso:pointer" v-if="tipoModel=='Video'" class="px-0 py-p m-0">Exportar búsqueda</span>
            </VBtn>
            <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
              Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
            </small> 
          </div>
        </VCardText>

        <small v-if="!videosModel" class="text-disabled">Se ha filtrado usuarios de de <b>{{ 
            modelCurso? (dataCurso.length > 0 ? dataCurso.filter(c => modelCurso.includes(c.value))[0].title: "" ) :""
          }}</b> , desde {{fechaIFModel.fechai}} hasta {{fechaIFModel.fechaf}} con un total de {{totalRegistros}} registros
        </small>

        <small v-else class="text-disabled">Se ha filtrado usuarios del curso <b>{{ 
            modelCurso? (dataCurso.length > 0 ? dataCurso.filter(c => modelCurso.includes(c.value))[0].title: "" ) :""
          }}</b> , sobre el video de <b>{{ videosItems.filter(c => videosModel == c.value)[0].title }}</b> con un total de {{totalRegistros}} registros
        </small>
        <!-- Tabla -->
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
                  v-for="user in dataUsuarios"
                  :key="user._id"
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
                          v-if="user.avatar"
                          :src="user.avatar"
                        />
                        <span v-else>{{ avatarText(`${user.first_name} ${user.last_name}`) }}</span>
                      </VAvatar>

                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                          <RouterLink
                            :to="{ name: 'apps-user-view-id', params: { id: user.wylexId } }"
                            class="font-weight-medium user-list-name"
                          >
                            {{ user.first_name }} {{user.last_name}}
                          </RouterLink>
                        </h6>
                        <span class="text-sm text-disabled">@{{ user.email }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- 👉 Fecha de nacimiento -->
                  <td>
                    <span class="text-base">{{ user.birthDate }}</span>
                  </td>

                  <!-- 👉 Teléfono -->
                  <td>
                    <span class="text-base">{{ user.telefono }}</span>
                  </td>

                  <!-- 👉 Fecha de registro -->
                  <td>
                    <span class="text-base">{{ moment(user.created_at_suscriber_course).format("YYYY-MM-DD HH:mm:ss") }}</span>
                  </td>

                  <!-- 👉 Ciudad -->
                  <td>
                    <span class="text-base">{{ user.ciudad }}</span>
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
                      :to="{ name: 'apps-user-view-id', params: { id: user.wylexId } }"
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
                            :to="{ name: 'apps-user-view-id', params: { id: user.wylexId } }"
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

