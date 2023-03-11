<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";
import { Spanish } from 'flatpickr/dist/l10n/es.js'
// 👉 Colors variables
const colorVariables = (themeColors) => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(
    themeColors.colors["on-surface"]
  )},${themeColors.variables["medium-emphasis-opacity"]})`;
  const themeDisabledTextColor = `rgba(${hexToRgb(
    themeColors.colors["on-surface"]
  )},${themeColors.variables["disabled-opacity"]})`;
  const themeBorderColor = `rgba(${hexToRgb(
    String(themeColors.variables["border-color"])
  )},${themeColors.variables["border-opacity"]})`;
  const themePrimaryTextColor = `rgba(${hexToRgb(
    themeColors.colors["on-surface"]
  )},${themeColors.variables["high-emphasis-opacity"]})`;

  return {
    themeSecondaryTextColor,
    themeDisabledTextColor,
    themeBorderColor,
    themePrimaryTextColor,
  };
};

const vuetifyTheme = useTheme();
const chartConfig = computed(() =>
  getAreaChartSplineConfig(vuetifyTheme.current.value)
);

// ESTE ES el Dispositivos
const getAreaChartSplineConfig = (themeColors) => {
  const areaColors = {
    series3: "#e0cffe",
    series2: "#b992fe",
    series1: "#ab7efd",
  };

  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } =
    colorVariables(themeColors);

  return {
    chart: {
      id: "crejemplo",
      type: "bar",
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    tooltip: {
      shared: false,
      enabled: true,
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },

    dataLabels: { enabled: false },
    stroke: {
      show: false,
      curve: "smooth",
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: themeSecondaryTextColor },
      markers: {
        offsetY: 1,
        offsetX: -3,
      },
      itemMargin: {
        vertical: 3,
        horizontal: 10,
      },
    },
    colors: [areaColors.series3, areaColors.series2, areaColors.series1],
    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      show: true,
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor },
      },
      categories: [],
    },
  };
};

const series = [
  {
    name: "Mobile",
    data: [{
            x: '2022-02-01',
            y: 21,
          },
          {
            x: '2022-02-12',
            y: 40,
          },
          {
            x: '2022-02-15',
            y: 1,
        }]
  }
];
/*ESCRIPT*/
flatpickr.setDefaults({
  disableMobile: true
});
console.log(getAreaChartSplineConfig(vuetifyTheme.current.value));
function obtenerFecha(selectedDates, dateStr, instance){
  // actualiza la serie de datos filtrados y vuelve a renderizar el gráfico
  var filteredChartSeries = [{
    name: "Mobile",
    data: [{
            x: '2022-02-01',
            y: 121,
          },
          {
            x: '2022-02-12',
            y: 240,
          },
          {
            x: '2022-02-15',
            y: 21,
        }]
  }];
  ApexCharts.exec("crejemplo", "updateSeries", filteredChartSeries);
}

</script>

<template>
  <div class="date-picker-wrapper">
    <AppDateTimePicker
      model-value="2022-06-09"
      prepend-inner-icon="tabler-calendar"
      density="compact"
      @on-change="obtenerFecha"
      :config="{ 
        position: 'auto right',
        locale: Spanish,
        mode:'range'
      }"
    />
  </div>
  <div class="w-100">
    <VCardText>
      <VueApexCharts
        id="nuevocomponente"
        type="area"
        height="400"
        :options="chartConfig"
        :series="series"
      />
    </VCardText>
    
  </div>
</template>