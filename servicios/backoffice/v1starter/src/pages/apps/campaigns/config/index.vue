<template>
  <VCard>
    <VCardTitle class="pa-4">
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="text-h6 pb-1">Activa publicidad en ecuavisa.com</div>
          <div class="text-caption text-grey-darken-1">
            En todo el sitio o administra las URLs donde aparecerá la publicidad.
          </div>
        </div>
        <VSwitch
          v-model="isGlobalEnabled"
          color="primary"
          label="Activar en todo el sitio"
          hide-details
          @change="updateGlobalStatus"
          :loading="loading"
        />
      </div>
    </VCardTitle>

    <VCardText>
      <!-- Input y Lista de URLs (visibles solo si global está desactivado) -->
      <div v-show="!isGlobalEnabled">
        <!-- Input URL -->
        <VRow>
          <VCol cols="12">
            <VForm @submit.prevent="addUrl">
              <div class="d-flex align-items-center gap-2">
                <VTextField
                  v-model="newUrl"
                  placeholder="https://..."
                  :rules="[v => !!v || 'URL es requerida', validateUrl]"
                  @keyup.enter="addUrl"
                  :disabled="loading"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
                <VBtn
                  color="primary"
                  @click="addUrl"
                  :disabled="!isValidUrl || loading"
                  :loading="loading"
                >
                  Agregar
                </VBtn>
              </div>
            </VForm>
          </VCol>
        </VRow>

        <!-- Lista de URLs -->
        <VRow>
          <VCol cols="12">
            <div v-if="urls.length > 0" class="mt-4">
              <div
                v-for="(url, index) in urls"
                :key="index"
                class="url-item d-flex justify-space-between align-center py-3"
              >
                <div class="d-flex align-center gap-2 text-truncate">
                  <VIcon 
                    size="small" 
                    color="primary"
                  >
                    mdi-link-variant
                  </VIcon>
                  <span class="text-body-1 text-truncate pe-2">{{ url.https }}</span>
                </div>
                <div class="d-flex align-center gap-2">
                  <VBtn
                    icon
                    color="primary"
                    variant="text"
                    @click="copyUrl(url.https)"
                    :disabled="loading"
                    class="copy-btn"
                  >
                    <VIcon size="small">{{ isCopied === url.https ? 'mdi-check' : 'mdi-content-copy' }}</VIcon>
                  </VBtn>
                  <VBtn
                    icon
                    color="error"
                    variant="text"
                    @click="removeUrl(index)"
                    :disabled="loading"
                    class="delete-btn"
                  >
                    <VIcon size="small">mdi-delete</VIcon>
                  </VBtn>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-grey-darken-1 pa-4">
              {{ loading ? 'Cargando URLs...' : 'No hay URLs registradas' }}
            </div>
          </VCol>
        </VRow>
      </div>
    </VCardText>

    <!-- Notificaciones -->
    <VSnackbar
      v-model="showNotification"
      :color="notificationColor"
      :timeout="3000"
      location="top right"
      class="text-center"
    >
      {{ notificationText }}
    </VSnackbar>
  </VCard>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const BASE_URL = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/publicidadBO'
const urls = ref([])
const newUrl = ref('')
const loading = ref(false)
const showNotification = ref(false)
const notificationText = ref('')
const notificationColor = ref('success')
const isCopied = ref(null)
const isGlobalEnabled = ref(false)

const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return 'URL inválida'
  }
}

const isValidUrl = computed(() => {
  try {
    new URL(newUrl.value)
    return true
  } catch {
    return false
  }
})

const showMessage = (message, type = 'success') => {
  notificationText.value = message
  notificationColor.value = type === 'delete' ? 'warning' : 
                           type === 'copy' ? 'info' : 'success'
  showNotification.value = true
}

// Copiar URL al portapapeles
const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    isCopied.value = url
    showMessage('URL copiada al portapapeles', 'copy')
    setTimeout(() => {
      if (isCopied.value === url) {
        isCopied.value = null
      }
    }, 2000)
  } catch (error) {
    showMessage('Error al copiar URL', 'error')
  }
}

// Cargar URLs iniciales y estado global
const fetchUrls = async () => {
  loading.value = true
  
  try {
    const response = await axios.get(`${BASE_URL}/config_publicidad.php`, {
      params: {
        api: 'web',
        key: 'publicidad_urls'
      }
    })
    
    if (response.data) {
      urls.value = response.data.data || []
      isGlobalEnabled.value = response.data.adsglobal === "true"
    }
  } catch (error) {
    console.error('Error al cargar URLs:', error)
    showMessage('Error al cargar los datos', 'error')
  } finally {
    loading.value = false
  }
}

// Actualizar URLs y estado global en el servidor
const updateUrls = async () => {
  const payload = {
    key: "publicidad_urls",
    estructura: {
      adsglobal: isGlobalEnabled.value.toString(),
      data: urls.value
    }
  }

  const response = await axios({
    method: 'post',
    url: `${BASE_URL}/config_publicidad.php`,
    params: {
      api: 'update'
    },
    data: payload,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

// Actualizar estado global
const updateGlobalStatus = async () => {
  loading.value = true
  try {
    await updateUrls()
    showMessage(
      isGlobalEnabled.value 
        ? 'Publicidad activada en todo el sitio' 
        : 'Publicidad desactivada globalmente',
      'success'
    )
  } catch (error) {
    isGlobalEnabled.value = !isGlobalEnabled.value
    showMessage('Error al actualizar el estado global', 'error')
  } finally {
    loading.value = false
  }
}

// Agregar URL
const addUrl = async () => {
  if (!isValidUrl.value || loading.value) return
  
  loading.value = true
  
  try {
    const newUrlObj = { https: newUrl.value }
    urls.value.push(newUrlObj)
    await updateUrls()
    newUrl.value = ''
    showMessage('URL agregada con éxito', 'success')
  } catch (error) {
    urls.value.pop()
    showMessage('Error al agregar URL', 'error')
  } finally {
    loading.value = false
  }
}

// Eliminar URL
const removeUrl = async (index) => {
  if (loading.value) return
  
  loading.value = true
  const removedUrl = urls.value[index]
  
  try {
    urls.value.splice(index, 1)
    await updateUrls()
    showMessage('URL eliminada correctamente', 'delete')
  } catch (error) {
    urls.value.splice(index, 0, removedUrl)
    showMessage('Error al eliminar URL', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUrls()
})
</script>

<style scoped>
.url-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.url-item:last-child {
  border-bottom: none;
}

.url-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.delete-btn {
  color: rgb(var(--v-theme-error)) !important;
}

.copy-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

:deep(.v-snackbar.v-snackbar--color-success) {
  --v-theme-overlay-multiplier: var(--v-theme-success);
  background-color: rgb(var(--v-theme-success)) !important;
  color: rgb(var(--v-theme-on-success)) !important;
}

:deep(.v-snackbar.v-snackbar--color-warning) {
  --v-theme-overlay-multiplier: var(--v-theme-warning);
  background-color: rgb(var(--v-theme-warning)) !important;
  color: rgb(var(--v-theme-on-warning)) !important;
}

:deep(.v-snackbar.v-snackbar--color-info) {
  --v-theme-overlay-multiplier: var(--v-theme-info);
  background-color: rgb(var(--v-theme-info)) !important;
  color: rgb(var(--v-theme-on-info)) !important;
}
</style>