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

  // Nuevas importaciones y variables
  const activeTab = ref('anonimo')
  const activeInnerTab = ref('secciones')
  const selectedSection = ref(null)
  const selectedSubsection = ref(null)
  const urlsData = ref({
    totalUrls: 0,
    urls: []
  })
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
  if (!statsData.value.subsecciones.length || !selectedSection.value) return []
  return statsData.value.subsecciones
    .filter(sub => sub.seccion === selectedSection.value)
    .sort((a, b) => {
      const totalA = a.porTipoUsuario[activeTab.value] || 0
      const totalB = b.porTipoUsuario[activeTab.value] || 0
      return totalB - totalA
    })
})

// filtrar URLs por subsección
const filteredUrls = computed(() => {
  if (!urlsData.value.urls) return []
  return urlsData.value.urls.filter(url => {
    if (!selectedSection.value) return false
    if (selectedSubsection.value) {
      return url.seccion === selectedSection.value && url.subseccion === selectedSubsection.value
    }
    return url.seccion === selectedSection.value
  })
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
      link.setAttribute('download', `urls_${tipo}_${selectedRule.value.id}_${dateRange.value.start}_${dateRange.value.end}.csv`)
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
  </script>
  
  <template>
    <VRow>
     
      <VCol cols="12">
        <VRow class="align-center">
          <!-- Selector de Regla -->
          <VCol cols="12" md="6">
            <VCardText class="text-subtitle-2 px-0">
              Escoge una regla
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
            <VCardText class="text-subtitle-2 px-0">
              Escoge fecha
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
        <div class="d-inline-flex align-items-center">
          <span class="text-h5 mr-2">Estadísticas de:</span>
          <div v-if="selectedRule" class="text-h5" style="color:#7367f0;">
            {{ selectedRule.name }}
          </div>
        </div>
      </VCol>
  
      <!-- Estadísticas -->
      <VCol cols="12">
        <div class="text-h6 mb-4">Visitas por tipo de usuario</div>
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
              <VCardTitle class="text-h6 pa-4">
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
              <VCardTitle class="text-h6 pa-4">
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
    <div class="text-h6 mb-4 text-center">Detalles por Tipo de Usuario</div>
    
    <!-- Tabs principales centrados -->
    <div class="d-flex justify-center mb-6">
      <VTabs
        v-model="activeTab"
        color="primary"
        class="user-tabs"
      >
        <VTab value="anonimo" class="text-h6 px-6">Anónimo</VTab>
        <VTab value="registrado" class="text-h6 px-6">Registrado</VTab>
        <VTab value="suscrito" class="text-h6 px-6">Suscrito</VTab>
      </VTabs>
    </div>

    <VRow>
      <!-- Lista de Secciones -->
      <VCol cols="12" md="6">
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

      <!-- Detalle de Sección Seleccionada -->
      <VCol cols="12" md="6" v-if="selectedSection">
        <VCard>
          <VCardTitle class="text-h6 pa-4 d-flex align-center">
            <span class="flex-grow-1">Detalle de: {{ selectedSection }}</span>
            <span v-if="selectedSubsection" class="text-subtitle-1">
              ({{ selectedSubsection }})
            </span>
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
                <VList>
                  <VListItem
                    v-for="(subseccion, index) in getSortedSubsections"
                    :key="subseccion.subseccion"
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
                    
                    <VListItemTitle class="d-flex align-center">
                      <span class="flex-grow-1">
                        {{ subseccion.subseccion || 'Sin subsección' }}
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
              </VWindowItem>

              <!-- Tab de URLs -->
              <VWindowItem value="urls">
                <VList>
                  <VListItem
                    v-for="(url, index) in filteredUrls"
                    :key="index"
                  >
                    <VListItemTitle class="d-flex align-center">
                      <a 
                        :href="url.url" 
                        target="_blank" 
                        class="text-decoration-none text-primary flex-grow-1 mr-2"
                      >
                        {{ url.url }}
                      </a>
                      <VBtn
                        icon
                        variant="text"
                        size="small"
                        @click="copyToClipboard(url.url)"
                      >
                        <VIcon>mdi-content-copy</VIcon>
                      </VBtn>
                    </VListItemTitle>
                    <VListItemSubtitle>
                      {{ url.fecha }}
                    </VListItemSubtitle>
                  </VListItem>
                </VList>
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VCol>
  </template>

  <style scoped>
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
  </style>