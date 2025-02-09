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

  const data = ref([])

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

  function replaceAmp(input) {
    return input.replace(/&amp;/g, "&");
  }

  function unificarYFiltrarDuplicados(data) {
    const enlacesUnicos = new Set(); // Para rastrear enlaces únicos
    const resultado = {
      total: 0,
      timestamp: new Date().toISOString(),
      articles: []
    };

    data.forEach((grupo) => {
      grupo.articles.forEach((articulo) => {
        if (!enlacesUnicos.has(articulo.enlace)) {
          enlacesUnicos.add(articulo.enlace); // Registrar enlace

          // Si subVertical está vacío o no definido, asignar "no definido"
          if (!articulo.subVertical || articulo.subVertical.trim() === "") {
            articulo.subVertical = "N/A";
          }

          if (!articulo.vertical || articulo.vertical.trim() === "") {
            articulo.vertical = "Home";
          }

          resultado.articles.push(articulo); // Agregar artículo único
        }
      });
    });

    resultado.total = resultado.articles.length; // Actualizar total
    return resultado.articles;
  }

  const primicias_data = async function(){
    try{
      const response = await fetch('https://services.ecuavisa.com/gestor/competencias/primicias/config.php?api=all');
      const dataResp = await response.json();
      return unificarYFiltrarDuplicados(dataResp.filter(Boolean));
    }catch(error){
      return null;
    }
  }

  const el_universo_data = async function(){
    try{
      const response = await fetch('https://services.ecuavisa.com/gestor/competencias/el-universo/config.php?api=all');
      const dataResp = await response.json();
      return unificarYFiltrarDuplicados(dataResp.filter(Boolean));
    }catch(error){
      return null;
    }
  }

  const expreso_data = async function(){
    try{
      const response = await fetch('https://services.ecuavisa.com/gestor/competencias/el-expreso/config.php?api=all');
      const dataResp = await response.json();
      return unificarYFiltrarDuplicados(dataResp.filter(Boolean));
    }catch(error){
      return null;
    }
  }

  const ecuavisa_data = async function(){
    try{
      const response = await fetch('https://services.ecuavisa.com/gestor/competencias/ecuavisa/config.php?api=all');
      const dataResp = await response.json();
      return unificarYFiltrarDuplicados(dataResp.filter(Boolean));
    }catch(error){
      return null;
    }
  }

  const el_comercio_data = async function(){
    try{
      const response = await fetch('https://services.ecuavisa.com/gestor/competencias/el-comercio/config.php?api=all');
      const dataResp = await response.json();
      return unificarYFiltrarDuplicados(dataResp.filter(Boolean));
    }catch(error){
      return null;
    }
  }

  const loadingBtn = ref(false);

  const principalData = async function(){
    try{
      loadingBtn.value = true;
      const primiciasList = await primicias_data() || [];
      const elUniersoList = await el_universo_data() || [];
      const expresoList = await expreso_data() || [];
      const ecuavisaList = await ecuavisa_data() || [];
      const elComercioList = await el_comercio_data() || [];

      for (let i = 0; i < primiciasList.length; i++) {
        primiciasList[i].sitio = "PRIMICIAS";
        primiciasList[i].color = "primary";
      }

      for (let i = 0; i < elUniersoList.length; i++) {
        elUniersoList[i].sitio = "EL UNIVERSO";
        elUniersoList[i].color = "info";
      }

      for (let i = 0; i < expresoList.length; i++) {
        expresoList[i].sitio = "EXPRESO";
        expresoList[i].color = "error";
      }

      for (let i = 0; i < ecuavisaList.length; i++) {
        ecuavisaList[i].sitio = "ECUAVISA";
        ecuavisaList[i].color = "warning";
      }

      for (let i = 0; i < elComercioList.length; i++) {
        elComercioList[i].sitio = "EL COMERCIO";
        elComercioList[i].color = "success";
      }

      data.value = [...primiciasList, ...elUniersoList, ...expresoList, ...ecuavisaList, ...elComercioList].sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA; // Mayor a menor
      });

      // lastUpdate.value = dataResp.startDate;
      // nextUpdate.value = dataResp.nextRefresh;
      // updateInterval.value = dataResp.minutes * 60;

      // Ordenar por fecha de publicación (de mayor a menor)
      // const sortedItems = data.value.sort((a, b) => {
      //   const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      //   const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
      //   return dateB - dateA; // Mayor a menor
      // });

      // Obtener los 20 primeros (en este caso es menos)
      // const top20Items = sortedItems.slice(0, 20);
      // groupedData.value["Últimas noticias"] = top20Items;
      // ultimasNoticias.value = top20Items;


      // itemsPagina.value = Object.keys(groupedData.value).map(e => e.toUpperCase());
      // selectedItemPagina.value = itemsPagina.value.slice(0, 2);
      loadingBtn.value = false;
      return true;
    }catch(error){
      loadingBtn.value = false;
      return null;
    }
  }

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

  onMounted(async () => {
    try {
      await principalData();

      itemsSitioWebSeccion.value = getUniqueVerticals();
      itemsSitioWebSubSeccion.value = getUniqueSubVerticals();
      docDataProcess()
      // filteredData.value = processedData.value;
      // Llamado recurrente cada segundo
      // timeoutId = setTimeout(() => checkRefreshTime(), 1000);
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  })

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
                  <VCol cols="12" sm="4" md="4" lg="2"  v-for="(item, index) in filteredData">
                      <div class="d-flex flex-column card-column">
                        <a class="img img-link" title="Ir a la página" :href="item.enlace" target="_blank" >
                          <div class="img-content">
                            <img
                              v-if="item.picture"
                              :src="replaceAmp(item.picture)"
                              class="fixed-avatar rounded"
                              
                            />
                            <VIcon
                              v-else
                              icon="tabler-news"
                              size="120"
                            />
                          </div>
                          <div class="sitio-web">
                            <VChip variant="elevated" class="mb-2" size="x-small" label :color="item.color" style="font-size: 10px;">
                              <VIcon
                                start
                                size="16"
                                icon="tabler-world-www"
                              /> 
                                {{ item.sitio }}
                              </VChip>
                          </div>
                        </a>
                        <div class="text-vertical py-2 d-flex gap-2 align-center justify-space-between">
                          <VChip size="x-small">
                            {{ item.vertical.toUpperCase() }}
                          </VChip>
                          <VBtn title="Ir a la página" :href="item.enlace" target="_blank" color="primary" variant="tonal" size="small">
                            <VIcon icon="tabler-external-link" /> Ir
                          </VBtn>
                        </div>
                        <div class="d-flex gap-2 align-center otros-detalles py-2">
                          <span class="text-xs" title="Fecha de publicación">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                          <VChip v-if="item.subVertical" class="ml-2" size="x-small" color="secondary">{{ item.subVertical }}</VChip>
                        </div>
                        <div class="h4 titulo">
                          {{ item.titulo }}
                        </div>
                      </div>
                  </VCol>
                </VRow>
              </div>
              <div v-else>
                <td colspan="4" class="no-results">No se encontraron resultados</td>
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