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
              <VTextField v-model="url" placeholder="Ingrese URL a analizar (ej: https://www.eluniverso.com)"
                :rules="urlRules" :error-messages="errorMessage" hide-details="auto" class="mb-4">
                <!-- Icono de resetear -->
                <template v-slot:append-inner>
                  <VIcon v-if="url" icon="tabler-x" size="18" class="cursor-pointer" @click="url = ''" />
                </template>

                <!-- Icono de pegar -->
                <template v-slot:append>
                  <VIcon icon="tabler-clipboard" size="18" class="cursor-pointer" @click="pegarURL" />
                </template>
              </VTextField>
              <VBtn type="submit" :loading="loading" :disabled="loading" color="primary" block>
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
            <VAlert v-if="error" type="error" variant="tonal" closable class="mb-4 w-100" @click:close="error = null">
              <span class="text-caption">{{ error }}</span>
            </VAlert>

            <VAlert v-if="success" type="success" variant="tonal" closable class="mb-4 w-100"
              @click:close="success = null">
              <span class="text-caption">{{ success }}</span>
            </VAlert>

            <VAlert v-if="warning" type="warning" variant="tonal" closable class="mb-4 w-100"
              @click:close="warning = null">
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
                <VBtn color="success" :loading="guardando"
                  :disabled="guardando || error || success || warning || medioYaGuardado" @click="guardarMedio"
                  class="px-6">
                  <VIcon start icon="tabler-device-floppy" size="18" class="me-2" />
                  {{ guardando ? 'Guardando...' : 'GUARDAR MEDIO' }}
                </VBtn>

                <!-- Nuevo botón de regreso -->
                <VBtn variant="text" color="primary" class="mt-2" @click="regresar">
                  <VIcon start icon="tabler-arrow-left" size="18" class="me-2" />
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
                <VExpansionPanel v-for="(grupo, medio) in mediosAgrupados" :key="medio"
                  @click="handlePanelChange(medio)">
                  <VExpansionPanelTitle>
                    <div class="d-flex align-center">
                      <span class="text-capitalize">{{ medio }}</span>
                      <VChip color="grey-lighten-2" size="x-small" class="ms-2 custom-chip">
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
                      <VListItem v-for="item in mediosData[medio]" :key="item._id"
                        :title="formatearTitulo(item.key, medio)" class="mb-2 border-b">
                        <template v-slot:append>
                          <div class="d-flex gap-2">
                            <VBtn icon variant="text" color="primary" :href="item.url_communication" target="_blank"
                              size="small">
                              <VIcon icon="tabler-external-link" size="18" />
                            </VBtn>
                            <VBtn icon variant="text" color="primary"
                              @click="analizarMedioExistente(item.url_communication)" size="small">
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
             <!-- Paginación principal -->
<div v-if="totalPages > 1" class="d-flex flex-column align-center mt-4 gap-2">
  <div class="d-flex align-center justify-space-between w-100 mb-2">
    <span class="text-caption">Mostrando página {{ currentPage }} de {{ totalPages }}</span>
    <span class="text-caption">{{ Object.keys(mediosAgrupados).length }} medios por página</span>
  </div>
  <VPagination 
  :model-value="currentPage"
  :length="totalPages" 
  :total-visible="5"
  :disabled="loadingMedios" 
  @update:model-value="cambiarPagina" 
  color="primary"
  class="pagination-custom" />
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
          <div v-for="(articulo, index) in resultados.articles" :key="index" class="article-item">
            <div class="d-flex align-items-start gap-2 py-2 border-b">

              <div class="article-image">
                <div class="image-container rounded overflow-hidden">
                  <VImg v-if="articulo.image" :src="articulo.image" :alt="articulo.title || 'Imagen del artículo'"
                    width="50" height="50" cover class="rounded">
                    <template v-slot:placeholder>
                      <div class="d-flex align-items-center justify-content-center h-100 bg-light">
                        <VIcon icon="tabler-photo" size="20" class="text-medium-emphasis" />
                      </div>
                    </template>
                  </VImg>
                  <div v-else class="placeholder-image d-flex align-items-center justify-content-center bg-light"
                    style="height: 50px; width: 50px;">
                    <VIcon icon="tabler-photo" size="20" class="text-medium-emphasis" />
                  </div>
                </div>
              </div>

              <!-- Contenido del artículo -->
              <div class="article-content flex-grow-1 min-w-0">

                <!-- Metadatos en línea -->
                <div class="metadata-container gap-2">
                  <div class="">

                    <div class="article-meta d-flex align-center gap-2 mb-1">
                      <VChip v-if="articulo.category" color="info" size="x-small" class="text-uppercase metadata-item">
                        {{ articulo.category }}
                      </VChip>
                      <VChip v-else color="grey-lighten-1" size="x-small" class="text-uppercase metadata-item">
                        Sin categoría
                      </VChip>

                      <VChip v-if="loadingMetadata" size="x-small" color="grey">
                        <VIcon start icon="tabler-loader-2" class="loading-spin" size="12" />
                        Cargando...
                      </VChip>

                      <div v-else class=" gap-2 grupoTopInfo">
                        <div class="d-flex align-center gap-2">
                          
                          <span v-if="articulo.fechaPublicacion || articulo.timestamp" class="text-caption text-medium-emphasis metadata-item">
                          <!-- Para El Telégrafo  -->
                          <template v-if="articulo.source === 'El Telégrafo' || (articulo.link && articulo.link.includes('eltelegrafo'))">
                              {{ obtenerFechaActual() }} {{ articulo.timestamp || articulo.fechaPublicacion }}
                            </template>
                          <!-- otros medios  -->
                          <template v-else>
                            {{ formatearFecha(articulo.fechaPublicacion || articulo.timestamp) }}
                          </template>
                        </span>
                          <VChip v-if="articulo.seccion" size="x-small">{{ articulo.seccion }}</VChip>
                          <div v-if="articulo.autor" class="autor-ec" title="Autor">
                            <VIcon icon="tabler-user" size="15" /> <small>{{ articulo.autor }}</small>
                          </div>
                          <div v-if="articulo.tipo" class="article-type-ec" title="Tipo de artículo">
                            <VIcon icon="tabler-article" size="15" /> <small>{{ articulo.tipo }}</small>
                          </div>
                        </div>


                        <div v-if="articulo.keywords">
                          <VChip v-for="(keyword, index) in (Array.isArray(articulo.keywords) ? articulo.keywords : (typeof articulo.keywords === 'string' ? articulo.keywords.split(',') : [])).filter(Boolean).slice(0, 2)" :key="keyword"

                            size="x-small" class="mr-2" variant="outlined" color="secondary">
                            {{ keyword.trim() }}
                          </VChip>

                          <VMenu v-if="(Array.isArray(articulo.keywords) ? articulo.keywords : (typeof articulo.keywords === 'string' ? articulo.keywords.split(',') : [])).filter(Boolean).length > 2" class="bloqueToogle"
                            :close-on-content-click="false">
                            <template v-slot:activator="{ props }">
                              <VChip size="x-small" variant="outlined" color="secondary" v-bind="props">
                                +{{ articulo.keywords.split(',').length - 2 }}
                              </VChip>
                            </template>
                            <VList density="compact" class="pa-2">
                              <template v-for="keyword in articulo.keywords.split(',').slice(2)" :key="keyword">
                                <VChip size="x-small" variant="outlined" color="secondary" class="ma-1">
                                  {{ keyword.trim() }}
                                </VChip>
                              </template>
                            </VList>
                          </VMenu>




                        </div>
                      </div>

                    </div>


                  </div>





                </div>

                <!-- Título -->
                <h6 class="text-subtitle-1 mb-1 text-truncate font-weight-medium titumovil"
                  :title="articulo.title || 'Título no disponible'">
                  {{ articulo.title || 'Título no disponible' }}
                </h6>

                <!-- Resumen -->
                <p v-if="validateSummary(articulo.summary)"
                  class="text-body-2 text-medium-emphasis mt-1 mb-0 d-none d-sm-block description-text"
                  :title="validateSummary(articulo.summary)">
                  {{ validateSummary(articulo.summary) }}
                </p>
                <p v-else
                  class="text-body-2 text-medium-emphasis mt-1 mb-0 d-none d-sm-block description-text fst-italic">
                  Resumen no disponible
                </p>
              </div>

              <!-- Botón de acción -->
              <div class="article-action ms-2">
                <!-- Botón omitir contenido -->
                  <VBtn @click="omitirContenido(articulo)" variant="text" size="small" color="error" icon title="Omitir contenido">
                    <VIcon icon="tabler-file-x" size="16" />
                  </VBtn>
                  
                  <!-- Botón ver artículo -->
                  <VBtn v-if="articulo.link" :href="articulo.link" target="_blank" variant="text" size="small" color="primary" icon title="Ver artículo">
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
const loadingMetadata = ref(false)
const itemsPerPage = 10
const currentPage = ref(1)
const totalPages = ref(0)

const medioCounts = ref({}) // Conteo real por medio

const mediosData = ref({})
const loadingMedioData = ref({})
const expandedPanels = ref([])


const blacklistsByMedia = ref({});
const loadingBlacklist = ref(false);


const urlRules = [
  v => !!v || 'La URL es requerida',
  v => {
   
    const urlConProtocolo = /^(http|https):\/\//i.test(v) ? v : `https://${v}`;
    return /^(http|https):\/\/[^ "]+$/.test(urlConProtocolo) || 'Ingrese una URL válida';
  }
]

// Función q asegura el  https:// en una url
const asegurarHttps = (valor) => {
  if (!valor) return valor;
  
  // Si ya comienza con http:// o https://, no hacer nada
  if (/^(http|https):\/\//i.test(valor)) {
    return valor;
  }
  
  // Agregar https:// al inicio
  return `https://${valor}`;
}

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
  if (!medioPaginas.value[medio] || medioPaginas.value[medio].currentPage !== newPage) {
    loadingMedioData.value[medio] = true
    try {
      await cargarDatosMedio(medio, newPage)
    } catch (error) {
      console.error(`Error al cambiar página del medio ${medio}:`, error)
    } finally {
      loadingMedioData.value[medio] = false
    }
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


// Función principal para cargar medios
const cargarMedios = async (page) => {
  loadingMedios.value = true
  mediosAgrupados.value = {}

  try {
    // para conocer el total de medios
    const countResponse = await axios.get(
      'https://servicio-competencias.vercel.app/scrapper-rule/all',
      {
        params: {
          page: '1',
          limit: '1000' 
        }
      }
    )
    
    // Obtener la lista única de medios
    const todosLosMedios = []
    if (countResponse.data && Array.isArray(countResponse.data.data)) {
      // Extraer los nombres de medios únicos
      const mediosUnicos = new Set()
      countResponse.data.data.forEach(item => {
        if (item && item.media_communication) {
          mediosUnicos.add(item.media_communication.trim().toLowerCase())
        }
      })

      todosLosMedios.push(...Array.from(mediosUnicos).sort())
    }
    
    // medios mostrar en esta página
    const totalMedios = todosLosMedios.length
    const mediosPorPagina = 10
    const totalPaginas = Math.ceil(totalMedios / mediosPorPagina)
    
    // Calculamos medios a mostrar
    const inicio = (page - 1) * mediosPorPagina
    const fin = Math.min(inicio + mediosPorPagina, totalMedios)
    const mediosEnEstaPagina = todosLosMedios.slice(inicio, fin)
    
    console.log(`Total medios: ${totalMedios}, Mostrando página ${page} con ${mediosEnEstaPagina.length} medios`)
    
   
    const response = await axios.get(
      'https://servicio-competencias.vercel.app/scrapper-rule/all',
      {
        params: {
          page: '1',
          limit: '1000' // De nuevo un número grande
        }
      }
    )
    
    if (response.data && Array.isArray(response.data.data)) {
      // Filtramos solo los medios que corresponden a esta página
      const grupos = {}
      
      response.data.data.forEach(item => {
        if (item && item.media_communication) {
          const nombreMedio = item.media_communication.trim().toLowerCase()
          
          if (mediosEnEstaPagina.includes(nombreMedio)) {
            if (!grupos[nombreMedio]) {
              grupos[nombreMedio] = []
            }
            grupos[nombreMedio].push(item)
          }
        }
      })
      
      mediosAgrupados.value = grupos
      totalPages.value = totalPaginas
      currentPage.value = page
      
      console.log(`Paginación actualizada: página ${page} de ${totalPaginas}, mostrando ${Object.keys(grupos).length} medios`)
    }
  } catch (err) {
    console.error('Error al cargar medios:', err)
    mediosAgrupados.value = {}
  } finally {
    loadingMedios.value = false
  }
}

const cambiarPagina = async (newPage) => {
  console.log(`Cambiando a página ${newPage}`)
  currentPage.value = newPage
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
const cargarDatosMedio = async (medio, page = 1) => {
  try {
    loadingMedioData.value[medio] = true

    console.log(`Cargando datos del medio ${medio}, página ${page}`)
    
    const response = await axios.get(
      `https://servicio-competencias.vercel.app/scrapper-rule/medio/${medio}`,
      {
        params: {
          page: page.toString(),
          limit: itemsPerPage.toString()
        }
      }
    )

    if (response.data && Array.isArray(response.data.data)) {
      mediosData.value[medio] = response.data.data
      medioCounts.value[medio] = response.data.total
      
      // Actualizar información de paginación para este medio
      if (!medioPaginas.value[medio]) {
        medioPaginas.value[medio] = {}
      }
      
      medioPaginas.value[medio] = {
        currentPage: parseInt(page),
        totalPages: Math.ceil(response.data.total / itemsPerPage),
        total: response.data.total
      }
      
      console.log(`Medio ${medio}: página ${page} de ${medioPaginas.value[medio].totalPages}, total: ${response.data.total}`)
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
    // Aplicamos el asegurarHttps al texto pegado
    url.value = asegurarHttps(texto)
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
  url.value = asegurarHttps(url.value)
  
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

    // Set initial results immediately
    resultados.value = response.data
    verificarMedioGuardado(url.value)

    if (medioYaGuardado.value) {
      warning.value = 'Este medio ya se encuentra registrado'
    }
    loadingMetadata.value = true

    // Process additional data in background
    const articleLinks = response.data.articles.map(article => article.link).filter(Boolean)

    const batchSize = 10
    const enrichedArticles = [...response.data.articles]
    let processedCount = 0

    // Process batches sequentially
    for (let i = 0; i < articleLinks.length; i += batchSize) {
      const batchLinks = articleLinks.slice(i, i + batchSize)
      
      try {
        const batchResponse = await axios.post(
          'https://servicio-competencias.vercel.app/multiple-articles',
          { urls: batchLinks },
          { headers: { 'Content-Type': 'application/json' } }
        )

        if (batchResponse.data.resp && Array.isArray(batchResponse.data.data)) {
          batchResponse.data.data.forEach(additionalData => {
            if (additionalData.success) {
              const articleIndex = enrichedArticles.findIndex(article => article.link === additionalData.url)
              if (articleIndex !== -1) {
                enrichedArticles[articleIndex] = {
                  ...enrichedArticles[articleIndex],
                  tipo: additionalData.article?.tipo || 'Tipo no disponible',
                  autor: additionalData.article?.autor || 'Autor no disponible',
                  keywords: additionalData.article?.keywords || 'keywords no disponibles',
                  metodo: additionalData.article?.metodo || '',
                  seccion: additionalData.article?.seccion || 'Seccion no disponible',
                  subseccion: additionalData.article?.subseccion || '',
                  fechaPublicacion: additionalData.article?.fechaPublicacion || 'Fecha no disponible'
                }
              }
            }
          })

          // Update processed count
          processedCount += batchResponse.data.data.length

          // Update results after each batch with both processed and remaining articles
          resultados.value = {
            ...response.data,
            articles: enrichedArticles.map((article, index) => {
              if (index < processedCount) {
                return article
              }
              // Keep original article data for unprocessed ones
              return response.data.articles[index]
            })
          }
        }
      } catch (err) {
        console.error(`Error processing batch ${i / batchSize + 1}:`, err)
      }
    }


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

  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message ||
      'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false
    loadingMetadata.value = false
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


    console.log("MEDIO GUARDADO");
    warning.value = 'Este medio ya se encuentra registrado'


    loadingMetadata.value = true

    // Process additional data in background
    const articleLinks = response.data.articles.map(article => article.link).filter(Boolean)
    const batchSize = 10
    const enrichedArticles = [...response.data.articles]
    let processedCount = 0

    // Process batches sequentially
    for (let i = 0; i < articleLinks.length; i += batchSize) {
      const batchLinks = articleLinks.slice(i, i + batchSize)
      
      try {
        const batchResponse = await axios.post(
          'https://servicio-competencias.vercel.app/multiple-articles',
          { urls: batchLinks },
          { headers: { 'Content-Type': 'application/json' } }
        )

        if (batchResponse.data.resp && Array.isArray(batchResponse.data.data)) {
          batchResponse.data.data.forEach(additionalData => {
            if (additionalData.success) {
              const articleIndex = enrichedArticles.findIndex(article => article.link === additionalData.url)
              if (articleIndex !== -1) {
                enrichedArticles[articleIndex] = {
                  ...enrichedArticles[articleIndex],
                  tipo: additionalData.article?.tipo || 'Tipo no disponible',
                  autor: additionalData.article?.autor || 'Autor no disponible',
                  keywords: additionalData.article?.keywords || 'keywords no disponibles',
                  metodo: additionalData.article?.metodo || '',
                  seccion: additionalData.article?.seccion || 'Seccion no disponible',
                  subseccion: additionalData.article?.subseccion || '',
                  fechaPublicacion: additionalData.article?.fechaPublicacion || 'Fecha no disponible'
                }
              }
            }
          })

          // Update processed count
          processedCount += batchResponse.data.data.length

          // Update results after each batch with both processed and remaining articles
          resultados.value = {
            ...response.data,
            articles: enrichedArticles.map((article, index) => {
              if (index < processedCount) {
                return article
              }
              // Keep original article data for unprocessed ones
              return response.data.articles[index]
            })
          }
        }
      } catch (err) {
        console.error(`Error processing batch ${i / batchSize + 1}:`, err)
      }
    }


    // Determinar el dominio para la blacklist
    try {
      const urlObj = new URL(url);
      const dominio = urlObj.hostname.replace('www.', '').split('.')[0].toLowerCase();
      
      // Limpiar la caché de blacklist para este dominio
      blacklistsByMedia.value[dominio] = null;
      
      // Filtrar artículos en blacklist (esto incluye la carga de la blacklist)
      await filtrarArticulosEnBlacklist();
    } catch (err) {
      console.error('Error al procesar la blacklist:', err);
    }

  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message ||
      'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false
    loadingMetadata.value = false
  }
}
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

onMounted(() => {
  cargarMedios(1)
})

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


const obtenerFechaActual = () => {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const anio = hoy.getFullYear();
  return `${dia}/${mes}/${anio}`;
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

    // formatea si esvalida
    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '');
    }

    
    return timestamp;
  } catch (e) {
    return timestamp;
  }
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

</script>

<style lang="scss" scoped>
// Variables
$border-color: rgba(var(--v-border-color), var(--v-border-opacity));
$background-color: rgb(var(--v-theme-background));
$mobile-breakpoint: 600px;

.v-menu .v-overlay__content>.v-card,
.v-menu .v-overlay__content>.v-sheet,
.v-menu .v-overlay__content>.v-list {
  max-width: 300px;
}

.bloqueToogle .v-theme--light .text-secondary {
  color: #2e2e2e !important;
}

.loading-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}


.v-theme--light.v-menu .v-overlay__content>.v-card,
.v-theme--light.v-menu .v-overlay__content>.v-sheet,
.v-theme--light.v-menu .v-overlay__content>.v-list {
  margin-top: 10px;
  border: 1px solid #ddd;
}

.grupoTopInfo {
  display: flex;
  width: 100%;
  align-items: center;
}

@media (max-width: 991px) {
  .grupoTopInfo {
    flex-direction: column;
    align-items: flex-start;
  }
}

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

  >[class*='col'] {
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

.v-icon.size-18 {
  font-size: 16px !important;
}

// Contenedor de metadatos
.metadata-container {
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
    }

    .text-caption {
      font-size: 0.65rem !important;
    }
  }
}

// Lista de artículos
.article-list {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;

  .article-item {
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
    }
  }
}

// Media queries móvil
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
</style>
