<template>
  <section>

    <VCard class="mt-5">
      <VCardText>
        <VCardTitle>
          Listado de ganadores
        </VCardTitle>
        <VCardSubtitle>Gestión de los ganadores por semana</VCardSubtitle>

        <div v-if="data.length == 0">Cargando...</div>

        <VList v-else class="card-list mt-4">
          <VExpansionPanels variant="accordion">
            <VExpansionPanel v-for="(semana, index) in data" :key="index">
              <VExpansionPanelTitle class="text-uppercase text-primary">
                {{ semana.name }}
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <!-- {{ winner.name }} {{ winner.surname }} - {{ winner.email }} - {{ winner.telephone }} -->

                <div class="headerOpciones my-3">
                  <div class="hoItems">
                    <VTextField style="width: 200px;" v-model="searchQuery" placeholder="Buscar..." density="compact" />

                  </div>



                  <VDialog v-model="isDialogVisible" width="500">
                    <!-- Activator -->
                    <template #activator="{ props }">
                      <VBtn @click="handleClick(semana.name)" v-bind="props" color="success"> Agregar ganador </VBtn>

                    </template>

                    <!-- Dialog close btn -->
                    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

                    <!-- Dialog Content -->
                    <VCard :title="`Agregar ganador de la ${weekNameSelect}`">
                      <VCardText>
                        <div class="d-flex gap-4 align-center">
                          <VTextField v-model="searchTerm" @keyup.enter="startSearch($event)" style="max-width: 400px;"
                            label="Buscar..." />
                          <!-- <VBtn @click="startSearch" color="primary">
                            Buscar
                          </VBtn> -->

                          <VBtn :loading="loadings[0]" :disabled="loadings[0]" color="primary" size="small"
                            icon="tabler-search" @click="startSearch" />
                          <VBtn color="secondary" variant="text" size="small" @click="clearSearchData">
                            <VIcon start icon="tabler-restore" />
                            Resetear
                          </VBtn>
                        </div>
                        <VForm ref="form">
                          <!-- <VCol cols="12">
                            <VSelect :items="weekOptions" v-model="selectedWeek" label="Seleccionar Semana"
                              density="compact" />
                          </VCol> -->
                          <!-- Lista de usuarios seleccionados -->
                          <div v-if="selectedUsers.length > 0" class="mt-4">
                            <h3>Usuarios seleccionados para guardar:</h3>
                            <VChip v-for="user in selectedUsers" :key="user._id" class="ma-1" color="success" closable
                              @click:close="selectUser(user)">
                              {{ user.last_name + ' ' + user.first_name }}
                            </VChip>
                          </div>
                          <div v-if="loading" style="height: 400px;" class="d-flex align-center justify-center ">
                            Cargando...</div>
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
                                  @click="selectUser(user)">
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
                            <VPagination v-if="total > limit" v-model="page" size="small" :total-visible="5"
                              :length="totalPages" @update:model-value="updatePage" />

                          </div>

                        </VForm>

                      </VCardText>

                      <VCardText class="d-flex justify-end">
                        <div v-if="selectedUsers.length === 0"></div>
                        <VBtn v-else size="small" @click="sendData" :disabled="selectedUsers.length === 0">Guardar</VBtn>
                      </VCardText>
                    </VCard>
                  </VDialog>
                </div>


                <VTable class="text-no-wrap tabla_ganadores">

                  <thead>
                    <tr>
                      <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('first_name')">
                        <div class="row-cr">
                          <div>
                            Nombres
                          </div>
                        </div>
                      </th>
                      <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('provider')">
                        <div class="row-cr">
                          <div>Correo</div>
                        </div>
                      </th>
                      <th scope="col" class="col-cr" title="click para ordenar" @click="sortTable('created_at')">
                        <div class="row-cr">
                          <div>Telefono</div>
                        </div>
                      </th>

                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>

                  <tfoot v-if="filteredWinners(semana.winners).length == 0">
                    <tr>
                      <td colspan="5">
                        <p>No hay datos para mostrar</p>
                      </td>
                    </tr>
                  </tfoot>
                  <tbody v-else>

                    <tr class="listadoGen" v-for="winner in filteredWinners(semana.winners)" :key="winner.id"
                      style="height: 3.75rem">
                      <!-- 👉 nombre -->
                      <td>
                        <span class="text-sm">{{ winner.name }}</span>
                      </td>

                      <!-- 👉 email -->
                      <td>
                        <span class="text-sm">{{ winner.email }}</span>
                      </td>

                      <!-- 👉 telefono -->
                      <td>
                        <span class="text-base">{{ winner.telephone }}</span>
                      </td>

                      <!-- 👉 Actions -->
                      <td class="text-center" style="width: 5rem">
                        <VBtn icon size="x-small" color="default" variant="text"
                          @click="deleteWinner(semana.name, winner.id)">
                          <VIcon size="22" color="error" icon="tabler-trash" />
                        </VBtn>
                        <VAlert v-if="error" type="error" class="mt-4">
                          {{ error }}
                        </VAlert>

                        <VOverlay :model-value="isLoading" class="align-center justify-center">
                          <VProgressCircular indeterminate size="64" />
                        </VOverlay>
                      </td>
                    </tr>
                  </tbody>

                </VTable>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>

        </VList>
      </VCardText>
    </VCard>


    <!-- SnackBar -->
    <VSnackbar v-model="isSnackbarVisible" location="top" color="error">
      No se han encontrado resultados
    </VSnackbar>

    <!-- SnackBar -->
  <VSnackbar v-model="isSnackbarExito" location="top" color="success">
    Información guardada con éxito
  </VSnackbar>
  </section>
</template>

<style>
.tabla_ganadores {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.headerOpciones {
  display: flex;
  justify-content: space-between;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const data = ref([]);
const weekOptions = ref([]);
const searchQuery = ref('');
const isDialogVisible = ref(false);
const weekNameSelect = ref('');

const isLoading = ref(false);
const error = ref(null);

// Nuevo ganador
const newWinner = ref({
  id: '',
  name: '',
  surname: '',
  email: '',
  telephone: ''
});

// Semana seleccionada
const selectedWeek = ref('');

const fetchData = async () => {
  try {
    const response = await axios.get('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador/ganador/listar_backoffice.php');
    data.value = response.data;

    // Llenar weekOptions con los nombres de las semanas
    weekOptions.value = data.value.map(semana => semana.name);

    // Seleccionar la primera semana por defecto
    if (weekOptions.value.length > 0) {
      selectedWeek.value = weekOptions.value[0];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Función para filtrar ganadores
const filteredWinners = (winners) => {
  if (!searchQuery.value) {
    return winners;
  }
  const query = searchQuery.value.toLowerCase();
  return winners.filter(winner =>
    winner.name.toLowerCase().includes(query) ||
    winner.surname.toLowerCase().includes(query) ||
    winner.email.toLowerCase().includes(query) ||
    winner.id.includes(query)
  );
};

// Función para manejar el clic en el botón
const handleClick = (weekName) => {
  weekNameSelect.value = weekName
  // console.log(`Nombre de la semana actual: ${weekNameSelect.value}`);
};

// Función para enviar datos
const sendData = async () => {
  // Identificar la semana seleccionada
  const weekToUpdate = data.value.find(semana => semana.name === weekNameSelect.value);
  // console.log('weekToUpdate', weekToUpdate);

  if (weekToUpdate && selectedUsers.value.length > 0) {

    const newWinners = selectedUsers.value.map(user => ({
      id: user.wylexId,
      name: user.first_name,
      surname: user.last_name,
      email: user.email,
      telephone: user.phone || ''
    }));

    weekToUpdate.winners = [...weekToUpdate.winners, ...newWinners];

    try {
      const response = await axios.post('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador/ganador/add.php', data.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // console.log(response.data);
      // Limpiar datos después de enviar
      clearSearchData();
      isDialogVisible.value = false;
      isSnackbarExito.value = true;

    } catch (error) {
      console.error('Error sending data:', error);
    }

    // Resetear los campos de entrada
    newWinner.value = {
      id: '',
      name: '',
      surname: '',
      email: '',
      telephone: ''
    };
  }
};

const deleteWinner = async (weekName, winnerId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este ganador?')) {
    // Encuentra la semana correcta
    const weekToUpdate = data.value.find(semana => semana.name === weekName);

    isLoading.value = true;
    error.value = null;

    try {
      if (weekToUpdate) {
        weekToUpdate.winners = weekToUpdate.winners.filter(winner => winner.id !== winnerId);
        try {
          // Envía los datos actualizados al servidor
          const response = await axios.post('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador/ganador/add.php', data.value, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          // console.log('Ganador eliminado:', response.data);
        } catch (error) {
          console.error('Error al eliminar ganador:', error);
        }
      }
      isLoading.value = false;
    } catch (err) {
      console.error('Error al eliminar ganador:', err);
      error.value = 'Hubo un error al eliminar el ganador. Por favor, intenta de nuevo.';
      isLoading.value = false;

    }
  }
};

const searchTerm = ref('');
const searchResults = ref([]);
const isSnackbarVisible = ref(false);
const isSnackbarExito = ref(false);
const loading = ref(false);
const loadings = ref([]);
const page = ref(1);
const limit = ref(5);
const total = ref(0);
const totalPages = computed(() => Math.ceil(total.value / limit.value));
const selectedUsers = ref([]);

const startSearch = (event) => {
  if (event) {
    event.preventDefault(); // Previene el comportamiento por defecto
  }
  loadings.value[0] = true;
  page.value = 1; // Reinicia la página a 1 al realizar una nueva búsqueda
  searchResults.value = []; // Limpiar resultados anteriores
  search();
};

const clearSearchData = () => {
  searchTerm.value = '';
  searchResults.value = [];
  selectedUsers.value = [];
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
      isSnackbarVisible.value = true;
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
  } finally {
    loading.value = false;
    loadings.value[0] = false;
  }
};

const selectUser = (user) => {
  const index = selectedUsers.value.findIndex(u => u._id === user._id);
  if (index === -1) {
    selectedUsers.value.push(user);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

const updatePage = (newPage) => {
  page.value = newPage;
  search();
};



onMounted(() => {
  fetchData();
});



</script>

<style scoped>
h1 {
  text-align: center;
}

h2 {
  color: #2c3e50;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
}
</style>
