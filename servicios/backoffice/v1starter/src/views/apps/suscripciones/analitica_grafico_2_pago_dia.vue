<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { ref } from 'vue';
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);

  const dominio = "https://servicios-ecuavisa-suscripciones.vercel.app";

  const configSnackbar = ref({
      message: "Datos guardados",
      type: "success",
      model: false
  });

  const mesesDelAnio = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  const isLoading = ref(false);

  const selectModelAnio = ref(2024);
  const selectAnio = [2025, 2024, 2023, 2022];

  const selectModelPaquete = ref(null);
  const selectItemsPaquete = ref([]);
  const selectItemsPaqueteCopy = ref([]);
  const selectRefPaquete = ref(null);
  const paqueteModelLoading = ref(false);
  const searchPaqueteModel = ref(null);

  // btn descargar
  const btnLoadingDescargar = ref(false);

// async function descargarReporte() {
//   try {
//     btnLoadingDescargar.value = true;

//     const endpoint = 'https://servicios-ecuavisa-suscripciones.vercel.app/backoffice-grafico/descargar/pagos-realizados-agrupados-por-mes-anio';
//     const params = {
//       anio: '2024',
//       mes: '08',
//       idPaquete: '651c9d012ff9fa09a75e6c16',
//       page: 1,
//       limit: 100,
//     };

//     const response = await axios.get(endpoint, { params });

//     if (response.data.resp) {
//       const data = response.data.data;
//       const csvContent = generarCSV(data);
//       descargarArchivo(csvContent, 'pagos-realizados.csv');
//     } else {
//       console.error('Error al obtener los datos del endpoint.');
//     }
//   } catch (error) {
//     console.error('Error al descargar el reporte:', error);
//   } finally {
//     btnLoadingDescargar.value = false;
//   }
// }

// function generarCSV(data) {
//   const headers = ['idSuscripciones', 'created_at', 'pago', 'transaction_id', 'dev_reference', 'product_description', 'trace_number', 'lot_number', 'wylexId', 'email', 'first_name', 'last_name', 'fecha'];
//   let csvContent = `${headers.join(',')}\n`;

//   for (const item of data) {
//     const { idSuscripciones, created_at, pago, transaction_id, dev_reference, product_description, trace_number, lot_number, user, fecha } = item;
//     const { wylexId, email, first_name, last_name } = user;
//     const row = [idSuscripciones, created_at, pago, transaction_id, dev_reference, product_description, trace_number, lot_number, wylexId, email, first_name, last_name, fecha];
//     csvContent += `${row.join(',')}\n`;
//   }

//   return csvContent;
// }

// function descargarArchivo(content, filename) {
//   const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.setAttribute('href', url);
//   link.setAttribute('download', filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
//fin btn descargar

  const graficoDisabled = ref(false);
  const dataGrafico = ref([]);

  watch(async () => searchPaqueteModel.value, async () => {
    if (!searchPaqueteModel.value) {
      selectItemsPaquete.value = selectItemsPaqueteCopy.value;
    }else{
      selectItemsPaquete.value = selectItemsPaqueteCopy.value.filter((video) => {
        return video.title.toLowerCase().indexOf(searchPaqueteModel.value.toLowerCase()) > -1;
      });
    }
  });

  watch(selectRefPaquete, (active) => {
    if(!active){
      setTimeout(()=>{
        searchPaqueteModel.value = "";
      }, 1000)
    }
  });

  async function getPaquetes(page = 1, limit= 10){
    try {
        paqueteModelLoading.value = true;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        var response = await fetch(`${dominio}/paquete/backoffice/display-all`, requestOptions);
        const data = await response.json();

        selectItemsPaquete.value = data.data.reduce((acumulador, actual) => {
          acumulador.push({
            title: `${actual.nombre}`,
            value: actual._id,
          });
          return acumulador;
        }, []);
        selectItemsPaqueteCopy.value = selectItemsPaquete.value;
        selectModelPaquete.value = "651c9d012ff9fa09a75e6c16";
        paqueteModelLoading.value = false;
        
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo recuperar los paquetes, recargue de nuevo.",
            type: "error",
            model: true
        };
        return console.error(error.message);    
    }
  }

  async function getDataGrafico(json = {}){
    try {
      const { anio = null, idPaquete = null } = json;

      graficoDisabled.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`${dominio}/backoffice-grafico/pagos-realizados-agrupados-por-mes?anio=${anio}&idPaquete=${idPaquete}`, requestOptions);
      const data = await response.json();

      dataGrafico.value = data.data;
      graficoDisabled.value = false;
        
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo recuperar los datos, recargue de nuevo.",
            type: "error",
            model: true
        };
        return console.error(error.message);    
    }
  }

  // GRAFICO
  import { hexToRgb } from '@layouts/utils';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

  // 👉 Colors variables
  const colorVariables = themeColors => {
    const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
    const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
    const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
    const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
    
    return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
  }

  const vuetifyTheme = useTheme();

  const getAreaChartSplineConfig = themeColors => {
    const areaColors = {
      series3: '#b992fe',
      series2: '#e0cffe',
      series1: '#ab7efd',
    }

    const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)
    
    const seriesTemp = [];
    for(var i in mesesDelAnio){
      const mes = mesesDelAnio[i];
      const data_temp = dataGrafico.value.find(e => e.mes_text.toLowerCase() == mes.toLowerCase());
      if(data_temp){
        seriesTemp.push(data_temp.sumPago);
      }else{
        seriesTemp.push(0);
      }
    }

    return {
      config: {
        chart: {
          parentHeightOffset: 0,
          zoom: { enabled: false },
          toolbar: { show: false },
        },
        colors: ['#ff9f43'],
        stroke: { curve: 'straight' },
        dataLabels: { enabled: false },
        markers: {
          strokeWidth: 7,
          strokeOpacity: 1,
          colors: ['#ff9f43'],
          strokeColors: ['#fff'],
        },
        grid: {
          padding: { top: -10 },
          borderColor: themeBorderColor,
          xaxis: {
            lines: { show: true },
          },
        },
        tooltip: {
          custom(data) {
            return `<div class='bar-chart pa-2'>
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
            </div>`
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
            '7/12',
            '8/12',
            '9/12',
            '10/12',
            '11/12',
            '12/12',
            '13/12',
            '14/12',
            '15/12',
            '16/12',
            '17/12',
            '18/12',
            '19/12',
            '20/12',
            '21/12',
          ],
        },
      },
      series: [{
        data: [
          280,
          200,
          220,
          180,
          270,
          250,
          70,
          90,
          200,
          150,
          160,
          100,
          150,
          100,
          50,
        ],
      }]
    }
  }

  const chartConfig = computed(() => getAreaChartSplineConfig(vuetifyTheme.current.value))
  // FIN GRAFICO

  // EVENTOS SELECT
  // FIN EVENTOS SELECT

  onMounted(async ()=>{
    isLoading.value = true;
    await getPaquetes();
    isLoading.value = false;
  })

  watch(async () => selectModelAnio.value, async () => {
    if (selectModelAnio.value && selectModelPaquete.value) {
      await getDataGrafico({
        anio: selectModelAnio.value,
        idPaquete:selectModelPaquete.value
      });
    }
  });

  watch(async () => selectModelPaquete.value, async () => {
    if (selectModelPaquete.value && selectModelAnio.value) {
      await getDataGrafico({
        anio: selectModelAnio.value,
        idPaquete:selectModelPaquete.value
      });
    }
  });

</script>


<template>
  <section>
    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type">
        {{ configSnackbar.message }}
    </VSnackbar>

    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
        
        <VCard>
          <VCardItem>
            <div class="p-0 d-flex flex-column align-items-start">
              <VCardTitle>
                Por año y mes.<br>Ventas realizadas agrupadas por días.
              </VCardTitle>
              <VCardSubtitle>
                Debes seleccionar el año y el paquete para ver los resultados<br> de ventas en suscripciones.
              </VCardSubtitle>
            </div>
            <template #append>
              <VBtn
                :loading="btnLoadingDescargar"
                :disabled="btnLoadingDescargar"
                color="primary"
                @click="descargarReporte"
              >
                Descargar
                <VIcon end icon="tabler-cloud-download" />
              </VBtn>
            </template>
          </VCardItem>

          <VCardText>
            <div class="p-0 mt-0 mb-3 d-flex align-items-center flex-wrap gap-3">
              <VCombobox
                v-model="selectModelAnio" 
                :items="selectAnio"
                label="Filtro de año" 
                :menu-props="{ maxHeight: '300' }"
                class="d-none"
              />
              <VSelect
                  style="width: 275px;"
                  v-model:menu="selectRefPaquete"
                  no-data-text="No existen paquetes que mostrar"
                  append-icon="mdi-refresh"
                  @click:append="getPaquetes"
                  :disabled="paqueteModelLoading"
                  item-text="title"
                  item-value="value"
                  v-model="selectModelPaquete" 
                  :items="selectItemsPaquete"
                  label="Filtro paquetes"
                  :menu-props="{ maxHeight: '400' }">
                  <template v-slot:prepend-item>
                    <v-list-item>
                      <v-list-item-content>
                        <VTextField v-model="searchPaqueteModel" clearable placeholder="Buscar paquetes"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template #selection="{ item }">
                        <div>
                            {{ item.title }}
                        </div>
                    </template>
                    <template #item="{ item, props }">
                        <v-list-item v-bind="props">
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    <p>_id: {{ item.value }}</p>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </VSelect>
            </div>
            <div v-if="isLoading">Cargando datos...</div>
            <div v-else>
              <VueApexCharts
                type="area"
                height="300"
                :options="chartConfig.config"
                :series="chartConfig.series"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style scoped>

</style>

