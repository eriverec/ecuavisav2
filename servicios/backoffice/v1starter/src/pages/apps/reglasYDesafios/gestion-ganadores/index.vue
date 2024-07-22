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
                      <VBtn @click="handleClick(semana.name)" v-bind="props" color="success"> Agregar </VBtn>

                    </template>

                    <!-- Dialog close btn -->
                    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

                    <!-- Dialog Content -->
                    <VCard :title="`Agregar ganador de la ${weekNameSelect}`">
                      <VCardText>
                        <VForm ref="form">
                          <!-- <VCol cols="12">
                            <VSelect :items="weekOptions" v-model="selectedWeek" label="Seleccionar Semana"
                              density="compact" />
                          </VCol> -->
                          <VCol cols="12">
                            <VTextField label="ID" v-model="newWinner.id" density="compact" />
                          </VCol>
                          <VCol cols="12">
                            <VTextField label="Nombre" v-model="newWinner.name" density="compact" />
                          </VCol>
                          <VCol cols="12">
                            <VTextField label="Apellido" v-model="newWinner.surname" density="compact" />
                          </VCol>
                          <VCol cols="12">
                            <VTextField label="Correo Electrónico" v-model="newWinner.email" density="compact" />
                          </VCol>
                          <VCol cols="12">
                            <VTextField label="Teléfono" v-model="newWinner.telephone" density="compact" />
                          </VCol>
                        </VForm>
                        
                      </VCardText>
                      
                      <VCardText class="d-flex justify-end">
                        <VBtn @click="sendData">Enviar</VBtn>
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
                        <VBtn icon size="x-small" color="default" variant="text">
                        </VBtn>

                        <VBtn icon size="x-small" color="default" variant="text">
                          <VIcon size="22" icon="tabler-trash" />
                        </VBtn>


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
const weekNameSelect = ref('') 
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
    console.log(data.value);

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
  console.log(`Nombre de la semana actual: ${weekNameSelect.value}`);
};



// Función para enviar datos
const sendData = async () => {
  // Identificar la semana seleccionada
  const weekToUpdate = data.value.find(semana => semana.name === weekNameSelect.value);
  console.log('weekToUpdate',weekToUpdate);
  isDialogVisible.value = false;

  if (weekToUpdate) {
    // Añadir el nuevo ganador a la lista de ganadores de la semana seleccionada
    weekToUpdate.winners.push({ ...newWinner.value });

    try {
      const response = await axios.post('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador/ganador/add.php', data.value, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      
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
