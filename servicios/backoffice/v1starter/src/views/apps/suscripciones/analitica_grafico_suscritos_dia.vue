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
        const response = await axios.get(`https://ecuavisa-suscripciones.vercel.app/backoffice-grafico/suscripciones-realizados-activas-agrupados-por-dia`, {
          params: {
            anio: anioSeleccionado.value,
            mes: mesSeleccionado.value,
            idPaquete: idPaquete,
            estado: 3
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

    const descargarDatos = async () => {
      btnLoadingDescargar.value = true
      try {
        const response = await axios.get(`https://ecuavisa-suscripciones.vercel.app/backoffice-grafico/descargar/suscripciones-realizados-activas-agrupados-por-dia`, {
          params: {
            anio: anioSeleccionado.value,
            mes: mesSeleccionado.value,
            idPaquete: idPaquete,
            estado: 7,
            page: 1,
            limit: 100
          },
          responseType: 'json'
        })

        if (response.data && response.data.resp && Array.isArray(response.data.data)) {
          const csvData = generarCSV(response.data.data)
          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `suscripciones_diarias_${anioSeleccionado.value}_${mesSeleccionado.value}.csv`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          mostrarSnackbar('Datos descargados exitosamente', 'success')
        } else {
          throw new Error('Formato de respuesta inválido')
        }
      } catch (error) {
        console.error('Error al descargar los datos:', error)
        mostrarSnackbar('Error al descargar los datos', 'error')
      } finally {
        btnLoadingDescargar.value = false
      }
    }

    const generarCSV = (data) => {
      const headers = [
        'periodicidad', 'estado', 'tipo_frecuencia_usuario', 'created_at',
        'wylexId', 'email', 'first_name', 'last_name', 'country', 'phone_number',
        'birth_date', 'provider', 'ciudad', 'telefono',
        'package_details_fechaInicio', 'package_details_fechaBaja', 'package_details_prox_pago',
        'package_details_valorPagar', 'package_details_precio_promocion',
        'billing_details_nombres', 'billing_details_email', 'billing_details_apellidos',
        'billing_details_cedula', 'billing_details_telefono', 'billing_details_pais',
        'billing_details_ciudad', 'billing_details_direccion',
        'fecha', 'estado_text'
      ]

      let csvContent = headers.join(',') + '\n'

      data.forEach(item => {
        const row = [
          item.periodicidad,
          item.estado,
          item.tipo_frecuencia_usuario,
          item.created_at,
          item.user.wylexId,
          item.user.email,
          item.user.first_name,
          item.user.last_name,
          item.user.country,
          item.user.phone_number,
          item.user.birth_date,
          item.user.provider,
          item.user.ciudad,
          item.user.telefono,
          item.package_details_fechaInicio,
          item.package_details_fechaBaja,
          item.package_details_prox_pago,
          item.package_details_valorPagar,
          item.package_details_precio_promocion,
          item.billing_details_nombres,
          item.billing_details_email,
          item.billing_details_apellidos,
          item.billing_details_cedula,
          item.billing_details_telefono,
          item.billing_details_pais,
          item.billing_details_ciudad,
          item.billing_details_direccion,
          item.fecha,
          item.estado_text
        ].map(field => `"${field}"`).join(',')

        csvContent += row + '\n'
      })

      return csvContent
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