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
        <VIcon icon="mdi-account-arrow-down-outline" size="24" color="grey-darken-1" />
        <VTooltip activator="parent" location="top">Descargar usuarios</VTooltip>
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
        barHeight: '35%',
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
    return val !== null ? val : '';
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
          if (!value) return ''
          return String(value).length > 40 ? String(value).substr(0, 37) + '...' : String(value)
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

const processSectionsData = (sections, subsections) => {
  const statsMap = new Map()
  
  // secciones primarias
  sections
    .filter(item => item.firstPath && item.firstPath !== 'null')
    .forEach(item => {
      const path = item.firstPath;
      if (!statsMap.has(path)) {
        statsMap.set(path, { preview: null, click: null });
      }
      
      item.groupedByType.forEach(typeGroup => {
        const stats = statsMap.get(path);
        if (typeGroup.type === 'preview' && typeGroup.total > 0) {
          stats.preview = (stats.preview || 0) + typeGroup.total;
        } else if (typeGroup.type === 'click' && typeGroup.total > 0) {
          stats.click = (stats.click || 0) + typeGroup.total;
        }
      });
    });

  // subsecciones
  subsections
    .filter(item => item.subseccion && item.subseccion !== 'null')
    .forEach(item => {
      const path = item.subseccion;
      if (!statsMap.has(path)) {
        statsMap.set(path, { preview: null, click: null });
      }

      item.groupedByType.forEach(typeGroup => {
        const stats = statsMap.get(path);
        if (typeGroup.type === 'preview' && typeGroup.total > 0) {
          stats.preview = (stats.preview || 0) + typeGroup.total;
        } else if (typeGroup.type === 'click' && typeGroup.total > 0) {
          stats.click = (stats.click || 0) + typeGroup.total;
        }
      });
    });

  const categories = Array.from(statsMap.keys());
  const series = [];

  if (showViews.value) {
    series.push({
      name: 'Impresiones',
      data: categories.map(path => {
        const value = statsMap.get(path).preview;
        return value !== null ? value : null;
      })
    });
  }

  if (showClicks.value) {
    series.push({
      name: 'Clicks',
      data: categories.map(path => {
        const value = statsMap.get(path).click;
        return value !== null ? value : null;
      })
    });
  }

  return { categories, series };
};

const fetchData = async () => {
  loading.value = true
  emit('loading', true)
  
  try {
    const [sectionsResponse, subsectionsResponse] = await Promise.all([
      axios.get(`https://ads-service.vercel.app/grafico/stats-secciones/${props.campaignId}`, {
        params: {
          fechai: dateRange.value.start,
          fechaf: dateRange.value.end,
          page: 1,
          limit: 500000
        }
      }),
      axios.get(`https://ads-service.vercel.app/grafico/stats-subsecciones/${props.campaignId}`, {
        params: {
          fechai: dateRange.value.start,
          fechaf: dateRange.value.end,
          page: 1,
          limit: 500000
        }
      })
    ])

    console.log('Sections Response:', sectionsResponse.data)
    console.log('Subsections Response:', subsectionsResponse.data)
    
    if (sectionsResponse.data.resp && subsectionsResponse.data.resp) {
      const { categories, series } = processSectionsData(
        sectionsResponse.data.data,
        subsectionsResponse.data.data
      )
      
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
    console.error('Error fetching stats:', error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const handleDateChange = async (dates) => {
  if (!dates || !dates[0] || !dates[1]) return
  
  dateRange.value = {
    start: formatDate(dates[0]),
    end: formatDate(dates[1])
  }
  
  await fetchData()
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

const downloadData = async () => {
  downloadingData.value = true
  try {
    const response = await axios.get(`https://ads-service.vercel.app/grafico/stats-subsecciones/btn-descargar/${props.campaignId}`, {
      params: {
        fechai: dateRange.value.start,
        fechaf: dateRange.value.end,
        page: 1,
        limit: 500000
      }
    });

    if (response.data.resp && response.data.data) {
      const userStats = new Map();

      response.data.data.forEach(item => {
        const key = `${item.user.wylexId}-${item.subseccion || 'noticias'}`;
        
        if (!userStats.has(key)) {
          userStats.set(key, {
            wylexId: item.user.wylexId,
            first_name: item.user.first_name || '',
            last_name: item.user.last_name || '',
            email: item.user.email || '',
            phone_number: item.user.phone_number || '',
            metadato: item.subseccion || 'noticias',
            views: 0,
            clicks: 0
          });
        }

        const stats = userStats.get(key);
        if (item.type === 'preview') {
          stats.views += item.total;
        } else if (item.type === 'click') {
          stats.clicks += item.total;
        }
      });

      const csvRows = [];
      csvRows.push([
        'ID Wylex',
        'Nombre',
        'Apellido',
        'Email',
        'Teléfono',
        'Sección/Subsección',
        'Total Impresiones',
        'Total Clicks'
      ].join(','));

      userStats.forEach(stat => {
        csvRows.push([
          `"${stat.wylexId}"`,
          `"${stat.first_name}"`,
          `"${stat.last_name}"`,
          `"${stat.email}"`,
          `"${stat.phone_number}"`,
          `"${stat.metadato}"`,
          stat.views,
          stat.clicks
        ].join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      // Formato de nombre de archivo con rango de fechas
      const startDateFormatted = dateRange.value.start.split('-').join('');
      const endDateFormatted = dateRange.value.end.split('-').join('');
      const fileName = `stats_secciones_${startDateFormatted}_${endDateFormatted}.csv`;

      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error al descargar los datos:', error);
  } finally {
    downloadingData.value = false;
  }
};
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