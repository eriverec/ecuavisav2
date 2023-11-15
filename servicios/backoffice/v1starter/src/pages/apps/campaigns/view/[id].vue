<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-detalles">Detalles</VTab>
          <VTab value="tab-usuarios">Usuarios</VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
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
                              <span class="ms-3">{{suggestion.userId.length}} usuarios</span>
                            </p>
                          
                            <VBtn class="mt-4" color="success" size="small" @click="exportToCSV">Descargar Usuarios<VIcon end icon="tabler-download" /></VBtn>
                          </div>

                          <VDivider
                            v-if="$vuetify.display.smAndUp"
                            vertical
                            inset
                          />

                          <div class="ms-auto ps-4">
                            <p class="d-flex align-center mb-6">
                              <VIcon color="primary" icon="mdi-page-layout-header-footer" size="22"/>
                              <span class="ms-3">Posición: {{suggestion.position}}</span>
                            </p>

                            <p class="d-flex align-center mb-0">
                              <VIcon color="primary" icon="mdi-calendar-month-outline" size="22"/>
                              <span class="ms-3">{{suggestion.created_at}}</span>
                            </p>
                          </div>
                        </VCardText>
                      </VCol>

                      <VCol cols="12" sm="3" md="12" lg="3" order="1" order-lg="2" class="member-pricing-bg text-center">
                        <div class="membership-pricing d-flex flex-column align-center py-14 h-100 justify-center">
                            <VCardTitle>Estado:</VCardTitle>
                            <VSwitch :disabled="switchOnDisabled" :loading="switchOnDisabled?'warning':false" v-model="suggestion.statusCampaign" @change="handleSwitchChange(index)" />
                            <!-- <sup class="text-h2 font-weight-medium">
                                <VChip v-if="suggestion.statusCampaign" color="success">
                                    <VIcon start size="60" icon="mdi-toggle-switch"/>
                                    ACTIVA
                                </VChip>
                                <VChip v-else>
                                    <VIcon start size="60" icon="mdi-toggle-switch-off"/>
                                    INACTIVA
                                </VChip>
                            </sup> -->
                            
                          
                        </div>
                      </VCol>

                      <VCol cols="12" sm="3" md="12" lg="3" order="1" order-lg="2" class="member-pricing-bg text-center">
                        <div class="membership-pricing d-flex flex-column py-14">
                            <VCardTitle style="text-align: left;">Subir CSV:</VCardTitle>
                            <div style="width:100%;text-align: left;">
                              <VFileInput
                                v-model="files_csv"
                                :loading="files_loading"
                                :disabled="files_loading"
                                accept=".csv"
                                placeholder="Subir tu archivo CSV de usuarios"
                                label="Subir tu CSV"
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
                              <p v-if="files_loading">
                                <small style="color:#000">
                                  Subiendo usuarios, {{files_csv_mensaje}} <v-icon x-large class="rotate">
                                                      mdi-loading
                                                    </v-icon> 
                                  
                                </small>
                              </p>
                            </div>
                          
                        </div>
                      </VCol>
                    </VRow>
                  </VAlert>
                </VCol>
                
              </VWindowItem>

              <VWindowItem value="tab-usuarios">
                <VCardTitle>Esta es la lista de usuarios de la campaña "{{suggestion.campaignTitle}}":</VCardTitle>
                <VCardSubtitle></VCardSubtitle>

                <!-- Campo de búsqueda -->
                <VRow justify="space-between" class="my-4">
                  <VCol cols="4">
                    <VTextField append-inner-icon="tabler-user-search" v-model="filter" label="Buscar usuarios"/>
                  </VCol>
                  <VCol cols="auto">
                    <VBtn color="info" @click="exportToCSV">Descargar Usuarios<VIcon end icon="tabler-download" /></VBtn>
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
      files_csv_mensaje:"",
      usuarios_traidos_del_csv:[],
      files_loading:false,
      csvData: [],
      csvHeaders: [],
      switchOnDisabled: false,
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
      currentUsers: "",
      filter: "" // Agregar un modelo de datos para el filtro
    };
  },
  watch: {
  },
  mounted() {
    this.obtenerDetalles();
  },

computed: {
  totalPages() {
    return Math.ceil(this.filteredUsers.length / this.usersPerPage);
  },
  currentUsers() {
    const start = (this.currentPage - 1) * this.usersPerPage;
    const end = start + this.usersPerPage;
    return this.filteredUsers.slice(start, end);
  },
  // Agregar una función computada para los usuarios filtrados
  filteredUsers() {
    return this.suggestion.userId.filter(user => {
      return user.firstname.toLowerCase().includes(this.filter.toLowerCase()) ||
             user.last_name.toLowerCase().includes(this.filter.toLowerCase()) ||
             user.email.toLowerCase().includes(this.filter.toLowerCase()); // Agregar filtro por correo electrónico
    });
  }
},


  methods: {
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
      console.log(this.suggestion.statusCampaign)
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
    async obtenerDetalles() {
      const respuesta = await fetch(`https://ads-service.vercel.app/campaign/${this.id}/user`); 
      const datos = await respuesta.json();
      // console.log(datos)
      this.suggestion = datos[0];
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
              var totalUsuarios = 0;
              for(var i in this.usuarios_traidos_del_csv){
                const usuarios = this.usuarios_traidos_del_csv[i];
                totalUsuarios+= usuarios.length;

                this.files_csv_mensaje = `${totalUsuarios}/${dataNormal.length}`;

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