<template>
  <div>
    <VRow class="px-4 pt-4">
      <VCol cols="12" md="4">
        <VCard class="mb-4 elevation-0 border">
          <VCardTitle class="py-2 px-4 text-center bg-surface">
            CLICKS
            <VTooltip location="top">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-information" size="x-small" color="medium-emphasis" class="ml-1"></VIcon>
              </template>
              <span>explicación sobre clics</span>
            </VTooltip>
          </VCardTitle>
          <VDivider />
          <VCardText class="d-flex flex-column justify-center align-center pa-6 text-center">
            <h3 class="text-h3 mb-4">{{ totalClicks }}</h3>
            <div v-if="clicksTrend !== null" :class="['d-flex align-center gap-1', clicksTrend < 0 ? 'text-error' : 'text-success']">
              <VIcon size="small" :icon="clicksTrend < 0 ? 'tabler-arrow-down' : 'tabler-arrow-up'" />
              <span class="text-caption">
                {{ Math.abs(clicksTrend) }}% vs mes anterior
              </span>
            </div>
            <span v-else class="text-caption text-medium-emphasis">
              Sin datos previos
            </span>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard class="mb-4 elevation-0 border">
          <VCardTitle class="py-2 px-4 text-center bg-surface">
            CTR
            <VTooltip location="top">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-information" size="x-small" color="medium-emphasis" class="ml-1"></VIcon>
              </template>
              <span>explicación sobre CTR</span>
            </VTooltip>
          </VCardTitle>
          <VDivider />
          <VCardText class="d-flex flex-column justify-center align-center pa-6 text-center">
            <h3 class="text-h3 mb-4">{{ ctrPercentage }}%</h3>
            <div v-if="ctrTrend !== null" :class="['d-flex align-center gap-1', ctrTrend < 0 ? 'text-error' : 'text-success']">
              <VIcon size="small" :icon="ctrTrend < 0 ? 'tabler-arrow-down' : 'tabler-arrow-up'" />
              <span class="text-caption">
                {{ Math.abs(ctrTrend) }}% vs mes anterior
              </span>
            </div>
            <span v-else class="text-caption text-medium-emphasis">
              Sin datos previos
            </span>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard class="mb-4 elevation-0 border">
          <VCardTitle class="py-2 px-4 text-center bg-surface">
            IMPRESIONES
            <VTooltip location="top">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-information" size="x-small" color="medium-emphasis" class="ml-1"></VIcon>
              </template>
              <span>explicación sobre impresiones</span>
            </VTooltip>
          </VCardTitle>
          <VDivider />
          <VCardText class="d-flex flex-column justify-center align-center pa-6 text-center">
            <h3 class="text-h3 mb-4">{{ totalImpressions }}</h3>
            <div v-if="impressionsTrend !== null" :class="['d-flex align-center gap-1', impressionsTrend < 0 ? 'text-error' : 'text-success']">
              <VIcon size="small" :icon="impressionsTrend < 0 ? 'tabler-arrow-down' : 'tabler-arrow-up'" />
              <span class="text-caption">
                {{ Math.abs(impressionsTrend) }}% vs mes anterior
              </span>
            </div>
            <span v-else class="text-caption text-medium-emphasis">
              Sin datos previos
            </span>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VDivider class="mt-5" />

    <VCol cols="12">
      <VCard class="elevation-0">
        <VCardItem>
          <div class="d-flex flex-column w-100">
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="date-picker-wrapper" style="width: calc(100% - 48px);">
                <!-- <VCardTitle>Evolución de interacciones</VCardTitle>
                <small class="text-medium-emphasis">Clicks e impresiones en un rango de fecha específico</small> -->
                <AppDateTimePicker 
                    prepend-inner-icon="tabler-calendar" 
                    density="compact"
                    style="max-width: 300px;"
                    :show-current="true"
                    @on-change="handleDateChange"
                    :config="{
                      position: 'auto right',
                      mode: 'range',
                      altFormat: 'F j, Y',
                      dateFormat: 'Y-m-d',
                      defaultDate: [formatInitialDate(today), formatInitialDate(today)],
                      maxDate: 'today',
                      showMonths: 1,
                      locale: {
                        rangeSeparator: ' al ',
                        firstDayOfWeek: 1
                      }
                    }"
                  />
             
              </div>
              <div class="d-flex gap-2">
                <VBtn
                  variant="outlined"
                  color="primary"
                  size="small"
                  prepend-icon="tabler-download"
                  @click="downloadDetailedReport"
                >
                  Descarga general
                </VBtn>
                <VBtn
                  variant="outlined"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-account-arrow-down-outline"
                  @click="downloadGroupedReport"
                >
                  Descarga Agrupado por tipo
                </VBtn>
              </div>
            </div>

            <VCol cols="12" md="6" class="px-0">
              <div class="date-picker-wrapper" style="width: 100%;">
                <!-- <AppDateTimePicker 
                    prepend-inner-icon="tabler-calendar" 
                    density="compact"
                    :show-current="true"
                    @on-change="handleDateChange"
                    :config="{
                      position: 'auto right',
                      mode: 'range',
                      altFormat: 'F j, Y',
                      dateFormat: 'Y-m-d',
                      defaultDate: [formatInitialDate(today), formatInitialDate(today)],
                      maxDate: 'today',
                      showMonths: 1,
                      locale: {
                        rangeSeparator: ' al ',
                        firstDayOfWeek: 1
                      }
                    }"
                  /> -->
              </div>
            </VCol>
          </div>
        </VCardItem>

        <div v-if="loading" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" />
          <div class="mt-4 text-medium-emphasis">Cargando estadísticas...</div>
        </div>

        <VCardText v-else>
          <VueApexCharts
            v-if="chartData.series[0].data.length > 0"
            :options="chartData.options"
            :series="chartData.series"
            :height="400"
            width="100%"
            ref="chartRef"
          />
          <div v-else class="text-center py-8 text-medium-emphasis">
            No hay datos disponibles para el período seleccionado
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  campaignId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['loading'])
const loading = ref(false)
const chartRef = ref(null)
const statsData = ref({
  click: [],
  preview: []
})

const today = new Date()
const formatInitialDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
const dateRange = ref({
  start: formatInitialDate(today),
  end: formatInitialDate(today)
})

const totalClicks = computed(() => {
  if (!statsData.value?.data?.click) return 0
  return statsData.value.data.click.reduce((sum, item) => sum + item.total, 0)
})

const totalImpressions = computed(() => {
  if (!statsData.value?.data?.preview) return 0
  return statsData.value.data.preview.reduce((sum, item) => sum + item.total, 0)
})

const ctrPercentage = computed(() => {
  if (totalImpressions.value === 0) return 0
  return Math.round((totalClicks.value / totalImpressions.value) * 100)
})

const clicksTrend = ref(null)
const ctrTrend = ref(null)
const impressionsTrend = ref(null)

const fetchPreviousPeriodData = async (startDate, endDate) => {
  const previousStart = new Date(startDate)
  const previousEnd = new Date(endDate)
  previousStart.setMonth(previousStart.getMonth() - 1)
  previousEnd.setMonth(previousEnd.getMonth() - 1)

  try {
    const { data } = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/${props.campaignId}`, {
      params: {
        fechai: formatDate(previousStart),
        fechaf: formatDate(previousEnd),
        page: 1,
        limit: 500000
      }
    })
    return data.data
  } catch (error) {
    console.error('Error fetching previous period data:', error)
    return null
  }
}

const calculateTrends = (currentData, previousData) => {
  if (!previousData?.data) {
    clicksTrend.value = null
    ctrTrend.value = null
    impressionsTrend.value = null
    return
  }

  const currentTotals = {
    clicks: (currentData?.click || []).reduce((sum, item) => sum + item.total, 0),
    impressions: (currentData?.preview || []).reduce((sum, item) => sum + item.total, 0)
  }

  const previousTotals = {
    clicks: (previousData.data?.click || []).reduce((sum, item) => sum + item.total, 0),
    impressions: (previousData.data?.preview || []).reduce((sum, item) => sum + item.total, 0)
  }

  clicksTrend.value = previousTotals.clicks === 0 ? 100 : 
    Math.round(((currentTotals.clicks - previousTotals.clicks) / previousTotals.clicks) * 100)

  impressionsTrend.value = previousTotals.impressions === 0 ? 100 :
    Math.round(((currentTotals.impressions - previousTotals.impressions) / previousTotals.impressions) * 100)

  const currentCTR = currentTotals.impressions > 0 ? (currentTotals.clicks / currentTotals.impressions) * 100 : 0
  const previousCTR = previousTotals.impressions > 0 ? (previousTotals.clicks / previousTotals.impressions) * 100 : 0
  
  ctrTrend.value = previousCTR === 0 ? 100 :
    Math.round(((currentCTR - previousCTR) / previousCTR) * 100)
}

const chartData = ref({
  series: [
    {
      name: 'Clicks',
      type: 'line',
      data: []
    },
    {
      name: 'Impresiones',
      type: 'line',
      data: []
    }
  ],
  options: {
    chart: {
      height: 400,
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false },
      foreColor: '#e4e6f4ad',
      fontFamily: 'Public Sans, sans-serif',
      fontSize: '15px'
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#7367F0', '#28C76F'],
    markers: {
      size: 4,
      colors: ['#7367F0', '#28C76F'],
      strokeColors: 'var(--v-background)',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: '15px',
          colors: 'var(--v-medium-emphasis)',
          fontFamily: 'Public Sans, sans-serif'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      title: {
        text: 'Cantidad',
        style: {
          color: 'var(--v-medium-emphasis)',
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '15px'
        }
      },
      labels: {
        style: {
          colors: 'var(--v-medium-emphasis)',
          fontFamily: 'Public Sans, sans-serif',
          fontSize: '15px',
        }
      }
    },
    tooltip: {
      theme: 'system',
      shared: true,
      intersect: false,
      y: {
        formatter: value => value.toFixed(0)
      }
    },
    grid: {
      borderColor: 'var(--v-border-color)',
      row: {
        colors: ['transparent', '#ffffff'],
        opacity: 0.5
      }
    },
    legend: {
      position: 'top',
      labels: {
        colors: 'var(--v-medium-emphasis)'
      }
    }
  }
})

const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const handleDateChange = async (dates) => {
  if (!dates || !dates[0] || !dates[1]) return
  
  dateRange.value = {
    start: dates[0],
    end: dates[1]
  }
  
  await fetchData()
}

const fetchData = async () => {
  loading.value = true
  emit('loading', true)
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
        page: 1,
        limit: 500000
      }
    })
    
    if (response.data.resp && response.data.data) {
      const previousPeriodData = await fetchPreviousPeriodData(dateRange.value.start, dateRange.value.end)
      calculateTrends(response.data.data, previousPeriodData)
      statsData.value = response.data
      updateChartData(response.data.data)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const updateChartData = (data) => {
  if (!data?.click || !data?.preview) return

  const allDates = [...new Set([
    ...data.click.map(item => item.date),
    ...data.preview.map(item => item.date)
  ])].sort()

  const formattedDates = allDates.map(date => {
    const [year, month, day] = date.split('-')
    return `${day} ${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][parseInt(month) - 1]}`
  })

  const clickData = allDates.map(date => {
    const found = data.click.find(item => item.date === date)
    return found ? found.total : 0
  })

  const previewData = allDates.map(date => {
    const found = data.preview.find(item => item.date === date)
    return found ? found.total : 0
  })

  chartData.value.series[0].data = clickData
  chartData.value.series[1].data = previewData
  chartData.value.options.xaxis.categories = formattedDates
}

const downloadChart = () => {
  if (chartRef.value) {
    const chart = chartRef.value.chart
    const currentDate = new Date().toISOString().split('T')[0]
    chart.exports.exportToCSV({
      filename: `estadisticas-${currentDate}`
    })
  }
}

// Funciones de descarga
const downloadDetailedReport = async () => {
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
        page: 1,
        limit: 5000
      }
    })

    if (response.data.resp && response.data.data) {
      const csvData = response.data.data.map(item => ({
        created_at_campaign: new Date(item.created_at_campaign).toLocaleString(),
        type: item.type,
        wylexId: item.user.wylexId,
        email: item.user.email,
        first_name: item.user.first_name,
        last_name: item.user.last_name
      }))

      const headers = ['created_at_campaign', 'type', 'wylexId', 'email', 'first_name', 'last_name']
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', `reporte_general_${formatDate(new Date())}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('Error al descargar el reporte detallado:', error)
  }
}

const downloadGroupedReport = async () => {
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
        page: 1,
        limit: 5000
      }
    })

    if (response.data.resp && response.data.data) {
      const groupedData = response.data.data.reduce((acc, item) => {
        const key = `${item.user.wylexId}-${item.type}`
        if (!acc[key]) {
          acc[key] = {
            wylexId: item.user.wylexId,
            email: item.user.email,
            first_name: item.user.first_name,
            last_name: item.user.last_name,
            type: item.type,
            dates: []
          }
        }
        acc[key].dates.push(new Date(item.created_at_campaign).toLocaleString())
        return acc
      }, {})

      const csvData = Object.values(groupedData).map(item => ({
        type: item.type,
        wylexId: item.wylexId,
        email: item.email,
        first_name: item.first_name,
        last_name: item.last_name,
        interaction_dates: item.dates.join('; ')
      }))

      const headers = ['type', 'wylexId', 'email', 'first_name', 'last_name', 'interaction_dates']
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', `reporte_agrupado_por_tipo_${formatDate(new Date())}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('Error al descargar el reporte agrupado:', error)
  }
}

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
.text-error {
  color: var(--v-error-base);
}

.text-success {
  color: var(--v-success-base);
}

:deep(.v-card) {
  border-color: var(--v-border-color);
}
</style>