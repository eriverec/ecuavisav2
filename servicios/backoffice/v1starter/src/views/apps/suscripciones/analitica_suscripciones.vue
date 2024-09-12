<script setup>
import { ref, computed } from 'vue';
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from 'vuetify';
import axios from 'axios';

import { extendMoment } from 'moment-range'
import Moment from 'moment-timezone'
import esLocale from "moment/locale/es"

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])
moment.tz.setDefault('America/Guayaquil')

const vuetifyTheme = useTheme();
const activeTab = ref('0');
const anioSeleccionado = ref(new Date().getFullYear().toString());
const aniosDisponibles = ref([]);
const dominio = ref('https://ecuavisa-suscripciones.vercel.app/');
const idPaquete = '651c9d012ff9fa09a75e6c16';
const refVueApexChart = ref()
const loadingGrafico = ref(false)
const currentTab = ref(0)
const datosVacios = ref(false);

const mesSeleccionado = ref(moment().format('MM'));
const mesesOptions = [
  { value: '01', text: 'Enero' },
  { value: '02', text: 'Febrero' },
  { value: '03', text: 'Marzo' },
  { value: '04', text: 'Abril' },
  { value: '05', text: 'Mayo' },
  { value: '06', text: 'Junio' },
  { value: '07', text: 'Julio' },
  { value: '08', text: 'Agosto' },
  { value: '09', text: 'Septiembre' },
  { value: '10', text: 'Octubre' },
  { value: '11', text: 'Noviembre' },
  { value: '12', text: 'Diciembre' }
];

const mesesMin = {
  "enero": "Ene", "febrero": "Feb", "marzo": "Mar", "abril": "Abr",
  "mayo": "May", "junio": "Jun", "julio": "Jul", "agosto": "Ago",
  "septiembre": "Sep", "octubre": "Oct", "noviembre": "Nov", "diciembre": "Dic"
};

const datosPorMes = ref([]);

const bancoData = ref({
  nombresBanco: [],
  reembolsos: []
});

const tarjetaData = ref({
  nombresBanco: [],
  tipoTarjeta: [],
  total: []
});

const generarAniosDisponibles = () => {
  const anioActual = new Date().getFullYear();
  aniosDisponibles.value = [anioActual - 2, anioActual - 1, anioActual].map(String);
};

const obtenerDatos = async () => {
  try {
    const response = await axios.get(`${dominio.value}backoffice-grafico/suscripciones-realizados-activas-agrupados-por-mes`, {
      params: {
        idPaquete: idPaquete,
        anio: anioSeleccionado.value
      }
    });
    if (response.data.resp && Array.isArray(response.data.data)) {
      return response.data.data.map(item => ({
        ...item,
        mes_text: item.mes_text.toLowerCase()
      }));
    } else {
      console.error('Formato de respuesta inesperado:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    return [];
  }
};

const obtenerDatosBanco = async () => {
  try {
    const response = await axios.get('https://ecuavisa-suscripciones.vercel.app/backoffice/pagos-realizados/group-banco', {
      params: {
        anio: anioSeleccionado.value,
        mes: mesSeleccionado.value, // Esto podría ser dinámico si lo necesitas
        idPaquete: idPaquete
      }
    });
    if (response.data.resp && Array.isArray(response.data.data)) {
      const datosOrdenados = response.data.data.sort((a, b) => b.reembolsos - a.reembolsos);
      bancoData.value.nombresBanco = datosOrdenados.map(item => item.nombreBanco);
      bancoData.value.reembolsos = datosOrdenados.map(item => item.reembolsos);
    } else {
      console.error('Formato de respuesta inesperado:', response.data);
    }
  } catch (error) {
    console.error('Error al obtener los datos del banco:', error);
  }
};

const obtenerDatosTarjeta = async () => {
  try {
    const response = await axios.get(`${dominio.value}backoffice/pagos-realizados/group-tarjeta-banco`, {
      params: {
        anio: anioSeleccionado.value,
        mes: mesSeleccionado.value,
        idPaquete: idPaquete
      }
    });
    if (response.data.resp && Array.isArray(response.data.data)) {
      const datosOrdenados = response.data.data.sort((a, b) => b.total - a.total);

      tarjetaData.value.nombresBanco = datosOrdenados.map(item => item.nombreBanco);
      tarjetaData.value.tipoTarjeta = datosOrdenados.map(item => item.tipoTarjeta.toUpperCase());
      tarjetaData.value.total = datosOrdenados.map(item => item.total);
    } else {
      console.error('Formato de respuesta inesperado:', response.data);
    }
  } catch (error) {
    console.error('Error al obtener los datos de tarjetas:', error);
  }
};

const descargarDatos = async () => {
  loadingGrafico.value = true;
  try {
    let allData = [];
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const response = await axios.get(`${dominio.value}backoffice/pagos-realizados/group-tarjeta-banco-descargar`, {
        params: {
          anio: anioSeleccionado.value,
          mes: mesSeleccionado.value,
          idPaquete: idPaquete,
          page: page,
          limit: 50
        }
      });

      if (response.data.resp && Array.isArray(response.data.data)) {
        allData = allData.concat(response.data.data);
        if (response.data.data.length < 50) {
          hasMoreData = false;
        } else {
          page++;
        }
      } else {
        console.error('Formato de respuesta inesperado:', response.data);
        hasMoreData = false;
      }
    }

    if (allData.length > 0) {
      const csv = convertToCSV(allData);
      downloadCSV(csv, `datos_tarjetas_bancos_${moment().format('YYYYMMDD_HHmmss')}.csv`);
    } else {
      alert('No se encontraron datos para descargar.');
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    alert('Ocurrió un error al descargar los datos.');
  } finally {
    loadingGrafico.value = false;
  }
};

const convertToCSV = (data) => {
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).map(value => `"${value}"`).join(','));
  return [header, ...rows].join('\n');
};

const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


const actualizarGrafico = async () => {
  try {
    if (currentTab.value === 0) {
      const datos = await obtenerDatos();
      const mesesCompletos = Object.keys(mesesMin);

      datosPorMes.value = mesesCompletos.map((mes) => {
        const datoMes = datos.find(d => d.mes_text === mes);
        return datoMes ? datoMes.suscritos : 0;
      });

      datosVacios.value = datosPorMes.value.every(d => d === 0);

    } else if (currentTab.value === 1) {
      await obtenerDatosBanco();
      datosVacios.value = bancoData.value.reembolsos.length === 0;

    } else if (currentTab.value === 2) {
      await obtenerDatosTarjeta();
      datosVacios.value = tarjetaData.value.total.length === 0;

    }

  } finally { }
};

onMounted(() => {
  generarAniosDisponibles();
  actualizarGrafico();
});

watch(actualizarGrafico);
watch(anioSeleccionado, actualizarGrafico);
watch(mesSeleccionado, () => {
  if (currentTab.value === 1 || currentTab.value === 2) {
    actualizarGrafico();
  }
});

const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
};

const cardTypes = {
  ex: 'Exito',
  ak: 'Alkosto',
  cd: 'Codensa',
  sx: 'Sodexo',
  ol: 'Olimpica',
  ep: 'EPM',
  csd: 'Colsubsidio',
  bbva: 'BBVA',
  cmr: 'Falabella',
  cn: 'Carnet',
  cs: 'Credisensa',
  so: 'Solidario',
  up: 'Union Pay',
  el: 'Elo',
  jc: 'JCB',
  au: 'Aura',
  hpc: 'Hipercard',
  vi: 'Visa',
  mc: 'Mastercard',
  ax: 'American Express',
  di: 'Diners',
  dc: 'Discover',
  ms: 'Maestro'
};

const chartConfigs = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`;
  const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`;
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`;
  const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`;

  const colores = [
    currentTheme["grey-300"],
    currentTheme.primary
  ];

  return [
    {
      title: 'Suscriptores',
      icon: 'tabler-users',
      chartOptions: {
        chart: {
          type: 'bar',
          parentHeightOffset: 0,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            columnWidth: '32%',
            startingShape: 'rounded',
            borderRadius: 4,
            distributed: true,
            dataLabels: { position: 'top' },
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
        dataLabels: {
          enabled: true,
          formatter(val) {
            return `${val}`
          },
          offsetY: -25,
          style: {
            fontSize: '15px',
            colors: [legendColor],
            fontWeight: '600',
            fontFamily: 'Public Sans',
          },
        },
        legend: { show: false },
        tooltip: { enabled: false },
        xaxis: {
          categories: Object.values(mesesMin),
          axisBorder: {
            show: true,
            color: borderColor,
          },
          axisTicks: { show: true },
          labels: {
            style: {
              colors: labelColor,
              fontSize: '14px',
              fontFamily: 'Public Sans',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Usuarios suscritos',
            style: {
              fontSize: '11px',
              fontFamily: 'Public Sans',
              color: labelColor
            }
          },
          labels: {
            // offsetX: -15,
            formatter(val) {
              return `${parseInt(val / 1)}`
            },
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
        grid: {
          show: true,
          borderColor: borderColor,
          xaxis: {
            lines: { show: true },
          },
        },
        colors: ['#7367F0'],
      },
      series: [{
        name: 'Usuarios Suscritos',
        data: datosPorMes.value,
      }],
      height: 400
    },
    {
      title: 'Bancos',
      icon: 'tabler-building-bank',
      chartOptions: {
        chart: {
          type: 'bar',
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '70%',
            distributed: true,
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val}`,
          style: {
            fontSize: '15px',
            colors: [legendColor],
            fontWeight: '600',
            fontFamily: 'Public Sans',
          },
        },
        xaxis: {
          categories: bancoData.value.nombresBanco,
          axisBorder: {
            show: true,
            color: borderColor,
          },
          axisTicks: { show: true },
          labels: {
            style: {
              colors: labelColor,
              fontSize: '14px',
              fontFamily: 'Public Sans',
            },
          },
        },
        yaxis: {
          labels: {
            // offsetX: -15,
            formatter(val) {
              return `${val}`
            },
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
        colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#00CFE8', '#9C27B0', '#2196F3', '#4CAF50', '#FFC107', '#795548', '#607D8B', '#E91E63'],
        legend: { show: false },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " total"
            }
          },
          theme: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const tipoTarjeta = w.globals.seriesNames[seriesIndex];
            const banco = w.globals.labels[dataPointIndex];
            const valor = series[seriesIndex][dataPointIndex];

            if (valor === 0) return ''; // No mostrar tooltip para valores cero

            return `
              <div class="tooltip-content">
                <div class="tooltip-data-value">${banco}</div>
                <div class="tooltip-data">
                  <span class=" tooltip-data-title">${tipoTarjeta}:</span>
                  <span class="tooltip-data-title">${valor} total</span>
                </div>
              </div>
            `;
          },
          shared: false,
          intersect: true,
        },
        grid: {
          show: true,
          borderColor: borderColor,
          xaxis: {
            lines: { show: true },
          },
        },
      },
      series: [
        {
          name: 'Reembolsos',
          data: bancoData.value.reembolsos
        }
      ],
      height: 700
    },
    {
      title: 'Tarjetas',
      icon: 'tabler-credit-card',
      chartOptions: {
        chart: {
          type: 'bar',
          stacked: true,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '70%',
            distributed: true,
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val > 0 ? `${val}` : '',
          textAnchor: 'start',
          style: {
            fontSize: '15px',
            colors: [legendColor],
            fontWeight: '600',
            fontFamily: 'Public Sans',
          },
        },
        xaxis: {
          categories: tarjetaData.value.tipoTarjeta.map(tipo => {
            const tarjetaNombre = cardTypes[tipo.toLowerCase()] || tipo;
            return tarjetaNombre;
          }),
          axisBorder: {
            show: true,
            color: borderColor,
          },
          axisTicks: { show: true },
          labels: {
            style: {
              colors: labelColor,
              fontSize: '14px',
              fontFamily: 'Public Sans',
            },
          },
        },
        yaxis: {
          labels: {
            // offsetX: -15,
            formatter(val) {
              return `${val}`
            },
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
        colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#00CFE8'],
        legend: {
          show: false,
          position: 'top',
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " total"
            }
          },
          theme: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const banco = tarjetaData.value.nombresBanco[dataPointIndex];
            const tipoTarjeta = cardTypes[tarjetaData.value.tipoTarjeta[dataPointIndex]];
            const valor = series[seriesIndex][dataPointIndex];

            if (valor === 0) return ''; // No mostrar tooltip para valores cero

            return `
              <div class="tooltip-content">
                <div class="tooltip-data-value">${banco}</div>
                <div class="tooltip-data">
                  <span class="tooltip-data-title">Total: ${valor}</span>
                </div>
              </div>
            `;
          },
          shared: false,
          intersect: true,
        },
        grid: {
          show: true,
          borderColor: borderColor,
          xaxis: {
            lines: { show: true },
          },
        },
      },
      series: [
        {
          name: 'Visa',
          data: tarjetaData.value.total.map((total, index) =>
            tarjetaData.value.tipoTarjeta[index] === 'VI' ? total : 0
          )
        },
        {
          name: 'Mastercard',
          data: tarjetaData.value.total.map((total, index) =>
            tarjetaData.value.tipoTarjeta[index] === 'MC' ? total : 0
          )
        },
        {
          name: 'American Express',
          data: tarjetaData.value.total.map((total, index) =>
            tarjetaData.value.tipoTarjeta[index] === 'AX' ? total : 0
          )
        },
        {
          name: 'Diners',
          data: tarjetaData.value.total.map((total, index) =>
            tarjetaData.value.tipoTarjeta[index] === 'DI' ? total : 0
          )
        },
        {
          name: 'Otras',
          data: tarjetaData.value.total.map((total, index) =>
            !['VI', 'MC', 'AX', 'DI'].includes(tarjetaData.value.tipoTarjeta[index]) ? total : 0
          )
        }
      ],
      height: 700
    },
  ];
});

const isMonthSelectorVisible = computed(() => currentTab.value === 1 || currentTab.value === 2);
</script>


<template>
  <section>
    <VCard>
      <VCardItem>
        <VCardTitle>
          Usuarios registrados por mes en el 2024.
        </VCardTitle>
        <VCardSubtitle>
          Se muestran los suscritos por mes
        </VCardSubtitle>
      </VCardItem>

      <VCardText>


        <VSlideGroup v-model="currentTab" show-arrows mandatory>
          <VSlideGroupItem v-for="(report, index) in chartConfigs" :key="report.title" v-slot="{ isSelected, toggle }"
            :value="index">
            <div style=" width: 150px;height: 94px;"
              :style="isSelected ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
              :class="isSelected ? 'border' : 'border border-dashed'"
              class="d-flex flex-column justify-center align-center cursor-pointer rounded px-5 py-2 me-6"
              @click="toggle">
              <VAvatar rounded size="38" :color="isSelected ? 'primary' : 'secondary'" variant="tonal" class="mb-2">
                <VIcon :icon="report.icon" />
              </VAvatar>
              <p class="mb-0">
                {{ report.title }}
              </p>
            </div>
          </VSlideGroupItem>
        </VSlideGroup>

        <VRow :class="{ 'd-none': !isMonthSelectorVisible }" class="mt-4">
          <VCol cols="12" sm="6" md="4">
            <VSelect class="vamos" :key="currentTab" v-model="mesSeleccionado" :items="mesesOptions" item-title="text"
              item-value="value" label="Mes"></VSelect>
          </VCol>
          <VCol cols="12" sm="6" md="4">


            <VBtn @click="descargarDatos" :loading="loadingGrafico" :disabled="loadingGrafico" variant="tonal"
              color="success" prepend-icon="tabler-screen-share">
              Exportar datos
            </VBtn>
          </VCol>
        </VRow>

        <!-- Mostrar mensaje si los datos están vacíos -->
        <div v-if="datosVacios" class="text-start mt-5 mb-5">

          No hay datos disponibles para el mes seleccionado.

        </div>

        <VueApexCharts v-else ref="refVueApexChart" :key="currentTab"
          :options="chartConfigs[Number(currentTab)].chartOptions" :series="chartConfigs[Number(currentTab)].series"
          :height="chartConfigs[Number(currentTab)].height" class="mt-3" />

      </VCardText>
    </VCard>
  </section>
</template>
