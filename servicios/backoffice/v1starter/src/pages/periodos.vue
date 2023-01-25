<script setup>

import { usePeriodosListStore } from "@/views/apps/modulos/usePeriodosListStore";


const isPeriodoEditVisible = ref(false);
const isPeriodoAddVisible = ref(false);
const isPeriodoDeleteVisible = ref(false);
const periodosListStore = usePeriodosListStore();
const periodos = ref([]);
const rowPerPage = ref(10);
const updatePeriodo = ref({
  _id: '',
  periodo: ''
});
const nuevoPeriodo = ref({
  periodo: ''
});
const periodoId = ref('');
const periodoString = ref('');
const tiempoString = ref('');

// 👉 Obtener los periodos
const fetchPeriodos = () => {
   periodosListStore
    .fetchPeriodos()
    .then((response) => {
      periodos.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchPeriodos);

// Actualizar módulo
const onFormPeriodoActive = (id) => {
  tiempoString.value = '';
  periodoString.value = '';

  periodosListStore
    .fetchPeriodo(id)
    .then((response) => {
      updatePeriodo.value._id = response.data._id;
      let respuesta = response.data.periodo;
      let array = respuesta.split(' ');
      periodoString.value = array[0];
      let tiempo = array[1];
      if (tiempo == 'año' || tiempo == 'años'){
      tiempoString.value = 'año(s)';
    } else { 
      tiempoString.value = 'mes(es)';
    }      
    
    })
    .catch((error) => {
      console.error(error);
    });
  isPeriodoEditVisible.value = true;
};

const mergePeriodo = () => {
  let num = Number(periodoString.value);  
  
  if(num == 1 && tiempoString.value == 'año(s)'){
  nuevoPeriodo.value.periodo = periodoString.value + ' año';
  updatePeriodo.value.periodo = periodoString.value + ' año';
  }else if(num !== 1 && tiempoString.value == 'año(s)'){
    nuevoPeriodo.value.periodo = periodoString.value + ' años';
    updatePeriodo.value.periodo = periodoString.value + ' años';
  }else if(num == 1 && tiempoString.value == 'mes(es)'){
    nuevoPeriodo.value.periodo = periodoString.value + ' mes';
    updatePeriodo.value.periodo = periodoString.value + ' mes';
  }else{
    nuevoPeriodo.value.periodo = periodoString.value + ' meses';
    updatePeriodo.value.periodo = periodoString.value + ' meses';
  }
  periodoString.value='';
  tiempoString.value='';
}

const onFormPeriodoSubmit = (id) => {
  mergePeriodo();
  
  periodosListStore.updatePeriodo(id, updatePeriodo.value)
    .catch((error) => {
      console.error(error);
    });
  window.setTimeout(fetchPeriodos, 900); 
  isPeriodoEditVisible.value = false;
};

const onFormPeriodoReset = () => {
  isPeriodoEditVisible.value = false;
};


const dialogPeriodoValueUpdate = val => {
  isPeriodoEditVisible.value = val;
};

// Insertar nuevo módulo

const onFormAddPeriodoActive = ()=>{
  isPeriodoAddVisible.value = true;
  periodoString.value='';
  tiempoString.value='';
}


const onFormAddPeriodoSubmit = () => {

  mergePeriodo();
  periodosListStore
    .addPeriodo(nuevoPeriodo.value)
    .catch((error) => {
      console.log(error);
    }); 
  nuevoPeriodo.value.periodo = '';
  isPeriodoAddVisible.value = false;
  window.setTimeout(fetchPeriodos, 900); 
};

const onFormAddPeriodoReset = () => {
  nuevoPeriodo.value.periodo = '';
  isPeriodoAddVisible.value = false;
  
};

const dialogAddPeriodoValueUpdate = val => {
  isPeriodoAddVisible.value = val;
};

//eliminar modulo

const onDeletePeriodoActive = (id) => {
  periodoId.value = id;
  isPeriodoDeleteVisible.value = true;
};

const deletePeriodo = () =>{
  periodosListStore.deletePeriodo(periodoId.value)
    .catch((error) => {
      console.error(error);
    });
  window.setTimeout(fetchPeriodos, 900); 
  periodoId.value = '';
  isPeriodoDeleteVisible.value = false;
}

const onFormDeletePeriodoReset = () => {
  isPeriodoDeleteVisible.value = false;
};

const dialogDeletePeriodoValueUpdate = val => {
  isPeriodoDeleteVisible.value = val;
};


const itemsTiempo = [
  'año(s)',
  'mes(es)'
]

</script>

<template>
    <section>
      <VRow>
        
        <VCol cols="12">
          <VCard title="Periodos">
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
                  @click="onFormAddPeriodoActive"
                >
                  Agregar un Periodo
                </VBtn>
              </div>
            </VCardText>
  
            <VDivider />
  
            <VTable class="text-no-wrap">
              <!-- 👉 table head -->
              <thead>
                <tr>
                  <th scope="col">Periodo</th>
                  <th scope="col">Acciones</th>
                  
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody>
                <tr
                  v-for="periodo in periodos"
                  :key="periodo._id"
                  style="height: 3.75rem"
                >
                  <!-- 👉 nombre modulo -->
                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex flex-column">
                        <h6 class="text-base">
                            <!-- 
                          <RouterLink
                            :to="{
                              name: 'apps-user-view-id',
                              params: { id: user.wylexId },
                            }"
                            class="font-weight-medium user-list-name"
                          >
                            {{ user.first_name }} {{ user.last_name }}
                          </RouterLink>
                           -->
                           {{ periodo.periodo }}
                        </h6>
                      </div>
                    </div>
                  </td>
  
          

                  <!-- 👉 Actions -->
                 
                  <td class="text-center" style="width: 5rem">
                    
                    <VBtn icon size="x-small" color="default" variant="text"
                      
                     @click="onFormPeriodoActive(periodo._id)">

                      <VIcon size="22" icon="tabler-edit" />
                    </VBtn>
  
                    <VBtn icon size="x-small" color="error" variant="text" @click="onDeletePeriodoActive(periodo._id)">
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
    :width="$vuetify.display.smAndDown ? 'auto' : 500"
    :model-value="isPeriodoEditVisible"
    @update:model-value="dialogPeriodoValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogPeriodoValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Editar el periodo
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
          @submit.prevent="onFormPeriodoSubmit(updatePeriodo._id)"
        >
          <VRow>
            <!-- 👉 Nombre -->
            <VCol cols="12" md="6" >
              <VTextField
                v-model="periodoString"
                label="Periodo"
                type="number"
              />
            </VCol>
            <VCol cols="12" md="6" >
            <VCombobox
              v-model="tiempoString"
             :items="itemsTiempo"
              />
            </VCol>
          
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Enviar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormPeriodoReset">
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 500"
    :model-value="isPeriodoAddVisible"
    @update:model-value="dialogAddPeriodoValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogAddPeriodoValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Agregar un nuevo periodo
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
          @submit.prevent="onFormAddPeriodoSubmit"
        >
          <VRow >
            <!-- 👉 Nombre -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="periodoString"
                label="Periodo"
                type="number"
              />
            </VCol>
            <VCol cols="12" md="6" >
            <VCombobox
              v-model="tiempoString"
             :items="itemsTiempo"
              />
            </VCol>
          
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Aceptar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormAddPeriodoReset">
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
    :model-value="isPeriodoDeleteVisible"
    @update:model-value="dialogDeletePeriodoValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogDeletePeriodoValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          ¿Desea eliminar el periodo?
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
              <VBtn  @click="deletePeriodo"> Aceptar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormDeletePeriodoReset">
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
  