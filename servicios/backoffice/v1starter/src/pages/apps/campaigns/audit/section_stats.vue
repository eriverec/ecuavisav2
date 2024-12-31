<template>
  <div class="stats-container">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="date-picker-wrapper" style="width: calc(100% - 48px);">
        <AppDateTimePicker 
          prepend-inner-icon="tabler-calendar" 
          density="comfortable"
          style="max-width: 300px;"
          :show-current="true"
          @on-change="handleDateChange"
          :config="{
            position: 'auto right',
            mode: 'range',
            altFormat: 'Y-MM-DD',
            dateFormat: 'Y-m-d',
            defaultDate: [dateRange.start, dateRange.end],
            maxDate: 'today',
            showMonths: 1,
            locale: {
              rangeSeparator: ' - ',
              firstDayOfWeek: 1
            }
          }"
          class="date-picker-compact"
        />
      </div>
      <VBtn
        icon
        variant="text"
        size="large"
        :loading="downloadingData"
        @click="downloadData"
        class="download-btn"
      >
        <VIcon icon="tabler-download" size="24" color="grey-darken-1" />
        <VTooltip activator="parent" location="top">Descargar datos</VTooltip>
      </VBtn>
    </div>

    <div class="d-flex justify-center align-center gap-6 mb-6">
      <VBtn
        variant="text"
        :color="showClicks ? 'primary' : 'grey'"
        @click="showClicks = !showClicks"
        class="filter-btn"
      >
        <VIcon 
          :icon="showClicks ? 'tabler-mouse-filled' : 'tabler-mouse'" 
          size="20" 
          class="me-2"
        />
        Clicks
      </VBtn>
      <VBtn
        variant="text"
        :color="showViews ? 'primary' : 'grey'"
        @click="showViews = !showViews"
        class="filter-btn"
      >
        <VIcon 
          :icon="showViews ? 'tabler-eye-filled' : 'tabler-eye'" 
          size="20" 
          class="me-2"
        />
        Impresiones
      </VBtn>
    </div>

    <div v-if="loading" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" />
      <div class="mt-4">Cargando estadísticas...</div>
    </div>
    <div v-else>
      <VueApexCharts
        v-if="chartData.series.length > 0"
        :options="chartData.options"
        :series="chartData.series"
        :height="350"
        width="100%"
      />
      <div v-else class="text-center py-8">
        No hay datos disponibles para el período seleccionado
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  campaignId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['loading'])
const loading = ref(false)
const downloadingData = ref(false)
const showClicks = ref(true)
const showViews = ref(true)

const colors = {
  preview: '#7BD5F5',
  click: '#4FB5E6'
}

const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const today = new Date()
const dateRange = ref({
  start: formatDate(today),
  end: formatDate(today)
})

const chartData = ref({
  series: [],
  options: {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
      stacked: true,
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '15%',
        borderRadius: [4, 4, 4, 4],
        distributed: false,
        rangeBarOverlap: true,
        rangeBarGroupRows: false
      }
    },
    colors: [colors.preview, colors.click],
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#666666']
      },
      formatter: function(val) {
        return val
      }
    },
    stroke: {
      width: 0,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: '#666666'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          colors: '#666666'
        },
        maxWidth: 300,
        trim: false,
        formatter: function(value) {
          return value.length > 40 ? value.substr(0, 37) + '...' : value;
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " interacciones"
        }
      }
    },
    legend: {
      show: false
    },
    theme: {
      mode: 'dark'
    }
  }
})

const processChartData = (data) => {
  const firstPathsMap = new Map()
  
  data.forEach(item => {
    item.groupedByType.forEach(typeGroup => {
      const path = item.firstPath
      if (!firstPathsMap.has(path)) {
        firstPathsMap.set(path, {
          preview: 0,
          click: 0
        })
      }
      
      const stats = firstPathsMap.get(path)
      if (typeGroup.type === 'preview') {
        stats.preview += typeGroup.total
      } else if (typeGroup.type === 'click') {
        stats.click += typeGroup.total
      }
    })
  })

  const categories = Array.from(firstPathsMap.keys())
  const series = []

  if (showViews.value) {
    series.push({
      name: 'Impresiones',
      data: categories.map(path => firstPathsMap.get(path).preview)
    })
  }

  if (showClicks.value) {
    series.push({
      name: 'Clicks',
      data: categories.map(path => firstPathsMap.get(path).click)
    })
  }

  return { categories, series }
}

const handleDateChange = async (dates) => {
  if (!dates || !dates[0] || !dates[1]) return
  
  dateRange.value = {
    start: formatDate(dates[0]),
    end: formatDate(dates[1])
  }
  
  await fetchData()
}

const fetchData = async () => {
  loading.value = true
  emit('loading', true)
  
  try {
    const response = await axios.get(`http://localhost:8080/grafico/stats-secciones/${props.campaignId}`, {
      params: {
        fechai: dateRange.value.start,
        fechaf: dateRange.value.end,
        page: 1,
        limit: 500000
      }
    })

    if (response.data.resp && response.data.data) {
      const { categories, series } = processChartData(response.data.data)
      
      chartData.value = {
        ...chartData.value,
        series,
        options: {
          ...chartData.value.options,
          xaxis: {
            ...chartData.value.options.xaxis,
            categories
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching section stats:', error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const downloadData = async () => {
  downloadingData.value = true
  try {
    const response = await axios.get(`http://localhost:8080/grafico/stats-secciones/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: dateRange.value.start,
        fechaf: dateRange.value.end,
        page: 1,
        limit: 500000
      }
    })

    if (response.data.resp && response.data.data) {
      const csvRows = []
      csvRows.push(['Sección', 'Tipo', 'URL', 'Total'].join(','))
      
      response.data.data.forEach(section => {
        section.groupedByType.forEach(typeGroup => {
          typeGroup.items.forEach(item => {
            csvRows.push([
              `"${section.firstPath}"`,
              `"${typeGroup.type}"`,
              `"${item.url}"`,
              item.total
            ].join(','))
          })
        })
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const currentDate = formatDate(new Date())
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', `stats_secciones_${currentDate}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('Error al descargar los datos:', error)
  } finally {
    downloadingData.value = false
  }
}

watch([showClicks, showViews], () => {
  if (!showClicks.value && !showViews.value) {
    showViews.value = true
    return
  }
  fetchData()
})

watch(() => props.campaignId, (newId) => {
  if (newId) {
    fetchData()
  }
}, { immediate: true })

onMounted(() => {
  if (props.campaignId) {
    fetchData()
  }
})
</script>

<style scoped>
.stats-container {
  padding: 1rem;
}

.date-picker-compact :deep(.v-field__input) {
  font-size: 0.875rem;
  min-height: 40px;
}

.date-picker-compact :deep(.v-field) {
  border-radius: 4px;
  min-height: 40px;
}

.filter-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
  height: 36px;
}

.download-btn {
  opacity: 0.75;
  transition: opacity 0.2s ease;
  height: 40px;
  width: 40px;
}

.download-btn:hover {
  opacity: 1;
  background: transparent !important;
}
</style>