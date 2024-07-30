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
    await getCursosAll();
    //await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
    
    cursoModelLoading.value = true;
    semanasItems.value = await obtenerSemanas();
    cursoModelLoading.value = false;
  });

  
  watch(modelCurso, async (newValue) => {
    if (newValue) {
        const semanaSeleccionada = semanasItems.value.find(semana => semana.value === newValue);
        if (semanaSeleccionada && semanaSeleccionada.desafios) {
            desafiosItems.value = await obtenerDesafios(semanaSeleccionada.desafios);
        }
    } else {
        desafiosItems.value = [];
    }
});
  


  async function getVideos(page = 1, limit= 10, idCurso = null){
    try {
        videosModelLoading.value = true;
        if(!modelCurso.value){
          videosItems.value = [];
          videosModel.value = null;
          videosModelLoading.value = false;
          return [];
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        var response = await fetch(`https://servicio-elearning.vercel.app/curso/videos/${modelCurso.value}`, requestOptions);
        const data = await response.json();

        videosItems.value = data.data.reduce((acumulador, actual) => {
          acumulador.push({
            title: `${actual.titulo}`,
            value: actual._id,
          });
          return acumulador;
        }, []);

        videosItemsCopy.value = videosItems.value;
        videosModelLoading.value = false;
    } catch (error) {
        return console.error(error.message);    
    }
  }

  async function getUsuarios(page = 1, limit = 10, fechai, fechaf, idCurso, search="") {
    try {
      if(!idCurso){
        return false;
      }

      if(!videosModel.value && tipoModel.value == "Video"){
         configSnackbar.value = {
            message: "No se pudo seleccionar el video.",
            type: "error",
            model: true
        };
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

      // var response = null;

      
      //Si la fecha es null y no está seleccionado la fecha, tiene q traer toda la data
      if(tipoModel.value == "Curso"){
        urlTitleExport.value = "curso_todos";
        urlApiExport.value = `https://servicio-elearning.vercel.app/grafico/exportar/usuarios/all-registrados?idCurso=${idCurso}&search=${search}`;

        // response = await fetch(`https://servicio-elearning.vercel.app/grafico/exportar/usuarios/all-registrados?page=${page}&limit=${limit}&idCurso=${idCurso}&search=${search}`, requestOptions);
        console.log(2)
      }

      //Si se selecciona el video trae la data pero solo los usuarios por video seleccionado
      if(tipoModel.value == "Video"){
        urlTitleExport.value = "curso_video";
        urlApiExport.value = `https://servicio-elearning.vercel.app/grafico/exportar/usuarios/all-registrados-video?idCurso=${idCurso}&idVideo=${videosModel.value}`;
        
        // response = await fetch(`https://servicio-elearning.vercel.app/grafico/exportar/usuarios/all-registrados-video?page=${page}&limit=${limit}&idCurso=${idCurso}&idVideo=${videosModel.value}`, requestOptions);
        console.log(3)
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

        await getVideos();

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
    await getVideos();
  });

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
        await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
      }

      if(selectedDates.length == 2){
        videosModel.value = null;
        fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
        fechaIFModel.value.fechasVModel = [selectedDates[1]];
        existeFecha.value = true;
      }

      if(selectedDates.length == 0){
        existeFecha.value = false;
        await getUsuarios(currentPage.value, rowPerPage.value, null, null, modelCurso.value);
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

      // var response = await fetch(`https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados?fechai=${fechai}&fechaf=${fechaf}&page=${page}&limit=${limit}&idCurso=${idCurso}&search=${search}`, requestOptions);
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
        isFullLoading.value = false;
        return null;
      }
    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los usuarios, recargue de nuevo.",
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
      var title = `${urlTitleExport.value}-`;

      if(urlTitleExport.value == "curso_fecha" || urlTitleExport.value == "curso_todos"){
        title += generateSlug(dataCurso.value.filter(c => modelCurso.value.includes(c.value))[0].title);
      }

      if(urlTitleExport.value == "curso_video"){
        title += generateSlug(videosItems.value.filter(c => videosModel.value == c.value)[0].title);
      }

      logAction('descarga-completa'); 

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

  watch(videosModel, async () => {
    currentPage.value = 1;
    if(!videosModel.value){//Si es null
      if(existeFecha.value){
        fechaIFModel.value.fechasModel = optionsDefaultDate.fechasModel;
        await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
      }else{
        await getUsuarios(currentPage.value, rowPerPage.value, null, null, modelCurso.value);
      }
    }else{
      await getUsuarios(currentPage.value, rowPerPage.value, null, null, modelCurso.value);
    }
    
  });

  watch(tipoModel, async () => {
    currentPage.value = 1;
    if(tipoModel.value){
      if(tipoModel.value == "Video"){
        if(videosItems.value.length > 0){
          videosModel.value = videosItems.value[0].value;
        }
      }

      await getUsuarios(currentPage.value, rowPerPage.value, fecha.value.inicio, fecha.value.fin, modelCurso.value);
    }
  });
  /*video*/
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
              <!-- <template v-slot:prepend-item>
                <v-list-item>
                  <v-list-item-content>
                    <VTextField v-model="searchCursoModel" clearable placeholder="Buscar semana"/>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template> -->
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

            <VSelect 
              v-if="tipoModel=='Video'"
              style="width: 17rem;"
              class="bg-white"
              v-model:menu="selectRefVideo"
              item-text="title"
              item-value="value"
              v-model="videosModel" 
              :items="videosItems"
              chips
              attach
              label="Desafíos de la semana"
              no-data-text="No existen desafíos que mostrar"
              :disabled="videosModelLoading"
              :menu-props="{ maxHeight: '300' }">
              <template v-slot:prepend-item>
                <v-list-item>
                  <v-list-item-content>
                    <VTextField v-model="searchVideoModel" clearable placeholder="Buscar desafío"/>
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
            <AppDateTimePicker 
              v-if="tipoModel=='Fecha'"
              clearable
              class="d-none"
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
              <span style="curso:pointer" v-if="tipoModel=='Fecha'" class="px-0 py-p m-0">Exportar búsqueda</span>
              <span style="curso:pointer" v-if="tipoModel=='Curso'" class="px-0 py-p m-0">Exportar curso</span>
              <span style="curso:pointer" v-if="tipoModel=='Video'" class="px-0 py-p m-0">Exportar búsqueda</span>
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

        <small v-if="!videosModel" class="text-disabled">Se ha filtrado usuarios de de <b>{{ 
            modelCurso? (dataCurso.length > 0 ? dataCurso.filter(c => modelCurso.includes(c.value))[0].title: "" ) :""
          }}</b> , desde {{fechaIFModel.fechai}} hasta {{fechaIFModel.fechaf}} con un total de {{totalRegistros}} registros
        </small>

        <small v-else class="text-disabled">Se ha filtrado usuarios del curso <b>{{ 
            modelCurso? (dataCurso.length > 0 ? dataCurso.filter(c => modelCurso.includes(c.value))[0].title: "" ) :""
          }}</b> , sobre el video de <b>{{ videosItems.filter(c => videosModel == c.value)[0].title }}</b> con un total de {{totalRegistros}} registros
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
