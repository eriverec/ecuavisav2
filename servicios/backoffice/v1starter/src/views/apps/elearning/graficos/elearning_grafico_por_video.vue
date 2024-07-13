<script setup>
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
import { logAction } from '@/middleware/activityLogger';
import Moment from 'moment-timezone';


const loadingGrafico = ref(false)
import { hexToRgb } from '@layouts/utils';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
const moment = extendMoment(Moment);
const shouldWatch = ref(false);
// Establecer la zona horaria por defecto
moment.tz.setDefault('America/Guayaquil');
moment.locale('es', [esLocale]);

const loadingsBTN = ref([])
const disabledBTN = ref(false)

// Función para convertir el timestamp a la zona horaria deseada
const convertirTimestamp = (timestamp) => {
    return moment.tz(timestamp, 'America/Guayaquil');
};

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const currentTab = ref('tab-lista');
const dataDevice = ref(null);
const dataDeviceGlobalSelected = ref({
  modulo:{
    titulo:""
  }
});
const disabledViewList = ref(false);

const loadingData = ref(false);
const totalRegistrados = ref(0);

onMounted(async () =>{
  setTimeout(function(){
    shouldWatch.value = true;
  }, 1000);

  await getCursosAll();

  loadingData.value = true;
  loadingGrafico.value = false

  await fetchDevice();

  loadingData.value = false;
  loadingGrafico.value = true
  
  // currentTabSectionSubSection.value = "1";
})

const fetchDevice = async (idCurso = "664e32d4fa50c162c4a2e5c8") => {
  try {
    const response = await fetch('https://servicio-elearning.vercel.app/grafico/get-web-registered/'+idCurso)
    const data = await response.json();
    dataDevice.value = data.data;
    totalRegistrados.value = data.totalCurso;

    await getModulosAll();
  } catch (error) {
    alert("Existe un error, intente nuevamente");
    console.error(error)
    return null;
  }
}

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme();

const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

/*GRÁFICO DE PIE*/

const resolveDevice = computed(() => {

  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelSuccessColor = `rgba(${hexToRgb(currentTheme.success)},0.2)`
  const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`

  const themeDisabledTextColor_c = colorVariables(vuetifyTheme.current.value).themeDisabledTextColor;

  const chartColors = {
    donut: {
      series1: currentTheme.success,
      series2: '#28c76fb3',
      series3: '#28c76f80',
      series4: labelSuccessColor,
    },
  }

  let dataRaw = (dataDeviceGlobalSelected.value.videos);
  const seriesFormat = {
    name: 'Device',
    data: []
  };

  const categoriesRaw = [];

  for (let i in dataRaw) {
    const info = dataRaw[i];

    let num = parseInt(info.usuarios);
    seriesFormat.data.push(num);
    categoriesRaw.push(info.titulo_video);
  }

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'donut',
    },
    labels: categoriesRaw,
    colors: [
      "#173F5F",
      "#00fa9a", // Verde medio
      "#7365ed",
      "#ff69b4", // Rosa claro
      "#000f08",
      "#32cd32", // Verde esmeralda
      "#136f63", // Naranja claro
      "#ffd700", // Amarillo
      "#ff4500", // Rojo oscuro
      "#ff0000", // Rojo
      "#ff8c00", // Naranja oscuro
      "#ffff00", // Amarillo
      "#8b4513", // Marrón
      "#0000ff", // Azul
      "#8a2be2", // Azul violeta
      "#ffa500", // Naranja
      "#ffd800", // Amarillo intenso
      "#ff1493", // Rosa brillante
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    stroke: { width: 0 },
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      },
    },
    responsive: [
      {
        breakpoint: 1350,
        options: {
          chart: {
            height: 480,
          },
          legend: {
            position: 'bottom',
            width: '100%'
          },
        },
      },
    ],
    legend: {
      position: 'right',
      horizontalAlign: 'left',
      offsetX: 0,
      width: 190,
      // height:200,
      markers: {
        width: 7,
        height: 7
      },
      show: true,
      formatter: function (seriesName, opts) {
        return [seriesName, " <br> ", `<div style="font-size:17px;color:${headingColor}">${opts.w.globals.series[opts.seriesIndex]} <small style="font-size:13px">usuarios</small></div>`]
      },
      labels: {
        colors: themeDisabledTextColor_c,
        useSeriesColors: false
      },
    },
    tooltip: {
      theme: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // series[seriesIndex]
        return `
        <div class="tooltip-content">
          <div class="tooltip-body">
            <div class="tooltip-title">
              Video
            </div>
            <div class="tooltip-subtitle">
              Usuarios que vieron el video
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-value">
                ${series[seriesIndex]} usuarios
              </div>
            </div>
          </div>
        </div>`
      }
    },
    grid: {
      padding: {
        top: 15,
        right: -20,
        left: -20,
      },
    },
    states: { hover: { filter: { type: 'none' } } },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: false,
            value: {
              fontSize: '1.375rem',
              fontFamily: 'Public Sans',
              color: headingColor,
              fontWeight: 600,
              offsetY: -15,
              formatter(val) {
                return `${parseInt(val)}%`
              },
            },
            name: {
              offsetY: 20,
              fontFamily: 'Public Sans',
            },
            total: {
              show: false,
              showAlways: false,
              color: currentTheme.success,
              fontSize: '.8125rem',
              label: 'Total',
              fontFamily: 'Public Sans',
              formatter() {
                return '184'
              },
            },
          },
        },
      },
    },
  }
  return { series: seriesFormat.data, options: options };
});

/*DATOS PARA OBTENER EL CURSO*/
const selectRefModulo = ref(null);
const cursoModelLoading = ref(true);
const modelCurso = ref(null);
const dataCurso = ref("");
const dataCursoCopy = ref("");
const searchCursoModel  = ref("");

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
/*DATOS PARA OBTENER EL CURSO*/


/*DATOS PARA OBTENER EL MODULO*/
const selectRefM = ref(null);
const moduloModelLoading = ref(false);
const modelModulo = ref(null);
const dataModulo = ref("");
const dataModuloCopy = ref("");
const searchModuloModel  = ref("");

async function getModulosAll(){
  try {
      moduloModelLoading.value = true;
      const data = dataDevice.value;

      dataModulo.value = data.modulos.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);

      dataModuloCopy.value = dataModulo.value;
      modelModulo.value = dataModulo.value[0].value;

      moduloModelLoading.value = false;
      
  } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los cursos, recargue de nuevo.",
          type: "error",
          model: true
      };
      console.error(error.message)
      return null;    
  }
}

watch(async () => searchModuloModel.value, async () => {
  if (!searchModuloModel.value) {
    dataModulo.value = dataModuloCopy.value;
  }else{
    dataModulo.value = dataModuloCopy.value.filter((c) => {
      return (c.title.toLowerCase().indexOf(searchModuloModel.value.toLowerCase()) > -1) || c.value.indexOf(searchModuloModel.value) > -1;
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

// 
/*DATOS PARA OBTENER EL MODULO*/
async function actualizarValoresTabla(moduloM){
  const respuesta = dataDevice.value.modulos.filter(e => {
    return e._id == moduloM
  })[0];

  const videos = respuesta.videos;

  // Calcula el total de usuarios
  let totalUsuarios = totalRegistrados.value * 1;
  // videos.forEach(data => {
  //     totalUsuarios += data.usuarios;
  // });

  // Agrega la nueva clave 'porcentaje' a cada objeto
  videos.forEach(data => {
      const porcentaje = (data.usuarios / totalUsuarios) * 100;
      data.porcentaje = parseFloat(porcentaje).toFixed(2) // Redondea al entero más cercano
  });

  // Ordena el array de objetos por 'porcentaje' de forma descendente
  videos.sort((a, b) => b.porcentaje - a.porcentaje);

  const modulo = {
    titulo:respuesta.titulo,
    _id:respuesta._id
  };

  dataDeviceGlobalSelected.value = {
    modulo,
    videos
  }

  return true;
}

watch(async () => modelModulo.value, async () => {
    if (!shouldWatch.value) return;
    loadingGrafico.value = false
    if (modelModulo.value) {
      if(dataDevice.value){
        await actualizarValoresTabla(modelModulo.value)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 2 segundos
    loadingGrafico.value = true
});

watch(async () => modelCurso.value, async () => {
  if (!shouldWatch.value) return;
  if (modelCurso.value) {
    //dataDeviceGlobalSelected

    loadingData.value = true;
    loadingGrafico.value = false

    await fetchDevice(modelCurso.value);

    loadingData.value = false;
    loadingGrafico.value = true

  }
});


import avatar1 from '@/assets/images/avatars/avatar-1.png'
import avatar2 from '@/assets/images/avatars/avatar-2.png'
import avatar3 from '@/assets/images/avatars/avatar-3.png'
import avatar4 from '@/assets/images/avatars/avatar-4.png'

const users = [
  {
    avatar: avatar2,
    name: 'Alfred Copeland',
    status: 'Away',
    lastVisited: '11 minutes ago',
    stats: '65',
  },
  {
    avatar: avatar3,
    name: 'Celia Schneider',
    status: 'Offline',
    stats: '20',
    lastVisited: '9 minutes ago',
  },
  {
    avatar: avatar4,
    name: 'Max Rogan',
    status: 'In Meeting',
    stats: '3',
    lastVisited: '28 minutes ago',
  },
]

const resolveStatusColor = {
  'Online': 'success',
  'Away': 'warning',
  'Offline': 'secondary',
  'In Meeting': 'error',
}

const docsExportNumberLength = ref({
    tamanioActual : 0,
    tamanioTotal : 0
  });

const urlApiExport = ref("https://servicio-elearning.vercel.app/grafico/exportar/usuarios/all-registrados-video");
const urlTitleExport = ref("curso_video");
const tipoModel = ref("Video");
const usersFull = ref([]);

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

// const descargarCSV = i => {
//   loadingsBTN.value[i] = true
//   disabledBTN.value = true;
//   setTimeout(() => {
//     loadingsBTN.value[i] = false
//     disabledBTN.value = false;
//   }, 3000)
// }

async function getUsuariosExportar(page = 1, limit = 10, fechai, fechaf, idCurso, idVideo, search = "") {
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
      var response = await fetch(`${urlApiExport.value}?idCurso=${idCurso}&idVideo=${idVideo}&page=${page}&limit=${limit}`, requestOptions);
      
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

  async function fetchFullUsers(idVideo){
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
        "", 
        "", 
        modelCurso.value,
        idVideo,
        ""
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

  async function downloadSearch(i, idVideo, videoTitle) {
    try {
      loadingsBTN.value[i] = true
      disabledBTN.value = true;
      
      await fetchFullUsers(idVideo);

      let doc = [];
      doc = usersFull.value
      var title = `${urlTitleExport.value}-`;

      if(urlTitleExport.value == "curso_video"){
        title += generateSlug(videoTitle);
      }

      logAction('descarga-completa-usuarios-cursos-video'); 

      exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

      loadingsBTN.value[i] = false
      disabledBTN.value = false;

    } catch (error) {
        console.log(error)
        configSnackbar.value = {
            message: "No se pudo recuperar los datos de usuario, recargue de nuevo.",
            type: "error",
            model: true
        };
        loadingsBTN.value[i] = false
        disabledBTN.value = false;
        return false;
    }
  };

</script>

<template>
  <VSnackbar 
    v-model="configSnackbar.model" 
    location="top end" 
    variant="flat" 
    :timeout="configSnackbar.timeout || 2000" 
    :color="configSnackbar.type">
      {{ configSnackbar.message }}
  </VSnackbar>
  <VCard class="v-col-12 pb-5 pt-5">
    <!-- <VCardItem class="header_card_item pb-4">
      <div class="d-flex pr-0" style="justify-content: space-between;">
        <div class="descripcion">
          <VCardTitle>Cantidad de usuarios que vieron los videos</VCardTitle>
          <small class="mt-3">Total de usuarios por video</small>
        </div> -->
        <!-- <div class="">
          <VSwitch class="mt-n4 pt-5" disabled @click="toggleRealtime"></VSwitch>
        </div> -->

      <!-- </div>
    </VCardItem> -->
    <!-- <iframe src="https://estadisticas.ecuavisa.com/sites/gestor/Tools/realtimeService/pie.html" width="100%"
  height="100%" frameborder="0"></iframe>  -->
    <VRow class="pb-5">
      <VCol cols="12" md="5">
        <div class="ps-5">
          <VCardTitle class="ps-0 pb-0">Análisis para el módulo:</VCardTitle>
          <small>{{ dataDeviceGlobalSelected.modulo.titulo }}</small>
          <VueApexCharts v-if="loadingGrafico" :options="resolveDevice.options" :series="resolveDevice.series" :height="275" width="100%" />
          <div v-else class="py-4">
            Cargando datos...
          </div>

        </div>
      </VCol>
      <VCol cols="12" md="7">
        <VCardTitle class="ps-0 pb-4">
          Filtros <VIcon
                    size="20"
                    icon="tabler-filter"
                  />
        </VCardTitle>
        <div class="d-flex flex-wrap gap-3">
          <VSelect
              style="width: 16rem;"
              class="bg-white"
              v-model:menu="selectRefModulo"
              no-data-text="No existen curso que mostrar"
              :disabled="cursoModelLoading"
              item-text="title"
              item-value="value"
              v-model="modelCurso" 
              :items="dataCurso"
              chips
              label="Seleccionar el curso"
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

            <VSelect
              style="width: 16rem;"
              class="bg-white"
              v-model:menu="selectRefM"
              no-data-text="No existen módulo que mostrar"
              :disabled="moduloModelLoading"
              item-text="title"
              item-value="value"
              v-model="modelModulo" 
              :items="dataModulo"
              chips
              label="Seleccionar el módulo"
              :menu-props="{ maxHeight: '400' }">
              <template v-slot:prepend-item>
                <v-list-item>
                  <v-list-item-content>
                    <VTextField v-model="searchModuloModel" clearable placeholder="Buscar módulo"/>
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
        </div>
        <small>Este curso tiene un total de {{ totalRegistrados }} usuarios registrados.</small>
        <VList
          class="mt-2"
          lines="two"
          border
        >
          <template
            v-for="(video, index) of dataDeviceGlobalSelected.videos"
            :key="video.value"
          >
            <VListItem>
              <template #prepend>
                <VAvatar
                  color="success"
                  variant="tonal"
                  class="px-2"
                >
                  <VIcon
                    size="50"
                    icon="tabler-video"
                  />
                </VAvatar>
              </template>
              <VListItemTitle style="width: 86%;">
                {{ video.titulo_video }}
              </VListItemTitle>
              <VListItemSubtitle class="mt-1">
                <small>{{ dataDeviceGlobalSelected.modulo.titulo }}</small>
                <!-- <span class="text-xs text-disabled">{{ user.lastVisited }}</span> -->
              </VListItemSubtitle>

              <template #append>
                <div class="d-flex pe-5 flex-column justify-content-end">
                  <div
                    class="me-2"
                    style="width: 6.875rem;"
                  >
                    <VProgressLinear
                      :model-value="video.porcentaje"
                      :color="'success'"
                      height="8"
                      rounded-bar
                      rounded
                    />
                  </div>
                  <span class="text-disabled">{{video.porcentaje}}% <small title="Usuarios que vieron el video">(<VIcon
                    size="13"
                    icon="tabler-users"
                  /> {{video.usuarios}})</small></span>
                </div>
                <div class="d-flex flex-column">
                  <VBtn 
                    size="small"
                    :loading="loadingsBTN[index]"
                    :disabled="disabledBTN"
                    @click="downloadSearch(index, video.value, video.titulo_video)"
                  >
                    Descargar
                  </VBtn>
                  <small class="px-0 py-1 text-disabled" v-if="loadingsBTN[index]">
                    Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
                  </small> 
                </div>
              </template>

              <!-- <template #append>
                
              </template> -->
            </VListItem>
            <VDivider v-if="index !== dataDeviceGlobalSelected.videos.length - 1" />
          </template>
        </VList>
      </VCol>
    </VRow>
  </VCard>
</template>

<style>
  .apexcharts-legend-series{
    transition: 1s ease all;
    padding: 5px;
    border-radius: 7px;
  }
  .apexcharts-legend-series:hover{
    background-color: #e9e9ea;
  }

  .item-limit{
    max-width: 210px;
    display: flex;
    font-size: 15px;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }
  /*.v-progress-linear__background{
    opacity: 1;
  }*/
</style>