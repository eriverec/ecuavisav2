<template>
  <section class="sectionprimicias">


    <!-- Control Panel -->
    <VCard class="mb-4">
      <VCardText>
        <div class="d-flex align-center flex-wrap gap-4">
          <h3>Primicias</h3>
          <VTextField v-model="searchTerm" label="Buscar en todas las noticias" prepend-inner-icon="tabler-search"
            density="compact" style="max-width: 300px" clearable />

          <VSpacer />

        </div>
      </VCardText>
    </VCard>
    <VRow>
      <VCol cols="12" md="12" lg="6" v-for="(items, vertical) in filteredData" :key="vertical">

        <VCard>

          <VCardItem >
            <div class="d-flex content-title">
              <div>
                {{ vertical }}
                <VChip class="ml-2" size="small" color="primary">
                  {{ items.length }}
                </VChip>
              </div>

              <VTextField v-model="tableSearches[vertical]" :label="`Buscar en ${vertical}`"
                prepend-inner-icon="tabler-search" density="compact" style="max-width: 300px; padding: 20px 0;"
                clearable />

            </div>


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
                <template v-for="item in filterTableItems(items, vertical)" :key="item.enlace">
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
                      <span class="text-xs">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
                      <VChip v-if="item.subVertical" class="ml-2" size="small" color="success">{{ item.subVertical }}</VChip>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import moment from 'moment'

const data = ref([])
const searchTerm = ref('')
const tableSearches = ref({})

const filterTableItems = (items, vertical) => {
  const tableSearch = tableSearches.value[vertical]?.toLowerCase() || ''
  return tableSearch
    ? items.filter(item => item.titulo?.toLowerCase().includes(tableSearch))
    : items
}

const processedData = computed(() => {
 const seen = new Set()
 return data.value.map(item => {
   const isDuplicate = seen.has(item.titulo)
   if (!isDuplicate) seen.add(item.titulo)
   return {
     ...item,
     subVertical: item.subVertical === 'NN' ? '' : item.subVertical,
     isDuplicate
   }
 })
})

const groupedData = computed(() => {
 return processedData.value.reduce((acc, item) => {
   if (!item.isDuplicate) {
     if (!acc[item.vertical]) acc[item.vertical] = []
     acc[item.vertical].push(item)
   }
   return acc
 }, {})
})

const filteredData = computed(() => {
  if (!searchTerm.value) return groupedData.value

  return Object.entries(groupedData.value).reduce((acc, [vertical, items]) => {
    const filtered = items.filter(item =>
      item.titulo?.toLowerCase().includes(searchTerm.value?.toLowerCase() || '') || false
    )
    if (filtered.length) acc[vertical] = filtered
    return acc
  }, {})
})



const formatDate = (dateString) => {
  return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
}

onMounted(async () => {
  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/radar/radarPrimicias.php')
    data.value = await response.json();
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>

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