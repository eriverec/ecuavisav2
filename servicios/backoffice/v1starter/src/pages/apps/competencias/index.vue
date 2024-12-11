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

    <!-- Control Panel -->
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

    <!-- News Grid -->
    <draggable 
      v-model="boardsOrder" 
      :component-data="{
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      item-key="key"
      class="row d-flex flex-wrap" 
      handle=".drag-handle"
      @start="drag = true"
      @end="drag = false"
      @change="saveBoardsOrder"
    >
      <template #item="{ element }" class="redy">

        <VCol 
          cols="12" 
          md="4"
          class="board-container d-flex"
        >
          <VCard :loading="element.loading">
            <VCardItem>
              <div class="d-flex align-center drag-handle cursor-move">
                <VIcon icon="tabler-grip-vertical" class="me-2" />
                <VCardTitle>
                  {{ element.title }}
                  <VChip class="ml-2" size="small" color="primary" >
                    {{ filteredArticles(element.key).length }}
                  </VChip>
                </VCardTitle>
              </div>

              <template #append>
                <div class="d-flex align-center gap-2">
                  <VTextField
                    v-model="element.search"
                    label="Buscar en este panel"
                    density="compact"
                    hide-details
                    style="max-width: 200px"
                    clearable
                  />

                  <VBtn
                    icon
                    variant="text"
                    @click="openExpandedBoard(element)"
                  >
                    <VIcon icon="tabler-maximize" />
                  </VBtn>
                </div>
              </template>
            </VCardItem>

            <VDivider />

            <VCardText class="board-content">
              <div v-if="element.loading" class="d-flex justify-center py-4">
                <VProgressCircular indeterminate />
              </div>

              <div v-else-if="!filteredArticles(element.key).length" class="text-center py-4">
                No se encontraron artículos
              </div>

              <VList v-else lines="two">
                <template 
                  v-for="(article, index) in filteredArticles(element.key)"
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

                    <VTooltip location="top">
                      <template v-slot:activator="{ props }">
                        <VListItemTitle 
                          v-bind="props"
                          class="text-truncate"
                        >
                          {{ article.title }}
                        </VListItemTitle>
                      </template>
                      <span>{{ article.title }}</span>
                    </VTooltip>

                    <VListItemSubtitle>
                      <span class="text-xs">{{ article.timestamp || 'Sin fecha' }}</span>
                      <VTooltip v-if="article.excerpt" location="bottom">
                        <template v-slot:activator="{ props }">
                          <span v-bind="props" class="d-block text-truncate">
                            {{ article.excerpt }}
                          </span>
                        </template>
                        <span>{{ article.excerpt }}</span>
                      </VTooltip>
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
                  <VDivider v-if="index !== filteredArticles(element.key).length - 1" />
                </template>
              </VList>
            </VCardText>
          </VCard>
        </VCol>
      </template>
    </draggable>

    <!-- Expanded View Dialog -->
    <VDialog
      v-model="expandedDialog"
      fullscreen
      :scrim="true"
      transition="dialog-bottom-transition"
    >
      <VCard>
        <VToolbar color="primary">
          <VBtn
            icon
            variant="text"
            @click="expandedDialog = false"
          >
            <VIcon icon="tabler-x" />
          </VBtn>

          <VToolbarTitle>{{ expandedBoard?.title }}</VToolbarTitle>

          <VSpacer></VSpacer>

          <VTextField
            v-if="expandedBoard"
            v-model="expandedBoard.search"
            label="Buscar"
            density="compact"
            hide-details
            class="expanded-search"
            clearable
          />
        </VToolbar>

        <VCardText class="expanded-container pa-6">
          <VList lines="two">
            <template 
              v-if="expandedBoard"
              v-for="(article, index) in filteredArticles(expandedBoard.key)"
              :key="index"
            >
              <VListItem>
                <template #prepend>
                  <VAvatar
                    v-if="article.image"
                    :image="article.image"
                    size="64"
                    rounded
                  />
                  <VIcon
                    v-else
                    icon="tabler-news"
                    size="48"
                  />
                </template>

                <div class="expanded-article-content">
                  <VListItemTitle class="text-h6 mb-2">
                    {{ article.title }}
                  </VListItemTitle>

                  <VListItemSubtitle>
                    <div class="d-flex align-center mb-2">
                      <VIcon 
                        icon="tabler-clock" 
                        size="small" 
                        class="me-2"
                      />
                      <span>{{ article.timestamp || 'Sin fecha' }}</span>
                    </div>
                    <p v-if="article.excerpt" class="mb-0">
                      {{ article.excerpt }}
                    </p>
                  </VListItemSubtitle>
                </div>

                <template #append>
                  <VBtn
                    :href="article.link"
                    target="_blank"
                    color="primary"
                    variant="tonal"
                  >
                    Leer más
                    <VIcon end icon="tabler-external-link" />
                  </VBtn>
                </template>
              </VListItem>
              <VDivider v-if="index !== filteredArticles(expandedBoard.key).length - 1" />
            </template>
          </VList>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { VueElement } from 'vue'
import draggable from 'vuedraggable'
import axios from 'axios'

// Initial state
const initialBoards = [
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
]

// Refs
const boardsOrder = ref(loadBoardsOrder() || initialBoards)
const globalSearch = ref('')
const lastUpdate = ref('--:--')
const updateInterval = ref(60)
const expandedDialog = ref(false)
const expandedBoard = ref(null)
const drag = ref(false)

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

// LocalStorage functions
function loadBoardsOrder() {
  try {
    const saved = localStorage.getItem('newsBoards')
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    console.error('Error loading boards order:', e)
    return null
  }
}

function saveBoardsOrder() {
  try {
    localStorage.setItem('newsBoards', JSON.stringify(boardsOrder.value))
  } catch (e) {
    console.error('Error saving boards order:', e)
  }
}

// Computed
const filteredArticles = computed(() => (sourceKey) => {
  const source = boardsOrder.value.find(board => board.key === sourceKey)
  if (!source) return []

  let articles = source.data

  if (globalSearch.value) {
    const searchTerm = globalSearch.value.toLowerCase()
    articles = articles.filter(article => 
      article.title?.toLowerCase().includes(searchTerm) ||
      article.excerpt?.toLowerCase().includes(searchTerm)
    )
  }

  if (source.search) {
    const searchTerm = source.search.toLowerCase()
    articles = articles.filter(article => 
      article.title?.toLowerCase().includes(searchTerm) ||
      article.excerpt?.toLowerCase().includes(searchTerm)
    )
  }

  return articles
})

// Functions
const fetchNews = async () => {
  try {
    boardsOrder.value = boardsOrder.value.map(board => ({...board, loading: true}))

    const response = await axios.get('https://estadisticas.ecuavisa.com/sites/gestor/Tools/competencias/config.php?api=all')
    
    boardsOrder.value = boardsOrder.value.map(board => {
      const sourceData = response.data.find(src => src.key === board.key)
      return {
        ...board,
        data: sourceData?.estructura.articles || [],
        loading: false
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
  }
}

const startUpdates = () => {
  clearInterval(intervalId)
  intervalId = setInterval(fetchNews, updateInterval.value * 1000)
}

const openExpandedBoard = (board) => {
  expandedBoard.value = board
  expandedDialog.value = true
}

// Watchers
watch(updateInterval, () => {
  startUpdates()
  snackbar.value = {
    show: true,
    text: `Intervalo actualizado a ${updateInterval.value} segundos`,
    color: 'success'
  }
})

// Lifecycle
onMounted(() => {
  fetchNews()
  startUpdates()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.board-container {
  transition: all 0.3s ease;
}

.board-content {
  height: 500px;
  overflow-y: auto;
}

.expanded-container {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.expanded-search {
  max-width: 300px;
  margin-left: 16px;
}

.expanded-article-content {
  flex: 1;
  min-width: 0;
  padding: 0 16px;
}

.cursor-move {
  cursor: move;
}

.sortable-ghost {
  opacity: 0.5;
  background: var(--v-theme-surface);
}

.sortable-chosen {
  background: var(--v-theme-surface);
}

:deep(.v-card-text) {
  padding-top: 16px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.dialog-bottom-transition-enter-from,
.dialog-bottom-transition-leave-to {
  transform: translateY(100%);
}
</style>