<script setup>
import { parseISO } from 'date-fns';
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
const itemsSitioWeb = ref([{
  title: "TODOS LOS MEDIOS",
  value: "0"
}]);

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

const data = ref([])
const LOCAL_STORAGE_KEY = 'newsStorage';

const dateEndpoint = ref({
  fechai: moment().subtract(1, "days").format("YYYY-MM-DD"),
  fechaf: moment().subtract(1, "days").format("YYYY-MM-DD")
});

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

  data.forEach((articulo) => {
    if (!enlacesUnicos.has(articulo.enlace)) {
      enlacesUnicos.add(articulo.enlace);

      if (!articulo.subvertical || articulo.subvertical.trim() === "") {
        articulo.subvertical = "Sin Categorizar";
      }

      if (!articulo.vertical || articulo.vertical.trim() === "") {
        articulo.vertical = "Home";
      }

      if (!articulo.fechapublicacion) {
        articulo.fechapublicacion = getDefaultDate().format("DD/MM/YYYY HH:mm:ss");
      }

      resultado.articles.push(articulo);
    }
  });

  // data.forEach((grupo) => {
    
  // });

  resultado.total = resultado.articles.length;
  return resultado.articles;
}

async function fetchAndProcess(url) {
  try {
    const response = await fetch(url);
    const dataResp = await response.json();
    const data = dataResp.data;
    return unificarYFiltrarDuplicados(data.filter(Boolean));
  } catch(error) {
    return null;
  }
}

async function getMedios(){
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
      itemsSitioWeb.value = [{
        title:"TODOS LOS MEDIOS",
        value: "0"
      },...uniqueData];
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

const currentDate = computed(() => {
  return moment().format('DD/MM/YYYY');
});

const loadingBtn = ref(false);
const totalesSitios = ref([]);

async function agruparYFiltrarPorTiempo(data) {
  const haceCincoMinutos = moment(lastUpdate.value,"DD/MM/YYYY HH:mm").subtract(30, "minutes");

  // Filtrar los registros con fecha_publicacion dentro de los últimos 30 minutos
  const datosFiltrados = data.filter(({ fechaPublicacion }) => {
    // console.log(fechaPublicacion, haceCincoMinutos)
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

const principalData = async function(reset = false){
  try {
    loadingBtn.value = true;
    totalesSitios.value = [];

    if(reset){
      dateEndpoint.value = {
        fechai: moment().subtract(1, "days").format("YYYY-MM-DD"),
        fechaf: moment().subtract(1, "days").format("YYYY-MM-DD"),
      };

      filtrosActivos.sitio = "0";
      filtrosActivos.busqueda = "";

      fechaIFModel.value = {
        fechasModel: [parseISO(fechaHoy), parseISO(fechaHoy)],
        fechasVModel: [parseISO(fechaHoy)],
        fechasVConfig: fechaIFModel.value.fechasVConfig,
        fechai: fechaHoyFormated,
        fechaV: fechaHoyFormated,
        fechaf: fechaHoyFormated
      }
    }

    if(!dateEndpoint.value){
      snackbar.value = {
        show: true,
        text: `Error, no se pudo listar los medios`,
        color: 'error'
      }
      return null;
    }
    
    const [medios_comunicacion] = await Promise.all([
      fetchAndProcess(`https://bigdata.ecuavisa.com:10001/api/v1/radar?FECHA_DESDE=${dateEndpoint.value.fechai}&FECHA_HASTA=${dateEndpoint.value.fechaf}&origen=${filtrosActivos.sitio == 0 ? "" : filtrosActivos.sitio}`)
    ]);
    
    const processArticles = (list, sitio, color) => {
      return (list || []).map(item => ({
        ...item,
        sitio,
        color,
        fechaPublicacion: moment(item.fechapublicacion).format("DD/MM/YYYY HH:mm:ss") || getDefaultDate().format("DD/MM/YYYY HH:mm:ss")
      }));
    };

    const datosAgrupados = agruparPorAtributo(medios_comunicacion, "origen");

    // Recorrer cada grupo de origen
    let indiceColor = 0;

    const newData = [];

    Object.entries(datosAgrupados).forEach(([origen, noticias]) => {
        console.log(`Noticias de ${origen}:`);
        indiceColor++;
        if(indiceColor > customColors.length - 1){
          indiceColor = 0;
        }

        noticias.forEach(noticia => {
            noticia.color = customColors[indiceColor]
            noticia.sitio = origen
            noticia.fechaPublicacion = moment(noticia.fechapublicacion).format("DD/MM/YYYY HH:mm:ss") || getDefaultDate().format("DD/MM/YYYY HH:mm:ss")
        });

        newData.push(...noticias)
    });
    const combinedData = [...newData];
    
    const uniqueData = Array.from(new Map(combinedData.map(item => [item.enlace, item])).values());
    
    const sortedData = uniqueData.sort((a, b) => {
      const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      return dateB - dateA;
    });

    data.value = sortedData;
    
    docDataProcess();
    
    loadingBtn.value = false;
  } catch(error) {
    loadingBtn.value = false;
    snackbar.value = {
      show: true,
      text: `Error, no se pudo listar los medios, intente nuevamente`,
      color: 'error'
    }
    console.error('Error:', error);
  }
}

onMounted(async () => {
  filtrosActivos.sitio = "0";
  await principalData();
  await getMedios();
});


const processedData = computed(() => {
  return data.value;
});

let lastResults = ref([]);
const debounceTimeout = ref(null);
const click_btn_seccion = ref(false);

watch(filtrosActivos, docDataProcess);

function docDataProcess(){
  clearTimeout(debounceTimeout.value);

  debounceTimeout.value = setTimeout(() => {
    const query = filtrosActivos.busqueda?.toLowerCase() || '';
    const sitio = filtrosActivos.sitio || "0";
    const secciones = filtrosActivos.seccion || [];
    const subseccion = filtrosActivos.subseccion || [];

    if(!query){
      lastResults.value = processedData.value;
    }else{
      lastResults.value = processedData.value.filter(item => {
        const matchesBusqueda = !query || 
          item.vertical.toLowerCase().includes(query) || 
          item.autor?.toLowerCase().includes(query) || 
          item.enlace?.toLowerCase().includes(query) || 
          item?.titulo?.toLowerCase().includes(query);
        return matchesBusqueda;
      }).sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA;
      });
    }
  }, 300);
}

const filteredData = computed(() => lastResults.value);

const formatDate = (dateString) => {
  return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
}

/** INICIO CREAR PAGINADO DE PÁGINA **/
const currentPage = ref(1);
const pageSize = ref(20); // Valor por defecto

watch(pageSize, () => {
  currentPage.value = 1;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

/** INICIO FIN PAGINADO DE PÁGINA **/
/** INICIO DATERANGE **/
const fechaHoy = moment().subtract(1, "days").format("YYYY-MM-DD");
const fechaHoyLimit = moment().format("YYYY-MM-DD");
const fechaHoyFormated = moment().subtract(1, "days").format("DD-MM-YYYY");
const fechaIFModel = ref({
  fechasModel: [parseISO(fechaHoy), parseISO(fechaHoy)],
  fechasVModel: [parseISO(fechaHoy)],
  fechasVConfig: {
      position: 'auto left',
      mode: 'range',
      maxDate: parseISO(fechaHoyLimit),
      altFormat: 'd F j, Y',
      dateFormat: 'l, j \\d\\e F \\d\\e Y',
      valueFormat: 'd-m-Y',
      reactive: true
  },
  fechai: fechaHoyFormated,
  fechaV: fechaHoyFormated,
  fechaf: fechaHoyFormated
})

function obtenerFechas(selectedDates, dateStr, instance) {
    if (selectedDates.length > 1) {
      dateEndpoint.value.fechai = moment(selectedDates[0]).format('YYYY-MM-DD');
      dateEndpoint.value.fechaf = moment(selectedDates[1]).format('YYYY-MM-DD'); 

      fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
      fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
      currentPage.value = 1;
      principalData();
    }


}
/** INICIO FIN DATERANGE **/
/** INICIO FILTRO DE SITIO **/
watch(() => filtrosActivos.sitio, async (newValue) => {
  // if (newValue.length > 0 && !itemsSitioWeb.value.includes(newValue.at(-1))) {
  //   newValue.pop();
  // }
  currentPage.value = 1;
  await principalData();
  
})
/** INICIO FIN FILTRO DE SITIO **/
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
      <VCol cols="12" md="12" lg="12">
        <VCard>
          <VCardItem>
            <div class="d-flex content-title flex-wrap w-100">
              <div class="d-flex gap-3 justify-space-between w-100">
                <div class="d-flex flex-column" style="line-height: 1.3;">
                  Históricos de artículos
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;">Total de artículos</small>
                    <VChip size="x-small" color="primary">
                      {{filteredData.length}} Artículos, desde {{dateEndpoint.fechai}} 00:00:00  Hasta {{ dateEndpoint.fechaf }} 23:59:59
                    </VChip>
                  </div>
                  <div class="content-btn mt-3">
                    <VBtn :loading="loadingBtn" title="Recargar datos" @click="principalData" target="_blank" color="primary" variant="tonal" size="small">
                      <VIcon icon="tabler-reload" /> Quitar filtros
                    </VBtn>
                  </div>
                </div>
              </div>
            </div>
          </VCardItem>
          <VDivider />
          <VCardText>
            <VRow class="mb-0">
              <VCol cols="12" md="4" lg="3" class="pb-0">
                <div class="w-100 mt-4">
                  <label>Filtrar por sitio web</label>
                  <VSelect
                    v-model="filtrosActivos.sitio"
                    :items="itemsSitioWeb"
                    :menu-props="{ maxHeight: '300' }"
                  />
                </div>
              </VCol>
              <VCol cols="12" md="8" lg="5" class="pb-0">
                <div class="w-100 mt-4">
                  <label>Filtrar por Rango de publicación</label>
                  <AppDateTimePicker 
                    prepend-inner-icon="tabler-calendar" 
                    density="compact" 
                    v-model="fechaIFModel.fechasModel"
                    show-current=true 
                    @on-change="obtenerFechas" 
                    :config="fechaIFModel.fechasVConfig" />

                </div>
              </VCol>

              <VCol cols="12" md="12" lg="4" class="pb-0">
                <div class="w-100 mt-4">
                  <label>Buscar por título o enlace</label>
                  <VTextField 
                    v-model="filtrosActivos.busqueda" 
                    prepend-inner-icon="tabler-search" 
                    density="compact" 
                    style="padding: 0px 0;"
                    clearable 
                  />
                </div>
              </VCol>
              <VCol cols="12" md="4" :lg="4" class="d-none">
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
              <VCol cols="12" md="4" :lg="4" class="d-none">
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

              <Vrow class="mb-4 px-0 mx-0">
                <VCol cols="12" md="12" lg="2" class="pb-0 px-0">
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
              </Vrow>

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
                  <VRow v-if="paginatedData.length == 0">
                    <VCol cols="12" class="pt-3">
                      Ningún dato corresponde a la fecha indicada
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

