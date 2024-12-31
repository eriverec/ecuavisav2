<template>
  <VCard class="px-0 py-0 pb-4">
    <VCardItem class="header_card_item pb-0">
      <div class="d-flex pr-0" style="justify-content: space-between;">
        <div class="descripcion">
          <VCardTitle>Estadísticas por Edad</VCardTitle>
          <small class="mt-3">Distribución de interacciones por rango de edad</small>
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
            color="primary"
            variant="outlined"
            size="small"
            :loading="downloadingData"
            @click="downloadData"
            class="ml-2"
          >
            <VIcon icon="mdi-account-arrow-down-outline" size="18" class="mr-2"/>
            Descargar
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


const colors = {
  total: '#9C88E4',
  preview: '#B8A5FF',
  click: '#8471CE'
}

const chartData = ref({
  series: [],
  options: {
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: false
      },
      stacked: true
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      }
    },
    colors: [colors.preview, colors.click],
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val
      }
    },
    xaxis: {
      categories: [],
      title: {
        text: 'Rango de Edad'
      }
    },
    yaxis: {
      title: {
        text: 'Total de Interacciones'
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
      position: 'bottom',
      horizontalAlign: 'center'
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

const fetchData = async () => {
  loading.value = true
  emit('loading', true)
  
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-edades/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
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
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-edades/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
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
.text-red {
  color: #EA5455;
}

.text-green {
  color: #28C76F;
}
</style>