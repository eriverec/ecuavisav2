<script setup>
import plantilla_articulos_estilo_principal_ia from '@/views/apps/radar/v2/plantilla_articulos_estilo_principal_ia.vue';
import Moment from "moment";
import { extendMoment } from "moment-range";
import esLocale from "moment/locale/es";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from 'vue-router';
import lectorMD from './lectorMD.js';
import { LocalStorageCRUD } from './LocalStorageCRUD.js';
const router = useRouter();

const moment = extendMoment(Moment);
moment.locale("es", [esLocale]);

const snackbar = ref({
	show: false,
	text: "",
	color: "success",
	timeout: 3000,
});

// Opciones de inicio
const loadingData = ref(false);
const filtrosActivos = reactive({
  busqueda: "",
  sitio: [],
  seccion: [],
  subseccion: [],
  vertical: [],
  keywords: [],
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
// Fin de opciones de inicio

localStorage.removeItem('notasSEO');

// Obtener artículos
/**
 * Limpia los espacios en blanco alrededor de las comas en un texto.
 * @param {string} texto - Texto a limpiar
 * @returns {string} Texto con los espacios alrededor de las comas eliminados
 */
function limpiarEspacios(texto) {
    try {
      if(typeof texto !== "string" && (!Array.isArray(texto) && typeof texto !== "object")){
        return "";
      }

      if(Array.isArray(texto)){
        return texto.map(e => e.trim()).join(',').replace(/,/g, ',')?.toUpperCase();
      }
      
      return texto.replace(/\s*,\s*/g, ',')?.toUpperCase();
    } catch (error) {
      return "";
    }
}

/**
 * Extrae las partes de una URL y las devuelve en un objeto con las propiedades primero, segundo y ultimo.
 * @param {string} url - URL a analizar
 * @returns {Object} Objeto con las partes de la URL
 */
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

/**
 * Agrupa un array de objetos por el valor de un atributo específico.
 * @param {Array} data - Array de objetos a agrupar
 * @param {string} atributo - Nombre del atributo por el cual agrupar
 * @returns {Object} Objeto con las agrupaciones
 */
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

const dataAll = ref([]);
const dataManipulable = ref([]);

/**
 * Combina verticales y subverticales duplicadas para el mismo enlace.
 * @param {Array} array - Array de artículos a procesar
 * @returns {Array} Array con los artículos combinados
 */
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

/**
 * Realiza una petición HTTP y procesa la respuesta JSON.
 * @param {string} url - URL del endpoint a consultar
 * @returns {Promise<Array>} Promesa con los datos procesados
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

/**
 * Función principal que obtiene y procesa los datos de los artículos desde la API.
 * Realiza la carga de datos, formatea la información y actualiza el estado de la aplicación.
 * @returns {Promise<boolean>} true si la operación fue exitosa, null en caso de error
 */
const principalData = async function () {
  try {
    filtrosActivos.busqueda = "";
    filtrosActivos.sitio = [];
    filtrosActivos.seccion = [];
    filtrosActivos.subseccion = [];
    filtrosActivos.keywords = [];
    filtrosActivos.vertical = [];

    const endpoints = ["https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/config.php?api=all"];

    // Create an array of promises for all endpoints
    const fetchPromises = Object.entries(endpoints).map(([key, url]) => fetchAndProcess(url));
    const results = await Promise.all(fetchPromises);
    const allResults = [];
    for(var i in results[[0]]){
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
            noticia.selected = false;
            if(noticia.keywords){
              noticia.keywords = limpiarEspacios(noticia.keywords);
              noticia.tags = limpiarEspacios(noticia.tags);
            }

            if(noticia.url_communication){
              const paths = extraerPaths(noticia.url_communication);
              noticia.verticalLocal = paths.primero;
              noticia.subVerticalLocal = paths.segundo;
            }

            // console.log("noticia.keywords", noticia.keywords)

            if(noticia.fechaPublicacion){
              noticia.fechaPublicacion = moment(noticia.fechaPublicacion, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") || ""
            }

            if(!noticia.hasOwnProperty("getArticle") && noticia.fechaPublicacion){
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
    return true;
  } catch (error) {
    console.log('Error:', error);
    snackbar.value = {
      show: true,
      text: `Error en principalData. Intente nuevamente`,
      color: 'error'
    }
    return null;
  }
}
// Fin optener los artículos

/*
******* INICIO RECUPERAR SITIOS WEBS
*/
const itemsSitioWeb = ref([]);

/**
 * Carga los nombres de los sitios web disponibles desde la API.
 * Actualiza el estado con la lista de sitios web para su uso en los filtros.
 * @returns {Promise<Array>} Lista de sitios web
 */
async function loadSiteNames() {
  try {
    const response = await fetch("https://servicio-competencias.vercel.app/scrapper-rule/all?page=1&limit=1000&keys=_id,media_communication,key,url_communication");
    const dataResp = await response.json();
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
/** 
 * ********************Fin RECUPERAR SITIOS WEBS
 * */ 

 /*
******* INICIO FILTRO SECCIONES
*/
const itemsSitioWebSeccion = ref([]);
/**
 * Obtiene una lista única de verticales a partir de los artículos.
 * @param {Array} [objeto=null] - Array opcional de artículos a procesar
 * @returns {Array} Array de verticales únicas ordenadas alfabéticamente
 */
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
******* INICIO FILTRO CATEGORIA/VERTICAL
*/
const itemsVertical = ref([]);
/**
 * Obtiene una lista única de categorías/verticales a partir de los artículos.
 * Similar a getUniqueVerticals pero para la propiedad 'vertical'.
 * @param {Array} [objeto=null] - Array opcional de artículos a procesar
 * @returns {Array} Array de categorías únicas ordenadas alfabéticamente
 */
function getUniqueVerticalsCat(objeto = null) {
  const uniqueVerticals = new Set();

  const procesarItems = (items) => {
    items.forEach(item => {
      if (item.vertical) {
        // Dividir la cadena en múltiples verticales y agregar cada uno al Set
        item.vertical.split(",").forEach(vertical => {
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
/**
 * Obtiene una lista única de subverticales a partir de los artículos.
 * @param {Array} [objeto=null] - Array opcional de artículos a procesar
 * @returns {Array} Array de subverticales únicas ordenadas alfabéticamente
 */
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

/**
 * Parsea y limpia un string o array de items (keywords o tags).
 * @param {string|Array} items - Items a procesar
 * @returns {Array} Array de items limpios
 */
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

/**
 * Procesa un array de artículos para extraer y contar la frecuencia de un campo específico.
 * @param {Array} articles - Array de artículos a procesar
 * @param {string} key - Clave del campo a procesar (ej: 'keywords', 'tags')
 * @returns {Object} Objeto con los items más relevantes y todos los items
 */
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
    const topItems = sortedItems.slice(0, 120).map(([label, data]) => ({
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
/**
 * Procesa las keywords de los artículos y actualiza el estado.
 * @param {Array} articles - Array de artículos a procesar
 */
const procesarKeywords = (articles) => {
  // procesarMetadatos(articles, 'keywords', topKeywords, allKeywords);
  const resp = procesarItems(articles, 'keywords');
  allKeywords.value = resp.allItems;
  topKeywords.value = resp.topItems;
}

/**
 * Procesa los tags de los artículos y actualiza el estado.
 * @param {Array} articles - Array de artículos a procesar
 */
const procesarTags = (articles) => {
  // procesarMetadatos(articles, 'tags', topTags, allTags);
  const resp = procesarItems(articles, 'tags');
  allTags.value = resp.allItems;
  topTags.value = resp.topItems;

}

/**
 * Ejecuta el procesamiento de keywords y tags en los artículos.
 * @param {Array} articles - Array de artículos a procesar
 */
function procesarKeywordsAndTags(articles){
  procesarKeywords(articles);
  procesarTags(articles);
}

/*
******* FIN FILTRO pastelWordCloud
*/

/*
******* INICIO MANIPULAR DATOS
*/
// Filtrado de datos (sin debounce)
const debounceTimeout = ref(null);
const filteredData = computed(() => dataManipulable.value);

/**
 * Normaliza un texto eliminando tildes, espacios extras y convirtiendo a minúsculas.
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
const normalizeText = (text) => {
  return text
    ? text
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Elimina tildes
        .replace(/\s+/g, "") // Reemplaza múltiples espacios por uno
        .trim() // Elimina espacios al inicio y al final
        .toLowerCase() // Convierte todo a minúsculas
    : "";
};

/**
 * Filtra los artículos según los criterios activos en los filtros.
 * Aplica búsqueda por texto, sitio, sección, categoría, subsección y keywords.
 * @returns {Array} Array de artículos filtrados y ordenados por fecha
 */
const filteredFunction = function() {
  const query = filtrosActivos.busqueda?.toLowerCase() || "";
  const sitioValue = filtrosActivos.sitio || [];
  const sitiosSeleccionados = sitioValue.map(e => e.value);
  const secciones = filtrosActivos.seccion || [];
  const vertical = filtrosActivos.vertical || [];
  const subseccion = filtrosActivos.subseccion || [];
  const keywords = filtrosActivos.keywords || [];

  return dataAll.value
    .filter(item => {
      const matchesBusqueda = !query || normalizeText(item.titulo).includes(normalizeText(query));
      const matchesBusquedaKeyWords = normalizeText(item.keywords).includes(normalizeText(query));
      const matchesBusquedaAutor = normalizeText(item.autor).includes(normalizeText(query));

      const matchesSitio = sitiosSeleccionados.length === 0 || sitiosSeleccionados.includes(item.sitio);
      const verticalName = item.verticalLocal?.toUpperCase();
      const verticalCatName = item.vertical?.toUpperCase();
      
      const subVerticalName = item.subVerticalLocal?.toUpperCase();
      const keywordsName = item.keywords?.split(",").map(e => e.toUpperCase()) || [];
      const matchesSecciones = secciones.length === 0 || secciones.includes(verticalName);
      const matchesVerticalCat = vertical.length === 0 || vertical.includes(verticalCatName);

      const matchesKeywords = keywords.length === 0 || keywords.some(keyword => keywordsName.includes(keyword));
      
      const matchesSubseccion = subseccion.length === 0 || subseccion.includes(subVerticalName);
      return (matchesBusqueda || matchesBusquedaKeyWords || matchesBusquedaAutor) && matchesSitio && matchesSecciones && matchesVerticalCat && matchesSubseccion && matchesKeywords;
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

//Fin filtrado de datos


/**
 * Obtiene las notas generadas con IA desde el API v3
 * @returns {Promise<Array>} Lista de notas generadas con IA
 */
async function getNotasIAFromAPI() {
  try {
    const response = await fetch('https://services.ecuavisa.com/gestor/competencias/ia/api-v3.php?api=all&folder=notas');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      console.warn('API no devolvió datos válidos:', result);
      return [];
    }
    
  } catch (error) {
    console.error('Error al obtener notas IA desde API:', error);
    // Fallback a localStorage si falla el API
    return JSON.parse(JSON.stringify(LocalStorageCRUD.readCollection('notasSEO')));
  }
}

onMounted(async () => {
  loadingData.value = true;
  await loadSiteNames();
  await principalData();
  itemsSitioWebSeccion.value = getUniqueVerticals(dataAll.value);
  itemsSitioWebSubSeccion.value = getUniqueSubVerticals(dataAll.value);
  itemsVertical.value = getUniqueVerticalsCat(dataAll.value);

  procesarKeywordsAndTags(dataAll.value);
  
  // Cargar notas IA desde el API
  notasSEO.value = await getNotasIAFromAPI();
  
  loadingData.value = false;
});

const articulosSelected = ref([]);

const syncSelected = (enlace, selected) => {
  const index = dataManipulable.value.findIndex(item => item.enlace === enlace);
  if (index !== -1) {
    dataManipulable.value[index].selected = selected;

    articulosSelected.value = dataManipulable.value.filter(item => item.selected);
  }
}

// Generar notas con IA

const controlModalProcesarNotasIa = ref(true);
const loadingIA = ref(false);

/**
 * Elimina etiquetas HTML de un string y limita el número de palabras.
 * @param {string} str - Texto con HTML a limpiar
 * @param {number} [limitWords=100] - Número máximo de palabras a conservar
 * @returns {string} Texto limpio y recortado
 */
function stripHtmlTags(str, limitWords = 100) {
  const strippedStr = str.replace(/<[^>]*>/g, '');
  const words = strippedStr.split(" ");
  return words.slice(0, limitWords).join(" ");
}

/**
 * Obtiene el contenido de un artículo a partir de su URL.
 * @param {string} enlace - URL del artículo
 * @returns {Promise<Object>} Objeto con el contenido del artículo
 */
async function getArticleContent(enlace) {
  try{
    
    const articleOld = LocalStorageCRUD.findArticleByURL(enlace);
    if(articleOld){
      const {keywords, titulo, content = null} = articleOld;
      return {keywords, titulo, content};
    }

    const response = await fetch(`https://servicio-competencias.vercel.app/get-article-content?url=${enlace}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.resp) {
      throw new Error(data);
    }

    const respuestaData = data.data;
    const {keywords, titulo, content = null} = respuestaData;
    return {keywords, titulo, content};
    
  }catch(err){
    console.log(err);
    return null;
  }
}

/**
 * Selecciona palabras clave aleatorias de una lista.
 * @param {Array} allKeywords - Lista de todas las palabras clave disponibles
 * @returns {string} Cadena con palabras clave seleccionadas separadas por comas
 */
function getRandomKeywords(allKeywords) {
  // Paso 1: Separar las frases por comas, limpiar espacios, quitar duplicados
  const todas = allKeywords
    .flatMap(frase => frase.split(','))
    .map(p => p.trim().toLowerCase())
    .filter(Boolean);

  const unicas = [...new Set(todas)];

  // Paso 2: Mezclar aleatoriamente
  const mezcladas = unicas.sort(() => Math.random() - 0.5);

  // Paso 3: Tomar 4 o menos si no hay suficientes
  return mezcladas.slice(0, 4);
}

/**
 * Prepara los datos para enviar al generar una nueva nota con IA.
 * @param {Array} articulosSelected - Artículos seleccionados
 * @param {Array} allKeywords - Lista de todas las palabras clave
 * @returns {Object} Datos formateados para el envío
 */
function dataSendPost(articulosSelected, allKeywords, style = 'informativo', tone = 'formal') {
  const jsonEnvio = articulosSelected.map(item => {
    const { titulo, content } = item;
    return {
      title: titulo,
      content: stripHtmlTags(content),
    }
  });

  return {
    articles: jsonEnvio,
    keywords: allKeywords,
    style: style,
    tone: tone
  }
}

/**
 * Función principal para generar una nueva nota utilizando IA.
 * Coordina la obtención de contenido, procesamiento y envío a la API de IA.
 * @param {Array} articulosSelected - Artículos seleccionados para generar la nota
 * @param {boolean} modalArticulosSelected - Indica si se está usando el modal de selección
 * @returns {Promise<void>}
 */
async function funcionGenerarNotaIA(articulosSelected, modalArticulosSelected, btnLoading, selectedStyle, selectedTone)  {  try{

    btnLoading.value = true;
    // loadingIA.value = true;
    // isDialogNotaIA.value.modal = true;

 //Obtener datos del usuario del localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    //Validar que existan los datos del usuario
if (!userData.email || !userData.fullName) {
  console.warn('Datos de usuario incompletos:', userData);

}

    const artToString = JSON.stringify(articulosSelected);
    const jsonArticulos = JSON.parse(artToString);

    const jsonEnvio = jsonArticulos.map(item => {
      const { titulo, enlace, fechaPublicacion, autor, sitio, vertical, subVertical, keywords, tags } = item;
      return {
        titulo,
        enlace,
        fechaPublicacion,
        autor,
        sitio,
        vertical,
        subVertical,
        tags
      }
    });

    const contenidoArticulos = [];

    for (const articulo of jsonEnvio) {
      const contenido = await getArticleContent(articulo.enlace);
      if (contenido && contenido.content) {
        const unificarObject = {
          ...articulo,
          ...contenido
        }
        contenidoArticulos.push(unificarObject);
      }
    }

    const allKeywords = contenidoArticulos.flatMap(item => item.keywords).filter((keyword, index, self) => self.indexOf(keyword) === index);
    const keywordsRandom = getRandomKeywords(allKeywords);
    const dataSend = dataSendPost(contenidoArticulos, keywordsRandom, selectedStyle, selectedTone);

    // responseIA.value = dataSend;
    // const respAI = await generarNotaIA(dataSend);

    // if(!respAI || !respAI.success){
    //   snackbar.value = {
    //     show: true,
    //     text: `Error, no se pudo generar la nota con IA, intente nuevamente: ${respAI.message}`,
    //     color: 'error'
    //   }
    //   return null;
    // }

    // await new Promise(resolve => setTimeout(resolve, 2000));
    //Respuesta exitosa
    // isDialogNotaIA.value.data.titulo = respAI.synthesizedArticle.title;
    // isDialogNotaIA.value.data.contenido = respAI.synthesizedArticle.content;
    // isDialogNotaIA.value.data.tags = respAI.synthesizedArticle.keywords;
    // isDialogNotaIA.value.data.headings = respAI.synthesizedArticle.headings;
    // isDialogNotaIA.value.data.metaDescription = respAI.synthesizedArticle.metaDescription;
    // isDialogNotaIA.value.data.readabilityScore = respAI.synthesizedArticle.readabilityScore;
    // isDialogNotaIA.value.data.wordCount = respAI.synthesizedArticle.wordCount;

    // Agregar objetos a una colección
    
const idGenerateRandomArticle = LocalStorageCRUD.addToCollection({
  id: "",
  dataOld: contenidoArticulos,
  dataSend: dataSend,
  title: "",
  keywords: "",
  content: "",
  headings: "",
  metaDescription: "",
  readabilityScore: "",
  wordCount: "",
  generateDate: moment().format("DD/MM/YYYY HH:mm:ss"),
  generate: false,
  // AGREGAR ESTOS CAMPOS: Datos del autor/usuario
  author: {
    email: userData.email || "",
    fullName: userData.fullName || "",
    role: userData.role || ""
  }
});

    articulosSelected.value = [];

    router.push('/apps/radar/ia/article/' + idGenerateRandomArticle);
    modalArticulosSelected.value.modal = false;

    return true;
  }catch(err){
    console.log(err);
    snackbar.value = {
      show: true,
      text: `Error, no se pudo generar la nota con IA, intente nuevamente: ${JSON.stringify(err)}`,
      color: 'error'
    }
    return null;
  }finally{
    // loadingIA.value = false;
    btnLoading.value = false;
  }
}

const responseIA = ref({})

// const generarNotaIA = async (dataSend) => {
//   try {
//     // return {
//     //     "success": true,
//     //     "synthesizedArticle": {
//     //         "content": "Barcelona SC se prepara para un cierre de mayo crucial, lidiando con rumores sobre prohibiciones de la FIFA mientras se enfoca en la Copa Libertadores y la Liga Pro. El vicepresidente administrativo del club, Galo Roggiero Avilés, ha desmentido categóricamente los rumores que circulan sobre una posible prohibición de la FIFA para contratar jugadores en junio. Estas afirmaciones, difundidas en redes sociales, generaron inquietud entre los aficionados toreros. Según Roggiero, el club ha estado gestionando este tipo de situaciones durante los últimos quince años, y aunque no deberían ser la norma, se han convertido en parte de la dinámica institucional.\n\n“Barcelona ha convivido con este tipo de situaciones durante los últimos quince años. Son problemas que, aunque no deberían ser normales, lamentablemente se han convertido en parte de la dinámica institucional del club”, manifestó Roggiero. El vicepresidente administrativo aseguró que la directiva ha estado cumpliendo con los pagos correspondientes y que no existe ningún impedimento legal concreto para planificar refuerzos para junio. “Como directiva, hemos venido cumpliendo con los pagos que corresponden en cada caso, y así lo seguiremos haciendo. Hoy no existe ningún impedimento legal concreto que nos impida planificar refuerzos para junio, y trabajamos con calma y responsabilidad para evitar que esto escale”, añadió.\n\nRoggiero también destacó el compromiso de la directiva no solo con resolver los problemas inmediatos, sino también con construir un futuro más ordenado para el club. \"Nuestro enfoque no solo está en resolver el presente, sino en construir un futuro más ordenado para Barcelona. Sabemos que no es una tarea sencilla, pero estamos comprometidos a dejar una base sólida para que las próximas directivas no enfrenten las mismas dificultades”. La aclaración del vicepresidente administrativo busca tranquilizar a la afición y asegurar que el club puede seguir adelante con sus planes de refuerzos para la segunda mitad de la temporada.\n\nEn el ámbito deportivo, Barcelona SC se encuentra inmerso en la fase de grupos de la Copa Libertadores 2025, donde comparte grupo con Independiente del Valle. El enfrentamiento entre ambos equipos ecuatorianos es crucial para sus aspiraciones de avanzar a los octavos de final. El partido de ida, disputado en el estadio Monumental Banco Pichincha, favoreció a los toreros con un solitario gol de Bryan Carabalí. El próximo encuentro, correspondiente a la fase de grupos, se jugará el 27 de mayo en el estadio Banco Guayaquil. Este partido será transmitido para Ecuador y Latinoamérica a través de la cadena ESPN y la plataforma de streaming Disney+. En Estados Unidos, beIN Sports tendrá los derechos de transmisión, mientras que en España, LaLiga+ será la encargada de llevar el encuentro a los aficionados.\n\nParalelamente, Barcelona SC se prepara para disputar la fecha 15 de la Liga Pro 2025, un torneo que se encuentra en su etapa intermedia y que definirá a los candidatos para el hexagonal final y los equipos que lucharán por evitar el descenso. El partido correspondiente a esta fecha será contra Aucas, el domingo 1 de junio, en el estadio Gonzalo Pozo Ripalda en Quito. La jornada 15 de la Liga Pro se jugará entre el viernes 30 de mayo y el lunes 2 de junio, con varios partidos importantes en el calendario. Entre ellos, destacan el Macará vs. Manta FC, Liga de Quito vs. Técnico Universitario, Delfín SC vs. Independiente del Valle, y Emelec vs. Orense SC. Esta fecha promete emociones intensas en cada uno de sus encuentros, ya que todos los equipos se juegan mucho, ya sea por clasificar a fases finales o alejarse del descenso.\n\nLa agenda de Barcelona SC se presenta desafiante, con compromisos tanto a nivel nacional como internacional. La directiva trabaja en varios frentes, desde la gestión de posibles sanciones hasta la planificación deportiva. La afición espera que el equipo pueda superar estos obstáculos y lograr sus objetivos en la Copa Libertadores y la Liga Pro.",
//     //         "headings": [
//     //             "Desmentido de la Prohibición de la FIFA",
//     //             "Enfrentamiento Clave en la Copa Libertadores",
//     //             "Liga Pro: Fecha 15 y Compromisos Nacionales",
//     //             "Gestión Integral y Desafíos Futuros"
//     //         ],
//     //         "keywords": [
//     //             "copa libertadores",
//     //             "fifa",
//     //             "emelec",
//     //             "barcelona sc",
//     //             "liga pro",
//     //             "sanciones fifa",
//     //             "futbol ecuatoriano",
//     //             "toreros"
//     //         ],
//     //         "metaDescription": "Barcelona SC enfrenta rumores de la FIFA mientras se prepara para duelos cruciales en la Copa Libertadores y la Liga Pro. ¿Qué dice la directiva? Todos los detalles aquí.",
//     //         "readabilityScore": "Fácil de leer - Nivel intermedio",
//     //         "title": "Barcelona SC: FIFA, Libertadores y Liga Pro en la Mira",
//     //         "wordCount": 765
//     //     },
//     //     "formattedContent": "# Barcelona SC: FIFA, Libertadores y Liga Pro en la Mira\n\n**Meta Description:** Barcelona SC enfrenta rumores de la FIFA mientras se prepara para duelos cruciales en la Copa Libertadores y la Liga Pro. ¿Qué dice la directiva? Todos los detalles aquí.\n\nBarcelona SC se prepara para un cierre de mayo crucial, lidiando con rumores sobre prohibiciones de la FIFA mientras se enfoca en la Copa Libertadores y la Liga Pro. El vicepresidente administrativo del club, Galo Roggiero Avilés, ha desmentido categóricamente los rumores que circulan sobre una posible prohibición de la FIFA para contratar jugadores en junio. Estas afirmaciones, difundidas en redes sociales, generaron inquietud entre los aficionados toreros. Según Roggiero, el club ha estado gestionando este tipo de situaciones durante los últimos quince años, y aunque no deberían ser la norma, se han convertido en parte de la dinámica institucional.\n\n“Barcelona ha convivido con este tipo de situaciones durante los últimos quince años. Son problemas que, aunque no deberían ser normales, lamentablemente se han convertido en parte de la dinámica institucional del club”, manifestó Roggiero. El vicepresidente administrativo aseguró que la directiva ha estado cumpliendo con los pagos correspondientes y que no existe ningún impedimento legal concreto para planificar refuerzos para junio. “Como directiva, hemos venido cumpliendo con los pagos que corresponden en cada caso, y así lo seguiremos haciendo. Hoy no existe ningún impedimento legal concreto que nos impida planificar refuerzos para junio, y trabajamos con calma y responsabilidad para evitar que esto escale”, añadió.\n\nRoggiero también destacó el compromiso de la directiva no solo con resolver los problemas inmediatos, sino también con construir un futuro más ordenado para el club. \"Nuestro enfoque no solo está en resolver el presente, sino en construir un futuro más ordenado para Barcelona. Sabemos que no es una tarea sencilla, pero estamos comprometidos a dejar una base sólida para que las próximas directivas no enfrenten las mismas dificultades”. La aclaración del vicepresidente administrativo busca tranquilizar a la afición y asegurar que el club puede seguir adelante con sus planes de refuerzos para la segunda mitad de la temporada.\n\nEn el ámbito deportivo, Barcelona SC se encuentra inmerso en la fase de grupos de la Copa Libertadores 2025, donde comparte grupo con Independiente del Valle. El enfrentamiento entre ambos equipos ecuatorianos es crucial para sus aspiraciones de avanzar a los octavos de final. El partido de ida, disputado en el estadio Monumental Banco Pichincha, favoreció a los toreros con un solitario gol de Bryan Carabalí. El próximo encuentro, correspondiente a la fase de grupos, se jugará el 27 de mayo en el estadio Banco Guayaquil. Este partido será transmitido para Ecuador y Latinoamérica a través de la cadena ESPN y la plataforma de streaming Disney+. En Estados Unidos, beIN Sports tendrá los derechos de transmisión, mientras que en España, LaLiga+ será la encargada de llevar el encuentro a los aficionados.\n\nParalelamente, Barcelona SC se prepara para disputar la fecha 15 de la Liga Pro 2025, un torneo que se encuentra en su etapa intermedia y que definirá a los candidatos para el hexagonal final y los equipos que lucharán por evitar el descenso. El partido correspondiente a esta fecha será contra Aucas, el domingo 1 de junio, en el estadio Gonzalo Pozo Ripalda en Quito. La jornada 15 de la Liga Pro se jugará entre el viernes 30 de mayo y el lunes 2 de junio, con varios partidos importantes en el calendario. Entre ellos, destacan el Macará vs. Manta FC, Liga de Quito vs. Técnico Universitario, Delfín SC vs. Independiente del Valle, y Emelec vs. Orense SC. Esta fecha promete emociones intensas en cada uno de sus encuentros, ya que todos los equipos se juegan mucho, ya sea por clasificar a fases finales o alejarse del descenso.\n\nLa agenda de Barcelona SC se presenta desafiante, con compromisos tanto a nivel nacional como internacional. La directiva trabaja en varios frentes, desde la gestión de posibles sanciones hasta la planificación deportiva. La afición espera que el equipo pueda superar estos obstáculos y lograr sus objetivos en la Copa Libertadores y la Liga Pro.\n\n---\n\n## Estructura Sugerida\n## Desmentido de la Prohibición de la FIFA\n\n## Enfrentamiento Clave en la Copa Libertadores\n\n## Liga Pro: Fecha 15 y Compromisos Nacionales\n\n## Gestión Integral y Desafíos Futuros\n\n---\n\n**📊 Estadísticas del Artículo:**\n- **Palabras:** 765\n- **Legibilidad:** Fácil de leer - Nivel intermedio\n- **Keywords:** copa libertadores, fifa, emelec, barcelona sc, liga pro, sanciones fifa, futbol ecuatoriano, toreros\n\n---\n*Artículo generado automáticamente mediante síntesis de contenido optimizada para SEO*",
//     //     "message": "Article synthesized successfully! Generated 765 words with 8 keywords."
//     // };

//     const response = await fetch('https://ecuavisa-scrapping.vercel.app/ecuavisa-ai/synthesize', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(dataSend)
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     if (!data.success) {
//       throw new Error(data);
//     }

//     return data;
    
//   } catch (error) {
//     console.error(error);
//     snackbar.value = {
//       show: true,
//       text: `Error, no se pudo generar la nota con IA, intente nuevamente`,
//       color: 'error'
//     }
//     return null;
//   }
// }


// Variable para el modal cuando se genera la nota.
const isDialogNotaIA = ref({
  modal: false,
  data:{
    id: "",
    titulo: "Titular de la nota generada con IA",
    contenido: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',
    tags: ["keywords", "keywords2"],
    headings: ["h1", "h2", "h3", "h4", "h5", "h6"],
    metaDescription: "Meta description",
    readabilityScore: "Readability score",
    wordCount: 0
  }
})

//Localstorage crud

// Generar un id unico
// function generateId() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }

// Colección reactiva
// const notasSEO = ref(JSON.parse(localStorage.getItem('notasSEO')) || []);
const notasSEO = ref([]);

// const LocalStorageCRUD = ref({
//   collection: notasSEO,
//   key: 'notasSEO',
//   // Sincroniza con localStorage
//   sync() {
//     notasSEO.value = JSON.parse(localStorage.getItem(this.key)) || [];
//   },

//   // Crear o reemplazar toda la colección
//   createCollection(key, dataArray) {
//     localStorage.setItem(key, JSON.stringify(dataArray));
//   },

//   // Leer toda la colección
//   readCollection(key) {
//     const data = localStorage.getItem(key);
//     return data ? JSON.parse(data) : [];
//   },

//   // Agregar un nuevo objeto a la colección
//   addToCollection(newItem) {
//     const key = this.key;
//     const collection = this.readCollection(key);
//     collection.push(newItem);
//     this.createCollection(key, collection);
//     this.sync();
//     return true;
//   },

//   // Actualizar un objeto por su ID
//   updateById(id, newData) {
//     const key = this.key;
//     const collection = this.readCollection(key);
//     const index = collection.findIndex(item => item.id === id);
//     if (index === -1) return false;

//     collection[index] = { ...collection[index], ...newData };
//     this.createCollection(key, collection);
//     this.sync();
//     return true;
//   },

//   // Eliminar objeto por ID dentro de la colección
//   deleteById(id) {
//     const key = this.key;
//     const collection = this.readCollection(key);
//     const filtered = collection.filter(item => item.id !== id);
//     this.createCollection(key, filtered);
//     this.sync();
//     return true;
//   },

//   // Eliminar toda la colección
//   deleteCollection() {
//     const key = this.key;
//     localStorage.removeItem(key);
//     this.sync();
//     return true;
//   },

//   // Verificar si existe la colección
//   exists(key) {
//     return localStorage.getItem(key) !== null;
//   }
// });

const showNotaIA = (synthesizedArticle) => {
  isDialogNotaIA.value.modal = true;
  isDialogNotaIA.value.data.id = synthesizedArticle.id;
  isDialogNotaIA.value.data.titulo = synthesizedArticle.title;
  isDialogNotaIA.value.data.contenido = synthesizedArticle.content;
  isDialogNotaIA.value.data.tags = synthesizedArticle.keywords;
  isDialogNotaIA.value.data.headings = synthesizedArticle.headings;
  isDialogNotaIA.value.data.metaDescription = synthesizedArticle.metaDescription;
  isDialogNotaIA.value.data.readabilityScore = synthesizedArticle.readabilityScore;
  isDialogNotaIA.value.data.wordCount = synthesizedArticle.wordCount;
}

onMounted(async()=>{
  notasSEO.value = JSON.parse(JSON.stringify(LocalStorageCRUD.readCollection('notasSEO')));
})
</script>

<template>
	<section>
    <VDialog
        v-model="isDialogNotaIA.modal"
        scrollable
        max-width="650"
      >

      <!-- Dialog close btn -->
      <DialogCloseBtn :disabled="loadingIA" v-if="!loadingIA" @click="isDialogNotaIA.modal = !isDialogNotaIA.modal" />

      <!-- Dialog Content -->
      <VCard>
        <VCardItem >
          <div class="d-flex content-title flex-wrap">
            <h2 class="mb-3 d-flex flex-wrap gap-2 text-black">
              <span v-if="loadingIA">
                Generando nota..
              </span>
              <span v-else>
                Nota generada con IA 
              </span>
              
              <div class="svg-icon-start mt-1">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512" style="width: 25px; height: 25px; shape-rendering: geometricPrecision; text-rendering: geometricPrecision; image-rendering: optimizeQuality; fill-rule: evenodd; clip-rule: evenodd;">
                  <g>
                    <path style="opacity:0.978" fill="#000000"
                      d="M -0.5,192.5 C -0.5,191.833 -0.5,191.167 -0.5,190.5C 28.0041,186.207 56.0041,179.707 83.5,171C 108.001,163.349 128.501,149.849 145,130.5C 160.188,107.957 170.521,83.2901 176,56.5C 179.885,38.7326 183.885,21.0659 188,3.5C 193.095,32.6418 200.095,61.3085 209,89.5C 217.959,118.435 235.125,140.935 260.5,157C 275.526,164.898 291.193,171.231 307.5,176C 330.487,181.728 353.487,187.062 376.5,192C 347.003,196.966 318.003,203.966 289.5,213C 261.252,222.018 239.085,238.851 223,263.5C 210.823,286.516 202.156,310.849 197,336.5C 193.785,351.12 190.785,365.786 188,380.5C 183.062,357.487 177.728,334.487 172,311.5C 166.455,290.176 157.455,270.509 145,252.5C 128.954,233.815 109.121,220.648 85.5,213C 57.3611,203.939 28.6944,197.106 -0.5,192.5 Z" />
                  </g>
                  <g>
                    <path style="opacity:0.965" fill="#000000"
                      d="M 511.5,387.5 C 511.5,387.833 511.5,388.167 511.5,388.5C 493.583,391.584 475.917,395.75 458.5,401C 435.14,407.753 418.64,422.253 409,444.5C 401.312,464.935 395.645,485.935 392,507.5C 388.133,489.034 383.467,470.701 378,452.5C 367.184,423.028 346.351,404.861 315.5,398C 300.891,394.412 286.224,391.078 271.5,388C 291.141,384.256 310.474,379.256 329.5,373C 353,364.833 368.833,349 377,325.5C 383.256,306.474 388.256,287.141 392,267.5C 395.591,287.53 400.591,307.197 407,326.5C 415.635,350.468 432.135,366.301 456.5,374C 474.599,379.608 492.932,384.108 511.5,387.5 Z" />
                  </g>
                </svg>

              </div>
            </h2>
            <VDivider />
          </div>
        </VCardItem>
        <VCardText style="max-height: 550px;">
          <div class="d-flex flex-column mb-3" style="line-height: 1.3;">
            <div class="titulo-ia mb-2">
              <small>Título generado con IA</small>
              <h3 class="h2">
                <span v-if="loadingIA" class="skeleton-box" style="width:95%;"></span>
                <span v-else>{{ isDialogNotaIA.data.titulo }}</span>
              </h3>
            </div>
            <div class="headings-ia mb-2">
              <small>Subtítulos sugeridos generados con IA</small>
              <h4 class="h4 ">
                <ul>
                  <li v-for="item in isDialogNotaIA.data.headings" v-if="!loadingIA">
                    - {{ item }}
                  </li>
                  <li v-if="loadingIA" v-for="item in 5" class="skeleton-box" style="width:55%;"></li>
                </ul>
              </h4>
            </div>
            <div class="headings-ia mb-2">
              <small>Meta description generado con IA</small>
              <h4 class="h4 ">
                <span v-if="loadingIA" class="skeleton-box" style="width:95%;"></span>
                <span v-else>{{ isDialogNotaIA.data.metaDescription }}</span>
              </h4>
            </div>
            <div class="headings-ia mb-2">
              <small>Legibilidad generado con IA</small>
              <h4 class="h4 ">
                <span v-if="loadingIA" class="skeleton-box" style="width:25%;"></span>
                <span v-else>{{ isDialogNotaIA.data.readabilityScore }}</span>
              </h4>
            </div>
            <div class="headings-ia mb-2">
              <small>Palabras generadas con IA</small>
              <h4 class="h4 ">
                <span v-if="loadingIA" class="skeleton-box" style="width:15%;"></span>
                <span v-else>{{ isDialogNotaIA.data.wordCount }}</span>
              </h4>
            </div>
            <div class="d-flex gap-2 align-center mt-2 flex-wrap">
              <small>Tags:</small>
              <VChip size="x-small" color="primary" v-for="item in isDialogNotaIA.data.tags" v-if="!loadingIA">
                {{ item }}
              </VChip>
              <VChip size="x-small" color="primary" v-for="item in 5" v-if="loadingIA" class="skeleton-box" style="width:55%;"></VChip>
            </div>
          </div>
          <div v-if="isDialogNotaIA.data.titulo && !loadingIA">
            {{isDialogNotaIA.data.id}}
            <div v-html="lectorMD(isDialogNotaIA.data.contenido)"></div>
          </div>
          <div v-else>
            <div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
            <div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
            <div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
            <div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
            <div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
            <div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
            <div v-if="loadingIA" class="skeleton-box" style="width:100%;"></div>
            <div v-else class="no-results">No se existe contenido</div>
          </div>
        </VCardText>

        <VCardText class="py-4">
          <VBtn class="my-4" @click="isDialogNotaIA.modal = false" :disabled="loadingIA" :loading="loadingIA">
            <span v-if="loadingIA">
              Generando nota con IA....
            </span>
            <span v-else>Cerrar modal</span>
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
		<VSnackbar
			v-model="snackbar.show"
			:color="snackbar.color"
			:timeout="snackbar.timeout"
			location="top end"
		>
			{{ snackbar.text }}
		</VSnackbar>
    <VRow>
      
      <VCol cols="12" md="12" lg="12">
        <VCard>
          <VCardItem>
            <div class="d-flex content-title flex-wrap w-100">
              <div class="d-flex gap-3 justify-space-between w-100">
                <div class="d-flex flex-column" style="line-height: 1.3">
                  <h4 class="title-principal">Radar Digital 2.0</h4>
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px"
                      >Total de artículos procesados {{ dataManipulable.length }}</small
                    >
                    <VChip size="x-small" color="primary">
                      {{ dataAll.length }} Artículo(s).</VChip
                    >
                  </div>
                  <div class="content-btn mt-3">
                    <VBtn
                      :loading="loadingData"
                      title="Recargar datos"
                      @click="principalData"
                      target="_blank"
                      color="primary"
                      variant="tonal"
                      size="small"
                    >
                      <VIcon icon="tabler-reload" /> Recargar datos
                    </VBtn>
                  </div>
                </div>
                <div class="d-flex align-center gap-2 flex-column">
                  <VChip
                    class="d-none"
                    color="primary"
                    size="small"
                    prepend-icon="tabler-clock"
                  >
                    Datos:
                  </VChip>
                  <VChip
                    class="d-none"
                    color="success"
                    size="small"
                    prepend-icon="tabler-clock"
                  >
                    Próxima actualización: 
                  </VChip>
                </div>
              </div>
            </div>
          </VCardItem>
        </VCard>
      </VCol>
      <VCol cols="12" md="12" lg="9">
        <VRow>
          <VCol cols="12" md="12" lg="12">
            <VCard>
              <VCardItem  class="mb-0 pb-2">
                <div class="d-flex content-title flex-wrap w-100">
                  <div class="d-flex gap-3 justify-space-between w-100">
                    <div class="d-flex flex-column" style="line-height: 1.3">
                      <h4 class="text-h6"><VIcon icon="tabler-filter" /> Filtros Disponibles</h4>
                    </div>
                  </div>
                </div>
              </VCardItem>
              <VCardItem class="py-0 pb-4">
                <VRow>
                  <VCol cols="12" md="12" lg="12">
                    <div class="w-100 mt-2">
                      <label>Buscar por, título, autor, sección</label>
                      <VTextField 
                        v-model="filtrosActivos.busqueda"
                        prepend-inner-icon="tabler-search"
                        density="compact" 
                        style="padding: 0px 0;" 
                        clearable 
                      />
                    </div>
                  </VCol>
                  <VCol cols="12" md="4" lg="3">
                    <div class="w-100">
                      <label>Filtrar por sitio web</label>
                      <VCombobox :loading="loadingData" :disabled="loadingData" v-model="filtrosActivos.sitio" :items="itemsSitioWeb" multiple chips
                        :menu-props="{ maxHeight: '300' }" />
                    </div>
                  </VCol>
                  <VCol cols="12" md="4" lg="5">
                    <div class="w-100">
                      <label>Filtrar por Keyword</label>
                      <VCombobox v-model="filtrosActivos.keywords" :items="topTags.map(e => e.label)" multiple chips
                        :menu-props="{ maxHeight: '300' }" />
                    </div>
                  </VCol>
                  <VCol cols="12" md="4" lg="4">
                    <div class="w-100">
                      <label>Filtrar por categoría</label>
                      <VCombobox v-model="filtrosActivos.vertical" :items="itemsVertical" multiple chips
                        :menu-props="{ maxHeight: '300' }" />
                    </div>
                  </VCol>
                  <VCol cols="12" md="4" lg="2" class="d-none">
                    <div class="w-100">
                      <label>Filtrar por Sección</label>
                      <VCombobox v-model="filtrosActivos.seccion" :items="itemsSitioWebSeccion" multiple chips
                        :menu-props="{ maxHeight: '300' }" />
                    </div>
                  </VCol>
                  <VCol cols="12" md="4" lg="2" class="d-none">
                    <div class="w-100 mt-4">
                      <label>Filtrar por SubSección</label>
                      <VCombobox v-model="filtrosActivos.subseccion" :items="itemsSitioWebSubSeccion" multiple chips
                        :menu-props="{ maxHeight: '300' }" />
                    </div>
                  </VCol>
                </VRow>
              </VCardItem>
            </VCard>
          </VCol>
          <VCol cols="12" md="12" lg="12">
            <plantilla_articulos_estilo_principal_ia :controlModalProcesarNotasIa="controlModalProcesarNotasIa" :articulos="filteredData" :filtrosActivos="filtrosActivos" @click:checkSelected="syncSelected" @click:generateNotaIA="funcionGenerarNotaIA" :articulosSelected="articulosSelected" />
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="12" lg="3">
        <VCard>
            <VCardItem  class="mb-0 pb-2">
              <div class="d-flex content-title flex-wrap w-100">
                <div class="d-flex gap-3 justify-space-between w-100">
                  <div class="d-flex flex-column" style="line-height: 1.3">
                    <h4 class="text-h6 d-flex align-center gap-2">
                      <div class="svg-icon-start mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512" style="width: 25px; height: 25px; shape-rendering: geometricPrecision; text-rendering: geometricPrecision; image-rendering: optimizeQuality; fill-rule: evenodd; clip-rule: evenodd;">
                          <g>
                            <path style="opacity:0.978" fill="#000000"
                              d="M -0.5,192.5 C -0.5,191.833 -0.5,191.167 -0.5,190.5C 28.0041,186.207 56.0041,179.707 83.5,171C 108.001,163.349 128.501,149.849 145,130.5C 160.188,107.957 170.521,83.2901 176,56.5C 179.885,38.7326 183.885,21.0659 188,3.5C 193.095,32.6418 200.095,61.3085 209,89.5C 217.959,118.435 235.125,140.935 260.5,157C 275.526,164.898 291.193,171.231 307.5,176C 330.487,181.728 353.487,187.062 376.5,192C 347.003,196.966 318.003,203.966 289.5,213C 261.252,222.018 239.085,238.851 223,263.5C 210.823,286.516 202.156,310.849 197,336.5C 193.785,351.12 190.785,365.786 188,380.5C 183.062,357.487 177.728,334.487 172,311.5C 166.455,290.176 157.455,270.509 145,252.5C 128.954,233.815 109.121,220.648 85.5,213C 57.3611,203.939 28.6944,197.106 -0.5,192.5 Z" />
                          </g>
                          <g>
                            <path style="opacity:0.965" fill="#000000"
                              d="M 511.5,387.5 C 511.5,387.833 511.5,388.167 511.5,388.5C 493.583,391.584 475.917,395.75 458.5,401C 435.14,407.753 418.64,422.253 409,444.5C 401.312,464.935 395.645,485.935 392,507.5C 388.133,489.034 383.467,470.701 378,452.5C 367.184,423.028 346.351,404.861 315.5,398C 300.891,394.412 286.224,391.078 271.5,388C 291.141,384.256 310.474,379.256 329.5,373C 353,364.833 368.833,349 377,325.5C 383.256,306.474 388.256,287.141 392,267.5C 395.591,287.53 400.591,307.197 407,326.5C 415.635,350.468 432.135,366.301 456.5,374C 474.599,379.608 492.932,384.108 511.5,387.5 Z" />
                          </g>
                        </svg>
                    </div>Notas generadas con IA</h4>
                  </div>
                </div>
              </div>
            </VCardItem>
            <VCardItem class="py-0 pb-4">
              <VRow>
                <VCol cols="12" md="12" lg="12">
                  <VList lines="two" v-if="notasSEO.length > 0">
  <VListItem
    class="px-0"
    v-for="notaIA in notasSEO"
    :key="notaIA.id"
  >
    <VListItemTitle class="text-truncate" :title="notaIA.title">
      <div v-if="notaIA.generate">
        {{ notaIA.title }}
      </div>
      <div v-else>
        <i>Nota no generada</i>
      </div>
    </VListItemTitle>
    <VListItemSubtitle>
      <div class="d-flex flex-column gap-1">
        <span class="text-caption">
          {{ notaIA.generateDate ? moment(notaIA.generateDate, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') : 'Sin fecha' }}
        </span>
        <span class="text-caption" v-if="notaIA.author?.fullName">
          Autor: {{ notaIA.author.fullName }}
        </span>
      </div>
    </VListItemSubtitle>
    <template #prepend>
      <VAvatar
        :color="notaIA.generate ? 'success' : 'secondary'"
        variant="tonal"
      >
        <div class="svg-icon-start mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 25px; height: 25px; shape-rendering: geometricPrecision; text-rendering: geometricPrecision; image-rendering: optimizeQuality; fill-rule: evenodd; clip-rule: evenodd;">
            <g>
              <path style="opacity:0.978" :fill="notaIA.generate ? '#000' : '#7b7981'"
                d="M -0.5,192.5 C -0.5,191.833 -0.5,191.167 -0.5,190.5C 28.0041,186.207 56.0041,179.707 83.5,171C 108.001,163.349 128.501,149.849 145,130.5C 160.188,107.957 170.521,83.2901 176,56.5C 179.885,38.7326 183.885,21.0659 188,3.5C 193.095,32.6418 200.095,61.3085 209,89.5C 217.959,118.435 235.125,140.935 260.5,157C 275.526,164.898 291.193,171.231 307.5,176C 330.487,181.728 353.487,187.062 376.5,192C 347.003,196.966 318.003,203.966 289.5,213C 261.252,222.018 239.085,238.851 223,263.5C 210.823,286.516 202.156,310.849 197,336.5C 193.785,351.12 190.785,365.786 188,380.5C 183.062,357.487 177.728,334.487 172,311.5C 166.455,290.176 157.455,270.509 145,252.5C 128.954,233.815 109.121,220.648 85.5,213C 57.3611,203.939 28.6944,197.106 -0.5,192.5 Z" />
            </g>
            <g>
              <path style="opacity:0.965" :fill="notaIA.generate ? '#000' : '#7b7981'"
                d="M 511.5,387.5 C 511.5,387.833 511.5,388.167 511.5,388.5C 493.583,391.584 475.917,395.75 458.5,401C 435.14,407.753 418.64,422.253 409,444.5C 401.312,464.935 395.645,485.935 392,507.5C 388.133,489.034 383.467,470.701 378,452.5C 367.184,423.028 346.351,404.861 315.5,398C 300.891,394.412 286.224,391.078 271.5,388C 291.141,384.256 310.474,379.256 329.5,373C 353,364.833 368.833,349 377,325.5C 383.256,306.474 388.256,287.141 392,267.5C 395.591,287.53 400.591,307.197 407,326.5C 415.635,350.468 432.135,366.301 456.5,374C 474.599,379.608 492.932,384.108 511.5,387.5 Z" />
            </g>
          </svg>
        </div>
      </VAvatar>
    </template>

    <template #append>
      <VBtn
        variant="text"
        :color="notaIA.generate ? 'default' : 'warning'"
        :to="{
          name: 'apps-radar-ia-article-id',
          params: { id: notaIA.id },
        }"
        :title="notaIA.generate ? 'Ver nota' : 'Generar nota'"
        :icon="notaIA.generate ? 'tabler-info-circle' : 'tabler-reload'"
      />
      <VDivider />
    </template>
  </VListItem>
</VList>
                  <div v-else>No hay notas generadas con IA</div>
                </VCol>
              </VRow>
            </VCardItem>
          </VCard>
      </VCol>
    </VRow>
	</section>
</template>
<style scoped>
.title-principal {
	font-size: 25px;
}
.text-black{
  color: black;
}

.skeleton-box {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: #DDDBDD;
}
.skeleton-box::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
  -webkit-animation: shimmer 2s infinite;
          animation: shimmer 2s infinite;
  content: "";
}
@-webkit-keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
