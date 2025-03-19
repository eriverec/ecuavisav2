<script setup>
import datos_bar_vertical_noticias_por_hora from '@/views/apps/radar/v2/datos_bar_vertical_noticias_por_hora.vue';
import ApexChartPasteTotalDia from '@/views/apps/radar/pastel-ultimas-noticias-total-diav2.vue';
import ApexChartExpenseRatio from '@/views/apps/radar/pastel-ultimas-noticiasv2.vue';
import pastelWordCloud from '@/views/apps/radar/pastel-word-cloud.vue';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { computed, onMounted, reactive, ref, watch } from 'vue';

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000
})

const filtrosActivos = reactive({
  busqueda: null,
  sitio: null,
  seccion: null,
  subseccion: null,
  disabled: false
});

const customColors = [
  '#ffe802',
  '#836af9',
  '#2c9aff',
  '#ffcf5c',
  '#4f5d70',
  '#299aff',
  '#d4e157',
  '#28dac6',
  '#9e69fd',
  '#ff9800',
  '#26c6da',
  '#ff8131',
  '#28c76f',
  '#ffbd1f',
  '#84d0ff',
  '#edf1f4',
  '#ff9f43',
]

const loadingData = ref(false);

/*
******* INICIO RECUPERAR ARTÍCULOS
*/
async function fetchAndProcess(url) {
  try {
    const response = await fetch(url);
    const dataResp = await response.json();
    // return unificarYFiltrarDuplicados(dataResp.filter(Boolean));
    return dataResp.map(e => {
      if(e.articles){
        return e;
      }
    });
  } catch (error) {
    return null;
  }
}

const dataAll = ref([]);
const dataManipulable = ref([]);

function removeDuplicates(array, key) {
  const seen = new Set();
  return array.filter(item => {
    let value = item[key];

    // Normalizar la URL eliminando el protocolo (http:// o https://)
    if (typeof value === "string") {
      value = value.replace(/^https?:\/\//, ""); // Remueve el protocolo
    }

    if (seen.has(value)) {
      return false; // Ya existe, lo descartamos
    }
    seen.add(value);
    return true; // Es único, lo mantenemos
  });
}

function agruparPorAtributo(data, atributo) {
  if(!atributo){
    return [];
  }

  return data.reduce((agrupado, item) => {
      const valor = item[atributo] || "";
      if (!agrupado[valor]) {
          agrupado[valor] = [];
      }
      agrupado[valor].push(item);
      return agrupado;
  }, {});
}

const principalData = async function () {
  try {
    loadingData.value = true;

    const endpoints = ["https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/config.php?api=all"];

    // Create an array of promises for all endpoints
    const fetchPromises = Object.entries(endpoints).map(([key, url]) => fetchAndProcess(url));
    const results = await Promise.all(fetchPromises);
    const allResults = [];

    for(var i in results[[0]]){
      if(results[0][i]?.articles){
        for(var j in results[0][i].articles){
          if(!results[0][i]?.articles[j].hasOwnProperty("getArticle")){
            allResults.push({...results[0][i]?.articles[j], media_communication: results[0][i]?.media_communication});
          }
        }
      }
    }

    const datosAgrupados = agruparPorAtributo(allResults, "media_communication");

    // Recorrer cada grupo de media_communication
    let indiceColor = 0;

    const newData = [];

    Object.entries(datosAgrupados).forEach(([media_communication, noticias]) => {
        // console.log(`Noticias de ${media_communication}:`);
        indiceColor++;
        if(indiceColor > customColors.length - 1){
          indiceColor = 0;
        }

        noticias.forEach(noticia => {
            noticia.color = customColors[indiceColor];
            noticia.sitio = media_communication
            noticia.titulo = noticia.title;
            noticia.enlace = noticia.link;
            noticia.picture = noticia.image;
            noticia.tags = noticia.tags;
            noticia.tipo = noticia.tipo;
            noticia.vertical = noticia.seccion;
            noticia.subVertical = noticia.subseccion;

            if(noticia.fechaPublicacion){
              noticia.fechaPublicacion = moment(noticia.fechaPublicacion, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") || ""
            }else{
              console.log("noticia.link", noticia.link)
              noticia.fechaPublicacion = moment().subtract(1, 'hour').format("DD/MM/YYYY HH:mm:ss")
            }

            
        });

        newData.push(...noticias)
    });

    const combinedData = [...newData];

    const uniqueData = removeDuplicates(combinedData, "link");

    const sortedData = uniqueData.sort((a, b) => {
      const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      return dateB - dateA;
    });

    dataAll.value = sortedData;
    dataManipulable.value = sortedData;
    loadingData.value = false;
    return true;
  } catch (error) {
    loadingData.value = false;
    console.log('Error:', error);
    snackbar.value = {
      show: true,
      text: `Error en principalData. Intente nuevamente`,
      color: 'error'
    }
    return null;
  }
}
/*
******* FIN RECUPERAR ARTÍCULOS
*/

/*
******* INICIO RECUPERAR SITIOS WEBS
*/
const itemsSitioWeb = ref([]);

async function loadSiteNames() {
  try {
    // const response = await fetch("https://servicio-competencias.vercel.app/scrapper-rule/all?page=1&limit=1000&keys=_id,media_communication,key,url_communication");
    // const dataResp = await response.json();

    const dataResp = {
      "resp": true,
      "data": [
      {
      "_id": "67d9b104816d7703499f1e6f",
      "key": "ecuavisa",
      "url_communication": "https://www.ecuavisa.com/",
      "media_communication": "ecuavisa"
      },
      {
      "_id": "67d9a8b218e7e47e13531540",
      "key": "infobae",
      "url_communication": "https://www.infobae.com/america/",
      "media_communication": "infobae"
      },
      {
      "_id": "67d9a88e18e7e47e13531539",
      "key": "tctelevision-video-tc-deportes",
      "url_communication": "https://tctelevision.com/video/tc-deportes/",
      "media_communication": "tctelevision"
      },
      {
      "_id": "67d9a74a9bfb3d7f9e24ec3e",
      "key": "tctelevision",
      "url_communication": "https://tctelevision.com/",
      "media_communication": "tctelevision"
      },
      {
      "_id": "67d9a50fff24113a34723609",
      "key": "expreso",
      "url_communication": "https://www.expreso.ec/",
      "media_communication": "expreso"
      },
      {
      "_id": "67d9a498d004fa6fd131bf28",
      "key": "primicias",
      "url_communication": "https://www.primicias.ec/",
      "media_communication": "primicias"
      },
      {
      "_id": "67d9a4448dea2fecb65e6550",
      "key": "ecuavisa-ultimas-noticias",
      "url_communication": "https://www.ecuavisa.com/ultimas-noticias",
      "media_communication": "ecuavisa"
      },
      {
      "_id": "67d4ac8038147174a31ef3b5",
      "key": "ecuavisa-deportes",
      "url_communication": "https://www.ecuavisa.com/deportes",
      "media_communication": "ecuavisa"
      }
      ],
      "total": 8,
      "limit": 1000,
      "page": 1
    };
    if(dataResp.resp){
      itemsSitioWeb.value = dataResp.data.map(e => {
        return {
          value: e.media_communication,
          title: e.media_communication.toUpperCase(),
        }
      });

      const uniqueData = Array.from(new Map(itemsSitioWeb.value.map(item => [item.value, item])).values());
      itemsSitioWeb.value = uniqueData;
      return itemsSitioWeb.value;
    }else{
      snackbar.value = {
        show: true,
        text: `Error, no se pudo listar los medios del select, intente nuevamente`,
        color: 'error'
      }
      return [];
    }
    
  } catch(error) {
    snackbar.value = {
      show: true,
      text: `Error, no se pudo listar los medios del select, intente nuevamente`,
      color: 'error'
    }
    console.error(error)
    return [];
  }
}
/*
******* FIN RECUPERAR SITIOS WEBS
*/

/*
******* INICIO MANIPULAR DATOS
*/
const debounceTimeout = ref(null);

// Filtrado de datos (sin debounce)
const filteredData = computed(() => dataManipulable.value);

const filteredFunction = function() {
  const query = filtrosActivos.busqueda?.toLowerCase() || "";
  const sitioValue = filtrosActivos.sitio || [];
  const sitiosSeleccionados = sitioValue.map(e => e.value);
  const secciones = filtrosActivos.seccion || [];
  const subseccion = filtrosActivos.subseccion || [];

  return dataAll.value
    .filter(item => {
      const matchesBusqueda = !query || item.titulo?.toLowerCase().includes(query);
      const matchesSitio = sitiosSeleccionados.length === 0 || sitiosSeleccionados.includes(item.sitio);
      const verticalName = item.vertical?.toUpperCase();
      const subVerticalName = item.subVertical?.toUpperCase();
      const matchesSecciones = secciones.length === 0 || secciones.includes(verticalName);
      const matchesSubseccion = subseccion.length === 0 || subseccion.includes(subVerticalName);
      return matchesBusqueda && matchesSitio && matchesSecciones && matchesSubseccion;
    })
    .sort((a, b) => {
      const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      return dateB - dateA; // Ordena de más reciente a más antiguo
    });
};

watch(filtrosActivos, (newVal) => {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    dataManipulable.value = filteredFunction() || [];
  }, 700);
}, { immediate: true });

/*
******* FIN MANIPULAR DATOS
*/

/*
******* INICIO FILTRO SECCIONES
*/
const itemsSitioWebSeccion = ref([]);
function getUniqueVerticals(objeto = null) {
  const uniqueVerticals = new Set();

  if (!objeto) {
    data.value.forEach(item => {
      const name = item.vertical?.toUpperCase();
      if (name) {
        uniqueVerticals.add(name);
      }
    });
  } else {
    objeto.forEach(item => {
      const name = item.vertical?.toUpperCase();
      if (name) {
        uniqueVerticals.add(name);
      }
    });
  }

  return Array.from(uniqueVerticals).sort((a, b) => a.localeCompare(b));
}

/*
******* FIN FILTRO SECCIONES
*/

/*
******* INICIO FILTRO SUBSECCIONES
*/
const itemsSitioWebSubSeccion = ref([]);
function getUniqueSubVerticals(objeto = null) {
  const uniqueVerticals = new Set();

  if (!objeto) {
    data.value.forEach(item => {
      const name = item.subVertical?.toUpperCase();
      if (name) {
        uniqueVerticals.add(name);
      }
    });
  } else {
    objeto.forEach(item => {
      const name = item.subVertical?.toUpperCase();
      if (name) {
        uniqueVerticals.add(name);
      }
    });
  }

  return Array.from(uniqueVerticals).sort((a, b) => a.localeCompare(b));
}

/*
******* FIN FILTRO SUBSECCIONES
*/

onMounted(async () => {
  await loadSiteNames();
  await principalData();


  itemsSitioWebSeccion.value = getUniqueVerticals(dataAll.value);
  itemsSitioWebSubSeccion.value = getUniqueSubVerticals(dataAll.value);
});

</script>

<template>
  <section>
    <VSnackbar 
      v-model="snackbar.show" 
      :color="snackbar.color" 
      :timeout="snackbar.timeout" 
      location="top end">
      {{ snackbar.text }}
    </VSnackbar>
    <VRow>
      <VCol cols="12" md="12" lg="12">
        <VCard>
          <VCardItem>
            <div class="d-flex content-title flex-wrap w-100">
              <div class="d-flex gap-3 justify-space-between w-100">
                <div class="d-flex flex-column" style="line-height: 1.3;">
                  <h4 class="title-principal">Últimas noticias</h4>
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;">Total de artículos procesados</small>
                    <VChip size="x-small" color="primary">
                      {{ filteredData.length }} Artículo(s).
                    </VChip>
                  </div>
                  <div class="content-btn mt-3">
                    <VBtn :loading="loadingData" title="Recargar datos" @click="principalData" target="_blank"
                      color="primary" variant="tonal" size="small">
                      <VIcon icon="tabler-reload" /> Recargar datos
                    </VBtn>
                  </div>
                </div>
                <div class="d-flex align-center gap-2 flex-column ">
                  <VChip class="d-none" color="primary" size="small" prepend-icon="tabler-clock">
                    Última actualización: {{ lastUpdate }}
                  </VChip>
                  <VChip class="d-none" color="success" size="small" prepend-icon="tabler-clock">
                    Próxima actualización: {{ nextUpdate }}
                  </VChip>
                </div>
              </div>
            </div>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="12" lg="12">
        <VCard>
          <VCardItem>
            <VCardTitle>
              <h4 class="text-h6 mb-0">
                <VIcon
                  icon="tabler-filter"
                  size="32"
                />
                Filtros
              </h4>
            </VCardTitle>
            <VRow>
              <VCol cols="12" md="4" lg="4">
                <div class="w-100 mt-4">
                  <label>Filtrar por sitio web</label>
                  <VCombobox v-model="filtrosActivos.sitio" :items="itemsSitioWeb" multiple chips
                    :menu-props="{ maxHeight: '300' }" />
                </div>
              </VCol>
              <VCol cols="12" md="8" lg="8">
                <div class="w-100 mt-4">
                  <label>Buscar por, título, autor, sección, subsección</label>
                  <VTextField 
                    v-model="filtrosActivos.busqueda"
                    prepend-inner-icon="tabler-search"
                    density="compact" 
                    style="padding: 0px 0;" 
                    clearable 
                  />
                </div>
              </VCol>
              <VCol cols="12" md="4" lg="6">
                <div class="w-100">
                  <label>Filtrar por Sección</label>
                  <VCombobox v-model="filtrosActivos.seccion" :items="itemsSitioWebSeccion" multiple chips
                    :menu-props="{ maxHeight: '300' }" />
                </div>
              </VCol>
              <VCol cols="12" md="4" lg="6">
                <div class="w-100">
                  <label>Filtrar por SubSección</label>
                  <VCombobox v-model="filtrosActivos.subseccion" :items="itemsSitioWebSubSeccion" multiple chips
                    :menu-props="{ maxHeight: '300' }" />
                </div>
              </VCol>
            </VRow>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="12" lg="12">
        <datos_bar_vertical_noticias_por_hora :articulos="filteredData" />
      </VCol>
    </VRow>
  </section>
</template>
<style scoped>
  .title-principal{
    font-size: 25px;
  }
</style>