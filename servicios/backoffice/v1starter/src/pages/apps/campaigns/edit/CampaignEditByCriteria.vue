<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  campaignData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update'])

// Estados
const isLoading = ref(false)
const selectedCountry = ref(props.campaignData.criterial?.country || '')
const selectedCities = ref(props.campaignData.criterial?.city?.split(',') || [])
const selectedDevices = ref(props.campaignData.criterial?.dispositivo?.split(',') || ['todos'])
const citySearch = ref('')

// Snackbar para notificaciones
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

// Datos
const countryList = ref([])
const cityList = ref([])
const dataCountry = ref([])

// Lista de dispositivos con opción "todos"
const deviceOptions = [
  { title: 'Todos los dispositivos', value: 'todos', avatar: 'mdi-devices' },
  { title: 'Escritorio', value: 'desktop', avatar: 'mdi-laptop-chromebook' },
  { title: 'Móvil', value: 'movil', avatar: 'mdi-cellphone-android' },
]

// Computed para filtrar ciudades
const filteredCities = computed(() => {
  if (!cityList.value.length) return []
  
  const search = citySearch.value.toLowerCase()
  
  return cityList.value.filter(city => 
    city.toLowerCase().includes(search) || city === 'Todas las ciudades',
  )
})

// Computed para el total de usuarios
const totalUsers = ref(0)

// Cargar países
const fetchCountries = async () => {
  try {
    isLoading.value = true

    const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades')
    const data = await response.json()

    dataCountry.value = data
    countryList.value = data.map(country => ({
      title: country.country,
      value: country.country,
    }))
  } catch (error) {
    console.error('Error al cargar países:', error)
    snackbar.value = {
      show: true,
      text: 'Error al cargar países',
      color: 'error',
    }
  } finally {
    isLoading.value = false
  }
}

// Cargar ciudades cuando se selecciona un país
const loadCities = () => {
  if (!selectedCountry.value || !dataCountry.value.length) {
    cityList.value = []
    
    return
  }

  const country = dataCountry.value.find(c => c.country === selectedCountry.value)
  if (country) {
    cityList.value = ['Todas las ciudades', ...country.data.map(c => c.city)]
  }
}

// Obtener total de usuarios según criterios
const fetchTotalUsers = async () => {
  try {
    isLoading.value = true

    const payload = {
      criterio: ['dispositivos', 'trazabilidads'],
      pais: selectedCountry.value || -1,
      ciudad: selectedCities.value.includes('Todas las ciudades') ? -1 : selectedCities.value.join(','),
      dispositivo: selectedDevices.value.includes('todos') ? null : selectedDevices.value.join(','),
    }

    const response = await fetch('https://ads-service.vercel.app/campaign/v2/usuarios/get/user/total', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (data.resp) {
      totalUsers.value = data.total
    }
  } catch (error) {
    console.error('Error al obtener total de usuarios:', error)
    snackbar.value = {
      show: true,
      text: 'Error al obtener total de usuarios',
      color: 'error',
    }
  } finally {
    isLoading.value = false
  }
}

// Guardar cambios
const handleSave = async () => {
  try {
    const updatedData = {
      ...props.campaignData,
      criterial: {
        ...props.campaignData.criterial,
        country: selectedCountry.value || -1,
        city: selectedCities.value.includes('Todas las ciudades') ? -1 : selectedCities.value.join(','),
        dispositivo: selectedDevices.value.includes('todos') ? null : selectedDevices.value.join(','),
      },
    }

    const response = await fetch(`https://ads-service.vercel.app/campaign/update/${props.campaignData._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })

    const data = await response.json()
    if (data.resp) {
      snackbar.value = {
        show: true,
        text: 'Criterios actualizados exitosamente',
        color: 'success',
      }
      emit('update')
    } else {
      throw new Error(data.error || 'Error al actualizar')
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al guardar los cambios',
      color: 'error',
    }
  }
}

// Watchers
watch(selectedCountry, () => {
  selectedCities.value = []
  loadCities()
})

watch([selectedCountry, selectedCities, selectedDevices], () => {
  if (selectedCountry.value || selectedDevices.value.length > 0) {
    fetchTotalUsers()
  }
}, { deep: true })

// Inicialización
onMounted(() => {
  fetchCountries()
  if (selectedCountry.value) {
    loadCities()
  }
  fetchTotalUsers()
})
</script>

<template>
  <div>
    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <VCard class="mb-4">
      <VCardText>
        <div class="d-flex align-center mb-4">
          <VIcon
            size="32"
            icon="mdi-account-group"
            color="primary"
            class="me-2"
          />
          <div>
            <div class="text-h6">
              Total de usuarios según criterios
            </div>
            <div class="text-h4 font-weight-bold">
              {{ totalUsers }}
            </div>
          </div>
        </div>
      </VCardText>
    </VCard>

    <VForm @submit.prevent="handleSave">
      <VRow>
        <!-- Dispositivos -->
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="selectedDevices"
            :items="deviceOptions"
            label="Dispositivos"
            multiple
            chips
            item-title="title"
            item-value="value"
          >
            <template #selection="{ item }">
              <VChip>
                <VAvatar start>
                  <VIcon :icon="item.raw.avatar" />
                </VAvatar>
                {{ item.title }}
              </VChip>
            </template>
          </VSelect>
        </VCol>

        <!-- País -->
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="selectedCountry"
            :items="countryList"
            label="País"
            :loading="isLoading"
            item-title="title"
            item-value="value"
            clearable
          />
        </VCol>

        <!-- Ciudades -->
        <VCol
          cols="12"
          md="12"
        >
          <VCombobox
            v-model="selectedCities"
            :items="filteredCities"
            label="Ciudades"
            multiple
            chips
            closable-chips
            :disabled="!selectedCountry"
            :loading="isLoading"
          >
            <template #prepend-inner>
              <VIcon
                size="18"
                icon="mdi-magnify"
                class="me-2"
              />
            </template>
            
            <template #input>
              <VTextField
                v-model="citySearch"
                placeholder="Buscar ciudad..."
                hide-details
                density="compact"
                :disabled="!selectedCountry"
              />
            </template>
          </VCombobox>
        </VCol>

        <!-- Botones de acción -->
        <VCol
          cols="12"
          class="d-flex justify-end"
        >
          <VBtn
            id="guardacrit"
            type="submit"
            color="primary"
            class="d-none"
            :loading="isLoading"
            :disabled="!selectedCountry && selectedDevices.includes('todos')"
          >
            Guardar criterios
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </div>
</template>

<style scoped>
.v-select :deep(.v-chip) {
  margin: 2px;
}

.v-combobox :deep(.v-field__input) {
  padding-top: 0;
}
</style>