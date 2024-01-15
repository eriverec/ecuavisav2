<script setup>
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
import Moment from 'moment'; // para las fechas
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { hexToRgb } from '@layouts/utils';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
const currentTab = ref('tab-lista');
const dataRegistros = ref([]);
const dataRegistrosBackup = ref([]);
const disabledViewList = ref(false);

const currentPage = ref(1); // Página actual
const perPage = ref(20); // Registros por página

const loadingData = ref(false);
const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY
const fecha = ref({
  i: valoresHoy.i,
  f: valoresHoy.f,
  title: "hoy"
});

const selectedfechaIniFin = ref('Hoy');
const fechaIniFinList = useSelectCalendar();
const limit = ref(valoresHoy.limit);

const selectOrder = ref('');
const selectGroup = ref('');
const selectSeccion = ref('');
const itemsSeccion = ref([]);
const groupSectionChartPieData = ref([]);

const optionOrderNormal = [
                        {title:'Ordenar ASC por nombre de usuario',value:1},
                        {title:'Ordenar DESC por nombre de usuario',value:2},
                        {title:'Ordenar ASC por fecha de registro',value:3},
                        {title:'Ordenar DESC por fecha de registro',value:4},
                        {title:'Ordenar ASC por tiempo de permanencia',value:5},
                        {title:'Ordenar DESC por tiempo de permanencia',value:6},
                      ];
const optionOrderGroup = [
                        {title:'Ordenar ASC por nombre de página',value:7},
                        {title:'Ordenar DESC por nombre de página',value:8},
                        {title:'Ordenar ASC por tiempo promedio',value:9},
                        {title:'Ordenar DESC por tiempo promedio',value:10},
                        {title:'Ordenar ASC por visitas',value:11},
                        {title:'Ordenar DESC por visitas',value:12},
                      ];

const itemsOrder = ref(optionOrderNormal);
const itemsGroup = ref([
                        {title:'Agrupar por página',value:1}
                      ]);


onMounted(getCampaigns)
// para definir una fecha especifica se la coloca dentro de moment así -- moment('2024-01-04').format('YYYY-MM-DD')
async function getCampaigns(options = {}){
  try {
      const {tipo = "fecha", section="",fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')), limit = 2000} = options;
      var response = await fetch(`https://servicio-permanencia.vercel.app/get/section/${fechai}/${fechaf}?section=${section}&limit=${limit}`);
      const data = await response.json();

      dataRegistros.value = data.data;
      dataRegistrosBackup.value = data.data;

      // Utilizar un conjunto (Set) para almacenar secciones únicas
      const seccionesUnicas = new Set();

      // Filtrar secciones únicas y crear un nuevo arreglo
      const secciones = data.data
        .map(item => item.section)
        .filter(seccion => {
          if (!seccionesUnicas.has(seccion)) {
            seccionesUnicas.add(seccion);
            return true;
          }
          return false;
        })
        .map(seccion => {
          if(seccion.includes("-1")){
            return { title: "Otros", value: seccion }
          }
          return { title: seccion, value: seccion }
        });

      const resultadoAgrupado = data.data.reduce((acumulador, actual) => {
        const sectionActual = actual.section;
        const indexEnAcumulador = acumulador.findIndex(item => item.section === sectionActual);

        if (indexEnAcumulador === -1) {
          acumulador.push({
            section: sectionActual,
            total: 1,
            sumSeconds: actual.seconds,
            porcentaje: 0, // Inicializamos el porcentaje en 0
            promedio: 0, // Inicializamos el promedio en 0
          });
        } else {
          acumulador[indexEnAcumulador].total += 1;
          acumulador[indexEnAcumulador].sumSeconds += actual.seconds;
        }

        return acumulador;
      }, []);

      // var sumatotal = 0;
      // var sumatotal2 = 0;
      


      // Calculamos el porcentaje para cada elemento
      const totalRegistros = data.data.length;

      resultadoAgrupado.forEach(elemento => {
        elemento.porcentaje = (elemento.total / totalRegistros) * 100;
        elemento.promedio = elemento.sumSeconds / elemento.total;
      });

      groupSectionChartPieData.value = resultadoAgrupado;

      // console.log(resultadoAgrupadoPorTitle)

      // var sumattt = 0;
      // var sumattt2 = 0;

      // resultadoAgrupado.forEach(elemento => {
      //   if(elemento.section.includes("Envivo")){
      //     console.log(elemento)
      //   }
      // });

      // resultadoAgrupadoPorTitle.forEach(elemento => {
      //   if(elemento.title.includes("En Vivo | Ecuavisa")){
      //     console.log(elemento)
      //   }
      // });

      // console.log(sumattt, totalRegistros, sumattt2)

      if(tipo=="fecha"){
        itemsSeccion.value = secciones;
        selectSeccion.value = "";
        selectOrder.value = "";
      }
  } catch (error) {
      return console.error(error.message);    
  }
}
// Paginación de registros
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = currentPage.value * perPage.value;
  return dataRegistros.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(dataRegistros.value.length / perPage.value));

function changePage(pageNumber) {
  currentPage.value = pageNumber;
}

function calcularDiferencia(diferencia) {
    // const inicio = horaInicio.split(':');
    // const fin = horaFin.split(':');
    // // Convertir horas y minutos a segundos
    // const segundosInicio = parseInt(inicio[0]) * 3600 + parseInt(inicio[1]) * 60 + parseInt(inicio[2]);
    // const segundosFin = parseInt(fin[0]) * 3600 + parseInt(fin[1]) * 60 + parseInt(fin[2]);
    // // Calcular la diferencia en segundos
    // let diferencia = segundosFin - segundosInicio;
    // Si la diferencia es negativa, sumamos 24 horas (en segundos)
    if (diferencia < 0) { diferencia += 24 * 3600; }
    // Convertir la diferencia en segundos a horas, minutos y segundos
    const horas = Math.floor(diferencia / 3600);
    const minutos = Math.floor((diferencia % 3600) / 60);
    const segundos = diferencia % 60;
      return `${horas} horas, ${minutos} minutos y ${segundos} segundos`;
  }

const obtenerFechaDispositivos = async function(selectedDates, dateStr, instance){
  //var respJson = await nuevoArchivoJson(archivoJson);
  if(selectedDates.length > 1){
    console.log(selectedDates)
  }
}

/*COMBO EVENTO*/
watch(async () => selectedfechaIniFin.value, async () => {
  let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
  fecha.value = {
      i: selectedCombo.i,
      f: selectedCombo.f,
      title: selectedfechaIniFin.value
  }

  limit.value = selectedCombo.limit;

  loadingData.value = true;
  await getCampaigns({
    limit:10,
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    tipo:"fecha",
    limit: limit.value
  });
  loadingData.value = false;
  selectGroup.value = null

  // itemsSeccion.value = [{title:"sds",value:"wddw"}]
});

/*COMBO SECCION*/
watch(async () => selectSeccion.value, async () => {
  const section = selectSeccion.value;
  // Utilizar un conjunto (Set) para almacenar valores únicos
  const valoresUnicos = new Set(section.map(item => item.value));

  // Convertir el conjunto a un array y unir los valores con coma
  const stringFinal = [...valoresUnicos].join(', ');
  loadingData.value = true;
  await getCampaigns({
    limit: 10,
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    section:stringFinal,
    limit: limit.value,
    tipo:"section"
  });
  loadingData.value = false;
  selectGroup.value = null;
});

function comparador(opcion) {
  switch (opcion) {
    case 1:
      return (a, b) => a.user.first_name > b.user.first_name ? 1 : -1;
    case 2:
      return (a, b) => b.user.first_name > a.user.first_name ? 1 : -1;
    case 3:
      return (a, b) => new Date(a.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/,"$2/$1/$3 $4")) - new Date(b.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/,"$2/$1/$3 $4"));
    case 4:
      return (a, b) => new Date(b.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/,"$2/$1/$3 $4")) - new Date(a.timestamp.replace(/(\d{2})\/(\d{1,2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/,"$2/$1/$3 $4"));
    case 5:
      return (a, b) => a.seconds - b.seconds;
    case 6:
      return (a, b) => b.seconds - a.seconds;
    //Item Group
    case 7:
      return (a, b) => a.title > b.title ? 1 : -1;
    case 8:
      return (a, b) => b.title > a.title ? 1 : -1;
    case 9:
      return (a, b) => a.promedio - b.promedio;
    case 10:
      return (a, b) => b.promedio - a.promedio;
    case 11:
      return (a, b) => a.total - b.total;
    case 12:
      return (a, b) => b.total - a.total;
    default:
      return null;
  }
}

/*COMBO ORDENAR*/
watch(async () => selectOrder.value, async () => {
  const datos = dataRegistros.value;
  if(selectOrder.value){
    const seleccion = selectOrder.value.value;
    const opcionSeleccionada = seleccion; // Puedes cambiar esto según la opción seleccionada

    
    const datosOrdenados = [...datos].sort(comparador(opcionSeleccionada));
    dataRegistros.value = datosOrdenados;
  }else{
    selectGroup.value = null;
    const datosOrdenados = [...datos].sort(comparador(4));
    dataRegistros.value = datosOrdenados;
  }
  
});


/*COMBO AGRUPAR*/
function agrupador(opcion) {
  const datos = Array.from(dataRegistros.value);
  switch (opcion) {
    case 1:
      const resultadoAgrupadoPorTitle = datos.reduce((acumulador, actual) => {
        const indexEnAcumulador = acumulador.findIndex(item => item.title === actual.title);
        
        // if(actual.title.includes("Los guías penitenciarios")){
        //   console.log(actual.seconds, actual)
        // }
        if (indexEnAcumulador === -1) {
          acumulador.push({
            title: actual.title,
            promedio: actual.seconds,
            section: actual.section,
            total: 1,
            url: actual.url,
            sumSeconds: actual.seconds,
            data: [actual],
          });
          // console.log(actual.title)
        } else {
          acumulador[indexEnAcumulador].promedio =
            (acumulador[indexEnAcumulador].promedio * acumulador[indexEnAcumulador].data.length + actual.seconds) /
            (acumulador[indexEnAcumulador].data.length + 1);
          acumulador[indexEnAcumulador].sumSeconds += actual.seconds;
          acumulador[indexEnAcumulador].data.push(actual);
          acumulador[indexEnAcumulador].total += 1;
          // console.log(sumatotal2++)
        }

        return acumulador;
      }, []);
      return resultadoAgrupadoPorTitle;
    default:
      return null;
  }
}

watch(async () => selectGroup.value, async () => {
  const datos = selectGroup.value;
  if(selectGroup.value){
    const seleccion = selectGroup.value.value;
    const opcionSeleccionada = seleccion; // Puedes cambiar esto según la opción seleccionada
    const datosOrdenados = agrupador(opcionSeleccionada);
    dataRegistros.value = datosOrdenados;
    itemsOrder.value = optionOrderGroup;
    // console.log(datosOrdenados)
  }else{
    dataRegistros.value = dataRegistrosBackup.value;
    itemsOrder.value = optionOrderNormal;
  }
  
});

// 👉 Colors variables
const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme();

const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

/*GRÁFICO DE PIE*/

function formatearTiempo(valorSegundos) {
  if (typeof valorSegundos !== 'number' || isNaN(valorSegundos)) {
    return 'El valor no es un número válido.';
  }

  if(valorSegundos < 0){
    console.log(valorSegundos)
    return 'El valor no es un número válido.';
  }

  let resultado;
  let tipo;

  if (valorSegundos < 60) {
    resultado = valorSegundos;
    tipo = 'segundos';
  } else if (valorSegundos < 3600) {
    resultado = valorSegundos / 60;
    tipo = 'minutos';
  } else {
    resultado = valorSegundos / 3600;
    tipo = 'horas';
  }

  return `${parseInt(resultado)} ${tipo}`;
}

const resolveDevice = computed(() => {

  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelSuccessColor = `rgba(${hexToRgb(currentTheme.success)},0.2)`
  const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`

  const chartColors = {
    donut: {
      series1: currentTheme.success,
      series2: '#28c76fb3',
      series3: '#28c76f80',
      series4: labelSuccessColor,
    },
  }

  let dataRaw = Array.from(groupSectionChartPieData.value);
  const seriesFormat = {
    name: 'Device',
    data: []
  };

  const categoriesRaw = [];
  for (let i in dataRaw) {
    let num = parseInt(dataRaw[i].porcentaje);
    seriesFormat.data.push(num);
    categoriesRaw.push(dataRaw[i].section);
  }

  // const options = {
  //   chart: {
  //     parentHeightOffset: 0,
  //     type: 'donut',
  //   },
  //   dataLabels: {
  //     enabled: true,
  //     style: {
  //       fontSize: '16px',
  //       fontFamily: 'Helvetica, Arial, sans-serif',
  //       fontWeight: 'bold',
  //       colors: ['#fff']
  //     },
  //   },
  //   legend: {
  //     position: 'bottom',
  //     horizontalAlign: 'left',
  //     offsetX: 40,
  //     show: true,
  //     labels: {
  //       colors: themeDisabledTextColor,
  //       useSeriesColors: false
  //     },
  //   },
  //   // plotOptions: {},
  //   // title: {
  //   //   text: 'Visitas por Dispositivos',
  //   //   align: 'center',
  //   //   style: {
  //   //     fontSize: '16px',
  //   //     fontWeight: 'bold',
  //   //     fontFamily: 'Helvetica, Arial, sans-serif',
  //   //     color: themeDisabledTextColor
  //   //   },
  //   // },
  //   yaxis: {
  //     labels: {
  //       style: { colors: themeDisabledTextColor },
  //     },
  //   },
  //   colors: ['#33b2df', '#546E7A'],
  //   labels: categoriesRaw,
  // }

  const options = {
    chart: {
      parentHeightOffset: 0,
      type: 'donut',
    },
    labels: categoriesRaw,
    colors: [
      "#7365ed",
      "#9d92f2",
      "#ff7f50", // Naranja claro
      "#ffd700", // Amarillo
      "#ff6347", // Rojo coral
      "#00ff00", // Verde lima
      "#ffa500", // Naranja
      "#ffd800", // Amarillo intenso
      "#ff4500", // Rojo oscuro
      "#32cd32", // Verde esmeralda
      "#ff1493", // Rosa brillante
      "#00fa9a", // Verde medio
      "#ff69b4", // Rosa claro
      "#9932cc", // Púrpura
      "#ff8c00", // Naranja oscuro
      "#8b008b", // Magenta oscuro
      "#8a2be2", // Azul violeta
    ],
    stroke: { width: 0 },
    dataLabels: {
      enabled: false,
      formatter(val) {
        return `${parseInt(val)}%`
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 0,
      // width: 300,
      markers: {
        width: 7,
        height: 7
      },
      show: true,
      formatter: function (seriesName, opts) {
        return [seriesName, " <br> ", `<div style="margin-top:10px;font-size:20px;color:rgba(var(--v-theme-on-background),var(--v-high-emphasis-opacity))">${opts.w.globals.series[opts.seriesIndex]}%<small style="font-size:14px"></small></div>`]
      },
      labels: {
        colors: themeDisabledTextColor,
        useSeriesColors: false
      },
    },
    tooltip: {
      theme: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // series[seriesIndex]
        return `<div class="tooltip-content">
          <div class="tooltip-body">
            <div class="tooltip-title">
              Permanencia de ${fecha.value.title}<br>
              <small>Muestra de ${limit.value} registros</small>
            </div>
            <div class="tooltip-subtitle">
              Sección
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                ${w.config.labels[seriesIndex]}
              </div>
              <div class="tooltip-data-value">
                ${series[seriesIndex]}%
              </div>
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                Visitas
              </div>
              <div class="tooltip-data-value">
                ${dataRaw[seriesIndex].total}
              </div>
            </div>
            <div class="tooltip-data-flex">
              <div class="tooltip-data-title">
                Tiempo promedio
              </div>
              <div class="tooltip-data-value">
                ${formatearTiempo(dataRaw[seriesIndex].promedio)} 
              </div>
            </div>
          </div>
        </div>`
      }
    },
    // tooltip: { theme: true },
    grid: {
      padding: {
        top: 15,
        right: -20,
        left: -20,
      },
    },
    states: { hover: { filter: { type: 'none' } } },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: false,
            value: {
              fontSize: '1.375rem',
              fontFamily: 'Public Sans',
              color: headingColor,
              fontWeight: 600,
              offsetY: -15,
              formatter(val) {
                return `${parseInt(val)}%`
              },
            },
            name: {
              offsetY: 20,
              fontFamily: 'Public Sans',
            },
            total: {
              show: false,
              showAlways: false,
              color: currentTheme.success,
              fontSize: '.8125rem',
              label: 'Total',
              fontFamily: 'Public Sans',
              formatter() {
                return '184'
              },
            },
          },
        },
      },
    },
  }
  return { series: seriesFormat.data, options: options };
});

</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-0" cols="12" md="12" lg="12" >
        <VTabs v-model="currentTab" class="v-tabs-pill d-none" >
          <VTab value="tab-lista" class=" " >  Listado </VTab>
          <VTab value="tab-agregar" class=" " > Estadísticas </VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <VCardItem class="header_card_item px-3">
                  <div class="d-flex">
                    <div class="descripcion">
                      <VCardTitle>Permanencia de usuarios, {{fecha.title}}</VCardTitle>
                      <VCardSubtitle>Muestra el tiempo que ha permanecido un usuario registrado en las páginas de ecuavisa.com.<br>Un total de {{ totalCount }} registros, mostrando data desde, {{fecha.i.format('YYYY-MM-DD')}} hasta {{fecha.f.format('YYYY-MM-DD')}}</VCardSubtitle>
                      <VCardSubtitle>Muestreo de datos: {{limit}} registros</VCardSubtitle>
                    </div>
                  </div>

                  <template #append>
                    
                  </template>
                  <div class="bg-ecuavisa py-4 d-flex gap-4">
                    <div class="date-picker-wrappe" style="width: 190px;">
                      <VCombobox :disabled="loadingData" v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint
                        hide-selected hint="" />

                      <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngesada"
                        show-current=true @on-change="obtenerFechaDispositivos" style="display: none;" :config="{
                          position: 'auto right',
                          mode: 'range',
                          altFormat: 'F j, Y',
                          dateFormat: 'm-d-Y',
                          maxDate: new Date(),
                          reactive: true

                        }" />
                    </div>

                    <div style="min-width: 230px;width: auto;">
                      <VCombobox clearable multiple density="compact" :disabled="loadingData" v-model="selectSeccion" :items="itemsSeccion" variant="outlined" label="Seleccionar secciones" persistent-hint
                        hide-selected hint="" />
                    </div>

                    <div style="min-width: 230px;width: auto;">
                      <VCombobox clearable density="compact" :disabled="loadingData" v-model="selectOrder" :items="itemsOrder" variant="outlined" label="Ordenar registros" persistent-hint
                        hide-selected hint="" />
                    </div>

                    <div style="min-width: 230px;width: auto;">
                      <VCombobox clearable density="compact" :disabled="loadingData" v-model="selectGroup" :items="itemsGroup" variant="outlined" label="Agrupar registros" persistent-hint
                        hide-selected hint="" />
                    </div>
                    
                  </div>
                </VCardItem>
                <div class="d-flex flex-wrap py-0 gap-4 align-items-center" style="justify-content: space-between;;" >
                  <div style="display: none">
                    <VCardTitle>
                      Permanencia de usuarios del día de hoy
                    </VCardTitle>
                    <VCardSubtitle>Muestra el tiempo que ha permanecido un usuario registrado en las páginas de ecuavisa.com  </VCardSubtitle>
                  </div>
                </div>
                <!-- inicio lista de Módulos -->
                
                <div class="px-4">
                  <!-- preloader -->
                  <VList lines="two" border v-if="dataRegistros.length < 1">
                    <VListItem>
                      <VListItemTitle> <div class="loading">Cargando información</div> </VListItemTitle>
                    </VListItem>
                  </VList>
                  <VRow>
                    <VCol cols="12" sm="4" class="">
                      <VCard class="px-2 py-2 pb-5 v-card--flat v-theme--light v-card--border v-card--density-default v-card--variant-elevated">
                        <VCardItem class="header_card_item pb-4">
                          <div class="d-flex pr-0" style="justify-content: space-between;">
                            <div class="descripcion">
                              <VCardTitle>Tiempo de permanencia<br></VCardTitle>
                              <small class="mt-3">Agrupados por sección, número de muestra: {{limit}} registros</small>
                            </div>
                            <!-- <div class="">
                              <VSwitch class="mt-n4 pt-5" disabled @click="toggleRealtime"></VSwitch>
                            </div> -->

                          </div>
                        </VCardItem>
                        <VueApexCharts v-if="sumV != 0" :options="resolveDevice.options" :series="resolveDevice.series" :height="480" width="100%" />
                      </VCard>
                    </VCol>
                    <VCol cols="12" sm="8" class="">
                      <div  v-if="selectGroup">
                        <!-- SECTION Table -->
                        Aquí estarán los registros agrupados
                        <VTable class="text-no-wrap invoice-list-table" style="display:none">
                          <!-- 👉 Table head -->
                          <thead class="text-uppercase">
                            <tr>

                              <th scope="col">
                                Página
                              </th>


                              <th scope="col">
                                Sección
                              </th>

                              <th
                                scope="col"
                                class="text-center"
                              >
                                Tiempo promedio
                              </th>

                              <th
                                scope="col"
                                class="text-center"
                              >
                                Visitas
                              </th>

                              <th scope="col">
                                Acción
                              </th>
                            </tr>
                          </thead>

                          <!-- 👉 Table Body -->
                          <tbody>
                            <tr
                              v-for="(c, index) in paginatedData" :key="index"
                              style="height: 3.75rem;"
                            >
                              <!-- 👉 Page name -->
                              <td style="min-width: 17rem;max-width: 17rem;">
                                <VCardTitle :title="c.title" style="font-size: 18px;">
                                  <small>{{ c.title }}</small>
                                </VCardTitle>
                                
                              </td>

                              <!-- 👉 Section -->
                              <td>
                                {{c.section}}
                              </td>

                              <!-- 👉 Promedio -->
                              <td class="text-center">
                                <VChip
                                  label
                                  v-bind="{
                                    status: 'Paid',
                                    chip: { color: 'success' },
                                  }"
                                  size="small"
                                >
                                  {{ formatearTiempo(parseInt(c.promedio)) }}
                                </VChip>
                              </td>
                              <td class="text-center">
                                <VChip
                                  label
                                  v-bind="{
                                    status: 'Paid',
                                    chip: { color: 'success' },
                                  }"
                                  size="small"
                                >
                                  {{c.total}} visitas
                                </VChip>
                              </td>

                              <!-- 👉 Actions -->
                              <td class="text-center" style="width: 5rem;">
                                <VBtn icon size="x-small" color="info" variant="text" :href="c.url" target="_blank" >
                                  <VIcon size="22" icon="tabler-eye" /> 
                                </VBtn>
                              </td>
                            </tr>
                          </tbody>

                          <!-- 👉 table footer  -->
                          <tfoot v-show="!paginatedData.length">
                            <tr>
                              <td
                                colspan="8"
                                class="text-center text-body-1"
                              >
                                No data available
                              </td>
                            </tr>
                          </tfoot>
                        </VTable>
                        <!-- !SECTION -->
                      </div>
                      <div v-else>
                        <!-- listado de datos -->
                        <VList lines="two" border  v-if="dataRegistros.length > 0">
                          <template v-for="(c, index) in paginatedData" :key="index" >
                            <VListItem :disabled="disabledViewList">
                              <VListItemTitle> {{ c.user.first_name || "Not Found" }} {{ c.user.last_name || "" }} <VChip> estuvo {{ calcularDiferencia(c.seconds) }}  </VChip> </VListItemTitle>
                              <VListItemSubtitle class="mt-1" title="Estado de campaña">
                                <span class="text-xs text-primary pl-2"> <VIcon icon="mdi-web" />: {{ c.title }} </span>
                              </VListItemSubtitle>

                              <template #append>
                                <div class="espacio-right-2">
                                  <VBtn icon size="x-small" color="info" variant="text" :href="c.url" target="_blank" >
                                    <VIcon size="22" icon="tabler-eye" /> 
                                  </VBtn>
                                </div>
                              </template>
                            </VListItem>
                            <VDivider v-if="index !== dataRegistros.length - 1" />
                          </template>
                        </VList>
                      </div>
                      
                      <!-- Paginación -->
                      <VPagination class="mt-5" v-model="currentPage" :length="totalPages" :total-visible="7" />
                    </VCol>
                  </VRow>
                  
                </div>
                <!-- fin lista usuarios -->
                
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



<style>
  .apexcharts-legend-series{
    transition: 1s ease all;
    padding: 5px;
    border-radius: 7px;
  }
  .apexcharts-legend-series:hover{
    background-color: #e9e9ea;
  }
</style>
