<template>
  <section>


    <VRow>
      <VCol cols="7">
        <VCard class="mt-4" title="Recompensas" style="height: 100%;">
          <VCardText>
            <div class="d-flex gap-4">
              <VTextField v-model="searchTerm" @keyup.enter="startSearch" style="max-width: 400px;" label="Buscar..." />
              <!-- <VBtn @click="startSearch" color="primary">
                Buscar
              </VBtn> -->

              <VBtn :loading="loadings[0]" :disabled="loadings[0]" color="primary" size="small" icon="tabler-search"
                @click="startSearch" />
            </div>
            <div v-if="loading" style="height: 400px;" class="d-flex align-center justify-center ">Cargando...</div>
            <div v-else-if="searchResults.length > 0">
              <VTable style="width: 100%;" class="text-no-wrap tableNavegacion mb-5 mt-5" hover="true">
                <thead>
                  <tr>
                    <th scope="col">USUARIO</th>
                    <th scope="col">CORREO</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="user in searchResults" :key="user._id"
                    :class="{ 'opacity-50': userClicked && userClickedId === user.wylexId }"
                    @click="handleUserClick(user.wylexId)">
                    <td>
                      {{ (user.last_name + ' ' + user.first_name).length > 25 ? (user.last_name + ' ' +
                        user.first_name).substring(0,
                          25) + "..." : (user.last_name + ' ' + user.first_name) }}
                    </td>
                    <td class="text-medium-emphasis">
                      {{ user.email }}
                    </td>

                  </tr>

                </tbody>


              </VTable>
              <VPagination v-if="total > limit" v-model="page" size="small" :total-visible="5" :length="totalPages"
                @update:model-value="updatePage" />

            </div>
            <!-- <div class="mt-4" v-else>No hay datos</div> -->



          </VCardText>
        </VCard>

      </VCol>
      <!-- <div v-if="cargandoUser" class="d-flex align-center justify-center ">Cargando...</div> -->
      <VCol cols="5" v-if="selectedUserDetails">
        <VCard class="mt-4" title="Información detalla" style="height: 100%;">
          <VCardText>
            <div v-if="cargandoUser" class="d-flex align-center justify-center ">Cargando...</div>
            <div v-else-if="selectedUserDetails">
              <ul>
                <li v-for="(item, index) in selectedUserDetails.data" :key="index">
                  <p>{{ item.title }}</p>
                  <!-- <p>{{ item.section }}</p> -->
                </li>
              </ul>
            </div>
            <div v-else>No se encontro información</div>
          </VCardText>
        </VCard>

      </VCol>
      <!-- <div v-else>No se encontro información</div> -->

    </VRow>



  </section>

  <!-- SnackBar -->
  <VSnackbar v-model="isSnackbarVisible" location="top" color="error">
    No se han encontrado resultados
  </VSnackbar>

  <!-- SnackBar -->
  <VSnackbar v-model="isSnackbarDetails" location="top" color="error">
    No se encontro información
  </VSnackbar>
</template>
<style>
.opacity-50 {
  /* opacity: 0.5; */
  background-color: #00000012;
 
}

</style>
<script setup>
import { ref } from 'vue';

const searchTerm = ref('');
const searchResults = ref([]);
const loading = ref(false);
const cargandoUser = ref(false);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const selectedUserDetails = ref(null);
const loadings = ref([]);
const totalPages = computed(() => Math.ceil(total.value / limit.value));
const isSnackbarVisible = ref(false);
const isSnackbarDetails = ref(false);
const userClicked = ref(false);
const userClickedId = ref(null);


const startSearch = () => {
  loadings.value[0] = true;
  page.value = 1; // Reinicia la página a 1 al realizar una nueva búsqueda
  search();
};

const search = async () => {
  loading.value = true;
  // searchResults.value = [];
  try {
    // const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${searchTerm.value}`);
    const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${searchTerm.value}&page=${page.value}&limit=${limit.value}`);
    const data = await response.json();
    if (data.resp) {
      searchResults.value = data.data;
      total.value = data.total;
    } else {
      searchResults.value = [];
      total.value = 0;
      console.log("no hay nada para mostrar");
      isSnackbarVisible.value = true;
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
  } finally {
    loading.value = false;
    loadings.value[0] = false;
  }
};

const updatePage = (newPage) => {
  page.value = newPage;
  search();
};

const handleUserClick = async (wylexId) => {
  cargandoUser.value = true;
  userClicked.value = true;
  userClickedId.value = wylexId;
  try {
    const response = await fetch(`https://servicio-de-actividad.vercel.app/recomendadasv2/${wylexId}`);
    const data = await response.json();
    if (data.resp && data.data.length > 0) {
      selectedUserDetails.value = data;
    } else {
      selectedUserDetails.value = null;
      isSnackbarDetails.value = true;
    }
  } catch (error) {
    console.error('Error al obtener detalles del usuario:', error);
    selectedUserDetails.value = null;
  } finally {
    cargandoUser.value = false;
    // userClicked.value = false;
  }
};
</script>