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

  const loadingBtn = ref(false);

  const principalData = async function(){
    try {
      loadingBtn.value = true;
      
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
      
      // Combinar nuevos datos con los almacenados
      const combinedData = [...newData, ...storedData];
      
      // Eliminar duplicados usando un Map
      const uniqueData = Array.from(new Map(combinedData.map(item => [item.enlace, item])).values());
      
      // Ordenar por fecha
      const sortedData = uniqueData.sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA;
      });

      // Actualizar data.value reactivamente
      data.value = sortedData;

      // Guardar en localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.value));
      
      // Forzar la actualización de filteredData
      docDataProcess();
      
      loadingBtn.value = false;
    } catch(error) {
      loadingBtn.value = false;
      console.error('Error:', error);
    }
  }

  onMounted(async () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if(storedData) {
      data.value = JSON.parse(storedData);
    } else {
      await principalData();
    }
    itemsSitioWebSeccion.value = getUniqueVerticals();
    itemsSitioWebSubSeccion.value = getUniqueSubVerticals();
    docDataProcess();
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
    const seen = new Map();
    data.value.forEach(item => {
      const existing = seen.get(item.enlace);
      
      if (!existing || (existing.picture === null && item.picture !== null)) {
        // Si no existe o si el existente tiene picture null y el actual no lo tiene, actualizamos
        seen.set(item.enlace, {
          ...item,
          subVertical: item.subVertical === 'NN' ? '' : item.subVertical,
          isDuplicate: false
        });
      }
    });

    // console.log(data.value.filter(item => item.sitio === "EXPRESO"))
    // Devolvemos los valores únicos como un array
    return Array.from(seen.values());
    
  });

  // const groupedData = computed(() => {
  //  return processedData.value.reduce((acc, item) => {
  //    // if (!item.isDuplicate) {
  //    //   if (!acc[item.vertical]) acc[item.vertical] = []
  //    //   acc[item.vertical].push(item)
  //    // }
  //     if (!acc[item.vertical]) acc[item.vertical] = []
  //     acc[item.vertical].push(item)
  //     return acc
  //  }, {})
  // })

  let lastResults = ref([]); // Mantener resultados previos

  // Variable para manejar el debounce
  const debounceTimeout = ref(null);
  const click_btn_seccion = ref(false);

  // Lógica reactiva con debounce
  watch(filtrosActivos, docDataProcess);

  function getUniqueVerticals(objeto = null) {
      // Usamos un Set para evitar duplicados
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
      
      // Convertimos el Set en un array para retornar
      return Array.from(uniqueVerticals);
  }

  function getUniqueSubVerticals(objeto = null) {
      // Usamos un Set para evitar duplicados
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
      

      // Convertimos el Set en un array para retornar
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
          return dateB - dateA; // Mayor a menor
        });
      }
      // console.log(sitio.length)
      setTimeout(() => {
        // Actualizar items únicos para las secciones
        const existeSitioSeleccionado = filtrosActivos.sitio ? true: false;
        if(existeSitioSeleccionado && !click_btn_seccion.value){
          itemsSitioWebSeccion.value = getUniqueVerticals(lastResults.value);
        }else if(!existeSitioSeleccionado && !click_btn_seccion.value){
          itemsSitioWebSeccion.value = getUniqueVerticals();
        }

        // if(secciones.length == 0){
        //   itemsSitioWebSubSeccion.value = getUniqueSubVerticals(lastResults.value);
        // }
      }, 1000);
      
      // itemsSitioWebSeccion.value = getUniqueVerticals(lastResults.value);
      // itemsSitioWebSubSeccion.value = getUniqueSubVerticals(lastResults.value);
    }, 300); // 300 ms de debounce
  }

  // Computed para usar en el DOM
  const filteredData = computed(() => lastResults.value);



  const formatDate = (dateString) => {
    return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
  }

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
          <VCardItem >
            <div class="d-flex content-title flex-wrap">
              <div class="d-flex gap-3">
                <div class="d-flex flex-column" style="line-height: 1.3;">
                  Últimas noticias, todos los medios de comunicación
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;">Todas las páginas</small>
                    <VChip size="x-small" color="primary">
                      {{filteredData.length}} Artículo(s)
                    </VChip>
                  </div>
                  <div class="content-btn mt-3">
                    <VBtn :loading="loadingBtn" title="Recargar datos" @click="principalData" target="_blank" color="primary" variant="tonal" size="small">
                      <VIcon icon="tabler-reload" /> Recargar datos
                    </VBtn>
                  </div>
                </div>
              </div>
            </div>
          </VCardItem>
          <VDivider />
          <VCardText>

            <VRow class="mb-4">
              <VCol cols="12" md="12" :lg="12" class="pb-0">
                <div class="w-100 mt-4 ">
                  <VTextField v-model="filtrosActivos.busqueda" :label="`Buscar por, título, autor, sección, subsección`"
                    prepend-inner-icon="tabler-search" density="compact" style=" padding: 0px 0;"
                    clearable />
                </div>
              </VCol>
              <VCol cols="12" md="4" :lg="4" class="pb-0">
                <div class="w-100 mt-4 ">
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
                <div class="w-100 mt-4 ">
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
                <div class="w-100 mt-4 ">
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
                  <VCol cols="12" v-for="(item, index) in filteredData" :key="item.enlace">
                    <VCard class="mb-4">
                      <VCardText class="d-flex align-center gap-4">
                        <div class="img-content" style="min-width: 120px">
                          <img
                            v-if="item.picture"
                            :src="replaceAmp(item.picture)"
                            class="fixed-avatar rounded"
                            style="width: 120px; height: 80px; object-fit: cover"
                          />
                          <VIcon v-else icon="tabler-news" size="40" />
                        </div>
                        
                        <div class="d-flex flex-column w-100">
                          <div class="d-flex justify-space-between align-center mb-2">
                            <VChip variant="elevated" size="x-small" :color="item.color">
                              {{ item.sitio }}
                            </VChip>
                            <span class="text-caption">{{ formatDate(item.fechaPublicacion) }}</span>
                          </div>
                          
                          <h4 class="text-h6 mb-2">{{ item.titulo }}</h4>
                          
                          <div class="d-flex justify-space-between align-center">
                            <VChip size="x-small">{{ item.vertical }}</VChip>
                            <VBtn :href="item.enlace" target="_blank" variant="tonal" size="small">
                              <VIcon icon="tabler-external-link" /> Ver artículo
                            </VBtn>
                          </div>
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style scoped>
/* Mantener estilos existentes y agregar ajustes para lista */
.fixed-avatar {
  width: 120px;
  height: 80px;
  object-fit: cover;
}

.text-h6 {
  font-size: 1.1rem;
  line-height: 1.4;
}

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
  /* height: 500px;
  overflow-y: auto; */
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

.sitio-web {
    position: absolute;
    top: 5px;
    z-index: 10;
    right: 5px;
}

.img-link {
    position: relative;
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