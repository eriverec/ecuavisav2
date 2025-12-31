<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  itemsSeleccionados: {
    type: Array,
    default: () => []
  },
  fechaUltimaModificacion: {
    type: String,
    default: ''
  },
  ultimoCambio: {
    type: Boolean,
    default: false
  },
  loadingGeneral: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'eliminarItem',
  'ordenarItems',
  'vaciarTodo',
  'guardarTodo'
])

// Constantes
const imagenPorDefecto = 'https://placehold.co/600x400?text=Not\nFound'
const dominio_prod = 'https://jsonhtml-ecuavisa.vercel.app';

// Computed
const itemsOrdenados = computed(() => {
  return [...props.itemsSeleccionados].sort((a, b) => {
    const ordenA = a.orden !== undefined ? a.orden : Infinity
    const ordenB = b.orden !== undefined ? b.orden : Infinity
    return ordenA - ordenB
  })
})

// Métodos
const obtenerImagen = (item) => {
  return `${dominio_prod}/image?url=${item?.image?.url}` || imagenPorDefecto
}

const obtenerTitulo = (item) => {
  return item.main?.title?.article || item.nombre || 'Sin título'
}

const obtenerDescripcion = (item) => {
  return item.descripcion || item.main?.subtitle?.striped || 'Sin descripción'
}

const obtenerCategoria = (item) => {
  return item.info?.section?.slug || item.categoria || 'Sin categoría'
}

const obtenerOrden = (item, index) => {
  return item.orden !== undefined ? item.orden : index + 1
}

const moverItem = (desdeIndex, haciaIndex) => {
  if (haciaIndex < 0 || haciaIndex >= props.itemsSeleccionados.length) return

  const nuevosItems = [...props.itemsSeleccionados]
  const [itemMovido] = nuevosItems.splice(desdeIndex, 1) || []
  nuevosItems.splice(haciaIndex, 0, itemMovido)

  // Actualizar orden numérico
  const itemsConOrden = nuevosItems.map((item, idx) => ({
    ...item,
    orden: idx + 1
  }))

  emit('ordenarItems', itemsConOrden)
}

const moverArriba = (index) => moverItem(index, index - 1)
const moverAbajo = (index) => moverItem(index, index + 1)

const handleEliminarItem = (item) => {
  const link = item.info?.link?.url || item.id?.toString()
  if (link) {
    emit('eliminarItem', link)
  }
}

const handleVaciarTodo = () => {
  emit('vaciarTodo')
}

const handleGuardarTodo = () => {
  emit('guardarTodo')
}

// Error handler para imágenes
const handleImageError = (event) => {
  event.target.src = imagenPorDefecto
}
</script>

<template>
  <div class="mt-4">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-3">
      <h5 class="text-h5">Artículos Seleccionados ({{ itemsOrdenados.length }})</h5>
      <div class="text-caption text-grey">
        <VIcon icon="tabler-info-circle" size="16" class="me-1" />
        Usa las flechas para ordenar los artículos
      </div>
    </div>

    <!-- Lista vacía -->
    <VAlert
      v-if="itemsOrdenados.length === 0"
      type="info"
      variant="tonal"
    >
      No hay artículos seleccionados. Use el botón "Buscar" para agregar items.
    </VAlert>

    <!-- Lista con items -->
    <div v-else>
      <!-- Información y acciones -->
      <div class="d-flex justify-space-between align-end mb-2">
        <div class="text-caption text-grey">
          <template v-if="ultimoCambio">
            <VAlert
              variant="tonal"
              color="warning"
            >
              <VIcon icon="tabler-info-circle" size="20" class="me-1" />
                Último cambio no guardado:
                <VBtn
                  variant="text"
                  size="x-small"
                  @click="handleGuardarTodo"
                  :loading="loadingGeneral"
                  :disabled="loadingGeneral"
                  class="px-1"
                >
                  <template v-if="!loadingGeneral">
                    ¿Guardar ahora?
                  </template>
                  <template v-else>
                    <VProgressCircular
                      indeterminate
                      size="16"
                      width="2"
                      class="me-1"
                    />
                    Guardando...
                  </template>
                </VBtn>
            </VAlert>
          </template>
          
          <template v-else-if="fechaUltimaModificacion">
            <VIcon icon="tabler-info-circle" size="14" class="me-1" />
            Último cambio guardado: {{ fechaUltimaModificacion }}
          </template>
        </div>

        <!-- Botón Vaciar Todo -->
        <VBtn
          color="error"
          variant="outlined"
          :disabled="itemsSeleccionados.length === 0"
          @click="handleVaciarTodo"
          class="rounded-0"
        >
          <VIcon icon="tabler-trash" start />
          Vaciar todo
        </VBtn>
      </div>

      <!-- Lista de items -->
      <VList
        lines="three"
        class="bg-transparent"
      >
        <VListItem
          v-for="(item, index) in itemsOrdenados"
          :key="item.info?.link?.url || item.id || index"
          class="mb-2 border rounded-lg"
        >
          <template #prepend>
            <!-- Controles de orden -->
            <div class="d-flex flex-column align-center mr-4">
              <VChip
                color="primary"
                size="small"
                class="mb-2 rounded-pill"
              >
                #{{ obtenerOrden(item, index) }}
              </VChip>
              
              <div class="d-flex flex-column">
                <VBtn
                  icon
                  size="x-small"
                  :color="index === 0 ? 'grey-lighten-2' : 'primary'"
                  variant="outlined"
                  @click="moverArriba(index)"
                  :disabled="index === 0"
                  class="mb-1"
                >
                  <VIcon icon="tabler-chevron-up" size="16" />
                </VBtn>
                
                <VBtn
                  icon
                  size="x-small"
                  :color="index === itemsOrdenados.length - 1 ? 'grey-lighten-2' : 'primary'"
                  variant="outlined"
                  @click="moverAbajo(index)"
                  :disabled="index === itemsOrdenados.length - 1"
                >
                  <VIcon icon="tabler-chevron-down" size="16" />
                </VBtn>
              </div>
            </div>

            <!-- Imagen -->
            <VAvatar
              rounded="lg"
              size="110"
              class="mr-3"
            >
              <VImg
                :src="obtenerImagen(item)"
                :alt="item.imagenAlt || obtenerTitulo(item)"
                cover
                @error="handleImageError"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <VIcon icon="tabler-photo" size="24" />
                  </div>
                </template>
              </VImg>
            </VAvatar>
          </template>

          <!-- Contenido -->
          <VListItemTitle class="text-h6 font-weight-medium mb-1">
            {{ obtenerTitulo(item) }}
          </VListItemTitle>
          
          <VListItemSubtitle class="text-body-2 text-grey-darken-1 mb-2">
            {{ obtenerDescripcion(item) }}
          </VListItemSubtitle>
          
          <template #append>
            <!-- Categoría -->
            <div class="d-flex flex-column align-end">
              <VChip
                color="secondary"
                size="small"
                class="mb-2"
              >
                {{ obtenerCategoria(item) }}
              </VChip>
              
              <!-- Botón Eliminar -->
              <VBtn
                icon
                size="small"
                color="error"
                variant="outlined"
                @click="handleEliminarItem(item)"
                :disabled="itemsOrdenados.length === 1"
                title="Eliminar artículo del listado"
              >
                <VIcon icon="tabler-trash" size="16" />
              </VBtn>
            </div>
          </template>
        </VListItem>
      </VList>
    </div>
  </div>
</template>

<style scoped>
.rounded-0 {
  border-radius: 0 !important;
}

.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

/* Estilos para los botones de orden */
:deep(.v-list-item__prepend) {
  align-items: center;
}

/* Ajuste para la imagen */
.v-avatar {
  min-width: 110px;
  min-height: 115px;
}

/* Mejora la legibilidad del subtítulo */
:deep(.v-list-item-subtitle) {
  line-height: 1.4;
  max-height: 3em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Responsive */
@media (max-width: 960px) {
  .v-avatar {
    min-width: 80px;
    min-height: 85px;
  }
  
  :deep(.v-list-item) {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  :deep(.v-list-item__prepend) {
    margin-right: 0 !important;
    margin-bottom: 16px;
    justify-content: space-between;
    width: 100%;
  }
  
  :deep(.v-list-item__append) {
    margin-left: 0 !important;
    margin-top: 16px;
    justify-content: space-between;
    width: 100%;
  }
}
</style>