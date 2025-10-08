<!-- eslint-disable sonarjs/no-collapsible-if -->
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CampaignEditByCriteria from './CampaignEditByCriteria.vue'
import CampaignEditByList from './CampaignEditByList.vue'

const route = useRoute()
const editMode = ref('criteria') // 'criteria' | 'list'
const campaignData = ref(null)
const isLoading = ref(true)

// Referencias para campos base
const nombreCampania = ref('')
const descripcionCampania = ref('')
const tipoContenido = ref('')
const visibilidadWeb = ref('')
const posicion = ref([])
const codigoHtml = ref('')
const linkAds = ref('')
const linkImageEscritorio = ref('')
const linkImageMobile = ref('')

// Listas de opciones
const tiposContenido = [
  { title: 'Imágenes locales', value: 'imagen' },
  { title: 'Código HTML', value: 'html' },
  { title: 'Códigos ADS', value: 'script' },
]

const opcionesVisibilidad = [
  { title: 'Todo el sitio', value: 'all' },
  { title: 'Lo-ultimo', value: 'Lo-ultimo' },
  { title: 'Noticias', value: 'Noticias' },
  { title: 'Mundo', value: 'Mundo' },
  { title: 'Estadio', value: 'Estadio' },
  { title: 'Entretenimiento', value: 'Entretenimiento' },
  { title: 'Programas', value: 'Programas' },
  { title: 'Tendencias', value: 'Tendencias' },
  { title: 'Home', value: 'Home' },
]

const posicionesDisponibles = [
  'RDTop1',
  'RDTop2',
  'RDTop3',
  'RDFloating',
]

// Snackbar para notificaciones
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

// Obtener datos iniciales de la campaña
const fetchCampaignData = async () => {
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/get/edit/${route.params.id}/`)
    const data = await response.json()
    
    if (data && data[0]) {
      campaignData.value = data[0]
      
      // Cargar datos base
      nombreCampania.value = data[0].campaignTitle || ''
      descripcionCampania.value = data[0].description || ''
      tipoContenido.value = data[0].type || ''
      visibilidadWeb.value = data[0].criterial?.visibilitySection || 'all'
      posicion.value = data[0].position ? data[0].position.split(',') : []
      
      // Cargar contenido según tipo
      if (data[0].urls) {
        codigoHtml.value = data[0].urls.html || ''
        linkAds.value = data[0].urls.url || ''
        linkImageEscritorio.value = data[0].urls.img?.escritorio || ''
        linkImageMobile.value = data[0].urls.img?.mobile || ''
      }
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al cargar la campaña',
      color: 'error',
    }
  } finally {
    isLoading.value = false
  }
}

// Validar campos según el tipo de contenido
const validateBaseFields = () => {
  if (!nombreCampania.value?.trim()) {
    snackbar.value = {
      show: true,
      text: 'El nombre de la campaña es requerido',
      color: 'error',
    }
    
    return false
  }

  if (!tipoContenido.value) {
    snackbar.value = {
      show: true,
      text: 'El tipo de contenido es requerido',
      color: 'error',
    }
    
    return false
  }

  if (!visibilidadWeb.value) {
    snackbar.value = {
      show: true,
      text: 'La visibilidad en el sitio es requerida',
      color: 'error',
    }
    
    return false
  }

  if (!posicion.value.length) {
    snackbar.value = {
      show: true,
      text: 'Debe seleccionar al menos una posición',
      color: 'error',
    }
    
    return false
  }

  // Validar campos según tipo de contenido
  if (tipoContenido.value === 'imagen') {
    if (!linkAds.value?.trim() || !linkImageEscritorio.value?.trim() || !linkImageMobile.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'Todos los campos de imagen son requeridos',
        color: 'error',
      }
      
      return false
    }
  } else if (tipoContenido.value === 'html' || tipoContenido.value === 'script') {
    if (!codigoHtml.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'El código es requerido',
        color: 'error',
      }
      
      return false
    }
  }

  return true
}

// Actualizar datos base de la campaña
const handleBaseUpdate = async () => {
  if (!validateBaseFields()) return

  const baseData = {
    campaignTitle: nombreCampania.value,
    description: descripcionCampania.value,
    type: tipoContenido.value,
    criterial: {
      ...campaignData.value?.criterial,
      visibilitySection: visibilidadWeb.value,
    },
    position: posicion.value.join(','),
    urls: {
      url: linkAds.value,
      html: codigoHtml.value,
      img: {
        escritorio: linkImageEscritorio.value,
        mobile: linkImageMobile.value,
      },
    },
  }

  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/update/${route.params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(baseData),
    })

    const data = await response.json()
    
    if (data.resp) {
      snackbar.value = {
        show: true,
        text: 'Campaña actualizada exitosamente',
        color: 'success',
      }
      await fetchCampaignData()
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al actualizar la campaña',
      color: 'error',
    }
  }
}

// Guardar cambios de Criterios
const handleSave = async () => {
  document.getElementById('guardacrit')?.click()
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

const handleAllSaves = async () => {
  // await handleBaseUpdate() // no vale funcion
  document.getElementById('guardacrit')?.click()
}

// Watch para mantener solo una posición seleccionada
watch(posicion, newVal => {
  if (newVal.length > 1) {
    posicion.value = [newVal[newVal.length - 1]]
  }
})

onMounted(fetchCampaignData)
</script>

<template>
  <div class="position-relative">
    <!-- Overlay de carga -->
    <VOverlay
      :model-value="isLoading"
      class="align-center justify-center"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
    </VOverlay>

    <!-- Snackbar para notificaciones -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="top"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <VForm @submit.prevent="handleBaseUpdate">
      <VRow>
        <!-- Detalles de campaña -->
        <VCol
          cols="12"
          md="6"
        >
          <VCard class="h-100">
            <VCardTitle class="pa-4">
              <VChip
                color="primary"
                label
                size="large"
                class="px-4 py-2 text-uppercase"
              >
                Detalles de Campaña
              </VChip>
            </VCardTitle>
            <VCardText>
              <VRow>
                <!-- Nombre de la campaña -->
                <VCol cols="6">
                  <VRow no-gutters>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <label for="nombreCampania">Nombre de la campaña</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <VTextField
                        id="nombreCampania"
                        v-model="nombreCampania"
                        placeholder="Nombre de la campaña"
                        persistent-placeholder
                        required
                      />
                    </VCol>
                  </VRow>
                </VCol>

                <!-- Tipo de contenido -->
                <VCol cols="6">
                  <VRow no-gutters>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <label for="tipocontenido">Tipo de contenido</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <VSelect
                        v-model="tipoContenido"
                        :items="tiposContenido"
                        item-title="title"
                        item-value="value"
                        required
                        clearable
                        label=""
                      />
                    </VCol>
                  </VRow>
                </VCol>

                <!-- Campo de descripción -->
                <VCol cols="12">
                  <VRow no-gutters>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <label for="descripcionCampania">Descripción de la campaña</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <VTextField
                        id="descripcionCampania"
                        v-model="descripcionCampania"
                        placeholder="Ingrese una descripción para la campaña"
                        persistent-placeholder
                      />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Configuración de Contenido -->
        <VCol
          cols="12"
          md="6"
        >
          <VCard class="h-100">
            <VCardTitle class="pa-4">
              <VChip
                color="primary"
                label
                size="large"
                class="px-4 py-2 text-uppercase"
              >
                Configuración de Contenido
              </VChip>
            </VCardTitle>
            <VCardText>
              <VRow class="pb-5">
                <!-- Campos según tipo de contenido -->
                <template v-if="tipoContenido === 'imagen'">
                  <VCol cols="12">
                    <VTextField
                      v-model="linkAds"
                      label="Link del ads"
                      required
                      placeholder="URL del anuncio"
                    />
                  </VCol>

                  <VCol cols="6">
                    <VTextField
                      v-model="linkImageEscritorio"
                      label="URL imagen de escritorio"
                      required
                      placeholder="URL de la imagen para escritorio"
                    />
                  </VCol>

                  <VCol cols="6">
                    <VTextField
                      v-model="linkImageMobile"
                      label="URL imagen de móvil"
                      required
                      placeholder="URL de la imagen para móvil"
                    />
                  </VCol>
                </template>

                <template v-else-if="tipoContenido === 'html' || tipoContenido === 'script'">
                  <VCol cols="12">
                    <VTextarea
                      v-model="codigoHtml"
                      :label="tipoContenido === 'html' ? 'Código HTML' : 'Código ADS'"
                      required
                      rows="6"
                      placeholder="Ingrese el código"
                    />
                  </VCol>
                </template>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Visibilidad en la web -->
        <VCol cols="12">
          <VCard>
            <VCardTitle class="pa-4">
              <VChip
                color="primary"
                label
                size="large"
                class="px-4 py-2 text-uppercase"
              >
                Visibilidad en la web
              </VChip>
            </VCardTitle>
            <VCardText>
              <VRow>
                <!-- Escoge sección -->
                <VCol cols="6">
                  <VRow no-gutters>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <label for="visibilidad">Escoge una sección</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <VSelect
                        v-model="visibilidadWeb"
                        :items="opcionesVisibilidad"
                        item-title="title"
                        item-value="value"
                        required
                        clearable
                        label=""
                      />
                    </VCol>
                  </VRow>
                </VCol>

                <!-- Posición -->
                <VCol cols="6">
                  <VRow no-gutters>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <label for="posicion">Posición</label>
                    </VCol>
                    <VCol
                      cols="12"
                      md="12"
                    >
                      <VSelect
                        v-model="posicion"
                        :items="posicionesDisponibles"
                        chips
                        multiple
                        clearable
                        label=""
                      />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Target/Usuarios -->
        <VCol cols="12">
          <VCard>
            <VCardTitle class="pa-4">
              <VChip
                color="primary"
                label
                size="large"
                class="px-4 py-2 text-uppercase"
              >
                Target / Usuarios
              </VChip>
            </VCardTitle>
            <VCardText>
              <!-- Selector de modo de edición -->
              <div class="d-flex justify-end mb-4">
                <VSwitch
                  v-model="editMode"
                  true-value="criteria"
                  false-value="list"
                  :label="editMode === 'criteria' ? 'Por criterios' : 'Lista personalizada'"
                  color="primary"
                />
              </div>

              <!-- Componentes de edición -->
              <VFadeTransition>
                <CampaignEditByCriteria
                  v-if="editMode === 'criteria' && campaignData"
                  :campaign-data="campaignData"
                  @update="fetchCampaignData"
                />
                <CampaignEditByList
                  v-else-if="editMode === 'list' && campaignData"
                  :campaign-data="campaignData"
                  @update="fetchCampaignData"
                />
              </VFadeTransition>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VForm>

    <!-- Botón flotante para guardar -->
    <VBtn
      type="submit"
      class="save-button"
      color="success"
      icon="mdi-check"
      size="large"

      style="position: fixed; bottom: 2rem; right: 2rem;"
      @click="handleAllSaves"
    >
      <VIcon icon="tabler-device-floppy" />
    </VBtn>
  </div>
</template>

<style scoped>
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.3s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}
</style>