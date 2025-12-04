<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  titulo: {
    type: String,
    default: ''
  },
  mensaje: {
    type: String,
    default: ''
  },
  textoBotonConfirmar: {
    type: String,
    default: 'Aceptar'
  },
  mostrarBotonCancelar: {
    type: Boolean,
    default: false
  },
  textoBotonCancelar: {
    type: String,
    default: 'Cancelar'
  },
  persistente: {
    type: Boolean,
    default: false // Si es true, no se cierra al hacer clic fuera
  }
})

// Emits
const emit = defineEmits([
  'update:modelValue',
  'confirmar',
  'cancelar'
])

// Data reactiva
const isDialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

// Configuración por tipo
const configTipo = computed(() => {
  const configs = {
    success: {
      color: 'success',
      icon: 'tabler-circle-check',
      iconColor: 'text-success',
      defaultTitulo: '¡Éxito!'
    },
    error: {
      color: 'error',
      icon: 'tabler-alert-circle',
      iconColor: 'text-error',
      defaultTitulo: 'Error'
    },
    warning: {
      color: 'warning',
      icon: 'tabler-alert-triangle',
      iconColor: 'text-warning',
      defaultTitulo: 'Advertencia'
    },
    info: {
      color: 'info',
      icon: 'tabler-info-circle',
      iconColor: 'text-info',
      defaultTitulo: 'Información'
    }
  }
  
  return configs[props.tipo] || configs.info
})

// Título final (usa el proporcionado o el default)
const tituloFinal = computed(() => {
  return props.titulo || configTipo.value.defaultTitulo
})

// Métodos
const confirmar = () => {
  emit('confirmar')
  isDialogVisible.value = false
}

const cancelar = () => {
  emit('cancelar')
  isDialogVisible.value = false
}

const cerrar = () => {
  isDialogVisible.value = false
}

// Exponer métodos para control desde el padre
const abrir = () => {
  isDialogVisible.value = true
}

const cerrarDialog = () => {
  isDialogVisible.value = false
}

defineExpose({
  abrir,
  cerrar: cerrarDialog
})
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    :width="400"
    :persistent="persistente"
  >
    <VCard>
      <!-- Header con color según tipo -->
      <VCardText class="pa-0">
        <div :class="['d-flex align-center pa-6', `bg-${configTipo.color}`]">
          <VIcon
            :icon="configTipo.icon"
            size="28"
            class="text-white me-3"
          />
          <VCardTitle class="text-white pa-0">
            {{ tituloFinal }}
          </VCardTitle>
        </div>
      </VCardText>

      <!-- Contenido del mensaje -->
      <VCardText class="pt-6 pb-4">
        <div class="d-flex align-start pt-5">
          <VIcon
            :icon="configTipo.icon"
            :class="[configTipo.iconColor, 'me-3 mt-1']"
            size="24"
          />
          <div class="mensaje-contenido">
            <p class="mb-0">
              {{ mensaje }}
            </p>
          </div>
        </div>
      </VCardText>

      <!-- Acciones -->
      <VCardText class="d-flex justify-end gap-2 pb-6">
        <VBtn
          v-if="mostrarBotonCancelar"
          variant="outlined"
          @click="cancelar"
        >
          {{ textoBotonCancelar }}
        </VBtn>
        
        <VBtn
          :color="configTipo.color"
          @click="confirmar"
        >
          {{ textoBotonConfirmar }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.mensaje-contenido {
  flex: 1;
  white-space: pre-line;
  word-break: break-word;
}

/* Animación de entrada */
:deep(.v-dialog) {
  transition: transform 0.3s ease;
}

:deep(.v-dialog--active) {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>