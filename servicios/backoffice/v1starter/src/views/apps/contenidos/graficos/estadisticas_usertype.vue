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

const userData = ref({
  anonimos: 0,
  registrados: 0,
  suscritos: 0,
  totalUsuariosUnicos: 0,
})

const dateRange = ref({
  start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
  end: moment().format('YYYY-MM-DD')
})

const rules = ref([])
const selectedRule = ref(null)

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

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
    toolbar: { show: false },
  },
  labels: ['Anónimos', 'Registrados', 'Suscritos'],
  colors: ['#969696', '#2927B9', '#FCD206'], 
  legend: {
    position: 'bottom',
    labels: {
      colors: theme?.current?.value?.colors?.text?.primary || '#000000'
    },
  },
  stroke: { width: 0 },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${Math.round(val)}%`,
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: false, 
        },
      },
    },
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: { width: 200 },
      legend: { position: 'bottom' },
    },
  }],
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

const fetchData = async () => {
  if (!selectedRule.value?.id) return

  try {
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
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
    }
  } catch (error) {
    console.error('Error al obtener datos:', error)
  }
}

const downloadData = async (tipo) => {
  if (!selectedRule.value?.id) return

  try {
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const url = `${baseUrl}/${selectedRule.value.id}/tipo/${tipo}?format=csv&startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`
    console.log('URL de descarga:', url)
    
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
    const baseUrl = 'https://restriccion-contenido.vercel.app/content-access/config'
    const url = `${baseUrl}/${selectedRule.value.id}/todos?format=csv&startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`
    console.log('URL de descarga todos:', url)
    
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

onMounted(() => {
  fetchRules()
})
</script>

<template>
  <VRow>
    <!-- Selector de Regla -->
    <VCol cols="12" class="mb-6">
      <VCard>
        <VCardTitle class="text-h5 pt-4 pb-2">
          Escoge regla de Límite de contenido
        </VCardTitle>
        <VCardText>
          <VSelect
            v-model="selectedRule"
            :items="rules"
            item-title="name"
            item-value="id"
            return-object
            class="mb-4"
            hide-details
          />
        </VCardText>
      </VCard>
    </VCol>

    <!-- Título principal -->
    <VCol cols="12" class="mb-1 d-flex align-items-center justify-content-center bg-light pl-8">
      <div class="d-inline-flex align-items-center">
        <span class="text-h5 mr-2">Estadísticas de:</span>
        <div v-if="selectedRule" class="text-h5" style="color:#7367f0;">
          {{ selectedRule.name }}
        </div>
      </div>
    </VCol>


    <!-- Selector de Fechas -->
    <VCol cols="12" class="mb-6">
      <VCard>
        <VCardText>
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
        </VCardText>
      </VCard>
    </VCol>

    <!-- Gráfico y Estadísticas -->
    <VCol cols="12">
      <VRow>
        <!-- Gráfico de Pastel -->
        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle class="pl-6 pt-4">
              Distribución de Usuarios
              <div v-if="selectedRule" class="text-subtitle-2">
                {{ selectedRule.name }}
              </div>
            </VCardTitle>
            <VCardText>
              <VueApexCharts
                v-if="chartSeries.length > 0"
                type="pie"
                :options="chartOptions"
                :series="chartSeries"
                height="350"
              />
            </VCardText>
          </VCard>
        </VCol>

        <!-- Estadísticas y Botones -->
        <VCol cols="12" md="6">
          <VCard>
            <VCardTitle class="pl-6 pt-4">
              Detalles por Tipo de Usuario
            </VCardTitle>
            <VCardText>
              <VRow>
                <!-- Anónimos -->
                <VCol cols="12" sm="4">
                  <VCard variant="flat" class="text-center pa-2 stat-card">
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
                      :color="'#f2f2f2'"
                      @click="downloadData('anonimo')"
                      class="mt-2"
                    >
                      <VIcon icon="mdi-download" size="small" class="me-1" />
                      Descargar
                    </VBtn>
                  </VCard>
                </VCol>

                <!-- Registrados -->
                <VCol cols="12" sm="4">
                  <VCard variant="flat" class="text-center pa-2 stat-card">
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
                      :color="'#f2f2f2'"
                      @click="downloadData('registrado')"
                      class="mt-2"
                    >
                      <VIcon icon="mdi-download" size="small" class="me-1" />
                      Descargar
                    </VBtn>
                  </VCard>
                </VCol>

                <!-- Suscritos -->
                <VCol cols="12" sm="4">
                  <VCard variant="flat" class="text-center pa-2 stat-card">
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
                      :color="'#f2f2f2'"
                      @click="downloadData('suscrito')"
                      class="mt-2"
                    >
                      <VIcon icon="mdi-download" size="small" class="me-1" />
                      Descargar
                    </VBtn>
                  </VCard>
                </VCol>
              </VRow>

              <!-- Botón Descargar Todos -->
              <VBtn
                block
                color="primary"
                class="mt-6"
                @click="downloadAllData"
              >
                <VIcon icon="mdi-download" class="me-2" />
                DESCARGAR TODOS
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<style scoped>
.stat-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>