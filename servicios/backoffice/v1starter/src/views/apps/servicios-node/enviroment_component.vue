<template>
  <VDivider class="mb-4" />
  
  <VRow v-for="(envVar, index) in localEnvVariables" :key="`env-${index}`">
    <VCol cols="5" sm="5" lg="5" class="px-2">
      <label>Key</label>
      <VTextField
        :model-value="envVar.key"
        clearable
        placeholder="e.g CLIENT_KEY"
        @update:model-value="updateVariable(index, 'key', $event)"
      />
    </VCol>
    <VCol cols="7" sm="7" lg="7" class="px-2">
      <VRow class="align-center">
        <VCol cols="10" sm="10" lg="10" class="px-0">
          <label>Value</label>
          <VTextField
            :model-value="envVar.value"
            clearable
            placeholder=""
            @update:model-value="updateVariable(index, 'value', $event)"
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

  <VRow>
    <VCol cols="12" sm="12" lg="12" class="px-2">
      <VBtn variant="outlined" @click="addEnvVariable">
        <VIcon icon="tabler-circle-plus" class="mr-2" />
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

const emit = defineEmits(['update:variables'])
const localEnvVariables = ref([{ key: '', value: '' }])

const updateVariable = (index, field, value) => {
  localEnvVariables.value[index][field] = value
  emit('update:variables', [...localEnvVariables.value])
}

const addEnvVariable = () => {
  localEnvVariables.value.push({ key: '', value: '' })
  emit('update:variables', [...localEnvVariables.value])
}

const removeEnvVariable = (index) => {
  localEnvVariables.value.splice(index, 1)
  if (localEnvVariables.value.length === 0) {
    localEnvVariables.value.push({ key: '', value: '' })
  }
  emit('update:variables', [...localEnvVariables.value])
}

watch(() => props.initialVariables, (newVars) => {
  localEnvVariables.value = newVars.length ? [...newVars] : [{ key: '', value: '' }]
}, { immediate: true })
</script>