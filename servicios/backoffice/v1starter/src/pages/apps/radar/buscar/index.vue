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
                placeholder="Ingrese URL a analizar (ej: www.eluniverso.com)"
                :rules="urlRules"
                :error-messages="errorMessage"
                hide-details="auto"
                class="mb-4"
                @blur="normalizarURLCampo"
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
      <VExpansionPanels v-model="expandedPanels">
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
            <!-- Estado de carga -->
            <div v-if="loadingMedioData[medio]" class="d-flex justify-center py-4">
              <VProgressCircular indeterminate color="primary" />
            </div>
            
            <!-- Mostrar datos -->
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

    <!-- Lista de artículos -->
<VRow v-if="resultados && !error">
  <VCol cols="12">
    <div class="article-list">
      <div 
        v-for="(articulo, index) in resultados.articles" 
        :key="index"
        class="article-item border-b"
      >
        <!-- Imagen del artículo (izquierda) -->
        <div class="article-thumbnail">
          <img 
            v-if="articulo.image" 
            :src="articulo.image" 
            :alt="articulo.title" 
            class="article-image"
          />
          <div v-else class="article-image-placeholder">
            <VIcon icon="tabler-photo" size="20" />
          </div>
        </div>

        <!-- Contenido del artículo (centro) -->
        <div class="article-content">
          <!-- Categoría -->
          <div class="article-meta">
            <span v-if="articulo.category" class="article-category">
              {{ articulo.category }}
            </span>
            <span v-else class="article-category muted">
              SIN CATEGORÍA
            </span>

            <!-- Fecha -->
            <span v-if="articulo.timestamp" class="article-date">
              {{ formatearFecha(articulo.timestamp) }}
            </span>
            <span v-else class="article-date muted">
              Fecha no disponible
            </span>

            <!-- Autor si está disponible -->
            <span v-if="getAuthorName(articulo.author)" class="article-author">
              <VIcon icon="tabler-user" size="12" class="me-1" />
              {{ getAuthorName(articulo.author) }}
            </span>

            <!-- Tipo de contenido (article) -->
            <span class="article-type">
              <VIcon icon="tabler-file-text" size="12" class="me-1" />
              article
            </span>
          </div>

          <!-- Título del artículo -->
          <h3 class="article-title">{{ articulo.title || 'Título no disponible' }}</h3>

          <!-- Resumen -->
          <p v-if="validateSummary(articulo.summary)" class="article-summary">
            {{ validateSummary(articulo.summary) }}
          </p>
          <p v-else class="article-summary muted">
            Resumen no disponible
          </p>
        </div>

        <!-- Botones de acción (derecha) -->
        <div class="article-actions">
          <!-- Botón omitir contenido -->
          <button 
            @click="omitirContenido(articulo)" 
            class="action-button omit-button"
            title="Omitir contenido"
          >
            <VIcon icon="tabler-x" size="16" />
          </button>
          
          <!-- Botón ver artículo -->
          <a 
            v-if="articulo.link" 
            :href="articulo.link" 
            target="_blank" 
            class="action-button view-button"
            title="Ver artículo"
          >
            <VIcon icon="tabler-external-link" size="16" />
          </a>
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

const medioCounts = ref({}) // Conteo real por medio

const mediosData = ref({}) 
const loadingMedioData = ref({}) 
const expandedPanels = ref([]) 


const urlRules = [
  v => !!v || 'La URL es requerida',
  v => {
    // Normalizar la URL temporalmente para la validación
    const normalizada = normalizarURL(v)
    return /^(http|https):\/\/[^ "]+$/.test(normalizada) || 'Ingrese una URL válida'
  }
]

const mediosAgrupados = ref({})

const loadingMedioDetails = ref({}) 
const medioDetalles = ref({}) 
const medioPaginas = ref({}) 

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
  mediosAgrupados.value = {}
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString()
    })
    
    const response = await axios.get(
      `https://servicio-competencias.vercel.app/scrapper-rule/all?${params.toString()}`
    )
    
    if (response.data && Array.isArray(response.data.data)) {
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
      
      mediosAgrupados.value = grupos
      totalPages.value = Math.ceil(response.data.total / itemsPerPage)
      currentPage.value = page
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
          limit: itemsPerPage
        }
      }
    )
    
    if (response.data && Array.isArray(response.data.data)) {
      mediosData.value[medio] = response.data.data
      medioCounts.value[medio] = response.data.total
    }
  } catch (err) {
    console.error(`Error al cargar datos del medio ${medio}:`, err)
    mediosData.value[medio] = []
  } finally {
    loadingMedioData.value[medio] = false
  }
}
// Función para manejar la expansión del acordeón
const handlePanelChange = async (medio) => {
  // Si el panel se está expandiendo y no tenemos los datos
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

const normalizarURL = (urlInput) => {
  if (!urlInput) return ''
  
  let urlNormalizada = urlInput.trim()
  
  // Si la URL no comienza con http:// o https://, añadir https://
  if (!urlNormalizada.match(/^https?:\/\//i)) {
    urlNormalizada = 'https://' + urlNormalizada
  }
  
  return urlNormalizada
}


const analizarSitio = async () => {
  // Normalizar la URL antes de validar
  url.value = normalizarURL(url.value);
  
  // La URL ya está normalizada, así que debería pasar la validación
  if (!urlRules.every(rule => rule(url.value) === true)) {
    error.value = 'Por favor ingrese una URL válida';
    return;
  }

  loading.value = true;
  resetearTodo();

  try {
    const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
      url: url.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    resultados.value = response.data;
    
    // Determinar el dominio para la blacklist
    try {
      const urlObj = new URL(url.value);
      const dominio = urlObj.hostname.replace('www.', '').split('.')[0].toLowerCase();
      
      // Limpiar la caché de blacklist para este dominio y cargar fresca
      blacklistsByMedia.value[dominio] = null;
      
      // Filtrar artículos en blacklist (esto incluye la carga de la blacklist)
      await filtrarArticulosEnBlacklist();
    } catch (err) {
      console.error('Error al procesar la blacklist:', err);
    }
    
    verificarMedioGuardado(url.value);

    if (medioYaGuardado.value) {
      warning.value = 'Este medio ya se encuentra registrado';
    }
  } catch (err) {
    console.error('Error:', err);
    error.value = err.response?.data?.message || 
                 'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false;
  }
};

const normalizarURLCampo = () => {
  if (url.value) {
    url.value = normalizarURL(url.value)
  }
}

const analizarMedioExistente = async (urlMedio) => {
  loading.value = true;
  resetearTodo();

  try {
    const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
      url: urlMedio
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    resultados.value = response.data;
    url.value = urlMedio; 
    
    // Determinar el dominio para la blacklist
    try {
      const urlObj = new URL(urlMedio);
      const dominio = urlObj.hostname.replace('www.', '').split('.')[0].toLowerCase();
      
      // Limpiar la caché de blacklist para este dominio
      blacklistsByMedia.value[dominio] = null;
      
      // Filtrar artículos en blacklist (esto incluye la carga de la blacklist)
      await filtrarArticulosEnBlacklist();
    } catch (err) {
      console.error('Error al procesar la blacklist:', err);
    }
    
    verificarMedioGuardado(urlMedio);
    warning.value = 'Este medio ya se encuentra registrado';
  } catch (err) {
    console.error('Error:', err);
    error.value = err.response?.data?.message || 
                 'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false;
  }
};

const verificarMedioGuardado = (urlActual) => {
  try {
    const urlNormalizada = new URL(urlActual).toString().toLowerCase()
    const medioEncontrado = medios.value.find(medio => {
      if (!medio.url_communication) return false
      
      const urlMedio = new URL(medio.url_communication).toString().toLowerCase()
      
      if (urlNormalizada === urlMedio) {
        return true
      }
      
      const dominioActual = new URL(urlActual).hostname.replace('www.', '')
      const dominioMedio = new URL(medio.url_communication).hostname.replace('www.', '')
      
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

    console.log('Enviando datos para guardar:', bodyData)

    const response = await axios.post('https://servicio-competencias.vercel.app/scrapper-rule/create', bodyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('Respuesta del servidor:', response.data)

    if (response.data) {
      if (response.data.resp === false) {
        if (response.data.error) {
          error.value = response.data.error
        } else {
          warning.value = response.data.key ? 
            `Este medio ya se encuentra guardado con el nombre "${response.data.key}"` :
            'Este medio ya se encuentra guardado'
        }
      } else {
        success.value = `Medio ${key} guardado exitosamente`
        await cargarMedios(1)
        warning.value = null
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

    warning.value = null
  } finally {
    guardando.value = false
  }
}


// Función para obtener el nombre del autor del objeto
const getAuthorName = (author) => {
  if (!author) return '';

  if (typeof author === 'string') return author;

  if (typeof author === 'object' && author.name) {
    return author.name;
  }
  
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
  

  if (typeof author === 'object' && author.link) {
    return author.link;
  }
  
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

// Referencias al estado actual
const blacklistsByMedia = ref({});
const loadingBlacklist = ref(false);

// Función para cargar la blacklist de un medio específico
const cargarBlacklist = async (dominio) => {
  try {
    loadingBlacklist.value = true;
    const response = await axios.get(`https://services.ecuavisa.com/gestor/competencias/scrappin/utilidades/config.php?api=web&key=${dominio}`);
    
    console.log('Blacklist del medio:', response.data);
    
    if (response.data && response.data.blacklist) {
      blacklistsByMedia.value[dominio] = response.data.blacklist;
    } else {
      blacklistsByMedia.value[dominio] = [];
    }
    
    return blacklistsByMedia.value[dominio];
  } catch (err) {
    console.error(`Error al cargar la blacklist del medio ${dominio}:`, err);
    blacklistsByMedia.value[dominio] = [];
    return [];
  } finally {
    loadingBlacklist.value = false;
  }
};

// Función para verificar si un artículo está en la blacklist
const estaEnBlacklist = (articulo, dominio) => {
  if (!blacklistsByMedia.value[dominio] || !Array.isArray(blacklistsByMedia.value[dominio])) {
    return false;
  }
  
  // Compara por URL o por título (ignora mayúsculas/minúsculas)
  return blacklistsByMedia.value[dominio].some(item => {
    // Comparación por link
    if (item.link && articulo.link) {
      const linkItem = item.link.toLowerCase().trim();
      const linkArticulo = articulo.link.toLowerCase().trim();
      
      // Comparación exacta o si uno está contenido en el otro
      if (linkItem === linkArticulo || linkItem.includes(linkArticulo) || linkArticulo.includes(linkItem)) {
        return true;
      }
    }
    
    // Comparación por título
    if (item.titulo && articulo.title) {
      const tituloItem = item.titulo.toLowerCase().trim();
      const tituloArticulo = articulo.title.toLowerCase().trim();
      
      if (tituloItem === tituloArticulo) {
        return true;
      }
    }
    
    return false;
  });
};

// Función para omitir contenido mejorada
const omitirContenido = async (articulo) => {
  try {
    // Extraer el dominio de la URL para usarlo como key
    const urlObj = new URL(articulo.link || url.value);
    const dominio = urlObj.hostname.replace('www.', '').split('.')[0].toLowerCase();
    
    // Si no tenemos la blacklist de este medio, la cargamos
    if (!blacklistsByMedia.value[dominio]) {
      await cargarBlacklist(dominio);
    }
    
    // Verificar si el artículo ya está en la blacklist (silenciosamente)
    if (estaEnBlacklist(articulo, dominio)) {
      console.log('Artículo ya está en blacklist, solo lo ocultamos');
      // No mostramos mensaje, solo lo eliminamos de la lista actual
    }
    
    // Preparar el nuevo item para la blacklist
    const nuevoItem = {
      titulo: articulo.title || 'Título no disponible',
      link: articulo.link || url.value
    };
    
    // Solo enviamos la petición si no está ya en la blacklist
    if (!estaEnBlacklist(articulo, dominio)) {
      let endpoint;
      let payload;
      
      // Si ya existe una blacklist para este medio, usamos update
      if (blacklistsByMedia.value[dominio] && blacklistsByMedia.value[dominio].length > 0) {
        endpoint = 'https://services.ecuavisa.com/gestor/competencias/scrappin/utilidades/config.php?api=update';
        
        // Añadir el nuevo item a la blacklist existente
        const blacklistActualizada = [...blacklistsByMedia.value[dominio], nuevoItem];
        
        payload = {
          key: dominio,
          estructura: {
            blacklist: blacklistActualizada
          }
        };
      } else {
        // Si no existe, usamos insert
        endpoint = 'https://services.ecuavisa.com/gestor/competencias/scrappin/utilidades/config.php?api=insert';
        
        payload = {
          key: dominio,
          estructura: {
            blacklist: [nuevoItem]
          }
        };
      }
      
      console.log('Omitiendo contenido:', payload);
      console.log('Usando endpoint:', endpoint);
      
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      // Actualizar la blacklist local para futuras verificaciones
      if (!blacklistsByMedia.value[dominio]) {
        blacklistsByMedia.value[dominio] = [];
      }
      blacklistsByMedia.value[dominio].push(nuevoItem);
    }
    
    // Siempre eliminamos el artículo de la lista de resultados
    if (resultados.value && resultados.value.articles) {
      resultados.value.articles = resultados.value.articles.filter(a => 
        a !== articulo // Comparamos la referencia directa del objeto
      );
      
      // Actualizar el contador de resultados
      if (resultados.value.total !== undefined) {
        resultados.value.total = resultados.value.articles.length;
      }
    }
    
    // Mostrar mensaje de éxito (solo si realmente se añadió a la blacklist)
    if (!estaEnBlacklist(articulo, dominio)) {
      success.value = `Contenido omitido exitosamente`;
      
      // Limpiar el mensaje después de unos segundos
      setTimeout(() => {
        if (success.value) {
          success.value = null;
        }
      }, 2000);
    }
    
  } catch (err) {
    console.error('Error al omitir contenido:', err);
    error.value = 'Error al omitir contenido. Por favor intente nuevamente.';
    
    // Limpiar el mensaje de error después de unos segundos
    setTimeout(() => {
      if (error.value) {
        error.value = null;
      }
    }, 2000);
  }
};

// Función para filtrar artículos que están en blacklist
const filtrarArticulosEnBlacklist = async () => {
  if (!resultados.value || !resultados.value.articles || resultados.value.articles.length === 0) {
    return;
  }
  
  // Determinar el dominio del sitio actual
  let dominio;
  try {
    // Intentar obtener dominio de la URL del primer artículo
    if (resultados.value.articles[0] && resultados.value.articles[0].link) {
      const urlObj = new URL(resultados.value.articles[0].link);
      dominio = urlObj.hostname.replace('www.', '').split('.')[0].toLowerCase();
    } else {
      // Si no hay artículos con link, usar la URL actual
      const urlObj = new URL(url.value);
      dominio = urlObj.hostname.replace('www.', '').split('.')[0].toLowerCase();
    }
  } catch (err) {
    console.error('Error al obtener el dominio:', err);
    return;
  }
  
  // Cargar la blacklist fresca desde el servidor (no usar caché)
  await cargarBlacklist(dominio);
  
  // Si no hay blacklist, no hay nada que filtrar
  if (!blacklistsByMedia.value[dominio] || blacklistsByMedia.value[dominio].length === 0) {
    console.log('No hay blacklist para este medio, mostrando todos los artículos');
    return;
  }
  
  console.log(`Filtrando ${resultados.value.articles.length} artículos contra ${blacklistsByMedia.value[dominio].length} items en blacklist`);
  
  // Filtrar los artículos que están en la blacklist
  const articulosOriginales = resultados.value.articles.length;
  resultados.value.articles = resultados.value.articles.filter(articulo => {
    const enBlacklist = estaEnBlacklist(articulo, dominio);
    if (enBlacklist) {
      console.log('Artículo filtrado por blacklist:', articulo.title || articulo.link);
    }
    return !enBlacklist;
  });
  
  // Actualizar el contador si se filtraron artículos
  if (resultados.value.articles.length !== articulosOriginales) {
    resultados.value.total = resultados.value.articles.length;
    console.log(`Se filtraron ${articulosOriginales - resultados.value.articles.length} artículos de la blacklist, quedan ${resultados.value.total}`);
  }
};


onMounted(async () => {
  await cargarMedios(1);
  
  // Si hay una URL en la URL del navegador la analiza automáticamente
  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get('url');
  
  if (urlParam) {
    url.value = urlParam;
    await analizarSitio();
  }
});

</script>

<style lang="scss" scoped>
// Variables
$border-color: rgba(var(--v-border-color), var(--v-border-opacity));
$background-color: rgb(var(--v-theme-background));
$mobile-breakpoint: 600px;

// Mixins
@mixin mobile {
  @media (max-width: $mobile-breakpoint) {
    @content;
  }
}

@mixin no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

// Utilidades generales
.border-b {
  border-bottom: 1px solid $border-color;
}

.match-height {
  display: flex;
  flex-wrap: wrap;
  
  > [class*='col'] {
    display: flex;
  }
  
  .v-card {
    width: 100%;
  }
}

// Componentes base
.pagination-custom {
  :deep(.v-pagination__item) {
    min-width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }
}

.custom-chip {
  font-size: 0.5rem !important;
  height: 16px !important;
  padding: 0 6px !important;
}

.v-alert__content {
  width: max-content !important;
}

.v-icon {
  &.size-18 {
    font-size: 16px !important;
  }
}

// Contenedor de metadatos
.metadata-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap !important;
  gap: 8px !important;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px;
  min-height: 20px;
  @include no-scrollbar;

  .metadata-item {
    flex-shrink: 0;
    font-size: 0.75rem;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    
    .v-chip {
      height: 18px !important;
      padding: 0 6px !important;
    }

    &.text-caption {
      font-size: 0.75rem;
    }
  }

  span.metadata-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    
    .v-icon {
      margin-right: 2px;
    }
  }

  @include mobile {
    gap: 6px !important;
    
    .metadata-item {
      font-size: 0.65rem !important;
      
      .v-chip {
        height: 16px !important;
        padding: 0 4px !important;
      }
      
      .v-icon {
        font-size: 10px !important;
      }

      &.text-caption {
        font-size: 0.65rem !important;
      }
    }
  }
}

// Lista de artículos común
.article-list {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

// Estilos para article-item en el primer formato
.article-list .article-item {
  .d-flex {
    width: 100%;
    min-width: 0;
  }

  .article-image {
    min-width: 50px;
    width: 50px;
    
    .image-container {
      height: 50px;
    }

    .placeholder-image {
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $background-color;
      
      .v-icon {
        opacity: 0.6;
      }
    }
  }

  .article-content {
    min-width: 0;
    flex: 1;

    .text-subtitle-1 {
      font-size: 0.875rem;
      line-height: 1.2;
      margin-bottom: 4px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .text-caption {
      font-size: 0.75rem;
      line-height: 1;
    }

    .description-text {
      font-size: 0.8125rem;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      width: 100%;
    }

    .v-chip {
      height: 18px !important;
      font-size: 0.675rem;
      padding: 0 6px;
    }
  }

  .article-action {
    flex-shrink: 0;
    
    &.ms-2.d-flex {
      gap: 4px;
      
      @include mobile {
        gap: 2px;
      }
    }
  }
}

// Media queries móvil global
@include mobile {
  .titumovil {
    font-size: 0.75rem !important;
  }

  .d-flex.flex-column.flex-sm-row {
    gap: 16px;
  }

  .v-alert,
  .v-btn {
    width: 100% !important;
  }

  .article-list {
    padding: 0;
    
    .article-item {
      .d-flex {
        padding: 8px;
        gap: 8px;
      }

      .article-image {
        width: 40px;
        min-width: 40px;
        
        .image-container {
          height: 40px;
        }
      }

      .text-caption {
        font-size: 0.7rem;
      }

      .v-chip {
        height: 16px !important;
        padding: 0 4px !important;
      }
    }
  }
}

/* Estilos para el formato alternativo de lista de artículos */
.article-item {
  display: grid;
  grid-template-columns: 45px 1fr auto;
  gap: 12px;
  padding: 12px 0;
  align-items: start;
  position: relative;
}

/* Estilos para la miniatura alternativa */
.article-thumbnail {
  width: 45px;
  height: 45px;
  overflow: hidden;
  border-radius: 4px;
}

.article-image-placeholder,
.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-image-placeholder {
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

/* Estilos para el contenido alternativo */
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.article-category {
  color: #00bcd4;
  font-weight: 500;
  text-transform: uppercase;
}

.article-date, 
.article-author, 
.article-type {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 12px;
}

.article-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 4px;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-summary {
  font-size: 14px;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.muted {
  color: #999;
  font-style: italic;
}

/* Estilos para los botones de acción alternativos */
.article-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &.omit-button {
    color: #f44336;
  }
  
  &.view-button {
    color: #2196f3;
  }
}

/* Media queries para el formato alternativo */
@media (max-width: 768px) {
  .article-meta {
    gap: 6px;
    font-size: 11px;
  }
  
  .article-title {
    font-size: 14px;
  }
  
  .article-summary {
    display: none; /* Ocultar resumen en móvil */
  }
  
  .action-button {
    width: 28px;
    height: 28px;
  }
}
</style>