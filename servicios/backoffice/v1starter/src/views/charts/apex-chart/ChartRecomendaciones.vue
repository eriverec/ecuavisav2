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
        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresada"
          show-current="true" @on-change="obtenerPorFechaMeta" :config="{
            position: 'auto right',
            mode: 'range',
            altFormat: 'F j, Y',
            dateFormat: 'm-d-Y',
            maxDate: new Date(),
            reactive: true
          }" />
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
            <VueApexCharts id="crejemplo" type="bar" height="500" :options="chartOptions" :series="chartSeries" />
          </div>
        </VCardText>
      </div>
    </div>

  </div>
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
import { useTheme } from 'vuetify';
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
const fechaIngresada = ref('');
const fechaIni = ref('');
const fechaFin = ref('');

const initData = () => {
  let fechai = moment().subtract(2, 'days').format("DD-MM-YYYY").toString();
  let fechaf = moment().format("DD-MM-YYYY").toString();
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
}


const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`

  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme();
const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

// console.log(fechaIngresada.value);
const chartOptions = ref({

  chart: {
    // type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    }
  },
  dataLabels: { enabled: true },
  xaxis: {
    axisBorder: { show: false },
    axisTicks: { color: themeBorderColor },
    labels: {
      style: { colors: themeDisabledTextColor },
    },
    categories: [],
  },
  yaxis: {
    labels: {
      style: { colors: themeDisabledTextColor },
    },
  },
  grid: {
    show: true,
    borderColor: themeDisabledTextColor,
    padding: {
      top: -10,
    },
    xaxis: {
      lines: { show: true },
    },
  },
});

const chartSeries = ref([
  {
    name: 'Total',
    data: [],
  },
]);

const obtenerCategorias = (data) => {
  return data.map(item => item.name);
};


const obtenerFechaDispositivos = async () => {
  // Construir la URL de la API con las fechas seleccionadas por el usuario
  const url = `https://servicio-de-actividad.vercel.app/grafico/metadato/seccion/10?fechai=${(fechaIni.value)}&fechaf=${fechaFin.value}`;
  console.log("obtenerFechaDispositivos:", url);

  try {
    const response = await axios.get(url);

    const data = response.data.data;
    const categories = obtenerCategorias(data);
    const totals = data.map(item => item.total);

    chartOptions.value.xaxis.categories = categories;
    chartSeries.value[0].data = totals;
  } catch (error) {
    console.error('Error al obtener los datos de la API:', error);
  }
};

async function obtenerPorFechaMeta(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      // currentPage.value = 1;
      let fechaI = moment(selectedDates[0]).format('YYYY-MM-DD');
      let fechaF = moment(selectedDates[1]).format('YYYY-MM-DD');
      fechaIni.value = fechaI;
      fechaFin.value = fechaF;
      await obtenerFechaDispositivos(fechaI, fechaF);
      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

// Observar cambios en la fecha seleccionada
// watch(fechaIngresada, obtenerFechaDispositivos);

onMounted(async () => {
  initData();
  await obtenerFechaDispositivos();
});

</script>

