<template>
  <div>
    <ApexChart type="donut" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ApexChart from 'vue3-apexcharts';

const props = defineProps({
  chartOptions: Object,
  series: Array,
});

const chartOptions = ref(props.chartOptions || {
  chart: {
    type: 'donut',
  },
  labels: ['Entregados', 'Catalogado como spam', 'Fallo de entrega', 'No existe email', 'Mailbox is full'],
  legend: {
    position: 'bottom'
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
});

const series = ref(props.series || [44, 55, 13, 43, 22]);
</script>
