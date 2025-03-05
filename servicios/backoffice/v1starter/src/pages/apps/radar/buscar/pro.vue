<template>
  <div>
    <VRow class="match-height">   
      <!-- Bloque Izquierdo -->
      <VCol cols="12" md="6">
        <!-- Vista normal (cuando no hay medios seleccionados) -->
        <VCard v-if="selectedMediaUrls.length === 0" class="h-100">
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

        <!-- Vista de medios seleccionados (cuando hay al menos uno) -->
        <VCard v-else class="h-100">
          <VCardTitle class="px-6 py-4">
            <h4 class="text-h6 mb-0">Medios seleccionados ({{ selectedMediaUrls.length }})</h4>
          </VCardTitle>

          <VCardText>
            <VList density="compact" class="bg-grey-lighten-5 rounded border mb-4">
              <VListItem v-for="(selectedUrl, index) in selectedMediaUrls" :key="index">
                <template v-slot:prepend>
                  <VIcon icon="tabler-link" size="16" class="me-2 text-primary" />
                </template>
                <VListItemTitle class="text-caption text-truncate">
                  {{ selectedUrl.name || selectedUrl.url }}
                </VListItemTitle>
                <template v-slot:append>
                  <VBtn icon variant="text" density="compact" size="x-small" 
                    @click="removeSelectedUrl(index)" color="error">
                    <VIcon icon="tabler-x" size="16" />
                  </VBtn>
                </template>
              </VListItem>
            </VList>
            
            <!-- Botones para selección múltiple -->
            <div class="d-flex flex-column gap-2">
              <VBtn 
                color="primary" 
                :loading="isAnalyzingMultiple" 
                :disabled="isAnalyzingMultiple || selectedMediaUrls.length === 0"
                @click="analizarMediosSeleccionados"
                block>
                <VIcon start icon="tabler-analyze" size="18" class="me-2" />
                {{ isAnalyzingMultiple ? `Analizando (${currentAnalysisIndex + 1}/${selectedMediaUrls.length})...` : 'ANALIZAR SELECCIONADOS' }}
              </VBtn>
              
              <VBtn 
                variant="outlined" 
                color="error" 
                @click="limpiarSeleccion"
                :disabled="isAnalyzingMultiple"
                block>
                <VIcon start icon="tabler-trash" size="18" class="me-2" />
                LIMPIAR SELECCIÓN
              </VBtn>
            </div>
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
              <VExpansionPanels v-model="expandedPanels" @update:model-value="handleExpandedPanelsChange">
                <VExpansionPanel v-for="(grupo, medio) in mediosAgrupados" :key="medio"
                    @click="handlePanelChange(medio)">
                    <VExpansionPanelTitle>
                      <div class="d-flex align-center w-100">
                        <!-- Checkbox solo visible si hay datos -->
                        <VCheckbox
                          v-if="mediosData[medio] && mediosData[medio].length > 0"
                          :model-value="allUrlsInView[medio] ? allUrlsInView[medio].allSelected : false"
                          @click.stop
                          @change="(val) => seleccionarTodosItems(medio, val)"
                          density="compact"
                          hide-details
                          color="primary"
                          class="me-2"
                        ></VCheckbox>
                        <!-- Espacio equivalente si no hay datos -->
                        <div v-else class="me-2" style="width: 24px; height: 24px;"></div>
                        
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
                          <template v-slot:prepend>
                            <VCheckbox
                              v-model="item.selected"
                              @click.stop
                              @change="handleUrlSelection(item, medio)"
                              density="compact"
                              hide-details
                              color="primary"
                            ></VCheckbox>
                          </template>
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
            <!-- Notificación de nuevos artículos -->
            <VAlert v-if="nuevosArticulos > 0" type="info" variant="tonal" closable class="mb-4 w-100" 
                @click="verNuevosArticulos">
              <div class="d-flex align-items-center justify-content-between">
                <span>Hay {{ nuevosArticulos }} artículos nuevos</span>
                <VBtn size="small" color="primary" variant="text" @click.stop="verNuevosArticulos">
                  Ver nuevos artículos
                </VBtn>
              </div>
            </VAlert>
            
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
                          <!-- CHIP DEL MEDIO: color variable según el medio -->

                       
<VChip 
  v-if="articulo.source || articulo.sourceName" 
  size="x-small" 
  class="text-uppercase metadata-item font-weight-bold"
  :style="obtenerEstiloColorMedio(articulo.source || articulo.sourceName)"
>
  {{ articulo.source || articulo.sourceName }}
</VChip>
                          <VChip v-else color="info" size="x-small" class="text-uppercase metadata-item">
                            Medio no disponible
                          </VChip>

                          <!-- Indicador de carga -->
                          <VChip v-if="loadingMetadata" size="x-small" color="grey">
                            <VIcon start icon="tabler-loader-2" class="loading-spin" size="12" />
                            Cargando...
                          </VChip>

                          <div v-else class="gap-2 grupoTopInfo">
          <div class="d-flex align-center gap-2 flex-wrap">
            <!-- Fecha -->
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
            
            <!-- Categoría como chip pequeño -->
            <VChip v-if="articulo.category" size="x-small">
              {{ articulo.category }}
            </VChip>
            
            <!-- Sección, Autor, Tipo -->
            <VChip v-if="articulo.seccion" size="x-small">{{ articulo.seccion }}</VChip>
            <div v-if="articulo.autor" class="autor-ec" title="Autor">
              <VIcon icon="tabler-user" size="15" /> <small>{{ articulo.autor }}</small>
            </div>
            <div v-if="articulo.tipo" class="article-type-ec" title="Tipo de artículo">
              <VIcon icon="tabler-article" size="15" /> <small>{{ articulo.tipo }}</small>
            </div>
          </div>

                            <!-- Keywords  -->
                            <div v-if="articulo.keywords">
                              <VChip v-for="(keyword, index) in parseKeywords(articulo.keywords).slice(0, 2)" :key="index"
                                size="x-small" class="mr-2" variant="outlined" color="secondary">
                                {{ keyword }}
                              </VChip>

                              <VMenu v-if="typeof articulo.keywords === 'string' && articulo.keywords.split(',').length > 2" class="bloqueToogle"
                                :close-on-content-click="false">
                                <template v-slot:activator="{ props }">
                                  <VChip size="x-small" variant="outlined" color="secondary" v-bind="props">
                                    +{{ typeof articulo.keywords === 'string' ? articulo.keywords.split(',').length - 2 : 0 }}
                                  </VChip>
                                </template>
                                <VList density="compact" class="pa-2">
                                  <template v-for="(keyword, index) in parseKeywords(articulo.keywords).slice(2)" :key="index">
                                    <VChip size="x-small" variant="outlined" color="secondary" class="ma-1">
                                      {{ keyword }}
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
					  <!-- Nueva sección para gráficos -->
						<VCol cols="12" v-if="topKeywords.length > 0 || mediaDistribution.length > 0">
							<VCard>
								<VCardTitle>Análisis de Medios</VCardTitle>
								<VCardText>
										<VRow>
												<!-- Grafico de Top 10 de Keywords -->
												<VCol cols="12" md="6" v-if="topKeywords.length > 0">
														<BarChart :chartData="topKeywords" />
												</VCol>
												<!-- Grafico de Distribucion de Medios -->
												<VCol cols="12" md="6" v-if="mediaDistribution.length > 0">
														<PieChart :chartData="mediaDistribution" />
												</VCol>
										</VRow>
								</VCardText>
							</VCard>
						</VCol>
        </VRow>
  </div>

  <!-- Componente de notificación de progreso -->
      <VSnackbar
        v-model="showProgress"
        :timeout="-1"
        color="primary"
        position="bottom"
        variant="flat"
        width="400"
        class="progress-snackbar"
      >
        <div class="d-flex flex-column">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="font-weight-medium">{{ progressMessage }}</span>
            <span class="font-weight-bold">{{ Math.round(progressPercent) }}%</span>
          </div>
          <VProgressLinear
            v-model="progressPercent"
            color="white"
            height="5"
          ></VProgressLinear>
        </div>
      </VSnackbar>
</template>

<script setup>
import axios from 'axios';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BarChart from './BarChart.vue'; // Importar componente de gráfico de barras
import PieChart from './PieChart.vue'; // Importar componente de gráfico de pastel

const intervalId = ref(null)
const nuevosArticulos = ref(0)
const actualizando = ref(false)

// Crear una variable reactiva para el array de nuevos artículos
const nuevosArticulosArray = ref([]);

const topKeywords = ref([]);
const mediaDistribution = ref([]);

// variables para el filtro
const filteredKeywords = ref([]);
const allKeywords = ref([]);

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

const medioCounts = ref({}) 

const mediosData = ref({})
const loadingMedioData = ref({})
const expandedPanels = ref([])

const blacklistsByMedia = ref({});
const loadingBlacklist = ref(false);

const selectedMediaUrls = ref([]) 
const allUrlsInView = ref({}) 
const isAnalyzingMultiple = ref(false) 
const currentAnalysisIndex = ref(0)
const multipleResults = ref([]) 

// Utility function to safely handle keywords
const parseKeywords = (keywords) => {
  if (!keywords) return [];
  
  try {
    if (typeof keywords === 'string') {
      return keywords.split(',').map(k => k.trim()).filter(Boolean);
    } else if (Array.isArray(keywords)) {
      return keywords.map(k => typeof k === 'string' ? k.trim() : String(k)).filter(Boolean);
    } else if (typeof keywords === 'object') {
      // Try to convert object to string if possible
      return [String(keywords)].filter(Boolean);
    }
  } catch (err) {
    console.warn('Error parsing keywords:', err);
  }
  
  return [];
}

// contar todas las keywords
const countAllKeywords = (articles) => {
    const keywords = [];
    articles.forEach(article => {
        const articleKeywords = parseKeywords(article.keywords);
        keywords.push(...articleKeywords);
    });
    return keywords.length;
};

// Procesar Keywords y crear top 10
const procesarKeywords = (articles) => {
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    console.warn('No hay artículos para procesar keywords');
    return;
  }

  try {
    const keywordFrequencies = {};

    articles.forEach(article => {
      if (article && article.keywords) {
        const keywords = parseKeywords(article.keywords);
        keywords.forEach(keyword => {
          if (keyword) {
            keywordFrequencies[keyword] = (keywordFrequencies[keyword] || 0) + 1;
          }
        });
      }
    });

    // Ordenar por frecuencia
    const sortedKeywords = Object.entries(keywordFrequencies)
      .filter(([keyword]) => keyword && keyword.trim())
      .sort(([, a], [, b]) => b - a);

    // Tomar el top 10 y formatear para el gráfico de barras
    topKeywords.value = sortedKeywords.slice(0, 10).map(([keyword, count]) => ({
      label: keyword,
      value: count,
    }));

    allKeywords.value = sortedKeywords.map(([keyword, count]) => ({
      label: keyword,
      value: count,
    }));

    console.log(`Procesadas ${allKeywords.value.length} keywords, top 10 keywords:`, topKeywords.value);
  } catch (err) {
    console.error('Error al procesar keywords:', err);
  }
};

// Procesar Medios y crear distribución
const procesarMedios = (articles) => {
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    console.warn('No hay artículos para procesar medios');
    return;
  }

  try {
    const mediaFrequencies = {};

    articles.forEach(article => {
      if (article) {
        const source = article.source || article.sourceName;
        if (source) {
          mediaFrequencies[source] = (mediaFrequencies[source] || 0) + 1;
        }
      }
    });

    // Formatear para el gráfico de pastel
    mediaDistribution.value = Object.entries(mediaFrequencies)
      .filter(([media]) => media && media.trim())
      .map(([media, count]) => ({
        label: media,
        value: count,
      }));

    console.log(`Procesados ${mediaDistribution.value.length} medios:`, mediaDistribution.value);
  } catch (err) {
    console.error('Error al procesar distribución de medios:', err);
  }
};

const inicializarEstructuras = () => {
  if (mediosAgrupados.value) {
    Object.keys(mediosAgrupados.value).forEach(medio => {
      if (!allUrlsInView.value[medio]) {
        allUrlsInView.value[medio] = {
          allSelected: false,
          items: []
        }
      }
    })
  }
}

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

const showProgress = ref(false)
const progressMessage = ref('')
const progressPercent = ref(0)

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

    inicializarEstructuras()
    
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
  
  // Inicializar estructuras para todos los medios cargados
  inicializarEstructuras()
})

// Inicializar la estructura de selección cuando se cargan los datos del medio
const initializeSelectionStructure = (medio) => {
  console.log(`Inicializando estructura para medio: ${medio}`)
  
  // Asegurarse de que exista el objeto para este medio
  if (!allUrlsInView.value[medio]) {
    allUrlsInView.value[medio] = {
      allSelected: false,
      items: []
    }
  }
  
  // Inicializar la propiedad 'selected' en cada item si no existe
  if (mediosData.value[medio]) {
    mediosData.value[medio].forEach(item => {
      // Usar Vue.set o asignar directamente si el valor no existe
      if (item.selected === undefined) {
        item.selected = false
      }
      
      // Agregar a allUrlsInView si no existe
      const existingItemIndex = allUrlsInView.value[medio].items.findIndex(i => i._id === item._id)
      if (existingItemIndex === -1) {
        allUrlsInView.value[medio].items.push({
          _id: item._id,
          url: item.url_communication,
          name: formatearTitulo(item.key, medio),
          selected: item.selected || false
        })
      }
    })
  }
}
// Función para cargar datos de un medio específico
const cargarDatosMedio = async (medio, page = 1) => {
  try {
    console.log(`Iniciando carga de datos para medio: ${medio}, página: ${page}`)
    loadingMedioData.value[medio] = true

    const response = await axios.get(
      `https://servicio-competencias.vercel.app/scrapper-rule/medio/${medio}`,
      {
        params: {
          page: page.toString(),
          limit: itemsPerPage.toString()
        }
      }
    )

    console.log(`Respuesta recibida para medio ${medio}:`, response.data)

    if (response.data && Array.isArray(response.data.data)) {
      mediosData.value[medio] = response.data.data
      console.log(`Datos cargados para ${medio}:`, mediosData.value[medio].length)
      medioCounts.value[medio] = response.data.total
      
      // Inicializar la estructura de selección
      initializeSelectionStructure(medio)
      
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

// Función para limpiar todas las selecciones
const limpiarSeleccion = () => {
  // Limpiar la lista de URLs seleccionadas
  selectedMediaUrls.value = []
  
  // Desmarcar todos los checkboxes
  Object.keys(allUrlsInView.value).forEach(medio => {
    if (allUrlsInView.value[medio]) {
      allUrlsInView.value[medio].allSelected = false
      
      if (allUrlsInView.value[medio].items) {
        allUrlsInView.value[medio].items.forEach(item => {
          item.selected = false
        })
      }
    }
    
    // También actualizar en mediosData si existe
    if (mediosData.value[medio]) {
      mediosData.value[medio].forEach(item => {
        item.selected = false
      })
    }
  })
}

// Manejar la selección/deselección individual de un ítem
const handleUrlSelection = (item, medio) => {
  console.log(`Item seleccionado: ${item.key}, Medio: ${medio}, Estado: ${item.selected}`)
  
  // Si se selecciona
  if (item.selected) {
    // Verificar que no esté ya en la lista
    const existeEnLista = selectedMediaUrls.value.some(
      url => url._id === item._id && url.medio === medio
    )
    
    if (!existeEnLista && item.url_communication) {
      selectedMediaUrls.value.push({
        _id: item._id,
        url: item.url_communication,
        name: formatearTitulo(item.key, medio),
        medio: medio
      })
    }
  } else {
    // Si se deselecciona, quitar de la lista
    selectedMediaUrls.value = selectedMediaUrls.value.filter(
      url => !(url._id === item._id && url.medio === medio)
    )
  }
  
  // Verificar si todos los ítems del medio están seleccionados
  if (mediosData.value[medio]) {
    const todosSeleccionados = mediosData.value[medio].every(i => i.selected)
    
    // Actualizar el estado del checkbox general
    if (!allUrlsInView.value[medio]) {
      allUrlsInView.value[medio] = { allSelected: todosSeleccionados, items: [] }
    } else {
      allUrlsInView.value[medio].allSelected = todosSeleccionados
    }
  }
}

// Seleccionar o deseleccionar todos los items de un medio
const seleccionarTodosItems = (medio, isSelected) => {
  // Asegurarse de que isSelected sea un booleano
  let shouldSelect = isSelected
  
  // Si es un objeto event, extraer el valor
  if (typeof isSelected === 'object' && isSelected !== null) {
    console.log('isSelected es un objeto:', isSelected)
    shouldSelect = isSelected.target ? isSelected.target.checked : false
  }
  
  console.log(`Seleccionando todos los items de ${medio}: ${shouldSelect}`)
  
  // Inicializar estructura si no existe
  if (!allUrlsInView.value[medio]) {
    allUrlsInView.value[medio] = {
      allSelected: shouldSelect,
      items: []
    }
  } else {
    allUrlsInView.value[medio].allSelected = shouldSelect
  }
  
  // Actualizar los items solo si ya están cargados
  if (mediosData.value[medio] && mediosData.value[medio].length) {
    console.log(`Actualizando ${mediosData.value[medio].length} items de ${medio}`)
    
    mediosData.value[medio].forEach(item => {
      item.selected = shouldSelect
    })
    
    // Actualizar seleccionados
    if (shouldSelect) {
      // Agregar items no duplicados
      mediosData.value[medio].forEach(item => {
        if (item.url_communication && !selectedMediaUrls.value.some(url => url._id === item._id)) {
          selectedMediaUrls.value.push({
            _id: item._id,
            url: item.url_communication,
            name: formatearTitulo(item.key, medio),
            medio: medio
          })
        }
      })
    } else {
      // Quitar todos los del medio
      selectedMediaUrls.value = selectedMediaUrls.value.filter(url => url.medio !== medio)
    }
  } else {
    console.log(`No hay datos cargados para el medio ${medio}, cargando primero...`)
    cargarDatosMedio(medio).then(() => {
      if (mediosData.value[medio] && mediosData.value[medio].length) {
        seleccionarTodosItems(medio, shouldSelect)
      }
    })
  }
}

// Eliminar un URL seleccionado
const removeSelectedUrl = (index) => {
  const selectedItem = selectedMediaUrls.value[index]
  
  // Quitar de la lista de seleccionados
  selectedMediaUrls.value.splice(index, 1)
  
  // Actualizar el estado en mediosData si existe
  if (selectedItem.medio && mediosData.value[selectedItem.medio]) {
    const item = mediosData.value[selectedItem.medio].find(i => i._id === selectedItem._id)
    if (item) {
      item.selected = false
    }
  }
  
  // Actualizar en allUrlsInView
  if (selectedItem.medio && allUrlsInView.value[selectedItem.medio]) {
    const itemInView = allUrlsInView.value[selectedItem.medio].items.find(i => i._id === selectedItem._id)
    if (itemInView) {
      itemInView.selected = false
    }
    
    // Actualizar estado "todos seleccionados"
    updateAllSelectedState(selectedItem.medio)
  }
}

// Actualizar el estado de selección "todos" basado en selecciones individuales
const updateAllSelectedState = (medio) => {
  if (!allUrlsInView.value[medio] || !mediosData.value[medio]) return
  
  const allItems = mediosData.value[medio]
  const allSelected = allItems.every(item => item.selected)
  allUrlsInView.value[medio].allSelected = allSelected
}

// Analizar todos los medios seleccionados
const analizarMediosSeleccionados = async () => {
  if (selectedMediaUrls.value.length === 0) return
  
  isAnalyzingMultiple.value = true
  currentAnalysisIndex.value = 0
  multipleResults.value = []
  
  // Mostrar notificación de progreso
  showProgress.value = true
  progressPercent.value = 0
  progressMessage.value = 'Preparando análisis...'
  
  try {
    const totalMedios = selectedMediaUrls.value.length;
    
    // Analizar cada URL seleccionada secuencialmente
    for (let i = 0; i < totalMedios; i++) {
      currentAnalysisIndex.value = i
      const selectedUrl = selectedMediaUrls.value[i]
      
      // Actualizar mensaje de progreso
      progressMessage.value = `Analizando ${selectedUrl.name} (${i+1} de ${totalMedios})`;
      progressPercent.value = (i / totalMedios) * 80; // Reservamos 80% para análisis principal
      
      try {
        const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
          url: selectedUrl.url
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        // Guardar este resultado
        multipleResults.value.push({
          url: selectedUrl.url,
          name: selectedUrl.name,
          data: response.data
        })
        
        // Procesar metadatos adicionales si es necesario
        if (response.data && response.data.articles) {
          const articleLinks = response.data.articles.map(article => article.link).filter(Boolean)
          const batchSize = 10
          const totalBatches = Math.ceil(articleLinks.length / batchSize);
          
          progressMessage.value = `Enriqueciendo datos de ${selectedUrl.name}...`;
          
          for (let j = 0; j < articleLinks.length; j += batchSize) {
            // Actualizar progreso para el enriquecimiento de datos
            const batchNumber = Math.floor(j / batchSize) + 1;
            const batchProgress = batchNumber / totalBatches;
            const medioProgress = i / totalMedios;
            progressPercent.value = 80 + (medioProgress * 20) + (batchProgress * (20 / totalMedios));
            
            const batchLinks = articleLinks.slice(j, j + batchSize)
            
            try {
              const batchResponse = await axios.post(
                'https://servicio-competencias.vercel.app/multiple-articles',
                { urls: batchLinks },
                { headers: { 'Content-Type': 'application/json' } }
              )
              
              if (batchResponse.data.resp && Array.isArray(batchResponse.data.data)) {
                const lastIndex = multipleResults.value.length - 1
                
                if (multipleResults.value[lastIndex] && multipleResults.value[lastIndex].data) {
                  // Enriquecer los artículos con los metadatos adicionales
                  batchResponse.data.data.forEach(additionalData => {
                    try {
                      if (additionalData.success) {
                        const articleIndex = multipleResults.value[lastIndex].data.articles.findIndex(
                          article => article && article.link === additionalData.url
                        )
                        
                        if (articleIndex !== -1) {
                          multipleResults.value[lastIndex].data.articles[articleIndex] = {
                            ...multipleResults.value[lastIndex].data.articles[articleIndex],
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
                    } catch (err) {
                      console.warn('Error procesando datos adicionales:', err);
                    }
                  })
                }
              }
            } catch (err) {
              console.error(`Error processing batch for ${selectedUrl.name}:`, err)
            }
          }
        }
      } catch (err) {
        console.error(`Error al analizar URL ${selectedUrl.url}:`, err);
        // Añadir incluso con error para mantener el orden
        multipleResults.value.push({
          url: selectedUrl.url,
          name: selectedUrl.name,
          error: err.response?.data?.message || 'Error al analizar este medio'
        });
      }
    }
    
    // Actualizar progreso para la combinación final
    progressMessage.value = 'Combinando resultados...';
    progressPercent.value = 95;
    
    // Combinar resultados y mostrar en pantalla
    combinarYMostrarResultados();
    if (resultados.value) {
      // Si hay resultados, limpiar el intervalo existente
      if (intervalId.value) {
        clearInterval(intervalId.value);
      }
      // Iniciar el intervalo de actualización
      intervalId.value = setInterval(actualizarArticulos, 2 * 60 * 1000); // 2 minutos
      // Llamar a actualizarArticulos inmediatamente
      actualizarArticulos();
    }
    
    // Completar progreso
    progressMessage.value = 'Análisis completado';
    progressPercent.value = 100;
    
    // Ocultar notificación después de un momento
    setTimeout(() => {
      showProgress.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error en el análisis múltiple:', err);
    error.value = 'Error al procesar los medios seleccionados';
    
    // Actualizar notificación en caso de error
    progressMessage.value = 'Error en el análisis';
    setTimeout(() => {
      showProgress.value = false;
    }, 2000);
  } finally {
    isAnalyzingMultiple.value = false;
  }
}

const obtenerEstiloColorMedio = (medio) => {
  if (!medio) return { backgroundColor: '#757575', color: 'white', minWidth: '60px', textAlign: 'center' };
  
  const medioNormalizado = String(medio).toLowerCase().trim();
  
  // Mapeo de medios a colores específicos
  const colorMap = {
    'telegrafo': '#FB8C00',
    'universo': '#1565C0',
    'comercio': '#3F51B5',
    'ecuavisa': '#009688',
    'cnn': '#F44336',
    'infobae': '#673AB7',
    'extra': '#D50000',
    'clarin': '#CDDC39'
  };
  
  // Buscar coincidencia
  let backgroundColor = '#757575'; // Color por defecto
  
  for (const [clave, color] of Object.entries(colorMap)) {
    if (medioNormalizado.includes(clave)) {
      backgroundColor = color;
      break;
    }
  }
  
  // Si no hay coincidencia, asignar color por primera letra
  if (backgroundColor === '#757575') {
    const letraColores = [
      '#9C27B0', '#FF5722', '#03A9F4', '#CDDC39', '#E91E63',
      '#00BCD4', '#FFC107', '#8BC34A', '#673AB7', '#FFEB3B',
      '#009688', '#FF9800', '#4CAF50', '#F44336', '#2196F3', '#3F51B5'
    ];
    
    const indiceColor = medioNormalizado.charCodeAt(0) % letraColores.length;
    backgroundColor = letraColores[indiceColor];
  }
  
  const textColor = esColorOscuro(backgroundColor) ? 'white' : 'black';
  
  return {
    backgroundColor: backgroundColor,
    color: textColor,
    minWidth: '60px',
    textAlign: 'center',
    fontWeight: 'bold'
  };
};

const esColorOscuro = (hexColor) => {
  // Convertir color hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calcular luminosidad
  const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminosidad es menor que 0.5, el color es oscuro
  return luminosidad < 0.5;
};

// Combinar y mostrar los resultados del análisis múltiple
const combinarYMostrarResultados = () => {
  if (multipleResults.value.length === 0) return
  
  const combinado = {
    source: 'Múltiples medios',
    total: 0,
    articles: []
  }
  
  multipleResults.value.forEach(result => {
    if (result.data && result.data.articles) {
      // Añadir identificación de la fuente a cada artículo
      const articlesWithSource = result.data.articles.map(article => {
        if (!article) return null;
        
        // Extraer nombre del medio de la URL si no existe
        let sourceName = article.source;
        
        if (!sourceName) {
          try {
            if (article.link) {
              const urlObj = new URL(article.link);
              const hostname = urlObj.hostname;
              sourceName = hostname
                .replace(/^www\./, '')
                .split('.')
                .slice(0, -1)
                .join('.');
              
              // Formatear el nombre del medio
              sourceName = sourceName.split(/[.-]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
            } else {
              // Usar el nombre del medio de la selección
              sourceName = result.name;
            }
          } catch (e) {
            sourceName = result.name;
          }
        }
        
        return {
          ...article,
          sourceUrl: result.url,
          sourceName: result.name,
          // Preservar el source original o usar el nombre del medio
          source: sourceName || result.name
        };
      }).filter(article => article !== null);
      
      // Añadir al combinado
      combinado.articles.push(...articlesWithSource);
      combinado.total += articlesWithSource.length;
    }
  });
  
  // Ordenar por fecha de más reciente a más antigua
  ordenarArticulosPorFecha(combinado.articles);

  // Procesar las keywords y medios
  procesarKeywords(combinado.articles);
  procesarMedios(combinado.articles);

  // Mostrar los resultados
  resultados.value = combinado;
	// Agregar:
console.log('JSON final con todos los artículos:', JSON.stringify(resultados.value));
}

// Función para manejar la expansión del acordeón
const handlePanelChange = async (medio) => {
  console.log(`Panel cambiado para medio: ${medio}`)
  
  // Inicializar la estructura si no existe
  if (!allUrlsInView.value[medio]) {
    allUrlsInView.value[medio] = {
      allSelected: false,
      items: []
    }
  }
  
  // Verificar si el panel está expandido 
  const isExpanded = Array.isArray(expandedPanels.value) 
    ? expandedPanels.value.includes(medio) 
    : expandedPanels.value === medio;
  
  // Cargar datos si no existen o si el panel está expandido
  if (!mediosData.value[medio] || !mediosData.value[medio].length) {
    await cargarDatosMedio(medio)
  } else {
    mediosData.value[medio].forEach(item => {
      if (item.selected === undefined) {
        item.selected = false
      }
    })
    
    initializeSelectionStructure(medio)
  }
}


const handleExpandedPanelsChange = async (newValue) => {
  if (Array.isArray(newValue)) {
    for (const medio of newValue) {
      if (!mediosData.value[medio] || !mediosData.value[medio].length) {
        await cargarDatosMedio(medio)
      }
    }
  }
}

// console.log('Tipo de expandedPanels:', typeof expandedPanels.value, expandedPanels.value);

const formatearTitulo = (key, medio) => {
  const keyNorm = key?.trim().toLowerCase() || '';
  const medioNorm = medio?.trim().toLowerCase() || '';

  // Si es la página principal
  if (keyNorm === medioNorm) {
    // Incluir el nombre del medio en el título
    return capitalizar(medio) + ' - Principal'
  }

  // Si tiene un punto (formato con subcategorías)
  if (key?.includes('.')) {
    const [, ...partes] = key.split('.')
    return capitalizar(medio) + ' - ' + capitalizar(partes.join(' / '))
  }

  // Para el formato con guiones
  if (key?.startsWith(medio)) {
    const seccion = key.substring(medio.length).replace(/^[-.]/, '')
    return capitalizar(medio) + ' - ' + capitalizar(seccion)
  }

  // Para otros casos
  return capitalizar(medio) + ' - ' + capitalizar(key?.replace(medio, '').replace(/^[-.]/, '') || '')
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
    url.value = asegurarHttps(texto)
  } catch (err) {
    console.error('Error al pegar:', err)
    errorMessage.value = 'No se pudo acceder al portapapeles'
  }
}

const resetearTodo = () => {
  // Limpiar el intervalo si existe
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  
  // Restablecer valores
  error.value = null;
  success.value = null;
  warning.value = null;
  resultados.value = null;
  errorMessage.value = '';
  
  // Restablecer gráficos
  topKeywords.value = [];
  mediaDistribution.value = [];
  allKeywords.value = [];
  filteredKeywords.value = [];
  nuevosArticulos.value = 0;
  nuevosArticulosArray.value = [];
}

const limpiarMensajes = () => {
  error.value = null
  success.value = null
  warning.value = null
}

const analizarSitio = async () => {
  try {
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

      resultados.value = response.data
      verificarMedioGuardado(url.value)

      if (medioYaGuardado.value) {
        warning.value = 'Este medio ya se encuentra registrado'
      }
      loadingMetadata.value = true

      const articleLinks = response.data.articles.map(article => article?.link).filter(Boolean)

      const batchSize = 10
      const enrichedArticles = [...response.data.articles]
      let processedCount = 0

      // Procesar batches secuencialmente
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
              try {
                if (additionalData.success) {
                  const articleIndex = enrichedArticles.findIndex(article => 
                    article && article.link && article.link === additionalData.url
                  )
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
              } catch (err) {
                console.warn('Error al procesar metadatos de artículo:', err);
                // Continuar con el siguiente artículo
              }
            });
          }
        } catch (err) {
          console.error(`Error al procesar lote ${i / batchSize + 1}:`, err)
        }
      }

      resultados.value.articles = enrichedArticles
      
      loadingMetadata.value = false
      
      // Actualizar las fuentes si es necesario
      if (resultados.value && resultados.value.articles) {
        resultados.value.articles.forEach(article => {
          if (!article) return;
          
          if (!article.source) {
            // Extraer el dominio de la URL como source predeterminado
            try {
              if (article.link) {
                const urlObj = new URL(article.link);
                const hostname = urlObj.hostname;
                let sourceName = hostname
                  .replace(/^www\./, '')
                  .split('.')
                  .slice(0, -1)
                  .join('.');
                
                // Formatear el nombre del medio
                sourceName = sourceName.split(/[.-]/)
                  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ');
                
                article.source = sourceName;
              } else {
                // Si no hay link, usar el dominio de la URL analizada
                const urlObj = new URL(url.value);
                const dominio = urlObj.hostname.replace(/^www\./, '').split('.')[0];
                article.source = dominio.charAt(0).toUpperCase() + dominio.slice(1);
              }
            } catch (err) {
              console.error('Error al extraer source del artículo:', err);
              article.source = 'Desconocido';
            }
          }
        });
      }

      // Ordenar los artículos por fecha
      if (resultados.value && resultados.value.articles && resultados.value.articles.length > 0) {
        ordenarArticulosPorFecha(resultados.value.articles);
      }

      // Procesar keywords y medios para los gráficos
      procesarKeywords(resultados.value.articles);
      procesarMedios(resultados.value.articles);

      // Configurar la actualización automática
      if (intervalId.value) {
        clearInterval(intervalId.value);
      }
      intervalId.value = setInterval(actualizarArticulos, 2 * 60 * 1000); // 2 minutos

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
      console.error('Error en el análisis:', err)
      error.value = err.response?.data?.message || 'Error al analizar URL'
    } finally {
      loading.value = false
    }
  } catch (err) {
    console.error('Error en analizarSitio:', err)
    error.value = 'Error inesperado'
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

    console.log("MEDIO GUARDADO");
    warning.value = 'Este medio ya se encuentra registrado'

    loadingMetadata.value = true

    const articleLinks = response.data.articles.map(article => article?.link).filter(Boolean)
    const batchSize = 10
    const enrichedArticles = [...response.data.articles]
    let processedCount = 0

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
            try {
              if (additionalData.success) {
                const articleIndex = enrichedArticles.findIndex(article => 
                  article && article.link === additionalData.url
                );
                
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
                  };
                }
              }
            } catch (err) {
              console.error('Error al procesar artículo:', err);
            }
          });

          processedCount += batchResponse.data.data.length;

          resultados.value = {
            ...response.data,
            articles: enrichedArticles
          };
        }
      } catch (err) {
        console.error(`Error processing batch ${i / batchSize + 1}:`, err)
      }
    }

    if (resultados.value && resultados.value.articles) {
      resultados.value.articles.forEach(article => {
        if (!article) return;
        
        if (!article.source) {
          // Extraer el dominio de la URL como source predeterminado
          try {
            if (article.link) {
              const urlObj = new URL(article.link);
              const hostname = urlObj.hostname;
              let sourceName = hostname
                .replace(/^www\./, '')
                .split('.')
                .slice(0, -1)
                .join('.');
              
              // Formatear el nombre del medio
              sourceName = sourceName.split(/[.-]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
              
              article.source = sourceName;
            } else {
              // Si no hay link, usar el dominio de la URL analizada
              const urlObj = new URL(url);
              const dominio = urlObj.hostname.replace(/^www\./, '').split('.')[0];
              article.source = dominio.charAt(0).toUpperCase() + dominio.slice(1);
            }
          } catch (err) {
            console.error('Error al extraer source del artículo:', err);
            article.source = 'Desconocido';
          }
        }
      });
    }

    if (resultados.value && resultados.value.articles && resultados.value.articles.length > 0) {
      ordenarArticulosPorFecha(resultados.value.articles);
    }

    // Procesar keywords y medios para los gráficos
    procesarKeywords(resultados.value.articles);
    procesarMedios(resultados.value.articles);
    
    // Configurar la actualización automática
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
    intervalId.value = setInterval(actualizarArticulos, 2 * 60 * 1000); // 2 minutos

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

// Función para ordenar artículos por fecha
// Función mejorada para ordenar artículos por fecha
const ordenarArticulosPorFecha = (articles) => {
  if (!articles || !Array.isArray(articles)) {
    console.warn('Se intentó ordenar artículos, pero no es un array válido');
    return;
  }
  
  try {
    articles.forEach(article => {
      if (!article) return;
      
      // Priorizar fechaPublicacion del endpoint multiple-articles si existe
      if (!article.fechaPublicacion && !article.timestamp) {
        // Si no tiene fecha, tratar de extraerla del contenido o url
        try {
          if (article.link) {
            const urlPartes = article.link.split('/');
            // Muchos medios tienen fechas en sus URLs
            for (let i = 0; i < urlPartes.length - 2; i++) {
              // Buscar patrón de fecha YYYY/MM/DD
              if (/^\d{4}$/.test(urlPartes[i]) && 
                  /^\d{2}$/.test(urlPartes[i+1]) && 
                  /^\d{2}$/.test(urlPartes[i+2])) {
                article.fechaPublicacion = `${urlPartes[i]}-${urlPartes[i+1]}-${urlPartes[i+2]}`;
                break;
              }
            }
          }
        } catch (e) {
          console.warn('Error al extraer fecha de URL:', e);
        }
      }
    });
    
    // Función auxiliar para convertir fechas a objetos Date para comparación
    const getFechaComparable = (article) => {
      if (!article) return new Date(0); // Fecha mínima por defecto
      
      let fechaStr = article.fechaPublicacion || article.timestamp || '';
      if (!fechaStr) return new Date(0);
      
      try {
        // Detectar formato español DD/MM/YYYY HH:MM:SS
        const spanishFormatRegex = /(\d{2})\/(\d{2})\/(\d{4})\s*(\d{2})?:?(\d{2})?:?(\d{2})?\s?(AM|PM)?/i;
        const matches = fechaStr.match(spanishFormatRegex);
        
        if (matches) {
          // Reconstruir fecha en formato ISO para JS
          const day = matches[1];
          const month = matches[2];
          const year = matches[3];
          const hour = matches[4] || '00';
          const minute = matches[5] || '00';
          const second = matches[6] || '00';
          const ampm = matches[7] || '';
          
          // Ajustar hora si es PM
          let adjustedHour = parseInt(hour);
          if (ampm && ampm.toUpperCase() === 'PM' && adjustedHour < 12) {
            adjustedHour += 12;
          } else if (ampm && ampm.toUpperCase() === 'AM' && adjustedHour === 12) {
            adjustedHour = 0;
          }
          
          // Crear fecha con formato ISO
          return new Date(`${year}-${month}-${day}T${String(adjustedHour).padStart(2, '0')}:${minute}:${second}`);
        }
        
        // Intentar con el constructor normal de Date
        const fecha = new Date(fechaStr);
        if (!isNaN(fecha.getTime())) {
          return fecha;
        }
        
        // Si no se puede interpretar, usar la fecha actual para que no quede al final
        return new Date();
      } catch (err) {
        console.warn('Error al convertir fecha para ordenamiento:', err);
        return new Date();
      }
    };
    
    // Ordenar los artículos del más reciente al más antiguo
    articles.sort((a, b) => {
      const fechaA = getFechaComparable(a);
      const fechaB = getFechaComparable(b);
      return fechaB - fechaA; // Orden descendente (más reciente primero)
    });
    
    console.log(`Artículos ordenados por fecha: ${articles.length} artículos`);
  } catch (error) {
    console.error('Error general al ordenar artículos por fecha:', error);
    // No interrumpir el flujo de la aplicación
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

// Función mejorada para formatear la fecha de manera uniforme
const formatearFecha = (timestamp) => {
  if (!timestamp) return '';

  try {
    // Si no es un string, intentar convertirlo
    const timestampStr = typeof timestamp !== 'string' ? String(timestamp) : timestamp;
    
    // Detectar formato español DD/MM/YYYY HH:MM:SS
    const spanishFormatRegex = /(\d{2})\/(\d{2})\/(\d{4})\s*(\d{2})?:?(\d{2})?:?(\d{2})?\s?(AM|PM)?/i;
    const matches = timestampStr.match(spanishFormatRegex);
    
    let fecha;
    if (matches) {
      // Reconstruir fecha en formato ISO para JS
      const day = matches[1];
      const month = matches[2];
      const year = matches[3];
      const hour = matches[4] || '00';
      const minute = matches[5] || '00';
      const second = matches[6] || '00';
      const ampm = matches[7] || '';
      
      // Ajustar hora si es PM
      let adjustedHour = parseInt(hour);
      if (ampm && ampm.toUpperCase() === 'PM' && adjustedHour < 12) {
        adjustedHour += 12;
      } else if (ampm && ampm.toUpperCase() === 'AM' && adjustedHour === 12) {
        adjustedHour = 0;
      }
      
      // Crear fecha con formato ISO
      fecha = new Date(`${year}-${month}-${day}T${String(adjustedHour).padStart(2, '0')}:${minute}:${second}`);
    } else {
      // Intentar con el constructor normal de Date
      fecha = new Date(timestampStr);
    }
    
    // Verificar si la fecha es válida
    if (!isNaN(fecha.getTime())) {
      // Formatear con la hora incluida
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '');
    }
    
    // Si todo falla, devolver el string original
    return timestampStr;
  } catch (e) {
    console.warn('Error al formatear fecha:', e, 'para timestamp:', timestamp);
    return typeof timestamp === 'string' ? timestamp : '';
  }
}

// Función para validar y limpiar el summary
const validateSummary = (summary) => {
  if (!summary) return '';

  // Verificar si el summary contiene el código de imageLoadError
  if (typeof summary === 'string' && summary.trim().startsWith('function imageLoadError')) {
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

// Función para omitir contenido 
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
      
      // Actualizar los gráficos después de quitar el artículo
      procesarKeywords(resultados.value.articles);
      procesarMedios(resultados.value.articles);
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
    if (!articulo) return false;
    
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
    
    // Actualizar gráficos después de filtrar
    procesarKeywords(resultados.value.articles);
    procesarMedios(resultados.value.articles);
  }
};

// Función para ver los nuevos artículos
const verNuevosArticulos = () => {
  if (nuevosArticulos.value > 0 && nuevosArticulosArray.value.length > 0) {
    try {
      console.log(`Añadiendo ${nuevosArticulos.value} artículos nuevos a la vista`);
      
      // Ordenar el array de nuevos artículos
      ordenarArticulosPorFecha(nuevosArticulosArray.value);
      
      // Unir los arrays, los artículos nuevos con los existentes
      resultados.value.articles = [...nuevosArticulosArray.value, ...resultados.value.articles];
      
      // Actualizar el contador
      resultados.value.total = resultados.value.articles.length;
      
      // Actualizar los gráficos con los nuevos artículos
      procesarKeywords(resultados.value.articles);
      procesarMedios(resultados.value.articles);
      
			console.log('Nuevos artículos agregados:', JSON.stringify(nuevosArticulosArray.value));
      // Limpiar el array de nuevos artículos y el contador
      nuevosArticulosArray.value = [];
      nuevosArticulos.value = 0;
    } catch (err) {
      console.error('Error al mostrar nuevos artículos:', err);
    }
  }
};

// Función que sirve para agregar los artículos nuevos
const addArticles = (newArticles) => {
  if (!newArticles || !Array.isArray(newArticles) || newArticles.length === 0) return;
  
  try {
    // Filtrar artículos válidos
    const validArticles = newArticles.filter(article => article && article.link);
    
    if (validArticles.length === 0) return;
    
    // Verificar si los artículos ya existen, añadir solo los nuevos
    validArticles.forEach(article => {
      // Verificar si el artículo ya existe en el array principal
      const existingIndex = resultados.value.articles.findIndex(
        existingArticle => existingArticle && existingArticle.link === article.link
      );
      
      // Verificar si ya está en el array de nuevos artículos
      const existsInNew = nuevosArticulosArray.value.some(
        newArticle => newArticle && newArticle.link === article.link
      );
      
      // Solo añadir si es completamente nuevo
      if (existingIndex === -1 && !existsInNew) {
        nuevosArticulosArray.value.push(article);
        nuevosArticulos.value++;
      }
    });
    
    console.log(`Se han encontrado ${nuevosArticulos.value} artículos nuevos`);
  } catch (err) {
    console.error('Error al añadir nuevos artículos:', err);
  }
};

// Función para actualizar los artículos periódicamente
const actualizarArticulos = async () => {
  if (!resultados.value || actualizando.value) return;
  console.log('Actualizando artículos...', new Date().toLocaleString());
  actualizando.value = true;
  console.log('Actualizando artículos...');
  
  try {
    // Si es un solo medio, obtener URL de resultados
    const urlActual = resultados.value.source !== 'Múltiples medios' 
      ? asegurarHttps(resultados.value.source.includes("http") ? resultados.value.source : url.value) 
      : null;
    
    if (urlActual) {
      // Realizar solicitud a la API para obtener los últimos artículos
      const response = await axios.post('https://servicio-competencias.vercel.app/analizar-sitio', {
        url: urlActual
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Procesar los nuevos artículos
      if (response.data && response.data.articles) {
        // Enriquecer los artículos con metadatos básicos
        response.data.articles.forEach(article => {
          if (!article) return;
          
          if (!article.source) {
            try {
              if (article.link) {
                const urlObj = new URL(article.link);
                const hostname = urlObj.hostname;
                article.source = hostname
                  .replace(/^www\./, '')
                  .split('.')
                  .slice(0, -1)
                  .join('.')
                  .split(/[.-]/)
                  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ');
              }
            } catch (err) {
              console.warn('Error al asignar fuente a nuevo artículo:', err);
            }
          }
        });
        
        // Llamar a la función para procesar los nuevos artículos
        addArticles(response.data.articles);
      }
    } else {
      // Si es múltiples medios
      const urls = multipleResults.value.map(result => result.url).filter(Boolean);
      
      if (urls.length === 0) {
        console.warn('No hay URLs para actualizar en múltiples medios');
        return;
      }
      
      for (const currentUrl of urls) {
        try {
          const newResponse = await axios.post(
            'https://servicio-competencias.vercel.app/analizar-sitio',
            { url: currentUrl },
            { headers: { 'Content-Type': 'application/json' } }
          );
          
          // Validar que hayan datos y artículos en la respuesta
          if (newResponse.data && newResponse.data.articles && Array.isArray(newResponse.data.articles)) {
            // Enriquecer los artículos con la fuente
            newResponse.data.articles.forEach(article => {
              if (!article) return;
              
              // Asignar la fuente si no la tiene
              if (!article.source) {
                try {
                  // Obtener de la URL del artículo
                  if (article.link) {
                    const urlObj = new URL(article.link);
                    const hostname = urlObj.hostname;
                    article.source = hostname
                      .replace(/^www\./, '')
                      .split('.')
                      .slice(0, -1)
                      .join('.')
                      .split(/[.-]/)
                      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                      .join(' ');
                  } else {
                    // Asignar del nombre del medio
                    const mediaName = multipleResults.value.find(m => m.url === currentUrl)?.name;
                    if (mediaName) {
                      article.source = mediaName;
                    }
                  }
                } catch (err) {
                  console.warn('Error al asignar fuente a artículo de medio múltiple:', err);
                }
              }
            });
            
            // Añadir los artículos al listado de nuevos
            addArticles(newResponse.data.articles);

						console.log(`Actualización completada. Encontrados ${nuevosArticulos.value} artículos nuevos.`);
if (nuevosArticulos.value > 0) {
  console.log(`Nuevos artículos pendientes de mostrar: ${nuevosArticulos.value}`);
}
          }
        } catch (err) {
          console.error(`Error al actualizar medio ${currentUrl}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error al actualizar los artículos:', err);
		
  } finally {
    actualizando.value = false;
  }
};

// Observar cambios en resultados para procesar los gráficos
watch(() => resultados.value?.articles, (newArticles) => {
  if (newArticles && newArticles.length > 0) {
    procesarKeywords(newArticles);
    procesarMedios(newArticles);
  } else {
    // Limpiar gráficos si no hay artículos
    topKeywords.value = [];
    mediaDistribution.value = [];
  }
}, { deep: true });

// Limpiar el intervalo antes de desmontar el componente
onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
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

.progress-snackbar {
  left: 50% !important;
  transform: translateX(-50%) !important;
  
  .v-snackbar__wrapper {
    opacity: 1 !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  }
}
</style>
