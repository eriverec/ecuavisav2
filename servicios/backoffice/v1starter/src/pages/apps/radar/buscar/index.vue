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
  <VCard v-else-if="!resultados" class="h-100">
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
  >
    <VExpansionPanelTitle>
      <div class="d-flex align-center">
        <span class="text-capitalize">{{ medio }}</span>
        <VChip
          color="grey-lighten-2"
          size="x-small"
          class="ms-2 custom-chip"
        >
          {{ grupo.length }}
        </VChip>
      </div>
    </VExpansionPanelTitle>
    <VExpansionPanelText>
      <VList>
        <VListItem
          v-for="item in grupo"
          :key="item._id"
          :title="formatearTitulo(item.key, item.media_communication)"
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
                <VIcon icon="tabler-eye" size="18" />
              </VBtn>
            </div>
          </template>
        </VListItem>
      </VList>
    </VExpansionPanelText>
  </VExpansionPanel>
</VExpansionPanels>

        <!-- Paginación -->
        <div class="d-flex justify
-center mt-4">
<VPagination
    v-if="totalPages > 1"
    v-model="currentPage"
    :length="totalPages"
    :total-visible="5"
    active-color="primary"
    @update:model-value="cambiarPagina"
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


const urlRules = [
  v => !!v || 'La URL es requerida',
  v => /^(http|https):\/\/[^ "]+$/.test(v) || 'Ingrese una URL válida'
]

const mediosAgrupados = ref({})

const itemsPerPage = 10 
const currentPage = ref(1)
const totalPages = ref(0)


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
  // Recargar la lista de medios
  cargarMedios(1)
}

// const cargarMedios = async (page = 1) => {
//   loadingMedios.value = true
//   try {
//     console.log('Cargando medios página:', page)
//     const response = await axios.get(`http://localhost:8088/scrapper-rule/all`, {
//       params: {
//         page: page,
//         limit: itemsPerPage
//       }
//     })
    
//     console.log('Respuesta de cargar medios:', response.data)
    
//     if (response.data && Array.isArray(response.data.data)) {
//       let gruposActuales = { ...mediosAgrupados.value }
      
//       response.data.data.forEach(item => {
//         if (item && item.media_communication) {
//           const nombreMedio = item.media_communication.trim().toLowerCase()
//           if (!gruposActuales[nombreMedio]) {
//             gruposActuales[nombreMedio] = []
//           }
//           // Verificar duplicados antes de agregar
//           const itemExiste = gruposActuales[nombreMedio].some(
//             existente => existente._id === item._id
//           )
//           if (!itemExiste) {
//             gruposActuales[nombreMedio].push(item)
//           }
//         }
//       })
      
//       mediosAgrupados.value = gruposActuales
//       medios.value = [...medios.value, ...response.data.data]
//       totalPages.value = Math.ceil(response.data.total / itemsPerPage)
      
//       console.log('Medios cargados:', medios.value.length)
//       console.log('Grupos actualizados:', Object.keys(gruposActuales))
//     }
//   } catch (err) {
//     console.error('Error al cargar medios:', err)
//     console.error('Detalles del error:', err.response?.data)
//   } finally {
//     loadingMedios.value = false
//   }
// }

const cargarMedios = async (page = 1) => {
  loadingMedios.value = true
  try {
    console.log('Cargando página:', page, 'con límite:', itemsPerPage)
    
    // Asegurarnos de que los parámetros se envíen correctamente
    const params = new URLSearchParams({
      page: page.toString(),
      limit: itemsPerPage.toString()
    })
    
    const response = await axios.get(
      `https://servicio-competencias.vercel.app/scrapper-rule/all?${params.toString()}`
    )
    
    console.log('Respuesta completa:', response.data)
    
    if (response.data && Array.isArray(response.data.data)) {
      // Reiniciar los grupos para cada página
      const grupos = {}
      
      // Procesar solo los datos de la página actual
      response.data.data.forEach(item => {
        if (item && item.media_communication) {
          const nombreMedio = item.media_communication.trim().toLowerCase()
          if (!grupos[nombreMedio]) {
            grupos[nombreMedio] = []
          }
          grupos[nombreMedio].push(item)
        }
      })
      
      // Ordenar cada grupo
      Object.keys(grupos).forEach(medio => {
        grupos[medio].sort((a, b) => {
          if (a.key === a.media_communication) return -1
          if (b.key === b.media_communication) return 1
          return a.key.localeCompare(b.key)
        })
      })
      
      // Actualizar estado
      mediosAgrupados.value = grupos
      medios.value = response.data.data
      
      // Calcular el total de páginas basado en el total de registros
      const total = response.data.total || 0
      totalPages.value = Math.ceil(total / itemsPerPage)
      currentPage.value = page
      
      console.log('Items en esta página:', response.data.data.length)
      console.log('Total de registros:', total)
      console.log('Total de páginas calculadas:', totalPages.value)
      console.log('IDs de registros en esta página:', response.data.data.map(item => item._id))
    }
  } catch (err) {
    console.error('Error al cargar medios:', err)
    console.error('Detalles del error:', err.response?.data)
  } finally {
    loadingMedios.value = false
  }
}

const cambiarPagina = (newPage) => {
  console.log('Cambiando a página:', newPage)
  cargarMedios(newPage)
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

// onMounted(async () => {
//   // Cargar primera página
//   await cargarMedios(1)
  
//   // Si hay más páginas, cargarlas
//   if (totalPages.value > 1) {
//     for (let page = 2; page <= totalPages.value; page++) {
//       await cargarMedios(page)
//     }
//   }
// })

onMounted(() => {
  cargarMedios(1)
})

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

.custom-chip {
  font-size: 0.5rem !important;
  height: 16px !important;
  padding: 0 6px !important;
}


</style>