<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import * as d3 from "d3";
import cloud from "d3-cloud";
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  moment.tz.setDefault('America/Guayaquil');

  const props = defineProps({
    data: { type: Array, required: true },  // Propiedad que recibe los datos
    // dataTags: { type: Array, required: true },  // Propiedad que recibe los datos
    // dataListArticles: { type: Array, required: true },  // Propiedad que recibe los datos
    limitKeywords: { type: String, default: 75 },  // Propiedad que recibe los datos
    selecteDisplay: { type: Boolean, required: true, default: true } 
  });

  const keywordsAndArticles = ref([]);
  const words = ref([]);
  const width = ref(window.innerWidth * 0.53);  // 90% del ancho de pantalla
  const height = ref(window.innerHeight * 0.65); // 50% de la altura de pantalla
  const limitKeywords = ref(15);
  let updateTimeout = null; // Variable para manejar el debounce

  const formatDate = (dateString) => {
    if(dateString.includes("Fecha no disponibl")){
      return dateString;
    }
    return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
  }

  function replaceAmp(input) {
    return input.replace(/&amp;/g, "&");
  }

  const debounceUpdate = () => {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      const wordsTem = normalizarValores();
      if (wordsTem) {
        words.value = wordsTem.p_normalizadas;
        generateWordCloud();
      }
    }, 900); // Espera 500ms después del último cambio antes de actualizar
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min); // Redondea hacia arriba (por si min es decimal)
    max = Math.floor(max); // Redondea hacia abajo (por si max es decimal)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateWordCloud = () => {
    const svg = d3.select("#wordCloud")
      .attr("viewBox", `0 0 ${width.value} ${height.value}`)
      .attr("preserveAspectRatio", "xMidYMid meet"); // Mantiene el contenido centrado

    svg.selectAll("*").remove(); // Limpiar SVG antes de renderizar
    // 🔥 Definir las rotaciones específicas para las primeras palabras
    const rotations = [0, 10, -40, -10, -110]; // Las primeras 5 palabras con ángulos específicos
    // 🔹 Escalar tamaños proporcionalmente
    const maxSize = d3.max(words.value, d => d.size);
    const minSize = d3.min(words.value, d => d.size);
    const scaleSize = d3.scaleSqrt()
      .domain([minSize, maxSize])
      .range([10, width.value / 6]);

    cloud()
      .size([width.value, height.value])
      .words(words.value.map((d, i) => {
        const rotation = i < rotations.length ? rotations[i] : Math.floor(Math.random() * 121) - 60; 
        return { ...d, size: d.size, rotate: rotation };
      }))
      // .words(words.value.map(d => ({ ...d, size: d.size })))
      // .rotate(() => (Math.random() > 0.5 ? 0 : 90)) // Rotar 50% de las palabras
      // .rotate(d =>  { return (~~(Math.random() * 6) - 3) * 30; })
      .rotate(d => d.rotate)
      .padding(1)
      .font("Impact")
      .fontSize(d => d.size)
      .on("end", (wordData) => {
        const g = svg.append("g")
          .attr("transform", `translate(${width.value / 2}, ${height.value / 2})`); // 🔹 Siempre centrado

        g.selectAll("text")
          .data(wordData)
          .enter()
          .append("text")
          .attr("font-size", d => d.size)
          .attr("font-family", "Impact")
          .attr("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)]) // Colores aleatorios
          .attr("text-anchor", "middle")
          .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
          .text(d => d.text)
          // .style("cursor", "pointer")
          
          // 🚀 Animación: Aumenta tamaño al hacer hover
          .on("mouseover", function (event, d) {
            d3.select(this)
              .transition()
              .duration(200) // Duración de la animación
              .attr("font-size", d.size * 1.1) // Aumenta un 30% el tamaño
              .attr("fill", "red"); // Opcional: cambia el color al pasar el mouse
          })
          
          .on("mouseout", function (event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("font-size", d.size) // Vuelve al tamaño original
              .attr("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)]); // Recupera su color original
          })

          // .on("click", (event, d) => {
            // alert(`Palabra seleccionada: ${d.text}`)
            // clickKeyword(d.text);
        // });
      })
      .start();
  };


  function normalizarValores() {
    try {
      const words = keywordsAndArticles.value;

      // Verificar si el array está vacío
      if (words.length === 0) {
        return null;
      }

      // Paso 1: Añadir 1 a los valores que sean 0
      const adjustedWords = words.map(word => ({
        ...word,
        value: word.value == 0 ? 10 : word.value, // Si value es 0, se convierte en 1
      }));

      // Paso 2: Ordenar de mayor a menor por 'value'
      adjustedWords.sort((a, b) => b.value - a.value);

      // Paso 3: Seleccionar solo las 15 primeras palabras
      const top10Words = adjustedWords.slice(0, limitKeywords.value);

      // Paso 4: Extraer los valores de 'value'
      const sizes = top10Words.map(word => word.value);
      // console.log("sizes", sizes)

      // Paso 5: Calcular el promedio
      const average = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
      // console.log("average", average)

      // Paso 6: Encontrar el mínimo y máximo
      const min = Math.min(...sizes);
      const max = Math.max(...sizes);
      // console.log("min", min)
      // console.log("max", max)

      // Paso 7: Normalizar los valores sobre 100
      const normalizedWords = top10Words.map(word => {
        let sizeLocal = ((word.value - min) / (max - min)) * 100;
        if (sizeLocal < 20) {
          sizeLocal = getRandomInt(10, 34);
        }else if( sizeLocal < 40){
          sizeLocal = getRandomInt(35, 45);
        }else if( sizeLocal < 50){
          sizeLocal = getRandomInt(46, 55);
        }else{
          sizeLocal = getRandomInt(56, 70);
        }
        return ({
          text: word.label,
          size: (sizeLocal).toFixed(2) * 1,
        });
      });

      // Retornar el resultado

      // console.log("normalizedWords", normalizedWords)
      return {
        promedio: average,
        p_normalizadas: normalizedWords,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  const actualizarDimensiones = () => {
    width.value = window.innerWidth * 0.53;
    height.value = window.innerHeight * 0.53;
    generateWordCloud();
  };

// INICIO DE EVENTO CLICK GRAFICO 1
  const isDialogVisibleChart1 = ref({
    modal: false,
    search: null,
    data:{
      title: "",
      items: []
    }
  })

  const containsKeyword = (keywords, keyword) => {
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
          // console.log("parsedKeywords", parsedKeywords)
          // for(var i in parsedKeywords){
          //   // console.log("parsedKeywords[i]", parsedKeywords[i], parsedKeywords[i] == keyword)
          //   return parsedKeywords[i] == keyword;
          // }
          return parsedKeywords.includes(keyword);
      } catch (err) {
          console.warn('Error parsing keywords:', err);
          return false;
      }
  };

  const clickKeyword = (keyword) => {
      try {
          isDialogVisibleChart1.value.modal = true;
          let objeto = [];
          const keyWordsList = keywordsAndArticles.value;
          for(var i in keyWordsList){
            if(keyWordsList[i].label == keyword){
              isDialogVisibleChart1.value.data.items = keyWordsList[i].articles;
              isDialogVisibleChart1.value.data.search = null;
              isDialogVisibleChart1.value.data.title = keyword.toUpperCase();
              return true;
            }
          }

          // {{.slice(0, 1)[0].articles.length}}

          // console.log("props.dataListArticles", props.dataListArticles)

          // Iterar sobre cada artículo en props.dataListArticles
          // Object.values(props.dataListArticles).forEach(article => {
          //     // console.log("containsKeyword(article.keywords, keyword)", containsKeyword(article.keywords, keyword))
          //     // console.log("containsKeyword(article.keywords, keyword) article.keywords", article.keywords, keyword)
          //     if (article.hasOwnProperty("keywords") && containsKeyword(article.keywords, keyword)) {
          //         objeto.push(article); // Agregar el artículo directamente si contiene la palabra clave
          //     }
          // });

          // Limpiar la búsqueda anterior

          // Ordenar los artículos por fecha de publicación (de más reciente a más antiguo)
          // isDialogVisibleChart1.value.data.items = objeto.sort((a, b) => {

          //     const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
          //     const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");

          //     return dateB - dateA;
          // });

          // Actualizar título y mostrar el modal
          

          // console.log("objeto",objeto);
          return objeto;
      } catch (error) {
          console.error("Error en clickKeyword:", error);
          return [];
      }
  };

  const filteredDataModalChart1 = computed(() => {
    if(!isDialogVisibleChart1.value.data.search){
      return isDialogVisibleChart1.value.data.items;
    }

    const query = isDialogVisibleChart1.value.data.search.toLowerCase();
    return isDialogVisibleChart1.value.data.items.filter(item =>{
      return item.title.toLowerCase().includes(query) || item.sitio.toLowerCase().includes(query);
    });
  });

  // FIN DE EVENTO CLICK GRAFICO 1
  const filtrosActivos = reactive({
    busqueda: "",
    sitio: [],
    seccion: [],
    subseccion: [],
    disabled: false
  });

  /*
  INICIO SELECTOR DE TIEMPO
  */
  const horaSelectedText = ref("");
  function getTimeRange() {
    const momentValue = model_select_hora.value.value;
    if(!momentValue){
      horaSelectedText.value = `Todos los datos`;
      return true;
    }
    const horaSelectedTextLocal = {
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
    horaSelectedText.value = (`Desde ${horaSelectedTextLocal.inicio.hoy ? "" : horaSelectedTextLocal.inicio.fecha + "," } ${horaSelectedTextLocal.inicio.hora } hasta ${horaSelectedTextLocal.inicio.hoy ? "" : "Hoy," } ${horaSelectedTextLocal.final.hora }`);
    return true;
  }

  const model_select_hora = ref({ title:"Hoy", value: moment().startOf('day')  });
  const items_select_hora = ref([
    { title:"Todos", value: ""  },
    { title:"Hoy", value: moment().startOf('day')  },
    { title:"Hace 15 minutos", value: moment().subtract(15, "minutes")  },
    { title:"Hace 30 minutos", value: moment().subtract(30, "minutes")  },
    { title:"Hace 1 hora", value: moment().subtract(1, "hours")  },
    { title:"Hace 3 horas", value: moment().subtract(3, "hours")  },
    { title:"Hace 5 horas", value: moment().subtract(5, "hours")  },
    { title:"Hace 12 horas", value: moment().subtract(12, "hours")  },
    { title:"Hace 20 horas", value: moment().subtract(20, "hours")  },
  ]);

  watch(() => model_select_hora.value, async (newValue) => {
    if (newValue) {
      const tiempo = newValue.value;
      const keywords = props.data;
      desagruparListadoArticulos(keywords, tiempo);
      getTimeRange();
    }
  })

  function desagruparListadoArticulos(keywords, tiempo = ""){
    try{

      if(!tiempo){
        keywordsAndArticles.value = props.data;
        return true;
      }

      const articles = [];
      for(var i in keywords){
        const keyword = keywords[i];
        for(var j in keyword.articles){
          const article = keyword.articles[j];
          articles.push(article);
        }
      }

      const uniqueArticles = [];
      const seenLinks = new Set();

      for (const article of articles) {
          if (!seenLinks.has(article.link) && !article.hasOwnProperty("getArticle")) {
              seenLinks.add(article.link);
              uniqueArticles.push(article);
          }
      }

      const datosFiltrados = uniqueArticles.filter(({ fechaPublicacion, sitio }) => {
        if (fechaPublicacion) {
          const fecha = moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss", true); // modo estricto
          if (fecha.isValid()) {
            const fechaSinSegundos = fecha.startOf("minute");
            return fechaSinSegundos.isSameOrAfter(moment(tiempo).startOf("minute"));
          }
        }
        return false;
      });


      procesarKeywords(datosFiltrados);

      return true;
    }catch(e){
      console.log(e);
      return null;
    }
  }

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

  const procesarKeywords = (articles) => {
    const resp = procesarItems(articles, 'keywords');
    // console.log("resp.allItems", resp.allItems)
    keywordsAndArticles.value = resp.allItems;
  }
  /*
  FIN SELECTOR DE TIEMPO
  */

  /*INICIO DE SCRIPT*/
  watch(() => keywordsAndArticles.value, debounceUpdate, { deep: true });
  
  watch(() => props.data, ()=>{
    keywordsAndArticles.value = props.data;
    model_select_hora.value = { title:"Hoy", value: moment().startOf('day')  };
  });
  // watch(() => props.dataTags, debounceUpdate, { deep: true });

  onMounted(() => {
    if(props.limitKeywords){
      limitKeywords.value = props.limitKeywords * 1;
    }

    keywordsAndArticles.value = props.data;
    model_select_hora.value = { title:"Hoy", value: moment().startOf('day')  };

    // console.log("keywordsAndArticles.value", keywordsAndArticles.value.splice(0, 5))
    // console.log("props.dataListArticles", props.dataListArticles)
    debounceUpdate();
  });
  /*FIN DE INICIO DE SCRIPT*/
</script>

<template>
  <section>
    <VDialog
        v-model="isDialogVisibleChart1.modal"
        scrollable
        max-width="650"
      >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleChart1.modal = !isDialogVisibleChart1.modal" />

      <!-- Dialog Content -->
      <VCard>
        <VCardItem class="px-1 py-1">
          <div class="d-flex content-title flex-wrap">
            <div class="d-flex gap-3">
              <div class="d-flex flex-column" style="line-height: 1.3;">
                <h3 class="h2">
                  {{ isDialogVisibleChart1.data.title }}
                </h3>
                <div class="d-flex gap-2 align-center mt-2">
                  <small style="font-size: 10px;">Artículos</small>
                  <VChip size="x-small" color="primary">
                    {{ filteredDataModalChart1.length }} Artículo(s)
                  </VChip>
                </div>
              </div>

              
            </div>

            <VTextField v-model="isDialogVisibleChart1.data.search" label="Buscar.."
              prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 0px 0;"
              clearable />

          </div>
        </VCardItem>
        <VCardText style="max-height: 450px;">
          <VList lines="two" class="py-4">
            <div v-if="filteredDataModalChart1.length">
              
            </div>
            <div v-else>
              <td colspan="4" class="no-results">No se encontraron resultados</td>
            </div>
          </VList>
        </VCardText>

        <VCardText class="py-4">
          <VBtn class="my-4" @click="isDialogVisibleChart1.modal = false">
            Cerrar modal.
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VCard >
      <VCardItem class="px-2 py-2">
        <VCardTitle>Palabras clave más Relevante</VCardTitle>
        <VCardSubtitle class="d-none">
          <!-- Agrupados por medios digitales según la fecha de publicación de los artículos -->
          Palabras clave: {{horaSelectedText}}
        </VCardSubtitle>

        <template #append>
          <VSelect 
            style="min-width: 150px;"
            label="Filtrar por hora"
            v-model="model_select_hora"
            :items="items_select_hora"
            item-text="title"
            item-title="title"
            item-value="value"
            return-object 
            :class="!props.selecteDisplay ? 'd-none' : 'd-none'"
          />
        </template>
      </VCardItem>
      <VCardText class="px-2 py-0 pb-2">
        <VRow v-if="keywordsAndArticles.length > 0">
          <VCol cols="12" sm="8" lg="8" class="pe-0">
            <svg id="wordCloud" v-if="keywordsAndArticles.length > 0"></svg>
          </VCol>
          <VCol cols="12" sm="4" lg="4" class="ps-0">
            <div v-for="(keyword, index) of (keywordsAndArticles.slice(0, 6))" :key="index">
              <VListItem class="list-item-min-heigth-keyword px-1">
                <template #prepend>
                  <VAvatar
                    size="16"
                    rounded
                    variant="tonal"
                    icon="tabler-world-code"
                    color="black"
                  />
                </template>

                <VListItemTitle class="text-world-code">
                  {{ keyword.label }}
                </VListItemTitle>

                <VListItemSubtitle class="sub-text-world-code">
                  {{ keyword.value }}
                </VListItemSubtitle>
              </VListItem>

              <VDivider v-if="index !== (keywordsAndArticles.slice(0, 8)).length - 1" />
            </div>
          </VCol>
        </VRow>
        <VRow v-else>
          <VCol cols="12" sm="12" lg="12">
            No hay datos para mostrar en este rango
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </section>
</template>

<style scoped>
  svg#wordCloud {
    display: block;
    margin: auto;
    width: 100%;
    height: auto;
  }
</style>
<style scoped>
.sectionprimicias .v-card-item {
  font-size: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  height: 400px;
  display: block;
  overflow-y: auto;
}

.content-title {
  justify-content: space-between;
  align-items: center;
}

.board-content {
  height: 500px;
  overflow-y: auto;
}

th,
td {
  /* border: 1px solid #ddd; */
  padding: 8px;
  text-align: left;
}

.fixed-avatar {
    width: 100%;
    height: 130px;
    object-fit: cover;
    object-position: center;
}

.h4.titulo {
    font-size: 13px;
    line-height: 1.3;
}



.disabled-card {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}

.text-world-code{
  font-size: 0.5rem;
  line-height: 1.2;
}

.sub-text-world-code{
  font-size: 0.5rem;
  line-height: 1.2;
}

.list-item-min-heigth-keyword{
  min-height: 20px;
}

.v-list-item__prepend > .v-avatar {
    margin-inline-end: 5px;
}
/* th {
  background-color: #f2f2f2;
} */
</style>