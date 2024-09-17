<template>
  <VCard>
    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat"
      :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>
    <VCardItem>
      <div class="p-0 d-flex flex-column align-items-start">
        <VCardTitle>
          Usuarios registrados
        </VCardTitle>
        <VCardSubtitle>
          Estadística de suscriptores nuevos de la semana seleccionada
        </VCardSubtitle>
      </div>
      <template #append>
        <VBtn :loading="btnLoadingDescargar" :disabled="btnLoadingDescargar" color="primary" @click="descargarReporte">
          Descargar
          <VIcon end icon="tabler-cloud-download" />
        </VBtn>
      </template>
    </VCardItem>
    <VCardText>
      <div class="d-flex align-center mb-4">
        <VSelect v-model="selectedWeek" :items="weekOptions" label="Seleccionar semana" style="width: 100%;" />
      </div>
      <div v-if="datosVacios" class="text-start mt-5 mb-5">
      No hay datos disponibles para la semana o el paquete seleccionado.
      </div>
      <VueApexCharts v-else type="bar" height="400" :options="chartConfigs[0].chartOptions" :series="chartSeries" />
    </VCardText>
  </VCard>
</template>


<script setup>
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/es'
import { computed, onMounted, ref, watch } from 'vue'
import { useTheme } from 'vuetify';
import VueApexCharts from 'vue3-apexcharts'
import { usePaqueteStore } from '@/views/apps/suscripciones/paqueteStore';

moment.locale('es')

const DOMAIN = 'https://ecuavisa-suscripciones.vercel.app'
const { idPaquete } = usePaqueteStore();
const vuetifyTheme = useTheme();
const datosVacios = ref(false);

const selectedWeek = ref('current')
const weekOptions = [
  { value: 'current', title: 'Semana actual' },
  { value: 'previous', title: 'Semana anterior' },
]
const subscriptionData = ref([])
const btnLoadingDescargar = ref(false)

const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false
})

const fetchData = async () => {
  const { startOfWeek, endOfWeek } = getWeekDates()

  try {
    const response = await axios.get(`${DOMAIN}/backoffice-grafico/suscripciones-activas-por-dia-filtro-fechas`, {
      params: {
        idPaquete: idPaquete.value,
        fechai: startOfWeek.format('YYYY-MM-DD'),
        fechaf: endOfWeek.format('YYYY-MM-DD')
      }
    })
    subscriptionData.value = response.data.data;
    datosVacios.value = subscriptionData.value.every(d => d === 0);
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const getWeekDates = () => {
  const startOfWeek = moment().startOf('isoWeek').subtract(selectedWeek.value === 'previous' ? 1 : 0, 'weeks')
  const endOfWeek = moment(startOfWeek).endOf('isoWeek')
  return { startOfWeek, endOfWeek }
}


const weekDays = computed(() => {
  const { startOfWeek } = getWeekDates()
  return Array.from({ length: 7 }, (_, i) => moment(startOfWeek).add(i, 'days'))
})

const chartSeries = computed(() => [{
  name: 'Usuarios registrados',
  data: weekDays.value.map(day => {
    const found = subscriptionData.value.find(item => item.fecha === day.format('YYYY-MM-DD'))
    return found ? found.suscritos : 0
  })
}])

const diasSemana = {
  0: 'Dom',
  1: 'Lun',
  2: 'Mar',
  3: 'Mié',
  4: 'Jue',
  5: 'Vie',
  6: 'Sáb'
}

const chartConfigs = computed(() => {

  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
  };

  const currentTheme = vuetifyTheme.current.value.colors;
  const variableTheme = vuetifyTheme.current.value.variables;
  const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`;
  const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`;
  const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`;
  const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`;

  return [
    {
      chartOptions: {
        chart: {
          type: 'bar',
          parentHeightOffset: 0,
          toolbar: {
            show: false
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%',
            startingShape: 'rounded',
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val || '0'
          },
          style: {
            fontSize: '15px',
            colors: [legendColor],
            fontWeight: '600',
            fontFamily: 'Public Sans',
          },
        },
        legend: { show: false },
        colors: weekDays.value.map(day =>
          day.isSame(moment(), 'day') ? '#7367F0' : '#7367F0'
        ),
        xaxis: {
          categories: weekDays.value.map(day => {
            const diaSemana = diasSemana[day.format('d')]
            const fecha = day.format('DD/MM')
            return `${diaSemana} ${fecha}`
          }),
          axisBorder: {
            show: true,
            color: borderColor,
          },
          axisTicks: { show: true },
          labels: {
            style: {
              colors: labelColor,
              fontSize: '11px',
              fontFamily: 'Public Sans',
            },
          },
        },
        grid: {
          show: true,
          borderColor: borderColor,
          xaxis: {
            lines: { show: true },
          },
        },
        yaxis: {
          title: {
            text: 'Usuarios registrados',
            style: {
              fontSize: '14px',
              fontFamily: 'Public Sans',
              color: labelColor
            }
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(0)
            },
            style: {
              fontSize: '14px',
              colors: labelColor,
              fontFamily: 'Public Sans',
            },
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        }
      }
    }
  ];

})

const descargarReporte = async () => {
  btnLoadingDescargar.value = true
  try {
    const { startOfWeek, endOfWeek } = getWeekDates()
    const response = await axios.get(`${DOMAIN}/backoffice-grafico/suscripciones-activas-por-dia-filtro-fechas-descargar`, {
      params: {
        idPaquete: idPaquete.value,
        fechai: startOfWeek.format('YYYY-MM-DD'),
        fechaf: endOfWeek.format('YYYY-MM-DD'),
        page: 1,
        limit: 10000
      }
    })

    if (response.data.resp && Array.isArray(response.data.data)) {
      const rawData = response.data.data
      const filteredData = rawData.filter(item => {
        const itemDate = moment(item.fecha)
        return itemDate.isBetween(startOfWeek, endOfWeek, null, '[]')
      })
      console.log(filteredData);

      if (filteredData.length === 0) {
        configSnackbar.value = {
          message: "No se encontraron registros para la semana seleccionada",
          type: "error",
          model: true
        };
        return
      }

      const flattenObject = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, k) => {
          const pre = prefix.length ? prefix + '_' : ''
          if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k))
          } else {
            acc[pre + k] = obj[k]
          }
          return acc
        }, {})
      }

      const flattenedData = filteredData.map(item => flattenObject(item))
      const headers = Object.keys(flattenedData[0]).join(',')
      const csvContent = [
        headers,
        ...flattenedData.map(item => Object.values(item).map(value => {
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value).replace(/"/g, '""')
          }
          return value
        }).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `suscripciones_${selectedWeek.value === 'current' ? 'semana_actual' : 'semana_anterior'}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } else {
      console.error('La respuesta no tiene el formato esperado:', response.data)
    }
  } catch (error) {
    console.error('Error al descargar el reporte:', error)
  } finally {
    btnLoadingDescargar.value = false
  }
}

watch([selectedWeek, idPaquete], () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>
