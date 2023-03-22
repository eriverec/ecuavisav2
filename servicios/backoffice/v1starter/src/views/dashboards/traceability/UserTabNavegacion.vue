<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

import CrmActivityTimeline from '@/views/dashboards/traceability/UserTabNavegacionTimeline.vue'

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
   <VRow>
    <VCol lg="7" cols="12" sm="7">
      <VCard>
        <VCardItem class="pb-sm-0">
          <VCardTitle> Más vistas</VCardTitle>
        </VCardItem>
    
    
        <VCardText>
    
          <div v-if="isLoading">Cargando datos...</div>
    
          <VTable class="text-no-wrap tableNavegacion mb-5" v-else>
              <thead>
                <tr>
                  <th scope="col">URL</th>
                  <th scope="col">VISITAS</th>
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
      
     
        </VCardText>
      </VCard>
    </VCol>
    <VCol lg="5" cols="12" sm="5" >
      <VCard>
        <VCardItem class="pb-sm-0">
          <VCardTitle>Últimas visitas</VCardTitle>
          <!-- <VCardSubtitle>Weekly Earnings Overview</VCardSubtitle> -->
        </VCardItem>
        <CrmActivityTimeline />
    
      </VCard>

    </VCol>
   
   </VRow>
</template>

<style scoped>

.tableNavegacion a {
  color: initial !important; 
  text-decoration: underline !important;
}

  td span{
    display: block;
    max-width: 300px;
    /* width: 560px; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

      @media (max-width: 1000px){
        td span{
          max-width: 200px;
        }
      }

</style>
