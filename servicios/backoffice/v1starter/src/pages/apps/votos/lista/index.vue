<script setup>
import { onMounted } from 'vue';

const dataVotos = ref([]);
const totalVotos = ref(0);

async function getTotalVotos (){
    try {
        const consulta = await fetch('https://ecuavisa-servicio-votacion.vercel.app/votacion/cantidad/total');
        const consultaJson = await consulta.json();
        //console.log(consultaJson);
        totalVotos.value = consultaJson.data.total;
    } catch (error) {
        console.error(error.message);
    }
} 

async function getdataVotacion (){
    try {

      var Arr = [];
      let page = 1;
      //let limit = 1000;
      while (true) {        
        const consulta = await fetch('https://ecuavisa-servicio-votacion.vercel.app/votacion/get/users/all?page='+page);
        const consultaJson = await consulta.json();
        const data = consultaJson.data;
        if (data.length === 0) {
                break;
        }
        Arr.push(...data);
        dataVotos.value = Array.from(Arr);    
        page += 1;          
      }


    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    await getTotalVotos();
    await getdataVotacion();
})
const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedDataVotos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataVotos.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataVotos.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

</script>

<template>
    <section>
        <VRow>
            <VCol cols="12" sm="6" lg="3">
                <VCard>
                <VCardText class="d-flex justify-space-between">
                <div>
                <span>Cantidad de votos totales</span>
                <div class="d-flex align-center gap-2 my-1">
                    <h6 class="text-h6">
                    {{ totalVotos }}
                    </h6>          
                </div>
                </div>
                </VCardText>
                </VCard>
            </VCol>

        </VRow>
        <VRow>
            <VCol cols="12" sm="12" lg="12">
                <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de votos</VCardTitle>   

                <VCardItem v-if="dataVotos.length > 0">
                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                    <thead>
                        <tr>                          
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Estado del voto</th>
                        <th scope="col">Cantidad de votos</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedDataVotos">
                        <td class="text-medium-emphasis">
                            {{ item.first_name}} {{ item.last_name}}
                        </td>      
                        <td class="text-medium-emphasis">
                            {{ item.email}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.estadoVoto}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.cantidadVotos}}
                        </td>                     
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                Página {{ currentPage }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                    :disabled="(currentPage * itemsPerPage) >= dataVotos.length">
                </VBtn>
                </div>
                </VCardItem>  
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>      
                </VCard>
            </VCol>
        </VRow>

    </section>
</template>