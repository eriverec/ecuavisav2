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
      <!-- Alertas existentes -->
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

      <!-- Información del medio y botón guardar -->
      <div class="d-flex flex-column flex-sm-row justify-space-between align-items-stretch gap-4 mb-4">
        <div class="w-100">
          <h6 class="text-subtitle-1 mb-1">
            Medio analizado: {{ resultados.source || url }}
          </h6>
          <span class="text-caption text-medium-emphasis">
            Resultados del análisis: {{ resultados.total }} artículos
          </span>
        </div>
        <div class="d-flex flex-column gap-2 w-100">
          <VBtn
            color="success"
            :loading="guardando"
            :disabled="guardando || error || success || warning || medioYaGuardado"
            @click="guardarMedio"
            class="px-6"
          >
            <VIcon
              start
              icon="tabler-device-floppy"
              size="18"
              class="me-2"
            />
            {{ guardando ? 'Guardando...' : 'GUARDAR MEDIO' }}
          </VBtn>
          
          <!-- Nuevo botón de regreso -->
          <VBtn
            variant="text"
            color="primary"
            class="mt-2"
            @click="regresar"
          >
            <VIcon
              start
              icon="tabler-arrow-left"
              size="18"
              class="me-2"
            />
            Volver
          </VBtn>
        </div>
      </div>
    </VCardText>
  </VCard>

    
       <!-- Listado de medios -->
       <VCard v-if="!resultados" class="h-100">
  <VCardTitle class="px-6 py-4">
    <h4 class="text-h6 mb-0">Medios Registrados</h4>
  </VCardTitle>

  <VCardText>
    <div v-if="loadingMedios" class="d-flex justify-center align-center pa-4">
      <VProgressCircular indeterminate color="primary" />
    </div>

    <div v-else>
      <VExpansionPanels>
        <VExpansionPanel
          v-for="(grupo, medio) in mediosAgrupados"
          :key="medio"
          @click="handlePanelChange(medio)"
        >
          <VExpansionPanelTitle>
            <div class="d-flex align-center">
              <span class="text-capitalize">{{ medio }}</span>
              <VChip
                color="grey-lighten-2"
                size="x-small"
                class="ms-2 custom-chip"
              >
                {{ medioCounts[medio] || '...' }}
              </VChip>
            </div>
          </VExpansionPanelTitle>
          
          <VExpansionPanelText>
            <!-- Loading state -->
            <div v-if="loadingMedioData[medio]" class="d-flex justify-center py-4">
              <VProgressCircular indeterminate color="primary" />
            </div>
            
            <!-- Data display -->
            <VList v-else-if="mediosData[medio]">
              <VListItem
                v-for="item in mediosData[medio]"
                :key="item._id"
                :title="formatearTitulo(item.key, medio)"
                class="mb-2 border-b"
              >
                <template v-slot:append>
                  <div class="d-flex gap-2">
                    <VBtn
                      icon
                      variant="text"
                      color="primary"
                      :href="item.url_communication"
                      target="_blank"
                      size="small"
                    >
                      <VIcon icon="tabler-external-link" size="18" />
                    </VBtn>
                    <VBtn
                      icon
                      variant="text"
                      color="primary"
                      @click="analizarMedioExistente(item.url_communication)"
                      size="small"
                    >
                      <VIcon icon="tabler-zoom-scan" size="18" />
                    </VBtn>
                  </div>
                </template>
              </VListItem>
            </VList>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <!-- Paginación principal -->
      <div 
  v-if="totalPages > 1" 
  class="d-flex flex-column align-center mt-4 gap-2"
>
  <VPagination
    :model-value="currentPage"
    :length="totalPages"
    :total-visible="5"
    :disabled="loadingMedios"
    @update:model-value="cambiarPagina"
    class="pagination-custom"
  />
</div>
    </div>
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
        <div class="d-flex align-items-center gap-3 py-4 border-b">
          <!-- Imagen con placeholder -->
          <div class="article-image">
            <div class="image-container rounded overflow-hidden">
              <VImg
                v-if="articulo.image"
                :src="articulo.image"
                :alt="articulo.title || 'Imagen del artículo'"
                width="80"
                height="80"
                cover
                class="rounded"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-items-center justify-content-center h-100 bg-light">
                    <VIcon
                      icon="tabler-photo"
                      size="24"
                      class="text-medium-emphasis"
                    />
                  </div>
                </template>
              </VImg>
              <div
                v-else
                class="placeholder-image d-flex align-items-center justify-content-center bg-light h-100"
              >
                <VIcon
                  icon="tabler-file-text"
                  size="32"
                  class="text-medium-emphasis"
                />
              </div>
            </div>
          </div>

          <!-- Contenido del artículo -->
          <div class="article-content flex-grow-1 min-w-0">
            <!-- Metadatos superiores -->
            <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
              <!-- Categoría -->
              <VChip
                v-if="articulo.category"
                color="info"
                size="x-small"
                class="text-uppercase"
              >
                {{ articulo.category }}
              </VChip>
              <VChip
                v-else
                color="grey-lighten-1"
                size="x-small"
                class="text-uppercase"
              >
                Sin categoría
              </VChip>
              
              <!-- Fecha y Autor -->
              <div class="d-flex align-items-center gap-2">
                <span v-if="articulo.timestamp" class="text-caption text-medium-emphasis d-flex align-items-center">
                  {{ formatearFecha(articulo.timestamp) }}
                </span>
                <span v-else class="text-caption text-medium-emphasis">
                  Fecha no disponible
                </span>

                <span 
                  v-if="getAuthorName(articulo.author)" 
                  class="text-caption text-medium-emphasis d-flex align-items-center gap-1"
                >
                  <VIcon icon="tabler-user" size="14" />
                  <template v-if="getAuthorLink(articulo.author)">
                    <a 
                      :href="getAuthorLink(articulo.author)"
                      target="_blank"
                      class="text-decoration-none text-primary"
                    >
                      {{ getAuthorName(articulo.author) }}
                    </a>
                  </template>
                  <template v-else>
                    {{ getAuthorName(articulo.author) }}
                  </template>
                </span>
              </div>

              <!-- Tags -->
              <div v-if="articulo.tags" class="d-flex flex-wrap gap-1 ms-auto">
                <VChip
                  v-for="tag in getArticleTags(articulo.tags)"
                  :key="tag"
                  size="x-small"
                  color="grey-lighten-3"
                  variant="text"
                  class="text-caption"
                >
                  {{ tag }}
                </VChip>
              </div>
            </div>

            <!-- Título y resumen -->
            <div class="content-wrapper">
              <h6 class="text-subtitle-1 mb-2 text-truncate" :title="articulo.title || 'Título no disponible'">
                {{ articulo.title || 'Título no disponible' }}
              </h6>
              
              <p 
                v-if="validateSummary(articulo.summary)" 
                class="text-body-2 text-medium-emphasis mb-2 d-none d-sm-block description-text"
                :title="validateSummary(articulo.summary)"
              >
                {{ validateSummary(articulo.summary) }}
              </p>
              <p v-else class="text-body-2 text-medium-emphasis mb-2 d-none d-sm-block fst-italic">
                Resumen no disponible
              </p>

              <!-- Tags o keywords si existen -->
              <div v-if="articulo.tags && articulo.tags.length" class="d-flex flex-wrap gap-1 mt-2">
                <VChip
                  v-for="tag in articulo.tags"
                  :key="tag"
                  size="x-small"
                  color="grey-lighten-3"
                  class="text-caption"
                >
                  {{ tag }}
                </VChip>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="article-action">
            <VBtn
              v-if="articulo.link"
              :href="articulo.link"
              target="_blank"
              variant="solo"
              size="small"
              color="primary"
              class="d-none d-sm-flex"
            >
              <VIcon start icon="tabler-external-link" size="16" class="me-1" />
              VER ARTÍCULO
            </VBtn>
            <VBtn
              v-if="articulo.link"
              :href="articulo.link"
              target="_blank"
              variant="solo"
              size="small"
              color="primary"
              icon
              class="d-sm-none"
            >
              <VIcon icon="tabler-external-link" size="16" />
            </VBtn>
            <VBtn
              v-else
              disabled
              variant="text"
              size="small"
              color="grey-lighten-1"
              class="d-none d-sm-flex"
            >
              <VIcon start icon="tabler-link-off" size="16" class="me-1" />
              NO DISPONIBLE
            </VBtn>
          </div>
        </div>
      </div>
    </div>
  </VCol>
</VRow>
  

  </div>
</template>

<script setup>import axios from 'axios'
import { onMounted, ref } from 'vue'

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

const itemsPerPage = 10
const currentPage = ref(1)
const totalPages = ref(0)
const mediosData = ref({}) // Datos por medio
const loadingMedioData = ref({}) // Estado de carga por medio
const medioCounts = ref({}) // Conteo real por medio


const urlRules = [
  v => !!v || 'La URL es requerida',
  v => /^(http|https):\/\/[^ "]+$/.test(v) || 'Ingrese una URL válida'
]

const mediosAgrupados = ref({})

const loadingMedioDetails = ref({}) // Para tracking del loading por medio
const medioDetalles = ref({}) // Para almacenar los detalles de cada medio
const medioPaginas = ref({}) // Para manejar la paginación por medio

// Función para cargar los detalles de un medio específico
const cargarDetallesMedio = async (medio, page = 1) => {
  try {
    loadingMedioDetails.value[medio] = true
    console.log(`Cargando página ${page} del medio ${medio}`)

    const response = await axios.get(`https://servicio-competencias.vercel.app/scrapper-rule/medio/${medio}`, {
      params: {
        page: page,
        limit: itemsPerPage
      }
    })

    console.log('Respuesta del servidor:', response.data)
    
    if (response.data && Array.isArray(response.data.data)) {
      // Actualizar los detalles del medio
      medioDetalles.value[medio] = response.data.data
      
      // Actualizar información de paginación para este medio
      medioPaginas.value[medio] = {
        currentPage: parseInt(response.data.page),
        totalPages: Math.ceil(response.data.total / itemsPerPage),
        total: response.data.total
      }

      console.log('Información de paginación actualizada:', medioPaginas.value[medio])
    }
  } catch (err) {
    console.error(`Error al cargar detalles del medio ${medio}:`, err)
    // En caso de error, inicializar con valores por defecto
    medioDetalles.value[medio] = []
    medioPaginas.value[medio] = {
      currentPage: 1,
      totalPages: 1,
      total: 0
    }
  } finally {
    loadingMedioDetails.value[medio] = false
  }
}

// Función para manejar el cambio de página por medio
const cambiarPaginaMedio = async (medio, newPage) => {
  console.log(`Cambiando a página ${newPage} del medio ${medio}`)
  if (medioPaginas.value[medio]?.currentPage !== newPage) {
    await cargarDetallesMedio(medio, newPage)
  }
}

// Función para manejar la expansión del acordeón
const handleAccordionChange = async (medio, isOpen) => {
  // Solo cargar si se está abriendo y no hay datos previos
  if (isOpen && !medioDetalles.value[medio]) {
    await cargarDetallesMedio(medio, 1)
  }
}


const obtenerNombreMedio = (key) => {
  // Maneja tanto el formato con punto como con guión
  return key.split(/[.-]/)[0].toLowerCase()
}

const obtenerSeccionPrincipal = (key) => {
  const partes = key.split(/[.-]/)
  if (partes.length === 1) return ''
  return partes[1]
}

const regresar = () => {
  // Resetear estados
  resetearTodo()
  url.value = ''
  cargarMedios(1)
}


const cargarMedios = async (page) => {
  loadingMedios.value = true
  mediosAgrupados.value = {} // Limpiar grupos actuales
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString()
    })
    
    console.log(`Cargando página ${page} con params:`, params.toString())
    
    const response = await axios.get(
      `https://servicio-competencias.vercel.app/scrapper-rule/all?${params.toString()}`
    )
    
    console.log('Datos recibidos:', response.data)
    
    if (response.data && Array.isArray(response.data.data)) {
      // Resetear todos los estados
      mediosData.value = {}
      loadingMedioData.value = {}
      medioCounts.value = {}
      
      // Agrupar por media_communication
      const grupos = {}
      response.data.data.forEach(item => {
        if (item && item.media_communication) {
          const nombreMedio = item.media_communication.trim().toLowerCase()
          if (!grupos[nombreMedio]) {
            grupos[nombreMedio] = []
          }
          grupos[nombreMedio].push(item)
        }
      })
      
      // Actualizar estados
      mediosAgrupados.value = grupos
      totalPages.value = Math.ceil(response.data.total / itemsPerPage)
      currentPage.value = page
      
      // Cargar conteos para cada medio
      Object.keys(grupos).forEach(medio => {
        cargarConteoMedio(medio)
      })
      
      console.log('Grupos actualizados:', Object.keys(grupos))
      console.log('Total páginas:', totalPages.value)
    }
  } catch (err) {
    console.error('Error al cargar medios:', err)
    mediosAgrupados.value = {}
  } finally {
    loadingMedios.value = false
  }
}

const cambiarPagina = async (newPage) => {
  console.log(`Forzando cambio a página ${newPage}`)
  await cargarMedios(newPage)
}

const cargarConteoMedio = async (medio) => {
  try {
    const url = `https://servicio-competencias.vercel.app/scrapper-rule/medio/${medio}`
    const response = await axios.get(url)
    
    if (response.data) {
      medioCounts.value[medio] = response.data.total
      console.log(`Conteo para ${medio}:`, response.data.total)
    }
  } catch (err) {
    console.error(`Error al cargar conteo de ${medio}:`, err)
  }
}

onMounted(async () => {
  await cargarMedios(1)
})

// Función para cargar datos de un medio específico
const cargarDatosMedio = async (medio) => {
  try {
    loadingMedioData.value[medio] = true
    
    const response = await axios.get(
      `https://servicio-competencias.vercel.app/scrapper-rule/medio/${medio}`,
      {
        params: {
          page: '1',
          limit: '100' // Cargar todos los datos del medio
        }
      }
    )
    
    if (response.data && Array.isArray(response.data.data)) {
      mediosData.value[medio] = response.data.data
      medioCounts.value[medio] = response.data.total // Actualizar el conteo
    }
  } catch (err) {
    console.error(`Error al cargar datos del medio ${medio}:`, err)
  } finally {
    loadingMedioData.value[medio] = false
  }
}

const handlePanelChange = async (medio) => {
  if (!mediosData.value[medio]) {
    await cargarDatosMedio(medio)
  }
}

const formatearTitulo = (key, medio) => {
  // Normalizar tanto el key como el medio para la comparación
  const keyNorm = key.trim().toLowerCase()
  const medioNorm = medio.trim().toLowerCase()

  // Si es la página principal
  if (keyNorm === medioNorm) {
    return 'Principal'
  }

  // Si tiene un punto (formato con subcategorías)
  if (key.includes('.')) {
    const [, ...partes] = key.split('.')
    return capitalizar(partes.join(' / '))
  }

  // Para el formato con guiones
  if (key.startsWith(medio)) {
    const seccion = key.substring(medio.length).replace(/^[-.]/, '')
    return capitalizar(seccion)
  }

  // Para otros casos
  return capitalizar(key.replace(medio, '').replace(/^[-.]/, ''))
}

const capitalizar = (texto) => {
  if (!texto) return ''
  return texto
    .split(/[-\/]/)
    .map(palabra => {
      palabra = palabra.trim()
      return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    })
    .join(' ')
}
const construirKey = (nombreMedio, path) => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '')
  
  if (!cleanPath) return nombreMedio
  
  const segments = cleanPath.split('/')
    .filter(s => s && !['categoria', 'category', 'categories', 'america'].includes(s.toLowerCase()))
  
  if (segments.length === 0) return nombreMedio
  
  return `${nombreMedio}-${segments.join('-')}`
}

const pegarURL = async () => {
  try {
    const texto = await navigator.clipboard.readText()
    url.value = texto
  } catch (err) {
    console.error('Error al pegar:', err)
    errorMessage.value = 'No se pudo acceder al portapapeles'
  }
}

const resetearTodo = () => {
  error.value = null
  success.value = null
  warning.value = null
  resultados.value = null
  errorMessage.value = ''
}

const limpiarMensajes = () => {
  error.value = null
  success.value = null
  warning.value = null
}

const analizarSitio = async () => {
  if (!urlRules.every(rule => rule(url.value) === true)) {
    error.value = 'Por favor ingrese una URL válida'
    return
  }

  loading.value = true
  resetearTodo()

  try {
    const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
      url: url.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    resultados.value = response.data
    verificarMedioGuardado(url.value)

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

const analizarMedioExistente = async (url) => {
  loading.value = true
  resetearTodo()

  try {
    const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
      url: url
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    resultados.value = response.data
    verificarMedioGuardado(url)
    warning.value = 'Este medio ya se encuentra registrado'
  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message || 
                 'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false
  }
}

const verificarMedioGuardado = (urlActual) => {
  try {
    // Normalizar la URL actual
    const urlNormalizada = new URL(urlActual).toString().toLowerCase()
    
    // Encontrar coincidencia exacta o coincidencia de dominio base
    const medioEncontrado = medios.value.find(medio => {
      if (!medio.url_communication) return false
      
      // Normalizar URL del medio guardado
      const urlMedio = new URL(medio.url_communication).toString().toLowerCase()
      
      // Verificar coincidencia exacta
      if (urlNormalizada === urlMedio) {
        return true
      }
      
      // Obtener dominios base para comparación
      const dominioActual = new URL(urlActual).hostname.replace('www.', '')
      const dominioMedio = new URL(medio.url_communication).hostname.replace('www.', '')
      
      // Verificar si es exactamente el mismo dominio y la misma ruta base
      return dominioActual === dominioMedio && 
             urlNormalizada.includes(urlMedio)
    })
    
    medioYaGuardado.value = !!medioEncontrado
    
    if (medioEncontrado) {
      warning.value = `Este medio ya se encuentra guardado con el nombre "${medioEncontrado.key}"`
    } else {
      warning.value = null
    }
  } catch (err) {
    console.error('Error al verificar medio guardado:', err)
    medioYaGuardado.value = false
    warning.value = null
  }
}

const guardarMedio = async () => {
  if (!resultados.value) return

  guardando.value = true
  limpiarMensajes()

  try {
    const urlObj = new URL(url.value)
    const nombreMedio = urlObj.hostname.replace('www.', '').split('.')[0]
    const key = construirKey(nombreMedio, urlObj.pathname)

    const bodyData = {
      key: key,
      medio: nombreMedio,
      url: url.value,                    // Cambiado de url_communication a url
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

    console.log('Enviando datos para guardar:', bodyData)

    const response = await axios.post('https://servicio-competencias.vercel.app/scrapper-rule/create', bodyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('Respuesta del servidor:', response.data)

    if (response.data) {
      if (response.data.resp === false) {
        // Si el servidor indica un error
        if (response.data.error) {
          error.value = response.data.error
        } else {
          warning.value = response.data.key ? 
            `Este medio ya se encuentra guardado con el nombre "${response.data.key}"` :
            'Este medio ya se encuentra guardado'
        }
      } else {
        // Si se guardó exitosamente
        success.value = `Medio ${key} guardado exitosamente`
        // Recargar la lista de medios
        await cargarMedios(1)
        // Limpiar cualquier warning previo
        warning.value = null
        // Resetear el flag de medio guardado
        medioYaGuardado.value = false
      }
    }
  } catch (err) {
    console.error('Error al guardar medio:', err)
    console.error('Detalles del error:', err.response?.data)
    
    if (err.response?.data?.mensaje) {
      error.value = err.response.data.mensaje
    } else if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Error al guardar el medio. Por favor intente nuevamente.'
    }
    // Limpiar warning en caso de error
    warning.value = null
  } finally {
    guardando.value = false
  }
}

onMounted(() => {
  cargarMedios(1)
})

// Función para obtener el nombre del autor del objeto
const getAuthorName = (author) => {
  if (!author) return '';
  
  // Si el autor es un string directo, retornarlo
  if (typeof author === 'string') return author;
  
  // Si es un objeto con propiedad name
  if (typeof author === 'object' && author.name) {
    return author.name;
  }
  
  // Si es un objeto pero está en formato string
  if (typeof author === 'object' && typeof author.toString === 'function') {
    try {
      const authorObj = JSON.parse(author.toString());
      return authorObj.name || '';
    } catch (e) {
      return author.toString();
    }
  }
  
  return '';
}

// Función para obtener el link del autor si existe
const getAuthorLink = (author) => {
  if (!author) return null;
  
  // Si es un objeto con propiedad link
  if (typeof author === 'object' && author.link) {
    return author.link;
  }
  
  // Si es un objeto pero está en formato string
  if (typeof author === 'object' && typeof author.toString === 'function') {
    try {
      const authorObj = JSON.parse(author.toString());
      return authorObj.link || null;
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

// Función para formatear la fecha de manera uniforme
const formatearFecha = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const fecha = new Date(timestamp);
    if (isNaN(fecha.getTime())) {
      // Si no es una fecha válida, intentar parsear otros formatos comunes
      const matches = timestamp.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (matches) {
        fecha = new Date(`${matches[3]}-${matches[2]}-${matches[1]}`);
      }
    }
    
    // Si tenemos una fecha válida, formatearla
    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '');
    }
    
    // Si no se puede parsear, devolver el timestamp original
    return timestamp;
  } catch (e) {
    return timestamp;
  }
}

// Función para procesar los tags del artículo
const getArticleTags = (tags) => {
  if (!tags) return [];
  
  // Si tags es un string, intentar parsearlo como JSON
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags);
    } catch (e) {
      return [tags]; // Si no es JSON válido, devolver como un solo tag
    }
  }
  
  // Si es un array, devolverlo directamente
  if (Array.isArray(tags)) {
    return tags;
  }
  
  // Si es un objeto, convertir sus valores en un array
  if (typeof tags === 'object') {
    return Object.values(tags).filter(tag => tag);
  }
  
  return [];
}

// Función para validar y limpiar el summary
const validateSummary = (summary) => {
  if (!summary) return '';
  
  // Verificar si el summary contiene el código de imageLoadError
  if (summary.trim().startsWith('function imageLoadError')) {
    return '';
  }
  
  return summary;
}

</script>

<style lang="scss" scoped>
.article-list {
    .article-item {
      .article-image {
        min-width: 60px;
        width: 60px;
      }
      
      .article-content {
        .text-subtitle-1 {
          font-size: 0.875rem;
        }
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

.custom-chip {
  font-size: 0.5rem !important;
  height: 16px !important;
  padding: 0 6px !important;
}

.pagination-custom {
  :deep(.v-pagination__item) {
    min-width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
}

.article-list {
  .article-item {
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.05);
    }

    .article-image {
      min-width: 80px;
      width: 80px;
      
      .image-container {
        aspect-ratio: 1;
        overflow: hidden;
      }
      
      .placeholder-image {
        width: 100%;
        height: 100%;
        aspect-ratio: 1;
        background-color: rgba(var(--v-theme-on-surface), 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        
        .v-icon {
          opacity: 0.5;
        }
      }
    }

    .article-content {
      min-width: 0;
      
      .description-text {
        display: -webkit-box;
        // -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .article-action {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
  }
}

@media (max-width: 600px) {
  .article-list {
    .article-item {
      .article-image {
        min-width: 60px;
        width: 60px;
      }
      
      .article-content {
        .text-subtitle-1 {
          font-size: 0.875rem;
        }
      }
    }
  }
}
</style>