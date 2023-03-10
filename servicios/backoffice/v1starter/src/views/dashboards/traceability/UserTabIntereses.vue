<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";

import { getScatterChartConfig } from "@core/libs/apex-chart/apexCharConfig";

// import ChartNewInteres from '@/views/charts/apex-chart/ChartNewInteres.vue'


const vuetifyTheme = useTheme();
const scatterChartConfig = computed(() =>
  getScatterChartConfig(vuetifyTheme.current.value)
);
const currentTab = ref(0);
const refVueApexChart = ref();

const series = [
  {
    name: "Angular",
    data: [
      {
        x: 5.4,
        y: 170,
      },
      {
        x: 5.4,
        y: 100,
      },
      {
        x: 6.3,
        y: 170,
      },
      {
        x: 5.7,
        y: 140,
      },
      {
        x: 5.9,
        y: 130,
      },
      {
        x: 7,
        y: 150,
      },
      {
        x: 8,
        y: 120,
      },
      {
        x: 9,
        y: 170,
      },
      {
        x: 10,
        y: 190,
      },
      {
        x: 11,
        y: 220,
      },
      {
        x: 12,
        y: 170,
      },
      {
        x: 13,
        y: 230,
      },
    ],
  },
  {
    name: "Vue",
    data: [
      {
        x: 14,
        y: 220,
      },
      {
        x: 15,
        y: 280,
      },
      {
        x: 16,
        y: 230,
      },
      {
        x: 18,
        y: 320,
      },
      {
        x: 17.5,
        y: 280,
      },
      {
        x: 19,
        y: 250,
      },
      {
        x: 20,
        y: 350,
      },
      {
        x: 20.5,
        y: 320,
      },
      {
        x: 20,
        y: 320,
      },
      {
        x: 19,
        y: 280,
      },
      {
        x: 17,
        y: 280,
      },
      {
        x: 22,
        y: 300,
      },
      {
        x: 18,
        y: 120,
      },
    ],
  },
  {
    name: "React",
    data: [
      {
        x: 14,
        y: 290,
      },
      {
        x: 13,
        y: 190,
      },
      {
        x: 20,
        y: 220,
      },
      {
        x: 21,
        y: 350,
      },
      {
        x: 21.5,
        y: 290,
      },
      {
        x: 22,
        y: 220,
      },
      {
        x: 23,
        y: 140,
      },
      {
        x: 19,
        y: 400,
      },
      {
        x: 20,
        y: 200,
      },
      {
        x: 22,
        y: 90,
      },
      {
        x: 20,
        y: 120,
      },
    ],
  },
];

const chartConfigs = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const labelPrimaryColor = `rgba(${hexToRgb(currentTheme.primary)},${
    variableTheme["dragged-opacity"]
  })`;
  const legendColor = `rgba(${hexToRgb(currentTheme["on-background"])},${
    variableTheme["high-emphasis-opacity"]
  })`;
  const borderColor = `rgba(${hexToRgb(
    String(variableTheme["border-color"])
  )},${variableTheme["border-opacity"]})`;
  const labelColor = `rgba(${hexToRgb(currentTheme["on-surface"])},${
    variableTheme["disabled-opacity"]
  })`;

  return [
    {
      title: "Orders",
      icon: "tabler-shopping-cart",
      chartOptions: {
        chart: {
          parentHeightOffset: 0,
          type: "bar",
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            columnWidth: "32%",
            startingShape: "rounded",
            borderRadius: 4,
            distributed: true,
            dataLabels: { position: "top" },
          },
        },
        grid: {
          show: false,
          padding: {
            top: 0,
            bottom: 0,
            left: -10,
            right: -10,
          },
        },
        colors: [
          labelPrimaryColor,
          labelPrimaryColor,
          currentTheme.primary,
          labelPrimaryColor,
          labelPrimaryColor,
          labelPrimaryColor,
          labelPrimaryColor,
          labelPrimaryColor,
          labelPrimaryColor,
        ],
        dataLabels: {
          enabled: true,
          formatter(val) {
            return `${val}k`;
          },
          offsetY: -25,
          style: {
            fontSize: "15px",
            colors: [legendColor],
            fontWeight: "600",
            fontFamily: "Public Sans",
          },
        },
        legend: { show: false },
        tooltip: { enabled: false },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
          ],
          axisBorder: {
            show: true,
            color: borderColor,
          },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: labelColor,
              fontSize: "14px",
              fontFamily: "Public Sans",
            },
          },
        },
        yaxis: {
          labels: {
            offsetX: -15,
            formatter(val) {
              return `${parseInt(val / 1)}k`;
            },
            style: {
              fontSize: "14px",
              colors: labelColor,
              fontFamily: "Public Sans",
            },
            min: 0,
            max: 60000,
            tickAmount: 6,
          },
        },
        responsive: [
          {
            breakpoint: 1441,
            options: { plotOptions: { bar: { columnWidth: "41%" } } },
          },
          {
            breakpoint: 590,
            options: {
              plotOptions: { bar: { columnWidth: "61%" } },
              yaxis: { labels: { show: false } },
              grid: {
                padding: {
                  right: 0,
                  left: -20,
                },
              },
              dataLabels: {
                style: {
                  fontSize: "12px",
                  fontWeight: "400",
                },
              },
            },
          },
        ],
      },
      series: [
        {
          data: [28, 10, 45, 38, 15, 30, 35, 30, 8],
        },
      ],
    },
  ];
});


</script>

<template>

      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
          <VCardTitle>New Technologies Data</VCardTitle>

          <template #append>
            <VBtnToggle
              density="compact"
              color="primary"
              variant="outlined"
              divided
            >
              <VBtn>Daily</VBtn>
              <VBtn>Monthly</VBtn>
              <VBtn>Yearly</VBtn>
            </VBtnToggle>
          </template>
        </VCardItem>

        <VCardText>
          <VueApexCharts
            type="scatter"
            height="400"
            :options="scatterChartConfig"
            :series="series"
          />
        </VCardText>
      </VCard>
   
  <!-- <VCard title="Earning Reports" subtitle="Yearly Earnings Overview">
    <template #append>
      <div class="mt-n4 me-n2">
        <VBtn icon size="x-small" variant="plain" color="default">
          <VIcon size="22" icon="tabler-dots-vertical" />

          <VMenu activator="parent">
            <VList>
              <VListItem
                v-for="(item, index) in ['View More', 'Delete']"
                :key="index"
                :value="index"
              >
                <VListItemTitle>{{ item }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </div>
    </template>

    <VCardText>
      <VSlideGroup v-model="currentTab" show-arrows mandatory>
   
      </VSlideGroup>

      <VueApexCharts
        ref="refVueApexChart"
        :key="currentTab"
        :options="chartConfigs[Number(currentTab)].chartOptions"
        :series="chartConfigs[Number(currentTab)].series"
        height="240"
        class="mt-3"
      />
    </VCardText>
  </VCard> -->
</template>
