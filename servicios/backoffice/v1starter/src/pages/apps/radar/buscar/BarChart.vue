<!-- BarChart.vue -->
<template>
	<canvas ref="barChart"></canvas>
</template>
  
<script setup>
import Chart from 'chart.js/auto';
import { onMounted, ref, watch } from 'vue';
  
const props = defineProps({
  chartData: {
    type: Array,
    required: true
  },
  // Color base para esquema monocromático (por defecto sera azul)
  baseColor: {
    type: String,
    default: '#3F51B5'
  }
});

const barChart = ref(null);
let chartInstance = null;

// Función para generar tonos monocromáticos
const generateMonochromaticShades = (baseColor, count) => {
  // Convertir color HEX a RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  const shades = [];
  const alphaValues = [];
  
  //  valores de opacidad escalonados
  for (let i = 0; i < count; i++) {
    const alpha = 0.2 + ((0.5 / Math.max(count - 1, 1)) * i);
    alphaValues.push(alpha);
  }
  
  // Generar colores de fondo con diferentes opacidades
  for (let i = 0; i < count; i++) {
    shades.push(`rgba(${r}, ${g}, ${b}, ${alphaValues[i]})`);
  }
  
  return shades;
};

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = barChart.value.getContext('2d');
  
  // Generar suficientes tonos para todos los datos
  const dataCount = props.chartData.length;
  const backgroundColors = generateMonochromaticShades(props.baseColor, dataCount);
  
  // Para los bordes, usamos el mismo color base pero con opacidad completa
  const borderColor = props.baseColor;
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.chartData.map(item => item.label),
      datasets: [{
        label: 'Frecuencia',
        data: props.chartData.map(item => item.value),
        backgroundColor: backgroundColors,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Keyword'
          }
        }
      }
    }
  });
};

watch(() => props.chartData, () => {
  if (props.chartData.length) {
    createChart();
  }
},
{ deep: true }
);

onMounted(() => {
  if (props.chartData.length) {
    createChart();
  }
});
</script>
  
<style scoped>
canvas {
  height: 300px !important;
}
</style>