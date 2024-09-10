<template>
  <section>
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
                Ventas agrupadas por día
              </VCardTitle>
              <VCardSubtitle>
                Escoja un mes para ver las ventas diarias y suma total.
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
                      <VSelect
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
    const anio = 2024;
    const idPaquete = '651c9d012ff9fa09a75e6c16';

    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiDomain}/backoffice-grafico/pagos-realizados-agrupados-por-mes-anio`, {
          params: {
            anio,
            mes: selectedMonth.value.toString().padStart(2, '0'),
            idPaquete
          }
        });

        if (response.data.resp) {
          updateChart(response.data.data);
        } else {
          console.error('Error en la respuesta de la API');
        }
      } catch (error) {
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
        anio,
        mes: selectedMonth.value.toString().padStart(2, '0'),
        idPaquete
     
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

    watch(selectedMonth, () => {
      fetchData();
    });

    return {
      chartCanvas,
      selectedMonth,
      months,
      fetchData
    };
  }
};
</script>