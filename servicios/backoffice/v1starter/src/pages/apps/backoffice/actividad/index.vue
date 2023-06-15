<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
    
const dataGestores = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const isLoading = ref(true);
const dataActividad = ref([]);
const actividadVisible = ref(false);
const actividadLoading = ref(true);
const selectedUsuario = ref('');

async function getGestores(){
    isLoading.value = true;
    await fetch ('https://gestores-flax.vercel.app/all')
    .then(result => result.json())
    .then(data => {
        dataGestores.value = data; 
        isLoading.value = false;
    });
}

onMounted(getGestores);

const paginatedData = computed(() => {	
    const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	let dataF = dataGestores.value.slice(start, end);
	totalPages.value = Math.ceil(dataGestores.value.length / itemsPerPage.value);
	//filteredData =  catag_list;
	return dataF;
});

async function resolveActividad(email){
  selectedUsuario.value = email;  
  actividadLoading.value = true; 
  await fetch('https://servicio-logs.vercel.app/lista?email='+ email)
  .then(respuesta => respuesta.json())
  .then(data=>{
    let dataRaw = Array.from(data);

    //console.log('data',dataRaw);

    dataRaw.sort((a, b) => {
    var timestampA = new Date(moment(a.fecha, "DD/MM/YYYY HH:mm:ss").format());
    var timestampB = new Date(moment(b.fecha, "DD/MM/YYYY HH:mm:ss").format());
    
    return  timestampB - timestampA;
    });

    dataActividad.value = dataRaw.slice(0,30);
    actividadVisible.value = true;
    actividadLoading.value = false; 
  })
}


</script>

<template>
<VRow>
    <VCol cols="12" >
    <!-- trazabilidad independiente -->
    
      <VCard >
    
        <VCardItem class="pb-sm-0" >            
            <VCardTitle>Usuarios backoffice</VCardTitle>  
        </VCardItem>
          <VCardItem class="pb-sm-0"> 
          <VCardText v-if="isLoading">Cargando información...</VCardText>
          <VCardText v-else> 
          <VTable class="text-no-wrap tableNavegacion" hover="true">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>    
           
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in paginatedData" class="clickable" @click="resolveActividad(user.email)">
                <td >
                  {{ user.fullName}} 
                </td>
                <td >
                  {{ user.email }} 
                </td>
                <td>
                  {{ user.role}} 
                </td>   
           
              </tr>
            </tbody>
          </VTable>
          <VDivider />

<div class="px-4 py-4 mt-5">
    <v-btn
        :disabled="currentPage === 1"
        @click="currentPage -= 1"
        size="small"
        color="primary"
    >
        Anterior
    </v-btn>
    <span class="px-2"
        >{{ currentPage }} de {{ totalPages }} de un total de
        {{ dataGestores.length }} registros</span
    >

    <v-btn
        :disabled="currentPage === totalPages"
        @click="currentPage += 1"
        size="small"
        color="primary"
    >
        Siguiente
    </v-btn>
</div>
       
        </VCardText>
        </VCardItem>
      </VCard>
    </VCol>
    <VCol cols="12" >
    <!-- trazabilidad independiente -->
    <VExpandTransition>
      <VCard v-show="actividadVisible" >
        <VCardItem class="pb-sm-0" >    
        <div style="display: flex; flex-wrap: wrap;">   
          <div style="margin-right: auto;">
        <VCardTitle >Actividad del usuario {{ selectedUsuario }}</VCardTitle>
       
        </div>
        <!--
          <div style="margin-left: auto;">
          <VBtn 
            color="primary"							
            @click="downloadSelection"
            >
            Exportar
          </VBtn>
        </div>
        -->
    </div> 
        </VCardItem>
          <VCardItem class="pb-sm-0" v-if="dataActividad.length == 0">
            <VCardText>No existe actividad</VCardText>
        </VCardItem>
          <VCardItem class="pb-sm-0" v-else> 
          <VCardText v-if="actividadLoading">Cargando usuarios...</VCardText>
          <VCardText v-else> 

            <VTimeline
            density="compact"
            align="start"
            truncate-line="both"
            class="v-timeline-density-compact"
          > 
            <VTimelineItem dot-color="primary" size="x-small"
            v-for="item in dataActividad">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <h4 class="text-base font-weight-semibold me-1">
                  {{ item.accion || '' }} {{ item.pagina }}
                </h4>
                      
              </div>

              <p class="mb-1">{{ item.fecha}}</p>
            
            </VTimelineItem>
          </VTimeline>
        </VCardText>
        </VCardItem>
      </VCard>
    </VExpandTransition>
    </VCol>
</VRow>
</template>
<style scoped>
.clickable { cursor: pointer; }
@media (max-width: 1000px) {
  td span {
    max-width: 200px;
  }
}
</style>