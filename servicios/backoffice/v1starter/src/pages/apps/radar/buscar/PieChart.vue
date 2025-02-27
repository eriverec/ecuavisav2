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
	  }
  });
  const pieChart = ref(null);
  let chartInstance = null;
  
  const createChart = () => {
	if (chartInstance) {
		chartInstance.destroy();
	}
  
	const ctx = pieChart.value.getContext('2d');
	  chartInstance = new Chart(ctx, {
		  type: 'pie',
		  data: {
			  labels: props.chartData.map(item => item.label),
			  datasets: [{
				  label: 'Cantidad',
				  data: props.chartData.map(item => item.value),
				  backgroundColor: [
					  'rgba(255, 99, 132, 0.2)',
					  'rgba(54, 162, 235, 0.2)',
					  'rgba(255, 206, 86, 0.2)',
					  'rgba(75, 192, 192, 0.2)',
					  'rgba(153, 102, 255, 0.2)',
					  'rgba(255, 159, 64, 0.2)'
				  ],
				  borderColor: [
					  'rgba(255, 99, 132, 1)',
					  'rgba(54, 162, 235, 1)',
					  'rgba(255, 206, 86, 1)',
					  'rgba(75, 192, 192, 1)',
					  'rgba(153, 102, 255, 1)',
					  'rgba(255, 159, 64, 1)'
				  ],
				  borderWidth: 1
			  }]
		  },
		  options: {
			  responsive: true,
			  maintainAspectRatio: false,
			  plugins: {
				  title: {
					  display: true,
					  text: 'Distribucion'
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
  