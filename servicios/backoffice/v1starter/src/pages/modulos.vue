<script setup>

import { useModulosListStore } from "@/views/apps/modulos/useModulosListStore";


const isModuloEditVisible = ref(false);
const isModuloAddVisible = ref(false);
const isModuloDeleteVisible = ref(false);
const modulosListStore = useModulosListStore();
const modulosPaquetes = ref([]);
const rowPerPage = ref(10);
const updateModulo = ref({});
const nuevoModulo = ref({
  nombre: '',
  estado: true,
  tipoDato: '',
});
const moduloId = ref('')

// 👉 Obtener los modulos
const fetchModulos = () => {
   modulosListStore
    .fetchModulosPaquetes()
    .then((response) => {
      modulosPaquetes.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchModulos);

// Actualizar módulo
const onFormModuloActive = (id) => {
  modulosListStore
    .fetchModuloPaquete(id)
    .then((response) => {
      updateModulo.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
  isModuloEditVisible.value = true;
};


const onFormModuloSubmit = (id) => {
  modulosListStore.updateModuloPaquete(id, updateModulo.value)
    .catch((error) => {
      console.error(error);
    });
  isModuloEditVisible.value = false;
  window.setTimeout(fetchModulos, 900); 
};

const onFormModuloReset = () => {
  isModuloEditVisible.value = false;
};


const dialogModuloValueUpdate = val => {
  isModuloEditVisible.value = val;
};

// Insertar nuevo módulo

const onFormAddModuloSubmit = () => {
  console.log("nuevoModulo",nuevoModulo.value);
  modulosListStore
    .addModuloPaquete(nuevoModulo.value)
    .catch((error) => {
      console.log(error);
    });
    
  nuevoModulo.value = {
  nombre: '',
  estado: true,
  tipoDato: '',
};
  isModuloAddVisible.value = false;
  window.setTimeout(fetchModulos, 900);
};

const onFormAddModuloReset = () => {
  isModuloAddVisible.value = false;
};

const dialogAddModuloValueUpdate = val => {
  isModuloAddVisible.value = val;
};

//eliminar modulo

const onDeleteModuloActive = (id) => {
  moduloId.value = id;
  isModuloDeleteVisible.value = true;
};

const deleteModulo = () =>{
  modulosListStore.deleteModuloPaquete(moduloId.value)
    .catch((error) => {
      console.error(error);
    });
  window.setTimeout(fetchModulos, 900); 
  moduloId.value = '';
  isModuloDeleteVisible.value = false;
}

const onFormDeleteModuloReset = () => {
  isModuloDeleteVisible.value = false;
};

const dialogDeleteModuloValueUpdate = val => {
  isModuloDeleteVisible.value = val;
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
          <VCard title="Modulos">
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
                  @click="isModuloAddVisible=true"
                >
                  Agregar un Módulo
                </VBtn>
              </div>
            </VCardText>
  
            <VDivider />
  
            <VTable class="text-no-wrap">
              <!-- 👉 table head -->
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Tipo de Dato</th>
                  <th scope="col">Acciones</th>
                  
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody>
                <tr
                  v-for="modulo in modulosPaquetes"
                  :key="modulo._id"
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
                           {{ modulo.nombre }}
                        </h6>
                      </div>
                    </div>
                  </td>
  
                  <!-- 👉 estado -->
                  <td>
                    <div class="d-flex align-center">
                      
                      <div class="d-flex flex-column">
                        <span class="text-capitalize text-base">{{
                          modulo.estado
                        }}</span>
                      </div>
                    </div>
                  </td>
  
                  <!-- 👉 Tipo de dato -->
                  <td>
                    <span class="text-sm">{{ modulo.tipoDato }}</span>
                  </td>

                  <!-- 👉 Actions -->
                 
                  <td class="text-center" style="width: 5rem">
                    
                    <VBtn icon size="x-small" color="default" variant="text"
                      
                     @click="onFormModuloActive(modulo._id)">

                      <VIcon size="22" icon="tabler-edit" />
                    </VBtn>
  
                    <VBtn icon size="x-small" color="error" variant="text" @click="onDeleteModuloActive(modulo._id)">
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
    :model-value="isModuloEditVisible"
    @update:model-value="dialogModuloValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModuloValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Editar el módulo
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
          @submit.prevent="onFormModuloSubmit(updateModulo._id)"
        >
          <VRow>
            <!-- 👉 Nombre -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="updateModulo.nombre"
                label="Nombre"
              />
            </VCol>

            <!--👉 Tipo de dato -->
            <VCol cols="12" md="6">
              <VCombobox
              label="Tipo de Dato"
              v-model="updateModulo.tipoDato"
             :items="itemsTipoDato"
              />
            </VCol>

            <!-- 👉 Estado -->
            <VCol cols="12" md="6">
              <VSwitch
                v-model="updateModulo.estado"
                density="compact"
                label="Estado"
              />
            </VCol>
          
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Enviar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormModuloReset">
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
    :model-value="isModuloAddVisible"
    @update:model-value="dialogAddModuloValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogAddModuloValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Agregar un nuevo módulo
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
          @submit.prevent="onFormAddModuloSubmit"
        >
          <VRow>
            <!-- 👉 Nombre -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="nuevoModulo.nombre"
                label="Nombre"
              />
            </VCol>

            <!--👉 Tipo de dato -->
            <VCol cols="12" md="6">
              <VCombobox
              label="Tipo de Dato"
              v-model="nuevoModulo.tipoDato"
             :items="itemsTipoDato"
              />
            </VCol>

            <!-- 👉 Estado -->
            <VCol cols="12" md="6">
              <VSwitch
                v-model="nuevoModulo.estado"
                density="compact"
                label="Estado"
              />
            </VCol>
          
            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Aceptar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormAddModuloReset">
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
    :model-value="isModuloDeleteVisible"
    @update:model-value="dialogDeleteModuloValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogDeleteModuloValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          ¿Desea eliminar el módulo?
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
              <VBtn  @click="deleteModulo"> Aceptar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormDeleteModuloReset">
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
  