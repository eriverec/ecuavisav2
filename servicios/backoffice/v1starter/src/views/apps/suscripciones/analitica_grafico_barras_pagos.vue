// AnaliticaGraficoBarras.vue


<template>
  <section>


    <VRow>
      <VCol class="mt-0" cols="12" md="12" lg="12">

        <VCard>
          <VCardItem>
            <div class="p-0 d-flex flex-column align-items-start">
              <VCardTitle>
                <!-- Por año y mes. -->
                Ventas de paquetes agrupadas<br> por mes el {{ modelAnio }}.
              </VCardTitle>
              <VCardSubtitle>
                Se muestran el total de de paquetes contratados <br> y el total de ingresos de cada mes.
              </VCardSubtitle>
            </div>
            <template #append>
              <!-- <VBtn :loading="btnLoadingDescargar" :disabled="btnLoadingDescargar" color="primary" @click="">
                Descargar
                <VIcon end icon="tabler-cloud-download" />
              </VBtn> -->
            </template>
          </VCardItem>

          <VCardText>
            <div class="p-0 mt-0 mb-3 d-flex align-items-center flex-wrap gap-3">
              <VCombobox v-model="modelAnio" :items="selectAnio" label="Filtro de año"
                :menu-props="{ maxHeight: '300' }" />

            </div>
            <div v-if="isLoading">Cargando datos...</div>
            <div v-else-if="datosVacios" class="text-center mt-5">
              {{ mensajeError }}
            </div>
            <div v-else>
              <canvas ref="chart"></canvas>
            </div>


          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<script setup>
import { usePaqueteStore } from '@/views/apps/suscripciones/paqueteStore';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { default as moment } from 'moment';
import 'moment/locale/es';
import { onMounted, ref, watch } from 'vue';
moment.locale('es')

const chart = ref(null)
const chartInstance = ref(null)
const dominio = ref('https://ecuavisa-suscripciones.vercel.app/')
const anioSeleccionado = ref(new Date().getFullYear().toString())
const aniosDisponibles = ref([])
const { idPaquete } = usePaqueteStore()
const datosVacios = ref(false)
const mensajeError = ref('')
const modelAnio = ref(2024);
const selectAnio = ref([2025, 2024, 2023, 2022]);

// Generar años disponibles (año actual y los 2 años anteriores)
const generarAniosDisponibles = () => {
  const anioActual = new Date().getFullYear()
  aniosDisponibles.value = [anioActual - 2, anioActual - 1, anioActual].map(String)
}

const obtenerDatos = async () => {
  datosVacios.value = false
  mensajeError.value = ''

  try {
    const response = await axios.get(`${dominio.value}backoffice-grafico/pagos-realizados-agrupados-por-mes`, {
      params: {
        idPaquete: idPaquete.value,
        anio: modelAnio.value
      }
    })
    if (response.data.resp && Array.isArray(response.data.data)) {
      if (response.data.data.length === 0) {
        datosVacios.value = true
        mensajeError.value = 'No se encontraron datos para el paquete seleccionado.'
        return []
      }
      return response.data.data
    } else {
      console.error('Formato de respuesta inesperado:', response.data)
      datosVacios.value = true
      mensajeError.value = 'Error en el formato de respuesta del servidor.'

      return []
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error)
    return []
  }
}

const crearGrafico = (datos) => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  const ctx = chart.value.getContext('2d')
  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.map(item => item.mes_text),
      datasets: [
        {
          label: 'Total ingresos',
          data: datos.map(item => item.sumPago),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Paquetes contratados',
          data: datos.map(item => item.numPago),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

const actualizarGrafico = async () => {
  const datos = await obtenerDatos()
  if (!datosVacios.value) {
    crearGrafico(datos)
  }
}

onMounted(() => {
  actualizarGrafico()
})

watch(idPaquete, actualizarGrafico)
watch(modelAnio, actualizarGrafico)



</script>

<style scoped>
.analitica-grafico-barras {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

select {
  padding: 5px;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>