<template>
  <div>
    <!-- Métricas Cards -->
    <VRow class="px-4 pt-4">
      <VCol cols="12" md="4">
        <VCard class="mb-4">
          <VCardTitle class="py-2 px-4 text-center" style="background-color: #f2f2f2;">
            CLICS
            <VTooltip location="top">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-information" size="x-small" color="#b3b3b3" class="ml-1"></VIcon>

              </template>
              <span>explicación sobre clics</span>
            </VTooltip>
          </VCardTitle>
          <VDivider />
          <VCardText class="d-flex flex-column justify-center align-center pa-6 text-center">
            <h3 class="text-h3 mb-4">{{ totalClicks }}</h3>
            <div v-if="clicksTrend !== null" :class="['d-flex align-center gap-1', clicksTrend < 0 ? 'text-red' : 'text-green']">
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
        <VCard class="mb-4">
          <VCardTitle class="py-2 px-4 text-center" style="background-color: #f2f2f2;">
            CTR
            <VTooltip location="top">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-information" size="x-small" color="#b3b3b3" class="ml-1"></VIcon>
              </template>
              <span>explicación sobre CTR</span>
            </VTooltip>
          </VCardTitle>
          <VDivider />
          <VCardText class="d-flex flex-column justify-center align-center pa-6 text-center">
            <h3 class="text-h3 mb-4">{{ ctrPercentage }}%</h3>
            <div v-if="ctrTrend !== null" :class="['d-flex align-center gap-1', ctrTrend < 0 ? 'text-red' : 'text-green']">
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
        <VCard class="mb-4">
          <VCardTitle class="py-2 px-4 text-center" style="background-color: #f2f2f2;">
            IMPRESIONES
            <VTooltip location="top">
              <template #activator="{ props }">
                <VIcon v-bind="props" icon="mdi-information" size="x-small" color="#b3b3b3" class="ml-1"></VIcon>
              </template>
              <span>explicación sobre impresiones</span>
            </VTooltip>
          </VCardTitle>
          <VDivider />
          <VCardText class="d-flex flex-column justify-center align-center pa-6 text-center">
            <h3 class="text-h3 mb-4">{{ totalImpressions }}</h3>
            <div v-if="impressionsTrend !== null" :class="['d-flex align-center gap-1', impressionsTrend < 0 ? 'text-red' : 'text-green']">
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



    <!-- Gráfico -->
    <VCol cols="12">
      <VCard>
        <VCardItem>
          <div class="d-flex flex-column w-100">
            <div class="d-flex justify-space-between align-center mb-4">
              <div class="descripcion">
                <VCardTitle>Métricas de Campaña</VCardTitle>
                <small class="text-medium-emphasis">Evolución de clicks e impresiones en un rango de fecha específico</small>
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

            <!-- Selector de fechas -->
            <VCol cols="12" md="6" class="px-0">
              <div class="date-picker-wrapper" style="width: 100%;">
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
          </div>
        </VCardItem>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" />
          <div class="mt-4">Cargando estadísticas...</div>
        </div>

        <!-- Chart -->
        <VCardText v-else>
          <VueApexCharts
            v-if="chartData.series[0].data.length > 0"
            :options="chartData.options"
            :series="chartData.series"
            :height="400"
            width="100%"
            ref="chartRef"
          />
          <div v-else class="text-center py-8">
            No hay datos disponibles para el período seleccionado
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
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

// Fecha inicial: día actual
const today = new Date()
const dateRange = ref({
  start: today,
  end: today
})

// calculo de metricas
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

// Tendencias calculadas
const clicksTrend = ref(null)
const ctrTrend = ref(null)
const impressionsTrend = ref(null)

// Función para obtener datos del mes anterior
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

// Función para calcular tendencias
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

  // tendencia de clicks
  if (previousTotals.clicks === 0) {
    clicksTrend.value = 100
  } else {
    clicksTrend.value = Math.round(((currentTotals.clicks - previousTotals.clicks) / previousTotals.clicks) * 100)
  }

  // tendencia de impresiones
  if (previousTotals.impressions === 0) {
    impressionsTrend.value = 100
  } else {
    impressionsTrend.value = Math.round(((currentTotals.impressions - previousTotals.impressions) / previousTotals.impressions) * 100)
  }

  // tendencia de CTR
  const currentCTR = currentTotals.impressions > 0 ? (currentTotals.clicks / currentTotals.impressions) * 100 : 0
  const previousCTR = previousTotals.impressions > 0 ? (previousTotals.clicks / previousTotals.impressions) * 100 : 0
  
  if (previousCTR === 0) {
    ctrTrend.value = 100
  } else {
    ctrTrend.value = Math.round(((currentCTR - previousCTR) / previousCTR) * 100)
  }
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
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#7367F0', '#28C76F'],
    markers: {
      size: 4,
      hover: {
        size: 6
      }
    },
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        rotate: -45,
        rotateAlways: false
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
        text: 'Cantidad'
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => value.toFixed(0)
      }
    },
    grid: {
      borderColor: '#f1f1f1'
    },
    legend: {
      position: 'top'
    }
  }
})

const formatDateToDisplay = (date) => {
  const day = date.getDate()
  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const month = monthNames[date.getMonth()]
  return `${day} ${month}`
}

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
    // datos actuales
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
        page: 1,
        limit: 500000
      }
    })
    
    if (response.data.resp && response.data.data) {
      // datos del periodo anterior
      const previousPeriodData = await fetchPreviousPeriodData(dateRange.value.start, dateRange.value.end)
      
      // Calcular tendencias
      calculateTrends(response.data.data, previousPeriodData)
      
      // Actualizar datos actuales
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
  console.log('Datos recibidos:', data);

  if (!data?.click || !data?.preview) {
    console.error('Datos inválidos:', data);
    return;
  }
  
  try {
   
    const allDates = [...new Set([
      ...data.click.map(item => item.date),
      ...data.preview.map(item => item.date)
    ])].sort();

    console.log('Fechas disponibles:', allDates);

    const formattedDates = allDates.map(date => {
      const [year, month, day] = date.split('-');
      return `${day} ${['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][parseInt(month) - 1]}`;
    });

    const clickData = allDates.map(date => {
      const found = data.click.find(item => item.date === date);
      return found ? found.total : 0;
    });

    const previewData = allDates.map(date => {
      const found = data.preview.find(item => item.date === date);
      return found ? found.total : 0;
    });

    console.log('Datos procesados:', { dates: formattedDates, clicks: clickData, previews: previewData });

    chartData.value = {
      series: [
        {
          name: 'Clicks',
          type: 'line',
          data: clickData
        },
        {
          name: 'Impresiones',
          type: 'line',
          data: previewData
        }
      ],
      options: {
        chart: {
          height: 400,
          type: 'line',
          zoom: { enabled: false },
          toolbar: { show: false }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          width: 2,
          curve: 'smooth'
        },
        colors: ['#7367F0', '#28C76F'],
        markers: {
          size: 4,
          colors: ['#7367F0', '#28C76F'],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 6
          }
        },
        grid: {
          borderColor: '#f1f1f1',
          row: {
            colors: ['transparent', 'transparent'],
            opacity: 0.5
          }
        },
        xaxis: {
          categories: formattedDates,
          labels: {
            rotate: -45,
            rotateAlways: false,
            style: {
              fontSize: '12px'
            }
          },
          axisBorder: { show: true },
          axisTicks: { show: true }
        },
        yaxis: {
          title: {
            text: 'Cantidad'
          },
          min: 0
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (value) {
              return value.toFixed(0);
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center'
        }
      }
    };
  } catch (error) {
    console.error('Error al actualizar el gráfico:', error);
  }
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

// Función para descargar reporte detallado
const downloadDetailedReport = async () => {
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
        page: 1,
        limit: 5000
      }
    });

    if (response.data.resp && response.data.data) {
      const csvData = response.data.data.map(item => ({
        created_at_campaign: new Date(item.created_at_campaign).toLocaleString(),
        type: item.type,
        wylexId: item.user.wylexId,
        email: item.user.email,
        first_name: item.user.first_name,
        last_name: item.user.last_name
      }));

 
      const headers = ['created_at_campaign', 'type', 'wylexId', 'email', 'first_name', 'last_name'];
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

   
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `reporte_general_${formatDate(new Date())}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error al descargar el reporte detallado:', error);
  }
};

// Función para descargar reporte agrupado por tipo (clics e impresiones)
const downloadGroupedReport = async () => {
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-diario/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: formatDate(dateRange.value.start),
        fechaf: formatDate(dateRange.value.end),
        page: 1,
        limit: 5000
      }
    });

    if (response.data.resp && response.data.data) {
      // Agrupar por wylexId y type
      const groupedData = response.data.data.reduce((acc, item) => {
        const key = `${item.user.wylexId}-${item.type}`;
        if (!acc[key]) {
          acc[key] = {
            wylexId: item.user.wylexId,
            email: item.user.email,
            first_name: item.user.first_name,
            last_name: item.user.last_name,
            type: item.type,
            dates: []
          };
        }
        acc[key].dates.push(new Date(item.created_at_campaign).toLocaleString());
        return acc;
      }, {});

     
      const csvData = Object.values(groupedData).map(item => ({
        type: item.type,
        wylexId: item.wylexId,
        email: item.email,
        first_name: item.first_name,
        last_name: item.last_name,
        interaction_dates: item.dates.join('; ')
      }));


      const headers = ['type', 'wylexId', 'email', 'first_name', 'last_name', 'interaction_dates'];
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

   
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `reporte_agrupado_por_tipo_${formatDate(new Date())}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error al descargar el reporte agrupado:', error);
  }
};

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