<script setup>
  import { ref, computed, onMounted } from 'vue'
  import moment from 'moment'

  const data = ref([])
  const searchTerm = ref('')
  const tableSearches = ref({})
  const selectedItemPagina = ref(null)

  const itemsPagina = ref([]);
  const ultimasNoticias = ref([]);

  const filterTableItems = (items, vertical) => {
    const tableSearch = tableSearches.value[vertical]?.toLowerCase() || ''
    return tableSearch
      ? items.filter(item => item.titulo?.toLowerCase().includes(tableSearch))
      : items
  }

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

    if (!searchTerm.value){
      objeto =  Object.entries(groupedData.value).reduce((acc, [vertical, items]) => {
        if (selectedItemPagina.value.includes(vertical.toUpperCase())){
           acc[vertical] = items
        }
        return acc
      }, {})
    }else{
      objeto = Object.entries(groupedData.value).reduce((acc, [vertical, items]) => {
        const filtered = items.filter(item =>
          item.titulo?.toLowerCase().includes(searchTerm.value?.toLowerCase() || '') || false
        )
        if (filtered.length) acc[vertical] = filtered
        return acc
      }, {});
    }

    return {
      'Últimas noticias': ultimasNoticias.value, 
      ...objeto
    };
  })


  const formatDate = (dateString) => {
    return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
  }

  onMounted(async () => {
    try {
      const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/radar/radarPrimicias.php')
      data.value = await response.json();

      // Ordenar por fecha de publicación (de mayor a menor)
      const sortedItems = data.value.sort((a, b) => {
        const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
        return dateB - dateA; // Mayor a menor
      });

      // Obtener los 20 primeros (en este caso es menos)
      const top20Items = sortedItems.slice(0, 20);
      // groupedData.value["Últimas noticias"] = top20Items;
      ultimasNoticias.value = top20Items;


      itemsPagina.value = Object.keys(groupedData.value).map(e => e.toUpperCase());
      selectedItemPagina.value = itemsPagina.value.slice(0, 3);

    } catch (error) {
      console.error('Error fetching data:', error)
    }
  })

  watch(selectedItemPagina, (newValue) => {
    if(newValue.length > 0 && !itemsPagina.value.includes(newValue.at(-1))){
      newValue.pop();
      selectedItemPagina.value = newValue;
    }
    // return false;
  })
</script>

<template>
  <section class="sectionprimicias">
    <!-- Control Panel -->
    <VCard class="mb-4">
      <VCardText>
        <div class="d-flex justify-content-between gap-1 flex-column">
          <div class="d-flex align-end flex-wrap gap-4 w-100">
            <div class="d-flex flex-column">
              <small>web</small>
              <h3 style="line-height: 1.3;">Primicias</h3>
            </div> 
            <VBtn href="https://www.primicias.ec/" target="_blank" icon variant="text" size="small">
              <VIcon icon="tabler-external-link" />
            </VBtn>
            <VTextField v-model="searchTerm" label="Buscar en todos los ártículos" prepend-inner-icon="tabler-search"
              density="compact" style="max-width: 300px" clearable />
          </div>
          <div class="w-100 mt-4 ">
            <label>Filtrar por página</label>
            <VCombobox
              v-model="selectedItemPagina"
              :items="itemsPagina"
              multiple
              chips
            />
          </div>
        </div>
      </VCardText>
    </VCard>
    <VRow v-if="selectedItemPagina">
      <VCol cols="12" md="12" lg="6" v-for="(items, vertical) in filteredData" :key="vertical">

        <VCard>

          <VCardItem >
            <div class="d-flex content-title flex-wrap">
              <div class="d-flex gap-3">
                <div class="d-flex flex-column" style="line-height: 1.3;">
                  {{ vertical.toUpperCase() }}
                  <div class="d-flex gap-2 align-center mt-2">
                    <small style="font-size: 10px;" v-if="vertical != 'Últimas noticias'">Página</small>
                    <VChip size="x-small" color="primary">
                      {{ items.length }} Artículo(s)
                    </VChip>
                  </div>
                </div>

                
              </div>

              <VTextField v-model="tableSearches[vertical]" :label="`Buscar en ${vertical.toUpperCase()}`"
                prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 0px 0;"
                clearable />

            </div>

            <small style="font-size: 13px;" v-if="vertical == 'Últimas noticias'">Información recopilada de todas las páginas</small>
          </VCardItem>

          <VDivider />

          <VCardText class="board-content">

            <!-- <VTable class=" tableNavegacion mb-5" hover="true">
              <thead>
                <tr>
                  <th>SubVertical</th>
                  <th>Título</th>
                  <th>Fecha</th>
                </tr>
              </thead>
        
              <tbody>
                <tr v-for="item in items" :key="item.enlace">
                  <td>{{ item.subVertical }}</td>
                  <td>
                    <a :href="item.enlace" target="_blank">{{ item.titulo }}</a>
                  </td>
                  <td>{{ formatDate(item.fechaPublicacion) }}</td>
                </tr>
              </tbody>
            </VTable> -->

            <VList lines="two">
              <div v-if="filterTableItems(items, vertical).length">
                <template v-for="item in filterTableItems(items, vertical)">
                  <VListItem>
                    <template #prepend>

                      <VIcon icon="tabler-news" size="32" />
                    </template>

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
                        <span class="text-xs">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                        <VChip v-if="item.subVertical" class="ml-2" size="small" color="success">{{ item.subVertical }}</VChip>
                      </div>
                      <small style="font-size: 10px;" v-if="vertical == 'Últimas noticias'">Página: {{ item.vertical }}</small>
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