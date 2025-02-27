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
	  }
  });
  const barChart = ref(null);
  let chartInstance = null;
  
  const createChart = () => {
	if (chartInstance) {
		chartInstance.destroy();
	}
  
	const ctx = barChart.value.getContext('2d');
	  chartInstance = new Chart(ctx, {
		  type: 'bar',
		  data: {
			  labels: props.chartData.map(item => item.label),
			  datasets: [{
				  label: 'Frecuencia',
				  data: props.chartData.map(item => item.value),
				  backgroundColor: 'rgba(54, 162, 235, 0.2)',
				  borderColor: 'rgba(54, 162, 235, 1)',
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
  