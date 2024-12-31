<template>
  <VCard class="px-0 py-0 pb-4 elevation-0">
    <VCardItem class="header_card_item pb-0">
      <div class="d-flex pr-0" style="justify-content: space-between;">
        <div class="descripcion">
          <VCardTitle>Estadísticas por Dispositivo</VCardTitle>
          <small class="mt-3">Distribución de interacciones por tipo de dispositivo</small>
        </div>
        <div class="d-flex align-center gap-4">
          <VCheckbox
            v-model="showClicks"
            label="Clicks"
            color="primary"
            hide-details
          />
          <VCheckbox
            v-model="showViews"
            label="Impresiones"
            color="primary"
            hide-details
          />
          <VBtn
            variant="outlined"
            color="primary"
            size="small"
            prepend-icon="mdi-account-arrow-down-outline"
            :loading="downloadingData"
            @click="downloadData"
            class="ml-2"
          >
          Descargar
            <VTooltip activator="parent" location="top">
              Descargar datos de usuarios
            </VTooltip>
          </VBtn>
        </div>
      </div>
      <VDivider class="my-5" />
    </VCardItem>

    <!-- Selector de fechas -->
    <VCol cols="12" md="6" class="px-4">
      <div class="date-picker-wrapper pl-4" style="width: 100%;">
        <AppDateTimePicker 
          prepend-inner-icon="tabler-calendar" 
          density="compact"
          :show-current="true"
          @on-change="handleDateChange"
          :config="{
            position: 'auto right',
            mode: 'range',
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
            defaultDate: [today, today],
            maxDate: 'today',
            showMonths: 1,
            locale: {
              rangeSeparator: ' al ',
              firstDayOfWeek: 1
            }
          }"
        />
      </div>
    </VCol>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" />
      <div class="mt-4">Cargando estadísticas...</div>
    </div>

    <!-- Chart -->
    <VCardText v-else>
      <VueApexCharts
        v-if="chartData.series.length > 0"
        :options="chartData.options"
        :series="chartData.series"
        :height="400"
        width="100%"
      />
      <div v-else class="text-center py-8">
        No hay datos disponibles para el período seleccionado
      </div>
    </VCardText>
  </VCard>
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
const today = new Date()
const dateRange = ref({
  start: today,
  end: today
})

const showClicks = ref(true)
const showViews = ref(true)

const downloadData = async () => {
  downloadingData.value = true
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
        cliente: item.cliente,
        created_at_campaign: new Date(item.created_at_campaign).toLocaleString(),
        type: item.type,
        wylexId: item.user.wylexId,
        email: item.user.email,
        first_name: item.user.first_name,
        last_name: item.user.last_name,
        phone_number: item.user.phone_number || ''
      }))


      const headers = ['cliente', 'created_at_campaign', 'type', 'wylexId', 'email', 'first_name', 'last_name', 'phone_number']
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n')


      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const currentDate = formatDate(new Date())
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', `stats_dispositivos_${currentDate}.csv`)
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

const chartData = ref({
  series: [],
  options: {
    chart: {
      type: 'donut',
      height: 400
    },
    labels: [],
    colors: ['#7367F0', '#28C76F', '#EA5455'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return opts.w.config.series[opts.seriesIndex]
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + " interacciones"
        }
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

const processDeviceData = (data) => {
  const deviceTotals = {
    web: { clicks: 0, views: 0 },
    desktop: { clicks: 0, views: 0 },
    app: { clicks: 0, views: 0 }
  }

  // Suma totales por dispositivo
  Object.keys(data).forEach(device => {
    if (data[device].click) {
      deviceTotals[device].clicks = data[device].click.reduce((sum, item) => sum + item.total, 0)
    }
    if (data[device].preview) {
      deviceTotals[device].views = data[device].preview.reduce((sum, item) => sum + item.total, 0)
    }
  })

  const series = []
  const labels = []
  const devices = ['web', 'desktop', 'app']

  devices.forEach(device => {
    let total = 0
    let label = `${device.charAt(0).toUpperCase() + device.slice(1)} (`
    
    if (showClicks.value && showViews.value) {
      total = deviceTotals[device].clicks + deviceTotals[device].views
      label += `${deviceTotals[device].views} vistas, ${deviceTotals[device].clicks} clicks)`
    } else if (showClicks.value) {
      total = deviceTotals[device].clicks
      label += `${deviceTotals[device].clicks} clicks)`
    } else if (showViews.value) {
      total = deviceTotals[device].views
      label += `${deviceTotals[device].views} vistas)`
    }

    if (total > 0) {
      series.push(total)
      labels.push(label)
    }
  })

  return { series, labels }
}

const fetchData = async () => {
  loading.value = true
  emit('loading', true)
  
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-dispositivos/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
        page: 1,
        limit: 500000
      }
    })

    if (response.data.resp && response.data.data) {
      const { series, labels } = processDeviceData(response.data.data)
      
      chartData.value = {
        ...chartData.value,
        series,
        options: {
          ...chartData.value.options,
          labels
        }
      }
    }
  } catch (error) {
    console.error('Error fetching device stats:', error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

watch(() => props.campaignId, (newId) => {
  if (newId) {
    fetchData()
  }
}, { immediate: true })

//  checkboxes
watch([showClicks, showViews], () => {
  if (!showClicks.value && !showViews.value) {
    // activar uno por defecto
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
.text-red {
  color: #EA5455;
}

.text-green {
  color: #28C76F;
}
</style>