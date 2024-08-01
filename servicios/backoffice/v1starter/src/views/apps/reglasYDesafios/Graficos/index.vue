<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

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

const obtenerSemanas = async () => {
  // cargando.value = true; // Iniciar carga
  try {
    const response = await axios.get('https://servicio-desafios.vercel.app/semana/all/get');
    semanas.value = response.data.data;
    items.value = response.data.data.map(item => ({
      title: item.titulo,
      value: item._id,
      description: item.descripcion
    }));

    if (semanas.value.length > 0) {
      semanaSeleccionada.value = semanas.value[0]._id;
      obtenerTotalUsuarios();
    }
  } catch (error) {
    console.error('Error al obtener las semanas:', error);
  }
};

const obtenerNombreDia = (numeroDia) => {
  const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ];
  return diasSemana[numeroDia] || 'Día no válido';
};

const obtenerTotalUsuarios = async () => {
  cargando.value = true; // Iniciar carga
  if (!semanaSeleccionada.value) return;

  try {
    const response = await axios.get(`https://servicios-ecuavisa.vercel.app/grafico-backoffice/usuarios-x-semana/${semanaSeleccionada.value}`);


    desafios.value = response.data.data.map(item => ({
      ...item.desafio[0],
      idDesafio: item.idDesafio,
      total: item.total,
      nombreDia: obtenerNombreDia(parseInt(item.desafio[0].dia))
    }));

    // Ordenar los desafíos por día de la semana
    desafios.value.sort((a, b) => a.dia - b.dia);

    console.log(desafios.value);

    totalUsuarios.value = response.data.data.map(item => item.total);


    /*van en el grafico */
    // series.value = totalUsuarios.value;
    series.value = desafios.value.map((ev)=> ev.total);
    console.log("series:", series.value);
    // labels.value = desafios.value.map(item => item.tituloDesafio);
    labels.value = desafios.value.map((ev)=> ev.tituloDesafio);
    console.log("labels:", labels.value);
    /*van en el grafico */


  } catch (error) {
    console.error('Error al obtener el total de usuarios:', error);
  } finally {
    cargando.value = false; // Finalizar carga
  }
};

const obtenerTotalRegistros = async (idSemana, idDesafio) => {
  try {
    const response = await axios.get(`https://servicios-ecuavisa.vercel.app/grafico-backoffice/usuarios-x-desafio-listado/${idSemana}/${idDesafio}?page=1&limit=10`);
    totalRegistros.value[idDesafio] = response.data.total;
    registrosExportados.value[idDesafio] = 10;
  } catch (error) {
    console.error('Error al obtener el total de registros:', error);
  }
};


const downloadSearch = async (index, idSemana, idDesafio) => {
  cargandoDescarga.value[idDesafio] = true;
  try {
    // Cargar los primeros 3 registros
    await obtenerTotalRegistros(idSemana, idDesafio);

    // Simular la exportación en lotes de 10, actualizando el contador cada vez
    let contador = 0;
    const intervalo = setInterval(() => {
      contador += 10; // Incrementar en lotes de 10
      registrosExportados.value[idDesafio] = Math.min(contador, totalRegistros.value[idDesafio]);

      if (contador >= totalRegistros.value[idDesafio]) {
        clearInterval(intervalo); // Detener el intervalo cuando se alcanza el total
      }
    }, 100); // Actualizar cada 100 milisegundos

    // Descargar todos los registros
    const response = await axios.get(`https://servicios-ecuavisa.vercel.app/grafico-backoffice/usuarios-x-desafio-listado/${idSemana}/${idDesafio}?page=1&limit=${totalRegistros.value[idDesafio]}`);





    const csvData = response.data.data.map(item => {
      const user = item.userId;
      return `${user._id},${user.wylexId},${user.email},${user.first_name},${user.last_name},${user.phone_prefix},${user.phone_number},${user.telefono},${user.provider},${user.country},${user.ciudad || ''}`;
    }).join('\n');

    const headers = 'ID,WylexId,Email,Nombre,Apellido,Prefijo,Teléfono1,Teléfono2,Proveedor,Pais,Ciudad\n';
    const csvContent = headers + csvData;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_desafio_${idDesafio}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Resetear el contador de registros exportados
    registrosExportados.value[idDesafio] = null;
  } catch (error) {
    console.error('Error al descargar los datos:', error);
  } finally {
    cargandoDescarga.value[idDesafio] = false;
  }
};

onMounted(obtenerSemanas);

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme()
// Función movida desde apexCharConfigDesafios
const getDonutChartConfig = theme => {
  return {
    stroke: { width: 0 },
    labels: labels.value,
    colors: [
      "#173F5F",
      "#00fa9a", // Verde medio
      "#7365ed",
      "#ff69b4", // Rosa claro
      "#000f08",
      "#32cd32", // Verde esmeralda
      "#136f63", // Naranja claro
      "#ffd700", // Amarillo
      "#ff4500", // Rojo oscuro
      "#ff0000", // Rojo
      "#ff8c00", // Naranja oscuro
      "#ffff00", // Amarillo
      "#8b4513", // Marrón
      "#0000ff", // Azul
      "#8a2be2", // Azul violeta
      "#ffa500", // Naranja
      "#ffd800", // Amarillo intenso
      "#ff1493", // Rosa brillante
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`,
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.colors['text-secondary'] },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
            name: {
              fontSize: '1.5rem',
            },
            value: {
              fontSize: '1.5rem',
              color: theme.colors['text-secondary'],
              formatter: val => `${parseInt(val, 10)}`,
            },
            total: {
              show: false,
              fontSize: '1.5rem',
              label: 'Operativo',
              formatter: () => '31%',
              color: theme.colors['text-secondary'],
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1rem',
                  },
                },
              },
            },
          },
        },
      },
    ],
  }
}

const expenseRationChartConfig = computed(() => getDonutChartConfig(vuetifyTheme.current.value))

</script>



<template>

  <VCard class="v-col-12 pb-5 pt-5">
    <VCardItem>
      <VRow class="pb-5">
        <VCol cols="12" md="5">
          <VCardTitle class="ps-0 pb-0">
            <VIcon size="25" icon="tabler-chart-donut" /> Análisis para el módulo
          </VCardTitle>
          <div class="py-9 d-flex align-center" v-if="cargando">
            <VProgressCircular indeterminate color="primary" />
            <span class="ml-2 ">Cargando datos...</span>
          </div>
          <div class="py-9 d-block" v-else-if="totalUsuarios.length === 0">
            No hay datos para mostrar
          </div>

          <div class="py-9" v-else>
            <VueApexCharts type="donut" height="410" :options="expenseRationChartConfig" :series="series" />
          </div>
        </VCol>
        <VCol cols="12" md="7">
          <VCardTitle class="ps-0 pb-4">
            <VIcon size="25" icon="tabler-filter" />
            Filtros

            <div class="d-flex flex-wrap gap-3 mt-5">
              <VSelect v-model="semanaSeleccionada" :items="items" label="Semana" item-title="title" item-value="value"
                @update:model-value="obtenerTotalUsuarios">
                <template v-slot:item="{ props, item }">
                  <VListItem v-bind="props" :title="item.raw.title">
                    <template v-slot:subtitle>
                      {{ item.raw.description }}
                    </template>
                  </VListItem>
                </template>
              </VSelect>

            </div>
            <div class="py-9 d-block" v-if="cargando">
              <VProgressCircular indeterminate color="primary" />
              <span class="ml-2">Cargando datos...</span>
            </div>
            <div class="py-9 d-block" v-else-if="desafios.length === 0">
              No hay datos para mostrar
            </div>
            <div v-else class="mt-9">
              <VCardTitle class="ps-0 pb-0">
                <VIcon size="25" icon="tabler-notes" />
                Listado de Desafío
              </VCardTitle>
              <VList class="mt-2" lines="two" border>
                <template v-for="(desafio, index) in desafios" :key="index">
                  <VListItem>
                    <template #prepend>
                      <VAvatar rounded="sm" size="x-large" class="">
                        <!-- <VIcon size="50" icon="tabler-video" /> -->
                        <VImg :src="desafio.URLSticker" />
                      </VAvatar>
                    </template>
                    <div style="width: 86%;">
                      <VListItemTitle>
                        <VChip label size="x-small">
                          {{ desafio.nombreDia }}
                        </VChip>
                        {{ desafio.tituloDesafio }} - {{ desafio.tituloSticker }}
                      </VListItemTitle>
                      <VListItemSubtitle class=""
                        style="width: 100%;display: block;text-wrap: wrap;line-height: normal;">
                        <small>{{ desafio.leyenda }}</small>
                      </VListItemSubtitle>

                    </div>

                    <template #append>
                      <div class="d-flex gap-5 justify-center align-center">
                        <div>
                          <VListItemTitle>
                            <div class="d-flex justify-center align-center">
                              <VIcon size="18" icon="tabler-user" />
                              {{ desafio.total }}
                            </div>
                          </VListItemTitle>
                        </div>
                        <div class="d-flex flex-column">
                          <VBtn color="success" size="small"
                            @click="downloadSearch(index, semanaSeleccionada, desafio.idDesafio)"
                            :loading="cargandoDescarga[desafio.idDesafio]" :disabled="cargandoDescarga[desafio.idDesafio]">
                            <VIcon size="20" icon="tabler-download" />
                            CSV
                          </VBtn>
                          <VChip v-if="registrosExportados[desafio.idDesafio]" size="x-small" class="mt-1">
                            Exportando {{ registrosExportados[desafio.idDesafio] }} / {{
                              totalRegistros[desafio.idDesafio] }} registros
                          </VChip>
                        </div>

                      </div>
                    </template>

                  </VListItem>

                </template>
              </VList>
            </div>
          </VCardTitle>
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
</style>
