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
  dataTags: { type: Array, required: true },  // Propiedad que recibe los datos
  dataListArticles: { type: Array, required: true }  // Propiedad que recibe los datos
});

const words = ref([]);
const width = ref(window.innerWidth * 0.53);  // 90% del ancho de pantalla
const height = ref(window.innerHeight * 0.53); // 50% de la altura de pantalla
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
    .padding(5)
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
        .style("cursor", "pointer")
        
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

        .on("click", (event, d) => {
          // alert(`Palabra seleccionada: ${d.text}`)
          clickKeyword(d.text);
      });
    })
    .start();
};


function normalizarValores() {
  try {
    const words = props.data;

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
      }else{
        sizeLocal = getRandomInt(35, 70);
      }
      return ({
        text: word.label,
        size: (sizeLocal).toFixed(2) * 1,
      });
    });

    // Retornar el resultado

    console.log("normalizedWords", normalizedWords)
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

watch(() => props.data, debounceUpdate, { deep: true });
watch(() => props.dataTags, debounceUpdate, { deep: true });

onMounted(() => {
  // console.log("props.dataListArticles", props.dataListArticles)
  // console.log("props.dataListArticles", JSON.stringify(props.dataListArticles, null, 2));

  debounceUpdate();
});

// onUnmounted(() => {
//   window.removeEventListener("resize", actualizarDimensiones);
// });

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

          return parsedKeywords.includes(keyword.trim());
      } catch (err) {
          console.warn('Error parsing keywords:', err);
          return false;
      }
  };


  const clickKeyword = (keyword) => {
      try {
          isDialogVisibleChart1.value.modal = true;
          const listaNormalizada = props.dataListArticles.map(item => ({ ...item }));
          let objeto = [];

          // console.log("props.dataListArticles", props.dataListArticles)

          // Iterar sobre cada artículo en props.dataListArticles
          for(var i in listaNormalizada){
            const article = listaNormalizada[i];

            if(article.keywords){
              if (article.hasOwnProperty("keywords") && containsKeyword(article.keywords, keyword)) {
                  objeto.push(article); // Agregar el artículo directamente si contiene la palabra clave
              }
            }
          }

          // console.log("objeto", objeto)

          // (props.dataListArticles).forEach(article => {
          //     // console.log("containsKeyword(article.keywords, keyword)", containsKeyword(article.keywords, keyword))
          //     // console.log("containsKeyword(article.keywords, keyword) article.keywords", article.keywords, keyword)
              
          // });

          // Limpiar la búsqueda anterior

          // Ordenar los artículos por fecha de publicación (de más reciente a más antiguo)
          // isDialogVisibleChart1.value.data.items = objeto.sort((a, b) => {

          //     const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
          //     const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");

          //     return dateB - dateA;
          // });

          // Actualizar título y mostrar el modal
          isDialogVisibleChart1.value.data.items = objeto;

          isDialogVisibleChart1.value.data.search = null;
          isDialogVisibleChart1.value.data.title = keyword.toUpperCase();

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
      // return [];
    }

    const query = isDialogVisibleChart1.value.data.search.toLowerCase();
    return isDialogVisibleChart1.value.data.items.filter(item =>
      item.title.toLowerCase().includes(query)
    );
  });

  // FIN DE EVENTO CLICK GRAFICO 1
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
        <VCardItem >
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
        <VCardText style="max-height: 550px;">
          <VList lines="two" class="py-4">
            <div v-if="filteredDataModalChart1.length">
              <template v-for="item in filteredDataModalChart1">


                  <VListItem>
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
                    <VTooltip location="top">
                      <template v-slot:activator="{ props }">
                        <VListItemTitle v-bind="props" class="text-truncate">
                          {{ item.title }}
                        </VListItemTitle>
                      </template>
                      <span>{{ item.title }}</span>
                    </VTooltip>
                    <VListItemSubtitle>
                      <div class="d-flex gap-2 align-center">
                        <span class="text-xs">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                        <VChip v-if="item.subseccion" class="ml-2" size="small" color="success">{{ item.subseccion }}</VChip>
                      </div>
                      <small style="font-size: 10px;" v-if="seccion == 'Últimas noticias'">Página: {{ item.seccion }}</small>
                      <div title="Autor" class="align-center mt-1" v-if="item.autor" style="font-size: 12px;">
                        <VIcon
                          icon="tabler-user"
                          size="15"
                        />
                        <small style="margin-top: 5px">{{ item.autor }}</small>
                      </div>
                    </VListItemSubtitle>
                    <template #append>
                      <VBtn :href="item.link" target="_blank" icon variant="text" size="small">
                        <VIcon icon="tabler-external-link" />
                      </VBtn>
                    </template>
                  </VListItem>


              </template>
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

    <VRow>
        <VCol cols="12" sm="8" lg="8">
          <svg id="wordCloud"></svg>
        </VCol>
        <VCol cols="12" sm="4" lg="4">
          <div v-for="(keyword, index) of (props.data.slice(0, 8))" :key="index">
            <VListItem @click="clickKeyword(keyword.label)"  style="cursor:pointer;">
              <template #prepend>
                <VAvatar
                  size="36"
                  rounded
                  variant="tonal"
                  icon="tabler-world-code"
                  color="black"
                />
              </template>

              <VListItemTitle>
                {{ keyword.label }}
              </VListItemTitle>

              <VListItemSubtitle class="mt-2">
                {{ keyword.value }}
              </VListItemSubtitle>
            </VListItem>

            <VDivider v-if="index !== (props.data.slice(0, 8)).length - 1" />
          </div>
        </VCol>
    </VRow>
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

/* th {
  background-color: #f2f2f2;
} */
</style>