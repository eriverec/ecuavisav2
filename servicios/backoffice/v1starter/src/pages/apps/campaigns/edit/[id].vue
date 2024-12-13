<script setup>
import { ref, watch, onMounted } from 'vue'
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
  { title: 'Códigos ADS', value: 'script' }
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
  { title: 'Home', value: 'Home' }
]

const posicionesDisponibles = [
  'RDTop1',
  'RDTop2',
  'RDTop3',
  'RDFloating'
]

// Snackbar para notificaciones
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
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
      color: 'error'
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
      color: 'error'
    }
    return false
  }

  if (!tipoContenido.value) {
    snackbar.value = {
      show: true,
      text: 'El tipo de contenido es requerido',
      color: 'error'
    }
    return false
  }

  if (!visibilidadWeb.value) {
    snackbar.value = {
      show: true,
      text: 'La visibilidad en el sitio es requerida',
      color: 'error'
    }
    return false
  }

  if (!posicion.value.length) {
    snackbar.value = {
      show: true,
      text: 'Debe seleccionar al menos una posición',
      color: 'error'
    }
    return false
  }

  // Validar campos según tipo de contenido
  if (tipoContenido.value === 'imagen') {
    if (!linkAds.value?.trim() || !linkImageEscritorio.value?.trim() || !linkImageMobile.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'Todos los campos de imagen son requeridos',
        color: 'error'
      }
      return false
    }
  } else if (tipoContenido.value === 'html' || tipoContenido.value === 'script') {
    if (!codigoHtml.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'El código es requerido',
        color: 'error'
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
      visibilitySection: visibilidadWeb.value
    },
    position: posicion.value.join(','),
    urls: {
      url: linkAds.value,
      html: codigoHtml.value,
      img: {
        escritorio: linkImageEscritorio.value,
        mobile: linkImageMobile.value
      }
    }
  }

  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/update/${route.params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(baseData)
    })

    const data = await response.json()
    
    if (data.resp) {
      snackbar.value = {
        show: true,
        text: 'Campaña actualizada exitosamente',
        color: 'success'
      }
      await fetchCampaignData()
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al actualizar la campaña',
      color: 'error'
    }
  }
}

// Watch para mantener solo una posición seleccionada
watch(posicion, (newVal) => {
  if (newVal.length > 1) {
    posicion.value = [newVal[newVal.length - 1]]
  }
})

onMounted(fetchCampaignData)
</script>

<template>
  <section>
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

    <VCard class="mt-5">
      <VCardText>
        <!-- Configuración base de la campaña -->
        <VForm @submit.prevent="handleBaseUpdate" class="mb-6">
          <VRow>
            <!-- Información básica -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="nombreCampania"
                label="Nombre de la campaña"
                required
                placeholder="Ingrese el nombre de la campaña"
              />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField
                v-model="descripcionCampania"
                label="Descripción"
                placeholder="Descripción breve de la campaña"
              />
            </VCol>

            <!-- Tipo de contenido -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="tipoContenido"
                :items="tiposContenido"
                label="Tipo de contenido"
                required
                item-title="title"
                item-value="value"
              />
            </VCol>

            <!-- Visibilidad -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="visibilidadWeb"
                :items="opcionesVisibilidad"
                label="Visibilidad en el sitio"
                required
                item-title="title"
                item-value="value"
              />
            </VCol>

            <!-- Posición -->
            <VCol cols="12" md="4">
              <VSelect
                v-model="posicion"
                :items="posicionesDisponibles"
                label="Posición"
                required
                chips
                multiple
              />
            </VCol>

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

              <VCol cols="12" md="6">
                <VTextField
                  v-model="linkImageEscritorio"
                  label="URL imagen de escritorio"
                  required
                  placeholder="URL de la imagen para escritorio"
                />
              </VCol>

              <VCol cols="12" md="6">
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

            <!-- Botón guardar configuración base -->
            <VCol cols="12" class="d-flex justify-end">
              <VBtn
                type="submit"
                color="primary"
                :loading="isLoading"
              >
                Guardar configuración base
              </VBtn>
            </VCol>
          </VRow>
        </VForm>

        <VDivider class="mb-6" />

        <!-- Selector de modo de edición -->
        <div class="d-flex align-center mb-4">
          <div class="me-4">Modo de edición de usuarios:</div>
          <VSwitch
            v-model="editMode"
            :true-value="'criteria'"
            :false-value="'list'"
            :label="editMode === 'criteria' ? 'Por criterios' : 'Lista personalizada'"
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
  </section>
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