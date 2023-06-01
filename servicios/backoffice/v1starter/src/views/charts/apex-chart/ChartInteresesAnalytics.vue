<script setup>
import { hexToRgb } from '@layouts/utils';
import { onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme()
const data = ref([]);
const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);
const categories = ref([]);

const fetchData =()=>{ 
      fetch('https://sugerencias-ecuavisa.vercel.app/interes/all')
      .then(response => response.json())
      .then(resp => {     
       data.value = resp.data; 
       console.log('data',data.value);
      
      });
      
}
onMounted(fetchData);

const resolveSeries = computed(() => {
let dataRaw = Array.from(data.value)
const seriesFormat = {
    data: []
};

const categoriesRaw = [];
for (let i in dataRaw) {
    let num = parseInt(dataRaw[i].users_suscribed);
    seriesFormat.data.push(num);
    categoriesRaw.push(dataRaw[i].title);   
}

const options= {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    //colors: ['#00cfe8'],
    dataLabels: { 
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
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
      categories: categoriesRaw,
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    }
      }

return {series: [seriesFormat], options: options};
});


      
</script>

<template>
    <div style="display: flex;" >		
					<div class="date-picker-wrapper" style="width:30%; margin-left:2%;" >
					<AppDateTimePicker
						label="Fecha"
						prepend-inner-icon="tabler-calendar"
						density="compact"
						v-model="fechaIngresada"
						show-current= true
						@on-change="resolveFechaEstadisticas"
						:config="{ 	
						mode:'range',												
						altFormat: 'F j, Y',
						dateFormat: 'd-m-Y',
						maxDate: new Date(),										
						}"
					/>
					</div>
					<div style="margin-left: 5px;">
						<VBtn
							color="primary"							
							@click="resetFiltro"
							>
							Reinciar filtro
						</VBtn>
					</div>	
					</div>	
  <VueApexCharts
    type="bar"
    height="400"
    :options="resolveSeries.options"
    :series="resolveSeries.series"
  />
</template>
<style type="text/css">
.bg-light {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 7px;
}

.align-items-center {
  align-items: center;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* De tema Dark a Light */
.v-theme--light .apexcharts-legend-series .apexcharts-legend-text{
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

.v-theme--light .apexcharts-xaxis .apexcharts-xaxis-texts-g text {
  fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

.v-theme--light .apexcharts-yaxis .apexcharts-yaxis-texts-g text {
  fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

/* De tema Light a Dark */
.v-theme--dark .apexcharts-legend-series .apexcharts-legend-text{
  color: rgba(228, 230, 244, 0.38) !important;
}
.v-theme--dark .apexcharts-xaxis .apexcharts-xaxis-texts-g text {
  fill: rgba(228, 230, 244, 0.38) !important;
}

.v-theme--dark .apexcharts-yaxis .apexcharts-yaxis-texts-g text {
  fill: rgba(228, 230, 244, 0.38) !important;
}


</style>