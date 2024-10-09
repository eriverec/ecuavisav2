<script setup>
import axios from 'axios';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
import { onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const semanas = ref([]);
const semanaSeleccionada = ref('');
const platformModel = ref('0');
const platformList = [{
  title:"Todos",
  value: "0"
},{
  title:"Web",
  value: "web"
},{
  title:"IOs",
  value:"ios"
},{
  title:"Android",
  value: "android"
}];

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const headersGlobal = ref({
  _id: "ID",
  wylexId: "WylexId",
  // site: "site",
  // site_id: "site_id",
  email: "Email",
  first_name: "Nombre",
  last_name: "Apellido",
  // avatar: "avatar",
  // created_at: "created_at",
  // logged_at: "logged_at",
  // logged_at_site: "logged_at_site",
  // updated_at: "updated_at",
  // validated_at: "validated_at",
  // banned_at: "banned_at",
  country: "Pais",
  phone_prefix: "Prefijo",
  phone_number: "Teléfono1",
  // gender: "gender",
  // birth_date: "birth_date",
  // identification_type: "identification_type",
  // identification_number: "identification_number",
  // newsletter_opt_in: "newsletter_opt_in",
  provider: "Proveedor",
  // platform: "platform",
  // created_in_os: "created_in_os",
  ciudad:"Ciudad",
  // telefono:"telefono",
  // birthDate:"birthDate",
  platform_desafio:"platform_desafio"
});

const labels = ref([]);
const items = ref([]);
const totalUsuarios = ref([]);
const series = ref([]);
const desafios = ref([]);
const cargando = ref(true);
const registrosExportados = ref(null);
const totalRegistros = ref({});
const cargandoDescarga = ref({});

const obtenerSemanas = async () => {
  // cargando.value = true; // Iniciar carga
  try {
    const response = await axios.get('https://servicio-desafios.vercel.app/semana/all/get');
    semanas.value = response.data.data;
    items.value = response.data.data.map(item => ({
      title: item.titulo,
      value: item._id,
      description: item.descripcion
    }));

    if (semanas.value.length > 0) {
      semanaSeleccionada.value = semanas.value[0]._id;
      obtenerTotalUsuarios();
    }
  } catch (error) {
    console.error('Error al obtener las semanas:', error);
  }
};

const obtenerNombreDia = (numeroDia) => {
  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ];
  return diasSemana[numeroDia] || 'Día no válido';
};

const obtenerTotalUsuarios = async () => {
  cargando.value = true; // Iniciar carga
  if (!semanaSeleccionada.value) return;

  try {
    const response = await axios.get(`https://servicio-niveles-puntuacion.vercel.app/grafico-backoffice/usuarios-x-semana/${semanaSeleccionada.value}?platform=${platformModel.value}`);


    desafios.value = response.data.data.map(item => ({
      ...item.desafio[0],
      idDesafio: item.idDesafio,
      total: item.total,
      nombreDia: obtenerNombreDia(parseInt(item.desafio[0].dia))
    }));

    // Ordenar los desafíos por día de la semana
    desafios.value.sort((a, b) => a.dia - b.dia);



    totalUsuarios.value = response.data.data.map(item => item.total);


    /*van en el grafico */
    // series.value = totalUsuarios.value;
    series.value = desafios.value.map((ev)=> ev.total);

    // labels.value = desafios.value.map(item => item.tituloDesafio);
    labels.value = desafios.value.map((ev)=> ev.tituloDesafio);
  
    /*van en el grafico */


  } catch (error) {
    console.error('Error al obtener el total de usuarios:', error);
  } finally {
    cargando.value = false; // Finalizar carga
  }
};


// DESCARGAR
  const btnLoadingDescargar = ref(false);
  const dataFullExportar = ref([]);
  const urlApiExport = ref("https://servicio-niveles-puntuacion.vercel.app/grafico-backoffice/usuarios-x-desafio-listado/");
  const urlTitleExport = ref("usuarios_desafio_");

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
    console.log("items", items)

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
  async function getDataExportarServer(page = 1, limit = 10, platform = 0, idSemana = null, idDesafio = null) {
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

      var response = await fetch(`${urlApiExport.value}${idSemana}/${idDesafio}?page=${page}&limit=${limit}&platform=${platform}`, requestOptions);
      
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
  async function fetchFullDescargar(idSemana, idDesafio){

    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    dataFullExportar.value = [];
    var platform = platformModel.value;
    var idSemana = idSemana;
    var idDesafio = idDesafio;
    var pages = 1;
    while(true){
      const res = await getDataExportarServer(
        pages,
        500,
        platform,
        idSemana,
        idDesafio
      );

      const responseData = res.data;
      const totalDataExportar = "-";

      for(var keyUsuarioDesafio in responseData){
        const desafioData = responseData[keyUsuarioDesafio];
        const usuariosDesafios = desafioData.userId || {};

        // Nuevo objeto para cada elemento de responseData
        let newItem = {}; 

        // Recorremos las claves de usuarios
        for (let key in headersGlobal.value) {
            // Verificamos si la clave existe en item y la agregamos al nuevo objeto
            if (usuariosDesafios.hasOwnProperty(key)) {
              newItem[key] = usuariosDesafios[key];
            }else{
              newItem[key] = "";
            }
        }

        for (let key in desafioData) {
            // Verificamos si la clave existe en item y la agregamos al nuevo objeto
            if(key != "userId"){

              if (key == "platform_desafio") {
                newItem["platform_desafio"] = desafioData[key];
              }

            }
        }

        // newItem["reembolso_created_at"] = desafioData.created_at;
        // newItem["reembolso_estado"] = desafioData.estado;
        // newItem["created_at_reembolso"] = desafioData.created_at;
        
        // Agregamos el nuevo objeto a dataFullExportar.value
        dataFullExportar.value.push(newItem);
      }

      // responseData.forEach((usuariosDesafios) => {
        
      // });

      docsExportNumberLength.value.tamanioActual = dataFullExportar.value.length;
      docsExportNumberLength.value.tamanioTotal = totalDataExportar;

      dataFullExportar.value.sort((a, b) => moment(b.created_at_reembolso, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at_reembolso, 'DD/MM/YYYY-HH:mm:ss')));

      pages++;

      if(responseData.length < 1){
        break;
      }
    }

    // console.log(dataFullExportar.value)

    return true;
  };

  // PASO 1
  async function downloadSearch(index, idSemana, idDesafio) {
    try {

      registrosExportados.value = idDesafio;

      btnLoadingDescargar.value=true;
      await fetchFullDescargar(idSemana, idDesafio);
      btnLoadingDescargar.value=false;


      let doc = [];
      doc = dataFullExportar.value
      
      var title = `${urlTitleExport.value}_platform_`+generateSlug(platformModel.value);

      exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

      registrosExportados.value = 0;

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

  onMounted(obtenerSemanas);

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme()
// Función movida desde apexCharConfigDesafios
const getDonutChartConfig = theme => {
  return {
    stroke: { width: 0 },
    labels: labels.value,
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
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`,
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.colors['text-secondary'] },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
            name: {
              fontSize: '1.5rem',
            },
            value: {
              fontSize: '1.5rem',
              color: theme.colors['text-secondary'],
              formatter: val => `${parseInt(val, 10)}`,
            },
            total: {
              show: false,
              fontSize: '1.5rem',
              label: 'Operativo',
              formatter: () => '31%',
              color: theme.colors['text-secondary'],
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1rem',
                  },
                },
              },
            },
          },
        },
      },
    ],
  }
}

const expenseRationChartConfig = computed(() => getDonutChartConfig(vuetifyTheme.current.value))

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
    <VCard class="v-col-12 pb-5 pt-5">
    <VCardItem>
      <VRow class="pb-5">
        <VCol cols="12" md="5">
          <VCardTitle class="ps-0 pb-0">
            <VIcon size="25" icon="tabler-chart-donut" /> Análisis para el módulo
          </VCardTitle>
          <div class="py-9 d-flex align-center" v-if="cargando">
            <VProgressCircular indeterminate color="primary" />
            <span class="ml-2 ">Cargando datos...</span>
          </div>
          <div class="py-9 d-block" v-else-if="totalUsuarios.length === 0">
            No hay datos para mostrar
          </div>

          <div class="py-9" v-else>
            <VueApexCharts type="donut" height="410" :options="expenseRationChartConfig" :series="series" />
          </div>
        </VCol>
        <VCol cols="12" md="7">
          <VCardTitle class="ps-0 pb-4">
            <VIcon size="25" icon="tabler-filter" />
            Filtros

            <div class="d-flex flex-wrap gap-3 mt-5">
              <VSelect v-model="semanaSeleccionada" :items="items" label="Semana" item-title="title" item-value="value"
                @update:model-value="obtenerTotalUsuarios">
                <template v-slot:item="{ props, item }">
                  <VListItem v-bind="props" :title="item.raw.title">
                    <template v-slot:subtitle>
                      {{ item.raw.description }}
                    </template>
                  </VListItem>
                </template>
              </VSelect>
              <VSelect v-model="platformModel" :items="platformList" label="Filtro por dispositivo" item-title="title" item-value="value" @update:model-value="obtenerTotalUsuarios" />
            </div>
            <div class="py-9 d-block" v-if="cargando">
              <VProgressCircular indeterminate color="primary" />
              <span class="ml-2">Cargando datos...</span>
            </div>
            <div class="py-9 d-block" v-else-if="desafios.length === 0">
              No hay datos para mostrar
            </div>
            <div v-else class="mt-9">
              <VCardTitle class="ps-0 pb-0">
                <VIcon size="25" icon="tabler-notes" />
                Listado de Desafío
              </VCardTitle>
              <VList class="mt-2" lines="two" border>
                <template v-for="(desafio, index) in desafios" :key="index">
                  <VListItem>
                    <template #prepend>
                      <VAvatar rounded="sm" size="x-large" class="">
                        <!-- <VIcon size="50" icon="tabler-video" /> -->
                        <VImg :src="desafio.URLSticker" />
                      </VAvatar>
                    </template>
                    <div style="width: 86%;">
                      <VListItemTitle>
                        <VChip label size="x-small">
                          {{ desafio.nombreDia }}
                        </VChip>
                        {{ desafio.tituloDesafio }} - {{ desafio.tituloSticker }}
                      </VListItemTitle>
                      <VListItemSubtitle class=""
                        style="width: 100%;display: block;text-wrap: wrap;line-height: normal;">
                        <small>{{ desafio.leyenda }}</small>
                      </VListItemSubtitle>

                    </div>

                    <template #append>
                      <div class="d-flex gap-5 justify-center align-center">
                        <div>
                          <VListItemTitle>
                            <div class="d-flex justify-center align-center">
                              <VIcon size="18" icon="tabler-user" />
                              {{ desafio.total }}
                            </div>
                          </VListItemTitle>
                        </div>
                        <div class="d-flex flex-column">
                          <VBtn color="success" size="small"
                            @click="downloadSearch(index, semanaSeleccionada, desafio.idDesafio)"
                            :loading="registrosExportados == desafio.idDesafio" :disabled="btnLoadingDescargar">
                            <VIcon size="20" icon="tabler-download" />
                            CSV
                          </VBtn>
                          <VChip v-if="registrosExportados == desafio.idDesafio" size="x-small" class="mt-1">
                            Exportando {{ docsExportNumberLength.tamanioActual }}
                          </VChip>
                        </div>

                      </div>
                    </template>

                  </VListItem>

                </template>
              </VList>
            </div>
          </VCardTitle>
        </VCol>
      </VRow>

    </VCardItem>
  </VCard>
  </section>
  

</template>

<style>
.v-theme--dark .apexcharts-legend-text {
  color: #fff !important;
}
</style>
