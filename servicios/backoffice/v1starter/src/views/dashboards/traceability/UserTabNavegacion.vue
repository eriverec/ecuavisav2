<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const vuetifyTheme = useTheme()

const series = [{
  data: [
    40,
    65,
    50,
    45,
    90,
    55,
    70,
  ],
}]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  
  return {
    chart: {
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        barHeight: '60%',
        columnWidth: '38%',
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadius: 4,
        distributed: true,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -30,
        bottom: 0,
        left: -10,
        right: -10,
      },
    },
    colors: [
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,
      currentTheme.primary,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,
    ],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: [
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa',
        'Su',
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`,
          fontSize: '14px',
          fontFamily: 'Public Sans',
        },
      },
    },
    yaxis: { labels: { show: false } },
    tooltip: { enabled: false },
    responsive: [{
      breakpoint: 1025,
      options: { chart: { height: 199 } },
    }],
  }
})

const earningsReports = [
  {
    color: 'primary',
    icon: 'tabler-currency-dollar',
    title: 'Earnings',
    amount: '$545.69',
    progress: '55',
  },
  {
    color: 'info',
    icon: 'tabler-chart-pie-2',
    title: 'Profit',
    amount: '$256.34',
    progress: '25',
  },
  {
    color: 'error',
    icon: 'tabler-brand-paypal',
    title: 'Expense',
    amount: '$74.19',
    progress: '65',
  },
]

// const url = 'https://servicio-de-actividad.vercel.app/actividad/all';

const urlCounts = ref([]);
const isLoading = ref(true);

async function fetchData() {
  try {
    const response = await fetch('https://servicio-de-actividad.vercel.app/actividad/all');
    const data = await response.json();
    const urlMap = new Map();

    for (const activity of data.data) {
      for (const record of activity.navigationRecord) {
        const url = record.url;
        const title = record.title;
        if (urlMap.has(url)) {
          urlMap.get(url).count++;
        } else {
          urlMap.set(url, { url, title, count: 1 });
        }
      }
    }

    urlCounts.value = Array.from(urlMap.values());
    urlCounts.value.sort((a, b) => b.count - a.count); // Ordenar los datos
  } catch (error) {
    console.error(error);
  }
  isLoading.value = false;
}

onMounted(fetchData);

</script>

<template>
  <VCard>
    <VCardItem class="pb-sm-0">
      <VCardTitle>Earning Reports</VCardTitle>
      <VCardSubtitle>Weekly Earnings Overview</VCardSubtitle>
    </VCardItem>

    <VCardText>

      <div v-if="isLoading">Cargando datos...</div>

      <VTable class="text-no-wrap tableNavegacion mb-5" v-else>
          <thead>
            <tr>
              <th scope="col">URL</th>
              <th scope="col">PÁGINAS VISTAS</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item  in urlCounts" :key="item.url">
              <td class="text-high-emphasis">
                <span> <a :href="item.url" target="_blank"> {{ item.title ? item.title : item.url }}</a>  </span>
              </td>

              <td class="text-medium-emphasis">
                {{ item.count }}
              </td>
            </tr>
          </tbody>
        </VTable>
  
      <VRow>
        <VCol
          cols="12"
          sm="5"
          class="d-flex flex-column align-self-end"
        >
          <div class="d-flex align-center gap-2 mb-2 pb-1 flex-wrap">
            <h4 class="text-4xl font-weight-semibold">
              $468
            </h4>
            <VChip
              label
              color="success"
            >
              +4.2%
            </VChip>
          </div>

          <p class="text-sm">
            You informed of this week compared to last week
          </p>
        </VCol>

        <VCol
          cols="12"
          sm="7"
          class="pt-0"
        >
          <VueApexCharts
            :options="chartOptions"
            :series="series"
            height="190"
          />
        </VCol>
      </VRow>

      <div class="border rounded mt-3 pa-4">
        <VRow>
          <VCol
            v-for="report in earningsReports"
            :key="report.title"
            cols="12"
            sm="4"
          >
            <div class="d-flex align-center">
              <VAvatar
                rounded
                size="30"
                :color="report.color"
                variant="tonal"
                class="me-2"
              >
                <VIcon :icon="report.icon" />
              </VAvatar>

              <h6 class="text-base font-weight-medium">
                {{ report.title }}
              </h6>
            </div>
            <h6 class="text-h6 my-3">
              {{ report.amount }}
            </h6>
            <VProgressLinear
              :model-value="report.progress"
              :color="report.color"
              height="8"
              rounded
              rounded-bar
            />
          </VCol>
        </VRow>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>

.tableNavegacion a {
  color: initial !important; 
  text-decoration: underline !important;
}

  td span{
        display: block;
        max-width: 500px;
        /* width: 560px; */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

</style>
