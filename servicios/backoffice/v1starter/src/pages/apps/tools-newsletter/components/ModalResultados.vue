<script setup>
import { ref, watch, computed } from 'vue'
import ItemResultado from './ItemResultado.vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  filtros: {
    type: Object,
    default: () => ({
      busqueda: '',
      selector: '',
      path: 'por_texto'
    })
  },
  itemsSeleccionados: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'seleccionarItem',
  'cerrar'
])

// Data reactiva
const mostrarModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Dominio ecuavisa
const dominio_prod = ref('https://dev.d25bogixxt74yq.amplifyapp.com');

const resultados = ref([])
const itemSeleccionadoGroupList = ref([])
const cargando = ref(false)
const guardandoSeleccionado = ref(false)
const itemVisualizar = ref(null)
const cambiosLocal = ref(true)
const tabActivo = ref(0)

// Computed para el título
const tituloResultados = computed(() => {
  const { busqueda, selector } = props.filtros
  let titulo = 'Resultados de Búsqueda'
  
  if (busqueda || selector) {
    titulo += ' para: '
    if (busqueda) titulo += `"${busqueda}"`
    if (selector && busqueda) titulo += ' - '
    if (selector) titulo += selector
  }
  
  return titulo
})

// Función para convertir a slug
const stringToSlug = (str) => {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Buscar resultados
const buscarResultados = async () => {
  cargando.value = true
  try {
    const { busqueda, selector, path } = props.filtros
    const response = await fetch(
      `${dominio_prod.value}/api/tools-newsletter/search?busqueda=${encodeURIComponent(busqueda)}&selector=${encodeURIComponent(selector)}&path=${encodeURIComponent(path)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    
    const data = await response.json()
    resultados.value = data?.data || []
    
    // Agrupar por sección
    const sectionMap = new Map()
    
    resultados.value.forEach(item => {
      const slug = stringToSlug(item?.info?.section?.slug || '')
      const name = item?.info?.section?.name || slug || 'Sin categoría'
      
      if (!slug) return
      
      if (!sectionMap.has(slug)) {
        sectionMap.set(slug, { name, items: [] })
      }
      sectionMap.get(slug).items.push(item)
    })
    
    // Convertir a array y ordenar
    itemSeleccionadoGroupList.value = Array.from(sectionMap.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .map(([slug, data]) => ({
        section: stringToSlug(slug),
        name: data.name,
        items: data.items
      }))
    
    cambiosLocal.value = false
    return resultados.value
  } catch (error) {
    console.error('Error al buscar resultados:', error)
    resultados.value = []
    itemSeleccionadoGroupList.value = []
    return []
  } finally {
    cargando.value = false
  }
}

// Obtener paths
const getPaths = async (paths) => {
  try {
    const response = await fetch(`${dominio_prod.value}/tools/newsletter/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    })

    if (!response.ok) {
      throw new Error('No se pudieron obtener los items. Intente nuevamente.')
    }

    const data = await response.json()

    if (!data.resp) {
      throw new Error('No se pudieron obtener los items. Intente nuevamente.')
    }

    return data?.data || []
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Manejar selección de item
const handleSeleccionar = async (item) => {
  guardandoSeleccionado.value = true
  try {
    const { body = null, info = {} } = item
    
    let itemConBody = item
    
    if (!body && info?.link?.internal) {
      const paths = await getPaths([info.link.internal])
      if (paths.length > 0 && paths[0].resp) {
        itemConBody = {
          ...item,
          body: paths[0].resp
        }
      }
    }
    
    emit('seleccionarItem', itemConBody)
  } catch (error) {
    console.error('Error al seleccionar item:', error)
  } finally {
    guardandoSeleccionado.value = false
  }
}

// Manejar visualización de detalles
const handleVisualizar = (item) => {
  itemVisualizar.value = item
}

// Cerrar modales
const cerrarModalVisualizacion = () => {
  itemVisualizar.value = null
}

const cerrarModalPrincipal = () => {
  mostrarModal.value = false
  cambiosLocal.value = true
  emit('cerrar')
}

// Watcher para buscar cuando se abre el modal
watch(mostrarModal, async (newVal) => {
  if (newVal && cambiosLocal.value) {
    await buscarResultados()
  }
})

// Watcher para filtros (opcional, si quieres búsqueda en tiempo real)
watch(() => props.filtros, () => {
  cambiosLocal.value = true
}, { deep: true })
</script>

<template>
  <!-- Modal Principal de Resultados -->
  <VDialog
    v-model="mostrarModal"
    max-width="1200"
    persistent
  >
    <VCard>
      <VToolbar color="primary" dark>
        <VToolbarTitle>Resultados de Búsqueda</VToolbarTitle>
        <VSpacer />
        <VToolbarItems>
          <VBtn icon @click="cerrarModalPrincipal">
            <VIcon icon="tabler-x" />
          </VBtn>
        </VToolbarItems>
      </VToolbar>

      <VCardText class="pt-4">
        <div v-if="cargando" class="text-center py-8">
          <VProgressCircular
            indeterminate
            color="primary"
            size="64"
          />
          <p class="mt-4">Cargando resultados...</p>
        </div>

        <div v-else>
          <p class="text-subtitle-2 mb-4">
            Resultados para: "{{ filtros.busqueda }}" - {{ filtros.selector || 'Todas las categorías' }}
          </p>

          <div v-if="resultados.length === 0" class="text-center py-8">
            <VIcon icon="tabler-search-off" size="48" class="text-grey-lighten-1 mb-3" />
            <p class="text-h6 text-grey-darken-1">No se encontraron resultados</p>
            <p class="text-grey">Intenta con otros términos de búsqueda</p>
          </div>

          <div v-else class="d-flex">
            <!-- Tabs verticales -->
            <VTabs
              v-model="tabActivo"
              direction="vertical"
              class="v-tabs--vertical"
              style="min-width: 200px;"
            >
              <VTab
                v-for="(group, index) in itemSeleccionadoGroupList"
                :key="index"
                :value="index"
                class="text-left justify-start"
              >
                {{ group.name || 'Sin categoría' }}
              </VTab>
            </VTabs>

            <!-- Contenido de los tabs -->
            <VWindow
              v-model="tabActivo"
              class="ms-4"
              style="flex: 1;"
            >
              <VWindowItem
                v-for="(group, index) in itemSeleccionadoGroupList"
                :key="index"
                :value="index"
              >
                <div class="resultados-container">
                  <ItemResultado
                    v-for="(itemNota, indexNota) in group.items"
                    :key="indexNota"
                    :item="itemNota"
                    :seleccionado="itemsSeleccionados.some(
                      selectedItem => selectedItem.info?.link?.internal === itemNota.info?.link?.internal
                    )"
                    :guardando-seleccionado="guardandoSeleccionado"
                    @seleccionar="handleSeleccionar"
                    @visualizar="handleVisualizar"
                  />
                </div>
              </VWindowItem>
            </VWindow>
          </div>
        </div>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          color="secondary"
          variant="outlined"
          @click="cerrarModalPrincipal"
        >
          Cerrar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Modal de Visualización de Detalles -->
  <VDialog
    v-model="itemVisualizar"
    max-width="600"
    v-if="itemVisualizar"
  >
    <VCard>
      <VToolbar color="primary" dark>
        <VToolbarTitle>{{ itemVisualizar?.main?.title?.article }}</VToolbarTitle>
        <VSpacer />
        <VToolbarItems>
          <VBtn icon @click="cerrarModalVisualizacion">
            <VIcon icon="tabler-x" />
          </VBtn>
        </VToolbarItems>
      </VToolbar>

      <VCardText class="pt-4">
        <VList lines="two">
          <VListItem>
            <VListItemTitle class="font-weight-bold">Descripción:</VListItemTitle>
            <VListItemSubtitle>{{ itemVisualizar?.main?.subtitle?.striped }}</VListItemSubtitle>
          </VListItem>
          
          <VListItem>
            <VListItemTitle class="font-weight-bold">Sección:</VListItemTitle>
            <VListItemSubtitle>{{ itemVisualizar?.info?.section?.slug }}</VListItemSubtitle>
          </VListItem>
          
          <VListItem v-if="itemVisualizar?.info?.link?.url">
            <VListItemTitle class="font-weight-bold">URL:</VListItemTitle>
            <VListItemSubtitle>
              <a :href="itemVisualizar.info.link.url" target="_blank" class="text-primary">
                {{ itemVisualizar.info.link.url }}
              </a>
            </VListItemSubtitle>
          </VListItem>
        </VList>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          color="secondary"
          variant="outlined"
          @click="cerrarModalVisualizacion"
        >
          Cancelar
        </VBtn>
        <VBtn
          color="primary"
          @click="() => {
            handleSeleccionar(itemVisualizar)
            cerrarModalVisualizacion()
          }"
        >
          Seleccionar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.v-tabs--vertical {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.resultados-container {
  max-height: 600px;
  overflow-y: auto;
}

.v-tab {
  justify-content: flex-start !important;
  padding-left: 24px !important;
}
</style>