<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserList from './modal-usuarios.vue'
import Papa from 'papaparse'

const route = useRoute()
const router = useRouter()

// Estado básico
const nombreCampania = ref('')
const descripcionCampania = ref('')
const languages = ref('')
const criterio = ref([])
const posicion = ref([])
const campaignUsers = ref([])
const loadingPanel = ref(false)
const loadComponent = ref(false)

// URLs y códigos
const codigoExternoModel = ref('')
const linkAds = ref('')
const linkImageEscritorio = ref('')
const linkImageMobile = ref('')

// Datos de geolocalización
const selectedItem = ref('')
const selectedItemCiudad = ref([])
const cityList = ref([])
const dataCountry = ref([])
const countryList = ref([])

// Modal y control
const userModalOpen = ref(false)
const isCriteriaMode = ref(false)

// Control de visibilidad y dispositivos
const selectItemVisibilidad = ref('')
const selectItemDispositivos = ref([])
const selectItemNavegador = ref([])
const selectItemSO = ref([])

// Notificaciones
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})
const criteriosState = ref({
  lastUpdate: null,
  updating: false
})
// Timeout para debounce
const timeoutId = ref(null)

// Opciones constantes
const typeOptions = [
  { title: 'Imágenes locales', value: 'imagen' },
  { title: 'Código HTML', value: 'html' },
  { title: 'Códigos ADS', value: 'script' }
]

const visibilityOptions = [
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

const deviceOptions = [
  { title: 'Escritorio', value: 'desktop', icon: 'mdi-laptop-chromebook' },
  { title: 'Móvil', value: 'movil', icon: 'mdi-cellphone-android' }
]

const positionOptions = [
  'RDTop1',
  'RDTop2',
  'RDTop3',
  'RDFloating'
]



// Funciones auxiliares
function showSuccess(message) {
  snackbar.value = {
    show: true,
    text: message,
    color: 'success'
  }
}

function showError(message) {
  snackbar.value = {
    show: true,
    text: message,
    color: 'error'
  }
}

// Cargar datos iniciales
onMounted(async () => {
  try {
    loadComponent.value = true
    await Promise.all([
      loadCountries(),
      loadCampaignData()
    ])
  } catch (error) {
    console.error('Error loading initial data:', error)
    showError('Error al cargar los datos')
  } finally {
    loadComponent.value = false
  }
})

async function updateUsersCount() {
  if (criteriosState.value.updating) return
  
  try {
    criteriosState.value.updating = true
    loadingPanel.value = true

    const response = await fetch('https://ads-service.vercel.app/campaign/v2/usuarios/get/user/total', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pais: selectedItem.value || -1,
        ciudad: selectedItemCiudad.value?.length ? selectedItemCiudad.value : -1,
        dispositivo: selectItemDispositivos.value?.length ? selectItemDispositivos.value : null
      })
    })

    const data = await response.json()
    if (data.resp) {
      campaignUsers.value = data.total
    }
  } catch (error) {
    console.error('Error actualizando contador:', error)
  } finally {
    loadingPanel.value = false
    criteriosState.value.updating = false
  }
}

// Cargar países
async function loadCountries() {
  try {
    const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades')
    dataCountry.value = await response.json()
    countryList.value = dataCountry.value.map(item => item.country)
  } catch (error) {
    console.error('Error loading countries:', error)
    throw error
  }
}

// Cargar datos de la campaña
async function loadCampaignData() {
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/get/edit/${route.params.id}`)
    if (!response.ok) throw new Error('Error fetching campaign data')
    
    const data = await response.json()
    if (!data?.[0]) throw new Error('No campaign data found')

    const campaign = data[0]
    
    // Asignar datos básicos
    nombreCampania.value = campaign.campaignTitle
    descripcionCampania.value = campaign.description ?? ''
    languages.value = campaign.type
    posicion.value = campaign.position ? 
      (Array.isArray(campaign.position) ? campaign.position : campaign.position.split(','))
      : []
    
    // Determinar modo inicial
    isCriteriaMode.value = Boolean(
      campaign.criterial?.country || 
      campaign.criterial?.city?.length || 
      campaign.criterial?.dispositivo?.length
    )

    // Cargar datos según el modo
    if (isCriteriaMode.value) {
      if (campaign.criterial) {
        selectItemVisibilidad.value = campaign.criterial.visibilitySection || 'all'
        selectedItem.value = campaign.criterial.country || ''
        
        if (campaign.criterial.country) {
          await loadCities(campaign.criterial.country)
        }

        selectedItemCiudad.value = campaign.criterial.city ? 
          (typeof campaign.criterial.city === 'string' ? 
            campaign.criterial.city.split(',').filter(Boolean) : 
            Array.isArray(campaign.criterial.city) ? 
              campaign.criterial.city : [])
          : []

        selectItemDispositivos.value = campaign.criterial.dispositivo ? 
          (typeof campaign.criterial.dispositivo === 'string' ? 
            campaign.criterial.dispositivo.split(',') : 
            campaign.criterial.dispositivo)
          : []
      }
    } else {
      // Cargar usuarios para modo no-criterios
      const usersResponse = await fetch(`https://ads-service.vercel.app/campaign/${route.params.id}/user`)
      const usersData = await usersResponse.json()
      if (usersData?.[0]?.userId) {
        campaignUsers.value = usersData[0].userId
      }
    }

    // Cargar URLs
    if (campaign.urls) {
      linkAds.value = campaign.urls.url || ''
      linkImageEscritorio.value = campaign.urls.img?.escritorio || ''
      linkImageMobile.value = campaign.urls.img?.mobile || ''
      codigoExternoModel.value = campaign.urls.html || ''
    }

  } catch (error) {
    console.error('Error loading campaign:', error)
    throw error
  }
}

// Cargar ciudades
async function loadCities(country) {
  const countryData = dataCountry.value.find(c => c.country === country)
  if (countryData?.data) {
    cityList.value = countryData.data.map(c => c.city)
  } else {
    cityList.value = []
  }
}

// Guardar cambios
async function handleSubmit() {
  try {
    loadingPanel.value = true

    const payload = {
      campaignTitle: nombreCampania.value,
      description: descripcionCampania.value,
      type: languages.value,
      criterial: {
        visibilitySection: selectItemVisibilidad.value
      },
      position: Array.isArray(posicion.value) ? 
        posicion.value.join(',') : 
        posicion.value,
      urls: {
        url: linkAds.value || '#',
        img: {
          escritorio: linkImageEscritorio.value || '',
          mobile: linkImageMobile.value || ''
        },
        html: codigoExternoModel.value || ''
      }
    }

    // Agregar criterios solo si está en modo criterios
    if (isCriteriaMode.value) {
      payload.criterial = {
        ...payload.criterial,
        country: selectedItem.value || -1,
        city: selectedItemCiudad.value?.length ? selectedItemCiudad.value.join(',') : -1,
        dispositivo: selectItemDispositivos.value?.length ? 
          selectItemDispositivos.value.join(',') : null,
      }
    } else {
      // En modo usuarios específicos
      payload.userId = campaignUsers.value.map(u => u.wylexId)
    }

    const response = await fetch(`https://ads-service.vercel.app/campaign/update/${route.params.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.resp) {
      showSuccess('Campaña actualizada exitosamente')
      setTimeout(() => router.push('/apps/campaigns/list'), 1500)
    } else {
      throw new Error(data.error || 'Error al actualizar')
    }
  } catch (error) {
    showError(error.message)
  } finally {
    loadingPanel.value = false
  }
}

// Actualizar usuarios
async function handleUserUpdate() {
  await loadCampaignData()
}

// Watchers
watch(selectedItem, async (newValue) => {
  if (newValue) {
    await loadCities(newValue)
    selectedItemCiudad.value = []
  }
})

watch([selectedItemCiudad, selectItemDispositivos, selectedItem], 
  (newValues, oldValues) => {
    if (!isCriteriaMode.value) return
    
    const now = Date.now()
    if (criteriosState.value.lastUpdate && 
        now - criteriosState.value.lastUpdate < 1000) {
      return
    }

    criteriosState.value.lastUpdate = now
    
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }

    timeoutId.value = setTimeout(() => {
      updateUsersCount()
    }, 1000)
  },
  { deep: true }
)

// Computed
const totalUsers = computed(() => campaignUsers.value?.length || 0)
</script>

<template>
  <section>
    <VOverlay
      :model-value="loadingPanel"
      class="align-center justify-center"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
    </VOverlay>

    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      :timeout="2000"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center py-4 px-6">
            <div>
              <h2 class="text-h5 mb-1">
                Editar Campaña
              </h2>
              <VCardSubtitle>{{ nombreCampania }}</VCardSubtitle>
            </div>
            
            <VSwitch
              v-model="isCriteriaMode"
              color="primary"
              density="compact"
              hide-details
              class="mt-n2"
              :label="isCriteriaMode ? 'Modo criterios' : 'Modo usuarios'"
              :disabled="loadingPanel"
            />
          </VCardTitle>

          <VCardText class="pt-4">
            <VForm @submit.prevent="handleSubmit">
              <VRow>
                <!-- Información básica -->
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="nombreCampania"
                    density="comfortable"
                    label="Nombre de la campaña"
                    placeholder="Ingrese el nombre de la campaña"
                    hide-details="auto"
                    required
                    :disabled="loadingPanel"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    v-model="languages"
                    :items="typeOptions"
                    density="comfortable"
                    label="Tipo de contenido"
                    placeholder="Seleccione el tipo"
                    hide-details="auto"
                    required
                    :disabled="loadingPanel"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextarea
                    v-model="descripcionCampania"
                    density="comfortable"
                    label="Descripción"
                    placeholder="Ingrese una descripción para la campaña"
                    hide-details="auto"
                    rows="3"
                    :disabled="loadingPanel"
                  />
                </VCol>

                <!-- Configuración de visualización -->
                <VCol cols="12" md="6">
                  <VSelect
                    v-model="posicion"
                    :items="positionOptions"
                    density="comfortable"
                    label="Posición"
                    placeholder="Seleccione la posición"
                    hide-details="auto"
                    required
                    :disabled="loadingPanel"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VSelect
                    v-model="selectItemVisibilidad"
                    :items="visibilityOptions"
                    density="comfortable"
                    label="Visibilidad en el sitio"
                    placeholder="Seleccione la visibilidad"
                    hide-details="auto"
                    required
                    :disabled="loadingPanel"
                  />
                </VCol>

                <!-- URLs y Contenido -->
                <template v-if="languages === 'imagen'">
                  <VCol cols="12">
                    <VTextField
                      v-model="linkAds"
                      density="comfortable"
                      label="URL del anuncio"
                      placeholder="https://"
                      hide-details="auto"
                      :disabled="loadingPanel"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="linkImageEscritorio"
                      density="comfortable"
                      label="URL imagen escritorio"
                      placeholder="https://"
                      hide-details="auto"
                      :disabled="loadingPanel"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="linkImageMobile"
                      density="comfortable"
                      label="URL imagen móvil"
                      placeholder="https://"
                      hide-details="auto"
                      :disabled="loadingPanel"
                    />
                  </VCol>
                </template>

                <VCol v-else cols="12">
                  <VTextarea
                    v-model="codigoExternoModel"
                    density="comfortable"
                    label="Código HTML/ADS"
                    placeholder="Ingrese el código"
                    hide-details="auto"
                    rows="4"
                    :disabled="loadingPanel"
                  />
                </VCol>

                <!-- Criterios o Usuarios -->
                <VCol cols="12">
                  <VDivider class="mb-4" />
                  
                  <VRow v-if="isCriteriaMode">
                    <VCol cols="12" md="4">
                      <VSelect
                        v-model="selectedItem"
                        :items="countryList"
                        density="comfortable"
                        label="País"
                        placeholder="Seleccione un país"
                        hide-details="auto"
                        :disabled="loadingPanel"
                      />
                    </VCol>

                    <VCol cols="12" md="4">
                      <VSelect
                        v-model="selectedItemCiudad"
                        :items="cityList"
                        density="comfortable"
                        label="Ciudades"
                        placeholder="Seleccione ciudades"
                        hide-details="auto"
                        multiple
                        chips
                        closable-chips
                        :disabled="!selectedItem || loadingPanel"
                      />
                    </VCol>

                    <VCol cols="12" md="4">
                      <VSelect
                        v-model="selectItemDispositivos"
                        :items="deviceOptions"
                        density="comfortable"
                        label="Dispositivos"
                        placeholder="Seleccione dispositivos"
                        hide-details="auto"
                        multiple
                        chips
                        closable-chips
                        :disabled="loadingPanel"
                      >
                        <template #selection="{ item }">
                          <VChip
                            size="small"
                            label
                            class="mr-1"
                          >
                            <VIcon
                              :icon="item.raw.icon"
                              size="14"
                              start
                              class="mr-1"
                            />
                            {{ item.title }}
                          </VChip>
                        </template>
                      </VSelect>
                    </VCol>

                    <VCol cols="12" v-if="totalUsers > 0" class="mt-2">
                      <VAlert
                        color="info"
                        variant="tonal"
                        class="d-flex align-center mb-0"
                      >
                        <VIcon
                          icon="tabler-users"
                          start
                          class="mr-3"
                        />
                        <span>Total de usuarios que cumplen los criterios: <strong>{{ totalUsers }}</strong></span>
                      </VAlert>
                    </VCol>
                  </VRow>

                  <VRow v-else>
                    <VCol cols="12">
                      <div class="d-flex justify-space-between align-center pa-4 bg-surface rounded">
                        <div class="d-flex align-center">
                          <VIcon
                            icon="tabler-users"
                            size="24"
                            color="primary"
                            class="mr-3"
                          />
                          <div>
                            <span class="text-h6">Usuarios específicos</span>
                            <div class="text-medium-emphasis">
                              Total: {{ totalUsers }}
                            </div>
                          </div>
                        </div>
                        <VBtn
                          color="primary"
                          prepend-icon="mdi-account-multiple-plus"
                          @click="userModalOpen = true"
                          :loading="loadingPanel"
                          :disabled="loadingPanel"
                        >
                          Gestionar usuarios
                        </VBtn>
                      </div>
                    </VCol>
                  </VRow>
                </VCol>

                <!-- Botones de acción -->
                <VCol cols="12">
                  <VDivider class="mb-4" />
                  <div class="d-flex gap-4 justify-end">
                    <VBtn
                      variant="tonal"
                      color="secondary"
                      :to="{ name: 'apps-campaigns-list' }"
                      :disabled="loadingPanel"
                    >
                      Cancelar
                    </VBtn>
                    <VBtn
                      color="primary"
                      type="submit"
                      :loading="loadingPanel"
                    >
                      Guardar cambios
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modal de usuarios -->
    <VDialog
      v-model="userModalOpen"
      class="v-dialog-sm"
      persistent
    >
      <VCard>
        <VCardText class="pa-6">
          <UserList
            :users="campaignUsers"
            :campaign-title="nombreCampania"
            :campaign-id="route.params.id"
            :users-per-page="10"
            @update:users="handleUserUpdate"
            @close="userModalOpen = false"
          />
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<style scoped>
.v-card {
  margin: 1rem;
}

.v-divider {
  margin: 1rem 0;
}

.device-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .v-col-12 {
    padding: 0.5rem;
  }
  
  .d-flex.gap-4 {
    gap: 0.5rem !important;
  }
}

/* Animaciones */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>