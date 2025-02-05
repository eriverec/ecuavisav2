<template>
    <VDivider class="mb-4" />
    
    <!-- Lista de variables de entorno -->
    <VRow v-for="(envVar, index) in localEnvVariables" :key="index">
    <VCol cols="12" sm="5" lg="5" class="px-2">
        <label>Key</label>
        <VTextField
        v-model="localEnvVariables[index].key"
        clearable
        placeholder="e.g CLIENT_KEY"
        />
    </VCol>
    <VCol cols="12" sm="7" lg="7" class="px-2">
        <VRow class="align-center">
        <VCol cols="10" sm="10" lg="10" class="px-0">
            <label>Value</label>
            <VTextField
            v-model="localEnvVariables[index].value"
            clearable
            placeholder=""
            />
        </VCol>
        <VCol cols="2" sm="2" lg="2" class="px-0 justify-end d-flex">
            <VBtn
            class="mt-5 ml-1"
            variant="text"
            icon="tabler-circle-minus"
            color="error"
            @click="removeEnvVariable(index)"
            />
        </VCol>
        </VRow>
    </VCol>
    </VRow>

    <!-- Botón para agregar nueva variable -->
    <VRow>
    <VCol cols="12" sm="12" lg="12" class="px-2">
        <VBtn
        variant="outlined"
        @click="addEnvVariable"
        >
        <VIcon
            icon="tabler-circle-plus"
            class="mr-2"
        />
        Agregar otro
        </VBtn>
    </VCol>
    </VRow>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'

const props = defineProps({
  initialVariables: {
    type: Array,
    default: () => []
  }
})

// Estado local para manejar las variables
const localEnvVariables = ref([])

// Función para inicializar o actualizar variables
const updateLocalVariables = (variables) => {
  localEnvVariables.value = variables.length > 0 
    ? [...variables] 
    : [{ key: '', value: '' }]
}

// Observar cambios en initialVariables
watch(() => props.initialVariables, (newVars) => {
  updateLocalVariables(newVars)
}, { immediate: true }) // immediate: true hace que se ejecute inmediatamente al montar

// Función para agregar una nueva variable
const addEnvVariable = () => {
  localEnvVariables.value.push({ key: '', value: '' })
}

// Función para eliminar una variable
const removeEnvVariable = (index) => {
  localEnvVariables.value.splice(index, 1)
  
  // Asegurarse de que siempre haya al menos una variable
  if (localEnvVariables.value.length === 0) {
    localEnvVariables.value.push({ key: '', value: '' })
  }
}

// Emitir cambios al componente padre
const emit = defineEmits(['update:variables'])

// Observar cambios en las variables locales
watch(
  () => [...localEnvVariables.value], // Clonar la referencia para evitar referencia reactiva
  (newVars) => {
    emit('update:variables', JSON.parse(JSON.stringify(newVars))) // Romper reactividad interna
  }
)
  </script>