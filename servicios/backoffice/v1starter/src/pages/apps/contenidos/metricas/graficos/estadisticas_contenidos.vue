<script setup>
import axios from 'axios'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import esLocale from "moment/locale/es"
import { computed, onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

defineOptions({
  name: 'EstadisticasContenido',
})

const loadingGlobal = ref(false);

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])

const theme = useTheme()
const isDark = computed(() => theme.current.value.dark)

const state = ref({

  userData: {
    anonimos: 0,
    registrados: 0,
    suscritos: 0,
    totalUsuariosUnicos: 0,
  },
  

  statsData: {
    secciones: [],
    subsecciones: [],
    estadisticasGenerales: {
      totalVisitas: 0
    }
  },

  dateRange: {
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  },
  
 
  rules: [],
  selectedRule: null,
  selectedSection: null,
  selectedSubsection: null,
  selectedUrl: null,
  
 
  activeTab: 'registrado',
  activeInnerTab: 'secciones',
  

  urlsData: {
    totalUrls: 0,
    urls: []
  },
  

  visitantesData: [],
  
  isLoadingUrls: false,
  showVisitantesModal: false,
  chartKey: 0,
  

  initialLoadComplete: false,   
  selectedSectionSet: false,     
  loadingVisitantes: null,       
})
const shouldShowSections = computed(() => 
  state.value.statsData.secciones.length > 1
)

const getSortedSections = computed(() => {
  if (!state.value.statsData.secciones.length) return []
  return [...state.value.statsData.secciones].sort((a, b) => {
    const totalA = a.porTipoUsuario[state.value.activeTab] || 0
    const totalB = b.porTipoUsuario[state.value.activeTab] || 0
    return totalB - totalA
  })
})

const getSortedSubsections = computed(() => {
  if (!state.value.statsData.subsecciones.length) return []
  
  const currentSection = state.value.selectedSection || 
    (state.value.statsData.secciones.length === 1 ? state.value.statsData.secciones[0].seccion : null)
  
  if (!currentSection) return []
  
  let subsecciones = state.value.statsData.subsecciones
    .filter(sub => sub.seccion === currentSection)
    .sort((a, b) => {
      const totalA = a.porTipoUsuario[state.value.activeTab] || 0
      const totalB = b.porTipoUsuario[state.value.activeTab] || 0
      return totalB - totalA
    })

  const urlsSinSubseccion = state.value.urlsData.urls?.filter(url => 
    url.seccion === currentSection && (!url.subseccion || url.subseccion.trim() === '')
  ) || []

  if (urlsSinSubseccion.length > 0) {
    subsecciones.push({
      seccion: currentSection,
      subseccion: 'notas-sin-subseccion',
      porTipoUsuario: {
        [state.value.activeTab]: urlsSinSubseccion.length
      }
    })
  }

  return subsecciones
})


const filteredUrls = computed(() => {
  if (!state.value.urlsData.urls?.length) return []
  
  const currentSection = state.value.selectedSection || 
    (state.value.statsData.secciones.length === 1 ? state.value.statsData.secciones[0].seccion : null)

  if (!currentSection) return []


  const urlMap = new Map()
  
  state.value.urlsData.urls
    .filter(url => {
      if (url.seccion !== currentSection) return false
      if (state.value.selectedSubsection === 'notas-sin-subseccion') {
        return !url.subseccion || url.subseccion.trim() === ''
      }
      return state.value.selectedSubsection ? 
        url.subseccion === state.value.selectedSubsection : true
    })
    .forEach(url => {
      const key = url.url
      if (urlMap.has(key)) {
        urlMap.get(key).visitas++
      } else {
        urlMap.set(key, { ...url, visitas: 1 })
      }
    })

  return Array.from(urlMap.values()).sort((a, b) => b.visitas - a.visitas)
})

const showNoDataMessage = computed(() => {
  return !state.value.isLoadingUrls && 
         state.value.hasLoadedInitialData && 
         state.value.selectedSection && 
         ((state.value.activeInnerTab === 'secciones' && !getSortedSubsections.value.length) || 
          (state.value.activeInnerTab === 'urls' && !filteredUrls.value.length))
})

const noDataMessage = computed(() => {
  if (state.value.statsData.secciones.length > 1 && !state.value.selectedSection) {
    return 'Selecciona una sección'
  }
  return state.value.activeInnerTab === 'secciones' ? 
    'No hay subsecciones disponibles' : 
    'No hay URLs disponibles'
})

const fetchData = async () => {
  if (!state.value.selectedRule?.id) return

  try {
    loadingGlobal.value = true;
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const [responseUsers, responseStats] = await Promise.all([
      axios.get(`${baseUrl}/${state.value.selectedRule.id}?startDate=${state.value.dateRange.start}&endDate=${state.value.dateRange.end}`),
      axios.get(`${baseUrl}/${state.value.selectedRule.id}/secciones-stats?startDate=${state.value.dateRange.start}&endDate=${state.value.dateRange.end}&format=json`)
    ])
    
    if (responseUsers.data.resp && responseUsers.data.data?.metricasPorTipoUsuario) {
      const metrics = responseUsers.data.data.metricasPorTipoUsuario
      state.value.userData = {
        anonimos: metrics.anonimo?.usuariosUnicos || 0,
        registrados: metrics.registrado?.usuariosUnicos || 0,
        suscritos: metrics.suscrito?.usuariosUnicos || 0,
        totalUsuariosUnicos: Object.values(metrics)
          .reduce((sum, m) => sum + (m?.usuariosUnicos || 0), 0)
      }
    }

    if (responseStats.data) {
      state.value.statsData = responseStats.data
      updateSelectedSection()
      state.value.chartKey++

      // Solo fetching URLs en carga inicial
      if (!state.value.initialLoadComplete) {
        await fetchUrlsByType()
        state.value.initialLoadComplete = true
      }
    }

    loadingGlobal.value = false;
  } catch (error) {
    console.error('Error al obtener datos:', error)
  }
}


const updateSelectedSection = () => {
  const seccionesOrdenadas = [...state.value.statsData.secciones].sort((a, b) => {
    const totalA = a.porTipoUsuario[state.value.activeTab] || 0
    const totalB = b.porTipoUsuario[state.value.activeTab] || 0
    return totalB - totalA
  })
  
  state.value.selectedSection = seccionesOrdenadas[0]?.seccion || null
}


const fetchUrlsByType = async () => {
  if (!state.value.selectedRule?.id) return
  
  state.value.isLoadingUrls = true
  
  try {
    const url = `https://restriccion-contenido.vercel.app/content-access/config/${state.value.selectedRule.id}/urls/tipo-usuario/${state.value.activeTab}?startDate=${state.value.dateRange.start}&endDate=${state.value.dateRange.end}&format=json`
    
    const response = await axios.get(url)
    if (response.data) {
      state.value.urlsData = {
        ...response.data,
        urls: response.data.urls?.map(url => ({
          ...url,
          visitas: 1
        })) || []
      }
    }
  } catch (error) {
    console.error('Error al obtener URLs:', error)
  } finally {
    state.value.isLoadingUrls = false
  }
}


const pieChartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
    foreColor: isDark.value ? '#FFFFFF' : '#000000',
    background: 'transparent',
    fontFamily: 'Public Sans, sans-serif',
    dropShadow: { enabled: false }
  },
  legend: {
    position: 'bottom',
    labels: {
      colors: isDark.value ? '#FFFFFF' : '#000000'
    },
    formatter: (seriesName, opts) => 
      state.value.statsData.secciones[opts.seriesIndex]?.seccion || ''
  },
  labels: state.value.statsData.secciones.map(seccion => seccion.seccion),
  stroke: { width: 0 },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${Math.round(val)}%`,
    style: {
      fontSize: '18px',
      fontFamily: 'Public Sans, sans-serif',
      fontWeight: '600',
      colors: [isDark.value ? '#FFFFFF' : '#000000']
    },
    dropShadow: { enabled: false }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: (value, { seriesIndex }) => 
        `${value.toFixed(1)}% (${state.value.statsData.secciones[seriesIndex]?.total || 0} visitas)`
    }
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: -10
      }
    }
  }
}))

const barChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
    foreColor: isDark.value ? '#FFFFFF' : '#000000',
    background: 'transparent',
    fontFamily: 'Public Sans, sans-serif',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => Math.round(val),
    style: {
      fontSize: '14px',
      fontFamily: 'Public Sans, sans-serif'
    }
  },
  xaxis: {
    categories: state.value.statsData.subsecciones.map(sub => sub.subseccion),
    labels: {
      style: {
        colors: isDark.value ? '#FFFFFF' : '#000000'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Número de visitas',
      style: {
        color: isDark.value ? '#FFFFFF' : '#000000'
      }
    },
    labels: {
      formatter: (val) => Math.round(val),
      style: {
        colors: isDark.value ? '#FFFFFF' : '#000000'
      }
    }
  },
  tooltip: {
    y: {
      formatter: (val) => Math.round(val)
    }
  },
  legend: {
    show: false
  },
  colors: ['#7367F0']
}))

const pieChartSeries = computed(() => {
  if (!state.value.statsData.secciones.length) return []
  const total = state.value.statsData.estadisticasGenerales.totalVisitas
  return state.value.statsData.secciones.map(seccion => (seccion.total / total) * 100)
})

const barChartSeries = computed(() => [{
  name: 'Visitas',
  data: state.value.statsData.subsecciones.map(sub => sub.total)
}])

watch(() => state.value.selectedRule, (newRule, oldRule) => {
  if (newRule?.id && newRule.id !== oldRule?.id) {
    state.value.initialLoadComplete = false
    state.value.selectedSection = null
    fetchData()
  }
})


watch(() => state.value.activeTab, async (newTab, oldTab) => {
  if (newTab === oldTab) return

  state.value.selectedSubsection = null
  state.value.activeInnerTab = 'secciones'
  
 
  updateSelectedSection()
  

  await fetchUrlsByType()
}, { flush: 'post' })


watch([() => state.value.dateRange.start, () => state.value.dateRange.end], 
  ([newStart, newEnd], [oldStart, oldEnd]) => {
    if (newStart === oldStart && newEnd === oldEnd) return
    if (state.value.selectedRule?.id) {
      state.value.initialLoadComplete = false
      fetchData()
    }
  }
)
const showUrlsForSubsection = (subseccion) => {
  state.value.selectedSubsection = subseccion
  state.value.activeInnerTab = 'urls'
}

const fetchUrlVisitantes = async (url) => {
  try {
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const requestUrl = `${baseUrl}/${state.value.selectedRule.id}/url-visitantes?url=${encodeURIComponent(url)}&startDate=${state.value.dateRange.start}&endDate=${state.value.dateRange.end}&typeUser=${state.value.activeTab}`
    
    const response = await axios.get(requestUrl)
    state.value.visitantesData = response.data || []
    state.value.showVisitantesModal = true
  } catch (error) {
    console.error('Error al obtener visitantes:', error)
  }
}

const downloadUrlVisitantes = async (url) => {
  if (!state.value.selectedRule?.id) return

  try {
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const downloadUrl = `${baseUrl}/${state.value.selectedRule.id}/url-visitantes?url=${encodeURIComponent(url)}&startDate=${state.value.dateRange.start}&endDate=${state.value.dateRange.end}&typeUser=${state.value.activeTab}&format=csv`
    
    const response = await axios.get(downloadUrl, { responseType: 'blob' })
    
    const fileName = `visitantes_URL_${state.value.dateRange.start}_${state.value.dateRange.end}.csv`
    
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error al descargar visitantes:', error)
  }
}

const downloadData = async (tipo) => {
  if (!state.value.selectedRule?.id) return

  try {
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const url = `${baseUrl}/${state.value.selectedRule.id}/tipo/${tipo}/urls?startDate=${state.value.dateRange.start}&endDate=${state.value.dateRange.end}&format=csv`
    
    const response = await axios.get(url, { responseType: 'blob' })
    const fileName = `usuarios_${tipo}_${state.value.selectedRule.name}_${state.value.dateRange.start}_${state.value.dateRange.end}.csv`
    
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error al descargar datos:', error)
  }
}

const fetchRules = async () => {
  try {
    const response = await axios.get('https://estadisticas.ecuavisa.com/sites/gestor/Tools/contenidoLimits/config_contenido.php')
    if (response.data.success && response.data.data) {
      state.value.rules = response.data.data
      if (state.value.rules.length > 0) {
        state.value.selectedRule = state.value.rules[0]
        await fetchData()
      }
    }
  } catch (error) {
    console.error('Error al cargar las reglas:', error)
  }
}

const copyToClipboard = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
  } catch (err) {
    console.error('Error al copiar URL:', err)
  }
}


onMounted(async () => {
  await fetchRules();
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardItem class="header_card_item mb-0 pb-2">
          <VCardTitle>Analítica sobre restricción de contenido</VCardTitle>
          <VCardSubtitle>Seleccione el filtro de fecha y tipo de regla</VCardSubtitle>
        </VCardItem>
        <VCardText>
          <VRow class="mt-0">
            <!-- Selector de Regla -->
            <VCol cols="12" md="6">
              <label class="mb-2 d-block">Escoge una regla:</label>
              <VSelect
                  v-model="state.selectedRule"
                  :items="state.rules"
                  item-title="name"
                  item-value="id"
                  return-object
                  hide-details
                  density="compact"
                />
              </VCol>

              <!-- Selector de Fechas -->
              <VCol cols="12" md="6">
                <label class="mb-2 d-block">Escoge rango de fechas:</label>
                <VRow>
                  <VCol cols="6" class="pe-1">
                    <VTextField
                      v-model="state.dateRange.start"
                      type="date"
                      hide-details
                      density="compact"
                      :max="state.dateRange.end"
                    />
                  </VCol>
                  <VCol cols="6" class="ps-1">
                    <VTextField
                      v-model="state.dateRange.end"
                      type="date"
                      hide-details
                      density="compact"
                      :min="state.dateRange.start"
                      :max="moment().format('YYYY-MM-DD')"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" v-if="loadingGlobal">
      <VCard class="" style="max-width: 400px;margin-left: auto;margin-right: auto;">
        <VCardText>
          <div class="d-block text-center">
            <div class="text-h5 mb-2" style="color:#7367f0;">
              Cargando información ....
            </div>
            <VProgressLinear
             style="color:#7367f0;"
                indeterminate
                color="white"
                class="mb-0"
              />
          </div>
        </VCardText>
      </VCard>
    </VCol>
      
    <VCol v-else cols="12" class="p-0 m-0">
      <VRow>
        <!-- Visitas por tipo de usuario -->
        <VCol cols="12" md="4">
          <VCard>
            <VCardItem class="header_card_item">
              <div>
                <div class="descripcion">
                  <VCardTitle>Visitas por tipo de usuario</VCardTitle>
                  <VCardSubtitle class="d-flex">
                    <b class="mr-1">Regla seleccionada: </b> 
                    <div v-if="state.selectedRule" style="color:#7367f0;">
                      {{ state.selectedRule.name.toUpperCase() }}
                    </div>
                  </VCardSubtitle>
                </div>
              </div>
            </VCardItem>
            <VCardText>
              <VRow dense>
                <!-- Anónimos -->
                <VCol cols="12">
                  <VCard variant="flat" class="user-type-card mb-3" elevation="1">
                    <VCardText class="pa-4">
                      <div class="d-flex">
                        <div class="user-type-left">
                          <div class="d-flex flex-column align-center">
                            <VIcon icon="mdi-account-outline" size="24" color="grey-darken-1" class="mb-1" />
                            <span class="text-subtitle-1">Anónimos</span>
                          </div>
                        </div>
                        <div class="user-type-right">
                          <div class="d-flex flex-column align-center text-center">
                            <span class="text-subtitle-1 font-weight-medium mb-2">
                              {{ state.userData.anonimos }} usuarios
                            </span>
                            <VBtn
                              size="small"
                              variant="flat"
                              color="primary"
                              class="custom-download-btn"
                              @click="downloadData('anonimo')"
                            >
                              <VIcon size="small" class="me-1">mdi-download</VIcon>
                              Descargar
                            </VBtn>
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>

                <!-- Registrados -->
                <VCol cols="12">
                  <VCard variant="flat" class="user-type-card mb-3" elevation="1">
                    <VCardText class="pa-4">
                      <div class="d-flex">
                        <div class="user-type-left">
                          <div class="d-flex flex-column align-center">
                            <VIcon icon="mdi-account" size="24" color="grey-darken-1" class="mb-1" />
                            <span class="text-subtitle-1">Registrados</span>
                          </div>
                        </div>
                        <div class="user-type-right">
                          <div class="d-flex flex-column align-center text-center">
                            <span class="text-subtitle-1 font-weight-medium mb-2">
                              {{ state.userData.registrados }} usuarios
                            </span>
                            <VBtn
                              size="small"
                              variant="flat"
                              color="primary"
                              class="custom-download-btn"
                              @click="downloadData('registrado')"
                            >
                              <VIcon size="small" class="me-1">mdi-download</VIcon>
                              Descargar
                            </VBtn>
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>

                <!-- Suscritos -->
                <VCol cols="12">
                  <VCard variant="flat" class="user-type-card" elevation="1">
                    <VCardText class="pa-4">
                      <div class="d-flex">
                        <div class="user-type-left">
                          <div class="d-flex flex-column align-center">
                            <VIcon icon="mdi-star" size="24" color="grey-darken-1" class="mb-1" />
                            <span class="text-subtitle-1">Suscritos</span>
                          </div>
                        </div>
                        <div class="user-type-right">
                          <div class="d-flex flex-column align-center text-center">
                            <span class="text-subtitle-1 font-weight-medium mb-2">
                              {{ state.userData.suscritos }} usuarios
                            </span>
                            <VBtn
                              size="small"
                              variant="flat"
                              color="primary"
                              class="custom-download-btn"
                              @click="downloadData('suscrito')"
                            >
                              <VIcon size="small" class="me-1">mdi-download</VIcon>
                              Descargar
                            </VBtn>
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
        <!-- Secciones visitadas -->
        <VCol cols="12" md="8">
          <VCard class="h-100">
            <VCardItem class="header_card_item">
              <div>
                <div class="descripcion">
                  <VCardTitle>Secciones visitadas</VCardTitle>
                  <VCardSubtitle class="d-flex">
                    <b class="mr-1">Regla seleccionada: </b> 
                    <div v-if="state.selectedRule" style="color:#7367f0;">
                      {{ state.selectedRule.name.toUpperCase() }}
                    </div>
                  </VCardSubtitle>
                </div>
              </div>
            </VCardItem>
            <VCardText>
              <VueApexCharts
                :key="`pie-${state.chartKey}`"
                type="pie"
                :options="pieChartOptions"
                :series="pieChartSeries"
                :labels="pieChartLabels"
                height="350"
              />
            </VCardText>
          </VCard>
        </VCol>
        <!-- Subsecciones visitadas -->
        <VCol cols="12" md="12">
          <VCard class="h-100">
            <VCardItem class="header_card_item">
              <div>
                <div class="descripcion">
                  <VCardTitle>Subsecciones visitadas</VCardTitle>
                  <VCardSubtitle class="d-flex">
                    <b class="mr-1">Regla seleccionada: </b> 
                    <div v-if="state.selectedRule" style="color:#7367f0;">
                      {{ state.selectedRule.name.toUpperCase() }}
                    </div>
                  </VCardSubtitle>
                </div>
              </div>
            </VCardItem>
            <VCardText>
              <VueApexCharts
                :key="`bar-${state.chartKey}`"
                type="bar"
                :options="barChartOptions"
                :series="barChartSeries"
                height="350"
              />
            </VCardText>
          </VCard>
        </VCol>


        <!-- Filtro de navegación -->
        <VCol cols="12">
          <VCard>
            <VCardText>
              <div class="text-h5 mt-8 mb-4 text-center text-primary">
            Filtro de navegación por tipo de usuario
          </div>
          
          <!-- Tabs como botones -->
          <div class="d-flex justify-center mb-4 gap-4">
            <VBtn
              v-for="(tipo, index) in [
                { value: 'anonimo', label: 'Visitantes anónimos' },
                { value: 'registrado', label: 'Registrados' },
                { value: 'suscrito', label: 'Suscritos' }
              ]"
              :key="index"
              :color="state.activeTab === tipo.value ? 'primary' : 'secondary'"
              :variant="state.activeTab === tipo.value ? 'elevated' : 'flat'"
              size="lg"
              class="text-uppercase px-4 py-2"
              @click="state.activeTab = tipo.value"
            >
              {{ tipo.label }}
            </VBtn>
          </div>

          <VRow>
            <!-- Lista de Secciones (condicional) -->
            <VCol 
              v-if="shouldShowSections" 
              cols="12" 
              md="4"
            >
              <VCard>
                <VCardTitle class="text-h6 pa-4">
                  Top Secciones
                </VCardTitle>
                <VCardText>
                  <VList>
                    <VListItem
                      v-for="(seccion, index) in getSortedSections"
                      :key="seccion.seccion"
                      :value="seccion"
                      @click="state.selectedSection = seccion.seccion; state.selectedSubsection = null"
                    >
                      <template v-slot:prepend>
                        <VChip
                          size="small"
                          color="primary"
                          class="mr-2"
                        >
                          #{{ index + 1 }}
                        </VChip>
                      </template>
                      
                      <VListItemTitle>
                        {{ seccion.seccion }}
                      </VListItemTitle>
                      <VListItemSubtitle>
                        {{ seccion.porTipoUsuario[state.activeTab] || 0 }} visitas
                      </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Detalle de Sección -->
            <VCol 
              :cols="12" 
              :md="shouldShowSections ? 8 : 12"
            >
              <VCard>
                <VCardTitle class="text-h6 pa-4 d-flex flex-column">
                  <div class="d-flex align-center">
                    <span class="flex-grow-1">
                      Detalle de sección: <span class="font-weight-bold primary--text">
                        {{ state.selectedSection || (state.statsData.secciones.length === 1 ? state.statsData.secciones[0].seccion : '') }}
                      </span>
                    </span>
                  </div>
                  <div v-if="state.selectedSubsection" class="text-subtitle-1 mt-2">
                    SUBSECCIÓN: <span class="font-weight-bold text-uppercase">
                      {{ state.selectedSubsection === 'notas-sin-subseccion' ? 'Notas sin subsección' : state.selectedSubsection }}
                    </span>
                  </div>
                </VCardTitle>
                
                <VTabs
                  v-model="state.activeInnerTab"
                  color="primary"
                  class="px-4"
                >
                  <VTab value="secciones">Subsecciones</VTab>
                  <VTab value="urls">URLs</VTab>
                </VTabs>

                <VCardText>
                  <VWindow v-model="state.activeInnerTab">
                    <!-- Tab de Subsecciones -->
                    <VWindowItem value="secciones">
                      <VList v-if="getSortedSubsections.length">
                        <VListItem
                          v-for="(subseccion, index) in getSortedSubsections"
                          :key="subseccion.subseccion"
                        >
                          <template v-slot:prepend>
                            <VChip
                              size="small"
                              :color="subseccion.subseccion === 'notas-sin-subseccion' ? 'warning' : 'primary'"
                              class="mr-2"
                            >
                              #{{ index + 1 }}
                            </VChip>
                          </template>
                          
                          <VListItemTitle class="d-flex align-center">
                            <span class="flex-grow-1">
                              {{ subseccion.subseccion === 'notas-sin-subseccion' ? 'Notas sin subsección' : (subseccion.subseccion || 'Sin subsección') }}
                            </span>
                            <VBtn
                              icon
                              variant="text"
                              size="small"
                              @click="showUrlsForSubsection(subseccion.subseccion)"
                            >
                              <VIcon>mdi-link-variant</VIcon>
                            </VBtn>
                          </VListItemTitle>
                          <VListItemSubtitle>
                            {{ subseccion.porTipoUsuario[state.activeTab] || 0 }} visitas
                          </VListItemSubtitle>
                        </VListItem>
                      </VList>
                      <VAlert
                        v-else-if="showNoDataMessage"
                        type="info"
                        variant="tonal"
                        class="mt-2"
                      >
                        {{ noDataMessage }}
                      </VAlert>
                    </VWindowItem>

                    <!-- Tab de URLs -->

                    <VWindowItem value="urls">
                      <VCard flat>
                        <VCardText>
                          <div v-if="state.isLoadingUrls" class="d-flex justify-center pa-4">
                            <VProgressCircular
                              indeterminate
                              color="primary"
                              :size="32"
                              :width="3"
                            />
                          </div>
                          
                          <div v-else>
                            <VList v-if="filteredUrls.length">
                              <VListItem
                                v-for="(url, index) in filteredUrls"
                                :key="index"
                                class="url-item"
                              >
                                <VListItemTitle class="text-body-2 d-flex align-center justify-space-between">
                                  <div class="text-truncate flex-grow-1">
                                    {{ url.url }}
                                  </div>
                                
                                </VListItemTitle>
                                
                                <VListItemSubtitle class="d-flex align-center flex-wrap gap-2 mt-2">
                                  <template v-if="state.activeTab !== 'anonimo'">
                                    <VChip
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    class="ms-2"
                                  >
                                    {{ url.visitas }} visitas
                                  </VChip>
                                    <VBtn
                                      size="small"
                                      variant="text"
                                      color="primary"
                                      :loading="state.loadingVisitantes === url.url"
                                      @click="fetchUrlVisitantes(url.url)"
                                    >
                                      <VIcon size="small" class="me-1">mdi-eye</VIcon>
                                      Ver
                                    </VBtn>
                                    <VBtn
                                      size="small"
                                      variant="text"
                                      color="primary"
                                      @click="downloadUrlVisitantes(url.url)"
                                    >
                                      <VIcon size="small" class="me-1">mdi-download</VIcon>
                                      Descargar
                                    </VBtn>
                                    <VBtn
                                      size="small"
                                      variant="text"
                                      color="primary"
                                      @click="copyToClipboard(url.url)"
                                    >
                                      <VIcon size="small" class="me-1">mdi-content-copy</VIcon>
                                      Copiar
                                    </VBtn>
                                  </template>
                                </VListItemSubtitle>
                              </VListItem>
                            </VList>
                            
                            <VAlert
                              v-else
                              type="info"
                              variant="tonal"
                              class="mt-2"
                            >
                              {{ noDataMessage }}
                            </VAlert>
                          </div>
                        </VCardText>
                      </VCard>
                    </VWindowItem>
                  </VWindow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>

    <!-- Modal de Visitantes -->
    <VDialog
      v-model="state.showVisitantesModal"
      width="600"
    >
      <VCard>
        <VCardTitle class="pa-4 d-flex justify-space-between align-center">
          <div class="d-flex flex-column">
            <span>Visitantes de URL</span>
            <span class="text-caption text-medium-emphasis mt-1">{{ state.selectedUrl }}</span>
          </div>
          <VBtn
            icon
            variant="text"
            size="small"
            @click="state.showVisitantesModal = false"
          >
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VCardTitle>
        
        <VCardText>
          <!-- Estadísticas -->
          <div class="d-flex gap-4 mb-4">
            <VChip
              color="primary"
              variant="outlined"
            >
              Total visitas: {{ state.visitantesData.estadisticas?.totalVisitas || 0 }}
            </VChip>
            <VChip
              color="primary"
              variant="outlined"
            >
              Total visitantes: {{ state.visitantesData.estadisticas?.totalVisitantes || 0 }}
            </VChip>
          </div>

          <!-- Timeline -->
          <VTimeline
            align="start"
            line-thickness="2"
            density="compact"
          >
            <VTimelineItem
              v-for="(visitante, index) in state.visitantesData.visitantes"
              :key="index"
              dot-color="primary"
              size="small"
            >
              <VCard variant="tonal" class="mb-3">
                <VCardText class="py-2">
                  <div class="d-flex flex-column gap-1">
                    <div class="text-subtitle-1">
                      {{ visitante.nombre }} {{ visitante.apellido }}
                    </div>
                    <div class="text-body-2">
                      <strong>Visitas:</strong> {{ visitante.conteoVisitas }}
                    </div>
                    <div class="text-body-2">
                      <strong>Última visita:</strong> {{ visitante.fechasVisita[0] }}
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VTimelineItem>
          </VTimeline>

          <!-- Mensaje si no hay visitantes -->
          <VAlert
            v-if="!state.visitantesData.visitantes?.length"
            type="info"
            variant="tonal"
            class="mt-2"
          >
            No hay visitantes registrados en el período seleccionado
          </VAlert>
        </VCardText>
      </VCard>
    </VDialog>
  </VRow>
</template>
<style scoped>
:root {
  --primary-color: rgb(115, 103, 240);
  --primary-alpha-08: rgba(115, 103, 240, 0.08);
  --primary-alpha-16: rgba(115, 103, 240, 0.16);
  --border-color: v-bind('isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"');
  --bg-color: v-bind('isDark ? "#1E1E1E" : "#F8F8F8"');
}

.user-type-card {
  border: 1px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px v-bind('isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"') !important;
}

.user-type-left,
.user-type-right {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 12px;
}

.user-type-right {
  padding-left: 12px;
  border-left: 1px solid var(--border-color);
}

.custom-download-btn {
  background-color: var(--primary-alpha-08) !important;
  min-width: 110px;
  color: var(--primary-color) !important;
}

.custom-download-btn:hover {
  background-color: var(--primary-alpha-16) !important;
}

:deep(.v-field) {
  border-radius: 4px;
}

:deep(.v-text-field .v-input__control) {
  min-height: unset;
}

:deep(.v-list-item) {
  cursor: pointer;
}

:deep(.v-list-item:hover) {
  background-color: v-bind('isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"');
}

.escoge {
  font-size: 1rem !important;
  margin-bottom: -15px !important;
}

:deep(.apexcharts-menu-icon) {
  display: none !important;
}
</style>