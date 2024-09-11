<template>
  <section>
    <VCard>
      <VCardItem>
        <VCardTitle>
          Por mes.
          Suscritos en 2024.
        </VCardTitle>
        <VCardSubtitle>
          Se muestran los suscritos por mes
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
    
        <VSlideGroup
        v-model="currentTab"
        show-arrows
        mandatory
      >
        <VSlideGroupItem
          v-for="(report, index) in chartConfigs"
          :key="report.title"
          v-slot="{ isSelected, toggle }"
          :value="index"
        >
          <div
            style=" width: 110px;height: 94px;"
            :style="isSelected ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
            :class="isSelected ? 'border' : 'border border-dashed'"
            class="d-flex flex-column justify-center align-center cursor-pointer rounded px-5 py-2 me-6"
            @click="toggle"
          >
            <VAvatar
              rounded
              size="38"
              :color="isSelected ? 'primary' : 'secondary'"
              variant="tonal"
              class="mb-2"
            >
              <VIcon :icon="report.icon" />
            </VAvatar>
            <p class="mb-0">
              {{ report.title }}
            </p>
          </div>
        </VSlideGroupItem>
      </VSlideGroup>
      
      <div v-if="loadingGrafico" class="py-4">
        Cargando datos...
      </div>
    
      <VueApexCharts
      v-else
        ref="refVueApexChart"
        :key="currentTab"
        :options="chartConfigs[Number(currentTab)].chartOptions"
        :series="chartConfigs[Number(currentTab)].series"
        :height="chartConfigs[Number(currentTab)].height"
        class="mt-3"
      />
        
      </VCardText>
    </VCard>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from 'vuetify';
import axios from 'axios';

const vuetifyTheme = useTheme();
const activeTab = ref('0');
const isLoading = ref(false);
const anioSeleccionado = ref(new Date().getFullYear().toString());
const aniosDisponibles = ref([]);
const dominio = ref('https://ecuavisa-suscripciones.vercel.app/');
const idPaquete = '651c9d012ff9fa09a75e6c16';
const refVueApexChart = ref()
const loadingGrafico = ref(false)
const currentTab = ref(0)

const mesesMin = {
  "enero": "Ene", "febrero": "Feb", "marzo": "Mar", "abril": "Abr",
  "mayo": "May", "junio": "Jun", "julio": "Jul", "agosto": "Ago",
  "septiembre": "Sep", "octubre": "Oct", "noviembre": "Nov", "diciembre": "Dic"
};

const datosPorMes = ref([]);

const cursoRegistrados = ref({
  categories: ['Curso A', 'Curso B', 'Curso C', 'Curso D', 'Curso E'],
  registrados: [44, 55, 41, 67, 22],
  completados: [13, 23, 20, 8, 13]
});

const generarAniosDisponibles = () => {
  const anioActual = new Date().getFullYear();
  aniosDisponibles.value = [anioActual - 2, anioActual - 1, anioActual].map(String);
};

const obtenerDatos = async () => {
  isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
};

const actualizarGrafico = async () => {
  loadingGrafico.value = true;
  try {
    const datos = await obtenerDatos();
    const mesesCompletos = Object.keys(mesesMin);
    datosPorMes.value = mesesCompletos.map((mes) => {
      const datoMes = datos.find(d => d.mes_text === mes);
      return datoMes ? datoMes.suscritos : 0;
    });
    
  } finally {
    loadingGrafico.value = false;
  }
};

onMounted(() => {
  generarAniosDisponibles();
  actualizarGrafico();
});

watch(actualizarGrafico);

const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
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
      title: 'Usuarios',
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
            return `${ val }`
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
              return `${ parseInt(val / 1) }`
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
        colors: ['#7367F0'],
      },
      series: [{
        name: 'Usuarios Suscritos',
        data: datosPorMes.value,
      }],
      height:270
    },
    {
      title: 'Curso',
      icon: 'tabler-forms',
      chartOptions: {
        chart: {
          type: 'bar',
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4,
          },
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: cursoRegistrados.value.categories,
          axisBorder: { show: true, color: borderColor },
          axisTicks: { show: false },
          labels: { style: { colors: labelColor, fontSize: '11px' } },
        },
        yaxis: {
          title: {
            text: 'Mejores 5 cursos',
            style: { fontSize: '11px', color: labelColor }
          },
          labels: {
            formatter: (val) => `${parseInt(val)}`,
            style: { fontSize: '14px', colors: labelColor },
          },
        },
        colors: colores,
        legend: {
          labels: { colors: headingColor },
        },
      },
      series: [
        {
          name: 'Usuarios Registrados',
          data: cursoRegistrados.value.registrados
        },
        {
          name: 'Usuarios que completaron el curso',
          data: cursoRegistrados.value.completados
        }
      ],
      height:270
    },
  ];
});
</script>