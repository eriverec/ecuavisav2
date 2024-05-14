<script setup>
  const currentTab = ref('tab-lista');

  const dataUsersTestList = ref([]);
  const dataUsersTest = ref([]);

  const cambioDelListado = ref(false);

  const disabledViewList = ref(false);

  const timeoutId = ref(null);

  const isDialogVisibleDelete = ref(null);
  const idToDelete = ref('');

  //Variable para los mensajes de respuestas
  const configSnackbar = ref({
      message: "Datos guardados",
      type: "success",
      model: false
  });

  const labelError = ref({
    mensaje: "",
    visible: false
  });

  //Modal de usuario
  const isDialogSearchUser = ref(false);
  const isLoadingDialogUser = ref(false);

  /*Inicio manejar el paginado*/
  const itemsPerPage = 8;
  const currentPage = ref(1);

  const paginatedUserTest = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return dataUsersTestList.value.slice(start, end);
  });

  const nextPage = () => {
    if (currentPage.value * itemsPerPage < dataUsersTestList.value.length) currentPage.value++;
  };

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };
  /*Fin manejar el paginado*/

  //Funciones
  async function add_user  (){
    isDialogSearchUser.value = true;
    isLoadingDialogUser.value = true;
    if(cambioDelListado.value){
      await obtenerDataUsers();
    }
    isLoadingDialogUser.value = false;
  }

  async function filtrarUsuariosUser(textoBusqueda) {
    try {
      isLoadingDialogUser.value = true;
      const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${encodeURIComponent(textoBusqueda)}`);
      const data = await response.json();
      isLoadingDialogUser.value = false;
      // Manejar la respuesta de la API según tus necesidades

      if(!data.resp){
        labelError.value.mensaje = data.error;
        labelError.value.visible = true;
      }else{
        dataUsersTest.value = data.data
        labelError.value.visible = false;
        cambioDelListado.value = true;
      }

      // console.log(data.data);
    } catch (error) {
      // Manejar errores en la llamada a la API
      console.error(error);
    }
  }

  function handleInput(event) {
    // console.log(event.target.value);
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      console.log(event)
      await filtrarUsuariosUser(event.target.value);
    }, 1000); // Espera 1000 milisegundos antes de realizar la llamada
  }

  async function getUsersTest(page = 1, limit= 10){
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        var response = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/usertester/usertester/listar.php`, requestOptions);
        const data = await response.json();
        dataUsersTestList.value = data;
        
    } catch (error) {
        return console.error(error.message);    
    }
  }

  async function resolveUsuario(item){
    try{
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({  
            "name": `${item.first_name} ${item.last_name}`,
            "userId": item.wylexId, 
            "email": item.email
        }),
        redirect: 'follow'
      };

      isLoadingDialogUser.value = true;

      var response = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/usertester/usertester/add.php`, requestOptions);
      const data = await response.json();

      isLoadingDialogUser.value = false;

      if(data.resp){
        configSnackbar.value = {
            message: "Usuario añadido",
            type: "success",
            model: true
        };
        await getUsersTest();
        isDialogSearchUser.value = false;
        return true;
      }else{
        configSnackbar.value = {
            message: data.mensaje,
            type: "error",
            model: true
        };
        isDialogSearchUser.value = true;
        return false;
      }
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo cargar los usuarios, intente nuevamente",
            type: "error",
            model: true
        };

        isDialogSearchUser.value = true;
        console.log(error)
        return [];    
    }
  }

  async function obtenerDataUsers() {
    try{
      const respuesta = await fetch(`https://ads-service.vercel.app/busqueda/user/`); 
      const datos = await respuesta.json();
      dataUsersTest.value = datos.data;
      cambioDelListado.value = false;
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo cargar los usuarios, intente nuevamente",
            type: "error",
            model: true
        };
        console.log(error)
        return [];    
    }
  }

  onMounted(async ()=>{
    await getUsersTest();
    await obtenerDataUsers();
  })

  //Listar los usuarios
  const filteredDataUsers = computed(() => {
    return dataUsersTest.value;
  });

  function onDelete(id) {    
      isDialogVisibleDelete.value = true;
      idToDelete.value = id;   
  }

  async function deleteConfirmed() {
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/usertester/usertester/eliminar.php?id=' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Usuario eliminado correctamente",
            type: "success",
            model: true
        };
    } else {
        configSnackbar.value = {
            message: respuesta.mensaje,
            type: "error",
            model: true
        };
    }
    await getUsersTest();
    isDialogVisibleDelete.value = false;
}

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
      v-model="isDialogSearchUser"
      persistent
      class="v-dialog-lg" >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogSearchUser = !isDialogSearchUser" />

      <!-- Dialog Content -->
      <VCard title="Lista de usuarios">
        <VCardSubtitle class="pl-6 mb-3">
          Solo se obtendrá los 20 primeros registros de acuerdo a la búsqueda.
        </VCardSubtitle>
        <VCardText>
          <VTextField 
            :disabled="isLoadingDialogUser" 
            append-inner-icon="tabler-user-search" 
            type="text"  
            @input="handleInput" 
            label="Buscar por correo, teléfono o nombre" 
            placeholder="Buscar usuarios" />

          <VChip color="error" v-if="labelError.visible" class="mt-2">
            Error: {{labelError.mensaje}}
          </VChip>
          <br>
          <VTable style="width: 100%;" class="text-no-wrap tableNavegacion mb-5" hover="true">
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col">Correo</th>
                <th scope="col">Agregar</th>
              </tr>
            </thead>

            <tbody>
              <tr 
                v-if="dataUsersTest.length > 0"
                v-for="item in filteredDataUsers" 
                :key="item.userId" 
                class="" 
              >
                <td>
                  {{ (item.last_name+' '+item.first_name).length > 25 ? (item.last_name+' '+item.first_name).substring(0, 25) + "..." : (item.last_name+' '+item.first_name) }}
                  <br><b>_id: </b><small>{{ item._id }}</small>
                </td>
                <td class="text-medium-emphasis">
                  {{ item.email }}
                </td>
                <td class="text-medium-emphasis">
                  <VBtn :disabled="isLoadingDialogUser" class="mt-4" color="success" @click="resolveUsuario(item)" icon="mdi-plus-circle-outline" variant="text"></VBtn>
                </td>

              </tr>
              <tr v-else>
                <td colspan="3">No hay datos</td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="isDialogVisibleAddModulo"
      width="600">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleAddModulo = !isDialogVisibleAddModulo" />

      <VCard>
        <!-- Dialog Content -->
        <moduloTemplate @get:eventModalCR="receiveTime" />
      </VCard>
    </VDialog>

    <VDialog
      v-model="isDialogVisibleDelete"
      persistent
      class="v-dialog-sm">

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisibleDelete = false"
          >
            No, cerrar
          </VBtn>
          <VBtn @click="deleteConfirmed">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12">
    

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div
                  class="d-flex flex-wrap py-4 gap-4 align-items-center"
                  style="justify-content: space-between;"
                >
                  <div>
                    <VCardTitle>
                      Listado de usuarios que podrán ver nuevas funcionalidades
                    </VCardTitle>
                    <VCardSubtitle> Mantenimiento de usuarios tester </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <VBtn color="success" class="mb-4" @click="add_user">
                    Añadir usuarios
                    <VIcon end icon="mdi-account-plus" />
                  </VBtn>
                  <br>
                  <small class="pl-3">Total de usuarios añadidos: {{dataUsersTestList.length}}</small>
                  <VList lines="two" border v-if="dataUsersTestList.length < 1">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  <VList lines="two" border  v-if="dataUsersTestList.length > 0">
                    <template
                      v-for="(userTest, index) of paginatedUserTest"
                      :key="index">
                      <VListItem :disabled="disabledViewList">
                        <VListItemTitle>
                          <div class="nombre-desafio d-flex flex-column">
                            <div class="d-flex">
                              <small>Usuario</small>
                              <small class="text-disabled">
                                <code class="p-0"><b>_id:</b>{{ userTest.id }}</code>
                              </small>
                            </div>
                            <label>{{ userTest.name }}</label>
                            <div class="content-items d-flex">
                              <div class="content-userTest">
                                <VIcon
                                  size="20"
                                  icon="tabler-mail"
                                />
                                {{ userTest.email }}
                              </div>
                              <div class="content-time pl-3">
                                <VIcon
                                  size="20"
                                  icon="tabler-user"
                                />
                                <b>UserId: </b> {{ userTest.userId }}
                              </div>
                            </div>
                          </div>
                        </VListItemTitle>

                        <template #append>
                          <div class="espacio-right-2">

                            <VBtn
                              title="Eliminar el registro"
                              icon
                              size="x-small"
                              color="error"
                              variant="text"
                              @click="onDelete(userTest.id)"
                            >
                              <VIcon
                                size="22"
                                icon="tabler-trash"
                              />
                            </VBtn>

                            
                          </div>
                        </template>
                      </VListItem>
                      <VDivider v-if="index < paginatedUserTest.length - 1" />
                    </template>
                  </VList>
                
                  <div class="d-flex align-center justify-space-between botonescurrentPage">
                      <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                      Página {{ currentPage }}
                      <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                          :disabled="(currentPage * itemsPerPage) >= dataUsersTestList.length">
                      </VBtn>
                  </div>
                </div>
                <!-- fin lista usuarios -->
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>