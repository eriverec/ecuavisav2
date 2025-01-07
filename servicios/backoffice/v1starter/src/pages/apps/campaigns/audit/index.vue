<script setup>
import estadoListCampaigns from '@/views/apps/campaigns/estadoListCampaigns.vue';
import tabGroupTable from '@/views/apps/campaigns/tabGroupTable.vue';
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
import { hexToRgb } from '@layouts/utils';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY
const fecha = ref({
  i: valoresHoy.i,
  f: valoresHoy.f,
  title: "hoy"
});

const currentTabSectionData = ref(0)
const loadingData = ref(false);
const loadingCombo = ref(false);
const isFullLoading = ref(false);
const disabledViewList = ref(false);
const selectedfechaIniFin = ref('Hoy');
const fechaIniFinList = useSelectCalendar();
const limit = ref(valoresHoy.limit);
const currentPage = ref(1); // Página actual
const perPage = ref(7); // Registros por página
const itemsTypeEvent = ref([
  {title:'Todos los eventos',value:"all"},
  {title:'Usuarios que vieron la publicidad',value:"preview"},
  {title:'Usuarios que dieron click en la publicidad',value:"click"},
]);
const selecTypeEvent = ref(null);
const selecCampaign = ref(null);
const selecMultipleCampaign = ref(null);

const dataRegistros = ref([]);
const dataRegistrosExport = ref([]);
const dataCampaigns = ref([]);
const dataChart_1 = ref([]);
const dataChart_2 = ref([]);
const selectdFirstChart_1 = ref([]);
const dataRegistrosBackup = ref([]);

const selectedOptionperPage = ref(
  { title: perPage.value, value: perPage.value }
)

const itemsPage = [
  { title: '10', value: 10 },
  { title: '30', value: 30 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
  { title: '200', value: 200 }
]

const totalPages = computed(() => Math.ceil(dataRegistros.value.length / perPage.value));

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

async function downloadFull () {
  isFullLoading.value = true;
  await exportarDataAudit();

  let headers = {
    pagina: "title",
    url: "url",
    type: "type",
    created_at: "created_at",
    user_email: "user_email",
    user_last_name: "user_last_name",
    user_firstname: "user_firstname",
    campaign_idCampaign: "campaign_idCampaign",
    campaign_title: "campaign_title",
    campaign_position: "campaign_position"
  };

  let doc = dataRegistrosExport.value || [];
  let title = "campaigns_full";

  await exportCSVFile(headers, doc, title);

  isFullLoading.value = false;
};

async function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";
      line += array[i][index];
    }
    str += line + "\r\n";
  }

  return str;
}

async function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);
  var csv = await convertToCSV(jsonObject);
  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

async function exportarDataAudit(){
  dataRegistrosExport.value = [];
  let skip = 1;
  let batchSize = 7000;

  while (true) {
    const batchRegister = await getDataAuditoria({
      tipo: "all",
      fechai: fecha.value.i.format("YYYY-MM-DD"),
      fechaf: fecha.value.f.format("YYYY-MM-DD"), 
      limit: batchSize, 
      page: skip, 
      exportar:true
    });

    if (batchRegister.length === 0) {
      break;
    }
    dataRegistrosExport.value.push(...batchRegister);
    skip += 1;
  }

  const registrosDepurado = dataRegistrosExport.value.reduce((acumulador, actual) => {
    acumulador.push({
      title: actual.title,
      url: actual.url,
      type: actual.type,
      created_at: actual.created_at,
      user_email: actual.firstUser.email,
      user_last_name: actual.firstUser.last_name,
      user_firstname: actual.firstUser.firstname,
      campaign_idCampaign: actual.idCampaign._id,
      campaign_title: actual.idCampaign.title,
      campaign_position: actual.idCampaign.position,
    });

    return acumulador;
  }, []);

  dataRegistrosExport.value = registrosDepurado;
  return true;
}

async function getDataAuditoria(options = {}){
  try {
    const {tipo = "all", fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')), limit = 10, page=1, exportar=false} = options;

    var response = await fetch(`https://ads-service.vercel.app/campaigns-historical/events/${tipo}?fechai=${fechai}&fechaf=${fechaf}&page=${page}&limit=${limit}&idCampaign=&userId=`);
    const data = await response.json();

    if(!exportar){
      dataRegistros.value = data.data;
      dataRegistrosBackup.value = data.data;
    }else{
      return data.data;
    }

  } catch (error) {
    return console.error(error.message);    
  }
}

async function getCampanias(){
  try {
    var response = await fetch(`https://ads-service.vercel.app/campaigns-historical/campaigns`);
    const data = await response.json();

    dataCampaigns.value = data.data.reduce((acumulador, actual) => {
      acumulador.push({
        value: actual._id,
        title: `${actual.campaignTitle} (${actual.statusCampaign?"activo":"inactivo"})`
      });

      return acumulador;
    }, []);

    selectdFirstChart_1.value = dataCampaigns.value[0];
    selecCampaign.value = dataCampaigns.value[0];

  } catch (error) {
    return console.error(error.message);    
  }
}

async function cart_2(options = {}){
  try {
    const { idCampaign = null } = options;
    const id = idCampaign.map(s => s.value);
    var response = await fetch(`https://ads-service.vercel.app/campaigns-historical/chart-1?idCampaign=${id}`);
    const data = await response.json();

    dataChart_2.value = data.data.reduce((acumulador, actual) => {
      acumulador.push({
        preview: actual.sumPreview,
        click: actual.sumClick,
        title: actual.campaignData.campaignTitle,
      });

      return acumulador;
    }, []);

  } catch (error) {
    return console.error(error.message);    
  }
}

onMounted(getDataAuditoria)
onMounted(getCampanias)

// Paginación de registros
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = currentPage.value * perPage.value;
  return dataRegistros.value.slice(start, end);
});

/****************************************************/
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
  await getDataAuditoria({
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    limit: limit.value
  });
  loadingData.value = false;
});

/*COMBO selecTypeEvent*/
watch(async () => selecTypeEvent.value, async () => {
  let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
  fecha.value = {
    i: selectedCombo.i,
    f: selectedCombo.f,
    title: selectedfechaIniFin.value
  }

  limit.value = selectedCombo.limit;

  loadingData.value = true;
  await getDataAuditoria({
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    limit: limit.value,
    tipo: selecTypeEvent.value?selecTypeEvent.value.value: "all"
  });
  loadingData.value = false;
});

const receiveTime = async (time) => {
  let selectedCombo = time;
  fecha.value = {
    i: moment(selectedCombo[0]),
    f: moment(selectedCombo[1]),
    title: "Fecha personalizada"
  }

  limit.value = 8000;

  loadingData.value = true;
  await getDataAuditoria({
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    limit: limit.value,
    tipo: selecTypeEvent.value?selecTypeEvent.value.value: "all"
  });
  loadingData.value = false;
};

/*COMBO selecMultipleCampaign*/
watch(() => selecMultipleCampaign, async () => {
  loadingData.value = true;
  await cart_2({
    idCampaign: selecMultipleCampaign.value?selecMultipleCampaign.value: [selectdFirstChart_1.value]
  });
  loadingData.value = false;
}, { deep: true });

const resolveChart_2 = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelSuccessColor = `rgba(${hexToRgb(currentTheme.success)},0.2)`
  const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`

  let dataRaw = Array.from(dataChart_2.value);
  const colores = [
    "#ff6347", // Rojo 
    "#9932cc", // Púrpura
    "#ff8c00", // Naranja 
    "#8b008b", // Magenta 
    "#8a2be2", // Azul 
  ];

  const options = {
    chart: {
      parentHeightOffset: 0,
      zoom: {
        enabled: false
      },
      toolbar:{
        show: false
      },
      type: 'bar',
      height: 350,
      events: {
        dataPointSelection: function (event, chartContext, config) {
        }
      }
    },
    colors: colores,
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent']
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: dataRaw.map(s => s.title),
      labels: {
        colors: themeDisabledTextColor,
        useSeriesColors: false
      },
    },
    yaxis: {
      title: {
        text: 'Interacciones',
        style: {
          color: headingColor
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
        y: {
          formatter: function (val) {
            return val + " Visitas"
          }
        },
        theme: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return `<div class="tooltip-content">
            <div class="tooltip-body">
              <div class="tooltip-title">
                ${w.config.xaxis.categories[dataPointIndex]}
              </div>
              <div class="tooltip-data-flex">
                <div class="tooltip-data-title">
                  ${w.config.series[seriesIndex].name}
                </div>
                <div class="tooltip-data-value">
                  ${series[seriesIndex][dataPointIndex]}
                </div>
              </div>
            </div>
          </div>`
        }
      },
      legend: {
        labels: {
          colors: headingColor,
          useSeriesColors: false
        },
      },
      states: { hover: { filter: { type: 'none' } } },
    }
    return { 
      series: [{
        name: 'Impresiones',
        data: dataRaw.map(s => s.preview)
      }, {
        name: 'Clicks',
        data: dataRaw.map(s => s.click)
      }],
      options: options 
    };
  });

</script>

<template>
  <section>
    <VRow>

      <!-- Nuevo componente estadoListCampaigns -->
      <VCol class="mt-0" cols="12">
        <estadoListCampaigns />
      </VCol>
     
      <VCol class="mt-0" cols="12">
        <VCard class="px-0 py-0 pb-4 v-card--flat v-theme--light v-card--border v-card--density-default v-card--variant-elevated">
          <VCardItem class="header_card_item pb-0">
            <div class="d-flex pr-0" style="justify-content: space-between;">
              <div class="descripcion">
                <VCardTitle>Comparativa de datos entre campañas</VCardTitle>
                <small class="mt-3">Informe para medir el impacto que obtuvo una campaña frente a una o varias campañas.</small>
               
              </div>
            </div>

            <div class="bg-ecuavisa py-4 d-flex gap-4">
              <div style="min-width: 230px;width: auto;">
                <VCombobox 
                  chips 
                  clearable 
                  density="compact" 
                  :disabled="loadingData" 
                  multiple 
                  v-model="selecMultipleCampaign" 
                  :items="dataCampaigns" 
                  variant="outlined" 
                  label="Escoge las campañas" 
                  persistent-hint
                  hide-selected 
                  hint="" 
                />
              </div>
            </div>
            <VDivider class="my-5" />
          </VCardItem>
          <VueApexCharts 
            class="px-5" 
            v-if="resolveChart_2.series.length > 0" 
            :options="resolveChart_2.options" 
            :series="resolveChart_2.series" 
            :height="350" 
            width="100%" 
          />
          <div class="px-4" v-if="resolveChart_2.series.length < 1">No existen datos</div>
        </VCard>
      </VCol>

      <!-- Panel principal de análisis - Ahora ocupa todo el ancho -->
      <VCol class="mt-0" cols="12">
        <VCard class="px-2 py-2 elevation-0">
          <VTabs v-model="currentTabSectionData" class="">
            <VTab>Análisis de campañas</VTab>
            <VTab>Análisis agrupada</VTab>
          </VTabs>
          <VDivider />
          <VWindow v-model="currentTabSectionData">
            <VWindowItem>
              <VCardItem class="header_card_item py-0 pt-4 align-start">
                <div class="d-flex pr-0" style="justify-content: space-between;">
                  <div class="descripcion">
                    <VCardSubtitle>*Mostrando data desde, {{fecha.i.format('YYYY-MM-DD')}} hasta {{fecha.f.format('YYYY-MM-DD')}}</VCardSubtitle>
                    <VCardSubtitle>*Este informe muestra un límite máximo de {{limit}} registros</VCardSubtitle>
                  </div>
                </div>

                <template #append>
                  <VBtn               
                    variant="tonal"
                    color="success"
                    prepend-icon="tabler-screen-share"
                    @click="downloadFull"
                    :loading="isFullLoading"
                    :disabled="isFullLoading"
                  >
                    <span>Exportar búsqueda</span>
                    <VTooltip 
                      open-on-click
                      :open-on-hover="false"                                                      
                      location="top"
                      activator="parent"
                      no-click-animation
                      :disabled="!isFullLoading"
                    >
                      <span>Esta acción traerá todos los registros de la búsqueda y la carga puede demorar hasta 12 minutos, espere por favor</span>
                    </VTooltip>     
                  </VBtn> 
                </template>
              </VCardItem>

              <div class="px-5 py-2">
                <div class="bg-ecuavisa py-4 d-flex gap-4 flex-wrap">
                  <div class="date-picker-wrappe" style="min-width: 90px;width: auto;">
                    <AppDateRange @get:dateCR="receiveTime"/>
                  </div>
                  <div style="min-width: 230px;width: auto;">
                    <VCombobox 
                      clearable 
                      density="compact" 
                      :disabled="loadingData" 
                      v-model="selecTypeEvent" 
                      :items="itemsTypeEvent" 
                      variant="outlined" 
                      label="Buscar por evento" 
                      persistent-hint
                      hide-selected 
                      hint="" 
                    />
                  </div>
                </div>
                <VDivider class="my-5" />
                <div class="item-limit">
                  <label>Mostrar</label>
                  <VSelect 
                    style="min-width: 90px;"
                    v-model="selectedOptionperPage"
                    :items="itemsPage"
                    item-title="title"
                    item-value="value"
                    label=""
                    persistent-hint
                    return-object
                    single-line
                  />
                  <label>registros</label>
                </div>
                <VTable class="text-no-wrap invoice-list-table" :disabled="disabledViewList">
                  <thead class="text-uppercase">
                    <tr>
                      <th scope="col">N</th>
                      <th scope="col">Título de Página</th>
                      <th scope="col" class="text-center">Evento</th>
                      <th scope="col">Nombre de Campaña</th>
                      <th scope="col" class="text-left">Fecha y hora de evento</th>
                      <th scope="col">Link</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(c, index) in paginatedData" :key="index" style="height: 3.75rem;">
                      <td class="text-center">{{index + 1}}</td>
                      <td style="min-width: 17rem;max-width: 17rem;text-align: left;">
                        <VCardTitle :title="c.title" style="font-size: 18px;">
                          <small>{{ c.title }}</small>
                        </VCardTitle>
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
                          <span v-if="c.type == 'preview'">Impresión</span>
                          <span v-else>{{ c.type }}</span>
                        </VChip>
                      </td>
                      <td class="text-center">{{c.idCampaign.title}}</td>
                      <td>{{ moment(c.created_at).format("YYYY-MM-DD, HH:mm:ss") }}</td>
                      <td class="text-center" style="width: 5rem;">
                        <VBtn 
                          icon 
                          size="x-small" 
                          color="info" 
                          variant="text" 
                          :href="c.url" 
                          target="_blank"
                        >
                          <VIcon size="22" icon="mdi-link-variant" />
                        </VBtn>
                      </td>
                    </tr>
                  </tbody>

                  <tfoot v-show="!paginatedData.length">
                    <tr>
                      <td colspan="8" class="text-center text-body-1">
                        No data available
                      </td>
                    </tr>
                  </tfoot>
                </VTable>

                <VPagination class="mt-5" v-model="currentPage" :length="totalPages" :total-visible="7" />
                <br>
              </div>
            </VWindowItem>
            <VWindowItem>
              <tabGroupTable :dataCampaigns="dataCampaigns"/>
            </VWindowItem>
          </VWindow>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style>
.apexcharts-legend-series {
  transition: 1s ease all;
  padding: 5px;
  border-radius: 7px;
}

.apexcharts-legend-series:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.item-limit {
  max-width: 210px;
  display: flex;
  font-size: 15px;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}
</style>