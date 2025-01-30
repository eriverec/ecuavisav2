<template>
  <section>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
        
        <VCard >
          <VCardItem>
            <div class="p-0 d-flex flex-column align-items-start">
              <VCardTitle>
                Ventas totales por día
              </VCardTitle>
              <VCardSubtitle class="mb-5">
                Escoja un mes para ver por día la cantidad <br> de pagos realizados y la suma de ingresos total.
              </VCardSubtitle>
            </div>
            <template #append>
              <!-- <VBtn
                  :loading="btnLoadingDescargar"
                  :disabled="btnLoadingDescargar"
                  color="primary"
                  @click="descargarReporte"
                >
                  Descargar
                  <VIcon end icon="tabler-cloud-download" />
                </VBtn> -->
            </template>
          </VCardItem>

          <VCardText>
            <div class="pb-5 mt-0 mb-3 d-flex align-items-center flex-wrap gap-3">
              <VCombobox v-model="anioModel" :items="selectAnio" label="Filtro de año"
                :menu-props="{ maxHeight: '300' }" class="" />
                      <VSelect class="mb-3"
                          v-model="selectedMonth"
                          :items="months"
                          label="Mes"
                          style="width: 150px;"
                          :menu-props="{ maxHeight: '300' }"
                          item-title="label"
                          item-value="value"
                          @change="fetchData"
                        />
              
            </div>
            <div v-if="isLoading">Cargando datos...</div>
            <div v-else-if="datosVacios" class="text-center">
              {{ mensajeError }}
            </div>
            
            <div v-else>
              <canvas ref="chartCanvas"></canvas>
            </div>

            
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<script>
import { usePaqueteStore } from '@/views/apps/suscripciones/paqueteStore';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { onMounted, ref, watch } from 'vue';

export default {
  name: 'PagosGrafico',
  setup() {
    const chartCanvas = ref(null);
    const chart = ref(null);
    const selectedMonth = ref(new Date().getMonth() + 1);
    const months = [
      { value: 1, label: 'Enero' },
      { value: 2, label: 'Febrero' },
      { value: 3, label: 'Marzo' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Mayo' },
      { value: 6, label: 'Junio' },
      { value: 7, label: 'Julio' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Septiembre' },
      { value: 10, label: 'Octubre' },
      { value: 11, label: 'Noviembre' },
      { value: 12, label: 'Diciembre' }
    ];

    const apiDomain = 'https://ecuavisa-suscripciones.vercel.app';
    const anioModel = ref(2024);
    const selectAnio = [2025, 2024, 2023, 2022];
    const { idPaquete } = usePaqueteStore();
    const datosVacios = ref(false);
    const mensajeError = ref('');

    const fetchData = async () => {
      datosVacios.value = false;
      mensajeError.value = '';
      try {
        const response = await axios.get(`${apiDomain}/backoffice-grafico/pagos-realizados-agrupados-por-mes-anio`, {
          params: {
            anio: anioModel.value,
            mes: selectedMonth.value.toString().padStart(2, '0'),
            idPaquete: idPaquete.value,
          }
        });

        if (response.data.resp) {
          if (response.data.data.length === 0) {
            datosVacios.value = true;
            mensajeError.value = 'No se encontraron datos para el mes y paquete seleccionados.';
          } else {
            updateChart(response.data.data);
          }
        } else {
          datosVacios.value = true;
          mensajeError.value = 'Error en la respuesta de la API. Por favor, intente de nuevo más tarde.';
          console.error('Error en la respuesta de la API');
        }
      } catch (error) {
        datosVacios.value = true;
        mensajeError.value = 'Error al obtener los datos. Por favor, intente de nuevo más tarde.';
        console.error('Error al obtener datos:', error);
      }
    };

    const updateChart = (data) => {
      const labels = data.map(item => item.fecha.split('-')[2]); // Extraer solo el día
      const sumPagos = data.map(item => item.sumPago);
      const numPagos = data.map(item => item.numPago);

      if (chart.value) {
        chart.value.destroy();
      }

      chart.value = new Chart(chartCanvas.value, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total de pagos',
              data: numPagos,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              pointStyle: 'circle',
              pointRadius: 8,
              pointHoverRadius: 12,
              pointBackgroundColor: 'rgba(75, 192, 192, 0.8)'
            },
            {
              label: 'Suma total del día',
              data: sumPagos,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
              pointStyle: 'circle',
              pointRadius: 8,
              pointHoverRadius: 10,
              pointBackgroundColor: 'rgba(255, 99, 132, 0.8)'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Días del mes'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Suma total del día'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      
    };

  // btn descargar
  const btnLoadingDescargar = ref(false);

async function descargarReporte() {
  try {
    btnLoadingDescargar.value = true;

    const response = await axios.get(`${apiDomain}/backoffice-grafico/descargar/pagos-realizados-agrupados-por-mes-anio`, {
      params: {
        anio: anioModel.value,
        mes: selectedMonth.value.toString().padStart(2, '0'),
        idPaquete: idPaquete.value,

     
       }
    });

    if (response.data.resp) {
      const data = response.data.data;
      const csvContent = generarCSV(data);
      descargarArchivo(csvContent, 'pagos-realizados.csv');
    } else {
      console.error('Error al obtener los datos del endpoint.');
    }
  } catch (error) {
    console.error('Error al descargar el reporte:', error);
  } finally {
    btnLoadingDescargar.value = false;
  }
}

function generarCSV(data) {
  const headers = ['idSuscripciones', 'created_at', 'pago', 'transaction_id', 'dev_reference', 'product_description', 'trace_number', 'lot_number', 'wylexId', 'email', 'first_name', 'last_name', 'fecha'];
  let csvContent = `${headers.join(',')}\n`;

  for (const item of data) {
    const { idSuscripciones, created_at, pago, transaction_id, dev_reference, product_description, trace_number, lot_number, user } = item;
    const { wylexId, email, first_name, last_name } = user;
    const row = [idSuscripciones, created_at, pago, transaction_id, dev_reference, product_description, trace_number, lot_number, wylexId, email, first_name, last_name, item.fecha];
    csvContent += `${row.join(',')}\n`;
  }

  return csvContent;
}

function descargarArchivo(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


//fin de btn descargar

    onMounted(() => {
      fetchData();
    });

    watch([selectedMonth,idPaquete], () => {
      fetchData();
    });

    watch(anioModel, (value) => {
      if(value){
        fetchData();
      }
      
    });

    return {
      anioModel,
      selectAnio,
      chartCanvas,
      selectedMonth,
      datosVacios,
      mensajeError,
      months,
      fetchData
    };
  }
};
</script>