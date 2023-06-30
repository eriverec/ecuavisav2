<script setup>
import { hexToRgb } from '@layouts/utils';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const fechaIngresada = ref('');
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
const fechaIni = ref('');
const fechaFin = ref('');
const selectOptions = ref([]);
const dataUsers = ref(null);
const isDialogUserVisible = ref(false);
const searchQuery = ref('');
const usuarioSeleccionado = ref(null);
const isDialogVisibleChart2 = ref(false);
const dataChart = ref([]);

const initData = async (init = false) => {
  let fechai = moment().subtract(7, 'days').format("DD-MM-YYYY").toString();
  let fechaf = moment().format("DD-MM-YYYY").toString();
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
}

async function getUsers() {
  isDialogVisibleChart2.value = true;
  await fetch(`https://servicio-de-actividad.vercel.app/metadato/usuario/all/${fechaIni.value}/to/${fechaFin.value}`)
    .then(response => response.json())
    .then(data => {
      if(data.resp){
        dataUsers.value = data.data;

        if (data.data.length < 1) {
          usuarioSeleccionado.value = null;
        }
      }
      isDialogVisibleChart2.value = false;
    }).catch(error => { 
      isDialogVisibleChart2.value = false;
      return error;
    });
}

async function getChart(idusuario) {
  isDialogVisibleChart2.value = true;
  await fetch(`https://servicio-de-actividad.vercel.app/meta/navegation/group/${idusuario}?fechai=${fechaIni.value}&fechaf=${fechaFin.value}`)
    .then(response => response.json())
    .then(data => {
      dataChart.value = data.data;
      isDialogVisibleChart2.value = false;
    }).catch(error => { 
      isDialogVisibleChart2.value = false;
      return error;
    });
}

const filteredDataUsers = computed(() => {
  if (!searchQuery.value) {
    return dataUsers.value; // mostrar todos los elementos si no hay término de búsqueda
  } else {
    const query = searchQuery.value.toLowerCase();
    return dataUsers.value.filter(item => {
      const fullName = `${item.user.last_name} ${item.user.first_name}`.toLowerCase();
      const email = item.user.email.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }
});

var initDataFirst = true;

async function obtenerPorFechaMeta(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      let fechaI = moment(selectedDates[0]).format('YYYY-MM-DD');
      let fechaF = moment(selectedDates[1]).format('YYYY-MM-DD');
      fechaIni.value = fechaI;
      fechaFin.value = fechaF;
      await getUsers();
      //panelGrafico.classList.remove("disabled");                       
    }
  } catch (error) {
    console.error(error);
  }
}

async function resolveUsuario(usuario) {
  isDialogUserVisible.value = false;
  var idusuario = 0;
  if(usuario){
    idusuario = usuario.userId;
    usuarioSeleccionado.value = (usuario.user.last_name+' '+usuario.user.first_name).length > 25 ? (usuario.user.last_name+' '+usuario.user.first_name).substring(0, 25) + "..." : (usuario.user.last_name+' '+usuario.user.first_name);
  }else{
    usuarioSeleccionado.value = "Todos los usuarios";
  }
  await getChart(idusuario)
}

onMounted(() => {
  initData(true);
});

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}
/*
const getBarChartConfig = themeColors => {
  const { themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)
  
  return {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    colors: ['#00cfe8'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '30%',
        horizontal: true,
        startingShape: 'rounded',
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      categories: ['MON, 11', 'THU, 14', 'FRI, 15', 'MON, 18', 'WED, 20', 'FRI, 21', 'MON, 23'],
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
  }
}
*/
const vuetifyTheme = useTheme()
//const horizontalBarChartConfig = computed(() => getBarChartConfig(vuetifyTheme.current.value))

const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);
const resolveData = computed(() => {

let dataRaw = Array.from(dataChart.value);
const seriesFormat = {
    data: []
};

const categoriesRaw = [];
for (let i in dataRaw) {
    let num = parseInt(dataRaw[i].count);
    seriesFormat.data.push(num);
    categoriesRaw.push(dataRaw[i]._id);   
}

const options= {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    dataLabels: { 
      enabled: false
    },
    colors: ['#00cfe8'],   
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '30%',
        horizontal: true,
        startingShape: 'rounded',
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      categories: categoriesRaw,
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    }
      }

return {series: [seriesFormat], options: options, intereses: categoriesRaw};
});


</script>

<template>
      <VDialog
        v-model="isDialogVisibleChart2"
        width="300"
      >
        <VCard
          color="primary"
          width="300"
        >
          <VCardText class="pt-3">
            Espere por favor..
            <VProgressLinear
              indeterminate
              color="white"
              class="mb-0"
            />
          </VCardText>
        </VCard>
      </VDialog>

      <VDialog
        v-model="isDialogUserVisible"
        width="700"
      >
        <!-- Activator -->
        

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogUserVisible = !isDialogUserVisible" />

        <!-- Dialog Content -->
        <VCard :title="'Usuarios entre: ' + fechaIni + ' hasta ' + fechaFin ">
          <VCardText>
            <VTextField type="text" v-model="searchQuery" label="Buscar por nombre" placeholder="Buscar usuarios" />
            <br>
            <VTable style="width: 100%;" class="text-no-wrap tableNavegacion mb-5" hover="true">
              <thead>
                <tr>
                  <th scope="col">Usuario</th>
                  <th scope="col">Correo</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-if="dataUsers.length > 0"
                  class="clickable" 
                  @click="resolveUsuario(null)"
                >
                  <td colspan="2">
                    Todos los usuarios
                  </td>
                </tr>

                <tr 
                  v-if="dataUsers.length > 0"
                  v-for="item in filteredDataUsers" 
                  :key="item.userId" 
                  class="clickable" 
                  @click="resolveUsuario(item)"
                >
                  <td>
                    {{ (item.user.last_name+' '+item.user.first_name).length > 25 ? (item.user.last_name+' '+item.user.first_name).substring(0, 25) + "..." : (item.user.last_name+' '+item.user.first_name) }}
                  </td>
                  <td class="text-medium-emphasis">
                    {{ item.user.email }}
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="3">No hay datos</td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VDialog>

      <VCard>
        <VCardItem class="d-flex flex-wrap justify-space-between gap-4 w-100">
          <VCardTitle class="d-flex flex-wrap justify-space-between gap-4 w-100">
            Filtros metadatos <small style="font-size: 15px">Datos desde {{ fechaIni }} {{ fechaFin }}</small>
          </VCardTitle>
          <VCardSubtitle>
            Puede visualizar los metadatos más utilizados por usuario y por fecha
          </VCardSubtitle>

          <VCardSubtitle>
            
          </VCardSubtitle>
          <VDivider />
        </VCardItem>
        <div class="pl-6 pr-6 d-flex flex-wrap gap-4 w-100">
          <div class="date-picker-wrapper">
            <AppDateTimePicker style="width: 280px;"
              label="Rango de fecha"
              @on-change="obtenerPorFechaMeta"
              v-model="fechaIngresada"
              prepend-inner-icon="tabler-calendar"
              density="compact"
              :config="{ 
                position: 'auto right',
                mode: 'range',
                altFormat: 'F j, Y',
                dateFormat: 'd-m-Y',
                maxDate: new Date(),
                reactive: true 
              }"
            />
          </div>
          <div class="select" style="width: 250px;margin-top: -22px;">
            <small>{{ !usuarioSeleccionado?'Seleccionar cliente':(`Usuario seleccionado`) }}</small>
            <VBtn :color="!usuarioSeleccionado?'primary':'success' " width="300px" variant="outlined" @click="isDialogUserVisible = !isDialogUserVisible">
              {{ !usuarioSeleccionado?'Seleccionar cliente':(`${usuarioSeleccionado}`) }}
            </VBtn>
          </div>
        </div>
          
        <VCardText>
          <VueApexCharts
            type="bar"
            height="400"
            :options="resolveData.options"
            :series="resolveData.series"
          />
        </VCardText>
      </VCard>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.w-100 .v-card-item__content{
  width:100%;
}

.w-100 .v-card-item__content small{
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
}

tr.clickable.active {
  background-color: #00000012;
}

.clickable {
  cursor: pointer;
}
</style>
