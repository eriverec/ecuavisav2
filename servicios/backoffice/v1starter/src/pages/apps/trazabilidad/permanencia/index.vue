<script setup>
import Moment from 'moment'; // para las fechas
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const currentTab = ref('tab-lista');
const dataRegistros = ref([]);
const currentPage = ref(1);
const totalRegistros = ref(1);
const disabledPagination = ref(false);
const disabledViewList = ref(false);



onMounted(getCampaigns)
// para definir una fecha especifica se la coloca dentro de moment así -- moment('2024-01-04').format('YYYY-MM-DD')
async function getCampaigns(page = (moment().format('YYYY-MM-DD')), limit= 10){
  try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      var response = await fetch(`https://servicio-permanencia.vercel.app/get/document/${page}/${page}`, requestOptions);
      const data = await response.json();
      dataRegistros.value = data.data;
      // totalRegistros.value = Math.ceil(data.total / data.limit);
  } catch (error) {
      return console.error(error.message);    
  }
}

// Función de paginado
const handlePaginationClick = async () => {
  disabledPagination.value = true;
  await getCampaigns(currentPage.value)
  disabledPagination.value = false;
};

function calcularDiferencia(horaInicio, horaFin) {
    const inicio = horaInicio.split(':');
    const fin = horaFin.split(':');
    // Convertir horas y minutos a segundos
    const segundosInicio = parseInt(inicio[0]) * 3600 + parseInt(inicio[1]) * 60 + parseInt(inicio[2]);
    const segundosFin = parseInt(fin[0]) * 3600 + parseInt(fin[1]) * 60 + parseInt(fin[2]);
    // Calcular la diferencia en segundos
    let diferencia = segundosFin - segundosInicio;
    // Si la diferencia es negativa, sumamos 24 horas (en segundos)
    if (diferencia < 0) {
      diferencia += 24 * 3600;
    }
    // Convertir la diferencia en segundos a horas, minutos y segundos
    const horas = Math.floor(diferencia / 3600);
    const minutos = Math.floor((diferencia % 3600) / 60);
    const segundos = diferencia % 60;
    if (minutos.length > 0){
      return `${horas} horas, ${minutos} minutos y ${segundos} segundos`;
    }else {
      return `${minutos} minutos y ${segundos} segundos`;
    }
    
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
                  <template v-for="(c, index) of dataRegistros" :key="index" >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle> {{ c.user.first_name }} {{ c.user.last_name }} <VChip> estuvo {{ calcularDiferencia(c.inicio,c.fin) }}  </VChip> </VListItemTitle>
                      <VListItemSubtitle class="mt-1" title="Estado de campaña">
                        <!-- <span class="text-xs text-disabled">
                          <i> Fecha de Inicio: {{ moment(c.f_inicio).format("YYYY-MM-DD HH:mm:ss") }} </i>
                        </span> -->

                        <span class="text-xs text-primary pl-2">
                          <VIcon icon="mdi-web" />: {{ c.title }}
                        </span>
                      </VListItemSubtitle>

                      <template #append>
                        <div class="espacio-right-2">
                          
                          <VBtn icon size="x-small" color="info" variant="text" href="{{ c.url }}" target="_blank" >
                          <!-- <RouterLink :to="{ name: 'apps-campaigns-edit-id', params: { id: c._id }, }" class="font-weight-medium user-list-name" >
                            --> <VIcon size="22" icon="tabler-eye" /> 
                          <!--</RouterLink> -->
                          </VBtn>
                        </div>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== dataRegistros.length - 1" />
                  </template>
                </VList>
                <!-- <VPagination :disabled="disabledPagination" v-model="currentPage" :length="totalRegistros" class="mt-4" @click="handlePaginationClick" /> -->
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



