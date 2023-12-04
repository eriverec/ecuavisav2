<script setup>
  import VueApexCharts from 'vue3-apexcharts'
  import { useTheme } from 'vuetify'

  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);

  const dataChart = ref([]);

  const isMobile = window.innerWidth <= 768;

  const vuetifyTheme = useTheme();
  const now = moment(); // fecha de hoy 
  
  const props = defineProps({
    realtime: Boolean,
    usuarios: String,
    totalPagesVisits: String,
  });

  const resolveData = computed(() => {

    let dataRaw = Array.from(dataChart.value);
    const seriesFormat = {
        name: 'Visitas',
        data: []
    };

    const categoriesRaw = [];
    for (let i in dataRaw) {
        let num = parseInt(dataRaw[i].visits);
        seriesFormat.data.push(num);
        // const end = moment(dataRaw[i].name+":00", "YYYYY-MM-DD hh:mm:00"); // fecha 1 de Enero de 2022
        // const duration = moment.duration(now.diff(end));
        var min = 20 - i;
        categoriesRaw.push(min==0?`Ahora`:`Hace ${min} min`);   

        // console.log({
        //   name: `Hace ${20 - i} minuto(s)`,
        //   num
        // })
    }

    // console.log(categoriesRaw)

    const currentTheme = vuetifyTheme.current.value.colors

    const options= {
      chart: {
        type: 'area',
        toolbar: false,
      },
      markers: { strokeColor: 'transparent' },
      dataLabels: { enabled: false },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      stroke: {
        width: 3,
        curve: 'straight',
      },
      colors: [currentTheme.warning],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.15,
          stops: [
            0,
            95,
            100,
          ],
        },
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        lines: { show: false },
        categories: categoriesRaw
      },
      yaxis: {
        labels: { show: false },
        // min: 1,
        // max: 66,
        tickAmount: 5,
      },
      tooltip: { 
        enabled: true
      },
    }

    // console.log(categoriesRaw)

    return {series: [seriesFormat], options: options, intereses: categoriesRaw};
  });

var intervalId;

async function getChart() {
  await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/realtimeService/show_v_3.php?groupTime`)
    .then(response => response.json())
    .then(data => {
      dataChart.value = data;
    }).catch(error => { 
      // isDialogVisibleChart2.value = false;
      return error;
    });
}

async function juntas() {
  await getChart();
}

onMounted(async () => {
  if(props.realtime){
    intervalId = setInterval(juntas, 5000);
  }else{
    clearInterval(intervalId);
  }
});

watch(props, async (newProps, oldProps) => {
  // Imprime las nuevas fechas
  if(newProps.realtime){
    intervalId = setInterval(juntas, 5000);
  }else{
    clearInterval(intervalId);
  }
  
});

const projectStatus = [
  {
    title: 'Escritorio',
    amount: '$756.26',
    lossProfit: -139.34,
  },
  {
    title: 'Mobile',
    amount: '$2,207.03',
    lossProfit: +576.24,
  },
]
</script>

<template>
  <VCard title="Visitas en tiempo real">
    <VCardText>
      <VList class="card-list">
        <VListItem>
          <template #prepend>
            <VAvatar
              color="warning"
              variant="tonal"
              rounded
              icon="mdi-link-variant"
            />
          </template>
          <VListItemTitle class="font-weight-medium">
            {{props.totalPagesVisits}}
          </VListItemTitle>
          <VListItemSubtitle class="opacity-100 text-disabled">
            Páginas de ecuavisa.com visitadas durante 20 min.
          </VListItemSubtitle>

          <template #append>
            <div title="Usuarios activos">
              <VAvatar
                color="success"
                variant="tonal"
                rounded
                icon="mdi-account-multiple"
              />
              <span class="text-success ml-4">{{props.usuarios}}</span>
            </div>
            
          </template>
        </VListItem>
      </VList>

      <VueApexCharts
        :options="resolveData.options"
        :series="resolveData.series"
        height="127"
      />

     
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 15px;
}
</style>
