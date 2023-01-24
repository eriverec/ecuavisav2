<script setup>

import { usePeriodosListStore } from "@/views/apps/modulos/usePeriodosListStore";


const isPeriodoEditVisible = ref(false);
const isPeriodoAddVisible = ref(false);
const isPeriodoDeleteVisible = ref(false);
const periodosListStore = usePeriodosListStore();
const periodos = ref([]);
const rowPerPage = ref(10);
const updatePeriodo = ref({});
const nuevoPeriodo = ref({
  periodo: ''
});
const periodoId = ref('')

// 👉 Obtener los modulos
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
  periodosListStore
    .fetchPeriodo(id)
    .then((response) => {
      updatePeriodo.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
  isPeriodoEditVisible.value = true;
};


const onFormPeriodoSubmit = (id) => {
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

const onFormAddPeriodoSubmit = () => {
  console.log("nuevoPeriodo",nuevoPeriodo.value);
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
              <div class="me-3" style="width: 80px">
                <VSelect
                  v-model="rowPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[10, 20, 30, 50]"
                />
              </div>
  
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
                  @click="isPeriodoAddVisible=true"
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
          <VRow class="d-flex flex-wrap justify-center gap-4">
            <!-- 👉 Nombre -->
            <VCol cols="12" >
              <VTextField
                v-model="updatePeriodo.periodo"
                label="Periodo"
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
          <VRow class="d-flex flex-wrap justify-center gap-4">
            <!-- 👉 Nombre -->
            <VCol cols="12">
              <VTextField
                v-model="nuevoPeriodo.periodo"
                label="Periodo"
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
  