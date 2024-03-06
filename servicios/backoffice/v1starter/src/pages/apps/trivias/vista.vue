<script setup>
import tabBusqueda from "@/pages/apps/trivias/tabs/trivia_usuario_busqueda.vue";
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataTrivias = ref([]);
const isLoading = ref(false);
const currentTab = ref('tab-vista');
const searchTerm = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});
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
    isLoading.value = true; 
    await getTrivias();
    isLoading.value = false; 
})

//------------------- FUNCIONES  ---------------------

function copyUrl(id){
    navigator.clipboard.writeText('https://ecuavisa-desafio-trivias.vercel.app/trivia/get/' + id); 

    configSnackbar.value = {
    message: "Enlace copiado en el portapapeles",
    timeout: 1000,
    type: "success",
    model: true
    };  
}   

const reset = async () => {
  searchTerm.value = '';
  await getTrivias();
}

const startSearch = () => {
  currentPage.value = 1; 
  search();
};

const search = async () => {
  isLoading.value = true;
  
  try {
    
    const response = await fetch(`https://ecuavisa-desafio-trivias.vercel.app/trivia/search/name?nombre=${searchTerm.value}`);
    const data = await response.json();
    if (data.resp) {
      dataTrivias.value = data.data;
      
    } else {
      dataTrivias.value = [];   
      console.log("no hay nada para mostrar");
      //isSnackbarVisible.value = true;
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
  } finally {
    isLoading.value = false;
  }
};

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
      <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">  

      <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-vista">Vista</VTab>
          <VTab value="tab-busquedaUsuario">Usuarios</VTab>
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>
        
       
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-vista">
                

              <VRow>
                  <VCol cols="12" sm="12" lg="12">
                    
                     <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                          {{ configSnackbar.message }}
                      </VSnackbar>

                      <VCard class="mt-4">
                      <VCardTitle class="pt-4 pl-6">Listado de trivias</VCardTitle>   
                      <VCardItem>
                      <div class="d-flex gap-4 mt-2">
                      <VTextField v-model="searchTerm" @keyup.enter="startSearch" style="max-width: 400px;" label="Buscar..." />
                     
                      <VBtn :loading="isLoading" :disabled="isLoading" color="primary" size="small" icon="tabler-search"
                          @click="startSearch" />
                      <VBtn :disabled="isLoading" color="primary" size="small" icon="tabler-refresh"
                          @click="reset" />
                      </div>   
                      </VCardItem>  
                                 
                      
                      <VCardItem v-if="isLoading">
                      Cargando datos... 
                      </VCardItem>   
                      <VCardItem v-else-if="!isLoading && dataTrivias.length > 0">
                       
                      <VTable class="text-no-wrap tableNavegacion mb-5">
                          <thead>
                              <tr>   
                              <th scope="col">Nombre</th>
                              <th scope="col">Id de regla</th> 
                              <th scope="col">Endpoint</th>                                                                             
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
                              <td class="text-medium-emphasis">
                                <VBtn variant="text" icon  @click="copyUrl(item._id)">
                                    <VIcon size="22" icon="tabler-clipboard" />
                                </VBtn>
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
                      <VCardItem v-if="!isLoading && dataTrivias.length === 0">
                      No se han encontrado datos
                      </VCardItem>  
                      
                      </VCard>
                  </VCol>
                
              </VRow>
    
              </VWindowItem>

              <VWindowItem value="tab-busquedaUsuario">
                <tabBusqueda/>              
              </VWindowItem>

             
            </VWindow>
        

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