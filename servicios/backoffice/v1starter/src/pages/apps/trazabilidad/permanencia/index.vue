<script setup>
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

onMounted(getCampaigns)
// para definir una fecha especifica se la coloca dentro de moment así -- moment('2024-01-04').format('YYYY-MM-DD')
async function getCampaigns(page = (moment().format('YYYY-MM-DD')), limit= 10){
  try {
      var response = await fetch(`https://servicio-permanencia.vercel.app/get/document/${page}/${page}`);
      const data = await response.json();
      dataRegistros.value = data.data;
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
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;" >
                  <div>
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
                      <VListItemTitle> {{ c.user.first_name }} {{ c.user.last_name }} <VChip> estuvo {{ calcularDiferencia(c.inicio,c.fin) }}  </VChip> </VListItemTitle>
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
                <VPagination v-model="currentPage" :length="totalPages" />
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



