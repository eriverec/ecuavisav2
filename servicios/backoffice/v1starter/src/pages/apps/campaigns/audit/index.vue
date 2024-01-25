<script setup>
  import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
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
  const loadingData = ref(false);
  const loadingCombo = ref(false);
  const disabledViewList = ref(false);
  const selectedfechaIniFin = ref('Hoy');
  const fechaIniFinList = useSelectCalendar();
  const limit = ref(valoresHoy.limit);
  const currentPage = ref(1); // Página actual
  const perPage = ref(15); // Registros por página
  const itemsTypeEvent = ref([
                        {title:'Todos los eventos',value:"all"},
                        {title:'Usuarios que vieron la publicidad',value:"preview"},
                        {title:'Usuarios que dieron click en la publicidad',value:"click"},
                      ]);
  const selecTypeEvent = ref(null);

  const dataRegistros = ref([]);
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

  async function getDataAuditoria(options = {}){
    try {
        const {tipo = "all",fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')), limit = 10} = options;

        var response = await fetch(`https://ads-service.vercel.app/campaigns-historical/events/${tipo}?fechai=${fechai}&fechaf=${fechaf}&page=1&limit=${limit}&idCampaign=&userId=`);
        const data = await response.json();

        dataRegistros.value = data.data;
        dataRegistrosBackup.value = data.data;

        console.log(dataRegistros.value)

    } catch (error) {
        return console.error(error.message);    
    }
  }

  onMounted(getDataAuditoria)

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
    console.log(selecTypeEvent.value)
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

</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-0" cols="12" md="6" lg="7" >
        <VCard class="px-2 py-2">
            <VCardItem class="header_card_item py-0 pt-4">
              <div class="d-flex pr-0" style="justify-content: space-between;">
                <div class="descripcion">
                  <VCardTitle class="pb-2">Auditoría de eventos por página</VCardTitle>
                  <VCardSubtitle>*Mostrando data desde, {{fecha.i.format('YYYY-MM-DD')}} hasta {{fecha.f.format('YYYY-MM-DD')}}</VCardSubtitle>
                  <VCardSubtitle>*Este informe se basa en una muestra de {{limit}} registros</VCardSubtitle>
                </div>
              </div>
              <div class="bg-ecuavisa py-4 d-flex gap-4">
                  <div class="date-picker-wrappe" style="width: 180px;">
                    <VCombobox :disabled="loadingData" v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint hide-selected hint="" />
                  </div>
                  <div style="min-width: 230px;width: auto;">
                    <VCombobox clearable density="compact" :disabled="loadingData" v-model="selecTypeEvent" :items="itemsTypeEvent" variant="outlined" label="Buscar por evento" persistent-hint
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
            </VCardItem>
              <!-- listado de datos -->
              <div class="px-5 py-2">
                <VList lines="two" border  v-if="dataRegistros.length > 0" class="p-0 m-0">
                  <template v-for="(c, index) in paginatedData" :key="index" >
                    <VListItem :disabled="disabledViewList" class="py-1">
                      <VListItemTitle>{{ c.title }} </VListItemTitle>
                      <VListItemSubtitle class="mt-1" title="Estado de campaña">
                        <span class="text-xs text-primary pl-2"> 
                          <VIcon icon="mdi-user" /> {{ c.firstUser.firstname || "Not Found" }} {{ c.firstUser.last_name || "" }}, 
                          <VChip size="x-small"> {{ moment(c.created_at).format("YYYY-MM-DD, HH:mm:ss") }} </VChip>, 
                          <VChip color="success">
                            event: {{c.type}}
                          </VChip>
                        </span>
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
                <!-- Paginación -->
                <VPagination class="mt-5" v-model="currentPage" :length="totalPages" :total-visible="7" />
                <br>
              </div>
          </VCard>
      </VCol>
      <VCol class="mt-0" cols="12" md="6" lg="4" >
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

  .item-limit{
    max-width: 210px;
    display: flex;
    font-size: 15px;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }
</style>