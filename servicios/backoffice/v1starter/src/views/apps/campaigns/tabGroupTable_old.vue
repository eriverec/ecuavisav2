<script setup>
  import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
  import tabGroupTable from '@/views/apps/campaigns/tabGroupTable.vue';
  import { hexToRgb } from '@layouts/utils';
  import VueApexCharts from 'vue3-apexcharts';
  import { useTheme } from 'vuetify';
  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";
  
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);

  const loadingDownloadTable = ref([]);
  const loadingDownloadTableEnCurso = ref(false);

  const load = async (i, title_page) => {
  	if(loadingDownloadTableEnCurso.value){
  		alert("Existe una descarga en curso, espere a que termine")
  		return false;
  	}
  	loadingDownloadTableEnCurso.value = true;
	  loadingDownloadTable.value[i] = true;

	  await exportarDataAudit({title_page:title_page});

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

    let doc = dataRegistrosGroupExport.value || [];
    let title = "campaigns_user_full";

    await exportCSVFile(headers, doc, title);

	  loadingDownloadTableEnCurso.value = false;
	  loadingDownloadTable.value[i] = false;
	}

  const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY
  const fecha = ref({
    i: valoresHoy.i,
    f: valoresHoy.f,
    title: "hoy"
  });

  const props = defineProps({
    dataCampaigns: Object
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
  const selecOrdergroup = ref(null);
  const itemsOrdergroup = ref([
                        {title:'Ordenar por Impresiones DESC', value: 1},
                        {title:'Ordenar por Impresiones ASC', value: 2},
                        {title:'Ordenar por clicks DESC', value: 3},
                        {title:'Ordenar por clicks ASC', value: 4},
                        {title:'Ordenar por nombre de página DESC', value: 5},
                        {title:'Ordenar por nombre de página ASC', value: 6},
                      ]);

  function comparador(opcion) {
	  switch (opcion) {
	    case 1: //Página con más impresiones
	      return (a, b) => b.preview - a.preview;
	    case 2: //Página con menos impresiones
	      return (a, b) => a.preview - b.preview;
	    case 3: //Página con más clicks
	      return (a, b) => b.click - a.click;
	    case 4: //Página con menos clicks
	      return (a, b) => a.click - b.click;
	    case 5: //Ordenar por nombre de página DESC
	      return (a, b) => a.title > b.title ? 1 : -1;;
	    case 6://Ordenar por nombre de página ASC
	      return (a, b) => b.title > a.title ? 1 : -1;;
	    default:
	      return null;
	  }
	}

  const selecCampaign = ref(null);
  const selecMultipleCampaign = ref(null);

  const dataRegistrosGroup = ref([]);
  const dataRegistrosGroupExport = ref([]);
  const dataCampaigns = ref([]);
  const dataChart_1 = ref([]);
  const dataChart_2 = ref([]);
  const selectdFirstChart_1 = ref([]);
  const dataRegistrosGroupBackup = ref([]);

  const selectedOptionperPage = ref(
    { title: perPage.value, value: perPage.value }
  )

  const itemsPage = [{ title: '7', value: 7 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
    { title: '200', value: 200 }]

  const totalPages = computed(() => Math.ceil(dataRegistrosGroup.value.length / perPage.value));

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

  // Paginación de registros
  const paginatedDataGroup = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = currentPage.value * perPage.value;
    return dataRegistrosGroup.value.slice(start, end);
  });

  async function downloadFull () {


    if(dataRegistrosGroup.value.length < 1){
    	alert("No hay registros que exportar");
    	return false;
    }

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

    let doc = dataRegistrosGroupExport.value || [];
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

  async function exportarDataAudit(json = {}){
  	const { title_page = "" } = json;
    dataRegistrosGroupExport.value = [];
    let skip = 1;
    let batchSize = 7000;

    while (true) {
      const batchRegister = await getDataAuditoria({
        tipo: "all",
        fechai: fecha.value.i.format("YYYY-MM-DD"),
        fechaf: fecha.value.f.format("YYYY-MM-DD"), 
        limit: batchSize, 
        page: skip,
	      idCampaign: selecCampaign.value.value,
        exportar:true,
        title_page
      });

      if (batchRegister.length === 0) {
        break;
      }
      dataRegistrosGroupExport.value.push(...batchRegister);
      skip += 1;
      // console.log(dataRegistrosGroupExport.value)
    }

    const registrosDepurado = dataRegistrosGroupExport.value.reduce((acumulador, actual) => {
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

    dataRegistrosGroupExport.value = registrosDepurado;


    return true;
  }

  async function getDataAuditoria(options = {}){
    try {
        const {title_page="", idCampaign = null, tipo = "all",fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')), limit = 10, page=1, exportar=false} = options;

        var response = await fetch(`https://ads-service.vercel.app/campaigns-historical/events/${tipo}?fechai=${fechai}&fechaf=${fechaf}&page=${page}&limit=${limit}&idCampaign=${idCampaign}&userId=&title_page=${title_page}`);
        const data = await response.json();

        if(!exportar){
          dataRegistrosGroup.value = data.data;
          dataRegistrosGroupBackup.value = data.data;
        }else{
          return data.data;
        }

    } catch (error) {
        return console.error(error.message);    
    }
  }

  async function getDataAuditoriaGroupPage(options = {}){
    try {
        const {idCampaign = "", tipo = "all",fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')), limit = 10, page=1, exportar=false} = options;

        var response = await fetch(`https://ads-service.vercel.app/campaigns-historical/group/page/${idCampaign}?fechai=${fechai}&fechaf=${fechaf}&page=${page}&limit=${limit}&type=${tipo}&userId=`);
        const data = await response.json();

        if(!exportar){
          dataRegistrosGroup.value = data.data;
          dataRegistrosGroupBackup.value = data.data;
        }else{
          return data.data;
        }

    } catch (error) {
        return console.error(error.message);    
    }
  }

  watch(async () => selectedfechaIniFin.value, async () => {
    let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
    fecha.value = {
        i: selectedCombo.i,
        f: selectedCombo.f,
        title: selectedfechaIniFin.value
    }

    limit.value = selectedCombo.limit;

    if(selecCampaign.value){
    	loadingData.value = true;
	    await getDataAuditoriaGroupPage({
	      fechai: fecha.value.i.format("YYYY-MM-DD"),
	      fechaf: fecha.value.f.format("YYYY-MM-DD"),
	      limit: limit.value,
	      idCampaign: selecCampaign.value.value
	    });
	    loadingData.value = false;
    }
  });

  /*COMBO selecCampaign*/
  watch(async () => selecCampaign.value, async () => {
    loadingData.value = true;
    await getDataAuditoriaGroupPage({
      fechai: fecha.value.i.format("YYYY-MM-DD"),
      fechaf: fecha.value.f.format("YYYY-MM-DD"),
      limit: limit.value,
      idCampaign: selecCampaign.value.value
    });
    loadingData.value = false;
  });

  /*COMBO SELECT PERPAGE*/
  watch(async () => selectedOptionperPage.value, async () => {
    const datos = selectedOptionperPage.value;
    if(selectedOptionperPage.value){
      const seleccion = selectedOptionperPage.value.value;
      perPage.value = seleccion;
    }
  });

  /*COMBO ORDENAR*/
	watch(async () => selecOrdergroup.value, async () => {
	  const datos = dataRegistrosGroup.value;
	  if(selecOrdergroup.value){
	    const seleccion = selecOrdergroup.value.value;
	    const opcionSeleccionada = seleccion; // Puedes cambiar esto según la opción seleccionada
	    const datosOrdenados = [...datos].sort(comparador(opcionSeleccionada));
	    dataRegistrosGroup.value = datosOrdenados;
	  }else{
	    const datosOrdenados = [...datos].sort(comparador(1));
	    dataRegistrosGroup.value = datosOrdenados;
	  }
	  
	});

</script>
<template>
	<section>
		<VRow>
			<VCol class="mt-0" cols="12" md="12" lg="12" >
				<VCard class="px-2 py-0">
					<VCardItem class="header_card_item py-0 pt-4 align-start">
              <div class="d-flex pr-0" style="justify-content: space-between;">
                <div class="descripcion">
                  <!-- <VCardTitle class="pb-2">Análisis de campañas</VCardTitle> -->
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
                    <VCombobox :disabled="loadingData" v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint hide-selected hint="" />
                  </div>
                  <div style="min-width: 230px;width: auto;">
                    <VCombobox clearable density="compact" :disabled="loadingData" v-model="selecCampaign" :items="props.dataCampaigns" variant="outlined" label="Buscar por campaña" persistent-hint hide-selected hint="" />
                  </div>
                  <div style="min-width: 230px;width: auto;">
                    <VCombobox clearable density="compact" :disabled="loadingData" v-model="selecOrdergroup" :items="itemsOrdergroup" variant="outlined" label="Ordenar registros" persistent-hint
                      hide-selected hint="" />
                  </div>
              </div>
              <VDivider class="my-5" />
              <div class="item-limit">
                <label>Mostrar</label>
                <VSelect style="min-width: 90px;"
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
                <!-- 👉 Table head -->
                <thead class="text-uppercase">
                  <tr>

                    <th scope="col">
                      N
                    </th>


                    <th scope="col">
                      Título de Página
                    </th>
                    <th
                      scope="col"
                      class="text-center"
                    >
                      Impresiones
                    </th>

                    <th
                      scope="col"
                      class="text-center"
                    >
                      Click
                    </th>

                    <th scope="col">
                     Nombre de Campaña
                    </th>

                    <th scope="col">
                      Link/Descargar
                    </th>
                  </tr>
                </thead>

                <!-- 👉 Table Body -->
                <tbody>
                  <tr
                    v-for="(c, index) in paginatedDataGroup" :key="index"
                    style="height: 3.75rem;"
                  >
                  <td class="text-center">
                    {{index + 1}}
                  </td>
                    <!-- 👉 Page name -->
                    <td style="min-width: 17rem;max-width: 17rem;text-align: left;">
                      <VCardTitle class="px-0" :title="c.title" style="font-size: 18px;">
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
                        {{c.preview}}
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
                        {{c.click}}
                      </VChip>
                    </td>
                    <td>
                      <VChip color="success">
									      {{ c.idCampaign.title }}
									    </VChip>
                    </td>

                    <!-- 👉 Actions -->
                    <td class="text-center" style="width: 5rem;">

                      <VBtn
                      	:href="c.url" 
                      	target="_blank"
                      	variant="text"
									      color="info"
									      icon="mdi-link-variant"
									    />

                      <VBtn
                      	title="Descargar usuarios que interactuaron en esta página"
                      	variant="text"
									      :loading="loadingDownloadTable[index]"
									      :disabled="loadingDownloadTable[index]"
									      color="warning"
									      icon="mdi-account-arrow-down-outline"
									      @click="load(index, c.title)"
									    />
									    <VTooltip 
												open-on-click
												:open-on-hover="false"                                                      
												location="top"
												activator="parent"
												no-click-animation
												:disabled="!loadingDownloadTable[index]"
											>
											<span>Esta acción traerá todos los registros de la búsqueda y la carga puede demorar hasta 12 minutos, espere por favor</span>
											</VTooltip>  
                    </td>
                  </tr>
                </tbody>

                <!-- 👉 table footer  -->
                <tfoot v-show="!paginatedDataGroup.length">
                  <tr>
                    <td
                      colspan="8"
                      class="text-center text-body-1"
                    >
                      No hay datos que mostrar
                    </td>
                  </tr>
                </tfoot>
              </VTable>


              
              <!-- Paginación -->
              <VPagination class="mt-5" v-model="currentPage" :length="totalPages" :total-visible="7" />
          </div>
				</VCard>
			</VCol>
		</VRow>
	</section>
</template>