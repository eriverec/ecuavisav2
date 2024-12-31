<template>
  <VCard class="px-0 py-0 pb-4">
    <VCardItem class="header_card_item pb-0">
      <div class="d-flex pr-0" style="justify-content: space-between;">
        <div class="descripcion">
          <!-- <VCardTitle class="text-h5 font-weight-semibold">Estadísticas por Intereses</VCardTitle>
          <div class="mt-2 text-medium-emphasis">Distribución de interacciones por sección | Intereses</div> -->
          <VCardTitle>Estadísticas por Intereses</VCardTitle>
          <small class="mt-3">Distribución de interacciones por sección | Intereses</small>
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
          <!-- <VBtn
            color="primary"
            variant="outlined"
            size="small"
            :loading="downloadingData"
            @click="downloadData"
            class="ml-2"
          >
            <VIcon icon="tabler-download" size="18" class="mr-2"/>
            Descargar
          </VBtn> -->
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
        :height="350"
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
  impressions: '#7BD5F5', 
  clicks: '#4FB5E6'     
}

const chartData = ref({
  series: [],
  options: {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '15%',
        borderRadius: [4, 4, 4, 4],
        distributed: false,
        rangeBarOverlap: true,
        rangeBarGroupRows: false
      },
    },
    colors: [colors.impressions, colors.clicks],
    dataLabels: {
      enabled: true,
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
      title: {
        text: 'Total de Interacciones',
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        }
      },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: '',
      },
      labels: {
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600
        },
        maxWidth: 300,
        trim: false,
        formatter: function(value) {
          return value.length > 40 ? value.substr(0, 37) + '...' : value;
        }
      }
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
      horizontalAlign: 'center',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif',
      labels: {
        colors: '#555'
      }
    },
    fill: {
      opacity: 1
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

const fetchData = async () => {
  loading.value = true
  emit('loading', true)
  
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-secciones/${props.campaignId}`, {
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
    console.error('Error fetching section stats:', error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

// const downloadData = async () => {
//   downloadingData.value = true
//   try {
//     const response = await axios.get(`http://localhost:8080/grafico/stats-secciones/btn-descargar/${props.campaignId}`, {
//       params: {
//         fechai: formatDate(dateRange.value.start),
//         fechaf: formatDate(dateRange.value.end),
//         page: 1,
//         limit: 500000
//       }
//     })

//     if (response.data.resp && response.data.data) {
//       const csvRows = []
      
//       // Headers
//       csvRows.push(['Sección', 'Tipo', 'URL', 'Total'].join(','))
      
//       // Process data
//       response.data.data.forEach(section => {
//         section.groupedByType.forEach(typeGroup => {
//           typeGroup.items.forEach(item => {
//             csvRows.push([
//               `"${section.firstPath}"`,
//               `"${typeGroup.type}"`,
//               `"${item.url}"`,
//               item.total
//             ].join(','))
//           })
//         })
//       })

//       const csvContent = csvRows.join('\n')
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//       const link = document.createElement('a')
//       const currentDate = formatDate(new Date())
//       link.href = URL.createObjectURL(blob)
//       link.setAttribute('download', `stats_secciones_${currentDate}.csv`)
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//     }
//   } catch (error) {
//     console.error('Error al descargar los datos:', error)
//   } finally {
//     downloadingData.value = false
//   }
// }

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