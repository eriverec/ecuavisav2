<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataDesafios = ref([]);
const isLoading = ref(false);
const searchTerm = ref('');
const disabledPagination = ref(false);
const totalRegistros = ref(1);
const currentPage = ref(1);

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

async function getDesafios(page= 1, limit = 10){
    try {
      isLoading.value = true;  
      const consulta = await fetch(`https://servicio-niveles-puntuacion.vercel.app/historico-desafio-logrados/all?page=${page}&limit=${limit}`);
      const consultaJson = await consulta.json();
      dataDesafios.value = consultaJson.data;        
      totalRegistros.value = Math.ceil(consultaJson.total / consultaJson.limit);     
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    isLoading.value = true; 
    await getDesafios();
    isLoading.value = false; 
})



//------------------- FUNCIONES  ---------------------

const nombreUsuarioVisible = ref([]);

const isLoadingDesafiosUser = ref(false);
const isDesafiosUserVisible = ref(false);
const desafiosUser = ref([]);
const userSelected = ref({
  nombre: '',
  id: 0
});

const disabledPaginationDesafiosUser = ref(false);
const totalRegistrosDesafiosUser = ref(1);
const currentPageDesafiosUser = ref(1);


async function onClickDesafiosUser(id){
  const dataUser = await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=' + id);
  const dataUserJson = await dataUser.json();
  userSelected.value.nombre = dataUserJson.first_name + ' ' + dataUserJson.last_name;
  userSelected.value.id = id;
  await getDesafiosUser(id);
}
async function getDesafiosUser(id, page = 1, limit = 10){
    try {
      isLoadingDesafiosUser.value = true;
      const consulta = await fetch(`https://servicio-niveles-puntuacion.vercel.app/historico-desafio-logrados/userid?userId=${id}&page=${page}&Limit=${limit}`);
      const consultaJson = await consulta.json();
      desafiosUser.value = consultaJson.data;
      totalRegistrosDesafiosUser.value = Math.ceil(consultaJson.total / consultaJson.limit);
      //console.log('clicked',dataDesafiosUser.value);
      isDesafiosUserVisible.value = true;
      isLoadingDesafiosUser.value = false;
    } catch (error) {
        console.error(error.message);
        isLoadingDesafiosUser.value = false;
        isDesafiosUserVisible.value = false;
    }
}

const handlePaginationClickDesafiosUser = async () => {

disabledPaginationDesafiosUser.value = true;
await getDesafiosUser(userSelected.value.id, currentPageDesafiosUser.value);
disabledPaginationDesafiosUser.value = false;
};


const handlePaginationClick = async () => {

  disabledPagination.value = true;
  nombreUsuarioVisible.value = [];
  await getDesafios(currentPage.value)
  disabledPagination.value = false;
};

async function mostrarNombreUsuario(id, index){
    const dataUser = await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=' + id);
    const dataUserJson = await dataUser.json();
    dataDesafios.value[index].nombre = dataUserJson.first_name + ' ' + dataUserJson.last_name;
    nombreUsuarioVisible.value.push(index);
}

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

              <VRow>
                  <VCol cols="12" sm="12" lg="12">
                    
                     <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                          {{ configSnackbar.message }}
                      </VSnackbar>

                      <VCard class="mt-4">
                      <VCardTitle class="pt-4 pl-6">Listado histórico de desafíos</VCardTitle>   
                                
                      <VCardItem v-if="isLoading">
                      Cargando datos... 
                      </VCardItem>   
                      <VCardItem v-else-if="!isLoading && dataDesafios.length > 0">
                       
                      <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                          <thead>
                              <tr>   
                              <th scope="col">Usuario</th>
                              <th scope="col">Desafío</th> 
                              <th scope="col">Estado</th>                                                                             
                              </tr>
                          </thead>

                          <tbody>
                              <tr v-for="(item, index) in dataDesafios" @click="onClickDesafiosUser(item.userId)" class="clickable">
                              <td class="text-medium-emphasis">
                      
                                <div class="d-flex align-center gap-4 mt-6 ml-4 mb-2" style="height: 20px; width: 200px;">                                                
                                <div>
                                    <h4>{{ item.userId }}</h4>
                                </div>               
                                <div>
                                    <VBtn v-if="!nombreUsuarioVisible.includes(index)" variant="text" icon  @click="mostrarNombreUsuario(item.userId, index)">
                                        <VIcon size="22" icon="tabler-eye" />
                                    </VBtn>
                                    
                                        <h4 v-if="item.nombre" class="ml-3">| &nbsp;&nbsp;&nbsp; {{item.nombre}}</h4>
                                    
                                </div>              
                            </div>
                              </td>     
                              <td class="text-medium-emphasis">
                                  {{ item.idDesafio}}
                              </td>  
                              <td class="text-medium-emphasis">
                                {{ item.estadoDesafio}}
                            </td>                       
                              </tr>
                          </tbody>
                      </VTable>
                      <VPagination
                        :disabled="disabledPagination"
                        v-model="currentPage"
                        :length="totalRegistros"
                        class="mt-4"
                        @click="handlePaginationClick"
                      />
                      </VCardItem>  
                      <VCardItem v-if="!isLoading && dataDesafios.length === 0">
                      No se han encontrado datos
                      </VCardItem>  
                      
                      </VCard>
                  </VCol>

                  <VCol v-if="isDesafiosUserVisible == true" cols="12" sm="12" lg="12">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Desafíos de {{ userSelected.nombre }}</VCardTitle>   

                    <VCardItem v-if="desafiosUser.length > 0">
                                                      
                            <VTable class="text-no-wrap tableNavegacion mb-5">
                                    <thead>
                                        <tr>   
                                        <th scope="col">Desafío</th>                      
                                        <th scope="col">Estado</th>  
                                                                                        
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(r, index) in desafiosUser">
                                        <td class="text-medium-emphasis">
                                            {{ r.idDesafio}}                              
                                        </td>                           
                                        <td class="text-medium-emphasis">
                                            {{ r.estadoDesafio}}
                                        </td> 
                                            
                                        </tr>
                                    </tbody>
                            </VTable>
                            <VPagination
                              :disabled="disabledPaginationDesafiosUser"
                              v-model="currentPageDesafiosUser"
                              :length="totalRegistrosDesafiosUser"
                              class="mt-4"
                              @click="handlePaginationClickDesafiosUser"
                              />
                    
                    </VCardItem>
                    <VCardItem v-else-if="desafiosUser.length == 0">
                    No se han encontrado datos                                
                    </VCardItem>  
                    
                    </VCard>
                </VCol>
                
              </VRow>

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