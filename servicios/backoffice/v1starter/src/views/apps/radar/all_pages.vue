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
  const itemsSitioWeb = ref(["PRIMICIAS", "EL UNIVERSO", "EXPRESO", "ECUAVISA"]);

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

  const primicias_data = async function(){
    try{
      const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/radar-digital/primicias/listar.php');
      const dataResp = await response.json();
      return dataResp.site;
    }catch(error){
      return null;
    }
  }

  const el_universo_data = async function(){
    try{
      const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/radar-digital/el-universo/listar.php');
      const dataResp = await response.json();
      return dataResp.site;
    }catch(error){
      return null;
    }
  }

  const expreso_data = async function(){
    try{
      const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/radar-digital/el-universo/listar.php');
      const dataResp = await response.json();
      return dataResp.site;
    }catch(error){
      return null;
    }
  }

const ecuavisa_data = async function(){
  try{
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/radar-digital/el-universo/listar.php');
    const dataResp = await response.json();
    return dataResp.site;
  }catch(error){
    return null;
  }
}

  const principalData = async function(){
    try{

      const primiciasList = await primicias_data() || [];
      const elUniersoList = await el_universo_data() || [];
      const expresoList = await expreso_data() || [];
      const ecuavisaList = await ecuavisa_data() || [];

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

      data.value = [...primiciasList, ...elUniersoList, ...expresoList, ...ecuavisaList].sort((a, b) => {
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
      return true;
    }catch(error){
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
      // setTimeout(() => {
      //   // Actualizar items únicos para las secciones
      //   if(sitio.length == 0){
      //     console.log(getUniqueVerticals(lastResults.value))
      //     itemsSitioWebSeccion.value = getUniqueVerticals(lastResults.value);
      //   }

      //   if(secciones.length == 0){
      //     itemsSitioWebSubSeccion.value = getUniqueSubVerticals(lastResults.value);
      //   }
      // }, 1000);
      
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
                  Últimas noticias
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;">Todas las páginas</small>
                    <VChip size="x-small" color="primary">
                      {{filteredData.length}} Artículo(s)
                    </VChip>
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
              <VCol cols="12" md="12" :lg="6">
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
              <VCol cols="12" md="12" :lg="6">
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
            <VList lines="two" class="board-content" :disabled="filtrosActivos.disabled">
              <div v-if="filteredData.length">
                <template v-for="(item, index) in filteredData">
                  <VListItem class="py-4">
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

                    <VChip class="mb-2" size="x-small" label :color="item.color" style="font-size: 10px;">{{ item.sitio }}</VChip>
                    <VTooltip location="top">
                      <template v-slot:activator="{ props }">
                        <VListItemTitle v-bind="props" class="text-truncate">
                          {{ item.titulo }}
                        </VListItemTitle>
                      </template>
                      <span>{{ item.titulo }}</span>
                    </VTooltip>

                    <VListItemSubtitle>
                      <div class="d-flex gap-2 align-center">
                        <span class="text-xs" title="Fecha de publicación">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                        <VChip v-if="item.subVertical" class="ml-2" size="small" color="success">{{ item.subVertical }}</VChip>
                      </div>
                      <div title="Autor" class="align-center mt-1" v-if="item.autor" style="font-size: 12px;">
                        <VIcon
                          icon="tabler-user"
                          size="15"
                        />
                        <small style="margin-top: 5px">{{ item.autor }}</small>
                      </div>
                    </VListItemSubtitle>

                    <template #append>
                      <div class="d-flex align-center gap-2">
                        <VBtn :href="item.enlace" target="_blank" icon variant="text" size="small">
                          <VIcon icon="tabler-external-link" />
                        </VBtn>
                        <VBtn class="d-none" title="Click para ver el contenido de la nota" :disabled=" item.sitio !='PRIMICIAS' " :href="item.enlace" target="_blank" icon variant="tonal" size="small">
                          <VIcon icon="tabler-list" />
                        </VBtn>
                      </div>
                    </template>
                  </VListItem>
                  <VDivider v-if="index !== filteredData.length - 1" />
                </template>

              </div>
              <div v-else>
                <td colspan="4" class="no-results">No se encontraron resultados</td>
              </div>
            </VList>
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
  height: 500px;
  overflow-y: auto;
}

th,
td {
  /* border: 1px solid #ddd; */
  padding: 8px;
  text-align: left;
}

/* th {
  background-color: #f2f2f2;
} */
</style>