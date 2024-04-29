<template>
  <div :class="{ 'mb-3': margin }">
    <VCardTitle>{{ title }}</VCardTitle>
    <ApexChart
      type="bar"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
import ApexChart from 'vue3-apexcharts';

export default {
  props: {
    title: String,
    categories: Array,
    series: Array,
    options: Object,
    margin: Boolean, // Optional prop for styling
  },
  components: {
    ApexChart,
  },
};
</script>