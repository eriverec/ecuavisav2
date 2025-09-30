<script setup>
import datos_bar_vertical_noticias_por_hora from '@/views/apps/radar/v2/datos_bar_vertical_noticias_por_hora.vue';
import plantilla_articulos_estilo_principal from '@/views/apps/radar/v2/plantilla_articulos_estilo_principal.vue';
// import ApexChartPasteTotalDia from '@/views/apps/radar/pastel-ultimas-noticias-total-diav2.vue';
// import ApexChartExpenseRatio from '@/views/apps/radar/pastel-ultimas-noticiasv2.vue';
import pastelWordCloud from '@/views/apps/radar/v2/pastel-word-cloud.vue';
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

const lastUpdate = ref({
  fechai: moment().startOf('day').format("YYYY-MM-DD HH:mm"),
  fechaf: moment().format("YYYY-MM-DD HH:mm")
})

const filtrosActivos = reactive({
  busqueda: "",
  sitio: [],
  seccion: [],
  subseccion: [],
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

function mergeVerticalsByLink(array) {
  const grouped = {};

  array.forEach(item => {
    let link = item.link;

    // Normalizar la URL eliminando el protocolo (http:// o https://)
    if (typeof link === "string") {
      link = link.replace(/^https?:\/\//, ""); // Remueve el protocolo
    }

    if (!grouped[link]) {
      grouped[link] = { ...item, verticalLocal: new Set(), subVerticalLocal: new Set() };
    }

    if (item.verticalLocal) grouped[link].verticalLocal.add(item.verticalLocal);
    if (item.subVerticalLocal) grouped[link].subVerticalLocal.add(item.subVerticalLocal);
  });

  return Object.values(grouped).map(entry => ({
    ...entry,
    verticalLocal: Array.from(entry.verticalLocal).join(","),
    subVerticalLocal: Array.from(entry.subVerticalLocal).join(",")
  }));
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

function limpiarEspacios(texto) {
    return texto.replace(/\s*,\s*/g, ',');
}

function extraerPaths(url) {
  try {
    const urlObj = new URL(url);
    const paths = urlObj.pathname.split('/').filter(Boolean); // Eliminar vacíos

    let resultado = { primero: "", segundo: "", ultimo: "" };

    if(url.includes("/rss/portada")){
      resultado.primero = "PRINCIPAL";
      resultado.segundo = "";
      resultado.ultimo = "";
      return resultado;
    }

    if (paths.length === 1) {
      resultado.primero = paths[0].toUpperCase();
    } else if (paths.length === 2) {
      resultado.primero = paths[0].toUpperCase();
      resultado.segundo = paths[1].toUpperCase();
      resultado.ultimo = "";
    } else if (paths.length >= 3) {
      resultado.primero = paths[0].toUpperCase();
      resultado.ultimo = paths[1].toUpperCase();
      resultado.segundo = paths[paths.length - 1].toUpperCase();
    }else{
      resultado.primero = "PRINCIPAL";
      resultado.segundo = "";
      resultado.ultimo = "";
    }

    return resultado;
  } catch (error) {
    console.warn("URL inválida:", url);
    return { primero: null, segundo: null, ultimo: null };
  }
}

const principalData = async function () {
  try {
    filtrosActivos.busqueda = "";
    filtrosActivos.sitio = [];
    filtrosActivos.seccion = [];
    filtrosActivos.subseccion = [];

    loadingData.value = true;

    const endpoints = ["https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/config.php?api=all"];

    // Create an array of promises for all endpoints
    const fetchPromises = Object.entries(endpoints).map(([key, url]) => fetchAndProcess(url));
    const results = await Promise.all(fetchPromises);
    const allResults = [];
    for(var i in results[[0]]){
      const {media_communication = ""} = results[0][i];
      if(!["nytimes","elpais", "cnnespanol"].includes(media_communication)){
        if(results[0][i]?.articles){
          for(var j in results[0][i].articles){
            if(!results[0][i]?.articles[j].hasOwnProperty("getArticle")){
              //Añadir url_communication a cada artículo
              allResults.push({
                ...results[0][i]?.articles[j], 
                media_communication: results[0][i]?.media_communication,
                url_communication: results[0][i]?.url_communication,
              });
            }
          }
        }
      }
    }

    const datosAgrupados = agruparPorAtributo(allResults, "media_communication");

    // Recorrer cada grupo de media_communication
    let indiceColor = 0;

    const newData = [];

    Object.entries(datosAgrupados).forEach(([media_communication, noticias, url_communication]) => {
        // console.log(`Noticias de ${media_communication}:`);
        indiceColor++;
        if(indiceColor > customColors.length - 1){
          indiceColor = 0;
        }

        const notciasTemp = [];

        noticias.forEach(noticia => {
            noticia.color = customColors[indiceColor];
            noticia.sitio = media_communication;

            if(!noticia.titulo){
              noticia.titulo = noticia.title;
            }else if(!noticia.title){
              noticia.title = noticia.titulo;
            }
            
            noticia.enlace = noticia.link;
            noticia.picture = noticia.image;
            noticia.tags = noticia.tags;
            noticia.tipo = noticia.tipo;
            noticia.vertical = noticia.seccion;
            noticia.subVertical = noticia.subseccion;
            if(noticia.keywords){
              noticia.keywords = limpiarEspacios(noticia.keywords.toUpperCase());
              noticia.tags = limpiarEspacios(noticia.tags.toUpperCase());
            }

            if(noticia.url_communication){
              const paths = extraerPaths(noticia.url_communication);
              noticia.verticalLocal = paths.primero;
              noticia.subVerticalLocal = paths.segundo;
            }

            // console.log("noticia.keywords", noticia.keywords)

            if(noticia.fechaPublicacion){
              noticia.fechaPublicacion = moment(noticia.fechaPublicacion, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") || ""
            }else{
              noticia.fechaPublicacion = "Sin fecha";
            }

            if(!noticia.hasOwnProperty("getArticle")){
              notciasTemp.push(noticia);
            }
            
        });

        newData.push(...notciasTemp)
    });

    const combinedData = [...newData];

    const uniqueData = mergeVerticalsByLink(combinedData, "link");
    // console.log("uniqueData", uniqueData.splice(0, 10))

    const sortedData = uniqueData.sort((a, b) => {
      const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss", true);
      const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss", true);

      if (!dateA.isValid() && !dateB.isValid()) return 0;
      if (!dateA.isValid()) return 1;
      if (!dateB.isValid()) return -1;

      return dateB - dateA;
    });

    dataAll.value = sortedData;
    dataManipulable.value = sortedData;

    lastUpdate.value.fechaf = moment(sortedData[0].fechaPublicacion, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm");

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
    const response = await fetch("https://servicio-competencias.vercel.app/scrapper-rule/all?page=1&limit=1000&keys=_id,media_communication,key,url_communication");
    const dataResp = await response.json();

    // const dataResp = {
    //   "resp": true,
    //   "data": [
    //   {
    //   "_id": "67d9b104816d7703499f1e6f",
    //   "key": "ecuavisa",
    //   "url_communication": "https://www.ecuavisa.com/",
    //   "media_communication": "ecuavisa"
    //   },
    //   {
    //   "_id": "67d9a8b218e7e47e13531540",
    //   "key": "infobae",
    //   "url_communication": "https://www.infobae.com/america/",
    //   "media_communication": "infobae"
    //   },
    //   {
    //   "_id": "67d9a88e18e7e47e13531539",
    //   "key": "tctelevision-video-tc-deportes",
    //   "url_communication": "https://tctelevision.com/video/tc-deportes/",
    //   "media_communication": "tctelevision"
    //   },
    //   {
    //   "_id": "67d9a74a9bfb3d7f9e24ec3e",
    //   "key": "tctelevision",
    //   "url_communication": "https://tctelevision.com/",
    //   "media_communication": "tctelevision"
    //   },
    //   {
    //   "_id": "67d9a50fff24113a34723609",
    //   "key": "expreso",
    //   "url_communication": "https://www.expreso.ec/",
    //   "media_communication": "expreso"
    //   },
    //   {
    //   "_id": "67d9a498d004fa6fd131bf28",
    //   "key": "primicias",
    //   "url_communication": "https://www.primicias.ec/",
    //   "media_communication": "primicias"
    //   },
    //   {
    //   "_id": "67d9a4448dea2fecb65e6550",
    //   "key": "ecuavisa-ultimas-noticias",
    //   "url_communication": "https://www.ecuavisa.com/ultimas-noticias",
    //   "media_communication": "ecuavisa"
    //   },
    //   {
    //   "_id": "67d4ac8038147174a31ef3b5",
    //   "key": "ecuavisa-deportes",
    //   "url_communication": "https://www.ecuavisa.com/deportes",
    //   "media_communication": "ecuavisa"
    //   }
    //   ],
    //   "total": 8,
    //   "limit": 1000,
    //   "page": 1
    // };
    if(dataResp.resp){
      itemsSitioWeb.value = dataResp.data.map(e => {
        return {
          value: e.media_communication,
          title: e.media_communication.toUpperCase(),
        }
      }).filter(e => {
        const { value = "" } = e;
        return !["nytimes","elpais", "cnnespanol"].includes(value);
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

const normalizeText = (text) => {
  return text
    ? text
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Elimina tildes
        .replace(/\s+/g, "") // Reemplaza múltiples espacios por uno
        .trim() // Elimina espacios al inicio y al final
        .toLowerCase() // Convierte todo a minúsculas
    : "";
};

const filteredFunction = function() {
  const query = filtrosActivos.busqueda?.toLowerCase() || "";
  const sitioValue = filtrosActivos.sitio || [];
  const sitiosSeleccionados = sitioValue.map(e => e.value);
  const secciones = filtrosActivos.seccion || [];
  const subseccion = filtrosActivos.subseccion || [];

  return dataAll.value
    .filter(item => {
      const matchesBusqueda = !query || normalizeText(item.titulo).includes(normalizeText(query));
      const matchesBusquedaKeyWords = normalizeText(item.keywords).includes(normalizeText(query));
      const matchesBusquedaAutor = normalizeText(item.autor).includes(normalizeText(query));

      const matchesSitio = sitiosSeleccionados.length === 0 || sitiosSeleccionados.includes(item.sitio);
      const verticalName = item.verticalLocal?.toUpperCase();
      const subVerticalName = item.subVerticalLocal?.toUpperCase();
      const matchesSecciones = secciones.length === 0 || secciones.includes(verticalName);
      const matchesSubseccion = subseccion.length === 0 || subseccion.includes(subVerticalName);
      return (matchesBusqueda || matchesBusquedaKeyWords || matchesBusquedaAutor) && matchesSitio && matchesSecciones && matchesSubseccion;
    })
    // .sort((a, b) => {
    //   const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
    //   const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
    //   return dateB - dateA; // Ordena de más reciente a más antiguo
    // });
    .sort((a, b) => {
      const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss", true);
      const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss", true);

      if (!dateA.isValid() && !dateB.isValid()) return 0;
      if (!dateA.isValid()) return 1;
      if (!dateB.isValid()) return -1;

      return dateB - dateA;
    });
};

watch(filtrosActivos, (newVal) => {
  clearTimeout(debounceTimeout.value);
  debounceTimeout.value = setTimeout(() => {
    dataManipulable.value = filteredFunction() || [];
    // procesarKeywordsAndTags(dataManipulable.value);
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

  const procesarItems = (items) => {
    items.forEach(item => {
      if (item.verticalLocal) {
        // Dividir la cadena en múltiples verticales y agregar cada uno al Set
        item.verticalLocal.split(",").forEach(vertical => {
          const name = vertical.trim().toUpperCase();
          if (name) {
            uniqueVerticals.add(name);
          }
        });
      }
    });
  };

  if (!objeto) {
    procesarItems(data.value);
  } else {
    procesarItems(objeto);
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
  const uniqueSubVerticals = new Set();

  const procesarItems = (items) => {
    items.forEach(item => {
      if (item.subVerticalLocal) {
        // Dividir la cadena en múltiples subvertical y agregar cada uno al Set
        item.subVerticalLocal.split(",").forEach(subvertical => {
          const name = subvertical.trim().toUpperCase();
          if (name) {
            uniqueSubVerticals.add(name);
          }
        });
      }
    });
  };

  if (!objeto) {
    procesarItems(data.value);
  } else {
    procesarItems(objeto);
  }

  return Array.from(uniqueSubVerticals).sort((a, b) => a.localeCompare(b));
}

/*
******* FIN FILTRO SUBSECCIONES
*/

/*
******* INICIO FILTRO pastelWordCloud
*/
const topKeywords = ref([]);
const topTags = ref([]);
const allKeywords = ref([]);
const allTags = ref([]);

const parseItems = (items) => {
  if (!items) return [];
  
  try {
    if (typeof items === 'string') {
      return items.split(',').map(i => i.trim()).filter(Boolean);
    } else if (Array.isArray(items)) {
      return items.map(i => (typeof i === 'string' ? i.trim() : String(i))).filter(Boolean);
    } else if (typeof items === 'object') {
      return [String(items)].filter(Boolean);
    }
  } catch (err) {
    console.warn('Error al procesar items:', err);
  }
  
  return [];
};

const procesarItems = (articles, key) => {
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    console.warn(`No hay artículos para procesar ${key}`);
    return { topItems: [], allItems: [] };
  }

  try {
    const itemData = {};

    articles.forEach(article => {
      if (article && article[key]) {
        const items = parseItems(article[key]);
        items.forEach(item => {
          if (!itemData[item]) {
            itemData[item] = { count: 0, articles: [] };
          }
          itemData[item].count += 1;
          itemData[item].articles.push(article);
        });
      }
    });

    // Ordenar por frecuencia
    const sortedItems = Object.entries(itemData)
      .filter(([item]) => item && item.trim())
      .sort(([, a], [, b]) => b.count - a.count);

    // Formatear los datos
    const topItems = sortedItems.slice(0, 10).map(([label, data]) => ({
      label,
      value: data.count,
      articles: data.articles,
    }));

    const allItems = sortedItems.map(([label, data]) => ({
      label,
      value: data.count,
      articles: data.articles,
    }));

    // console.log(`Procesadas ${allItems.length} ${key}, top 10 ${key}:`, topItems);

    return { topItems, allItems };
  } catch (err) {
    console.error(`Error al procesar ${key}:`, err);
  }
};

// Uso para keywords y tags

// Wrappers específicos
const procesarKeywords = (articles) => {
  // procesarMetadatos(articles, 'keywords', topKeywords, allKeywords);
  const resp = procesarItems(articles, 'keywords');
  allKeywords.value = resp.allItems;
  topKeywords.value = resp.topItems;
}

const procesarTags = (articles) => {
  // procesarMetadatos(articles, 'tags', topTags, allTags);
  const resp = procesarItems(articles, 'tags');
  allTags.value = resp.allItems;
  topTags.value = resp.topItems;
}

function procesarKeywordsAndTags(articles){
  procesarKeywords(articles);
  procesarTags(articles);
}

/*
******* FIN FILTRO pastelWordCloud
*/

onMounted(async () => {
  await principalData();
  await loadSiteNames();

  itemsSitioWebSeccion.value = getUniqueVerticals(dataAll.value);
  itemsSitioWebSubSeccion.value = getUniqueSubVerticals(dataAll.value);

  procesarKeywordsAndTags(dataAll.value);
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
                      {{ dataAll.length }} Artículo(s).
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
                    Datos: {{ lastUpdate.fechai }}, {{ lastUpdate.fechaf }}
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
        <datos_bar_vertical_noticias_por_hora :articulos="dataAll" :disabledAll="false" :height="310" />
      </VCol>
      <VCol cols="12" sm="12" lg="12">
        <pastelWordCloud v-if="topKeywords.length > 0" :limitKeywords="75" :data="allKeywords" :dataTags="allTags" :dataListArticles="dataAll" />
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
        <plantilla_articulos_estilo_principal :articulos="filteredData" :filtrosActivos="filtrosActivos" />
      </VCol>
    </VRow>
  </section>
</template>
<style scoped>
  .title-principal{
    font-size: 25px;
  }
</style>