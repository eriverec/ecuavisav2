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
  
  const moment = extendMoment(Moment)
  moment.locale('es', [esLocale])
  
  const theme = useTheme()
  const isDark = computed(() => theme.current.value.dark)
  
  const userData = ref({
    anonimos: 0,
    registrados: 0,
    suscritos: 0,
    totalUsuariosUnicos: 0,
  })
  
  const statsData = ref({
    secciones: [],
    subsecciones: [],
    estadisticasGenerales: {
      totalVisitas: 0
    }
  })
  
  const dateRange = ref({
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  })
  
  const rules = ref([])
  const selectedRule = ref(null)
  const chartKey = ref(0)
  
  //Seccion CONDICIONAL

  const activeTab = ref('anonimo')
  const activeInnerTab = ref('secciones')
  const selectedSection = ref(null)
  const selectedSubsection = ref(null)
  const urlsData = ref({
    totalUrls: 0,
    urls: []
  })
  const showVisitantesModal = ref(false)
const selectedUrl = ref(null)
const visitantesData = ref([])

  const shouldShowSections = computed(() => 
  statsData.value.secciones.length > 1
)

// Función para obtener los visitantes de una URL
const fetchUrlVisitantes = async (url) => {
  try {
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const requestUrl = `${baseUrl}/${selectedRule.value.id}/url-visitantes?url=${encodeURIComponent(url)}&startDate=${dateRange.value.start}&endDate=${dateRange.value.end}&typeUser=${activeTab.value}`
    
    const response = await axios.get(requestUrl)
    visitantesData.value = response.data || []
    showVisitantesModal.value = true
  } catch (error) {
    console.error('Error al obtener visitantes:', error)
  }
}
// Función para ordenar secciones por total de visitas
const getSortedSections = computed(() => {
  if (!statsData.value.secciones.length) return []
  return [...statsData.value.secciones].sort((a, b) => {
    const totalA = a.porTipoUsuario[activeTab.value] || 0
    const totalB = b.porTipoUsuario[activeTab.value] || 0
    return totalB - totalA
  })
})

// ordenar subsecciones por total de visitas
const getSortedSubsections = computed(() => {
  if (!statsData.value.subsecciones.length) return []
  
  const currentSection = selectedSection.value || 
    (statsData.value.secciones.length === 1 ? statsData.value.secciones[0].seccion : null)
  
  if (!currentSection) return []
  
  let subsecciones = statsData.value.subsecciones
    .filter(sub => sub.seccion === currentSection)
    .sort((a, b) => {
      const totalA = a.porTipoUsuario[activeTab.value] || 0
      const totalB = b.porTipoUsuario[activeTab.value] || 0
      return totalB - totalA
    })

    const urlsSinSubseccion = urlsData.value.urls?.filter(url => 
    url.seccion === currentSection && (!url.subseccion || url.subseccion.trim() === '')
  ) || []

  if (urlsSinSubseccion.length > 0) {
    subsecciones.push({
      seccion: currentSection,
      subseccion: 'notas-sin-subseccion',
      porTipoUsuario: {
        [activeTab.value]: urlsSinSubseccion.length
      }
    })
  }

  return subsecciones
})

// Filtrar URLs por subsección
const filteredUrls = computed(() => {
  if (!urlsData.value.urls || !urlsData.value.urls.length) return []
  
  const currentSection = selectedSection.value || 
    (statsData.value.secciones.length === 1 ? statsData.value.secciones[0].seccion : null)

  if (!currentSection) return []

  // Primero filtramos las URLs por sección y subsección
  const filteredBySection = urlsData.value.urls.filter(url => {
    // Primero verificamos que sea de la sección actual
    if (url.seccion !== currentSection) return false

    // Si estamos buscando notas sin subsección
    if (selectedSubsection.value === 'notas-sin-subseccion') {
      return !url.subseccion || url.subseccion.trim() === ''
    }

    // Si hay una subsección seleccionada, filtramos por ella
    if (selectedSubsection.value) {
      return url.subseccion === selectedSubsection.value
    }

    // Si no hay subsección seleccionada, mostramos todas las URLs de la sección
    return true
  })

  // Ahora agrupamos las URLs y contamos sus visitas
  const urlsMap = new Map()
  
  filteredBySection.forEach(url => {
    if (urlsMap.has(url.url)) {
      const existingUrl = urlsMap.get(url.url)
      existingUrl.visitas += 1
    } else {
      urlsMap.set(url.url, {
        ...url,
        visitas: 1
      })
    }
  })

  // Convertimos el Map a Array y ordenamos por número de visitas
  const groupedUrls = Array.from(urlsMap.values())
  return groupedUrls.sort((a, b) => b.visitas - a.visitas)
})

const showUrlsForSubsection = (subseccion) => {
  selectedSubsection.value = subseccion
  activeInnerTab.value = 'urls'
}

// obtener URLs por tipo de usuario
const fetchUrlsByType = async () => {
  if (!selectedRule.value?.id) return

  try {
    const url = `https://restriccion-contenido.vercel.app/content-access/config/${selectedRule.value.id}/urls/tipo-usuario/${activeTab.value}?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}&format=json`
    const response = await axios.get(url)
    if (response.data) {
      urlsData.value = response.data
    }
  } catch (error) {
    console.error('Error al obtener URLs:', error)
  }
}


const downloadUrlVisitantes = async (url) => {
  if (!selectedRule.value?.id) return

  try {
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const downloadUrl = `${baseUrl}/${selectedRule.value.id}/url-visitantes?url=${encodeURIComponent(url)}&startDate=${dateRange.value.start}&endDate=${dateRange.value.end}&typeUser=${activeTab.value}&format=csv`
    
    const response = await axios.get(downloadUrl, { responseType: 'blob' })
    
    const urlObj = new URL(url)
    const urlPath = urlObj.pathname.split('/').pop()
    const fileName = `visitantes_URL_${dateRange.value.start}_${dateRange.value.end}.csv`
//  const fileName = `visitantes_${urlPath}_${dateRange.value.start}_${dateRange.value.end}.csv`
    
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al descargar visitantes:', error)
  }
}

watch(activeTab, async () => {
  selectedSection.value = null
  selectedSubsection.value = null
  activeInnerTab.value = 'secciones'
  await fetchUrlsByType()
})

watch(activeInnerTab, () => {
  if (activeInnerTab.value === 'secciones') {
    selectedSubsection.value = null
  }
})


const copyToClipboard = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    // Aquí podrías mostrar una notificación de éxito
  } catch (err) {
    console.error('Error al copiar URL:', err)
  }
}



// fin SECCION CONDICIONAL


 // Pie para secciones
  const pieChartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
    foreColor: isDark.value ? '#FFFFFF' : '#000000',
    background: 'transparent',
    fontFamily: 'Public Sans, sans-serif',
    dropShadow: {
      enabled: false
    }
  },
  legend: {
    position: 'bottom',
    labels: {
      colors: isDark.value ? '#FFFFFF' : '#000000'
    },
    formatter: function(seriesName, opts) {
      return statsData.value.secciones[opts.seriesIndex]?.seccion || ''
    }
  },
  labels: statsData.value.secciones.map(seccion => seccion.seccion),
  stroke: { width: 0 },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${Math.round(val)}%`,
    style: {
      fontSize: '24px', 
      fontFamily: 'Public Sans, sans-serif',
      fontWeight: '600',
      colors: [isDark.value ? '#FFFFFF' : '#000000']
    },
    dropShadow: {
      enabled: false
    }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: function(value, { seriesIndex }) {
        return `${value.toFixed(1)}% (${statsData.value.secciones[seriesIndex]?.total || 0} visitas)`
      }
    }
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: -10, 
      }
    }
  }
}))
  
  const pieChartSeries = computed(() => {
    if (!statsData.value.secciones.length) return []
    const total = statsData.value.estadisticasGenerales.totalVisitas
    return statsData.value.secciones.map(seccion => (seccion.total / total) * 100)
  })
  
  const pieChartLabels = computed(() => 
    statsData.value.secciones.map(seccion => seccion.seccion)
  )
  
  // Barras para subsecciones

const barChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 350,
    foreColor: isDark.value ? '#FFFFFF' : '#000000',
    background: 'transparent',
    fontFamily: 'Public Sans, sans-serif',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return Math.round(val)
    },
    style: {
      fontSize: '14px',
      fontFamily: 'Public Sans, sans-serif'
    }
  },
  xaxis: {
    categories: statsData.value.subsecciones.map(sub => sub.subseccion),
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
      formatter: function(val) {
        return Math.round(val)
      },
      style: {
        colors: isDark.value ? '#FFFFFF' : '#000000'
      }
    }
  },
  tooltip: {
    y: {
      formatter: function(val) {
        return Math.round(val)
      }
    }
  },
  legend: {
    show: false
  },
  colors: ['#7367F0']
}))
  const barChartSeries = computed(() => [{
    name: 'Visitas',
    data: statsData.value.subsecciones.map(sub => sub.total)
  }])
  
  const fetchRules = async () => {
    try {
      const response = await axios.get('https://estadisticas.ecuavisa.com/sites/gestor/Tools/contenidoLimits/config_contenido.php')
      if (response.data.success && response.data.data) {
        rules.value = response.data.data
        if (rules.value.length > 0) {
          selectedRule.value = rules.value[0]
          await fetchData()
        }
      }
    } catch (error) {
      console.error('Error al cargar las reglas:', error)
    }
  }
  
  const fetchData = async () => {
    if (!selectedRule.value?.id) return
  
    try {
      // Obtener datos de usuarios
      const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
      const urlUsers = `${baseUrl}/${selectedRule.value.id}?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`
      
      // Obtener datos de secciones/subsecciones
      const urlStats = `https://restriccion-contenido.vercel.app/content-access/config/${selectedRule.value.id}/secciones-stats?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}&format=json`
      
      const [responseUsers, responseStats] = await Promise.all([
        axios.get(urlUsers),
        axios.get(urlStats)
      ])
      
      if (responseUsers.data.resp && responseUsers.data.data?.metricasPorTipoUsuario) {
        const metrics = responseUsers.data.data.metricasPorTipoUsuario
        userData.value = {
          anonimos: metrics.anonimo?.usuariosUnicos || 0,
          registrados: metrics.registrado?.usuariosUnicos || 0,
          suscritos: metrics.suscrito?.usuariosUnicos || 0,
          totalUsuariosUnicos: (metrics.anonimo?.usuariosUnicos || 0) +
                             (metrics.registrado?.usuariosUnicos || 0) +
                             (metrics.suscrito?.usuariosUnicos || 0)
        }
      }
  
      if (responseStats.data) {
        statsData.value = responseStats.data
        chartKey.value += 1
      }
    } catch (error) {
      console.error('Error al obtener datos:', error)
    }
  }
  
  const downloadData = async (tipo) => {
    if (!selectedRule.value?.id) return
  
    try {
      const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
      const url = `${baseUrl}/${selectedRule.value.id}/tipo/${tipo}/urls?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}&format=csv`
      
      const response = await axios.get(url, { responseType: 'blob' })
      
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', `usuarios_${tipo}_${selectedRule.value.name}_${dateRange.value.start}_${dateRange.value.end}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error al descargar datos:', error)
    }
  }
  
  const downloadAllData = async () => {
    if (!selectedRule.value?.id) return
  
    try {
      const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
      const url = `${baseUrl}/${selectedRule.value.id}/todos?format=csv&startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`
      
      const response = await axios.get(url, { responseType: 'blob' })
      
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = downloadUrl
      link.setAttribute('download', `todos_los_datos_${selectedRule.value.id}_${dateRange.value.start}_${dateRange.value.end}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error al descargar todos los datos:', error)
    }
  }
  
  watch([dateRange, selectedRule], () => {
    if (selectedRule.value?.id) {
      fetchData()
    }
  }, { deep: true })
  
  onMounted(async () => {
    await fetchRules()
  })

  // Modificar el watch de activeTab para incluir la selección automática
watch(activeTab, async () => {
  if (statsData.value.secciones.length === 1) {
    selectedSection.value = statsData.value.secciones[0].seccion
  } else {
    selectedSection.value = null
  }
  selectedSubsection.value = null
  activeInnerTab.value = 'secciones'
  await fetchUrlsByType()
})

// Añadir watch para statsData para manejar la selección automática inicial
watch(() => statsData.value.secciones, (newSecciones) => {
  if (newSecciones.length === 1) {
    selectedSection.value = newSecciones[0].seccion
  }
}, { immediate: true })
  </script>

<template>
          <VRow>
          
            <VCol cols="12">
              <VRow class="align-center">
                <!-- Selector de Regla -->
                <VCol cols="12" md="6">
                  <VCardText class="text-subtitle-2 escoge px-0">
                    Escoge una regla:
                  </VCardText>
                  <VSelect
                    v-model="selectedRule"
                    :items="rules"
                    item-title="name"
                    item-value="id"
                    return-object
                    hide-details
                    density="compact"
                  />
                </VCol>
        
                <!-- Selector de Fechas -->
                <VCol cols="12" md="6">
                  <VCardText class="text-subtitle-2 escoge px-0">
                    Escoge rango de fechas:
                  </VCardText>
                  <VRow>
                    <VCol cols="6" class="pe-1">
                      <VTextField
                        v-model="dateRange.start"
                        type="date"
                        hide-details
                        density="compact"
                        :max="dateRange.end"
                      />
                    </VCol>
                    <VCol cols="6" class="ps-1">
                      <VTextField
                        v-model="dateRange.end"
                        type="date"
                        hide-details
                        density="compact"
                        :min="dateRange.start"
                        :max="moment().format('YYYY-MM-DD')"
                      />
                    </VCol>
                  </VRow>
                </VCol>
              </VRow>
            </VCol>
        
          
            <VCol cols="12" class="mb-6 d-flex align-items-center justify-content-center py-3 px-3">
              <div class="d-inline-flex align-items-center text-center">

            
                <div class="text-h5 mb-4 text-center">Estadísticas de: </div>
                <div v-if="selectedRule" class="text-h5" style="color:#7367f0;">
                  {{ selectedRule.name }}
                </div>
              </div>
            </VCol>
        
            <!-- Estadísticas -->
            <VCol cols="12">
            
              <div class="text-h5 mb-4 text-center text-primary">Visitas por tipo de usuario</div>
              <VRow>
                <!-- Anónimos -->
                <VCol cols="12" md="4">
                  <div class="stat-card">
                    <VIcon 
                      icon="mdi-account-outline" 
                      size="48" 
                      class="mb-3" 
                      :color="'#969696'"
                    />
                    <div class="text-subtitle-1 mb-2">Anónimos</div>
                    <div class="text-h4 mb-3">{{ userData.anonimos }}</div>
                    <VBtn
                      size="large"
                      variant="flat"
                      :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                      class="download-btn"
                      @click="downloadData('anonimo')"
                    >
                      <VIcon 
                        icon="mdi-download" 
                        size="20" 
                        class="me-2"
                      />
                      Descargar
                    </VBtn>
                  </div>
                </VCol>
        
                <!-- Registrados -->
                <VCol cols="12" md="4">
                  <div class="stat-card">
                    <VIcon 
                      icon="mdi-account" 
                      size="48" 
                      class="mb-3" 
                      :color="'#2927B9'"
                    />
                    <div class="text-subtitle-1 mb-2">Registrados</div>
                    <div class="text-h4 mb-3">{{ userData.registrados }}</div>
                    <VBtn
                      size="large"
                      variant="flat"
                      :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                      class="download-btn"
                      @click="downloadData('registrado')"
                    >
                      <VIcon 
                        icon="mdi-download" 
                        size="20" 
                        class="me-2"
                      />
                      Descargar
                    </VBtn>
                  </div>
                </VCol>
        
                <!-- Suscritos -->
                <VCol cols="12" md="4">
                  <div class="stat-card">
                    <VIcon 
                      icon="mdi-star" 
                      size="48" 
                      class="mb-3" 
                      :color="'#FCD206'"
                    />
                    <div class="text-subtitle-1 mb-2">Suscritos</div>
                    <div class="text-h4 mb-3">{{ userData.suscritos }}</div>
                    <VBtn
                      size="large"
                      variant="flat"
                      :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                      class="download-btn"
                      @click="downloadData('suscrito')"
                    >
                      <VIcon 
                        icon="mdi-download" 
                        size="20" 
                        class="me-2"
                      />
                      Descargar
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
        
              <!-- Gráficos -->
              <VRow class="mt-6">
                <!-- Secciones -->
                <VCol cols="12" md="6">
                  <VCard>
                    <VCardTitle class="text-h5 pa-4 mb-2 text-primary">
                      Secciones visitadas
                      <div v-if="selectedRule" class="text-subtitle-2">
                      Regla: {{ selectedRule.name }}
                    </div>
                    </VCardTitle>
                    
                    <VCardText>
                      <VueApexCharts
                        :key="`pie-${chartKey}`"
                        type="pie"
                        :options="pieChartOptions"
                        :series="pieChartSeries"
                        :labels="pieChartLabels"
                        height="350"
                      />
                    </VCardText>
                  </VCard>
                </VCol>
        
                <!--Subsecciones -->
                <VCol cols="12" md="6">
                  <VCard>
                    <VCardTitle class="text-h5 pa-4 mb-2 text-primary">
                      Subsecciones visitadas
                      <div v-if="selectedRule" class="text-subtitle-2">
                      Regla: {{ selectedRule.name }}
                    </div>
                    </VCardTitle>
                    
                    
                    <VCardText>
                      <VueApexCharts
                        :key="`bar-${chartKey}`"
                        type="bar"
                        :options="barChartOptions"
                        :series="barChartSeries"
                        height="350"
                      />
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>

              <!-- Botón Descargar Todos -->
              <!-- <VBtn
                block
                :color="isDark ? 'white' : 'primary'"
                :class="isDark ? 'text-primary' : 'text-white'"
                class="mt-6"
                @click="downloadAllData"
              >
                <VIcon icon="mdi-download" class="me-2" />
                DESCARGAR TODOS
              </VBtn> -->
            </VCol>
          </VRow>
      <!-- Detalles secciones, subsecciones y urls -->
      <VCol cols="12" class="mt-6">
          <div class="text-h5 mb-4 text-center text-primary">Filtro de navegación por tipo de usuario</div>
          
          <!-- Tabs como botones -->
          <div class="d-flex justify-center mb-4 gap-4">
            <VBtn
            v-for="tipo in ['anonimo', 'registrado', 'suscrito']"
            :key="tipo"
            :color="activeTab === tipo ? 'primary' : 'secondary'"
            :variant="activeTab === tipo ? 'elevated' : 'flat'"
            size="sm"
            class="text-uppercase px-4 py-2"
            @click="activeTab = tipo"
          >
              {{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}
            </VBtn>
          </div>

          <VRow>
            <!-- Lista de Secciones (condicional) -->
            <VCol 
              v-if="statsData.secciones.length > 1" 
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
                      @click="selectedSection = seccion.seccion; selectedSubsection = null"
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
                        {{ seccion.porTipoUsuario[activeTab] || 0 }} visitas
                      </VListItemSubtitle>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Detalle de Sección -->
            <VCol 
              :cols="12" 
              :md="statsData.secciones.length > 1 ? 8 : 12"
            >
              <VCard>
                <VCardTitle class="text-h6 pa-4 d-flex flex-column">
                  <div class="d-flex align-center">
                    <span class="flex-grow-1">
                      Detalle de sección: <span class="font-weight-bold primary--text">
                        {{ selectedSection || (statsData.secciones.length === 1 ? statsData.secciones[0].seccion : '') }}
                      </span>
                    </span>
                  </div>
                  <div v-if="selectedSubsection" class="text-subtitle-1 mt-2">
                    SUBSECCIÓN: <span class="font-weight-bold text-uppercase">
                      {{ selectedSubsection === 'notas-sin-subseccion' ? 'Notas sin subsección' : selectedSubsection }}
                    </span>
                  </div>
                </VCardTitle>
                
                <VTabs
                  v-model="activeInnerTab"
                  color="primary"
                  class="px-4"
                >
                  <VTab value="secciones">Subsecciones</VTab>
                  <VTab value="urls">URLs</VTab>
                </VTabs>

                <VCardText>
                  <VWindow v-model="activeInnerTab">
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
                            {{ subseccion.porTipoUsuario[activeTab] || 0 }} visitas
                          </VListItemSubtitle>
                        </VListItem>
                      </VList>
                      <VAlert
                        v-else
                        type="info"
                        variant="tonal"
                        class="mt-2"
                      >
                        No hay subsecciones disponibles
                      </VAlert>
                    </VWindowItem>

                    <!-- Tab de URLs -->
                    <VWindowItem value="urls">
                      <VList v-if="filteredUrls.length">
                        <VListItem
                          v-for="(url, index) in filteredUrls"
                          :key="index"
                          class="url-item"
                        >
                          <VListItemTitle class="text-body-2">
                            <span class="text-truncate">
                              {{ url.url }}
                            </span>
                          </VListItemTitle>
                          <VListItemSubtitle class="d-flex align-center flex-wrap gap-2 mt-2">
                            <VChip
                              size="small"
                              color="primary"
                              variant="outlined"
                            >
                              {{ url.visitas }} visitas
                            </VChip>
                            <template v-if="activeTab !== 'anonimo'">
                              <VBtn
                                size="small"
                                variant="text"
                                color="primary"
                                @click="selectedUrl = url.url; fetchUrlVisitantes(url.url)"
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
                        No hay URLs disponibles
                      </VAlert>
                    </VWindowItem>
                  </VWindow>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      <!-- Modal de Visitantes -->
      <VDialog
        v-model="showVisitantesModal"
        width="600"
      >
        <VCard>
          <VCardTitle class="pa-4 d-flex justify-space-between align-center">
            <div class="d-flex flex-column">
              <span>Visitantes de URL</span>
              <span class="text-caption text-medium-emphasis mt-1">{{ selectedUrl }}</span>
            </div>
            <VBtn
              icon
              variant="text"
              size="small"
              @click="showVisitantesModal = false"
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
                Total visitas: {{ visitantesData.estadisticas?.totalVisitas || 0 }}
              </VChip>
              <VChip
                color="primary"
                variant="outlined"
              >
                Total visitantes: {{ visitantesData.estadisticas?.totalVisitantes || 0 }}
              </VChip>
            </div>

            <!-- Timeline -->
            <VTimeline
              align="start"
              line-thickness="2"
              density="compact"
            >
              <VTimelineItem
                v-for="(visitante, index) in visitantesData.visitantes"
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
              v-if="!visitantesData.visitantes?.length"
              type="info"
              variant="tonal"
              class="mt-2"
            >
              No hay visitantes registrados en el período seleccionado
            </VAlert>
          </VCardText>
        </VCard>
      </VDialog>
</template>

<style scoped>

  .user-stat-item {
    padding: 16px;
    border-bottom: 1px solid v-bind('isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
  }

  .user-stat-item:last-child {
    border-bottom: none;
  }

  .stat-card {
      border: 1px solid v-bind('isDark ? "#424242" : "#e0e0e0"');
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      height: 100%;
      transition: transform 0.2s;
    }

  .stat-card:hover {
      transform: translateY(-2px);
    }

  .download-btn {
      width: 100%;
      box-shadow: none !important;
      border-color: #dbdbdb;
      border-width: 1px;
      font-size: 1rem;
      padding: 12px;
    }

  .v-card-title {
      padding: 0rem;
    }

    .apexcharts-menu-icon {
      display: none!important;
    }

    :deep(.v-field) {
      border-radius: 4px;
    }

    :deep(.v-text-field .v-input__control) {
      min-height: unset;
    }

    .bg-light {
      background-color: v-bind('isDark ? "#1E1E1E" : "#F8F8F8"');
    }

    .selected-section {
    background-color: v-bind('isDark ? "#1E1E1E" : "#F8F8F8"');
  }

  :deep(.user-tabs) {
    min-height: 64px;
  }

  :deep(.user-tabs .v-tab) {
    font-size: 1.25rem;
    text-transform: none;
    min-width: 160px;
  }

  :deep(.v-list-item) {
    cursor: pointer;
  }

  :deep(.v-list-item:hover) {
    background-color: v-bind('isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"');
  }

  :deep(.v-window) {
    overflow-y: auto;
    max-height: 400px;
  }

  .url-item {
    border-bottom: 1px solid v-bind('isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
    padding: 16px;
  }

  .url-item:last-child {
    border-bottom: none;
  }

  :deep(.v-list-item__content) {
    overflow: hidden;
  }

  :deep(.user-tabs) {
    min-height: 64px;
  }

  :deep(.user-tabs .v-tab) {
    font-size: 1.25rem;
    text-transform: none;
    min-width: 160px;
  }

  :deep(.v-window) {
    overflow-y: auto;
    max-height: 400px;
  }

  :deep(.primary--text) {
    color: rgb(115, 103, 240) !important;
  }


  .escoge {
      font-size: 1rem !important;
      margin-bottom: -15px!important;
  }

  .stat-card {
    border: 1px solid v-bind('isDark ? "#424242" : "#e0e0e0"');
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    height: 100%;
    transition: transform 0.2s;
  }
</style>