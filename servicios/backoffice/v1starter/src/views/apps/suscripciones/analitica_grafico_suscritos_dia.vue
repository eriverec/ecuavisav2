<template>
  <VCard>
    <VCardText>
      <VCardTitle>Suscripciones Diarias {{ nombreMes }} {{ anio }}</VCardTitle>
      <VRow>
        <VCol cols="12" sm="8">
          <VueApexCharts
            v-if="chartSeries[0].data.length > 0"
            type="line"
            height="400"
            :options="chartOptions"
            :series="chartSeries"
          />
          <p v-else>No hay datos para mostrar en este período.</p>
        </VCol>
        <VCol cols="12" sm="4">
          <VSelect
            v-model="anio"
            :items="aniosDisponibles"
            label="Seleccionar Año"
            @update:model-value="fetchData"
          />
          <VSelect
            v-model="mes"
            :items="mesesDisponibles"
            label="Seleccionar Mes"
            @update:model-value="fetchData"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'GraficoSuscripcionesDiarias',
  components: {
    VueApexCharts
  },
  setup() {
    const anio = ref(new Date().getFullYear())
    const mes = ref((new Date().getMonth() + 1).toString().padStart(2, '0'))
    const datos = ref([])

    const aniosDisponibles = computed(() => {
      const anioActual = new Date().getFullYear()
      return Array.from({ length: 5 }, (_, i) => anioActual - i)
    })

    const mesesDisponibles = [
      { value: '01', title: 'Enero' },
      { value: '02', title: 'Febrero' },
      { value: '03', title: 'Marzo' },
      { value: '04', title: 'Abril' },
      { value: '05', title: 'Mayo' },
      { value: '06', title: 'Junio' },
      { value: '07', title: 'Julio' },
      { value: '08', title: 'Agosto' },
      { value: '09', title: 'Septiembre' },
      { value: '10', title: 'Octubre' },
      { value: '11', title: 'Noviembre' },
      { value: '12', title: 'Diciembre' }
    ]

    const nombreMes = computed(() => {
      return mesesDisponibles.find(m => m.value === mes.value)?.title
    })

    const fetchData = async () => {
      try {
        const url = 'https://servicios-ecuavisa-suscripciones.vercel.app/backoffice-grafico/suscripciones-realizados-activas-agrupados-por-dia?anio=${anio.value}&mes=${mes.value}&idPaquete=651c9d012ff9fa09a75e6c16&estado=7'
        const response = await fetch(url)
        const json = await response.json()
        if (json.resp) {
          datos.value = json.data
        } else {
          datos.value = []
        }
      } catch (error) {
        console.error('Error al obtener datos:', error)
        datos.value = []
      }
    }

    const chartSeries = computed(() => [{
      name: 'Suscripciones',
      data: datos.value.map(item => ({
        x: new Date(item.fecha).getTime(),
        y: item.suscritos
      }))
    }])

    const chartOptions = computed(() => ({
      chart: {
        type: 'line',
        toolbar: { show: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      dataLabels: { enabled: false },
      markers: {
        size: 6,
        strokeWidth: 3,
        hover: { size: 8 },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd MMM',
        },
      },
      yaxis: {
        title: {
          text: 'Suscripciones',
        },
        min: 0,
        forceNiceScale: true,
        labels: {
          formatter: (value) => Math.round(value)
        }
      },
      tooltip: {
        x: { format: 'dd MMM yyyy' },
      },
      colors: ['#7367F0'],
    }))

    watch([anio, mes], () => {
      fetchData()
    })

    onMounted(() => {
      fetchData()
    })

    return {
      anio,
      mes,
      aniosDisponibles,
      mesesDisponibles,
      nombreMes,
      chartSeries,
      chartOptions,
      fetchData
    }
  }
}
</script>