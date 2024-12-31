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
        :height="400"
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
 
 const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
 }
 
 const today = new Date()
 const dateRange = ref({
  start: formatDate(today),
  end: formatDate(today)
 })
 
 const downloadData = async () => {
  downloadingData.value = true
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: dateRange.value.start,
        fechaf: dateRange.value.end,
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
 
 const handleDateChange = async (dates) => {
  if (!dates || !dates[0] || !dates[1]) return
  
  dateRange.value = {
    start: formatDate(dates[0]),
    end: formatDate(dates[1])
  }
  
  await fetchData()
 }
 
 const processDeviceData = (data) => {
  const deviceTotals = {
    desktop: { clicks: 0, views: 0 },
    movil: { clicks: 0, views: 0 }
  }

  Object.keys(data).forEach(device => {
    if (data[device]?.click) {
      deviceTotals[device].clicks = data[device].click.reduce((sum, item) => sum + item.total, 0)
    }
    if (data[device]?.preview) {
      deviceTotals[device].views = data[device].preview.reduce((sum, item) => sum + item.total, 0)
    }
  })

  const series = []
  const labels = []
  const devices = Object.keys(deviceTotals)

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
        fechai: dateRange.value.start,
        fechaf: dateRange.value.end,
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