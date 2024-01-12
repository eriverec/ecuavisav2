<script setup>
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
import Moment from 'moment'; // para las fechas
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
const currentTab = ref('tab-lista');
const dataRegistros = ref([]);
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

const selectOrder = ref('');
const selectSeccion = ref('');
const itemsSeccion = ref([]);
const itemsOrder = ref([
                        {title:'Ordenar ASC por nombre de usuario',value:1},
                        {title:'Ordenar DESC por nombre de usuario',value:2},
                        {title:'Ordenar ASC por fecha de registro',value:3},
                        {title:'Ordenar DESC por fecha de registro',value:4},
                        {title:'Ordenar ASC por tiempo de permanecia',value:5},
                        {title:'Ordenar DESC por tiempo de permanecia',value:6},
                      ]);


onMounted(getCampaigns)
// para definir una fecha especifica se la coloca dentro de moment así -- moment('2024-01-04').format('YYYY-MM-DD')
async function getCampaigns(options = {}){
  try {
      const {tipo = "fecha", section="",fechai = (moment().format('YYYY-MM-DD')), fechaf = (moment().format('YYYY-MM-DD')), limit = 10} = options;
      var response = await fetch(`https://servicio-permanencia.vercel.app/get/section/${fechai}/${fechaf}?section=${section}`);
      const data = await response.json();

      dataRegistros.value = data.data;

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

function calcularDiferencia(horaInicio, horaFin) {
    const inicio = horaInicio.split(':');
    const fin = horaFin.split(':');
    // Convertir horas y minutos a segundos
    const segundosInicio = parseInt(inicio[0]) * 3600 + parseInt(inicio[1]) * 60 + parseInt(inicio[2]);
    const segundosFin = parseInt(fin[0]) * 3600 + parseInt(fin[1]) * 60 + parseInt(fin[2]);
    // Calcular la diferencia en segundos
    let diferencia = segundosFin - segundosInicio;
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

  loadingData.value = true;
  await getCampaigns({
    limit:10,
    fechai: fecha.value.i.format("YYYY-MM-DD"),
    fechaf: fecha.value.f.format("YYYY-MM-DD"),
    tipo:"fecha"
  });
  loadingData.value = false;

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
    tipo:"section"
  });
  loadingData.value = false;
});

function comparador(opcion) {
  switch (opcion) {
    case 1:
      return (a, b) => a.user.first_name > b.user.first_name ? 1 : -1;
    case 2:
      return (a, b) => b.user.first_name > a.user.first_name ? 1 : -1;
    case 3:
      return (a, b) => new Date(a.timestamp) - new Date(b.timestamp);
    case 4:
      return (a, b) => new Date(b.timestamp) - new Date(a.timestamp);
    case 5:
      return (a, b) => a.seconds - b.seconds;
    case 6:
      return (a, b) => b.seconds - a.seconds;
    default:
      return null;
  }
}

/*COMBO SECCION*/
watch(async () => selectOrder.value, async () => {
  const seleccion = selectOrder.value.value;
  const opcionSeleccionada = seleccion; // Puedes cambiar esto según la opción seleccionada

  const datos = dataRegistros.value;
  const datosOrdenados = [...datos].sort(comparador(opcionSeleccionada));
  dataRegistros.value = datosOrdenados;
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

                    <div style="min-width: 230px;width: auto;display: none;">
                      <VCombobox clearable density="compact" :disabled="loadingData" v-model="selectOrder" :items="itemsOrder" variant="outlined" label="Ordenar registros" persistent-hint
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
                  <!-- listado de datos -->
                  <VList lines="two" border  v-if="dataRegistros.length > 0">
                  <template v-for="(c, index) in paginatedData" :key="index" >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle> {{ c.user.first_name || "Not Found" }} {{ c.user.last_name || "" }} <VChip> estuvo {{ calcularDiferencia(c.inicio,c.fin) }}  </VChip> </VListItemTitle>
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
                <!-- fin lista usuarios -->
                <!-- Paginación -->
                <VPagination v-model="currentPage" :length="totalPages" :total-visible="7" />
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



