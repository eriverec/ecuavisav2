<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

import { Spanish } from 'flatpickr/dist/l10n/es.js';

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
      { x: '2022-01-01', y: 10 },
      { x: '2022-02-02', y: 22 },
      { x: '2022-03-03', y: 33 },
      { x: '2022-04-04', y: 2 },
    ],
  },
  {
    name: "Vue",
    data: [
      { x: '2022-01-01', y: 12 },
      { x: '2022-02-02', y: 135 },
      { x: '2022-03-03', y: 2 },
      { x: '2022-04-04', y: 3 },
    ],
  },
  {
    name: "React",
    data: [
      { x: '2022-01-01', y: 51 },
      { x: '2022-02-02', y: 65 },
      { x: '2022-03-03', y: 4 },
      { x: '2022-04-04', y: 455 },
    ],
  },
];

</script>

<template>
  <VCard>
    <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
      <VCardTitle>New Technologies Data API</VCardTitle>

      <template #append>
        <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
          <div class="date-picker-wrapper" style="width: 233px">
            <AppDateTimePicker id="date-picker" placeholder="Seleccionar una fecha" prepend-inner-icon="tabler-calendar"
              density="compact" 
              @on-change="filtrarDatos"
              :config="{ 
                locale: Spanish,
                mode:'range',
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
                maxDate: new Date()
              }"
            />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <VueApexCharts type="scatter" height="400" :options="scatterChartConfig" :series="series" />
    </VCardText>
  </VCard>
</template>
