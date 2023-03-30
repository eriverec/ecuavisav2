<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const vuetifyTheme = useTheme()
const preguntas = ref([])
const preguntasConCount = ref({})

const currentTheme = vuetifyTheme.current.value.colors
const variableTheme = vuetifyTheme.current.value.variables
const labelPrimaryColor = `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`
const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`
const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`

const columnColors = {
    series1: '#826af9',
    series2: '#d2b0ff',
    bg: '#f8d3ff',
  }

/*NUEVO CODE DE EVETOS ECUAVISA*/
// https://showandevents-service.vercel.app/all


const chartConfigs = computed(() => {
  return preguntas.value.map(pregunta => {
    return {
      chartOptions: {
        chart: {
          parentHeightOffset: 0,
          type: 'bar',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            columnWidth: '32%',
            startingShape: 'rounded',
            borderRadius: 4,
            distributed: true,
            dataLabels: { position: 'center' }
          }
        },
        grid: {
          show: false,
          padding: { top: 0, bottom: 0, left: -10, right: -10 }
        },
        colors: [columnColors.series2,columnColors.series1],
        dataLabels: {
          enabled: true,
          formatter(val) { return `${val}` },
          offsetY: 0,
          style: {
            fontSize: '15px',
            colors: [legendColor],
            fontWeight: '600'
          }
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'left',
          labels: { colors: labelColor },
        },
        tooltip: { enabled: false },
        xaxis: {
          categories: preguntasConCount.value[pregunta].map(respuesta => respuesta.respuesta),
          axisBorder: { show: true, color: borderColor },
          axisTicks: { show: false },
          labels: {
            style: { colors: labelColor, fontSize: '14px' }
          }
        },
        yaxis: {
          labels: {
            offsetX: -15,
            formatter(val) { return `${parseInt(val / 1)}` },
            style: { fontSize: '14px', colors: labelColor },
            min: 0,
            max: 60000,
            tickAmount: 6
          }
        }
      },
      series: [{ data: preguntasConCount.value[pregunta].map(respuesta => respuesta.count ) }]
    }
  })
})

async function fetchData(param="") {
  const response = await fetch('https://showandevents-service.vercel.app/all'+param)
  const data = await response.json();
  preguntas.value = [];
  preguntasConCount.value = [];
  data.data.forEach(trivia => {
    trivia.data.forEach(datos => {
      datos.trivia.forEach(pregunta => {
        if (preguntas.value.includes(pregunta.pregunta)) {
          const respuesta = preguntasConCount.value[pregunta.pregunta].find(
            item => item.respuesta === pregunta.respuesta
          )
          if (respuesta !== undefined) respuesta.count++
          else {
            preguntasConCount.value[pregunta.pregunta].push({
              respuesta: pregunta.respuesta,
              count: 1
            })
          }
        } else {
          preguntas.value.push(pregunta.pregunta)
          preguntasConCount.value[pregunta.pregunta] = [{
            respuesta: pregunta.respuesta,
            count: 1
          }]
        }
      })
    })
  })
}

onMounted(() => {
  fetchData();
})

</script>

<template>
  <div>
    <h1>Tabla de Respuestas de Usuarios</h1>
    <div v-for="(pregunta, index) in preguntas" :key="index" class="mt-3">
      <VCard>
        <h3 class="py-4 px-4">{{ pregunta }}</h3>
        <VueApexCharts 
        :options="chartConfigs[index].chartOptions" 
        :series="chartConfigs[index].series" 
        height="240"
        class="py-4 px-4" />
      </VCard>
    </div>
  </div>
</template>
