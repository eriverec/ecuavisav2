
<template>
  
  <section>
    <!-- flat snackbar -->
    <VSnackbar
      v-model="isFlatSnackRespUserAddAndDelete"
      location="bottom start"
      variant="flat"
      color="success"
    >
      Usuario agregado.
    </VSnackbar>
    <VSnackbar
      v-model="isFlatSnackRespUserDelete"
      location="bottom start"
      variant="flat"
      color="success"
    >
      Usuario eliminado.
    </VSnackbar>
    <VDialog
    v-model="isDialogSearchUser"
    persistent
    class="v-dialog-lg"
  >

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogSearchUser = !isDialogSearchUser" />

    <!-- Dialog Content -->
    <VCard title="Lista de usuarios">
      <VCardSubtitle class="pl-6 mb-3">
        Solo se obtendrá los 20 primeros registros de acuerdo a la búsqueda.
      </VCardSubtitle>
      <VCardText>
        <VTextField :disabled="isLoadingDialogUser" append-inner-icon="tabler-user-search" type="text"  @input="handleInput" label="Buscar por correo, teléfono o nombre" placeholder="Buscar usuarios" />
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
              v-if="dataUsers.length > 0"
              v-for="item in filteredDataUsers" 
              :key="item.userId" 
              class="" 
            >
              <td>
                {{ (item.last_name+' '+item.first_name).length > 25 ? (item.last_name+' '+item.first_name).substring(0, 25) + "..." : (item.last_name+' '+item.first_name) }}
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
    v-model="isDialogVisibleDelete"
    persistent
    class="v-dialog-sm"
  >

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

    <!-- Dialog Content -->
    <VCard :title="'¿Desea eliminar el usuario #'+userIdSelected+'?'">
      <VCardText>
        Eliminarás el usuario del listado para esta campaña
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap">
        <VBtn :disabled="disabledBtnDialog"
          color="secondary"
          variant="tonal"
          @click="isDialogVisibleDelete = false"
        >
          No, cerrar
        </VBtn>
        <VBtn :disabled="disabledBtnDialog" @click="eliminarRegistroDialog">
          Si, eliminar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-detalles">Detalles</VTab>
          <VTab value="tab-usuarios">Usuarios</VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <div v-if="isLoadingContent">Cargando datos, espere...</div>
            <VWindow v-if="!isLoadingContent" v-model="currentTab">
              <VWindowItem value="tab-detalles">
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
                  <div>
                    <VCardTitle>Información sobre: <b>"{{suggestion.campaignTitle}}"</b>
                    </VCardTitle>
                    <VCardSubtitle> A continuación encontrarás detalles sobre la campaña 
                    </VCardSubtitle>
                  </div>
                </div>
                <!-- 👉 Cuadro datos -->
                <VCol md="6" lg="12" cols="12">
                  <VAlert color="success" variant="tonal">
                    <VRow no-gutters>
                      <VCol cols="12" sm="6" md="12" lg="6" order="2" order-lg="1">
                        <VCardItem>
                          <VCardTitle>{{suggestion.campaignTitle}}</VCardTitle>
                        </VCardItem>

                        <VCardText class="d-flex justify-center">
                          <div class="me-auto pe-4">
                            <p class="d-flex align-center mb-6">
                              <VIcon color="primary" icon="mdi-map-marker" size="22"/>
                              <span class="ms-3">{{suggestion.criterial.country}}</span>
                            </p>

                            <p class="d-flex align-center mb-0">
                              <VIcon color="primary" icon="tabler-user" size="22"/>
                              <span class="ms-3" v-if="!cargandoData">{{suggestion.userId.length}} usuarios</span>
                              <span class="ms-3" v-if="cargandoData">Cargando data...</span>
                            </p>

                            <p class="d-flex align-center mb-6 mt-6">
                              <VIcon color="primary" icon="mdi-page-layout-header-footer" size="22"/>
                              <span class="ms-3">Posición: {{suggestion.position}}</span>
                            </p>

                            <p class="d-flex align-center mb-0">
                              <VIcon color="primary" icon="mdi-calendar-month-outline" size="22"/>
                              <span class="ms-3">{{suggestion.created_at}}</span>
                            </p>
                            
                            <VBtn class="mt-4" color="success" @click="exportToCSV">Exportar usuarios<VIcon end icon="tabler-download" /></VBtn>
                          </div>

                          <VDivider
                            v-if="$vuetify.display.smAndUp"
                            vertical
                            inset
                          />
                        </VCardText>
                      </VCol>

                      <!-- <VCol cols="12" sm="3" md="12" lg="3" order="1" order-lg="2" class="member-pricing-bg text-center">
                        <div class="membership-pricing d-flex flex-column align-center py-14 h-100 justify-center">
                            <VCardTitle>Estado:</VCardTitle>
                            <VSwitch :disabled="switchOnDisabled" :loading="switchOnDisabled?'warning':false" v-model="suggestion.statusCampaign" @change="handleSwitchChange(index)" />
                            
                          
                        </div>
                      </VCol> -->

                      <VCol cols="12" sm="6" md="12" lg="6" order="2" order-lg="2" class="member-pricing-bg text-center">
                        <div class="membership-pricing d-flex flex-column py-14">
                            <VCardTitle style="text-align: left;">Subir CSV:</VCardTitle>
                            <div style="width:100%;" class="pr-4">
                              <VFileInput
                                v-model="files_csv"
                                :loading="files_loading"
                                :disabled="files_loading"
                                accept=".csv"
                                placeholder="Subir tu archivo CSV de usuarios"
                                label="Subir tu archivo CSV de usuarios"
                                prepend-icon="tabler-paperclip"
                                @change="handleFileChange"
                              >
                                <template #selection="{ fileNames }">
                                  <template
                                    v-for="fileName in fileNames"
                                    :key="fileName"
                                  >
                                    <VChip
                                      label
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                      class="me-2"
                                    >
                                      {{ fileName }}
                                    </VChip>
                                  </template>
                                </template>
                              </VFileInput>
                              <small class="py-2" style="font-size:10px;color:#000;text-align: right;width: 100%;display: block;">Máximo de usuarios permitidos 30000</small>

                              <p v-if="files_loading">
                                <small style="color:#000;text-align: left;width: 100%">
                                  Subiendo usuarios, {{files_csv_mensaje}} <v-icon x-large class="rotate">
                                                      mdi-loading
                                                    </v-icon> 
                                  
                                </small>
                              </p>
                              <div style="display: block;text-align: left;max-width: 300px;">
                                  <VBtn class="mt-4" color="success" href="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/usuarios-ejemplo.csv"
      target="_blank">Ver ejemplo de importación<VIcon end icon="tabler-download" /></VBtn>
                                <br>
                                <small style="text-align:left;line-height: 1.2;display: block;margin-top: 10px;">Los usuarios incluidos en este archivo de importación deben estar registrados en el sitio web.</small>
                              </div>
                            </div>
                        </div>
                      </VCol>
                    </VRow>
                  </VAlert>
                </VCol>
                
              </VWindowItem>

              <VWindowItem value="tab-usuarios">
                <VCardTitle class="px-0">Esta es la lista de usuarios de la campaña "{{suggestion.campaignTitle}}":</VCardTitle>
                <VCardSubtitle></VCardSubtitle>

                <!-- Campo de búsqueda -->
                <VRow justify="space-between" class="my-4">
                  <VCol cols="3">
                    <div class="">
                      <VTextField append-inner-icon="tabler-user-search" @input="filtrarUsuarios" v-model="filter" label="Buscar usuarios dentro del listado"/>
                      
                    </div>
                  </VCol>
                  <VCol cols="auto">
                    <div class="d-flex gap-3 flex-wrap">
                      <VBtn color="info" @click="exportToCSV">Descargar Usuarios<VIcon end icon="tabler-download" /></VBtn>
                      <VBtn color="success" @click="add_user">Añadir usuarios<VIcon end icon="mdi-account-plus" /></VBtn>
                    </div>
                  </VCol>
                </VRow>

                <!-- items -->
                <VList lines="two" >
                  <template  v-for="(user, index) in currentUsers" :key="index" >
                    <VListItem border> 
                      <VListItemTitle>
                        <span>{{ user.firstname }} {{ user.last_name }}</span>
                      </VListItemTitle>
                      <VListItemSubtitle class="mt-1" color="info"> 
                        <span class="text-xs text-disabled"> Correo: {{ user.email }}</span>
                      </VListItemSubtitle>
                      <template #append>
                        <div class="espacio-right-2">
                          <VBtn
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="eliminarRegistro(user.wylexId)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-trash"
                            />
                          </VBtn>
                        </div>
                      </template>
                    </VListItem>
                  </template>
                </VList>

                <!-- botones paginado -->
                <VBtn variant="tonal" @click="currentPage--" :disabled="currentPage <= 1" size="small" color="primary"> <VIcon start icon="tabler-arrow-left" /> Anterior </VBtn>
                <VBtn variant="tonal" @click="currentPage++" :disabled="currentPage >= totalPages" size="small" color="primary" class="ma-3">  Siguiente <VIcon end icon="tabler-arrow-right" /></VBtn>
                
              </VWindowItem>

            </VWindow>
          </VCardText>
        </VCard>

      </VCol>
    </VRow>

    
  </section>
</template>

<script>
import { useRoute } from 'vue-router';
import Papa from 'papaparse';
const route = useRoute();
const currentTab = ref('tab-detalles')

export default {
  setup() {
    const route = useRoute();
    const id = route.params.id;
    return { id }
  },
  data() {
    return {
      datos: [],
      files_csv:[],
      isFlatSnackRespUserAddAndDelete:false,
      isFlatSnackRespUserDelete:false,
      isLoadingDialogUser:false,
      isLoadingContent:false,
      files_csv_mensaje:"",
      usuarios_traidos_del_csv:[],
      files_loading:false,
      isDialogVisibleDelete:false,
      searchQuery:"",
      dataUsers:[],
      isDialogSearchUser:false,
      csvData: [],
      csvHeaders: [],
      switchOnDisabled: false,
      disabledBtnDialog: false,
      suggestion: {
        _id: "",
        campaignTitle: "",
        statusCampaign: true,
        urls: {},
        criterial: {
          country: "",
          city: 0
        },
        type: "",
        position: "",
        created_at: "",
        userId: []
      },
      currentTab: 'tab-detalles',
      currentPage: 1,
      usersPerPage: 10,
      labelError:{
        mensaje: "",
        visible: false
      },
      currentUsers: "",
      timeoutId: null,
      timeoutId_2: null,
      cargandoData: false,
      usuariosSearch:[],
      filter: "", // Agregar un modelo de datos para el filtro
      userIdSelected:0,
    };
  },
  watch: {
  },
  async mounted() {
    await this.obtenerDetalles();

    const usuarios = this.suggestion.userId;
    this.usuariosSearch = usuarios;
    console.log(usuarios.length)
  },

  computed: {
    totalPages() {
      return Math.ceil(this.usuariosSearch.length / this.usersPerPage);
    },
    currentUsers() {
      const start = (this.currentPage - 1) * this.usersPerPage;
      const end = start + this.usersPerPage;
      return this.usuariosSearch.slice(start, end);
    },
    // Agregar una función computada para los usuarios filtrados
    filteredUsers() {
      // const usuarios = this.suggestion.userId;
      // const search = this.filter.toLowerCase();

      // const resultados = usuarios.filter(usuario => {
      //     const nombreCompleto = `${usuario.firstname} ${usuario.last_name}`.toLowerCase();

      //     // Verificar coincidencia en nombres o apellidos
      //     if (nombreCompleto.includes(search)) {
      //         return true;
      //     }

      //     // Verificar coincidencia en otros campos (excepto "wylexId")
      //     return Object.keys(usuario).some(key => {
      //         return key !== "wylexId" && usuario[key].toLowerCase().includes(search);
      //     });
      // });

      // this.usuariosSearch = resultados || usuarios;

      // // 'resultados' ahora contendrá los usuarios que coinciden con la búsqueda

      // return resultados || usuarios;
      // return this.suggestion.userId.filter(user => {
      //   return user.firstname.toLowerCase().includes(this.filter.toLowerCase()) ||
      //          user.last_name.toLowerCase().includes(this.filter.toLowerCase()) ||
      //          user.email.toLowerCase().includes(this.filter.toLowerCase()); // Agregar filtro por correo electrónico
      // });
    },
    filteredDataUsers(){
      return this.dataUsers;
    }
  },

  methods: {
    async add_user(){
      this.isDialogSearchUser = true;
      this.isLoadingDialogUser = true;
      await this.obtenerDataUsers();
      this.isLoadingDialogUser = false;
    },
    async resolveUsuario(item){
      var myHeaders = new Headers();
      const idCampaing = this.id;
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          userId: item.wylexId
        }),
        redirect: 'follow'
      };

      this.isLoadingDialogUser = true;

      var response = await fetch(`https://ads-service.vercel.app/campaign/add-user/${idCampaing}`, requestOptions);
      const data = await response.json();
      await this.obtenerDetalles();

      this.isLoadingDialogUser = false;
      this.isDialogSearchUser = false;

      if(data.resp){
        this.isFlatSnackRespUserAddAndDelete = true;
      }

    },
    handleInput(event) {
      // console.log(event.target.value);
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.filtrarUsuariosUser(event.target.value);
      }, 1000); // Espera 1000 milisegundos antes de realizar la llamada
    },
    async filtrarUsuariosUser(textoBusqueda) {
      try {
        this.isLoadingDialogUser = true;
        const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${encodeURIComponent(textoBusqueda)}`);
        const data = await response.json();
        this.isLoadingDialogUser = false;
        // Manejar la respuesta de la API según tus necesidades

        if(!data.resp){
          this.labelError.mensaje = data.error;
          this.labelError.visible = true;
        }else{
          this.dataUsers = data.data
          this.labelError.visible = false;
        }

        // console.log(data.data);
      } catch (error) {
        // Manejar errores en la llamada a la API
        console.error(error);
      }
    },
    eliminarRegistro(userId) {
      const idCampaing = this.id;
      this.userIdSelected = userId;
      this.isDialogVisibleDelete = true;
      
    },
    async eliminarRegistroDialog() {
      this.disabledBtnDialog = true;
      const idCampaing = this.id;
      const userId = this.userIdSelected;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "userId": userId
      });

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      var response = await fetch(`https://ads-service.vercel.app/campaign/delete-user/${idCampaing}`, requestOptions);
      const data = await response.json();
      if(data.resp){
        await this.obtenerDetalles();
        this.isFlatSnackRespUserDelete = true;
        this.isDialogVisibleDelete = false;

        const usuarios = this.suggestion.userId;
        this.usuariosSearch = usuarios;
      }else{
        alert("Usuario no eliminado")
        this.isDialogVisibleDelete = false;
      }
      
      this.disabledBtnDialog = false;
    },
    filtrarUsuarios() {
      const usuarios = this.suggestion.userId;
      const search = this.filter.toLowerCase();

      clearTimeout(this.timeoutId_2);
      this.timeoutId_2 = setTimeout(() => {
        const resultados = usuarios.filter(usuario => {
            const nombreCompleto = `${usuario.firstname} ${usuario.last_name}`.toLowerCase();

            // Verificar coincidencia en nombres o apellidos
            if (nombreCompleto.includes(search)) {
                return true;
            }

            // Verificar coincidencia en otros campos (excepto "wylexId")
            return Object.keys(usuario).some(key => {
                return key !== "wylexId" && usuario[key].toLowerCase().includes(search);
            });
        });

        this.usuariosSearch = resultados || usuarios;
      }, 1000); // Espera 1000 milisegundos antes de realizar la llamada
    },
    dividirArray(original, tamano = 500) {
      const resultado = [];
      for (let i = 0; i < original.length; i += tamano) {
        const trozo = original.slice(i, i + tamano);
        resultado.push(trozo);
      }
      return resultado;
    },
    //método que obtiene los detalles de la campaña y el listado de usuarios
    async handleSwitchChange(index) {
      // console.log(this.suggestion.statusCampaign)
      this.switchOnDisabled = true;
      var jsonEnviar = {
            status:this.suggestion.statusCampaign
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(jsonEnviar),
        redirect: 'follow'
      };

      var response = await fetch(`https://ads-service.vercel.app/campaign/update/status/${this.suggestion._id}`, requestOptions);
      const data = await response.json();
      if(data.resp){
        // alert("Registro guardado");
      }else{
        alert("Un error se presentó: "+data.error);
        this.suggestion.statusCampaign = !this.suggestion.statusCampaign;
      };
      this.switchOnDisabled = false;

    },
    async obtenerDataUsers() {
      const respuesta = await fetch(`https://ads-service.vercel.app/busqueda/user/`); 
      const datos = await respuesta.json();
      // console.log(datos)
      this.dataUsers = datos.data;
    },
    async getDetallesCampaign(data = {}) {
      const { limit=20000, page=1 } = data;
      const respuesta = await fetch(`https://ads-service.vercel.app/campaign/${this.id}/user/?limit=${limit}&page=${page}`); 
      const datos = await respuesta.json();
      // console.log(datos)
      return datos[0];
    },
    async obtenerDetalles() {

      this.isLoadingContent = true;
      this.cargandoData = true;
      let skip = 1;
      let batchSize = 20000;
      let dataFull = [];

      while (true) {
        const batchRegister = await this.getDetallesCampaign({limit:batchSize,page:skip});

        if (batchRegister.userId.length === 0) {
          break;
        }
        if(skip == 1){
          dataFull.push(...[batchRegister]);
        }else{
          dataFull[0].userId.push(...batchRegister.userId);
        }
        
        
        this.suggestion = dataFull[0];
        this.isLoadingContent = false;
        skip += 1;
        // console.log(dataRegistrosGroupExport.value)
      }
      this.cargandoData = false;
    },
    // metodo que exporta a csv los registros obtenidos
    exportToCSV() {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += [
        ["id", "firstname", "last_name", "email"].join(","),
        ...this.suggestion.userId.map(user => [user.wylexId, user.firstname, user.last_name, user.email].join(","))
      ].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "usuarios.csv");
      document.body.appendChild(link); // Required for Firefox

      link.click(); // This will download the data file named "usuarios.csv".
    },
    async handleUpdateUserCSV(page, users) {
      var jsonEnviar = {
            users: users
      }
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(jsonEnviar),
        redirect: 'follow'
      };

      var response = await fetch(`https://ads-service.vercel.app/campaign/users/update/${this.suggestion._id}/${page}`, requestOptions);
      const data = await response.json();
      if(data.resp){
        return true;
      }else{
        // alert("Un error se presentó: "+data.error);
        return false;
      };
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Verifica que el archivo sea de tipo CSV
        if (file.name.endsWith('.csv')) {
          this.files_loading = true;
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: async (result) => {
              this.csvData = result.data;
              this.csvHeaders = result.meta.fields;

              var dataNormal = [];
              for(var i in this.csvData){
                if(!this.csvData[i].hasOwnProperty('id')){
                  alert('Error al subir el archivo, no tiene un formato válido.');
                  return false;
                  break; // Detener el bucle
                }
                dataNormal.push(this.csvData[i]["id"]);
              }

              this.usuarios_traidos_del_csv = this.dividirArray(dataNormal);
              if(dataNormal.length > 30000){
                alert('Error al subir el archivo, la cantidad de usuarios no debe pasar de 30 mil.');
                return false;
              }
              var totalUsuarios = 0;
              for(var i in this.usuarios_traidos_del_csv){
                const usuarios = this.usuarios_traidos_del_csv[i];
                totalUsuarios+= usuarios.length;

                this.files_csv_mensaje = `${totalUsuarios} de ${dataNormal.length}`;

                var respUpdate = await this.handleUpdateUserCSV(i, usuarios);
                if (!respUpdate) {
                  alert('Error al actualizar. Porfavor subir de nuevo el archivo.');
                  break; // Detener el bucle
                }
              }

              this.files_loading = false;
              this.files_csv = [];
              this.obtenerDetalles();
            },
          });
        } else {
          alert('Por favor, selecciona un archivo CSV.');
        }
      }
    },
  },
};
</script>

<style>
.rotate {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>