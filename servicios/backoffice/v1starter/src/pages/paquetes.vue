<script setup>

import { usePaquetesListStore } from "@/views/apps/modulos/usePaquetesListStore";
import { usePeriodosListStore } from "@/views/apps/modulos/usePeriodosListStore";
import { useModulosListStore } from "@/views/apps/modulos/useModulosListStore";
import { integerValidator} from '@validators';

const isPaqueteEditVisible = ref(false);
const isPaqueteAddVisible = ref(false);
const isPaquetesDeleteVisible = ref(false);
const modulosListStore = useModulosListStore();
const paquetesListStore = usePaquetesListStore();
const periodosListStore = usePeriodosListStore();
const modulos = ref([]);
const paquetes = ref([]);
const rowPerPage = ref(10);
const updatePaquete = ref({});
const nuevoPaquete = ref({
  nombre: '',
  idPeriodo: '',
  modulos: []
});
const nombrePeriodo = ref('');
const paqueteId = ref('');
const periodos = ref([]);
const periodosItems = ref([]);
const updModuloPrimero = ref([]);
const newModuloPrimero = ref([]);

// 👉 Obtener los paquetes
const fetchPaquetes = () => {
   paquetesListStore
    .fetchPaquetes()
    .then((response) => {
      paquetes.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
    
};
// 👉 Obtener los periodos
const fetchPeriodos = () => {
  return periodosListStore
    .fetchPeriodos()
    .then((response) => {
      //console.log('response',response.data.periodo);
      periodos.value = response.data; 
      let arrayP = periodos.value.map((e) => e.periodo);
      periodosItems.value = arrayP;  
    })
    .catch((error) => {
      console.error(error);
    }); 
};
fetchPeriodos();

// 👉 Obtener los modulos
const fetchModulos = () => {
   modulosListStore
    .fetchModulosPaquetes()
    .then((response) => {
      modulos.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
fetchModulos();

const resolveModulosFull = (data) =>{
let array = Array.from(data);
let modulosFull = [];
let arrayModulos = modulos.value.map((e) => e.nombre);

  for (let i = 0; i < array.length; i++) {
    let index = modulos.value.map((e) => e._id).indexOf(array[i].idModulo);
    
    if(index != -1){
      modulosFull.push(arrayModulos[index] +' - '+ array[i].valor);
    }
  }

return modulosFull;
}



const getPeriodoNombre = id => {
let arrayP = periodos.value.map((e) => e.periodo);
let index = periodos.value.map((e) => e._id).indexOf(id);
return arrayP[index];
};

const resolvePeriodoUpd = () => {
let arrayP = periodos.value.map((e) => e._id);
let index = periodos.value.map((e) => e.periodo).indexOf(nombrePeriodo.value);
updatePaquete.value.idPeriodo = arrayP[index];

};

const resolvePeriodoNew = () => {
let arrayP = periodos.value.map((e) => e._id);
let index = periodos.value.map((e) => e.periodo).indexOf(nombrePeriodo.value);
nuevoPaquete.value.idPeriodo = arrayP[index];
};

watchEffect(fetchPaquetes);

const fetchAll = () =>{
  fetchPaquetes();
  fetchModulos();
  fetchPeriodos();
}

// Actualizar módulo ----------------------------------------------

const resolveModulosUpdate = () =>{
let array = Array.from(updatePaquete.value.modulos);
let modulosPrimer = [];

let modulosNombres = modulos.value.map((e) => e.nombre);
let modulosTipoDato = modulos.value.map((e) => e.tipoDato);

  for (let i = 0; i < array.length; i++) {
    let index = modulos.value.map((e) => e._id).indexOf(array[i].idModulo);
    
    if(index != -1){
      let modP= {
       idModulo: array[i].idModulo,
       nombre: modulosNombres[index],
       valor: array[i].valor,
       tipoDato: modulosTipoDato[index],
        };

      modulosPrimer.push(modP);
    }
  }
console.log('modulosPrimer', modulosPrimer);
updModuloPrimero.value = modulosPrimer;
}

const onFormPaqueteActive = (id) => {
  nombrePeriodo.value='';
  
  paquetesListStore
    .fetchPaquete(id)
    .then((response) => {
      let periodo = response.data;
      updatePaquete.value = periodo;
      nombrePeriodo.value = getPeriodoNombre(periodo.idPeriodo); 
      resolveModulosUpdate(); 
    })
    .catch((error) => {
      console.error(error);
    });
 
  isPaqueteEditVisible.value = true;
};

const resolveModulosUpdateSend = () =>{
let arrayUpdate = [];
let array = Array.from(updModuloPrimero.value);
  for (let i = 0; i < array.length; i++) {
    let mod = {
      idModulo: array[i].idModulo,
      valor: array[i].valor
    }
    arrayUpdate.push(mod);
  }
console.log('arrayUpdate',arrayUpdate);  
updatePaquete.value.modulos = arrayUpdate;
}

const onFormPaqueteSubmit = (id) => {
  resolvePeriodoUpd();
  resolveModulosUpdateSend();
  console.log("updatePaquete",updatePaquete.value);
  
  paquetesListStore.updatePaquete(id, updatePaquete.value)
    .catch((error) => {
      console.error(error);
    });
  window.setTimeout(fetchAll, 900); 
  
  isPaqueteEditVisible.value = false;
};

const onFormPaqueteReset = () => {
  isPaqueteEditVisible.value = false;
};


const dialogPaqueteValueUpdate = val => {
  isPaqueteEditVisible.value = val;
};

// Insertar nuevo módulo -------------------------------------------------------
const resolveModulosNew = () =>{
let array = Array.from(modulos.value);
let modulosPrimer = [];

for (let i = 0; i < array.length; i++) {
   
  let modP= {
       idModulo: array[i]._id,
       nombre: array[i].nombre,
       valor: '',
       tipoDato: array[i].tipoDato,
  };

  modulosPrimer.push(modP);
  }
console.log('modulosPrimerNuevo', modulosPrimer);
newModuloPrimero.value = modulosPrimer;
}

const onFormAddPaqueteActive = () => {
  resolveModulosNew();
  nombrePeriodo.value='';
  isPaqueteAddVisible.value = true;
};

const resolveModulosNewSend = () =>{
let arrayNew = [];
let array = Array.from(newModuloPrimero.value);
  for (let i = 0; i < array.length; i++) {
    let mod = {
      idModulo: array[i].idModulo,
      valor: array[i].valor
    }
    arrayNew.push(mod);
  }
console.log('arrayNew',arrayNew);  
nuevoPaquete.value.modulos = arrayNew;
}

const onFormAddPaqueteSubmit = () => {
  resolveModulosNewSend();
  resolvePeriodoNew();
  console.log("nuevoPaquete",nuevoPaquete.value);
  
  paquetesListStore
    .addPaquete(nuevoPaquete.value)
    .catch((error) => {
      console.log(error);
    }); 

  nuevoPaquete.value = '';
  isPaqueteAddVisible.value = false;
  window.setTimeout(fetchPaquetes, 900); 
};

const onFormAddPaqueteReset = () => {
  isPaqueteAddVisible.value = false;
};

const dialogAddPaqueteValueUpdate = val => {
  isPaqueteAddVisible.value = val;
};

//eliminar modulo

const onDeletePaqueteActive = (id) => {
  paqueteId.value = id;
  isPaqueteDeleteVisible.value = true;
};

const deletePaquete = () =>{
  paquetesListStore.deletePaquete(paquetesId.value)
    .catch((error) => {
      console.error(error);
    });
  window.setTimeout(fetchPaquetes, 900); 
  paqueteId.value = '';
  isPaqueteDeleteVisible.value = false;
}

const onFormPaquetePeriodoReset = () => {
  isPaqueteDeleteVisible.value = false;
};

const dialogDeletePaqueteValueUpdate = val => {
  isPaqueteDeleteVisible.value = val;
};


const itemsTipoDato = [
  'texto',
  'boolean',
  'numerico'
]


</script>

<template>
    <section>
      <VRow>
        
        <VCol cols="12">
          <VCard title="Paquetes">
            <!-- 👉 Filters -->
            <!-- 
              <VCardText>
              <VRow>
         
              <VCol
              cols="12"
              sm="4"
              >
              <VSelect
              v-model= "selectedProvider"
              label="Proveedor"
              :items= "listProvider"
              clearable
              clear-icon="tabler-x"
              />
              </VCol>
  
              <VCol
              cols="12"
              sm="4"
              >
              <VSelect
              v-model="selectedBoletin"
              label="Boletín"
              :items="listBoletin"
              clearable
              clear-icon="tabler-x"
              />
              </VCol>
                <!-
              <VCol
              cols="12"
              sm="4"
              >
              <VSelect
              v-model="selectedStatus"
              label="Select Status"
              :items="status"
              clearable
              clear-icon="tabler-x"
              />
              </VCol>
                ->
              </VRow>
              </VCardText> 
                        -->
  
            <VDivider />
  
            <VCardText class="d-flex flex-wrap py-4 gap-4">
              <!--
              <div class="me-3" style="width: 80px">
                <VSelect
                  v-model="rowPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[10, 20, 30, 50]"
                />
              </div>
             -->
              <VSpacer />
  
              <div
                class="d-flex align-center flex-wrap gap-2"
              >
              <!--
                <!- 👉 Search  ->
                <div style="width: 10rem">
                  <VTextField
                    v-model="searchQuery"
                    placeholder="Search"
                    density="compact"
                  />
                </div>
                <!- 👉 Search button ->
                <VBtn
                  prepend-icon="tabler-search"
                  @click="searchUsers"
                >
                  Buscar
                </VBtn>
                             -->
                
                <!-- 👉 Export button -->
                
  
                <!-- 👉 Add user button -->
                <VBtn
                  prepend-icon="tabler-plus"
                  @click="onFormAddPaqueteActive"
                >
                  Agregar un Paquete
                </VBtn>
              </div>
            </VCardText>
  
            <VDivider />
  
            <VTable class="text-no-wrap">
              <!-- 👉 table head -->
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Periodo</th>
                  <th scope="col">Módulos</th>
                  <th scope="col">Acciones</th>
                  
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody>
                <tr
                  v-for="paquete in paquetes"
                  :key="paquete._id"
                  style="height: 3.75rem"
                >
                  <!-- 👉 nombre modulo -->
                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                        
                           {{ paquete.nombre }}
                        </h6>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex flex-column">
                        <span class="text-capitalize text-base" >
                          {{ getPeriodoNombre(paquete.idPeriodo) }}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex ">
                        <span class="text-capitalize text-base" v-for="modulo in resolveModulosFull(paquete.modulos)">
                      {{ modulo==resolveModulosFull(paquete.modulos)[0] || resolveModulosFull(paquete.modulos).length == 1? modulo :"; " + modulo }} </span>
                          
                      </div>
                    </div>
                  </td>
  
          

                  <!-- 👉 Actions -->
                 
                  <td class="text-center" style="width: 5rem">
                    
                    <VBtn icon size="x-small" color="default" variant="text"
                      
                     @click="onFormPaqueteActive(paquete._id)">

                      <VIcon size="22" icon="tabler-edit" />
                    </VBtn>
  
                    <VBtn icon size="x-small" color="error" variant="text" @click="onDeletePaqueteActive(paquete._id)">
                      <VIcon size="22" icon="tabler-trash" />
                    </VBtn>
  
                  </td>

               
                </tr>
              </tbody>
  
              <!-- 👉 table footer  -->
              <!--
                <tfoot v-show="!users.length">
                <tr>
                <td
                colspan="7"
                class="text-center"
                >
                No data available
                </td>
                </tr>
                </tfoot> 
              -->
            </VTable>
  
            <VDivider />

    <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 700"
    :model-value="isPaqueteEditVisible"
    @update:model-value="dialogPaqueteValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogPaqueteValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Editar el paquete
        </VCardTitle>
        <!--
        <p class="mb-0">
          Updating user details will receive a privacy audit.
        </p>
         -->
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormPaqueteSubmit(updatePaquete._id)"
        >
          <VRow >
            <!-- 👉 Nombre -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="updatePaquete.nombre"
                label="Nombre"
              />
            </VCol>
            <VCol cols="12" md="6" >
            <VCombobox
              label="Periodo"
              v-model="nombrePeriodo"
             :items="periodosItems"
              />
            </VCol>
          <VCol cols="12" >
            <VTable class="text-no-wrap">
            <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Valor</th>
                  
                  
                </tr>
              </thead>
            <tbody>
                <tr
                  v-for="modulo in updModuloPrimero"
                  style="height: 3.75rem"
                >
                  <!-- 👉 nombre modulo -->
                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                        
                           {{ modulo.nombre }}
                        </h6>
                      </div>
                    </div>
                  </td>

                  <td>
                    <VTextField v-if="modulo.tipoDato == 'texto' "
                     v-model="modulo.valor"
                     label="valor"
                      />
                      <VSwitch
                      v-if="modulo.tipoDato == 'boolean' "
                      v-model="modulo.valor"
                      density="compact"
                      label="valor"
                      />
                      <VTextField v-if="modulo.tipoDato == 'numerico' "
                      v-model="modulo.valor"
                      label="valor"
                      :rules="[integerValidator]"
                      />  
                  </td>

             
                </tr>
              </tbody>
            </VTable>
            </VCol>
              
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Enviar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormPaqueteReset">
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
    :model-value="isPaqueteAddVisible"
    @update:model-value="dialogAddPaqueteValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogAddPaqueteValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Agregar un nuevo paquete
        </VCardTitle>
        <!--
        <p class="mb-0">
          Updating user details will receive a privacy audit.
        </p>
         -->
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormAddPaqueteSubmit"
        >
          <VRow>
            <!-- 👉 Nombre -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="nuevoPaquete.nombre"
                label="Nombre"
              />
            </VCol>
            <VCol cols="12" md="6" >
            <VCombobox
              label="Periodo"
              v-model="nombrePeriodo"
             :items="periodosItems"
              />
            </VCol>
            <VCol cols="12" >
            <VTable class="text-no-wrap">
            <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Valor</th>
                  
                  
                </tr>
              </thead>
            <tbody>
                <tr
                  v-for="modulo in newModuloPrimero"
                  style="height: 3.75rem"
                >
                  <!-- 👉 nombre modulo -->
                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                        
                           {{ modulo.nombre }}
                        </h6>
                      </div>
                    </div>
                  </td>

                  <td>
                    <VTextField v-if="modulo.tipoDato == 'texto' "
                     v-model="modulo.valor"
                     label="valor"
                      />
                      <VSwitch
                      v-if="modulo.tipoDato == 'boolean' "
                      v-model="modulo.valor"
                      density="compact"
                      label="valor"
                      />
                      <VTextField v-if="modulo.tipoDato == 'numerico' "
                      v-model="modulo.valor"
                      label="valor"
                      :rules="[integerValidator]"
                      />  
                  </td>

             
                </tr>
              </tbody>
            </VTable>
            </VCol>
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Aceptar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormAddPaqueteReset">
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
    :model-value="isPaqueteDeleteVisible"
    @update:model-value="dialogDeletePaqueteValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogDeletePaqueteValueUpdate(false)" />

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
  