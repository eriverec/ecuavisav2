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
        :height="300"
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
  preview: '#B8A5FF',
  click: '#8471CE'
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
      height: 300,
      toolbar: {
        show: false
      },
      stacked: true,
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '40%',
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
    xaxis: {
      categories: [],
      labels: {
        rotate: -45,
        trim: false,
        style: {
          colors: '#666666'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#666666'
        }
      },
      title: {
        text: 'Total de Interacciones',
        style: {
          color: '#666666',
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '15px'
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
  const categories = data.map(item => item.rango)
  const series = []

  if (showViews.value) {
    series.push({
      name: 'Impresiones',
      data: data.map(item => item.byType.preview)
    })
  }

  if (showClicks.value) {
    series.push({
      name: 'Clicks',
      data: data.map(item => item.byType.click)
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
    const response = await axios.get(`http://localhost:8080/grafico/stats-edades/${props.campaignId}`, {
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
    console.error('Error fetching age stats:', error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const downloadData = async () => {
  downloadingData.value = true
  try {
    const response = await axios.get(`http://localhost:8080/grafico/stats-edades/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: dateRange.value.start,
        fechaf: dateRange.value.end,
        page: 1,
        limit: 500000
      }
    })

    if (response.data.resp && response.data.data) {
      const csvRows = []
      
      csvRows.push([
        'Rango de Edad',
        'Tipo',
        'ID Wylex',
        'Nombre',
        'Apellido',
        'Teléfono',
        'Email',
        'Fecha de Nacimiento',
        'Edad',
        'Total'
      ].join(','))
      
      response.data.data.forEach(item => {
        csvRows.push([
          `"${item.rango}"`,
          `"${item.type}"`,
          `"${item.user.wylexId}"`,
          `"${item.user.first_name || ''}"`,
          `"${item.user.last_name || ''}"`,
          `"${item.user.phone_number || ''}"`,
          `"${item.user.email || ''}"`,
          `"${item.user.birth_date || ''}"`,
          `"${item.edad}"`,
          item.total
        ].join(','))
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const currentDate = formatDate(new Date())
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', `stats_edades_${currentDate}.csv`)
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

watch(() => props.campaignId, (newId) => {
  if (newId) {
    fetchData()
  }
}, { immediate: true })

watch([showClicks, showViews], () => {
  if (!showClicks.value && !showViews.value) {
    showViews.value = true
    return
  }
  fetchData()
})

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