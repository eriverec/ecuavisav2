<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted, ref } from 'vue';

const tab = ref('tab-a')
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const itemsPerPage = 8;
const currentPage = ref(1);

const recomendadas = ref([]);
const isLoading = ref(false);
const fechaIngresada = ref('');
const fechaIni = ref('');
const fechaFin = ref('');
const notasUsuarios = ref([]);
const usuariosVisible = ref(false);
const titleSelected = ref('');
const selectedRow = ref(null);
const verMas = ref(false);
const recomendadasRaw = ref([]);

async function getRecomendadas(fechai = '', fechaf = '') {
  isLoading.value = true;
  await fetch('https://servicio-de-actividad.vercel.app/recomendadas/get?' + new URLSearchParams({ fechai: fechai, fechaf: fechaf }))
    .then(response => response.json())
    .then(data => {
      recomendadasRaw.value = data;
      const rawArray = Array.from(data);
      let grupos = {};
      for(let i of rawArray){
        for(let j of i.data){      
          let clave = j.title;
          let data = {
            userId: i.userId,
            created_at: i.created_at,
            title: j.title,
            cantidad: 1
          }
          if (grupos.hasOwnProperty(clave) && grupos[clave].userId !== i.userId ) {   
            grupos[clave] = data;   
            grupos[clave].cantidad = (grupos[clave].cantidad || 1) + 1;
          } else {
            grupos[clave] = data;
          }
        }
      }
      let resultado = Object.values(grupos);
      recomendadas.value = resultado;
      isLoading.value = false;
    })
    .catch(error => { return error });
}

const initData = async() => {
  let fechai = moment().subtract(7, 'days').format("DD-MM-YYYY").toString();
  let fechaf = moment().format("DD-MM-YYYY").toString();
  let fechaI = moment(fechai).format('YYYY-MM-DD');
  let fechaF = moment(fechaf).format('YYYY-MM-DD');
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
  await getRecomendadas(fechaI, fechaF);
}

onMounted(() => {
  initData();
});

const paginatedRecomendadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return recomendadas.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < recomendadas.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

async function obtenerPorFechaRecomendadas(selectedDates) {
  try {
    if (selectedDates.length > 1) {
      console.log('selectedDates', selectedDates)
      currentPage.value = 1;
      let fechaI = moment(selectedDates[0]).format('YYYY-MM-DD');
      let fechaF = moment(selectedDates[1]).format('YYYY-MM-DD');
      fechaIni.value = fechaI;
      fechaFin.value = fechaF;
      await getRecomendadas(fechaI, fechaF);                   
    }
  } catch (error) {
    console.error(error);
  }
}

async function resolveUsuarios(titulo){
  titleSelected.value = titulo;
  let rawArray = Array.from(recomendadasRaw.value);
  let grupos = {};
      for(let i of rawArray){
        for(let j of i.data){     
          if(j.title == titulo){
              let data = {
              userId: i.userId,
              first_name: i.first_name,
              last_name: i.last_name,
              created_at: i.created_at,
              fecha: moment(i.created_at).format('DD/MM/YYYY'),
              hora: moment(i.created_at).format('HH:mm:ss')
              }
              let clave = i.userId;     
          if (!grupos.hasOwnProperty(clave)) {   
            grupos[clave] = data;   
          }            
          }
        }
      }
  let resultado = Object.values(grupos);    
  notasUsuarios.value = resultado;    
  usuariosVisible.value = true;
}
</script>

<template>
  <div>
    <VTabs v-model="tab">
      <VTab value="tab-a">
        Recomendadas
      </VTab>
      <VTab value="tab-b">
        Por usuario
      </VTab>
      <!-- <VTab value="account-details">
        Account Details
      </VTab>
      <VTab value="social-links">
        Social Links
      </VTab> -->
    </VTabs>


    <br>

    <VWindow v-model="tab">
      <VWindowItem value="tab-a">

        <VRow>
          <VCol lg="6" cols="12" sm="6">
            <!-- <VDialog v-model="isLoading" width="300">
              <VCard color="primary" width="300">
                <VCardText class="pt-3">
                  Espere porfavor
                  <VProgressLinear indeterminate color="white" class="mb-0" />
                </VCardText>
              </VCard>
            </VDialog> -->

            <VCard>



              <VCardText class="d-flex flex-wrap justify-space-between gap-4">

                <VCardItem class="pb-sm-0 pl-0 pt-0">
                  <VCardTitle>Notas recomendadas</VCardTitle>
                  <VCardSubtitle>Un total de {{ recomendadas.length }} registros</VCardSubtitle>
                </VCardItem>

                <div class="date-picker-wrapper" style="width: 300px;" v-if="!isLoading">
                  <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngresada"
                    show-current=true @on-change="obtenerPorFechaRecomendadas" :config="{
                      position: 'auto right',
                      mode: 'range',
                      altFormat: 'F j, Y',
                      dateFormat: 'd-m-Y',
                      maxDate: new Date(),
                      reactive: true

                    }" />
                </div>
                <!-- botonera de filtros guardados ##estado desactivado##-->
                <!--
        <VCol cols="12">
  
  <VBtnToggle v-if="!isLoading"   
        v-model="btnFiltros"
        color="primary"
        class="d-none"
        divided
      >
   <VBtn :value="item._id" @click="resolveFiltroSelection(item._id)" v-for="item  in filtrosVisitas">
    {{ item.nombre }}
   </VBtn>

   </VBtnToggle>

    </VCol>
  -->
              </VCardText>
            
              <VCardText v-if="isLoading">Cargando datos...</VCardText>
              <VCardText v-else>
                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">TÍTULO</th>
                      <th scope="col">USUARIOS</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="item  in paginatedRecomendadas" class="clickable" :class="{ active: item._id === selectedRow }"
                      @click="resolveUsuarios(item.title)">
                      <td>
                        {{ item.title }}
                      </td>

                      <td class="text-medium-emphasis">
                        {{ item.cantidad }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                  Página {{ currentPage }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                    :disabled="(currentPage * itemsPerPage) >= recomendadas.length">
                  </VBtn>
                </div>

              </VCardText>
            </VCard>
          </VCol>

          <VCol lg="6" cols="12" sm="6">
          
            <VExpandTransition>
              <VCard v-show="usuariosVisible" >
                <VCardItem class="pb-sm-0">
                  <div style="display: flex; flex-wrap: wrap;">
                    <div style="width: max-content;">
                      <VCardTitle>Usuarios de la nota: {{ titleSelected }}</VCardTitle>
                    </div>
                  </div>

                  <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                    <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="item  in notasUsuarios">
                        <td class="text-high-emphasis">
                          {{ item.first_name }} {{ item.last_name }}
                        </td>       
                        <td class="text-medium-emphasis">
                          {{ item.fecha }}     
                        </td>
                        <td class="text-medium-emphasis">
                          {{ item.hora }}
                        </td>         
                      </tr>
                    </tbody>
                  </VTable>
                </VCardItem>
              </VCard>
            </VExpandTransition>
          </VCol>
        </VRow>



      </VWindowItem>

      <VWindowItem value="account-details">
  
      </VWindowItem>
      <!-- <VWindowItem value="account-details">
            Soy detalis  ssss
          </VWindowItem>

          <VWindowItem value="social-links">
            Soy social sdddsdd
          </VWindowItem> -->
    </VWindow>


  </div>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}

</style>
  