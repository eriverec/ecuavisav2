<template>
  <section>
    <VSnackbar 
      v-model="snackbar.show" 
      location="top end" 
      variant="flat" 
      :timeout="snackbar.timeout" 
      :color="snackbar.color">
      {{ snackbar.message }}
    </VSnackbar>

    <VRow>
      <VCol cols="12" md="12" lg="12">
        <VCard>
          <VCardItem>
            <div class="p-0 d-flex flex-column align-items-start">
              <VCardTitle>
                Suscripciones diarias por año y mes
              </VCardTitle>
              <VCardSubtitle>
                Seleccione el año y el mes para ver las suscripciones realizadas agrupadas por días
              </VCardSubtitle>
            </div>
            <template #append>
              <VBtn
                :loading="btnLoadingDescargar"
                :disabled="btnLoadingDescargar"
                color="primary"
                @click="descargarDatos"
              >
                Descargar
                <VIcon end icon="tabler-cloud-download" />
              </VBtn>
            </template>
          </VCardItem>

          <VCardText>
            <div class="p-0 mt-0 mb-3 d-flex align-items-center flex-wrap gap-3">
              <VSelect
                v-model="anioSeleccionado"
                :items="aniosDisponibles"
                label="Filtro de año"
                style="width: 150px;"
                :menu-props="{ maxHeight: '300' }"
              />
              <VSelect
                v-model="mesSeleccionado"
                :items="mesesDisponibles"
                label="Filtro de mes"
                style="width: 150px;"
                :menu-props="{ maxHeight: '300' }"
                item-title="nombre"
                item-value="valor"
              />
            </div>
            <div v-if="isLoading">Cargando datos...</div>
            <div v-else-if="chartConfig.series[0].data.length === 0">No hay datos disponibles para el período seleccionado.</div>
            <div v-else>
              <VueApexCharts
                type="line"
                height="400"
                :options="chartConfig.options"
                :series="chartConfig.series"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'SuscripcionesDiarias',
  components: {
    VueApexCharts
  },
  setup() {
    const anioSeleccionado = ref(new Date().getFullYear().toString())
    const mesSeleccionado = ref((new Date().getMonth() + 1).toString().padStart(2, '0'))
    const aniosDisponibles = ref([])
    const mesesDisponibles = ref([
      { valor: '01', nombre: 'Enero' },
      { valor: '02', nombre: 'Febrero' },
      { valor: '03', nombre: 'Marzo' },
      { valor: '04', nombre: 'Abril' },
      { valor: '05', nombre: 'Mayo' },
      { valor: '06', nombre: 'Junio' },
      { valor: '07', nombre: 'Julio' },
      { valor: '08', nombre: 'Agosto' },
      { valor: '09', nombre: 'Septiembre' },
      { valor: '10', nombre: 'Octubre' },
      { valor: '11', nombre: 'Noviembre' },
      { valor: '12', nombre: 'Diciembre' }
    ])
    const idPaquete = '651c9d012ff9fa09a75e6c16'
    const isLoading = ref(false)
    const btnLoadingDescargar = ref(false)
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success',
      timeout: 3000
    })

    const chartConfig = ref({
      series: [{
        name: 'Suscripciones',
        data: []
      }],
      options: {
        chart: {
          type: 'line',
          height: 400,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          type: 'datetime',
          categories: []
        },
        yaxis: {
          title: {
            text: 'Suscripciones'
          },
          min: 0,
          forceNiceScale: true,
          labels: {
            formatter: (value) => Math.round(value)
          }
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          },
        },
        colors: ['#7367F0'],
        markers: {
          size: 6,
          strokeWidth: 3,
          hover: { size: 8 }
        }
      }
    })

    const generarAniosDisponibles = () => {
      const anioActual = new Date().getFullYear()
      aniosDisponibles.value = [anioActual - 2, anioActual - 1, anioActual].map(String)
    }

    const obtenerDatos = async () => {
      isLoading.value = true
      try {
        const response = await axios.get(`https://servicios-ecuavisa-suscripciones.vercel.app/backoffice-grafico/suscripciones-realizados-activas-agrupados-por-dia`, {
          params: {
            anio: anioSeleccionado.value,
            mes: mesSeleccionado.value,
            idPaquete: idPaquete,
            estado: 7
          }
        })
        if (response.data.resp && Array.isArray(response.data.data)) {
          return response.data.data
        } else {
          throw new Error('Formato de respuesta inesperado')
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
        mostrarSnackbar('Error al cargar los datos', 'error')
        return []
      } finally {
        isLoading.value = false
      }
    }

    const actualizarGrafico = async () => {
      const datos = await obtenerDatos()
      chartConfig.value.series[0].data = datos.map(item => ({
        x: new Date(item.fecha).getTime(),
        y: item.suscritos
      }))
      chartConfig.value.options.xaxis.categories = datos.map(item => item.fecha)
    }

    const descargarDatos = () => {
      // Implementar lógica de descarga
      btnLoadingDescargar.value = true
      setTimeout(() => {
        btnLoadingDescargar.value = false
        mostrarSnackbar('Datos descargados exitosamente', 'success')
      }, 2000)
    }

    const mostrarSnackbar = (mensaje, color = 'success') => {
      snackbar.value = {
        show: true,
        message: mensaje,
        color: color,
        timeout: 3000
      }
    }

    onMounted(() => {
      generarAniosDisponibles()
      actualizarGrafico()
    })

    watch([anioSeleccionado, mesSeleccionado], actualizarGrafico)

    return {
      anioSeleccionado,
      mesSeleccionado,
      aniosDisponibles,
      mesesDisponibles,
      chartConfig,
      isLoading,
      btnLoadingDescargar,
      snackbar,
      descargarDatos
    }
  }
}
</script>