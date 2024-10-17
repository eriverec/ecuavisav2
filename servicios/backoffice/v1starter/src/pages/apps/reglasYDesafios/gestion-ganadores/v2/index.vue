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
    title:"Semanal",
    value:"semanal",
  },{
    title:"Diario",
    value:"diario",
  }];

  const isLoadingSemana = ref(false);

  async function getSemanas(){
      try {
        isLoadingSemana.value = true;

        const consulta = await fetch('https://servicio-desafios.vercel.app/semana/all/get');
        const consultaJson = await consulta.json();

        let dataRaw = Array.from(consultaJson.data); 

        dataSemanas.value = dataRaw.map(item => ({
              title: item.titulo,
              descripcion: item.descripcion,
              value: item.descripcion.split(" ")[1]
        })).sort((a, b) => a.value - b.value);

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

  // Listar ganadores
  const dataGanadores = ref([]);
  const loadingGanadores = ref(false);
  const disabledBtnGanador = ref(false);

  const Getganadores = async () => {
    try {
      const response = await axios.get('https://estadisticas.ecuavisa.com/sites/gestor/Tools/ecuavisados/ganador_v2/ajax/listar_backoffice.php');
      dataGanadores.value = response.data.data;

      console.log(dataGanadores.value)

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
                    <VCol cols="12" md="7" lg="7">
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
                    <VCol cols="12" md="5" lg="5">
                      <VSelect
                        style="width: 100%;"
                        no-data-text="Error intente de nuevo"
                        :disabled="isLoadingSemana"
                        item-text="title"
                        item-value="value"
                        v-model="modelTipoGanador" 
                        :items="dataTipoGanador"
                        label="Seleccionar el tipo de ganador"
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
            <VExpansionPanels variant="accordion" v-model="panelSemana">
                <VExpansionPanel
                  v-for="item in 4"
                  :key="item"
                >
                  <VExpansionPanelTitle>
                    Semana {{ item }}
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    Sweet roll ice cream chocolate bar. Ice cream croissant sugar plum I love cupcake gingerbread liquorice cake. Bonbon tart caramels marshmallow chocolate cake icing icing danish pie.
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
