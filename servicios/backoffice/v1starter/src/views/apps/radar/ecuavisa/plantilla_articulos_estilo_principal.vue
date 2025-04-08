<script setup>
  // import datos_bar_vertical_noticias_por_hora from '@/views/apps/radar/ecuavisa/datos_bar_vertical_noticias_por_hora.vue';
  import datos_bar_horizontal_content from '@/views/apps/radar/ecuavisa/datos_bar_horizontal_content.vue';
  import VueApexCharts from 'vue3-apexcharts';
  import { hexToRgb } from '@layouts/utils';
  import { useTheme } from 'vuetify';

  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  const isLoading = ref(false);

  const props = defineProps({
    disabledChart: { type: String, default:"1" },
    filtrosActivos: { type: Array, required: true },
    articulos: { type: Array, required: true },
    utilizaFiltroFecha: { type: Boolean, required: true, default:false },
    modoSimple: { type: Boolean, required: true, default:false },
    selecteDisplay: { type: Boolean, required: true, default: true } 
  });

  const filteredData = ref([]);

  // const customColors = [
  //   {
  //     "entretenimiento":'#836af9',
  //     "estadio":'#ffe802',
  //     "home":'#2c9aff',
  //     "mundo":'#ffcf5c',
  //     "noticias":'#4f5d70',
  //     "tendencias":'#299aff',
    // '#d4e157',
    // '#28dac6',
    // '#9e69fd',
    // '#ff9800',
    // '#26c6da',
    // '#ff8131',
    // '#28c76f',
    // '#ffbd1f',
    // '#84d0ff',
    // '#edf1f4',
    // '#ff9f43',
  //   }
  // ]

  const customColors = {
    "entretenimiento": 'warning',
    "estadio": 'success',
    "home": 'secondary',
    "mundo": 'info',
    "noticias": 'primary',
    "tendencias": 'error',

};

  const DEFAULT_COLOR = "default"; // Color por defecto

  const getColorForText = (text) => {
    const textLocal = normalizeText(text);
    for (const key in customColors) {
      // console.log("Categoría:", normalizeText(key), textLocal);
      if(normalizeText(key) == textLocal){
        return customColors[key];
      }
    }

    return DEFAULT_COLOR;
};

  const normalizeText = (text) => {
    return text
      ? text
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Elimina tildes
          .replace(/\s+/g, "") // Reemplaza múltiples espacios por uno
          .trim() // Elimina espacios al inicio y al final
          .toLowerCase() // Convierte todo a minúsculas
      : "";
  };

  function getDefaultDate() {
    return moment('2025-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss');
  }

  function replaceAmp(input) {
    return input.replace(/&amp;/g, "&");
  }

  const formatDate = (dateString) => {
    return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
  }

  /*
  INICIO - FUNCIONALIDAD
  */

  // INICIO DE EVENTO CLICK GRAFICO 1
  const isDialogVisibleKeyWords = ref({
    modal: false,
    search: null,
    data:{
      title: "",
      items: []
    }
  })

  const clickFilterLocal = async (name, value) => {
      try {
          isDialogVisibleKeyWords.value.modal = true;
          let objeto = [];
          const resultado = await agruparYFiltrarPorTiempo(props.articulos, model_select_hora.value.value);
          const dataLocalAllArticles = resultado;
          for(var i in dataLocalAllArticles){
            if(dataLocalAllArticles[i][name] == value){
              objeto.push(dataLocalAllArticles[i]);
            }
          }
          
          isDialogVisibleKeyWords.value.data.items = objeto;
          isDialogVisibleKeyWords.value.data.search = null;
          isDialogVisibleKeyWords.value.data.title = value.toUpperCase();
          return true;
      } catch (error) {
          console.error("Error en clickFilterLocal:", error);
          return [];
      }
  };

  const containsKeywordLocal = (keywords, keyword) => {
      if (!keywords || !keyword) return false;

      try {
          let parsedKeywords = [];

          if (typeof keywords === 'string') {
              parsedKeywords = keywords.split(',').map(k => k.trim()).filter(Boolean);
          } else if (Array.isArray(keywords)) {
              parsedKeywords = keywords.map(k => typeof k === 'string' ? k.trim() : String(k)).filter(Boolean);
          } else if (typeof keywords === 'object') {
              parsedKeywords = [String(keywords)].filter(Boolean);
          }

          return parsedKeywords.includes(keyword.trim());
      } catch (err) {
          console.warn('Error parsing keywords:', err);
          return false;
      }
  };


  const clickKeywordLocal = (keyword) => {
      try {
          isDialogVisibleKeyWords.value.modal = true;
          let objeto = [];

          // console.log("props.dataListArticles", props.dataListArticles)

          // Iterar sobre cada artículo en props.dataListArticles
          // Object.values(filteredData.value).forEach(article => {
          //     // console.log("containsKeywordLocal(article.keywords, keyword)", containsKeywordLocal(article.keywords, keyword))
          //     // console.log("containsKeywordLocal(article.keywords, keyword) article.keywords", article.keywords, keyword)
          //     if (article.hasOwnProperty("keywords") && containsKeywordLocal(article.keywords, keyword)) {
          //         objeto.push(article); // Agregar el artículo directamente si contiene la palabra clave
          //     }
          // });

          // let objeto = [];
          const dataKeywordsAll = allKeywords.value;
          for(var i in dataKeywordsAll){
            if(dataKeywordsAll[i].label == keyword){
              isDialogVisibleKeyWords.value.data.items = dataKeywordsAll[i].articles;
              isDialogVisibleKeyWords.value.data.search = null;
              isDialogVisibleKeyWords.value.data.title = keyword.toUpperCase();
              return true;
            }
          }

          // Limpiar la búsqueda anterior

          // Ordenar los artículos por fecha de publicación (de más reciente a más antiguo)
          // isDialogVisibleKeyWords.value.data.items = objeto.sort((a, b) => {

          //     const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
          //     const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");

          //     return dateB - dateA;
          // });

          // Actualizar título y mostrar el modal
          // isDialogVisibleKeyWords.value.data.items = objeto;
          // isDialogVisibleKeyWords.value.data.search = null;
          // isDialogVisibleKeyWords.value.data.title = keyword.toUpperCase();

          // console.log("objeto",objeto);
          return objeto;
      } catch (error) {
          console.error("Error en clickKeywordLocal:", error);
          return [];
      }
  };


  const filteredDataModalKeyWord = computed(() => {
    if(!isDialogVisibleKeyWords.value.data.search){
      return isDialogVisibleKeyWords.value.data.items;
    }

    const query = isDialogVisibleKeyWords.value.data.search.toLowerCase();
    return isDialogVisibleKeyWords.value.data.items.filter(item =>{
      return item.title.toLowerCase().includes(query) || item.sitio.toLowerCase().includes(query);
    });
  });

  // FIN DE EVENTO CLICK GRAFICO 1

  /*
  FIN - FUNCIONALIDAD
  */

  /*
  INICIO - FUNCIONALIDAD PAGINADO
  */
  
  const currentPage = ref(1);
  const pageSize = ref(18); // Valor por defecto

  watch(pageSize, () => {
    currentPage.value = 1;
  });

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredData.value.slice(start, start + pageSize.value);
  });

  /*
  FIN - FUNCIONALIDAD PAGINADO
  */

  /*
  INICIO - FUNCIONALIDAD PAGINADO ModalKeyWord
  */
  
  const currentPageModalKeyWord = ref(1);
  const pageSizeModalKeyWord = ref(10); // Valor por defecto

  watch(pageSizeModalKeyWord, () => {
    currentPageModalKeyWord.value = 1;
  });

  const paginatedDataModalKeyWord = computed(() => {
    const start = (currentPageModalKeyWord.value - 1) * pageSizeModalKeyWord.value;
    return filteredDataModalKeyWord.value.slice(start, start + pageSizeModalKeyWord.value);
  });

  /*
  FIN - FUNCIONALIDAD PAGINADOModalKeyWord
  */

  /*
  @INICIO SELECTOR DE TIEMPO
  */
  async function agruparYFiltrarPorTiempo(data, tiempo = "") {
    if(!tiempo){
      return props.articulos;
    }

    // Get unique sites from the data
    // const uniqueSites = [...new Set(data.map(item => item.sitio))];
    
    // Create dynamic sitiosEsperados
    // const sitiosEsperados = uniqueSites.map((sitio, index) => ({
    //   sitio,
    //   color: customColors[index % customColors.length]
    // }));

    // Filtrar los registros cuya fechaPublicacion sea de tiempo
    const datosFiltrados = data.filter(({ fechaPublicacion, sitio }) => {
      const fechaSinSegundos = moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss").startOf("minute");
      return fechaSinSegundos.isSameOrAfter(moment(tiempo).startOf("minute"));
    });

    return datosFiltrados;
  }

  function getTimeRange() {
    const momentValue = model_select_hora.value.value;
    return {
        inicio: {
            hoy: (moment().format("YYYY-MM-DD") == momentValue.format("YYYY-MM-DD")),
            hora: momentValue.format("hh:mm A"),
            fecha: momentValue.format("YYYY-MM-DD")
        },
        final: {
            hoy: true,
            hora: moment().format("hh:mm A"),
            fecha: moment().format("YYYY-MM-DD")
        }
    };
  }

  const model_select_hora = ref({ title:"Hoy", value: moment().startOf('day')  });

  const items_select_hora = ref([
    { title:"Todos", value: ""  },
    { title:"Hoy", value: moment().startOf('day')  },
    // { title:"Hace 5 minutos", value: moment().subtract(5, "minutes")  },
    { title:"Hace 30 minutos", value: moment().subtract(30, "minutes")  },
    { title:"Hace 1 hora", value: moment().subtract(1, "hours")  },
    { title:"Hace 3 horas", value: moment().subtract(3, "hours")  },
    { title:"Hace 5 horas", value: moment().subtract(5, "hours")  },
    { title:"Hace 12 horas", value: moment().subtract(12, "hours")  },
    // { title:"Hace 20 horas", value: moment().subtract(20, "hours")  },
  ]);

  watch(() => model_select_hora.value, async (newValue) => {
    if (newValue) {
      isLoading.value = true;
      const resultado = await agruparYFiltrarPorTiempo(props.articulos, newValue.value);
      filteredData.value = resultado;
      procesarKeywordsAndTags(filteredData.value);
      isLoading.value = false;
    }
  })
  /*
  @FIN SELECTOR DE TIEMPO
  */

  watch(() => props.articulos, async (newValue) => {
    if (newValue) {
      isLoading.value = true;
      filteredData.value = props.articulos;
      procesarKeywordsAndTags(filteredData.value);
      model_select_hora.value = { title:"Hoy", value: moment().startOf('day')  };
      isLoading.value = false;
    }
  })

  onMounted(async () => {
    isLoading.value = true;
    filteredData.value = props.articulos;
    procesarKeywordsAndTags(filteredData.value);
    model_select_hora.value = { title:"Hoy", value: moment().startOf('day')  };
    isLoading.value = false;
  });


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
/*
******* INICIO BTN descargar
*/
const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const btnLoading = ref(false);
function descargarCSV(datos, nombreArchivo = "datos.csv", columnasPersonalizadas = {}, columnasIncluidas = []) {
    if (!datos.length) {
        console.error("No hay datos para exportar.");
        return;
    }

    let todasLasClaves = new Set();
    let columnasDinamicas = {};

    // Recorrer datos para obtener claves y manejar arrays dinámicamente
    datos.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (columnasIncluidas.length === 0 || columnasIncluidas.includes(key)) {
                if (Array.isArray(obj[key])) {
                    obj[key].forEach((item, index) => {
                        if (typeof item === "object") {
                            Object.keys(item).forEach(subKey => {
                                const columnaBase = `${key}_${subKey}`;
                                const columnaDinamica = `${columnaBase}_${index + 1}`;
                                todasLasClaves.add(columnaDinamica);

                                if (!columnasDinamicas[columnaBase]) {
                                    columnasDinamicas[columnaBase] = columnasPersonalizadas[columnaBase] || subKey;
                                }
                            });
                        } else {
                            todasLasClaves.add(`${key}_${index + 1}`);
                        }
                    });
                } else {
                    todasLasClaves.add(key);
                }
            }
        });
    });
    // console.log("todasLasClaves", todasLasClaves)
    // console.log("columnasPersonalizadas", columnasPersonalizadas)
    // Generar encabezados con nombres personalizados o claves por defecto
    const encabezados = Array.from(todasLasClaves).map(key => {
        // const [mainKey, subKey, index] = key.split("_");

        // if (index) {
        //     const columnaBase = `${mainKey}_${subKey}`;
        //     return columnasDinamicas[columnaBase] ? `${columnasDinamicas[columnaBase]} ${index}` : key;
        // }
        // console.log("columnasPersonalizadas", columnasPersonalizadas[key])
        return columnasPersonalizadas[key] || key;
    });
    // console.log("columnasPersonalizadas", columnasPersonalizadas["notas_relacionadas_length"])
    // console.log("encabezados", encabezados)

    // Función para limpiar valores con comas, saltos de línea o comillas
    const limpiarValor = (valor) => {
        if (typeof valor === "string") {
            if (valor.includes(",") || valor.includes("\n") || valor.includes('"')) {
                return `"${valor.replace(/"/g, '""')}"`; // Escapar comillas dobles
            }
        }
        return valor || "";
    };

    // Generar filas de datos
    const filas = datos.map(obj => {
        return Array.from(todasLasClaves).map(key => {
            // const [mainKey, subKey, index] = key.split("_");

            // if (index) {
            //     return limpiarValor(obj[mainKey]?.[parseInt(index) - 1]?.[subKey]);
            // }

            return limpiarValor(obj[key]);
        }).join(",");
    });

    // Unir encabezados y filas en un CSV
    const csvContent = [encabezados.join(","), ...filas].join("\n");

    // Crear y descargar el archivo
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
}

const columnasPersonalizadas = {
    title: "titulo",
    link: "enlace",
    category: "vertical",
    image: "imagen",
    subcategory:"subvertical",
    keywords:"keywords",
    tipo:"tipo_articulo",
    autor:"autor",
    fechaPublicacion:"fechapublicacion",
    fechaModificacion:"fechamodificacion",
    title_characters_length:"title_characters_length",
    title_words_length:"title_words_length",
    tags:"tags",
    content_characters_length:"content_characters_length",
    content_words_length:"content_words_length",
    types_content_image:"types_content_image",
    types_content_video:"types_content_video",
    types_content_youtube:"types_content_youtube",
    types_content_vimeo:"types_content_vimeo",
    types_content_mowplayer:"types_content_mowplayer",
    types_content_twitter:"types_content_twitter",
    types_content_tiktok:"types_content_tiktok",
    types_content_multimedia:"types_content_multimedia",
    types_content_h2:"types_content_h2",
    types_content_cita:"types_content_cita",
    types_content_bullet:"types_content_bullet",
    types_content_quotecv:"types_content_quotecv",
    types_content_sabiasque:"types_content_sabiasque",
    types_content_lead:"types_content_lead",
    types_content_paragraphs:"types_content_paragraphs",
    types_content_quote:"types_content_quote",
    types_content_facebook:"types_content_facebook",
    types_content_instagram:"types_content_instagram",
    types_content_links:"types_content_links",
    subheadline_characters_length:"subheadline_characters_length",
    subheadline_words_length:"subheadline_words_length",
    image_caption_characters_length:"image_caption_characters_length",
    image_caption_words_length:"image_caption_words_length",
    notas_relacionadas_length: "notas_relacionadas_length"
};

// Columnas específicas a incluir
const columnasIncluidas = [
    "title",
    "link",
    "category",
    "image",
    "subcategory",
    "keywords",
    "tipo",
    "autor",
    "fechaPublicacion",
    "fechaModificacion",
    "title_characters_length",
    "title_words_length",
    "tags",
    "content_characters_length",
    "content_words_length",
    "types_content_image",
    "types_content_video",
    "types_content_youtube",
    "types_content_vimeo",
    "types_content_mowplayer",
    "types_content_twitter",
    "types_content_tiktok",
    "types_content_multimedia",
    "types_content_h2",
    "types_content_cita",
    "types_content_bullet",
    "types_content_quotecv",
    "types_content_sabiasque",
    "types_content_lead",
    "types_content_paragraphs",
    "types_content_quote",
    "types_content_facebook",
    "types_content_instagram",
    "types_content_links",
    "subheadline_characters_length",
    "subheadline_words_length",
    "image_caption_characters_length",
    "image_caption_words_length",
    "notas_relacionadas_length"
];

function descargarDatos() {
    try {
        const datos = filteredData.value.map(item => ({
            ...item,
            "notas_relacionadas_length": item?.notas_relacionadas?.length || 0,
            "notas_recomendadas_length": item?.notas_recomendadas?.length || 0,
        }));

        btnLoading.value = true;
        descargarCSV(
            datos, 
            moment().format("YYYY-MM-DD-HHmmss") + "-articulos.csv", 
            columnasPersonalizadas, 
            columnasIncluidas
        );
        btnLoading.value = false;
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo descargar los datos, intente nuevamente.",
            type: "error",
            model: true
        };
        btnLoading.value = false;
        console.log(error);
        return null;
    }
}

function descargarDatosModal() {
    try {
        const datos = filteredDataModalKeyWord.value.map(item => ({
            ...item,
            "notas_relacionadas_length": item?.notas_relacionadas?.length || 0,
            "notas_recomendadas_length": item?.notas_recomendadas?.length || 0,
        }));

        btnLoading.value = true;
        descargarCSV(
            datos, 
            moment().format("YYYY-MM-DD-HHmmss") + "-articulos.csv", 
            columnasPersonalizadas, 
            columnasIncluidas
        );
        btnLoading.value = false;
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo descargar los datos, intente nuevamente.",
            type: "error",
            model: true
        };
        btnLoading.value = false;
        console.log(error);
        return null;
    }
}

/*
******* FIN BTN descargar
*/
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
  <VDialog
        v-model="isDialogVisibleKeyWords.modal"
        scrollable
        max-width="650"
      >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleKeyWords.modal = !isDialogVisibleKeyWords.modal" />

      <!-- Dialog Content -->
      <VCard>
        <VCardItem >
          <div class="d-flex content-title flex-wrap">
            <div class="d-flex gap-3">
              <div class="d-flex flex-column" style="line-height: 1.3;">
                <h3 class="h2">
                  {{ isDialogVisibleKeyWords.data.title }}
                </h3>
                <div class="d-flex gap-2 align-center mt-2">
                  <small style="font-size: 10px;">Artículos</small>
                  <VChip size="x-small" color="primary">
                    {{ filteredDataModalKeyWord.length }} Artículo(s)
                  </VChip>
                </div>
              </div>

              
            </div>

            <VTextField v-model="isDialogVisibleKeyWords.data.search" label="Buscar.."
              prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 0px 0;"
              clearable />

          </div>
        </VCardItem>
        <VCardText style="max-height: 550px;">
          <VList lines="two" class="py-4">
            <!-- <VListItem class="py-0" v-if="props.disabledChart == '1' ">
              <datos_bar_vertical_noticias_por_hora :articulos="isDialogVisibleKeyWords.data.items" :disabledAll="true" :height="190" />
            </VListItem> -->
            <div v-if="filteredDataModalKeyWord.length">
              <div class="d-flex gap-2 justify-space-between mb-2 mt-5 flex-wrap flex-lg-nowrap">
                <div>
                  <VSelect 
                    style="width: 170px;" 
                    v-model="pageSizeModalKeyWord" 
                    :items="[10, 20, 100, 200, 500]" 
                    label="Registros por página" 
                    dense 
                    outlined 
                    class="d-block" 
                  />
                </div>
                <VBtn 
                  color="success"
                  style="min-width: 150px;"
                  @click="descargarDatosModal()"
                  :loading="btnLoading"
                  :disabled="btnLoading"
                >
                  Descargar <VIcon icon="tabler-download" size="20" />
                </VBtn>
              </div>

              <template v-for="item in paginatedDataModalKeyWord">

                  <VListItem class="article-card elevation-0 border-1 rounded no-truncate px-4 py-2 mb-3">
                    <template #prepend>

                      <VAvatar
                        v-if="item.picture"
                        :image="replaceAmp(item.picture)"
                        size="64"
                        rounded
                      />
                      <VIcon
                        v-else
                        icon="tabler-news"
                        size="32"
                      />

                    </template>
                    <VChip v-if="item.sitio" class="mb-2" size="x-small" color="dark">{{ item.sitio.toUpperCase() }}</VChip>
                    <VTooltip location="top">
                      <template v-slot:activator="{ props }">
                        <VListItemTitle v-bind="props" class="text-truncate">
                          {{ item.title || item.titulo }}
                        </VListItemTitle>
                      </template>
                      <span>{{ item.title || item.titulo }}</span>
                    </VTooltip>
                    <VListItemSubtitle>
                      <div class="d-flex gap-2 align-center">
                        <span class="text-xs">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                        <VChip v-if="item.subseccion" class="ml-2" size="small" color="success">{{ item.subseccion }}</VChip>
                        <small style="font-size: 10px;" v-if="seccion == 'Últimas noticias'">Página: {{ item.seccion }}</small>
                        <div title="Autor" class="align-center mt-1" v-if="item.autor" style="font-size: 12px;">
                          <VIcon
                            icon="tabler-user"
                            size="15"
                          />
                          <small style="margin-top: 5px">{{ item.autor }}</small>
                        </div>
                      </div>
                    </VListItemSubtitle>
                    <template #append>
                      <VBtn :href="item.link" target="_blank" icon variant="text" size="small">
                        <VIcon icon="tabler-external-link" />
                      </VBtn>
                    </template>
                  </VListItem>


              </template>
              <VPagination 
                class="mt-5" 
                v-model="currentPageModalKeyWord" 
                :length="Math.ceil(filteredDataModalKeyWord.length / pageSizeModalKeyWord)"
                total-visible="5" 
              />
            </div>
            <div v-else>
              <td colspan="4" class="no-results">No se encontraron resultados</td>
            </div>
          </VList>
        </VCardText>

        <VCardText class="py-4">
          <VBtn class="my-4" @click="isDialogVisibleKeyWords.modal = false">
            Cerrar modal.
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  <VRow>
    <VCol cols="12" md="12" lg="12" class="pb-0">
      <VCard :class="props.modoSimple ? 'article-card elevation-0 border-0 rounded no-truncate px-0' : ''">
        <VCardItem :class="props.modoSimple ? 'header_card_item px-0 py-1' : ''">
          <div class="d-flex justify-space-between flex-wrap flex-lg-nowrap">
            <div class="descripcion"  v-if="!props.modoSimple">
              <VCardTitle>Listado de artículos</VCardTitle>
              <VCardSubtitle>
                Mostrando {{ paginatedData.length }} artículos de {{ filteredData.length }}
              </VCardSubtitle>
              <VCardSubtitle class="mt-3" v-if="props.filtrosActivos?.busqueda">
                <b>
                  Filtro de búsqueda activo:
                </b>
                {{ props.filtrosActivos.busqueda }}
              </VCardSubtitle>
              <VCardSubtitle class="mt-1" v-if="props.filtrosActivos?.sitio.length > 0">
                <b>
                  Filtro de medio activo:
                </b>
                {{ props.filtrosActivos?.sitio.map(e => e.title).join(",") }}
              </VCardSubtitle>
              <VCardSubtitle class="mt-1" v-if="props.filtrosActivos?.seccion.length > 0">
                <b>
                  Filtro de sección activo:
                </b>
                {{ props.filtrosActivos?.seccion.join(",") }}
              </VCardSubtitle>
              <VCardSubtitle class="mt-1" v-if="props.filtrosActivos?.subseccion.length > 0">
                <b>
                  Filtro de subsección activo:
                </b>
                {{ props.filtrosActivos?.subseccion.join(",") }}
              </VCardSubtitle>
              <VCardSubtitle class="mt-1" v-if="props.filtrosActivos?.orderby.value != 'fechaPublicacion_desc'">
                <b>
                  Filtro de ordenamiento:
                </b>
                {{ props.filtrosActivos?.orderby.title }}
              </VCardSubtitle>
            </div>
            <div class="pt-2 d-flex gap-2 align-start  flex-wrap flex-lg-nowrap">
              <VSelect 
                 v-if="!props.modoSimple"
                style="min-width: 150px;"
                label="Filtrar por hora"
                v-model="model_select_hora"
                :items="items_select_hora"
                item-text="title"
                item-title="title"
                item-value="value"
                return-object 
                :disabled="props.utilizaFiltroFecha"
                :class="!props.selecteDisplay ? 'd-none' : ''"
              />
            
              <VSelect 
                style="min-width: 150px;" 
                v-model="pageSize" 
                :items="[18, 50, 100, 200, 500]" 
                label="Registros por página" 
                dense 
                outlined class="mb-4" 
              />
              <VBtn 
                color="success"
                style="min-width: 150px;"
                @click="descargarDatos()"
                :loading="btnLoading"
                :disabled="btnLoading"
              >
                Descargar <VIcon icon="tabler-download" size="20" />
              </VBtn>
            </div>
          </div>
        </VCardItem>

        <VCardText v-if="paginatedData.length > 0" :class="props.modoSimple ? 'px-0' : ''">
          
          <VRow :disabled="isLoading">
            <!-- <VCol cols="12" v-if="props.filtrosActivos?.sitio.length > 0">
              <datos_bar_vertical_noticias_por_hora :articulos="filteredData" :height="200" :disabledAll="true" />
            </VCol> -->
            <VCol cols="12" md="6" lg="4" v-for="(item, index) in paginatedData" :key="item.enlace">
              <VCard class="article-card elevation-0 border rounded no-truncate">
                <VCardText class="d-flex align-center gap-2 mt-0 px-0 py-0">
                  <VRow>
                    <VCol cols="12" md="12" lg="12" class="pb-0">
                      <!-- Imagen -->
                      <img 
                        v-if="item.picture" 
                        :src="replaceAmp(item.picture)" 
                        class="rounded img-content-ecuavisa"
                        alt="Article image" 
                      />
                      <VIcon v-else icon="tabler-news" size="40" />
                    </VCol>
                    <VCol cols="12" md="12" lg="12" class="pt-0">
                      
                      <VList
                        lines="three"
                        density="compact"
                        class="pt-0 mt-0"
                      >

                        <VListItem v-if="item.titulo">
                          <VListItemTitle style="white-space: normal;">
                            Título
                          </VListItemTitle>
                          <VListItemSubtitle>
                            {{ item.titulo }}
                          </VListItemSubtitle>
                          <VListItemSubtitle>
                              <div class="px-0 d-flex justify-space-between mt-2">
                                <div>
                                  <b>Palabras: </b>{{ item.title_words_length }}
                                </div>
                                <div>
                                  <b>Caracteres: </b>{{ item.title_characters_length }}
                                </div>
                              </div>
                          </VListItemSubtitle>
                        </VListItem>

                        <VDivider class="my-2" v-if="item.subheadline_words_length" />
                        <VListItem v-if="item.subheadline_words_length">
                          <VListItemTitle style="white-space: normal;">
                            Subtítulo
                          </VListItemTitle>
                          <VListItemSubtitle>
                            <div class="px-0 d-flex justify-space-between mt-2">
                              <div>
                                <b>Palabras: </b>{{ item.subheadline_words_length }}
                              </div>
                              <div>
                                <b>Caracteres: </b>{{ item.subheadline_characters_length }}
                              </div>
                            </div>
                          </VListItemSubtitle>
                        </VListItem>

                        <VDivider class="my-2" v-if="item.fechaPublicacion" />
                        <VListSubheader v-if="item.fechaPublicacion">Fecha</VListSubheader>
                        <VListItem class="mt-0 pt-0">
                          <div class="px-0 d-flex justify-space-between mt-0">
                            <div v-if="item.fechaPublicacion">
                              <VListItemTitle>
                                Publicación
                              </VListItemTitle>
                              <VListItemSubtitle>
                                {{ formatDate(item.fechaPublicacion) }}
                              </VListItemSubtitle>
                            </div>
                            <div v-if="item.fechaModificacion">
                              <VListItemTitle>
                                Modificación
                              </VListItemTitle>
                              <VListItemSubtitle>
                                {{ formatDate(item.fechaModificacion) }}
                              </VListItemSubtitle>
                            </div>
                          </div>
                        </VListItem>

                        <VDivider class="my-2" v-if="item.fechaPublicacion" />
                        <VListSubheader v-if="item.fechaPublicacion">Vertical y Subvertical</VListSubheader>
                        <VListItem class="mt-0 pt-0">
                          <div class="px-0 d-flex justify-space-between mt-0">
                            <div v-if="item.seccion">
                              <VListItemTitle>
                                Vertical
                              </VListItemTitle>
                              <VListItemSubtitle>
                                <VChip 
                                  style="cursor: pointer;"  
                                  @click="clickFilterLocal('seccion', item.seccion)"
                                  size="x-small" 
                                  variant="outlined"
                                  :color="getColorForText(item.seccion)"
                                  >
                                    <VIcon class="mr-1" icon="mdi-filter-cog" size="12" />
                                    {{item.seccion}}
                                </VChip>
                              </VListItemSubtitle>
                            </div>
                            <div v-if="item.subseccion">
                              <VListItemTitle>
                                Subvertical
                              </VListItemTitle>
                              <VListItemSubtitle>
                                <VChip 
                                  style="cursor: pointer;"  
                                  @click="clickFilterLocal('subseccion', item.subseccion)"
                                  size="x-small" 
                                  variant="outlined"
                                  color="default"
                                  >
                                    <VIcon class="mr-1" icon="mdi-filter-cog" size="12" />
                                    {{item.subseccion}}
                                </VChip>
                              </VListItemSubtitle>
                            </div>
                          </div>
                        </VListItem>

                        <VDivider class="my-2"  v-if="item.autor"/>
                        <VListItem v-if="item.autor">
                          <VListItemTitle>
                            Autor
                          </VListItemTitle>
                          <VListItemSubtitle>
                            <VChip 
                              style="cursor: pointer;"  
                              @click="clickFilterLocal('autor', item.autor)"
                              size="x-small" 
                              variant="outlined"
                              color="default"
                              >
                                <VIcon class="mr-1" icon="mdi-user" size="12" />
                                {{item.autor}}
                              </VChip>
                          </VListItemSubtitle>
                        </VListItem>

                        <VDivider class="my-2" v-if="item.tipo" />
                        <VListItem v-if="item.tipo">
                          <VListItemTitle>
                            Tipo de artículo
                          </VListItemTitle>
                          <VListItemSubtitle>
                            {{item.tipo}}
                          </VListItemSubtitle>
                        </VListItem>

                        <VDivider class="my-2"  v-if="item.content_words_length"/>
                        <VListItem v-if="item.content_words_length">
                          <VListItemTitle style="white-space: normal;">
                            Contenido
                          </VListItemTitle>
                          <VListItemSubtitle>
                            <div class="px-0 d-flex justify-space-between mt-2">
                              <div>
                                <b>Palabras: </b>{{ item.content_words_length }}
                              </div>
                              <div>
                                <b>Caracteres: </b>{{ item.content_characters_length }}
                              </div>
                            </div>
                          </VListItemSubtitle>
                          <!-- <VListItemTitle 
                            style="white-space: normal;" 
                            class="mt-4">
                            Multimedia
                          </VListItemTitle> -->
                          <datos_bar_horizontal_content
                            
                            title="Multimedia"
                            typeBar="bar"
                            :dataChart="[
                              {'total':item.types_content_image || 0, 'content':'Imágenes'},
                              {'total':item.types_content_video || 0, 'content':'Vídeos'},
                              {'total':item.types_content_youtube || 0, 'content':'YouTube'},
                              {'total':item.types_content_vimeo || 0, 'content':'Vimeo'},
                              {'total':item.types_content_mowplayer || 0, 'content':'Mowplayer'},
                              {'total':item.types_content_multimedia || 0, 'content':'Multimedia'},
                            ]" :height="250" />

                          <!-- <VListItemTitle 
                            style="white-space: normal;" 
                            class="mt-0">
                            Redes Sociales
                          </VListItemTitle> -->
                          <datos_bar_horizontal_content
                            title="Redes Sociales"
                            typeBar="bar"
                            :dataChart="[
                              {'total':item.types_content_tiktok || 0, 'content':'TikTok'},
                              {'total':item.types_content_twitter || 0, 'content':'X'},
                              {'total':item.types_content_facebook || 0, 'content':'Facebook'},
                              {'total':item.types_content_instagram || 0, 'content':'Instagram'}
                            ]" :height="180" />

                          <!-- <VListItemTitle 
                            style="white-space: normal;" 
                            class="mt-0">
                            Formato de Contenidos
                          </VListItemTitle> -->
                          <datos_bar_horizontal_content
                            title="Formato de Contenidos"
                            typeBar="bar"
                            :dataChart="[
                              {'total':item.types_content_h2 || 0, 'content':'H2'},
                              {'total':item.types_content_cita || 0, 'content':'Cita'},
                              {'total':item.types_content_bullet || 0, 'content':'Bullet'},
                              {'total':item.types_content_sabiasque || 0, 'content':'¿Sabías que?'},
                              {'total':item.types_content_paragraphs || 0, 'content':'Párrafos'},
                              {'total':item.types_content_quotecv || 0, 'content':'Quotecv'},
                              {'total':item.types_content_quote || 0, 'content':'Quote'},
                              {'total':item.types_content_links || 0, 'content':'Links'},
                            ]" :height="300" />
                          
                        </VListItem>

                        <VDivider class="my-2" v-if="item.image_caption_words_length" />
                        <VListItem v-if="item.image_caption_words_length">
                          <VListItemTitle style="white-space: normal;">
                          Pie de imagen
                          </VListItemTitle>
                          <VListItemSubtitle>
                            <div class="px-0 d-flex justify-space-between mt-2">
                              <div>
                                <b>Palabras: </b>{{ item.image_caption_words_length }}
                              </div>
                              <div>
                                <b>Caracteres: </b>{{ item.image_caption_characters_length }}
                              </div>
                            </div>
                          </VListItemSubtitle>
                        </VListItem>

                        <VDivider class="my-2" v-if="item.keywords" />
                        <VListItem v-if="item.keywords">
                          <VListItemTitle>
                            Palabras claves
                          </VListItemTitle>
                          <VListItemSubtitle>
                            <div class="d-flex justify-start flex-wrap gap-2 mt-2" v-if="item.keywords && !props.modoSimple">
                              <VChip 
                                style="cursor: pointer;" 
                                @click="clickKeywordLocal(keyword)" 
                                v-for="(keyword, index) in item.keywords.split(',')" 
                                :key="keyword"
                                size="x-small" 
                                variant="outlined"
                                :color="item.color"
                                >
                                {{ keyword.trim() }}
                                <VIcon class="ml-1" icon="mdi-tag" size="12" />
                              </VChip>
                            </div>
                          </VListItemSubtitle>
                        </VListItem>

                        <VListItem v-if="item.enlace">
                          <VListItemTitle>
                            Enlace
                          </VListItemTitle>
                          <VListItemSubtitle>
                            <VBtn :href="item.enlace" target="_blank" variant="tonal" size="small"
                              class="flex-shrink-0 botoncito">
                              <VIcon icon="tabler-external-link" size="16" />
                              <label v-if="!props.modoSimple">
                                Ver artículo
                              </label>
                            </VBtn>
                          </VListItemSubtitle>
                        </VListItem>
                      </VList>
                      
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>


          <VPagination class="mt-5" v-model="currentPage" :length="Math.ceil(filteredData.length / pageSize)"
            total-visible="5" />

        </VCardText>
        <VCardText v-else>
          No existen datos que mostrar con el filtro seleccionado
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
<style scoped>

.img-content-ecuavisa{
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: center;
}

.sectionprimicias .v-card-item {
  font-size: 24px;
}

.content-title {
  justify-content: space-between;
  align-items: center;
}

.v-menu .v-overlay__content>.v-card,
.v-menu .v-overlay__content>.v-sheet,
.v-menu .v-overlay__content>.v-list {
  max-width: 300px;
}

.board-content {
  height: auto;
}

/* Estilos para las cards de artículos */
.article-card {
  border: 1px solid #eee;
}


.v-theme--dark.article-card {
  border: 1px solid #5d5d5d69;
}


.article-card .v-card-text {
  padding: 8px 16px;
}

.img-content {
  min-width: 50px;
  width: 50px;
}

.fixed-avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
  object-position: center;
}

.article-content {
  min-width: 0;
}

.article-meta {
  font-size: 0.8rem;
}

.article-title {
  font-size: 0.95rem;
  line-height: 1.3;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Estado deshabilitado */
.disabled-card {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}

.bloqueToogle .v-theme--light .text-secondary {
  color: #2e2e2e !important;
}

.v-theme--light.v-menu .v-overlay__content>.v-card,
.v-theme--light.v-menu .v-overlay__content>.v-sheet,
.v-theme--light.v-menu .v-overlay__content>.v-list {
  margin-top: 10px;
  border: 1px solid #ddd;
}

.grupoTopInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 991px) {
  .grupoTopInfo {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Ajustes responsivos */
@media (max-width: 600px) {
  .img-content {
    min-width: 30px;
    width: 30px;
  }

  .fixed-avatar {
    width: 30px;
    height: 30px;
  }

  .article-title {
    font-size: 0.8rem;
  }

  .article-card .v-card-text {
    padding: 8px;
  }

  .text-caption {
    font-size: 0.55rem !important;

  }

  .v-chip.v-chip--size-x-small {
    font-size: 0.55rem;

  }

  .botoncito {
    font-size: 0.5rem !important;
  }
}

.v-list-item--density-compact.v-list-item--three-line{
  min-height: auto;
}
</style>