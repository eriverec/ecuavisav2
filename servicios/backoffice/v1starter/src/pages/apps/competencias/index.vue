<template>
  <section>
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top end"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <VCard class="mb-4">
      <VCardText>
        <div class="d-flex align-center flex-wrap gap-4">
          <VTextField
            v-model="globalSearch"
            label="Buscar en todas las noticias"
            prepend-inner-icon="tabler-search"
            density="compact"
            style="max-width: 300px"
            clearable
          />

          <VSelect
            v-model="updateInterval"
            :items="updateIntervals"
            label="Intervalo de actualización"
            style="max-width: 200px"
            density="compact"
          />

          <VSpacer />

          <VChip
            color="primary"
            size="small"
            prepend-icon="tabler-clock"
          >
            Última actualización: {{ lastUpdate }}
          </VChip>
        </div>
      </VCardText>
    </VCard>

    <VRow>
      <VCol 
        v-for="source in newsBoards"
        :key="source.key" 
        cols="12" 
        md="4"
      >
        <VCard :loading="source.loading" min-height="400">
          <VCardItem>
            <VCardTitle>
              {{ source.title }}
              <VChip
                class="ml-2"
                size="small"
                color="primary"
              >
                {{ filteredArticles(source.key).length }}
              </VChip>
            </VCardTitle>

            <template #append>
              <VTextField
                v-model="source.search"
                label="Buscar"
                density="compact"
                hide-details
                style="max-width: 200px"
                clearable
              />
            </template>
          </VCardItem>

          <VDivider />

          <VCardText class="pt-4">
            <div v-if="source.loading" class="d-flex justify-center">
              <VProgressCircular indeterminate />
            </div>

            <div v-else-if="!filteredArticles(source.key).length" class="text-center py-4">
              No se encontraron artículos
            </div>

            <VList v-else lines="two">
              <template 
                v-for="(article, index) in filteredArticles(source.key)"
                :key="index"
              >
                <VListItem>
                  <template #prepend>
                    <VAvatar
                      v-if="article.image"
                      :image="article.image"
                      size="48"
                      rounded
                    />
                    <VIcon
                      v-else
                      icon="tabler-news"
                      size="32"
                    />
                  </template>

                  <VListItemTitle>
                    {{ article.title }}
                  </VListItemTitle>

                  <VListItemSubtitle>
                    <span class="text-xs">{{ article.timestamp || 'Sin fecha' }}</span>
                    <span v-if="article.excerpt" class="d-block text-truncate">
                      {{ article.excerpt }}
                    </span>
                  </VListItemSubtitle>

                  <template #append>
                    <VBtn
                      :href="article.link"
                      target="_blank"
                      icon
                      variant="text"
                      size="small"
                    >
                      <VIcon icon="tabler-external-link" />
                    </VBtn>
                  </template>
                </VListItem>

                <VDivider v-if="index !== filteredArticles(source.key).length - 1" />
              </template>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'

// Estado inicial
const newsBoards = ref([
  { 
    key: 'el-comercio',
    title: 'El Comercio',
    data: [],
    search: '',
    loading: false 
  },
  { 
    key: 'el-universo',
    title: 'El Universo',
    data: [],
    search: '',
    loading: false 
  },
  { 
    key: 'primicias',
    title: 'Primicias',
    data: [],
    search: '',
    loading: false 
  },
  { 
    key: 'el-telegrafo',
    title: 'El Telégrafo',
    data: [],
    search: '',
    loading: false 
  }
])

const globalSearch = ref('')
const lastUpdate = ref('--:--')
const updateInterval = ref(60)
const updateIntervals = [
  { title: '30 segundos', value: 30 },
  { title: '1 minuto', value: 60 },
  { title: '2 minutos', value: 120 },
  { title: '5 minutos', value: 300 }
]

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000
})

let intervalId = null

// Funciones computadas
const filteredArticles = computed(() => (sourceKey) => {
  const source = newsBoards.value.find(board => board.key === sourceKey)
  if (!source) return []

  let articles = source.data

  // Aplicar búsqueda global
  if (globalSearch.value) {
    const searchTerm = globalSearch.value.toLowerCase()
    articles = articles.filter(article => 
      article.title?.toLowerCase().includes(searchTerm) ||
      article.excerpt?.toLowerCase().includes(searchTerm)
    )
  }

  // Aplicar búsqueda específica del tablero
  if (source.search) {
    const searchTerm = source.search.toLowerCase()
    articles = articles.filter(article => 
      article.title?.toLowerCase().includes(searchTerm) ||
      article.excerpt?.toLowerCase().includes(searchTerm)
    )
  }

  return articles
})

// Funciones
const fetchNews = async () => {
  try {
    const boards = newsBoards.value.map(board => ({...board, loading: true}))
    newsBoards.value = boards

    const response = await axios.get('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/config.php?api=all')
    
    response.data.forEach(sourceData => {
      const board = newsBoards.value.find(b => b.key === sourceData.key)
      if (board) {
        board.data = sourceData.estructura.articles || []
      }
    })

    lastUpdate.value = new Date().toLocaleTimeString()
  } catch (error) {
    console.error('Error fetching news:', error)
    snackbar.value = {
      show: true,
      text: 'Error al actualizar las noticias',
      color: 'error'
    }
  } finally {
    const boards = newsBoards.value.map(board => ({...board, loading: false}))
    newsBoards.value = boards
  }
}

const startUpdates = () => {
  clearInterval(intervalId)
  intervalId = setInterval(fetchNews, updateInterval.value * 1000)
}

// Observar cambios en el intervalo de actualización
watch(updateInterval, () => {
  startUpdates()
  snackbar.value = {
    show: true,
    text: `Intervalo actualizado a ${updateInterval.value} segundos`,
    color: 'success'
  }
})

// Ciclo de vida
onMounted(() => {
  fetchNews()
  startUpdates()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.v-list {
  max-height: 600px;
  overflow-y: auto;
}

:deep(.v-card-text) {
  padding-top: 16px;
}
</style>