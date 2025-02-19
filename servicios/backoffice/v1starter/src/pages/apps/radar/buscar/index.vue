<template>
  <div>
    <VRow class="match-height">
      <!-- Bloque Izquierdo -->
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardTitle class="px-6 py-4">
            <h4 class="text-h6 mb-0">Analizador de Sitios Web</h4>
          </VCardTitle>

          <VCardText>
            <VForm @submit.prevent="analizarSitio">
              <VTextField
                v-model="url"
                placeholder="Ingrese URL a analizar (ej: https://www.eluniverso.com)"
                :rules="urlRules"
                :error-messages="errorMessage"
                hide-details="auto"
                class="mb-4"
              >
                <!-- Icono de resetear -->
                <template v-slot:append-inner>
                  <VIcon
                    v-if="url"
                    icon="tabler-x"
                    size="18"
                    class="cursor-pointer"
                    @click="url = ''"
                  />
                </template>
                
                <!-- Icono de pegar -->
                <template v-slot:append>
                  <VIcon
                    icon="tabler-clipboard"
                    size="18"
                    class="cursor-pointer"
                    @click="pegarURL"
                  />
                </template>
              </VTextField>
              <VBtn
                type="submit"
                :loading="loading"
                :disabled="loading"
                color="primary"
                block
              >
                {{ loading ? 'Analizando...' : 'ANALIZAR' }}
              </VBtn>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Bloque Derecho -->

    <VCol cols="12" md="6">
      <!-- Bloque de resultados de análisis -->
      <VCard v-if="resultados && !error" class="h-100">
        <VCardText>
              <!-- Alertas -->
    <VAlert
      v-if="error"
      type="error"
      variant="tonal"
      closable
      class="mb-4 w-100"
      @click:close="error = null"
    >
      <span class="text-caption">{{ error }}</span>
    </VAlert>

    <VAlert
      v-if="success"
      type="success"
      variant="tonal"
      closable
      class="mb-4 w-100"
      @click:close="success = null"
    >
      <span class="text-caption">{{ success }}</span>
    </VAlert>

    <VAlert
      v-if="warning"
      type="warning"
      variant="tonal"
      closable
      class="mb-4 w-100"
      @click:close="warning = null"
    >
      <span class="text-caption">{{ warning }}</span>
    </VAlert>

    <!-- Información del medio -->
    <div class="d-flex flex-column flex-sm-row justify-space-between align-items-stretch gap-4 mb-4">
      <div class="w-100">
        <h6 class="text-subtitle-1 mb-1">
          Medio analizado: {{ resultados.source || url }}
        </h6>
        <span class="text-caption text-medium-emphasis">
          Resultados del análisis: {{ resultados.total }} artículos
        </span>
      </div>
      <div class="d-flex justify-end w-100">
        <VBtn
          color="success"
          :loading="guardando"
          :disabled="guardando || error || success || warning || medioYaGuardado"
          @click="guardarMedio"
          class="px-6 w-100"
        >
          <VIcon
            start
            icon="tabler-device-floppy"
            size="18"
            class="me-2"
          />
          {{ guardando ? 'Guardando...' : 'GUARDAR MEDIO' }}
        </VBtn>
      </div>
    </div>
              </VCardText>
      </VCard>

      <!-- Listado de medios (se muestra solo cuando no hay resultados) -->
      <VCard v-else-if="!resultados" class="h-100">
        <VCardTitle class="px-6 py-4">
                <h4 class="text-h6 mb-0">Medios guardados</h4>
              </VCardTitle>

        <VCardText>
          <div v-if="loadingMedios" class="d-flex justify-center align-center pa-4">
            <VProgressCircular indeterminate color="primary" />
          </div>

          <VList>
              <VListItem
                v-for="medio in medios"
                :key="medio._id"
                :title="medio.media_communication"
                class="mb-2 border-b"
              >
              <template v-slot:append>
                <div class="d-flex gap-2">
                  <VBtn
                    icon
                    variant="text"
                    color="primary"
                    :href="medio.url_communication"
                    target="_blank"
                    size="small"
                  >
                    <VIcon icon="tabler-external-link" size="18" />
                  </VBtn>
                  <VBtn
                    icon
                    variant="text"
                    color="primary"
                    @click="analizarMedioExistente(medio.url_communication)"
                    size="small"
                  >
                    <VIcon icon="tabler-eye" size="18" />
                  </VBtn>
                </div>
              </template>
            </VListItem>
          </VList>
        </VCardText>
      </VCard>
    </VCol>
</VRow>

    <!-- Lista de artículos abajo -->
    <VRow v-if="resultados && !error">
      <VCol cols="12">
        <div class="article-list">
                <div 
                  v-for="(articulo, index) in resultados.articles" 
                  :key="index"
                  class="article-item"
                >
                  <div class="d-flex align-items-center gap-3 py-2 border-b">
                    <!-- Imagen o icono -->
                    <div class="article-image">
                      <VImg
                        v-if="articulo.image"
                        :src="articulo.image"
                        :alt="articulo.title"
                        width="50"
                        height="50"
                        cover
                        class="rounded"
                      />
                      <VIcon
                        v-else
                        icon="tabler-file-text"
                        size="32"
                        class="text-medium-emphasis"
                      />
                    </div>

                    <!-- Contenido del artículo -->
                    <div class="article-content flex-grow-1 min-w-0">
                      <div class="d-flex align-items-center gap-2 mb-1">
                        <VChip
                          v-if="articulo.category"
                          color="info"
                          size="x-small"
                          class="text-uppercase"
                        >
                          {{ articulo.category }}
                        </VChip>
                        <span class="text-caption text-medium-emphasis">
                          {{ articulo.timestamp || '' }}
                        </span>
                      </div>

                      <h6 class="text-subtitle-2 mb-1 text-truncate">{{ articulo.title }}</h6>
                      
                      <p v-if="articulo.summary" class="text-caption text-medium-emphasis mb-0 d-none d-sm-block text-truncate">
                        {{ articulo.summary }}
                      </p>
                    </div>

                    <!-- Botón Ver Artículo -->
                    <div class="article-action">
                      <VBtn
                        v-if="articulo.link"
                        :href="articulo.link"
                        target="_blank"
                        variant="text"
                        size="small"
                        color="primary"
                        class="d-none d-sm-flex"
                      >
                        <VIcon start icon="tabler-external-link" size="16" />
                        VER ARTÍCULO
                      </VBtn>
                      <VBtn
                        v-if="articulo.link"
                        :href="articulo.link"
                        target="_blank"
                        variant="text"
                        size="small"
                        color="primary"
                        icon
                        class="d-sm-none"
                      >
                        <VIcon icon="tabler-external-link" size="16" />
                      </VBtn>
                    </div>
                  </div>
                </div>
              </div>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const url = ref('')
const loading = ref(false)
const guardando = ref(false)
const error = ref(null)
const success = ref(null)
const warning = ref(null)
const resultados = ref(null)
const errorMessage = ref('')
const medios = ref([])
const loadingMedios = ref(false)
const medioYaGuardado = ref(false) 

const urlRules = [
  v => !!v || 'La URL es requerida',
  v => /^(http|https):\/\/[^ "]+$/.test(v) || 'Ingrese una URL válida'
]

const pegarURL = async () => {
  try {
    const texto = await navigator.clipboard.readText()
    url.value = texto
  } catch (err) {
    console.error('Error al pegar:', err)
    errorMessage.value = 'No se pudo acceder al portapapeles'
  }
}

// Función para cargar medios
const cargarMedios = async () => {
  loadingMedios.value = true
  try {
    const response = await axios.get('https://servicio-competencias.vercel.app/scrapper-rule/all?page=1&limit=100')
    medios.value = response.data.data
  } catch (err) {
    console.error('Error al cargar medios:', err)
  } finally {
    loadingMedios.value = false
  }
}

onMounted(() => {
  cargarMedios()
})

// Función para resetear todo cuando se hace nuevo análisis
const resetearTodo = () => {
  error.value = null
  success.value = null
  warning.value = null
  resultados.value = null
  errorMessage.value = ''
}

// Función para limpiar solo mensajes
const limpiarMensajes = () => {
  error.value = null
  success.value = null
  warning.value = null
}

// Función para analizar sitio nuevo
const analizarSitio = async () => {
  if (!urlRules.every(rule => rule(url.value) === true)) {
    error.value = 'Por favor ingrese una URL válida'
    return
  }

  loading.value = true
  resetearTodo() // Reseteamos todo porque es nuevo análisis

  try {
    const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
      url: url.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    resultados.value = response.data
    verificarMedioGuardado(url.value) // Verificamos si el medio ya está guardado

    // Si está guardado, mostramos una alerta
    if (medioYaGuardado.value) {
      warning.value = 'Este medio ya se encuentra registrado'
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message || 
                 'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false
  }
}

// Función para analizar un medio existente
const analizarMedioExistente = async (url) => {
  loading.value = true
  resetearTodo() // Reseteamos todo porque es nuevo análisis

  try {
    const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
      url: url
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    resultados.value = response.data
    verificarMedioGuardado(url) // Verificamos si el medio ya está guardado

    // Como viene del listado, ya sabemos que está guardado
    warning.value = 'Este medio ya se encuentra registrado'
  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message || 
                 'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false
  }
}

// Función para verificar si un medio ya está guardado
const verificarMedioGuardado = (urlActual) => {
  const medioEncontrado = medios.value.find(medio => 
    medio.url_communication === urlActual ||
    urlActual.includes(medio.url_communication) ||
    medio.url_communication.includes(urlActual)
  )
  medioYaGuardado.value = !!medioEncontrado
}

const guardarMedio = async () => {
  if (!resultados.value) return

  guardando.value = true
  limpiarMensajes() // Aquí solo limpiamos mensajes, mantenemos resultados

  try {
    const urlObj = new URL(url.value)
    const nombreMedio = urlObj.hostname.replace('www.', '').split('.')[0]
    
    const pathSegments = urlObj.pathname.split('/')
    let categoria = ''
    
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i].toLowerCase()
      if (segment && segment !== 'categoria' && segment !== 'category') {
        categoria = segment
        break
      }
    }

    const key = categoria ? `${nombreMedio}-${categoria}` : nombreMedio

    const bodyData = {
      key: key,
      medio: nombreMedio,
      url: url.value,
      consulta: {
        title: "string",
        link: "string",
        imagen: "string",
        category: "string",
        date: "timestamp"
      },
      conversion: {
        title: "titulo",
        link: "url",
        imagen: "img",
        category: "vertical",
        date: "fechaPublicacion",
        author: "autor"
      }
    }

    const response = await axios.post('https://servicio-competencias.vercel.app/scrapper-rule/create', bodyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Verificar respuesta del servidor
    if (response.data && response.data.resp === false) {
      warning.value = `Este medio ya se encuentra guardado con el nombre "${response.data.key}"`
      return
    }

    // Mensaje de éxito si todo sale bien
    success.value = `Medio ${key} guardado exitosamente`
  } catch (err) {
    console.error('Error al guardar medio:', err)
    if (err.response?.data?.mensaje) {
      warning.value = `Esta guardado con el nombre "${err.response.data.key}"`
    } else {
      error.value = 'Error al guardar el medio. Por favor intente nuevamente.'
    }
  } finally {
    guardando.value = false
  }
}


</script>

<style lang="scss" scoped>
.article-list {
  .article-item {
    .article-image {
      min-width: 50px;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .article-content {
      min-width: 0; 
    }

    .article-action {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
  }
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.match-height {
  display: flex;
  flex-wrap: wrap;
}

.match-height > [class*='col'] {
  display: flex;
}

.match-height .v-card {
  width: 100%;
}

@media (max-width: 600px) {
  .article-list {
    .article-item {
      .article-image {
        min-width: 40px;
        width: 40px;
      }
    }
  }
}

.match-height {
  display: flex;
  flex-wrap: wrap;
}

.match-height > [class*='col'] {
  display: flex;
}

.match-height .v-card {
  width: 100%;
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 600px) {
  .d-flex.flex-column.flex-sm-row {
    gap: 16px;
  }
  .v-alert {
    width: 100% !important;
  }
  
  .v-btn {
    width: 100% !important;
  }
  
  .d-flex.flex-column.flex-sm-row {
    gap: 16px;
  }

 
}
.v-alert__content {
    width: max-content!important;
}


</style>