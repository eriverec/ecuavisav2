<template>
  <VCard>
    <VCardTitle>
      Usuarios registrados
    </VCardTitle>
    <VCardSubtitle>
      Mira los usuarios registrados, cursos y logros
    </VCardSubtitle>
    <VCardText>
      <div class="d-flex align-center mb-4">
        <VSelect
          v-model="selectedYear"
          :items="availableYears"
          label="Filtrar por año"
          style="max-width: 200px;"
          class="d-none"
        />
        <VSpacer />
        <VBtn
          prepend-icon="tabler-download"
          variant="outlined"
          color="default"
          class="ml-2 d-none"
        >
          Descargar
        </VBtn>
      </div>
      <VueApexCharts
        type="bar"
        height="400"
        :options="chartOptions"
        :series="chartSeries"
      />
    </VCardText>
  </VCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')

const selectedYear = ref(new Date().getFullYear())
const availableYears = [2023, 2024, 2025]
const subscriptionData = ref([])

const fetchData = async () => {
  const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD')
  const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD')
  try {
    const response = await axios.get('https://ecuavisa-suscripciones.vercel.app/backoffice-grafico/suscripciones-activas-por-dia-filtro-fechas', {
      params: {
        idPaquete: '651c9d012ff9fa09a75e6c16',
        fechai: startOfWeek,
        fechaf: endOfWeek
      }
    })
    subscriptionData.value = response.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const weekDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    days.push(moment().startOf('isoWeek').add(i, 'days'))
  }
  return days
})

const chartSeries = computed(() => [{
  name: 'Usuarios registrados',
  data: weekDays.value.map(day => {
    const found = subscriptionData.value.find(item => item.fecha === day.format('YYYY-MM-DD'))
    return found ? found.suscritos : 0
  })
}])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val || '0'
    },
    style: {
      fontSize: '12px',
      colors: ['#304758']
    }
  },
  colors: weekDays.value.map(day => 
    day.isSame(moment(), 'day') ? '#7367F0' : '#E0E0E0'
  ),
  xaxis: {
    categories: weekDays.value.map(day => day.format('ddd')),
    labels: {
      style: {
        colors: '#909399',
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Usuarios registrados'
    },
    labels: {
      formatter: function (val) {
        return val.toFixed(0)
      }
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val
      }
    }
  },
  annotations: {
    points: [{
      x: moment().format('ddd'),
      y: chartSeries.value[0].data[moment().day() - 1],
      marker: {
        size: 6,
        fillColor: '#fff',
        strokeColor: '#7367F0',
        radius: 2
      },
      label: {
        borderColor: '#7367F0',
        offsetY: 0,
        style: {
          color: '#fff',
          background: '#7367F0',
        },
        text: 'Hoy'
      }
    }]
  }
}))

onMounted(() => {
  fetchData()
})
</script>