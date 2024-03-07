<script setup>
import 'vue3-form-wizard/dist/style.css';

const dataTrivias = ref([]);
const isLoading = ref(false);
const triviaLoading = ref(false);
const searchTerm = ref('');
const busquedaTriviaVisible = ref(false);
const formVisible = ref(false);
const triviaSelected = ref('');
const dataTriviaSelected = ref({});
const dataTriviaSelectedCorrect = ref({});
const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const itemsPerPage = 8;
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

//------------------- FUNCIONES  ---------------------

const reset = async () => {
  formVisible.value = false;
  busquedaTriviaVisible.value = false;
  searchTerm.value = '';
}

const startSearch = () => {
  formVisible.value = false;
  currentPage.value = 1; 
  search();
  busquedaTriviaVisible.value = true;
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

const handleUserClick = async (id, title) => {

  triviaSelected.value = title;
  formVisible.value = true;
  triviaLoading.value = true;
  
  try {
    const response = await fetch(`https://ecuavisa-desafio-trivias.vercel.app/trivia/get/${id}`);
    const data = await response.json();
    if (data.resp && data.data) {
      dataTriviaSelectedCorrect.value = data.data;
      let dataTrivia = data.data;
      console.log(dataTrivia.preguntas);
      dataTrivia.preguntas.forEach(pregunta => {
        pregunta.respuesta = '';
      });
      dataTriviaSelected.value = dataTrivia;

      
    } else {
      dataTriviaSelected.value = null;
    }
  } catch (error) {
    console.error('Error al obtener detalles de la trivia:', error);
    dataTriviaSelected.value = null;
  } finally {
    triviaLoading.value = false;
    
  }
};




</script>

<template>
    <section>
      <VRow>
                  <VCol cols="12" sm="12" lg="12">
                    
                     <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                          {{ configSnackbar.message }}
                      </VSnackbar>

                      <VCard class="mt-4">
                      <VCardTitle class="pt-4 pl-6">Buscar trivia a completar</VCardTitle>   
                      <VCardItem>
                      <div class="d-flex gap-4 mt-2">
                      <VTextField v-model="searchTerm" @keyup.enter="startSearch" style="max-width: 400px;" label="Buscar..." />
                     
                      <VBtn :loading="isLoading" :disabled="isLoading" color="primary" size="small" icon="tabler-search"
                          @click="startSearch" />
                      <VBtn :disabled="isLoading" color="primary" size="small" icon="tabler-refresh"
                          @click="reset" />
                      </div>   
                      </VCardItem>  
                                 
                      
                      <VCardItem v-if="isLoading && busquedaTriviaVisible">
                      Cargando datos... 
                      </VCardItem>   
                      <VCardItem v-else-if="!isLoading && busquedaTriviaVisible && dataTrivias.length > 0">
                       
                      <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                          <thead>
                              <tr>   
                              <th scope="col">Nombre</th>
                              <th scope="col">Id de regla</th> 
                                                                                                       
                              </tr>
                          </thead>

                          <tbody>
                              <tr v-for="item in paginatedTrivias" @click="handleUserClick(item._id, item.nombre)" class="clickable">
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
                      <VCardItem v-if="!isLoading && busquedaTriviaVisible && dataTrivias.length === 0">
                      No se han encontrado datos
                      </VCardItem>  
                      
                      </VCard>
                  </VCol>

                  <VCol v-if="formVisible" cols="12" sm="12" lg="12">
                    <VCard v-if="triviaLoading" class="mt-4">                    
                      <VCardItem>
                      Cargando datos...
                      </VCardItem>  
                    </VCard>
                    <VCard v-else-if="!triviaLoading && dataTriviaSelected" class="mt-4">
                      <VCardTitle class="pt-4 pl-6">{{ triviaSelected }}</VCardTitle>   
                      <VCardItem>
                        <VCardText>
                        <!-- 👉 Form -->
                        <VForm class="mt-6" @submit.prevent="onComplete">
                            <VRow class="d-flex flex-wrap justify-center gap-4">
                                <VRow>
                                                                    
                                      
                                  
                                    <VCol v-for="(p, index) in dataTriviaSelected.preguntas" cols="12" class="w-100" > 
                                           
                                      <VCardText>
                                            <VCol cols="12">
                                               <h4>{{ index+1 }}. {{p.pregunta }}</h4> 
                                            </VCol>     
                                            
                                            <VCol v-if=" p.tipo == 'opciones' || p.tipo == 'votacion'" cols="12" >
                                              <h5>Seleccione la opción correcta:</h5>   
                                            </VCol> 

                                            <VCol cols="12" v-if= "p.tipo == 'texto'">
                                                <VTextField  v-model="p.respuesta" label="Respuesta" placeholder="Escriba la respuesta correcta" />
                                            </VCol>
             
                                            

                                            <div v-if="p.tipo == 'opciones'|| p.tipo == 'votacion'"  cols="12" > 
                                                                              
                                                <VCardText class="text-center ml-4 my-4">
                                                  <VRadioGroup v-model="p.respuesta">
                                                    <VRadio v-for="(o, index1) in p.opciones"
                                                      :label="p.opciones[index1]"
                                                      :value="p.opciones[index1]"
                                                    />                         
                                                  </VRadioGroup>
                                                                                                                                                      
                                                </VCardText>  
        
                                            </div>

                                          
                                    </VCardText>
                                    <VDivider class="mt-6" v-if="index != dataTriviaSelected.preguntas.length-1" />
                                  </VCol>                    
                                </VRow>
                                <!-- 👉 Submit and Cancel -->
                                <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                                    <VBtn type="submit"> Completar </VBtn>

                                    
                                </VCol>
                            </VRow>
                        </VForm>
                        </VCardText>
                      </VCardItem>  
                    </VCard>               
                    <VCard v-else class="mt-4">                    
                      <VCardItem>
                      No se han encontrado datos
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