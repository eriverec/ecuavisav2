<script setup>
import axios from 'axios'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import esLocale from "moment/locale/es"
import { computed, onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

defineOptions({
  name: 'EstadisticasUsertype',
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

const dateRange = ref({
  start: moment().startOf('month').format('YYYY-MM-DD'),
  end: moment().format('YYYY-MM-DD')
})

const rules = ref([])
const selectedRule = ref(null)
const chartKey = ref(0)

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
    foreColor: isDark.value ? '#FFFFFF' : '#000000',
    background: 'transparent',
    animations: {
      enabled: true,
      speed: 300,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  labels: ['Anónimos', 'Registrados', 'Suscritos'],
  colors: ['#969696', '#2927B9', '#FCD206'],
  legend: {
    position: 'bottom',
    labels: {
      colors: isDark.value ? '#FFFFFF' : '#000000'
    }
  },
  stroke: { width: 0 },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${Math.round(val)}%`,
    textAnchor: 'middle',
    style: {
      fontSize: '14px',
      fontFamily: 'inherit',
      fontWeight: 'normal',
      colors: [isDark.value ? '#FFFFFF' : '#000000']
    },
    background: {
      enabled: false,
      dropShadow: {
        enabled: false
      }
    },
    dropShadow: {
      enabled: false
    }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 200 },
      legend: { position: 'bottom' }
    }
  }]
}))

const chartSeries = computed(() => {
  const total = userData.value.anonimos + userData.value.registrados + userData.value.suscritos
  if (total === 0) return [0, 0, 0]
  
  return [
    (userData.value.anonimos / total) * 100,
    (userData.value.registrados / total) * 100,
    (userData.value.suscritos / total) * 100
  ]
})

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
    const baseUrl = 'http://localhost:8088/content-access/config'
    const url = `${baseUrl}/${selectedRule.value.id}?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`
    
    const response = await axios.get(url)
    
    if (response.data.resp && response.data.data?.metricasPorTipoUsuario) {
      const metrics = response.data.data.metricasPorTipoUsuario
      userData.value = {
        anonimos: metrics.anonimo?.usuariosUnicos || 0,
        registrados: metrics.registrado?.usuariosUnicos || 0,
        suscritos: metrics.suscrito?.usuariosUnicos || 0,
        totalUsuariosUnicos: (metrics.anonimo?.usuariosUnicos || 0) +
                           (metrics.registrado?.usuariosUnicos || 0) +
                           (metrics.suscrito?.usuariosUnicos || 0)
      }
      chartKey.value += 1
    }
  } catch (error) {
    console.error('Error al obtener datos:', error)
  }
}

const downloadData = async (tipo) => {
  if (!selectedRule.value?.id) return

  try {
    const baseUrl = 'http://localhost:8088/content-access/config'
    const url = `${baseUrl}/${selectedRule.value.id}/tipo/${tipo}?format=csv&startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`
    
    const response = await axios.get(url, { responseType: 'blob' })
    
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `datos_${tipo}_${selectedRule.value.id}_${dateRange.value.start}_${dateRange.value.end}.csv`)
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
    const baseUrl = 'http://localhost:8088/content-access/config'
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
    <!-- Selector de Regla -->
    <VCol cols="12" class="mb-6">
      <VCardTitle class="text-h5 pt-4 pb-2">
        Escoge regla de Límite de contenido
      </VCardTitle>
      <VSelect
        v-model="selectedRule"
        :items="rules"
        item-title="name"
        item-value="id"
        return-object
        class="mb-4"
        hide-details
      />
    </VCol>

    <!-- Título principal -->
    <VCol cols="12" class="mb-6">
      <div class="text-h5 text-center">Estadísticas por Tipo de Usuario</div>
    </VCol>

    <!--  Fechas -->
    <VCol cols="12" class="mb-6">
      <VRow>
        <VCol cols="12" sm="6">
          <VTextField
            v-model="dateRange.start"
            label="Fecha Inicio"
            type="date"
            :max="dateRange.end"
          />
        </VCol>
        <VCol cols="12" sm="6">
          <VTextField
            v-model="dateRange.end"
            label="Fecha Fin"
            type="date"
            :min="dateRange.start"
            :max="moment().format('YYYY-MM-DD')"
          />
        </VCol>
      </VRow>
    </VCol>

    <!-- Gráfico y Estadísticas -->
    <VCol cols="12">
      <VRow>
        <!-- Gráfico de Pastel -->
        <VCol cols="12" md="6">
          <div class="text-h6 mb-4">
            Distribución de Usuarios
            <div v-if="selectedRule" class="text-subtitle-2">
              {{ selectedRule.name }}
            </div>
          </div>
          <VueApexCharts
            :key="chartKey"
            type="pie"
            :options="chartOptions"
            :series="chartSeries"
            height="350"
          />
        </VCol>

        <!-- Estadísticas y Botones -->
        <VCol cols="12" md="6">
          <div class="text-h6 mb-4">Detalles por Tipo de Usuario</div>
          <VRow>
            <!-- Anónimos -->
            <VCol cols="12" sm="4">
              <div class="stat-card">
                <VIcon 
                  icon="mdi-account-outline" 
                  size="x-large" 
                  class="mb-2" 
                  :color="'#969696'"
                />
                <div class="text-caption mb-1">Anónimos</div>
                <div class="text-h6 mb-2">{{ userData.anonimos }}</div>
                <VBtn
                  size="small"
                  variant="flat"
                  :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                  class="download-btn"
                  @click="downloadData('anonimo')"
                >
                  <VIcon 
                    icon="mdi-download" 
                    size="small" 
                    class="me-1"
                  />
                  Descargar
                </VBtn>
              </div>
            </VCol>

            <!-- Registrados -->
            <VCol cols="12" sm="4">
              <div class="stat-card">
                <VIcon 
                  icon="mdi-account" 
                  size="x-large" 
                  class="mb-2" 
                  :color="'#2927B9'"
                />
                <div class="text-caption mb-1">Registrados</div>
                <div class="text-h6 mb-2">{{ userData.registrados }}</div>
                <VBtn
                  size="small"
                  variant="flat"
                  :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                  class="download-btn"
                  @click="downloadData('registrado')"
                >
                  <VIcon 
                    icon="mdi-download" 
                    size="small" 
                    class="me-1"
                  />
                  Descargar
                </VBtn>
              </div>
            </VCol>

            <!-- Suscritos -->
            <VCol cols="12" sm="4">
              <div class="stat-card">
                <VIcon 
                  icon="mdi-star" 
                  size="x-large" 
                  class="mb-2" 
                  :color="'#FCD206'"
                />
                <div class="text-caption mb-1">Suscritos</div>
                <div class="text-h6 mb-2">{{ userData.suscritos }}</div>
                <VBtn
                  size="small"
                  variant="flat"
                  :color="isDark ? 'grey-darken-3' : 'grey-lighten-3'"
                  class="download-btn"
                  @click="downloadData('suscrito')"
                >
                  <VIcon 
                    icon="mdi-download" 
                    size="small" 
                    class="me-1"
                  />
                  Descargar
                </VBtn>
              </div>
            </VCol>
          </VRow>

          <!-- Botón Descargar Todos -->
          <VBtn
            block
            :color="isDark ? 'white' : 'primary'"
            :class="isDark ? 'text-primary' : 'text-white'"
            class="mt-6"
            @click="downloadAllData"
          >
            <VIcon icon="mdi-download" class="me-2" />
            DESCARGAR TODOS
          </VBtn>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<style scoped>
.stat-card {
  border: 1px solid v-bind('isDark ? "#424242" : "#e0e0e0"');
  border-radius: 8px;
  padding: 16px;
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
}

:deep(.apexcharts-text tspan) {
  fill: v-bind('isDark ? "#FFFFFF" : "#000000"') !important;
}
</style>