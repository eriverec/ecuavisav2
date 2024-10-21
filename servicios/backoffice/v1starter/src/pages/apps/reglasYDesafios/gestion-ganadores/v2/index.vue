<script setup>
  import Moment from 'moment';
  import axios from 'axios';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);

  const configSnackbar = ref({
      message: "Datos guardados",
      type: "success",
      model: false
  });

  // Modal ganador
  const dialogFormAgregarGanador = ref(false);

  function modalShowAndHide(){
    dialogFormAgregarGanador.value = !dialogFormAgregarGanador.value;
  }

  //Formulario de buscar usuario
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

  //Listar semanas
  const dataSemanas = ref([]);
  const modelSemana = ref(null);
  const modelTipoGanador = ref("diario");
  const dataTipoGanador = [{
    title:"Ganador Diario",
    value:"diario",
  },{
    title:"Ganador Semanal",
    value:"semanal",
  }];

  const isLoadingSemana = ref(false);
  const copyDataAll = ref([]);
  const copyDataAll_2 = ref([]);

  async function getSemanas(){
      try {
        isLoadingSemana.value = true;

        const consulta = await fetch('https://servicio-desafios.vercel.app/semana/all/get');
        const consultaJson = await consulta.json();

        let dataRaw = Array.from(consultaJson.data);

        var data_new = dataRaw.filter(item => {
          return item.repechaje == false;
        });

        data_new = data_new.map(item => ({
              title: item.titulo,
              descripcion: item.descripcion,
              value: item.descripcion.split(" ")[1]
        }))
        .sort((a, b) => a.value - b.value);

        data_new.push({
          title: "Ganador final",
          descripcion: "Ganador final",
          value: 5
        });

        dataSemanas.value = data_new;

        isLoadingSemana.value = false;
      } catch (error) {
        console.error(error.message);
        isLoadingSemana.value = false;
      }
  }

  watch(dialogFormAgregarGanador, (value) => {
    if(!value){
      clearSearchData()
    }
  });

  watch(modelSemana, (value) => {
    if(value == 5){
      modelTipoGanador.value = "diario"
    }
  });

  // Listar ganadores
  const dataGanadores = ref([]);
  const loadingGanadores = ref(false);
  const disabledBtnGanador = ref(false);

  const Getganadores = async () => {
    try {
      const response = await axios.get('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador_v2/ajax/listar_backoffice.php');

      copyDataAll.value = response.data.data;
      copyDataAll_2.value = response.data.data;

      const groupedData = response.data.data.reduce((result, item) => {
          // Si no existe la semana en el resultado, la inicializamos con un objeto vacío
          if (!result[item.semana]) {
              result[item.semana] = {};
          }

          // Si no existe el tipo dentro de la semana, lo inicializamos con un array vacío
          if (!result[item.semana][item.tipo]) {
              result[item.semana][item.tipo] = [];
          }

          // Añadimos el objeto actual al array correspondiente a la semana y tipo
          result[item.semana][item.tipo].push(item);

          return result;
      }, {});
      // console.log(groupedData)

      const newData = [];

      Object.entries(groupedData).forEach(([key, value]) => {
        
        const ganadores_semanales = value.hasOwnProperty("semanal") ? value.semanal : [];
        const ganadores_diarios = value.hasOwnProperty("diario") ? value.diario : [];
        const semana = key;

        newData.push({
          ganadores_semanales,
          ganadores_diarios,
          semana
        })

      });

      dataGanadores.value = newData;

      panelSemana.value = 0;
      currentTab.value[1] = 0;


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //Añadir ganador
  const newWinner = ref({
      "action": "",
      "semana": "",
      "tipo":"", //semanal
      "name": "",
      "last_name": "",
      "email": "",
      "telephone": ""
  });

  // Función para enviar datos
  const enviarData = async () => {
    disabledBtnGanador.value = true;
    // Identificar la semana seleccionada
    const weekToUpdate = modelSemana.value;
    const tipo = modelTipoGanador.value;
    const action = "add";

    if (weekToUpdate && selectedUsers.value.length > 0) {

      const newWinners = selectedUsers.value.map(user => ({
        // id: user.wylexId,
        name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        action,
        tipo,
        semana:weekToUpdate,
        telephone: user.phone || ''
      }));

      console.log(newWinners[0])

      try {
        const response = await axios.post('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador_v2/ajax/ajaxGanador.php', newWinners[0], {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        // console.log(response.data);
        // Limpiar datos después de enviar
        clearSearchData();
        dialogFormAgregarGanador.value = false;
        disabledBtnGanador.value = false;
        
        configSnackbar.value = {
            message: "Ganador guardado con éxito",
            type: "success",
            model: true
        };

        await Getganadores();

      } catch (error) {
        console.error('Error sending data:', error);

        configSnackbar.value = {
            message: "Ocurrió un error, intente nuevamente.",
            type: "error",
            model: true
        };
        disabledBtnGanador.value = false;
      }

      // Resetear los campos de entrada
      // newWinner.value = {
      //   id: '',
      //   name: '',
      //   last_name: '',
      //   email: '',
      //   telephone: ''
      // };
    }
  };

  // Panel semanal
  const panelSemana = ref(0)
  const isLoading = ref(false)
  const currentTab = ref({})

  // Eliminar ganador

  const error = ref(null);

  const deleteWinner = async (winnerId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este ganador?')) {
      // Encuentra la semana correcta

      isLoading.value = true;
      error.value = null;

      try {

        // Envía los datos actualizados al servidor
        const response = await axios.post('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador_v2/ajax/ajaxGanador.php', {
          "action":"elim",
          "id": winnerId,
        } , {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        await Getganadores()

        isLoading.value = false;
        isDialogBusquedaVisible.value = false;

        console.log('Ganador eliminado:', response.data);
      } catch (error) {
        console.error('Error al eliminar ganador:', error);
        error.value = 'Hubo un error al eliminar el ganador. Por favor, intenta de nuevo.';
        isLoading.value = false;
      }
      
    }
  };

  // Buscar ganadores

  const searchQuery = ref("");
  const searchGanadores = ref([]);

  const isDialogBusquedaVisible = ref(false)

  function buscarGanador(){
    isDialogBusquedaVisible.value = true;

    if (!searchQuery.value) {
      searchGanadores.value = [];
    }

    const query = searchQuery.value.trim().toLowerCase();

    searchGanadores.value = copyDataAll.value.filter(winner =>
      winner.name.toLowerCase().includes(query) ||
      winner.last_name.toLowerCase().includes(query) ||
      winner.email.toLowerCase().includes(query) ||
      winner.id.includes(query)
    );
  }

  watch(isDialogBusquedaVisible, (value) => {
    if(!value){
      copyDataAll.value = copyDataAll_2.value;
      searchQuery.value = "";
    }
  });

  onMounted(async()=>{
    await getSemanas()
    await Getganadores()
  })

</script>


<template>
  <section>

    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type">
        {{ configSnackbar.message }}
    </VSnackbar>

    <VDialog
      v-model="isDialogBusquedaVisible"
      width="700"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogBusquedaVisible = !isDialogBusquedaVisible" />

      <!-- Dialog Content -->
      <VCard :title="'Resultado de la búsqueda: '+ searchQuery.trim()">
        <VCardText>
          <VTable class="text-no-wrap tabla_ganadores table-sm">
            <thead>
              <tr>
                <th scope="col" class="col-cr" title="click para ordenar">
                  <div class="row-cr">
                    <div>
                      Nombres
                    </div>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar">
                  <div class="row-cr">
                    <div>Correo</div>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar">
                  <div class="row-cr">
                    <div>Semana</div>
                  </div>
                </th>
                <th scope="col" class="col-cr" title="click para ordenar">
                  <div class="row-cr">
                    <div>Tipo</div>
                  </div>
                </th>

                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody v-if="searchGanadores.length > 0">
              <tr class="listadoGen" v-for="ganadores in searchGanadores" :key="ganadores.id"
                style="height: 3.75rem">
                <!-- 👉 nombre -->
                <td>
                  <span class="text-sm">{{ ganadores.name }} {{ ganadores.last_name }}</span>
                </td>

                <!-- 👉 email -->
                <td>
                  <span class="text-sm">{{ ganadores.email.toLowerCase() }}</span>
                </td>

                <!-- 👉 telefono -->
                <td>
                  <span class="text-base">{{ ganadores.semana == "5" ? "Ganador final" : "Semana "+ ganadores.semana }}</span>
                </td>
                <td>
                  <span class="text-base">{{ ganadores.tipo }}</span>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text"
                    @click="deleteWinner(ganadores.id)">
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

            <tfoot v-else>
              <tr>
                <td colspan="5" class="text-center">No hay datos</td>
              </tr>
            </tfoot>
          </VTable>
        </VCardText>
        <VCardText class="d-flex justify-end">
          <VBtn @click="isDialogBusquedaVisible = false">
            Cerrar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="dialogFormAgregarGanador"
      width="600"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="dialogFormAgregarGanador = !dialogFormAgregarGanador" />
        <!-- Dialog Content -->
        <VCard title="Agregar ganador">

          <VCardText>
            <div>
                <label>Buscar el usuario</label>

                <div class="d-flex gap-4 align-center mt-2" style="width:100%">
                  <VTextField v-model="searchTerm" @keyup.enter="startSearch($event)" style="max-width: 400px;"
                    label="Buscar por correo..." />

                  <VBtn :loading="loadings[0]" :disabled="loadings[0]" color="primary" size="small"
                    icon="tabler-search" @click="startSearch" />

                  <VBtn color="secondary" variant="text" size="small" @click="clearSearchData">
                    <VIcon start icon="tabler-restore" />
                    Resetear
                  </VBtn>
                </div>

              </div>
              <VForm ref="form">
                <!-- Lista de usuarios seleccionados -->
                <div v-if="selectedUsers.length > 0" class="mt-4">
                  <h3>Usuario seleccionado:</h3>

                  <VChip v-for="user in selectedUsers" :key="user._id" class="ma-1" color="success" closable
                    @click:close="selectUser(user)">
                    {{ user.last_name + ' ' + user.first_name }}
                  </VChip>

                </div>

                <div v-if="loading" style="height: 50px;" class="d-flex align-center justify-center ">
                  Buscando usuarios...</div>

                <div v-else-if="searchResults.length > 0 && selectedUsers.length == 0">
                  <VTable style="width: 100%;" class="text-no-wrap tableNavegacion mb-5 mt-5" hover="true">
                    <thead>
                      <tr>
                        <th scope="col">USUARIO</th>
                        <th scope="col">CORREO</th>
                        <th scope="col">ACCIÓN</th>
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
                        <td>
                          <VBtn color="success" size="small"> Seleccionar </VBtn>
                        </td>
                      </tr>

                    </tbody>


                  </VTable>
                  <VPagination v-if="total > limit" v-model="page" size="small" :total-visible="5"
                    :length="totalPages" @update:model-value="updatePage" />

                </div>

                <div class="content-form mt-5">
                  <VRow>
                    <VCol cols="12" :md="modelSemana==5?'12':'7'" :lg="modelSemana==5?'12':'7'">
                      <VSelect
                        style="width: 100%;"
                        no-data-text="No existen semanas que mostrar"
                        append-icon="mdi-refresh"
                        @click:append="getSemanas"
                        :disabled="isLoadingSemana"
                        item-text="title"
                        item-value="value"
                        v-model="modelSemana" 
                        :items="dataSemanas"
                        label="Seleccionar la semana"
                        class="mt-2"
                        :menu-props="{ maxHeight: '400' }">
                        <template #selection="{ item }">
                              <div>
                                  {{ item.title }}
                              </div>
                          </template>
                          <template #item="{ item, props }">
                              <v-list-item v-bind="props">
                                  <v-list-item-content>
                                      <v-list-item-subtitle>
                                          <small>{{ item.raw.descripcion }}</small>
                                      </v-list-item-subtitle>
                                  </v-list-item-content>
                              </v-list-item>
                          </template>
                      </VSelect>
                    </VCol>
                    <VCol cols="12" md="5" lg="5" :class="modelSemana==5?'d-none':''">
                      <VSelect
                        style="width: 100%;"
                        no-data-text="Error intente de nuevo"
                        :disabled="isLoadingSemana"
                        item-text="title"
                        item-value="value"
                        v-model="modelTipoGanador" 
                        :items="dataTipoGanador"
                        label="Tipo de ganador"
                        class="mt-2"
                        :menu-props="{ maxHeight: '400' }"/>
                    </VCol>
                    <VCol
                      cols="12"
                      class="d-flex gap-4"
                    >
                      <VBtn @click="enviarData" :disabled="!(selectedUsers.length > 0) || disabledBtnGanador">
                        Guardar ganador
                      </VBtn>
                    </VCol>
                  </VRow>
                </div>

              </VForm>
          </VCardText>
        </VCard>
      </VDialog>

    <VRow>
      <VCol class="mt-0" cols="12" md="12" lg="12" >
        <VCard>
          <VCardItem>
            <div class="p-0 d-flex flex-column align-items-start">
              <VCardTitle>
                Ganadores ecuavisados
              </VCardTitle>
              <VCardSubtitle>
                Ingresa los ganadores por semana en ecuavisados
              </VCardSubtitle>
            </div>
            <template #append>
              <div class="d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
                <VBtn @click="modalShowAndHide" v-bind="props" color="success"> Agregar ganador </VBtn>
              </div> 
            </template>
          </VCardItem>

          <VCardText>
            <div class="hoItems d-flex gap-4 mb-5" style="max-width: 500px;">

              <VTextField v-model="searchQuery" placeholder="Buscar..." density="compact" label="Buscar por nombre o correo"/>

              <VBtn color="primary" @click="buscarGanador">
                Buscar ganador
              </VBtn>

            </div>
            <VExpansionPanels variant="accordion" v-model="panelSemana">
                <VExpansionPanel
                  v-for="ganador in dataGanadores"
                  :key="ganador.semana"
                >
                  <VExpansionPanelTitle>
                    {{ ganador.semana == 5 ? "Ganador final" : "Semana "+ganador.semana }}
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    
                    <VTabs
                      v-model="currentTab[ganador.semana]"
                      class="v-tabs-pill"
                    >
                      <VTab>{{ ganador.semana == 5 ? "Ganador final" : "Ganadores diarios" }}</VTab>
                      <VTab :class="ganador.semana == 5 ? 'd-none': ''" >Ganadores semanales</VTab>
                    </VTabs>

                    <VCard class="mt-5">
                      <VCardText>
                        <VWindow v-model="currentTab[ganador.semana]">
                          <VWindowItem>
                            
                            <VTable class="text-no-wrap tabla_ganadores">
                              <thead>
                                <tr>
                                  <th scope="col" class="col-cr" title="click para ordenar">
                                    <div class="row-cr">
                                      <div>
                                        Nombres
                                      </div>
                                    </div>
                                  </th>
                                  <th scope="col" class="col-cr" title="click para ordenar">
                                    <div class="row-cr">
                                      <div>Correo</div>
                                    </div>
                                  </th>
                                  <th scope="col" class="col-cr" title="click para ordenar">
                                    <div class="row-cr">
                                      <div>Telefono</div>
                                    </div>
                                  </th>

                                  <th scope="col">Acciones</th>
                                </tr>
                              </thead>
                              <tbody v-if="ganador.ganadores_diarios.length > 0">
                                <tr class="listadoGen" v-for="ganadores_diarios in ganador.ganadores_diarios" :key="ganadores_diarios.id"
                                  style="height: 3.75rem">
                                  <!-- 👉 nombre -->
                                  <td>
                                    <span class="text-sm">{{ ganadores_diarios.name }} {{ ganadores_diarios.last_name }}</span>
                                  </td>

                                  <!-- 👉 email -->
                                  <td>
                                    <span class="text-sm">{{ ganadores_diarios.email.toLowerCase() }}</span>
                                  </td>

                                  <!-- 👉 telefono -->
                                  <td>
                                    <span class="text-base">{{ ganadores_diarios.telephone }}</span>
                                  </td>

                                  <!-- 👉 Actions -->
                                  <td class="text-center" style="width: 5rem">
                                    <VBtn icon size="x-small" color="default" variant="text"
                                      @click="deleteWinner(ganadores_diarios.id)">
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

                              <tfoot v-else>
                                <tr>
                                  <td colspan="4" class="text-center">No hay datos</td>
                                </tr>
                              </tfoot>
                            </VTable>


                          </VWindowItem>
                          <VWindowItem>
                            
                            <VTable class="text-no-wrap tabla_ganadores">
                              <thead>
                                <tr>
                                  <th scope="col" class="col-cr" title="click para ordenar">
                                    <div class="row-cr">
                                      <div>
                                        Nombres
                                      </div>
                                    </div>
                                  </th>
                                  <th scope="col" class="col-cr" title="click para ordenar">
                                    <div class="row-cr">
                                      <div>Correo</div>
                                    </div>
                                  </th>
                                  <th scope="col" class="col-cr" title="click para ordenar">
                                    <div class="row-cr">
                                      <div>Telefono</div>
                                    </div>
                                  </th>

                                  <th scope="col">Acciones</th>
                                </tr>
                              </thead>
                              <tbody v-if="ganador.ganadores_semanales.length > 0">
                                <tr class="listadoGen" v-for="ganadores_diarios in ganador.ganadores_semanales" :key="ganadores_diarios.id"
                                  style="height: 3.75rem">
                                  <!-- 👉 nombre -->
                                  <td>
                                    <span class="text-sm">{{ ganadores_diarios.name }} {{ ganadores_diarios.last_name }}</span>
                                  </td>

                                  <!-- 👉 email -->
                                  <td>
                                    <span class="text-sm">{{ ganadores_diarios.email.toLowerCase() }}</span>
                                  </td>

                                  <!-- 👉 telefono -->
                                  <td>
                                    <span class="text-base">{{ ganadores_diarios.telephone }}</span>
                                  </td>

                                  <!-- 👉 Actions -->
                                  <td class="text-center" style="width: 5rem">
                                    <VBtn icon size="x-small" color="default" variant="text"
                                      @click="deleteWinner(ganadores_diarios.id)">
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

                              <tfoot v-else>
                                <tr>
                                  <td colspan="4" class="text-center">No hay datos</td>
                                </tr>
                              </tfoot>
                            </VTable>


                          </VWindowItem>
                        </VWindow>
                      </VCardText>
                    </VCard>

                  </VExpansionPanelText>
                </VExpansionPanel>
              </VExpansionPanels>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

  </section>
</template>

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
