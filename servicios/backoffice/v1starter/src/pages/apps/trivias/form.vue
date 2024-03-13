<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataTrivias = ref([]);
const isLoading = ref(false);
const triviaLoading = ref(false);
const searchTerm = ref('');
const busquedaTriviaVisible = ref(false);
const formVisible = ref(false);
const triviaSelected = ref('');
const idTriviaSelected = ref('');
const dataTriviaSelected = ref({});
const dataTriviaSelectedCorrect = ref({});

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const totalPages = computed(() => Math.ceil(total.value / limit.value));

//------------------- FUNCIONES  ---------------------

const updatePage = (newPage) => {
  page.value = newPage;
  search();
};


const getTrivias = async () => {
  isLoading.value = true;
  try {
    
    const response = await fetch(`https://ecuavisa-desafio-trivias.vercel.app/trivia/all/get?page=${page.value}&limit=${limit.value}`);
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
}

onMounted(async()=>{
    await getTrivias();
})

const reset = async () => {
  formVisible.value = false;
  busquedaTriviaVisible.value = false;
  searchTerm.value = '';
  page.value = 1;
  dataTriviaSelected.value = null;
  await getTrivias();
}

const startSearch = () => {
  formVisible.value = false;
  page.value = 1;
  
  search();
  busquedaTriviaVisible.value = true;
};

const search = async () => {
  isLoading.value = true;
  try {
    
    const response = await fetch(`https://ecuavisa-desafio-trivias.vercel.app/trivia/search/name?nombre=${searchTerm.value}&page=${page.value}&limit=${limit.value}`);
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
  idTriviaSelected.value = id;
  dataTriviaSelected.value = null;
  dataTriviaSelectedCorrect.value = null;
  triviaSelected.value = title;
  formVisible.value = true;
  triviaLoading.value = true;
  
  try {
    const response = await fetch(`https://ecuavisa-desafio-trivias.vercel.app/trivia/get/${id}`);
    const data = await response.json();
    if (data.resp && data.data) {
      const dataTrivia = data.data;
      let preguntas = Array.from(dataTrivia.preguntas);
      dataTriviaSelectedCorrect.value = dataTrivia;
      
      let dataTriviaNoRespuesta = preguntas.map(pregunta => {
        
        return { ...pregunta, respuesta: '' };
      });

      dataTriviaSelected.value = dataTriviaNoRespuesta;
      //console.log('Original',dataTriviaSelectedCorrect.value);
      //console.log('Editado',dataTriviaSelected.value);

    } else {
      dataTriviaSelected.value = null;
      dataTriviaSelectedCorrect.value = null;
    }
  } catch (error) {
    console.error('Error al obtener detalles de la trivia:', error);
    dataTriviaSelected.value = null;
    dataTriviaSelectedCorrect.value = null;
  } finally {
    triviaLoading.value = false;
    
  }
};

function validarArreglo(arreglo) {
    for (let i = 0; i < arreglo.length; i++) {
        let objeto = arreglo[i];
        for (let propiedad in objeto) {
            if (objeto.hasOwnProperty(propiedad)) {
                // Verificar si la propiedad es opciones
                if (propiedad === 'opciones') {
                    if (!objeto[propiedad].every(opcion => opcion.trim() !== '')) {
                        return false;
                    }
                } else {
                    if (objeto[propiedad].trim() === '') {
                        return false;
                    }
                }
            }
        }
    }
    return true;
};

async function onComplete(){

  let preguntas = dataTriviaSelected.value;
  if (!validarArreglo(preguntas)) {
        configSnackbar.value = {
                    message: "Debe llenar todos los campos",
                    type: "error",
                    model: true
                };
        return false;
  } 

  if (!usuarioSelected.value.id) {
        configSnackbar.value = {
                    message: "Debe seleccionar un usuario",
                    type: "error",
                    model: true
                };
        return false;
  } 
  
  let preguntasEnviar = preguntas.map(({ pregunta, respuesta }) => ({ pregunta, respuesta }));

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

    
        let jsonEnviar ={
            "idTrivia": idTriviaSelected.value,
            "idUsuario": usuarioSelected.value.id,
            "respuesta": preguntasEnviar  
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const send = await fetch('https://ecuavisa-desafio-trivias.vercel.app/triviaUsuario/create', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Respuestas enviadas correctamente",
                type: "success",
                model: true
            };
        } else {
            configSnackbar.value = {
                message: respuesta.mensaje,
                type: "error",
                model: true
            };
            console.error(respuesta.error);
            return false;

        }

}

// ---------------------- BUSCAR USUARIO ----------------------

const searchTermUsuario = ref('');
const searchUserVisible = ref(false);
const dataUsuarios = ref([])
const loadingSearchUsuario = ref(false);
const usuarioSelected = ref({
  id: null,
  usuario: '',
})
async function startSearchUsuario() {
  searchUserVisible.value = true;
  loadingSearchUsuario.value = true;
  await searchUsuario();
  loadingSearchUsuario.value = false;
}

function resetSearchUsuario () {
  searchUserVisible.value = false;
  searchTermUsuario.value = '';
  dataUsuarios.value = [];
  usuarioSelected.value = {
    id: null,
    usuario: '',
  };
}

const searchUsuario = async () => {
  
  try {  
    const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${searchTermUsuario.value}`);
    const data = await response.json();
    if (data.resp) {
      dataUsuarios.value = data.data.slice(0, 5);
      
    } else {
      dataUsuarios.value = [];   
      console.log("no hay nada para mostrar");
  
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
  } finally {
    
  }
};

function seleccionarUsuario(id, nombre, apellido) {
  usuarioSelected.value = {
    id : id,
    usuario : nombre + ' ' + apellido
  }  
}
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
                                 
                      
                      <VCardItem v-if="isLoading">
                      Cargando datos... 
                      </VCardItem>   
                      <VCardItem v-else-if="!isLoading && dataTrivias.length > 0">
                       
                      <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                          <thead>
                              <tr>   
                              <th scope="col">Nombre</th>
                              <th scope="col">Id de regla</th> 
                                                                                                       
                              </tr>
                          </thead>

                          <tbody>
                              <tr v-for="item in dataTrivias" @click="handleUserClick(item._id, item.nombre)" class="clickable">
                              <td class="text-medium-emphasis">
                                  {{ item.nombre}}
                              </td>     
                              <td class="text-medium-emphasis">
                                  {{ item.idRegla}}
                              </td>                                                   
                              </tr>
                          </tbody>
                      </VTable>
                      <VPagination v-if="total > limit" v-model="page" size="small" :total-visible="5" :length="totalPages"
                        @update:model-value="updatePage" class="mb-4"/>

                      </VCardItem>  
                      <VCardItem v-if="!isLoading && dataTrivias.length === 0">
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
                    <VCard v-else-if="!triviaLoading && dataTriviaSelected.length > 0" class="mt-4">
                      <VCardTitle class="pt-4 pl-6">Completar {{ triviaSelected }}</VCardTitle>  
                      <VCardItem style="margin-bottom: -1rem;"><h3>Seleccione el usuario que respondera la trivia</h3></VCardItem>
                      <VCardItem>     
                        <div class="d-flex mt-2 gap-4">
                          <VTextField v-model="searchTermUsuario"  @keyup.enter="startSearch" style="max-width: 400px;" label="Buscar usuario..." />
                          
                          <VBtn :loading="loadingSearchUsuario" :disabled="loadingSearchUsuario" color="primary" size="small" icon="tabler-search"
                            @click="startSearchUsuario" />

                          <VTextField class="ml-6" v-model="usuarioSelected.usuario"   style="max-width: 400px;" label="Usuario seleccionado" readonly />  

                        </div>
                        <VCardText v-if="searchUserVisible == true && loadingSearchUsuario == true" class="mt-2">
                          Cargando datos...
                        </VCardText>

                        <VCardText v-else-if="dataUsuarios.length > 0 && searchUserVisible == true && loadingSearchUsuario == false" class="mt-2">
                          <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                          <thead>
                              <tr>   
                              <th scope="col">Usuario</th>
                              <th scope="col">Correo</th> 
                                                                                                       
                              </tr>
                          </thead>

                          <tbody>
                              <tr v-for="item in dataUsuarios" @click="seleccionarUsuario(item.wylexId, item.first_name, item.last_name)" class="clickable"> 
                              <td class="text-medium-emphasis">
                                  {{ item.first_name + ' ' + item.last_name}}
                              </td>     
                              <td class="text-medium-emphasis">
                                  {{ item.email}}
                              </td>                                                   
                              </tr>
                          </tbody>
                        </VTable>
                        </VCardText>

                        <VCardText v-if="searchUserVisible == true && loadingSearchUsuario == false && dataUsuarios.length == 0" class="mt-2">
                          No existen usuarios que coincidan con la busqueda
                        </VCardText>
                        <VDivider class="mt-4" v-if="searchUserVisible == true" />
                      </VCardItem> 
                      <VCardItem style="margin-bottom: -2rem; margin-top: -1rem;"><h3>Preguntas de la trivia</h3></VCardItem>
                      <VCardItem>
                        <VCardText>
                        <!-- 👉 Form -->
                        <VForm class="mt-6" @submit.prevent="onComplete">
                            <VRow class="d-flex flex-wrap justify-center gap-4">
                                <VRow>
                                                                    
                                      
                                  
                                    <VCol v-for="(p, index) in dataTriviaSelected" cols="12" class="w-100" > 
                                           
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
                                    <VDivider class="mt-6" v-if="index != dataTriviaSelected.length-1" />
                                  </VCol>                    
                                </VRow>
                                <!-- 👉 Submit and Cancel -->
                                <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                                                <VBtn type="submit"> Enviar </VBtn>
        
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