<template>
  <VCard class="mt-4">
    <VCardTitle>
      <div class="d-flex justify-space-between align-center">
        <h3 style="opacity: 0;">Registros por Fecha</h3>
        <VBtn
          icon="mdi-refresh"
          variant="text"
          size="small"
          @click="updateChart"
          :loading="chartLoading"
          :disabled="chartLoading"
        />
      </div>
    </VCardTitle>
    <VCardText>
      <div v-if="chartLoading" class="text-center py-8">
        <VProgressCircular indeterminate color="primary" />
        <p class="mt-2">Cargando datos del gráfico...</p>
      </div>
      <div v-else-if="chartData.series[0].data.length === 0" class="text-center py-8">
        <VIcon icon="mdi-chart-bar" size="64" color="disabled" />
        <p class="text-disabled mt-2">No hay datos para mostrar en el gráfico</p>
      </div>
      <VueApexCharts
        v-else
        type="bar"
        height="350"
        :options="chartOptions"
        :series="chartData.series"
      />
    </VCardText>
  </VCard>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import moment from 'moment-timezone'
import VueApexCharts from 'vue3-apexcharts';
// Hook del theme de Vuetify
const vuetifyTheme = useTheme()
// Zona horaria a usar (Ecuador)
const TIMEZONE = 'America/Guayaquil'

// Función para obtener colores del theme
const colorVariables = (themeColors) => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

// Props recibidos del componente padre
const props = defineProps({
  fechaInicio: String,
  fechaFin: String,
  tipoModel: String,
  modelSearch: String,
  estadoModel: String,
  dominioPrincipal: String
})

// Emisores para comunicar con el componente padre
const emit = defineEmits(['show-snackbar'])

// Variables reactivas
const chartLoading = ref(false)
const chartRawData = ref([])

// Obtener colores del theme actual
const themeColors = computed(() => colorVariables(vuetifyTheme.current.value))

// Configuración del gráfico usando colores del theme
const chartOptions = computed(() => {
  const colors = themeColors.value
  const groupedData = groupDataByDate(chartRawData.value)
  // Categorías formateadas en la zona horaria de Ecuador
  const categories = groupedData.map(item => moment(item.date).tz(TIMEZONE).format('DD/MM'))
  
  return {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    colors: [vuetifyTheme.current.value.colors.primary],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val
      },
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: [vuetifyTheme.current.value.colors['on-primary']]
      }
    },
    xaxis: {
      type: 'category',
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          colors: colors.themePrimaryTextColor
        }
      },
      axisBorder: {
        color: colors.themeBorderColor
      },
      axisTicks: {
        color: colors.themeBorderColor
      }
    },
    yaxis: {
      title: {
        text: 'Cantidad de Registros',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: colors.themePrimaryTextColor
        }
      },
      labels: {
        formatter: function (val) {
          return Math.floor(val)
        },
        style: {
          colors: colors.themePrimaryTextColor
        }
      }
    },
    title: {
      text: '',
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.themePrimaryTextColor
      }
    },
    tooltip: {
      theme: vuetifyTheme.current.value.dark ? 'dark' : 'light',
      x: {
        format: 'dd/MM/yyyy'
      },
      y: {
        formatter: function (val) {
          return val + ' registros'
        }
      },
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      }
    },
    grid: {
      borderColor: colors.themeBorderColor,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      labels: {
        colors: colors.themePrimaryTextColor
      }
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
          value: 0.1
        }
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.1
        }
      }
    }
  }
})

// Datos del gráfico computados
const chartData = computed(() => {
  const groupedData = groupDataByDate(chartRawData.value)
  
  return {
    series: [{
      name: 'Registros',
      data: groupedData.map(item => item.count)
    }]
  }
})

// Función para agrupar datos por fecha
function groupDataByDate(data) {
  const grouped = {}
  
  data.forEach(item => {
    // Parsear y normalizar la fecha a la zona horaria de Ecuador (sin desplazamiento a UTC)
    const date = moment.tz(item.created_at, TIMEZONE).format('YYYY-MM-DD')
    if (!grouped[date]) {
      grouped[date] = 0
    }
    grouped[date]++
  })
  
  // Convertir objeto a array y ordenar por fecha
  return Object.entries(grouped)
    .map(([date, count]) => ({
      // Crear timestamp correspondiente a las 00:00 en Ecuador para esa fecha
      date: moment.tz(date, 'YYYY-MM-DD', TIMEZONE).valueOf(),
      count
    }))
    .sort((a, b) => a.date - b.date)
}

// Función para obtener datos del gráfico
async function fetchChartData() {
  try {
    chartLoading.value = true
    
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    
    let url = `${props.dominioPrincipal}/backoffice/listado?`
    
    // Aplicar filtros según el tipo
    if (props.tipoModel === "Por Fecha" && props.fechaInicio && props.fechaFin) {
      url += `fechai=${props.fechaInicio}&fechaf=${props.fechaFin}`
    } else {
      url += `fechai=&fechaf=`
    }
    
    // Agregar filtros adicionales
    if (props.modelSearch) {
      url += `&search=${props.modelSearch}`
    }
    
    if (props.estadoModel && props.estadoModel !== 'Todos') {
      url += `&estado=${props.estadoModel}`
    }
    
    // Obtener todos los datos (sin paginación para el gráfico)
    url += `&page=1&limit=1000`
    
    const response = await fetch(url, requestOptions)
    const data = await response.json()
    
    if (data.resp) {
      chartRawData.value = data.data
    } else {
      emit('show-snackbar', {
        message: "No se pudieron cargar los datos del gráfico",
        type: "error",
        model: true
      })
      chartRawData.value = []
    }
  } catch (error) {
    console.error('Error fetching chart data:', error)
    emit('show-snackbar', {
      message: "Error al cargar datos del gráfico",
      type: "error", 
      model: true
    })
    chartRawData.value = []
  } finally {
    chartLoading.value = false
  }
}

// Función para actualizar el gráfico
async function updateChart() {
  await fetchChartData()
}

// Watchers para actualizar el gráfico cuando cambien los filtros o el theme
watch([
  () => props.fechaInicio,
  () => props.fechaFin,
  () => props.tipoModel,
  () => props.modelSearch,
  () => props.estadoModel
], () => {
  updateChart()
}, { deep: true })

// Watch para cambios de theme
watch(() => vuetifyTheme.current.value, () => {
  // El gráfico se actualizará automáticamente gracias al computed chartOptions
}, { deep: true })

// Cargar datos al montar el componente
onMounted(() => {
  updateChart()
})

// Exponer función para uso externo
defineExpose({
  updateChart
})
</script>

<style scoped>
/* Estilos adicionales si necesitas personalizar más */
.apexcharts-canvas {
  font-family: inherit !important;
}
</style>