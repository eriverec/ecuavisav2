<script setup>
import { useBannersListStore } from "@/views/apps/miecuavisa/useBannersListStore";

const categoriasListStore = useBannersListStore();
const categorias = ref([]);
const sendCategorias = ref([]);
const isCategoriasEditVisible = ref(false);
const isCategoriasAddVisible = ref(false);
const isCategoriasDeleteVisible = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
var totalPages = ref(1);
const updateCategorias = ref({});
//const nuevaCategorias = ref("");
const updCategoriaPrimero = ref([]);
const newCategoriaPrimero = ref([]);
const filteredData_2 = ref([]);
const currentTab = ref('tab-lista')

// Obtener las colecciones
const fetchCategorias = () => {
  categoriasListStore
    .fetchCategorias()
    .then((response) => {
      categorias.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchCategorias);

totalPages.value = computed(() => {
  return Math.ceil(categorias.value.length / itemsPerPage.value);
});

// 👉 Computing pagination data
/**/

// Editar una categoría ----------------------------------------------

const onFormCategoriasActive = (data) => {
    //let index =  categorias.value.map((e) => e.id).indexOf(id);   
    /**/
    updateCategorias.value = data; 
    isCategoriasEditVisible.value = true;
    //console.log("upd", updateCategorias.value);
    
};

const onFormDelete = (data) => {
    //let index =  categorias.value.map((e) => e.id).indexOf(id);   
    isCategoriasEditVisible.value = false;
    //console.log("upd", updateCategorias.value);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify({
        "id":data.id
      }),
      redirect: 'follow'
    };
    fetch("https://estadisticas.ecuavisa.com/sites/gestor/Tools/miecuavisa/ajax.php", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        window.setTimeout(fetchCategorias, 600);
        isCategoriasEditVisible.value = false;
      })
      .catch(error => console.log('error', error));  
};

const onFormCategoriasSubmit = (id) => {
  //resolveColeccionUpdateSend();

    //sendCategorias.value = categorias.value;
    let arrayFinal = [];
    arrayFinal = categorias.value;
    let index = categorias.value.map((e) => e.id).indexOf(id);  
    let data = {
      id:categorias.value[index].id,
      url: categorias.value[index].url,
      name: categorias.value[index].name,
      mobile: categorias.value[index].images.mobile,
      escritorio: categorias.value[index].images.escritorio,
      estado: updateCategorias.value.estado
    }     
    //arrayFinal[index] = data;      

    console.log('sending ',data );
    var myHeaders = new Headers();
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data),
      redirect: 'follow'
    };
    fetch("https://estadisticas.ecuavisa.com/sites/gestor/Tools/miecuavisa/ajax.php", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        window.setTimeout(fetchCategorias, 600);
        isCategoriasEditVisible.value = false;
      })
      .catch(error => console.log('error', error));  
};

const onFormCategoriasReset = () => {
    /*updateCategorias.value = {};
    window.setTimeout(fetchCategorias, 300);*/
    isCategoriasEditVisible.value = false;  
};

const dialogCategoriasValueUpdate = (val) => {
  if(val === false){
    window.setTimeout(fetchCategorias, 300);
  }
  isCategoriasEditVisible.value = val;
};

const searchKeyword = ref('');
/*var filteredData = computed(() => {
  var data = categorias.value;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  var dataFiltrada = data.slice(start, end);
  totalPages.value = Math.ceil(categorias.value.length / itemsPerPage.value);
  //filteredData_2.value = filteredData
  return dataFiltrada;
});*/

var filteredData = computed(() => {
  var catag_list =  categorias.value.filter(item => {
    return (
      item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.id.includes(searchKeyword.value.toLowerCase())
    );
  });
  
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  var dataFiltrada = catag_list.slice(start, end);
  totalPages.value = Math.ceil(catag_list.length / itemsPerPage.value);
  //filteredData =  catag_list;
  
  return dataFiltrada;
});



</script>

<style type="text/css">
  .p-10 {
      padding: 12px;
  }
</style>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">
        <VTabs v-model="currentTab" class="v-tabs-pill">
            <VTab value="tab-lista">
              Listado
            </VTab>
            
            <!--<VTab value="tab-estadistica">Estadísticas</VTab> <VTab>Tab Three</VTab> -->
            </VTabs>

        <VCard class="mt-5" title="Banner personalizado">
                      
          <VWindow v-model="currentTab">
                 <VWindowItem value="tab-lista">
                  
                  <div class="pl-4">
                    <RouterLink to="./add">
                      <VBtn
                      color="primary"
                      variant="tonal"
                      >
                      Añadir nuevo registro
                    </VBtn> 
                  </RouterLink>
                    
                  </div>

                  <br>

                  <VCardText class="py-4 gap-0 w-100">  
                    <div style="width: 30%" class="d-flex gap-1 px-0  position-relative">
                        <VTextField
                          v-model="searchKeyword"
                          pattern="\d*"
                          placeholder="Buscar por id o por nombre..."
                          class="ms-0 me-1 chat-list-search"
                        >
                        </VTextField>
                    </div> 
                  </VCardText>
          <!--
          <VDivider />
                    
          <VCardText class="d-flex flex-wrap py-2 gap-2">
            <VSpacer />

            <div class="d-flex align-left flex-wrap gap-2">
              <VBtn
                prepend-icon="tabler-plus"
                @click="onFormAddCategoriasActive"
              >
                Agregar una categoría
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
                    -->
          <VTable class="text-no-wrap p-10">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Nombre para el banner</th>
                <th scope="col">IMG Escritorio</th>
                <th scope="col">IMG mobile</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr v-for="categoria in filteredData" style="height: 3.5rem">
                <!-- 👉 nombre modulo -->
                <td>
                  <div class="d-flex align-left">
                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        {{ categoria.id }}
                      </h6>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-left">
                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        {{ categoria.name }}
                      </h6>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-left">
                    <div class="d-flex flex-column pt-2 pb-2">
                      <img v-if="categoria.images.escritorio !== ''" :src="categoria.images.escritorio" width="175" class="img-intereses">
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-left">
                    <div class="d-flex flex-column">
                      <img v-if="categoria.images.mobile !== ''" :src="categoria.images.mobile" width="175" class="img-intereses">
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-left">
                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <div v-if="categoria.estado">
                          <VChip color="success">
                            Activo
                          </VChip>
                        </div>
                        <div v-else>
                          <VChip color="error">
                            Inactivo
                          </VChip>
                        </div>
                      </h6>
                    </div>
                  </div>
                </td>

                <td class="text-center" style="width: 5rem">
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="onFormCategoriasActive(categoria)"
                  >
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="error"
                    variant="text"
                    @click="onFormDelete(categoria)"
                  >
                    <VIcon size="22" icon="mdi-delete-forever" />
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>
          <VDivider />

          <div class="px-4 py-4">
            <v-btn
              :disabled="currentPage === 1"
              @click="currentPage -= 1"
              size="small"
              color="primary"
            >
              Anterior
            </v-btn>
            <span class="px-2"
              >{{ currentPage }} de {{ totalPages }} de un total de
              {{ categorias.length }} registros</span
            >

            <v-btn
              :disabled="currentPage === totalPages"
              @click="currentPage += 1"
              size="small"
              color="primary"
            >
              Siguiente
            </v-btn>
          </div>

          <VDialog
            :width="$vuetify.display.smAndDown ? 'auto' : 700"
            :model-value="isCategoriasEditVisible"
            @update:model-value="dialogCategoriasValueUpdate"
          >
            <!-- Dialog close btn -->
            <DialogCloseBtn @click="dialogCategoriasValueUpdate(false)" />

            <VCard class="pa-sm-14 pa-5">
              <VCardItem class="text-center">
                <VCardTitle class="text-h5 mb-3">
                  Editar banner
                </VCardTitle>
              </VCardItem>

              <VCardText>
                <!-- 👉 Form -->
                <VForm
                  class="mt-6"
                  @submit.prevent="onFormCategoriasSubmit(updateCategorias.id)"
                >
                  <VRow class="d-flex flex-wrap justify-center gap-4">
                    <!-- 👉 Nombre -->
                    <VCol cols="8">
                      <VTextField
                        v-model="updateCategorias.name"
                        label="Nombre del banner"
                      />
                    </VCol>

                    <VCol cols="8">
                      <VTextField
                        v-model="updateCategorias.images.escritorio"
                        label="Url para la imagen en escritorio"
                      />
                    </VCol>

                    <VCol cols="8">
                      <VTextField
                        v-model="updateCategorias.images.mobile"
                        label="Url para la imagen en mobile"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VSwitch
                        v-model="updateCategorias.estado"
                        density="compact"
                        label="Publicado"
                      />
                    </VCol>

                    <!-- 👉 Submit and Cancel -->
                    <VCol
                      cols="12"
                      class="d-flex flex-wrap justify-center gap-4"
                    >
                      <VBtn type="submit"> Enviar </VBtn>

                      <VBtn
                        color="secondary"
                        variant="tonal"
                        @click="onFormCategoriasReset"
                      >
                        Cancelar
                      </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
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
            </VWindowItem>
            <VWindowItem value="tab-estadistica">
                <!-- <p>Próximamente</p> -->
                <!-- <iframe src="http://localhost/ecuavisav2/servicios/embeds/sugerenciasAnalytics.html" frameborder="0"></iframe> <div>
                  <iframe style="background:#2f3349 ;" class="iframe-dark" src="https://ecuavisadev.netlify.app/servicios/embeds/interesAnalyticsDark.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>
                  <iframe class="iframe-light" src="https://ecuavisadev.netlify.app/servicios/embeds/interesAnalyticsLight.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>

                </div>-->
                



              </VWindowItem>
          </VWindow>
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
<style scoped>  
.v-card.v-theme--dark .iframe-dark {
  display: block;
}
.v-card.v-theme--dark .iframe-light{
  display: none;
}

.v-card.v-theme--light .iframe-dark{
  display: none;
}
.v-card.v-theme--light .iframe-light{
  display: block;
}
</style>
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

