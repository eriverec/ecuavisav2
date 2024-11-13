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

// gráfico

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
    toolbar: { show: false },
  },
  labels: ['Anónimos', 'Registrados', 'Suscritos'],
  colors: ['#87CEEB', '#DDA0DD', '#F0E68C'],
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

const chartSeries = computed(() => [
  userData.value.anonimos,
  userData.value.registrados,
  userData.value.suscritos,
])

// Métodos
const fetchData = async () => {
  try {
    const response = await axios.get(
      `https://restriccion-contenido.vercel.app/content-access/por-rango-fecha?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}`
    )
    
    if (response.data.resp) {
      userData.value = response.data.data
    }
  } catch (error) {
    console.error('Error al obtener datos:', error)
  }
}

const downloadData = async (tipo) => {
  try {
    const response = await axios.get(
      `https://restriccion-contenido.vercel.app/content-access/por-tipo/${tipo}?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}&format=csv`,
      { responseType: 'blob' }
    )
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `datos_${tipo}_${dateRange.value.start}_${dateRange.value.end}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al descargar datos:', error)
  }
}

const downloadAllData = async () => {
  try {
    const response = await axios.get(
      `https://restriccion-contenido.vercel.app/content-access/todos?startDate=${dateRange.value.start}&endDate=${dateRange.value.end}&format=csv`,
      { responseType: 'blob' }
    )
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `todos_los_datos_${dateRange.value.start}_${dateRange.value.end}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al descargar todos los datos:', error)
  }
}


watch(dateRange, () => {
  fetchData()
}, { deep: true })

// Cargar datos iniciales
onMounted(() => {
  fetchData()
})
</script>

<template>
  <VRow>
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
              <!-- Anónimos -->
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <VIcon icon="mdi-account-outline" class="me-2" />
                    <span>Anónimos: {{ userData.anonimos }}</span>
                  </div>
                  <VBtn
                    icon
                    variant="text"
                    color="primary"
                    @click="downloadData('anonimo')"
                  >
                    <VIcon icon="mdi-download" />
                  </VBtn>
                </div>
              </div>

              <!-- Registrados -->
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <VIcon icon="mdi-account" class="me-2" />
                    <span>Registrados: {{ userData.registrados }}</span>
                  </div>
                  <VBtn
                    icon
                    variant="text"
                    color="primary"
                    @click="downloadData('registrado')"
                  >
                    <VIcon icon="mdi-download" />
                  </VBtn>
                </div>
              </div>

              <!-- Suscritos -->
              <div class="mb-4">
                <div class="d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <VIcon icon="mdi-star" class="me-2" />
                    <span>Suscritos: {{ userData.suscritos }}</span>
                  </div>
                  <VBtn
                    icon
                    variant="text"
                    color="primary"
                    @click="downloadData('suscrito')"
                  >
                    <VIcon icon="mdi-download" />
                  </VBtn>
                </div>
              </div>

              <!-- Botón Descargar Todos -->
              <VBtn
                block
                color="primary"
                class="mt-6"
                @click="downloadAllData"
              >
                DESCARGAR TODOS
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>