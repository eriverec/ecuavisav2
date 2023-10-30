<template>
  <VRow>
    <!-- <VCol cols="12">
      <VBtnToggle class="d-none" v-model="btnFiltros" color="primary" variant="outlined" divided>
        <VBtn :value="item._id" @click="resolveFiltroSelection(item._id)" v-for="item  in filtrosDispositivos">
          {{ item.nombre }}
        </VBtn>

      </VBtnToggle>

    </VCol> -->


    <VCol sm="4" cols="12">
      <div class="date-picker-wrapper" style="width: 100%;">
        <!-- <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresada"
          show-current="true" @on-change="obtenerPorFechaMeta" :config="{
            position: 'auto right',
            mode: 'range',
            altFormat: 'F j, Y',
            dateFormat: 'm-d-Y',
            maxDate: new Date(),
            reactive: true
          }" /> -->
      </div>
    </VCol>
    <VCol sm="3" cols="12">
      <VBtn color="success" @click="reset" :disabled="isLoading">
        <VIcon class="mr-2" size="20" icon="tabler-refresh" /> Reiniciar filtros
      </VBtn>
    </VCol>
    <VCol sm="3" cols="12">
      <VBtn color="primary">
        <VIcon class="mr-2" size="20" icon="tabler-download" /> Exportar
      </VBtn>
    </VCol>

  </VRow>


  <h3 v-show="isLoading" class="loaderText">Cargando...</h3>

  <div :class="classLoading">
    <div class="v-row">
      <div class="v-col-12">
        <VCardText>
          <div class="d-none">No se encontraron datos, selecciona otros filtros</div>

          <div>
            <!-- <VueApexCharts id="crejemplo" type="bar" height="500" :options="chartOptions" :series="chartSeries" /> -->
          </div>
        </VCardText>
      </div>
    </div>

  </div>
  <div id="chart"></div>
</template>
  
<style>
.custom-tooltip {
  background: linear-gradient(72.47deg, rgb(var(--v-global-theme-primary)) 22.16%, rgba(var(--v-global-theme-primary), 0.7) 76.47%) !important;
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));

  color: #fff;
  padding: 10px;
  border-radius: 5px;
}

.title {
  font-weight: bold;
}

.loaderText {
  text-align: center;
  margin-top: 30px;
}

.value {
  margin-left: 5px;
}
</style>
  
<script setup>
import { hexToRgb } from '@layouts/utils';
import Moment from 'moment';
import axios from 'axios';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import VueApexCharts from 'vue3-apexcharts';
import ApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
const fechaIngresada = ref('');
const fechaIni = ref('');
const fechaFin = ref('');


const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`

  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme();
const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

// Datos de la API
const apiUrl = 'https://servicio-de-actividad.vercel.app/grafico/metadato/subseccion/10?fechai=2023-10-27&fechaf=2023-10-29';

// Datos del gráfico
const chartData = ref({
  options: {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: [],
    },
  },
  series: [
    {
      name: 'Total',
      data: [],
    },
  ],
});

// Hacer la solicitud GET a la API y actualizar los datos del gráfico
onMounted(async () => {
  try {
    const response = await axios.get(apiUrl);
    const data = response.data.data;
    
    chartData.value.options.xaxis.categories = data.map((item) => item.name);
    chartData.value.series[0].data = data.map((item) => item.total);
    
    // Crear el gráfico Apex Chart
    const chart = new VueApexCharts(document.querySelector('#chart'), chartData.value.options);
    chart.render();
  } catch (error) {
    console.error('Error al obtener datos de la API', error);
  }
});

</script>

