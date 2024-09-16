<template>
  <VCard>
    <VCardItem>
      <div class="p-0 d-flex flex-column align-items-start">
        <VCardTitle>
          Usuarios registrados
        </VCardTitle>
        <VCardSubtitle>
          Estadística de suscriptores nuevos de la semana seleccionada
        </VCardSubtitle>
      </div>
      <template #append>
        <VBtn
          :loading="btnLoadingDescargar"
          :disabled="btnLoadingDescargar"
          color="primary"
          @click="descargarReporte"
        >
          Descargar
          <VIcon end icon="tabler-cloud-download" />
        </VBtn>
      </template>
    </VCardItem>
    <VCardText>
      <div class="d-flex align-center mb-4">
        <VSelect
          v-model="selectedWeek"
          :items="weekOptions"
          label="Seleccionar semana"
          style="width: 100%;"
        />
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
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'
import { computed, onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

moment.locale('es')

const DOMAIN = 'https://ecuavisa-suscripciones.vercel.app'
const ID_PAQUETE = '651c9d012ff9fa09a75e6c16'

const selectedWeek = ref('current')
const weekOptions = [
  { value: 'current', title: 'Semana actual' },
  { value: 'previous', title: 'Semana anterior' },
]
const subscriptionData = ref([])
const btnLoadingDescargar = ref(false)

const fetchData = async () => {
  const { startOfWeek, endOfWeek } = getWeekDates()
  
  try {
    const response = await axios.get(`${DOMAIN}/backoffice-grafico/suscripciones-activas-por-dia-filtro-fechas`, {
      params: {
        idPaquete: ID_PAQUETE,
        fechai: startOfWeek.format('YYYY-MM-DD'),
        fechaf: endOfWeek.format('YYYY-MM-DD')
      }
    })
    subscriptionData.value = response.data.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const getWeekDates = () => {
  const startOfWeek = moment().startOf('isoWeek').subtract(selectedWeek.value === 'previous' ? 1 : 0, 'weeks')
  const endOfWeek = moment(startOfWeek).endOf('isoWeek')
  return { startOfWeek, endOfWeek }
}


const weekDays = computed(() => {
  const { startOfWeek } = getWeekDates()
  return Array.from({ length: 7 }, (_, i) => moment(startOfWeek).add(i, 'days'))
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
    toolbar: {
      show: false
    },
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
    categories: weekDays.value.map(day => day.format('ddd DD/MM').charAt(0).toUpperCase() + day.format('ddd DD/MM').slice(1)),
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
  }
}))

const descargarReporte = async () => {
  btnLoadingDescargar.value = true
  try {
    const { startOfWeek, endOfWeek } = getWeekDates()
    const response = await axios.get(`${DOMAIN}/backoffice-grafico/suscripciones-activas-por-dia-filtro-fechas-descargar`, {
      params: {
        idPaquete: ID_PAQUETE,
        fechai: startOfWeek.format('YYYY-MM-DD'),
        fechaf: endOfWeek.format('YYYY-MM-DD'),
        page: 1,
        limit: 10000 
      }
    })

    if (response.data.resp && Array.isArray(response.data.data)) {
      const rawData = response.data.data
      const filteredData = rawData.filter(item => {
        const itemDate = moment(item.fecha)
        return itemDate.isBetween(startOfWeek, endOfWeek, null, '[]')
      })

      if (filteredData.length === 0) {
        console.warn('No se encontraron registros para la semana seleccionada.')
        return
      }

      const flattenObject = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, k) => {
          const pre = prefix.length ? prefix + '_' : ''
          if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k))
          } else {
            acc[pre + k] = obj[k]
          }
          return acc
        }, {})
      }

      const flattenedData = filteredData.map(item => flattenObject(item))
      const headers = Object.keys(flattenedData[0]).join(',')
      const csvContent = [
        headers,
        ...flattenedData.map(item => Object.values(item).map(value => {
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value).replace(/"/g, '""')
          }
          return value
        }).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `suscripciones_${selectedWeek.value === 'current' ? 'semana_actual' : 'semana_anterior'}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      console.error('La respuesta no tiene el formato esperado:', response.data)
    }
  } catch (error) {
    console.error('Error al descargar el reporte:', error)
  } finally {
    btnLoadingDescargar.value = false
  }
}


watch(selectedWeek, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>
