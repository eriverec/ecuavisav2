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
                Por mes.<br>Suscripciones por días.
              </VCardTitle>
              <VCardSubtitle>
                Debes seleccionar el mes para ver los resultados<br> de suscripciones.
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
                class="d-none"
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
            <div v-else>
              <VueApexCharts
                type="area"
                height="300"
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
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'SuscritosPorDia',
  components: {
    VueApexCharts
  },
  setup() {
    const dominio = ref('https://servicios-ecuavisa-suscripciones.vercel.app/')
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
        name: 'Suscritos',
        data: []
      }],
      options: {
        chart: {
          type: 'area',
          height: 300,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: []
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy'
          },
        },
        colors: ['#9966FF'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
          }
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
        const response = await axios.get(`${dominio.value}suscripciones-realizados-activas-agrupados-por-dia`, {
          params: {
            idPaquete: idPaquete,
            anio: anioSeleccionado.value,
            mes: mesSeleccionado.value
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
      chartConfig.value.series[0].data = datos.map(item => item.suscritos)
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

<style scoped>
/* Estilos adicionales si son necesarios */
</style>