<script setup>

import { useColeccionListStore } from "@/views/apps/coleccion/useColeccionListStore";



const coleccionListStore = useColeccionListStore();
const colecciones = ref(["primero",
    "segundo",
    "tercero"]);
const isColeccionEditVisible = ref(false);
const isColeccionAddVisible = ref(false);
const isColeccionDeleteVisible = ref(false);
const rowPerPage = ref(10);
const updateColeccion = ref({});
const nuevaColeccion = ref('');



const updColeccionPrimero = ref([]);
const newColeccionPrimero = ref([]);




// Obtener las colecciones
const fetchColecciones = () => {
    coleccionListStore
    .fetchColecciones()
    .then((response) => {
        colecciones.value = response.data;
        console.log('colecciones',colecciones);
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchColecciones);

// Insertar una coleccion -----------------------------------------------------------------

const resolveColeccionNew = () =>{
let array = Array.from(colecciones.value);
let modulosPrimer = [];

for (let i = 0; i < array.length; i++) {
   
  let modP= array[i];
  modulosPrimer.push(modP);
  }
console.log('coleccionPrimerNuevo', modulosPrimer);
newColeccionPrimero.value = modulosPrimer;
}

const onFormAddColeccionActive = () => {
  resolveColeccionNew();
  isColeccionAddVisible.value = true;
};

const resolveColeccionNewSend = () =>{
let arrayNew = [];
let array = Array.from(newColeccionPrimero.value);
  for (let i = 0; i < array.length; i++) {
    let mod = array[i];
    arrayNew.push(mod);
  }
console.log('arrayNew',arrayNew);  
nuevaColeccion.value = arrayNew;
}

const onFormAddColeccionSubmit = () => {
  //resolveColeccionNewSend();
  //resolveColeccionNew();
  console.log("nuevoPaquete",nuevaColeccion.value);
  
 // coleccionListStore
  //  .addColeccion(nuevaColeccion.value)
  //  .catch((error) => {
  //    console.log(error);
  //  }); 

  nuevaColeccion.value = '';
  isColeccionAddVisible.value = false;
  window.setTimeout(fetchColecciones, 900); 
};

const onFormAddColeccionReset = () => {
  isColeccionAddVisible.value = false;
};

const dialogAddColeccionValueUpdate = val => {
  isColeccionAddVisible.value = val;
};

// Editar una coleccion ----------------------------------------------


const onFormColeccionActive = (nombre) => { 
  updateColeccion.value.oldName = nombre;
  updateColeccion.value.nuevo = nombre;
  isColeccionEditVisible.value = true;
  console.log('old',updateColeccion.value.oldName);
  console.log('new',updateColeccion.value.nuevo);
};

const resolveColeccionUpdateSend = () =>{
let arrayUpdate = [];
let array = Array.from(updColeccionPrimero.value);
  for (let i = 0; i < array.length; i++) {
    let mod = array[i];
    arrayUpdate.push(mod);
  }
console.log('arrayUpdate',arrayUpdate);  
updateColeccion.value = arrayUpdate;
}

const onFormColeccionSubmit = (nombre) => {


  //resolveColeccionUpdateSend();
  console.log("updatePaquete",updateColeccion.value.nuevo);
  console.log("nombre",nombre);

    let array = Array.from(colecciones.value);
    let index = array.indexOf(nombre);
    
    if(index != -1){
      colecciones.value[index] = updateColeccion.value.nuevo;
    }
 

  let data = {
    nombre: nombre,
    nombreNuevo:updateColeccion.value.nuevo,
  }
 
  //paquetesListStore.updateColeccion(data)
   // .catch((error) => {
    //  console.error(error);
   // });
  window.setTimeout(fetchColecciones, 900); 
  
  isColeccionEditVisible.value = false;
};

const onFormColeccionReset = () => {
  isColeccionEditVisible.value = false;
};


const dialogColeccionValueUpdate = val => {
  isColeccionEditVisible.value = val;
};
</script>
<template>
    <section>
      <VRow>
        
        <VCol cols="12">
          <VCard title="Colecciones">
           
  
            <VDivider />
  
            <VCardText class="d-flex flex-wrap py-4 gap-4">
              
              <VSpacer />
  
              <div
                class="d-flex align-center flex-wrap gap-2"
              >
              
                <VBtn
                  prepend-icon="tabler-plus"
                  @click="onFormAddColeccionActive"
                >
                  Agregar una colección
                </VBtn>
                
              </div>

            </VCardText>
  
            <VDivider />
  
            <VTable class="text-no-wrap">
              <!-- 👉 table head -->
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Acciones</th>
                  
                  
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody>
                <tr
                  v-for="coleccion in colecciones"
                  style="height: 3.75rem"
                >
                  <!-- 👉 nombre modulo -->
                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                        
                           {{coleccion }}
                        </h6>
                      </div>
                    </div>
                  </td>

                  <td class="text-center" style="width: 5rem">
                    
                    <VBtn icon size="x-small" color="default" variant="text"
                      
                     @click="onFormColeccionActive(coleccion)">

                      <VIcon size="22" icon="tabler-edit" />
                    </VBtn>
  
  
                  </td>
                </tr>
              </tbody>
  
            </VTable>
  
            <VDivider />

    <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 700"
    :model-value="isColeccionEditVisible"
    @update:model-value="dialogColeccionValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogColeccionValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Editar la colección
        </VCardTitle>
    
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormColeccionSubmit(updateColeccion.oldName)"
        >
          <VRow class="d-flex flex-wrap justify-center gap-4">
            <!-- 👉 Nombre -->
            <VCol cols="8">
              <VTextField
                v-model="updateColeccion.nuevo"
                label="Nombre"
              />
            </VCol>
            
              
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Enviar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormColeccionReset">
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 700"
    :model-value="isColeccionAddVisible"
    @update:model-value="dialogAddColeccionValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogAddColeccionValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Agregar una nueva coleccion
        </VCardTitle>
        
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormAddColeccionSubmit"
        >
          <VRow class="d-flex flex-wrap justify-center gap-4">
            <!-- 👉 Nombre -->
            <VCol cols="8"  class="d-flex flex-wrap justify-center gap-4">
              <VTextField 
                v-model="nuevaColeccion"
                label="Nombre de la colección"
              />
            </VCol>
            
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Aceptar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormAddColeccionReset">
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>


  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 700"
    :model-value="isColeccionDeleteVisible"
    @update:model-value="dialogDeleteColeccionValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogDeleteColeccionValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          ¿Desea eliminar el paquete?
        </VCardTitle>
        <!--
        <p class="mb-0">
          Updating user details will receive a privacy audit.
        </p>
         -->
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn  @click="deletePaquete"> Aceptar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormDeletePaqueteReset">
                Cancelar
              </VBtn>
            </VCol>
          
      
      </VCardText>
    </VCard>
  </VDialog>
   <!--
            <VCardText
              class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
            >
              <span class="text-sm text-disabled">
                {{ paginationData }}
              </span>
  
              <VPagination
                v-model="page"
                size="small"
                :total-visible="5"
                :length="totalPage"
              />
            </VCardText>
             -->
          </VCard>
        </VCol>
      </VRow>
  
      <!-- 👉 Add New User -->
      <!--
      <AddNewUserDrawer
        v-model:isDrawerOpen="isAddNewUserDrawerVisible"
        @user-data="addNewUser"
      />-->
    </section>
  </template>
  
  <style lang="scss">
  .app-user-search-filter {
    inline-size: 31.6rem;
  }
  
  svg {
    vertical-align: middle;
  }
  
  .text-capitalize {
    text-transform: capitalize;
  }
  
  .user-list-name:not(:hover) {
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
  }
  </style>