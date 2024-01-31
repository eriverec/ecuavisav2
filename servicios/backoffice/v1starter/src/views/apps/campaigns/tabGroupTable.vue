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

  const itemsPage = [{ title: '10', value: 10 },
    { title: '30', value: 30 },
    { title: '50', value: 50 },
    { title: '100', value: 100 },
    { title: '200', value: 200 }]

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
		                      <VCombobox clearable density="compact" :disabled="loadingData" v-model="selecTypeEvent" :items="itemsTypeEvent" variant="outlined" label="Buscar por evento" persistent-hint
		                        hide-selected hint="" />
		                    </div>
		                    <div style="min-width: 230px;width: auto;">
		                      <VCombobox clearable density="compact" :disabled="loadingData" v-model="selecCampaign" :items="props.dataCampaigns" variant="outlined" label="Buscar por campaña" persistent-hint hide-selected hint="" />
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
		            </div>
				</VCard>
			</VCol>
		</VRow>
	</section>
</template>