<script setup>
  import { ref, computed, onMounted } from 'vue'
  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);

  const snackbar = ref({
    show: false,
    text: '',
    color: 'success',
    timeout: 3000
  })

  const data = ref([])

  const buscar_dato = ref(null)
  const selectedItemSitioWeb = ref(null)
  const itemsSitioWeb = ref(["PRIMICIAS", "EL COMERCIO"]);

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

  const principalData = async function(){
    try{
      const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/radar-digital/primicias/listar.php')
      const dataResp = await response.json();
      data.value = dataResp.site;
      lastUpdate.value = dataResp.startDate;
      nextUpdate.value = dataResp.nextRefresh;
      updateInterval.value = dataResp.minutes * 60;

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

  function getUniqueVerticals() {
      // Usamos un Set para evitar duplicados
      const uniqueVerticals = new Set();

      data.value.forEach(item => {
          if (item.vertical) {
              uniqueVerticals.add(item.vertical);
          }
      });

      // Convertimos el Set en un array para retornar
      return Array.from(uniqueVerticals);
  }

  function getUniqueSubVerticals() {
      // Usamos un Set para evitar duplicados
      const uniqueVerticals = new Set();

      data.value.forEach(item => {
          if (item.subVertical) {
              uniqueVerticals.add(item.subVertical);
          }
      });

      // Convertimos el Set en un array para retornar
      return Array.from(uniqueVerticals);
  }

  onMounted(async () => {
    try {
      await principalData();

      itemsSitioWebSeccion.value = getUniqueVerticals();
      itemsSitioWebSubSeccion.value = getUniqueSubVerticals();
      // Llamado recurrente cada segundo
      // timeoutId = setTimeout(() => checkRefreshTime(), 1000);
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  })

  watch(selectedItemSeccion, (newValue) => {
    if(newValue.length > 0 && !itemsSitioWebSeccion.value.includes(newValue.at(-1))){
      newValue.pop();
      selectedItemSeccion.value = newValue;
    }
    // return false;
  })

  watch(selectedItemSubSeccion, (newValue) => {
    if(newValue.length > 0 && !itemsSitioWebSubSeccion.value.includes(newValue.at(-1))){
      newValue.pop();
      selectedItemSubSeccion.value = newValue;
    }
    // return false;
  })

  const processedData = computed(() => {
   const seen = new Set()
   return data.value.map(item => {
     // const isDuplicate = seen.has(item.titulo)
     // if (!isDuplicate) seen.add(item.titulo)
     return {
       ...item,
       subVertical: item.subVertical === 'NN' ? '' : item.subVertical,
       isDuplicate: false
     }
   })
  })

  const groupedData = computed(() => {
   return processedData.value.reduce((acc, item) => {
     // if (!item.isDuplicate) {
     //   if (!acc[item.vertical]) acc[item.vertical] = []
     //   acc[item.vertical].push(item)
     // }
      if (!acc[item.vertical]) acc[item.vertical] = []
      acc[item.vertical].push(item)
      return acc
   }, {})
  })

  const filteredData = computed(() => {
    var objeto = [];

    if (!buscar_dato.value){
      objeto =  processedData.value;
    }else{
      objeto =  processedData.value;
    }

    return objeto;
  })

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
                  Últimas noticas
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;">Todas las páginas</small>
                    <VChip size="x-small" color="primary">
                      100 Artículo(s)
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
                  <VTextField v-model="buscar_dato" :label="`Buscar por, título, autor, sección, subsección`"
                    prepend-inner-icon="tabler-search" density="compact" style=" padding: 0px 0;"
                    clearable />
                </div>
                <div class="w-100 mt-4 ">
                  <label>Filtrar por sitio web</label>
                  <VCombobox
                    v-model="selectedItemSitioWeb"
                    :items="itemsSitioWeb"
                    multiple
                    chips
                  />
                </div>
              </VCol>
              <VCol cols="12" md="12" :lg="6">
                <div class="w-100 mt-4 ">
                  <label>Filtrar por Sección</label>
                  <VCombobox
                    v-model="selectedItemSeccion"
                    :items="itemsSitioWebSeccion"
                    multiple
                    chips
                  />
                </div>
              </VCol>
              <VCol cols="12" md="12" :lg="6">
                <div class="w-100 mt-4 ">
                  <label>Filtrar por SubSección</label>
                  <VCombobox
                    v-model="selectedItemSubSeccion"
                    :items="itemsSitioWebSubSeccion"
                    multiple
                    chips
                  />
                </div>
              </VCol>
            </VRow>
            <VDivider />
            <VList lines="two" class="board-content">
              <div v-if="filteredData.length">
                <template v-for="item in filteredData">
                  <VListItem>
                    <template #prepend>

                      <VAvatar
                        v-if="item.picture"
                        :image="item.picture"
                        size="64"
                        rounded
                      />
                      <VIcon
                        v-else
                        icon="tabler-news"
                        size="32"
                      />
                      
                    </template>

                    <small style="font-size: 10px;" v-if="vertical == 'Últimas noticias'">Página: {{ item.vertical.toUpperCase() }}</small>
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
                      <VBtn :href="item.enlace" target="_blank" icon variant="text" size="small">
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