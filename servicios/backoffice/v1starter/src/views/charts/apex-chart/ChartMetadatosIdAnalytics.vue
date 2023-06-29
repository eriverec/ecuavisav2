<!-- <script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { apexCharConfigMetadatos } from '@core/libs/apex-chart/apexCharConfigMetadatos'

const vuetifyTheme = useTheme()
const horizontalBarChartConfig = computed(() => apexCharConfigMetadatos(vuetifyTheme.current.value))


const series = [{
  data: [
    720,
    350,
    480,
    600,
    210,
    550,
    150,
  ],
}]
</script>

<template>
  <VueApexCharts
    type="bar"
    height="400"
    :options="horizontalBarChartConfig"
    :series="series"
  />
</template> -->


<template>
  <div>
    <div id="chart"></div>
  </div>
</template>

<script setup>
import ApexCharts from 'apexcharts'

const fetchData = async () => {
  try {
    const getIdRowUser = localStorage.getItem('idRowUser');
    const response = await fetch('https://servicio-de-actividad.vercel.app/meta/navegation/group/' + getIdRowUser);
    const data = await response.json();

    if (data.resp) {
      const seriesData = data.data.map(item => item.count)
      const categories = data.data.map(item => item._id)

      const chartOptions = {
        chart: {
          toolbar: { show: false },
          type: 'bar',
          height: 350
        },
        series: [{
          name: 'Count',
          data: seriesData
        }],
        plotOptions: {
          bar: {
            borderRadius: 8,
            barHeight: '30%',
            horizontal: true,
            startingShape: 'rounded',
          },
        },
        grid: {
          borderColor: "#eee",
          xaxis: {
            lines: { show: false },
          },
          padding: {
            top: -10,
          },
        },
        xaxis: {
          categories: categories
        }
      }

      const chart = new ApexCharts(document.querySelector('#chart'), chartOptions)
      chart.render()
    }
  } catch (error) {
    console.error(error)
  }
}

fetchData()
</script>


<style>
.v-theme--dark .apexcharts-text.apexcharts-yaxis-label {
  fill: white;
}

</style>