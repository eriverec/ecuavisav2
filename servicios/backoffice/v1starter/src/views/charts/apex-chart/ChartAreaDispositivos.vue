<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
// import { getAreaChartSplineConfig } from "@core/libs/apex-chart/apexCharConfigCustom";

import { hexToRgb } from "@layouts/utils";

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

/*
mounted(() =>
  this.actualizarGrafico()
);

methods(() =>
  actualizarGrafico() {
    const datosFiltrados = this.series.filter(d => d.fecha === this.fechaFiltro);
    const options = {
      chart: {
        type: 'bar'
      },
      series: [{
        name: 'Valores',
        data: datosFiltrados.map(d => d.value)
      }],
      xaxis: {
        categories: datosFiltrados.map(d => d.name),
      }
    };
    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();
  }
);
watch(() =>
  fechaFiltro() {
    this.actualizarGrafico();
  }
);




*/

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
      categories: [
        "700/12",
        "8/12",
        "9/12",
        "10/12",
        "11/12",
        "12/12",
        "13/12",
        "14/12",
        "15/12",
        "16/12",
        "17/12",
        "18/12",
        "19/12",
      ],
    },
  };
};

const series = [
  {
    name: "Mobile",
    data: [100, 120, 90, 170, 130, 160, 140, 240, 220, 180, 270, 280, 375],
    fecha: "2022-01-01",
  },
  {
    name: "Tablet",
    data: [60, 80, 70, 110, 80, 100, 90, 180, 160, 140, 200, 220, 275],
    fecha: "2022-03-01",
  },
  {
    name: "Desktop",
    data: [20, 40, 30, 70, 40, 60, 50, 140, 120, 100, 140, 180, 220],
    fecha: "2022-04-06",
  },
];
</script>

<template>
  <div class="date-picker-wrapper">
    <AppDateTimePicker
      model-value="2022-06-09"
      prepend-inner-icon="tabler-calendar"
      density="compact"
      :config="{ position: 'auto right' }"
    />
  </div>

  <VueApexCharts
    type="area"
    height="400"
    :options="chartConfig"
    :series="series"
  />
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.apexcharts-tooltip.apexcharts-theme-light .apexcharts-tooltip-title {
  background: #eceff1 !important;
  border-bottom: 1px solid #ddd;
}

.apexcharts-tooltip.apexcharts-theme-light {
  border: 1px solid #e3e3e3;
  background: rgba(255, 255, 255, 0.96) !important;
}
.apexcharts-canvas .apexcharts-tooltip.apexcharts-theme-light {
  color: #333 !important;
}

.date-picker-wrapper {
  inline-size: 10.5rem;
}

#apex-chart-wrapper {
  .v-card-item__append {
    padding-inline-start: 0;
  }
}
</style>
