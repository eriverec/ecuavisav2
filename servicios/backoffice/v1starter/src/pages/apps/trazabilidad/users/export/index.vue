<script setup>
  import { avatarText } from '@core/utils/formatters'
  import { parseISO } from 'date-fns';
  import { extendMoment } from 'moment-range';
  import Moment from 'moment-timezone';
  import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  moment.tz.setDefault('America/Guayaquil');
  //Config VSnackbar
  const configSnackbar = ref({
      message: "Datos guardados",
      type: "success",
      model: false
  });
  //FIN - Config VSnackbar

  // Variables para usuarios
  const fechaFin = moment().format("YYYY-MM-DD");
  const fechaInicio = moment().subtract(5, 'days').format("YYYY-MM-DD");

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
  const dataUsuarios = ref([]);
  const copyDataUsuarios = ref([]);

  const pageUsuarios = ref(1);
  const limitUsuarios = ref(10);

  const filters = ref({
    page: pageUsuarios.value,
    limit: limitUsuarios.value,
    fechai: fecha.value.inicio,
    fechaf: fecha.value.fin,
    country:"Ecuador",
    city:"Quito",
    device:"movil",
    os:"Linux",
    browser:"Chrome",
    order:"1",
    EC_Seccion:"Noticias",
  });

  const filterLabels = ref({
    page:"Página actual",
    limit:"Límite",
    fechai:"Fecha inicial",
    fechaf:"Fecha final",
    country:"País",
    city:"Ciudad",
    device:"Dispositivo",
    os:"SO",
    browser:"Navegador",
    order:"Orden de los registros",
    EC_Seccion:"Sección",
  });

  const limitUsuariosExport = ref(500);
  const loadingUsuarios = ref(false);
  const urlApiExport = ref("https://servicio-de-actividad.vercel.app");
  // Fin  Variables para usuarios

  //Ciudades y países
  const modelPais = ref("Ecuador");
  const dataPaises = ref([]);
  const dataAllPaises = ref([]);

  const modelCiudad = ref("Guayaquil");
  const dataCiudades = ref([]);
  //Fin ciudades y paises

  // Variables de la tabla
  const rowPerPage = ref(10);
  // Fin variables de la tabla

  async function getUsuarios() {
    try {
      loadingUsuarios.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      // filters.value["page"] = pageUsuarios.value;
      // filters.value["limit"] = limitUsuarios.value;
      // filters.value["fechai"] = "2024-09-01";
      // filters.value["fechaf"] = "2024-09-02";
      // filters.value["country"] = "Ecuador";
      // filters.value["city"] = "Quito";
      // filters.value["device"] = "movil";
      // filters.value["os"] = "Linux";
      // filters.value["browser"] = "Chrome";
      // filters.value["order"] = "1";
      // filters.value["EC_Seccion"] = "Noticias";

      const queryString = new URLSearchParams(Object.fromEntries(
        Object.entries(filters.value).filter(([_, valor]) => valor != null && valor !== '' && valor !== undefined)
      )).toString();
      
      var response = await fetch(`${urlApiExport.value}/backoffice/trazabilidad-usuario?${queryString}`, requestOptions);
      // var response = await fetch(`${urlApiExport.value}/backoffice/trazabilidad-usuario?fechai=2024-09-01&fechaf=2024-09-02&city=Quito&country=Ecuador&device=movil&os=Linux&browser=Chrome&order=1&EC_Seccion=Noticias&page=${pageUsuarios.value}&limit=${limitUsuarios.value}`, requestOptions);
      const data = await response.json();

      if(data.resp){
        dataUsuarios.value = data.data;
        copyDataUsuarios.value = data.data;
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
      return true;
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

  async function getPaisesCiudades() {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      var response = await fetch(`https://servicios-ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades`, requestOptions);
      const data = await response.json();

      dataAllPaises.value = data;

      dataPaises.value = dataAllPaises.value.map(e => {
        return {
          title: e.country,
          value: e.country
        }
      });

      dataCiudades.value = dataAllPaises.value.find(e => e.country == "Ecuador").data.map(e => {
        return {
          title: e.city,
          value: e.city
        }
      });

      console.log(dataCiudades.value)

      return true;

    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los usuarios, recargue de nuevo.",
          type: "error",
          model: true
      };

      return console.error(error.message);
    }
  }

  onMounted(async () => {
    await getUsuarios();
    await getPaisesCiudades();
  });

  // Eventos para rowPerPage
  watch(rowPerPage, async () => {
    if(rowPerPage.value){
      limitUsuarios.value = rowPerPage.value;
      pageUsuarios.value = 1;
      filters.value["page"] = pageUsuarios.value;
      filters.value["limit"] = rowPerPage.value;
      await getUsuarios();
    }
  })
  // Fin Eventos para rowPerPage

  // Eventos de paginado
  async function regresarAlInicio(){
    pageUsuarios.value = 1;
    filters.value["page"] = pageUsuarios.value;
    await getUsuarios();
  }
  async function siguientePage(){
    pageUsuarios.value = pageUsuarios.value + 1;
    filters.value["page"] = pageUsuarios.value;
    await getUsuarios();
  }
  async function pageAnterior(){
    pageUsuarios.value = pageUsuarios.value - 1;
    filters.value["page"] = pageUsuarios.value;
    await getUsuarios();
  }
  // Fin Eventos de paginado

  // Filtros activos
  function activeFiltersLocal(){
    const filtros = filters.value;
    return Object.keys(filtros)
        .filter(key => filtros[key]) // Filtrar las claves con valores no vacíos
        .map(key => {
          return {
            label: filterLabels.value[key], // Asignar etiqueta
            value: filtros[key] // Asignar valor
          };
        });
  }

  const activeFilters = computed(() => activeFiltersLocal())
  // Fin filtros activos

  //Componentes de fechasModel
  async function obtenerFechas(selectedDates, dateStr, instance) {
      if (selectedDates.length > 1) {
        fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
        fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
        fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format('YYYY-MM-DD');
        fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format('YYYY-MM-DD');

        pageUsuarios.value = 1;
        filters.value["fechai"] = fecha.value.inicio;
        filters.value["fechaf"] = fecha.value.fin;
        filters.value["page"] = pageUsuarios.value;
        await getUsuarios();
      }

  }
  //Fin de compónentes de fechas
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
      <VCol cols="12" sm="12" lg="12" >
        <VCard class="mb-4" title="Filtros">
          <VCardText class="d-flex gap-4 flex-wrap" style="align-items: flex-start;">
            <div class="AppDateTimePicker-cr">
              <AppDateTimePicker 
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
            </div>
          </VCardText>
        </VCard>
        
        <VCard class="mt-5" title="Usuarios según el criterio">
            <div class="px-4">
              <h3 class="pb-3">Filtros Activos</h3>
              <ul v-if="activeFilters.length > 0" class="d-flex gap-2 flex-wrap">
                <li v-for="(filter, index) in activeFilters" :key="index">
                  <VChip color="primary">
                    {{ filter.label }}: 
                  </VChip> <small class="text-disabled mr-3">{{ filter.value }},</small>
                </li>
              </ul>
              <p v-else>No hay filtros activos</p>
            </div>
            <VCardText class="d-flex py-4 gap-4  flex-wrap" style="align-items: flex-start;">
              <div class="me-3 d-flex gap-4">
                <VSelect class="bg-white" v-model="rowPerPage" density="compact" variant="outlined"
                  :items="[10, 20, 30, 50]" />
              </div>
              <VSpacer />
              <div class="app-user-search-filter d-flex align-top">
                <VBtn :loading="isLoadingExport" :disabled="isLoadingExport || loadingUsuarios" variant="tonal"
                  color="success" prepend-icon="tabler-screen-share" @click="exportarDatos">
                  Exportar datos
                </VBtn>
              </div>
            </VCardText>
            <VDivider />
            <VTable class="text-no-wrap">
              <!-- 👉 table head -->
              <thead>
                <tr>
                  <th scope="col">
                    Nombres
                  </th>
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody v-if="loadingUsuarios==false">
                <tr
                  v-for="user in dataUsuarios"
                  :key="user.user._id"
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
                          v-if="user.user.avatar"
                          :src="user.user.avatar"
                        />
                        <span v-else>{{ avatarText(`${user.user.first_name} ${user.user.last_name}`) }}</span>
                      </VAvatar>

                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                          <RouterLink
                            :to="{ name: 'apps-user-view-id', params: { id: user.user.wylexId } }"
                            class="font-weight-medium user-list-name"
                          >
                            {{ user.user.first_name }} {{user.user.last_name}}
                          </RouterLink>
                        </h6>
                        <span class="text-sm text-disabled">@{{ user.user.email }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- 👉 Fecha de nacimiento -->
                  <!-- <td>
                    <span class="text-base">{{ user.birthDate }}</span>
                  </td> -->
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

              <div class="pagination-cr">
                <div class="d-flex gap-1">
                  <VBtn style="height: 38px;" class="rounded-1" color="primary" variant="tonal" size="small" :disabled="pageUsuarios == 1" @click="regresarAlInicio">
                    Regresar al inicio
                  </VBtn>
                  <VBtn title="Página anterior" icon="tabler-chevron-left" class="rounded-1" color="secondary" variant="tonal" size="small" :disabled="pageUsuarios < 2" @click="pageAnterior"/>
                  <VChip style="height: 38px;" class="px-4" label color="primary" >
                    {{pageUsuarios}}
                  </VChip>
                  <VBtn title="Siguiente página" icon="tabler-chevron-right" class="rounded-1" color="secondary" variant="tonal" size="small" @click="siguientePage" :disabled="dataUsuarios.length == 0"/>
                </div>
              </div>
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

  .rounded-1 {
      border-radius: 5px;
  }
</style>
