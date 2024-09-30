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
    city:"Guayaquil",
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
  const modelPais = ref(filters.value.country);
  const dataPaises = ref([]);
  const dataAllPaises = ref([]);
  const searchPaisModel = ref(null);
  const selectRefPais = ref(null);

  const modelCiudad = ref(filters.value.city);
  const dataCiudades = ref([]);
  const dataAllCiudades = ref([]);
  const searchCiudadModel = ref(null);
  const selectRefCiudad = ref(null);
  //Fin ciudades y paises

  //Dispositivos
  const modelDevice = ref(filters.value.device);
  const dataDevices = ref(["desktop", "movil"]);
  //Fin Dispositivos

  //Navegador
  const modelBrowser = ref(filters.value.browser);
  const dataBrowser = ref(["Chrome", "Safari", "Firefox", "Otro"]);
  //Fin Navegador

  //OS
  const modelOS = ref(filters.value.os);
  const dataOS = ref(["Windows", "Mac OS", "Android", "Linux", "Otro"]);
  //Fin OS

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

      dataAllCiudades.value = dataCiudades.value;

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

  //Eventos para buscador de países
  watch(modelPais, async () => {
    if(modelPais.value){
      dataCiudades.value = dataAllPaises.value.find(e => e.country == modelPais.value).data.map(e => {
        return {
          title: e.city,
          value: e.city
        }
      });

      dataAllCiudades.value = dataCiudades.value;
      modelCiudad.value = dataCiudades.value[0].value;
    }
  });

  watch(async () => searchPaisModel.value, async () => {
    const allPaisesTemp = dataAllPaises.value.map(e => {
      return {
        title: e.country,
        value: e.country
      }
    });

    if (!searchPaisModel.value) {
      dataPaises.value = allPaisesTemp;
    }else{
      dataPaises.value = allPaisesTemp.filter((c) => {
        return (c.title.toLowerCase().indexOf(searchPaisModel.value.toLowerCase()) > -1) || c.value.indexOf(searchPaisModel.value) > -1;
      });
    }
  });

  watch(selectRefPais, (active) => {
    if(!active){
      setTimeout(()=>{
        searchPaisModel.value = "";
      }, 1000)
    }
  });
  //Fin eventos para buscador de países

  //Inicio eventos para buscador de ciudad
  watch(async () => searchCiudadModel.value, async () => {
    const allPaisesTemp = dataAllCiudades.value;

    if (!searchCiudadModel.value) {
      dataCiudades.value = allPaisesTemp;
    }else{
      dataCiudades.value = allPaisesTemp.filter((c) => {
        return (c.title.toLowerCase().indexOf(searchCiudadModel.value.toLowerCase()) > -1) || c.value.indexOf(searchCiudadModel.value) > -1;
      });
    }
  });

  watch(selectRefCiudad, (active) => {
    if(!active){
      setTimeout(()=>{
        searchCiudadModel.value = "";
      }, 1000)
    }
  });

  watch(modelCiudad, async () => {
    if(modelCiudad.value){
      pageUsuarios.value = 1;
      filters.value["country"] = modelPais.value;
      filters.value["city"] = modelCiudad.value;
      await getUsuarios();
    }
  });

  watch(modelDevice, async () => {
    if(modelDevice.value){
      if(modelDevice.value == "movil"){
        modelBrowser.value = "Safari";
        dataBrowser.value = ["Chrome", "Safari", "Firefox", "Otro"];
        modelOS.value = "Linux";
        dataOS.value = ["Windows", "Mac OS", "Android", "Linux", "Otro"];
      }else{
        modelBrowser.value = "Chrome";
        dataBrowser.value = ["Chrome", "Firefox", "Otro"];
        modelOS.value = "Windows";
        dataOS.value = ["Windows", "Mac OS", "Linux", "Otro"];
      }
      pageUsuarios.value = 1;
      filters.value["device"] = modelDevice.value;
      //await getUsuarios();
    }
  });

  watch(modelBrowser, async () => {
    if(modelBrowser.value){
      pageUsuarios.value = 1;
      filters.value["browser"] = modelBrowser.value;
      await getUsuarios();
    }
  });

  watch(modelOS, async () => {
    if(modelOS.value){
      pageUsuarios.value = 1;
      filters.value["os"] = modelOS.value;
      await getUsuarios();
    }
  });
  //Fin eventos para buscador de ciudad

  // DESCARGAR
  const btnLoadingDescargar = ref(false);
  const dataFullExportar = ref([]);
  const urlTitleExport = ref("trazabilidad_usuarios");

  const docsExportNumberLength = ref({
    tamanioActual : 0,
    tamanioTotal : 0
  });

  // PASO 7
  function convertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
          var line = "";
          for (var index in array[i]) {
              if (line != "") line += ",";

              // Envolver valores que contienen comas entre comillas dobles
              var value = array[i][index];
              if (typeof value === "string" && value.includes(",")) {
                  value = `"${value}"`;
              }

              line += value;
          }

          str += line + "\r\n";
      }

      return str;
  }

  // PASO 6
  function exportCSVFile(headers, items, fileTitle) {
    // if (headers && items[0].wylexId !== "wylexId") {
    //   items.unshift(headers);
    // }

    items.unshift(headers);

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

  // PASO 5
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

  // PASO 3
  async function getDataExportarServer(page = 1, limit = 10) {
    try {

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const paramsQuery = Object.fromEntries(
        Object.entries(filters.value).filter(([_, valor]) => valor != null && valor !== '' && valor !== undefined)
      );

      paramsQuery.page = page;
      paramsQuery.limit = limit;

      const queryString = new URLSearchParams(paramsQuery).toString();

      
      var response = await fetch(`${urlApiExport.value}/backoffice/trazabilidad-usuario?${queryString}`, requestOptions);
      
      const data = await response.json();

      if(data.resp){
        return data;
      }else{
        configSnackbar.value = {
            message: "No se pudo recuperar los usuarios, recargue de nuevo.",
            type: "error",
            model: true
        };
        btnLoadingDescargar.value = false;
        return null;
      }
    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los usuarios, recargue de nuevo.",
          type: "error",
          model: true
      };
      console.error(error.message);
      btnLoadingDescargar.value = false;
      return null;
    }
  }

  // PASO 4
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

  // PASO 2
  async function fetchFullDescargar(){

    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    dataFullExportar.value = [];
    var pages = 1;
    while(true){
      const res = await getDataExportarServer(
        pages,
        500
      );

      const responseData = res.data;
      const totalDataExportar = "-";

      for(var keyUsuarioReembolso in responseData){
        const reembolsosData = responseData[keyUsuarioReembolso];
        const usuariosReembolsos = reembolsosData.user || {};

        // Nuevo objeto para cada elemento de responseData
        let newItem = {}; 

        // Recorremos las claves de usuarios
        for (let key in headersGlobal.value) {
            // Verificamos si la clave existe en item y la agregamos al nuevo objeto
            if (usuariosReembolsos.hasOwnProperty(key)) {
              newItem[key] = usuariosReembolsos[key];
            }else{
              newItem[key] = "";
            }
        }

        // for (let key in reembolsosData) {
        //     // Verificamos si la clave existe en item y la agregamos al nuevo objeto
        //     if(key != "user"){

        //       if (key == "created_at") {
        //         newItem["reembolso_created_at"] = reembolsosData[key];
        //       }else{
        //         if (key == "estado") {
        //           newItem["reembolso_estado"] = reembolsosData[key];
        //         }else{
        //           newItem[key] = reembolsosData[key];
        //         }
        //       }

        //       if (key == "billing_details_direccion") {
        //         newItem["billing_details_direccion"] = reembolsosData[key];
        //       }

        //     }
        // }

        // newItem["reembolso_created_at"] = reembolsosData.created_at;
        // newItem["reembolso_estado"] = reembolsosData.estado;
        // newItem["created_at_reembolso"] = reembolsosData.created_at;
        
        // Agregamos el nuevo objeto a dataFullExportar.value
        dataFullExportar.value.push(newItem);
      }

      // responseData.forEach((usuariosReembolsos) => {
        
      // });

      docsExportNumberLength.value.tamanioActual = eliminarDuplicadosPorWylexId(dataFullExportar.value).length;
      docsExportNumberLength.value.tamanioTotal = totalDataExportar;

      // dataFullExportar.value.sort((a, b) => moment(b.created_at_reembolso, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at_reembolso, 'DD/MM/YYYY-HH:mm:ss')));

      pages++;

      if(responseData.length < 1){
        break;
      }
    }

    // console.log(dataFullExportar.value)

    return true;
  };

  // PASO 1
  async function downloadSearch() {
    try {

      btnLoadingDescargar.value=true;
      await fetchFullDescargar();
      btnLoadingDescargar.value=false;

      let doc = [];
      doc = dataFullExportar.value
      var title = `${urlTitleExport.value}-`+ generateSlug(`${filters.value.fechai} hasta ${filters.value.fechai}`);

      exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

    } catch (error) {
        console.log(error)
        configSnackbar.value = {
            message: "No se pudo recuperar los datos de registros para exportar, recargue de nuevo.",
            type: "error",
            model: true
        };
        return false;
    }
  };
  // FIN DESCARGAR
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
          <VCardText class="d-flex gap-2 flex-wrap" style="align-items: flex-start;">
            <div class="AppDateTimePicker-cr my-2">
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
            <div class="mx-1 my-2" style="min-width: 120px;">
              <VSelect 
                label="País" 
                class="bg-white" 
                v-model="modelPais" 
                density="compact" 
                variant="outlined"
                no-data-text="No existen datos que mostrar"
                :items="dataPaises"
                v-model:menu="selectRefPais"
                :menu-props="{ maxHeight: '400' }" >
                <template v-slot:prepend-item>
                    <v-list-item>
                      <v-list-item-content>
                        <VTextField v-model="searchPaisModel" clearable placeholder="Buscar dato"/>
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
                                    <p>{{ item.value }}</p>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </VSelect>
            </div>

            <div class="mx-1 my-2" style="width: 155px;">
              <VSelect 
                label="Ciudades" 
                class="bg-white" 
                v-model="modelCiudad" 
                density="compact" 
                variant="outlined"
                no-data-text="No existen datos que mostrar"
                :items="dataCiudades"
                v-model:menu="selectRefCiudad"
                :menu-props="{ maxHeight: '400' }" >
                <template v-slot:prepend-item>
                    <v-list-item>
                      <v-list-item-content>
                        <VTextField v-model="searchCiudadModel" clearable placeholder="Buscar dato"/>
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
                                    <p>{{ item.value }}</p>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </VSelect>
            </div>

            <div class="mx-1 my-2" style="width: 145px;">
              <VSelect 
                label="Dispositivos" 
                class="bg-white" 
                v-model="modelDevice" 
                density="compact" 
                variant="outlined"
                no-data-text="No existen datos que mostrar"
                :items="dataDevices"
                :menu-props="{ maxHeight: '400' }" />
            </div>

            <div class="mx-1 my-2" style="width: 135px;">
              <VSelect 
                label="Navegadores" 
                class="bg-white" 
                v-model="modelBrowser" 
                density="compact" 
                variant="outlined"
                no-data-text="No existen datos que mostrar"
                :items="dataBrowser"
                :menu-props="{ maxHeight: '400' }" />
            </div>

            <div class="mx-1 my-2" style="min-width: 115px;">
              <VSelect 
                label="OS" 
                class="bg-white" 
                v-model="modelOS" 
                density="compact" 
                variant="outlined"
                no-data-text="No existen datos que mostrar"
                :items="dataOS"
                :menu-props="{ maxHeight: '400' }" />
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
              <div class="d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
                <VBtn
                  :loading="btnLoadingDescargar"
                  :disabled="btnLoadingDescargar"
                  color="primary"
                  @click="downloadSearch"
                >
                  Descargar
                  <VIcon
                    end
                    icon="tabler-cloud-download"
                  />
                </VBtn>
                <small class="px-0 py-1 text-disabled" v-if="btnLoadingDescargar">
                  Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
                </small>
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
                  <th scope="col">
                    Teléfono
                  </th>
                  <th scope="col">
                    País
                  </th>
                  <th scope="col">
                    Ciudad
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
                  <td>
                    <span class="text-base">{{ user.user.phone_number }}</span>
                  </td>
                  <td>
                    <span class="text-base">{{ filters.country }}</span>
                  </td>
                  <td>
                    <span class="text-base">{{ filters.city }}</span>
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
