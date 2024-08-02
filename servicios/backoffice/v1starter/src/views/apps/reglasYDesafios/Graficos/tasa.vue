<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
import { hexToRgb } from '@layouts/utils'

const semanas = ref([]);
const semanaSeleccionada = ref('');
const labels = ref([]);
const items = ref([]);
const totalUsuarios = ref([]);
const series = ref([]);
const desafios = ref([]);
const cargando = ref(true);
const registrosExportados = ref({});
const totalRegistros = ref({});
const cargandoDescarga = ref({});

const obtenerTotalUsuarios = async () => {
  cargando.value = true; // Iniciar carga
  // if (!semanaSeleccionada.value) return;

  try {
    const response = await axios.get(`https://servicios-ecuavisa.vercel.app/grafico-backoffice/usuarios-agrupado-x-semana`);

    desafios.value = response.data.data.map(item => ({
      ...item.semana[0],
      idSemanaDesafio: item.idSemanaDesafio,
      total: item.total,
      titulo: (item.semana[0].titulo),
      descripcion: (item.semana[0].descripcion)

    }));


    // Ordenar desafios por descripción de menor a mayor
    desafios.value.sort((a, b) => a.descripcion.localeCompare(b.descripcion));

    // console.log(desafios.value);

    // series.value = [{
    //   name: 'Total Usuarios',
    //   data: desafios.value.map(ev => ev.total)
    // }];

    labels.value = desafios.value.map(ev => ev.descripcion);

    // Inicializar cargandoDescarga para cada desafío
    desafios.value.forEach(desafio => {
      cargandoDescarga.value[desafio.idSemanaDesafio] = false;
    });


    // Modificar la estructura de series para tener cada barra como una serie separada
    series.value = desafios.value.map(ev => ({
      name: ev.titulo,
      data: [ev.total]
    }));
    // labels.value = desafios.value.map(ev => ev.titulo);


  } catch (error) {
    console.error('Error al obtener el total de usuarios:', error);
  } finally {
    cargando.value = false; // Finalizar carga
  }
};


onMounted(obtenerTotalUsuarios);

const descargarCSV = async (idSemanaDesafio) => {
  cargandoDescarga.value[idSemanaDesafio] = true;
  try {
    const response = await axios.get(`https://servicios-ecuavisa.vercel.app/grafico-backoffice/usuarios-x-semana-listado/${idSemanaDesafio}?page=1&limit=20`);
    const data = response.data.data;

    // Convertir los datos a CSV
    const csvContent = [
      "Email,Nombre,Apellido,Teléfono,Fecha de Nacimiento,Fecha de Suscripción",
      ...data.map(item =>
        `${item.userId.email},${item.userId.first_name},${item.userId.last_name},${item.userId.phone_number},${item.userId.birth_date},${item.subscriber}`
      )
    ].join("\n");

    // Crear un Blob con el contenido CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Crear un enlace temporal y hacer clic en él para descargar
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `usuarios_semana_${idSemanaDesafio}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error('Error al descargar CSV:', error);
  } finally {
    cargandoDescarga.value[idSemanaDesafio] = false;
  }
};

// Array de colores para las barras
const colores = [
  "#00CED1", "#00fa9a", "#7365ed", "#ff69b4", "#000f08",
  "#FFA500", "#800080", "#008080", "#FF4500", "#4682B4",
  "#FF1493", "#32CD32", "#FF6347", "#00CED1", "#8B4513"
];

const vuetifyTheme = useTheme();

const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const currentTheme = vuetifyTheme.current.value.colors
const variableTheme = vuetifyTheme.current.value.variables
const labelSuccessColor = `rgba(${hexToRgb(currentTheme.success)},0.2)`
const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`

const labelPrimaryColor = `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`
const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`
const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`
const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`

// Función para configurar el gráfico de barras horizontales
const getBarChartConfig = theme => {
  return {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      },
    },
    colors: colores,
    fill: {
      opacity: .9
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return val + " Visitas"
        }
      },
      theme: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return `<div class="tooltip-content">
            <div class="tooltip-body">
              <div class="tooltip-title">
                <span class="tooltip-data-value">${w.config.series[seriesIndex].name} </span>
                   <br/>
                ${w.config.xaxis.categories[seriesIndex]}
              </div>
              <div class="tooltip-data-flex">
                <div class="tooltip-data-title">
                 <!-- ${w.config.series[seriesIndex].name}-->
                 Total de usuarios
                </div>
                <div class="tooltip-data-value">
                 ${series[seriesIndex][dataPointIndex]}
                </div>
              </div>
            </div>
          </div>`
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        horizontal: true,
        // distributed: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      }
    },
    grid: {
          show: true,
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter(val,opts, w,seriesIndex) {
        const index =  opts.val;
        const un = `${val}`
        return  un;
      },
      dropShadow: { enabled: true },
      style: {
        fontSize: '15px',
        colors: [legendColor],
        fontWeight: '600',
        fontFamily: 'Public Sans',
      },
    },
    xaxis: {
      categories: labels.value,
    },

    legend: {
      show: true,
      position: 'bottom',
      labels: { colors: theme.colors['text-secondary'] },
    },
    yaxis: {
      title: {
        text: 'Semanas de desafíos',
        style: {
          fontSize: '16px',
          fontFamily: 'Public Sans',
          color: labelColor
        }
      },
      labels: {
        show: false,
        // offsetX: -15,
        style: {
          fontSize: '14px',
          colors: labelColor,
          fontFamily: 'Public Sans',
        },
        min: 0,
        max: 60000,
        tickAmount: 6,
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
  }
}




const barChartConfig = computed(() => getBarChartConfig(vuetifyTheme.current.value))

</script>



<template>

  <VCard class="v-col-12 pb-5 pt-5 mb-5">
    <VCardItem>
      <div class="py-9 d-flex align-center" v-if="cargando">
        <VProgressCircular indeterminate color="primary" />
        <span class="ml-2 ">Cargando datos...</span>
      </div>
      <div class="py-9 d-block" v-else-if="desafios.length === 0">
        No hay datos para mostrar
      </div>
      <VRow v-else class="pb-5">
        <VCol cols="12" md="12">
          <VCardTitle class="ps-0 pb-0 d-flex align-center gap-2">
            <VIcon size="25" icon="tabler-database" /> Tasa de finalización semanal
          </VCardTitle>
          <div class="py-9">
            <VueApexCharts type="bar" height="410" :options="barChartConfig" :series="series" />
          </div>
        </VCol>

        <VCol>

          <VCardTitle class="ps-0 pb-0 d-flex align-center gap-2">
            <VIcon size="25" icon="tabler-calendar-week" /> Semanas
          </VCardTitle>
          <div class="bloquesemanas py-9">
            <div v-for="sem in desafios" :key="sem.idSemanaDesafio"
              class="py-5 px-3 d-flex justify-center align-center flex-column text-center border border-1 rounded">

              <h3>{{ sem.titulo }}</h3>

              <span>{{ sem.descripcion }}</span>

              <img width="100" :src="`${sem.imagen_descriptiva}`" :alt="`${sem.titulo}`">

              <VBtn @click="descargarCSV(sem.idSemanaDesafio)" :loading="cargandoDescarga[sem.idSemanaDesafio]"
                :disabled="cargandoDescarga[sem.idSemanaDesafio]" size="small" color="success" variant="tonal">
                Descargar
              </VBtn>


            </div>

          </div>




        </VCol>

      </VRow>

    </VCardItem>
  </VCard>


  <div>







  </div>
</template>

<style>
.v-theme--dark .apexcharts-legend-text {
  color: #fff !important;
}

.bloquesemanas {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.v-theme--dark .apexcharts-xaxis text,
.v-theme--dark .apexcharts-yaxis text {
  fill: #fff !important;
}


@media(max-width: 991px) {
  .bloquesemanas {
    grid-template-columns: repeat(3, 1fr);

  }
}

@media(max-width: 767px) {
  .bloquesemanas {
    grid-template-columns: repeat(2, 1fr);

  }
}

@media(max-width: 500px) {
  .bloquesemanas {
    grid-template-columns: repeat(1, 1fr);

  }
}
</style>
