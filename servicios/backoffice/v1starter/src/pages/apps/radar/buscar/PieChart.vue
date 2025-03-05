<!-- PieChart.vue -->
<template>
	<canvas ref="pieChart"></canvas>
</template>
  
<script setup>
import Chart from 'chart.js/auto';
import { onMounted, ref, watch } from 'vue';
  
const props = defineProps({
  chartData: {
    type: Array,
    required: true
  },
  // Color base esquema monocromático
  baseColor: {
    type: String,
    default: '#3F51B5'
  }
});

const pieChart = ref(null);
let chartInstance = null;

// Función para generar diferentes tonos monocromáticos de un color base
const generateMonochromaticColors = (baseColor, count) => {
  // Convertir color HEX a RGB
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  const backgroundColors = [];
  const borderColors = [];
  
  //  variaciones del color base
  for (let i = 0; i < count; i++) {

    const luminosityFactor = 0.4 + (0.6 * (i / Math.max(count - 1, 1)));
    
    // Ajustar el color manteniendo  tono pero variando luminosidad
    const adjustedR = Math.min(255, Math.round(r * luminosityFactor));
    const adjustedG = Math.min(255, Math.round(g * luminosityFactor));
    const adjustedB = Math.min(255, Math.round(b * luminosityFactor));
    
    // Color de fondo con opacidad
    backgroundColors.push(`rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, 0.7)`);
    
    // Color de borde con opacidad completa
    borderColors.push(`rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, 1)`);
  }
  
  return {
    backgroundColors,
    borderColors
  };
};

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = pieChart.value.getContext('2d');
  
  // Generar colores monocromáticos para todos los datos
  const dataCount = props.chartData.length;
  const { backgroundColors, borderColors } = generateMonochromaticColors(props.baseColor, dataCount);
  
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: props.chartData.map(item => item.label),
      datasets: [{
        label: 'Cantidad',
        data: props.chartData.map(item => item.value),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Distribución'
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15,
            padding: 10
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