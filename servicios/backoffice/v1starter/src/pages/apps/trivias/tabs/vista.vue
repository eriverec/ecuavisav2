<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataTrivias = ref([]);
const isLoading = ref(false);
const isLoading2 = ref(false);

async function getTrivias (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://ecuavisa-desafio-trivias.vercel.app/trivia/all/get');
      const consultaJson = await consulta.json();
      dataTrivias.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 


onMounted(async()=>{
    isLoading2.value = true;
    await getTrivias();
    isLoading2.value = false;
})

const itemsPerPage = 20;
const currentPage = ref(1);

const paginatedTrivias = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataTrivias.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataTrivias.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};


</script>

<template>
    <section>
        
            <VDialog v-model="isLoading2" persistent no-click-animation width="300">
                <VCardText class="pt-3 text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </VCardText>
            </VDialog>

            <VRow>
                <VCol cols="12" sm="12" lg="12">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Listado de trivias</VCardTitle>   
                                   
                    <VCardItem v-if="isLoading">
                    Cargando datos... 
                    </VCardItem>   
                    <VCardItem v-else>
                    <VTable class="text-no-wrap tableNavegacion mb-5">
                        <thead>
                            <tr>   
                            <th scope="col">Nombre</th>
                            <th scope="col">Id de regla</th>                                                 
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in paginatedTrivias">
                            <td class="text-medium-emphasis">
                                {{ item.nombre}}
                            </td>     
                            <td class="text-medium-emphasis">
                                {{ item.idRegla}}
                            </td>                         
                            </tr>
                        </tbody>
                    </VTable>
                    <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                    Página {{ currentPage }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                        :disabled="(currentPage * itemsPerPage) >= dataTrivias.length">
                    </VBtn>
                    </div>
                    </VCardItem>  
                    
                    </VCard>
                </VCol>
              
            </VRow>

            
      
             
             
    </section>
</template>

<style>  
 
.clickable {
  cursor: pointer;
}

.item-cards {
  background:  rgba(var(--v-border-color), var(--v-hover-opacity));
  box-shadow: none !important;
  border-radius: 6px;
}

.item-cards-small {
  background:  rgba(var(--v-border-color), var(--v-hover-opacity));
  box-shadow: none !important;
  border-radius: 2px;
}

.boton-eleminar-itemsCards{
    height: 38px;
    width: 38px;
    display: block;
    margin: -11px;
}

.v-theme--light .item-cards{
   background:   #f2f2f2;
}

.v-theme--light.v-field{
    background: #fff;
}
.v-card-text{
    padding: 0px 10px;
}

@media screen and (max-width: 1000px) {
  .container {
   min-width: 90svw; 
  }
  .mdContainer {
    min-width: 100px;  
  }
}
.open.flatpickr-calendar {
    z-index: 100000;
}

</style>