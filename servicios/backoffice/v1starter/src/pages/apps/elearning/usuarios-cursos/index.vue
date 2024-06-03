<script setup>
  import { logAction } from '@/middleware/activityLogger';
  import { avatarText } from '@core/utils/formatters'
  import { parseISO } from 'date-fns';
  import { extendMoment } from 'moment-range';
  import Moment from 'moment-timezone';
  import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  moment.tz.setDefault('America/Guayaquil');

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
  const modelSearch = ref(null);
  const btnDisabled = ref({
    loading: false,
    disabled:false
  });
  /*Variables de búsqueda*/

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

  const fechaIFModel = ref({
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
  })

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
    await getCursosAll();
    await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
  });

  async function getUsuarios(page = 1, limit = 10, fechai, fechaf, idCurso, search="") {
    try {
      if(!idCurso){
        return false;
      }
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados?fechai=${fechai}&fechaf=${fechaf}&page=${page}&limit=${limit}&idCurso=${idCurso}&search=${search}`, requestOptions);
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
        return false;
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

  //Curso
  async function getCursosAll(page = 1, limit= 10){
    try {
        cursoModelLoading.value = true;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        var response = await fetch(`https://servicio-elearning.vercel.app/curso/all?limit=200&page=1`, requestOptions);
        const data = await response.json();

        dataCurso.value = data.data.reduce((acumulador, actual) => {
          acumulador.push({
            title: `${actual.titulo}`,
            value: actual._id,
          });
          return acumulador;
        }, []);
        dataCursoCopy.value = dataCurso.value;
        modelCurso.value = dataCurso.value[0].value;

        cursoModelLoading.value = false;
        
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo recuperar los cursos, recargue de nuevo.",
            type: "error",
            model: true
        };
        return console.error(error.message);    
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

  watch(selectRefModulo, (active) => {
    if(!active){
      setTimeout(()=>{
        searchCursoModel.value = "";
      }, 1000)
    }
  });

  watch(modelCurso, async () => {
    if(modelCurso.value){
      currentPage.value = 1;
      await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
    }
  });

  //Fechas
  async function obtenerFechas(selectedDates, dateStr, instance) {
      if (selectedDates.length > 1) {
        currentPage.value = 1;
        fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
        fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
        fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
        fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD')
        await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
      }

      if(selectedDates.length == 2){
        fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
        fechaIFModel.value.fechasVModel = [selectedDates[1]];
      }

      
  }

  const docsExportNumberLength = ref({
    tamanioActual : 0,
    tamanioTotal : 0
  });

  const usersFull = ref([]);

  async function getUsuariosExportar(page = 1, limit = 10, fechai, fechaf, idCurso, search = "") {
    try {
      if(!idCurso){
        return false;
      }
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados?fechai=${fechai}&fechaf=${fechaf}&page=${page}&limit=${limit}&idCurso=${idCurso}&search=${search}`, requestOptions);
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
    while(true){
      const res = await getUsuariosExportar(
        pages,
        500,
        fecha.value.inicio, 
        fecha.value.fin, 
        modelCurso.value,
        modelSearch.value || ""
      );

      const array = res.data;
      const totalUser = res.total;

      // if(i==1){
      //   pages = res.total + 1;
      // }

      // if(array.length < 1){
      //   i = pages + 2;
      // }

      array.forEach((item) => {
        let newItem = {}; // Nuevo objeto para cada elemento de array
        // Recorremos las claves de headers
        for (let key in headersGlobal.value) {
          // Verificamos si la clave existe en item y la agregamos al nuevo objeto
          if (item.hasOwnProperty(key)) {
            newItem[key] = item[key];
          }else{
            newItem[key] = "";
          }
        }
        // Agregamos el nuevo objeto a usersFull.value
        usersFull.value.push(newItem);
      });

      docsExportNumberLength.value.tamanioActual = usersFull.value.length;
      docsExportNumberLength.value.tamanioTotal = totalUser;

      usersFull.value.sort((a, b) => moment(b.created_at, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at, 'DD/MM/YYYY-HH:mm:ss')));

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

  async function downloadSearch () {
    try {
      if(dataUsuarios.value.length < 1){
         configSnackbar.value = {
            message: "No hay datos que exportar.",
            type: "error",
            model: true
        };
        return false;
      }
      isFullLoading.value=true;
      await fetchFullUsers();
      isFullLoading.value=false;

      let doc = [];
      doc = usersFull.value
      let title = "users_search_curso";

      logAction('descarga-completa'); 

      console.log(doc)
      exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

    } catch (error) {
        console.log(error)
        configSnackbar.value = {
            message: "No se pudo recuperar los datos de usuario, recargue de nuevo.",
            type: "error",
            model: true
        };
        return false;
    }
  };

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
        <h1>Exportación de usuarios suscritos a un curso</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap">
          <div class="me-3 d-flex gap-4" >
            <VSelect
              class="bg-white"
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />

            <VSelect
              style="width: 18rem;"
              class="bg-white"
              v-model:menu="selectRefModulo"
              no-data-text="No existen curso que mostrar"
              :disabled="cursoModelLoading"
              item-text="title"
              item-value="value"
              v-model="modelCurso" 
              :items="dataCurso"
              chips
              clearable
              label="Seleccionar el módulo para el curso"
              :menu-props="{ maxHeight: '400' }">
              <template v-slot:prepend-item>
                <v-list-item>
                  <v-list-item-content>
                    <VTextField v-model="searchCursoModel" clearable placeholder="Buscar curso"/>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
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

            <AppDateTimePicker 
              class="bg-white"
              style="width: 25rem;"
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

          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
            <!-- 👉 Search  -->
            

            <!-- 👉 Export button -->
            <VBtn
              :loading="isFullLoading"
              :disabled="isFullLoading"
              variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share"
              @click="downloadSearch"
            >
              Exportar búsqueda
            </VBtn>
            <small class="px-0 py-1 text-disabled" v-if="isFullLoading">
              Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
            </small> 
          </div>
        </VCardText>


        <!-- 👉 Add user button -->
        <VRow class="pb-3 d-none">
          <VCol cols="12" sm="2" lg="2" >
            <VRow>
              <VCol cols="10" sm="10" lg="10" >
                <VTextField class="bg-white" v-model="modelSearch" label="Buscar...." type="text" clearable />
              </VCol>
              <VCol cols="2" sm="2" lg="2" >
                <VBtn :loading="btnDisabled.loading" :disabled="btnDisabled.disabled" title="Buscar usuario" block @click="buscarUsuario">
                  <VIcon
                    :size="25"
                    icon="tabler-search"
                  />
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="3" sm="3" lg="3" >
          </VCol>
        </VRow>

        <small class="text-disabled">Se ha filtrado usuarios del curso <b>{{ dataCurso.length > 0 ? dataCurso.filter(c => modelCurso.includes(c.value))[0].title: "" }}</b> , desde {{fechaIFModel.fechai}} hasta {{fechaIFModel.fechaf}} con un total de {{totalRegistros}} registros</small>
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
              <tbody>
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
              <tfoot v-show="!dataUsuarios.length">
                <tr>
                  <td
                    colspan="7"
                    class="text-center"
                  >
                    No hay datos que mostrar
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
  .app-user-search-filter {
    /*inline-size: 31.6rem;*/
  }

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
