<script setup>
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

const buscar_dato = ref(null)
const selectedItemSitioWeb = ref(null)
const itemsSitioWeb = ref(["PRIMICIAS", "EL UNIVERSO", "EXPRESO", "ECUAVISA","EL COMERCIO"]);

const selectedItemSeccion = ref(null)
const itemsSitioWebSeccion = ref([]);

const selectedItemSubSeccion = ref(null)
const itemsSitioWebSubSeccion = ref([]);

const nextUpdate = ref(null)
const horaActual = moment();
const lastUpdate = ref('--:--');
const updateInterval = ref(300);
const updateIntervalDisabled = ref(false)
const tableSearches = ref({})

const data = ref([])
const LOCAL_STORAGE_KEY = 'newsStorage';

function getDefaultDate() {
  return moment('2025-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss');
}

function replaceAmp(input) {
  return input.replace(/&amp;/g, "&");
}

function unificarYFiltrarDuplicados(data) {
  const enlacesUnicos = new Set();
  const resultado = {
    total: 0,
    timestamp: new Date().toISOString(),
    articles: []
  };

  data.forEach((grupo) => {
    grupo.articles.forEach((articulo) => {
      if (!enlacesUnicos.has(articulo.enlace)) {
        enlacesUnicos.add(articulo.enlace);

        if (!articulo.subVertical || articulo.subVertical.trim() === "") {
          articulo.subVertical = "Sin Categorizar";
        }

        if (!articulo.vertical || articulo.vertical.trim() === "") {
          articulo.vertical = "Home";
        }

        if (!articulo.fechaPublicacion) {
          articulo.fechaPublicacion = getDefaultDate().format("DD/MM/YYYY HH:mm:ss");
        }

        resultado.articles.push(articulo);
      }
    });
  });

  resultado.total = resultado.articles.length;
  return resultado.articles;
}

async function fetchAndProcess(url) {
  try {
    const response = await fetch(url);
    const dataResp = await response.json();
    return unificarYFiltrarDuplicados(dataResp.filter(Boolean));
  } catch(error) {
    return null;
  }
}

const currentDate = computed(() => {
  return moment().format('DD/MM/YYYY');
});

const loadingBtn = ref(false);
const totalesSitios = ref([]);

async function agruparYFiltrarPorTiempo(data) {
  const haceCincoMinutos = moment(lastUpdate.value,"DD/MM/YYYY HH:mm").subtract(30, "minutes");

  // Filtrar los registros con fecha_publicacion dentro de los últimos 30 minutos
  const datosFiltrados = data.filter(({ fechaPublicacion }) => {
    console.log(fechaPublicacion, haceCincoMinutos)
    return moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss").isAfter(haceCincoMinutos);
  });

  // Agrupar por sitio y color
  const resultado = Object.values(
    datosFiltrados.reduce((acc, { sitio, color }) => {
      const key = `${sitio}-${color}`;

      if (!acc[key]) {
        acc[key] = { sitio, color, total: 0 };
      }

      acc[key].total++;
      return acc;
    }, {})
  );

  return resultado;
}

const principalData = async function(){
  try {
    loadingBtn.value = true;
    totalesSitios.value = [];
    
    const [primiciasList, elUniersoList, expresoList, ecuavisaList, elComercioList] = await Promise.all([
      fetchAndProcess('https://services.ecuavisa.com/gestor/competencias/primicias/config.php?api=all'),
      fetchAndProcess('https://services.ecuavisa.com/gestor/competencias/el-universo/config.php?api=all'),
      fetchAndProcess('https://services.ecuavisa.com/gestor/competencias/el-expreso/config.php?api=all'),
      fetchAndProcess('https://services.ecuavisa.com/gestor/competencias/ecuavisa/config.php?api=all'),
      fetchAndProcess('https://services.ecuavisa.com/gestor/competencias/el-comercio/config.php?api=all')
    ]);
    

    const processArticles = (list, sitio, color) => {
      return (list || []).map(item => ({
        ...item,
        sitio,
        color,
        fechaPublicacion: item.fechaPublicacion || getDefaultDate().format("DD/MM/YYYY HH:mm:ss")
      }));
    };

    const newData = [
      ...processArticles(primiciasList, "PRIMICIAS", "primary"),
      ...processArticles(elUniersoList, "EL UNIVERSO", "info"),
      ...processArticles(expresoList, "EXPRESO", "error"),
      ...processArticles(ecuavisaList, "ECUAVISA", "warning"),
      ...processArticles(elComercioList, "EL COMERCIO", "success")
    ];

    const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    
    const combinedData = [...newData];
    
    const uniqueData = Array.from(new Map(combinedData.map(item => [item.enlace, item])).values());
    
    const sortedData = uniqueData.sort((a, b) => {
      const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      return dateB - dateA;
    });

    data.value = sortedData;
    //Inicio hace el total de sitios
    lastUpdate.value = moment(sortedData[0].timestamp).format("DD/MM/YYYY HH:mm");
    const resultado = await agruparYFiltrarPorTiempo(sortedData);
    totalesSitios.value = resultado;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.value));
    
    docDataProcess();
    
    loadingBtn.value = false;
  } catch(error) {
    loadingBtn.value = false;
    console.error('Error:', error);
  }
}

onMounted(async () => {
  // const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  // if(storedData) {
  //   data.value = JSON.parse(storedData);
  //   //Inicio hace el total de sitios
  //   const resultado = Object.values(
  //     data.value.reduce((acc, { sitio, color }) => {
  //       const key = `${sitio}-${color}`;

  //       if (!acc[key]) {
  //         acc[key] = { sitio, color, total: 0 };
  //       }

  //       acc[key].total++;
  //       return acc;
  //     }, {})
  //   );

  //   totalesSitios.value = resultado;
  //   //Fin hace el total de sitios

  // } else {
  //   await principalData();
  // }
  await principalData();
  itemsSitioWebSeccion.value = getUniqueVerticals();
  itemsSitioWebSubSeccion.value = getUniqueSubVerticals();
  docDataProcess();
  obtenerHora();
});

watch(() => filtrosActivos.seccion, (newValue) => {
  click_btn_seccion.value = true;
  if (newValue.length > 0 && !itemsSitioWebSeccion.value.includes(newValue.at(-1))) {
    newValue.pop();
  }
});

watch(() => filtrosActivos.subseccion, (newValue) => {
  if (newValue.length > 0 && !itemsSitioWebSubSeccion.value.includes(newValue.at(-1))) {
    newValue.pop();
  }
})

watch(() => filtrosActivos.sitio, (newValue) => {
  if (newValue.length > 0 && !itemsSitioWeb.value.includes(newValue.at(-1))) {
    newValue.pop();
  }
  click_btn_seccion.value = false;
})

const processedData = computed(() => {
  return data.value;
});

let lastResults = ref([]);
const debounceTimeout = ref(null);
const click_btn_seccion = ref(false);

watch(filtrosActivos, docDataProcess);

function getUniqueVerticals(objeto = null) {
  const uniqueVerticals = new Set();

  if(!objeto){
    data.value.forEach(item => {
      if (item.vertical) {
        uniqueVerticals.add(item.vertical);
      }
    });
  }else{
    objeto.forEach(item => {
      if (item.vertical) {
        uniqueVerticals.add(item.vertical);
      }
    });
  }
  
  return Array.from(uniqueVerticals);
}

function getUniqueSubVerticals(objeto = null) {
  const uniqueVerticals = new Set();

  if(!objeto){
    data.value.forEach(item => {
      if (item.subVertical) {
        uniqueVerticals.add(item.subVertical);
      }
    });
  }else{
    objeto.forEach(item => {
      if (item.subVertical) {
        uniqueVerticals.add(item.subVertical);
      }
    });
  }
  
  return Array.from(uniqueVerticals);
}

function docDataProcess(){
  clearTimeout(debounceTimeout.value);

  debounceTimeout.value = setTimeout(() => {
    const query = filtrosActivos.busqueda?.toLowerCase() || '';
    const sitio = filtrosActivos.sitio || [];
    const secciones = filtrosActivos.seccion || [];
    const subseccion = filtrosActivos.subseccion || [];

    if(!query && sitio.length === 0 && secciones.length === 0 && subseccion.length === 0){
      lastResults.value = processedData.value;
    }else{
      lastResults.value = processedData.value.filter(item => {
        const matchesBusqueda = !query || 
          item.vertical.toLowerCase().includes(query) || 
          item.autor?.toLowerCase().includes(query) || 
          item.titulo.toLowerCase().includes(query);

        const matchesSitio = sitio.length === 0 || sitio.includes(item.sitio);
        const matchesSecciones = secciones.length === 0 || secciones.includes(item.vertical);
        const matchesSubseccion = subseccion.length === 0 || subseccion.includes(item.subVertical);

        return matchesBusqueda && matchesSitio && matchesSecciones && matchesSubseccion;
      }).sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA;
      });
    }

    setTimeout(() => {
      const existeSitioSeleccionado = filtrosActivos.sitio ? true: false;
      if(existeSitioSeleccionado && !click_btn_seccion.value){
        itemsSitioWebSeccion.value = getUniqueVerticals(lastResults.value);
      }else if(!existeSitioSeleccionado && !click_btn_seccion.value){
        itemsSitioWebSeccion.value = getUniqueVerticals();
      }
    }, 1000);
  }, 300);
}

const filteredData = computed(() => lastResults.value);

const formatDate = (dateString) => {
  return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
}

/** INICIO CREAR PAGINADO DE PÁGINA **/
const currentPage = ref(1);
const pageSize = ref(100); // Valor por defecto

watch(pageSize, () => {
  currentPage.value = 1;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

/** INICIO FIN PAGINADO DE PÁGINA **/

/** INICIO RECARGA LA PÁGINA AUTOMÁTICA **/

function obtenerHora() {
  const horaActual = moment().format("HH:mm:ss");
  console.log("Hora actual:", horaActual);

  // Espera 5 minutos (300,000 ms) y luego ejecuta la función deseada
  setTimeout(() => {
    console.log("Han pasado 5 minutos. Ejecutando función...");
    principalData(); // Llama a la función deseada
    // window.location.reload(); // Si deseas recargar la página
  }, (1000 * 60 * 5));
}
/** FIN RECARGA LA PÁGINA AUTOMÁTICA **/
</script>

<template>
  <section class="sectionprimicias">
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top end"
    >
      {{ snackbar.text }}
    </VSnackbar>
    
    <VRow>
      <VCol cols="12" md="12" :lg="12">
        <VCard>
          <VCardItem>
            <div class="d-flex content-title flex-wrap w-100">
              <div class="d-flex gap-3 justify-space-between w-100">
                <div class="d-flex flex-column" style="line-height: 1.3;">
                  Últimas noticias, todos los medios de comunicación
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;">Total de artículos</small>
                    <VChip size="x-small" color="primary">
                      {{filteredData.length}} Artículos desde las 00h00 de {{ currentDate }}
                    </VChip>
                  </div>
                  <div class="content-btn mt-3">
                    <VBtn :loading="loadingBtn" title="Recargar datos" @click="principalData" target="_blank" color="primary" variant="tonal" size="small">
                      <VIcon icon="tabler-reload" /> Recargar datos
                    </VBtn>
                  </div>
                </div>
                <div class="d-flex align-center gap-2 flex-column">
                  <VChip
                    color="primary"
                    size="small"
                    prepend-icon="tabler-clock"
                  >
                    Última actualización: {{ lastUpdate }}
                  </VChip>
                  <VChip
                    class="d-none"
                    color="success"
                    size="small"
                    prepend-icon="tabler-clock"
                  >
                    Próxima actualización: {{ nextUpdate }}
                  </VChip>
                </div>
              </div>
            </div>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow class="mb-4 d-none">
              <VCol cols="12" md="12" lg="2" class="pb-0">
                <div class="w-100 mt-4">
                  <VSelect
                    v-model="pageSize"
                    :items="[100, 200, 500]"
                    label="Registros por página"
                    dense
                    outlined
                    class="mb-4"
                  />

                </div>
              </VCol>
              <VCol cols="12" md="12" lg="10" class="pb-0">
                <div class="w-100 mt-4">
                  <VTextField 
                    v-model="filtrosActivos.busqueda" 
                    :label="`Buscar por, título, autor, sección, subsección`"
                    prepend-inner-icon="tabler-search" 
                    density="compact" 
                    style="padding: 0px 0;"
                    clearable 
                  />
                </div>
              </VCol>
              <VCol cols="12" md="4" :lg="4" class="pb-0">
                <div class="w-100 mt-4">
                  <label>Filtrar por sitio web</label>
                  <VCombobox
                    v-model="filtrosActivos.sitio"
                    :items="itemsSitioWeb"
                    multiple
                    chips
                    :menu-props="{ maxHeight: '300' }"
                  />
                </div>
              </VCol>
              <VCol cols="12" md="4" :lg="4">
                <div class="w-100 mt-4">
                  <label>Filtrar por Sección</label>
                  <VCombobox
                    v-model="filtrosActivos.seccion"
                    :items="itemsSitioWebSeccion"
                    multiple
                    chips
                    :menu-props="{ maxHeight: '300' }"
                  />
                </div>
              </VCol>
              <VCol cols="12" md="4" :lg="4">
                <div class="w-100 mt-4">
                  <label>Filtrar por SubSección</label>
                  <VCombobox
                      v-model="filtrosActivos.subseccion"
                      :items="itemsSitioWebSubSeccion"
                      multiple
                      chips
                      :menu-props="{ maxHeight: '300' }"
                    />
                  </div>
                </VCol>
              </VRow>

              <div class="board-content" :disabled="filtrosActivos.disabled">
                <div v-if="filteredData.length" :class="loadingBtn ? 'disabled-card' : ''">
                  <VRow>
                    <VCol cols="12" v-for="(item, index) in paginatedData" :key="item.enlace">
                      <VCard class="article-card">
                        <VCardText class="d-flex align-center gap-2 py-1">
                          <!-- Imagen -->
                          <div class="img-content">
                            <img
                              v-if="item.picture"
                              :src="replaceAmp(item.picture)"
                              class="fixed-avatar rounded"
                              alt="Article image"
                            />
                            <VIcon v-else icon="tabler-news" size="40" />
                          </div>
                          
                          <!-- Contenido -->
                          <div class="article-content w-100">
                            <!-- Fila 1: medio, fecha y categoría -->
                            <div class="article-meta d-flex align-center gap-2 mb-1">
                              <VChip variant="elevated" size="x-small" :color="item.color">
                                {{ item.sitio }}
                              </VChip>
                              <span class="text-caption">{{ formatDate(item.fechaPublicacion) }}</span>
                              <VChip size="x-small">{{ item.vertical }}</VChip>
                              <div class="autor-ec" title="Autor">
                                <VIcon icon="tabler-user" size="15" /> <small>{{ item.autor }}</small>
                              </div>
                              <div class="article-type-ec" title="Tipo de artículo">
                                <VIcon icon="tabler-article" size="15" /> <small>{{ item.tipo }}</small>
                              </div>
                            </div>
                            
                            <!-- Fila 2: título y botón -->
                            <div class="d-flex justify-space-between align-center gap-2">
                              <h4 class="article-title mb-0">{{ item.titulo }}</h4>
                              <VBtn 
                                :href="item.enlace" 
                                target="_blank" 
                                variant="tonal" 
                                size="x-small"
                                class="px-2 py-1 ml-2 flex-shrink-0 botoncito"
                              >
                                <VIcon icon="tabler-external-link" size="16" class="mr-1" /> 
                                Ver artículo
                              </VBtn>
                            </div>
                          </div>
                        </VCardText>
                      </VCard>
                    </VCol>
                  </VRow>
                  
                      
                  <VPagination
                        class="mt-5"
                        v-model="currentPage"
                        :length="Math.ceil(filteredData.length / pageSize)"
                        total-visible="5"
                      />
                </div>

              </div>
           
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style scoped>

.sectionprimicias .v-card-item {
  font-size: 24px;
}

.content-title {
  justify-content: space-between;
  align-items: center;
}

.board-content {
  height: auto;
}

/* Estilos para las cards de artículos */
.article-card {
  border: 1px solid #eee;
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
    font-size: 0.5rem!important;
}
}
</style>

