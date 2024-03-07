
<template>
  <section>
    
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-detalles">Detalles</VTab>
          <!-- <VTab value="tab-usuarios">Usuarios</VTab> -->
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <div v-if="isLoadingContent">Cargando datos, espere...</div>
            <VWindow v-if="!isLoadingContent" v-model="currentTab">
              <VWindowItem value="tab-detalles">
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
                  <div>
                    <VCardTitle>Información sobre: <b>"{{suggestion.tituloDesafio}}"</b>
                    </VCardTitle>
                    <VCardSubtitle> A continuación encontrarás detalles sobre el desafío
                    </VCardSubtitle>
                  </div>
                </div>
                <!-- 👉 Cuadro datos -->
                <VCol md="6" lg="12" cols="12">
                  <VAlert color="success" variant="tonal">
                    <VRow no-gutters>
                      <VCol cols="12" sm="6" md="12" lg="12" order="2" order-lg="1">
                        <VCardItem>
                          <img class="ms-3" :src="suggestion.URLSticker">
                          <VCardTitle>{{suggestion.tituloDesafio}}</VCardTitle>
                        </VCardItem>

                        <VCardText class="d-flex justify-center">
                          <div class="me-auto pe-4">
                            <p class="d-flex align-center mb-2">
                              <VIcon color="primary" icon="mdi-text-box-edit-outline" size="35"/>
                              <span class="ms-3">Descripción:</span>
                              <span class="ms-4">{{suggestion.descripcionDesafio}}</span>
                            </p>

                            <p class="d-flex align-center mb-2">
                              <VIcon color="primary" icon="mdi-calendar-clock" size="35"/>
                              <span class="ms-3" >Duración:</span>
                              <span class="ms-4"> {{suggestion.frecuenciaValor}} {{suggestion.frecuenciaDesafio}}</span>
                          
                            </p>

                            <!-- <p class="d-flex align-center mb-6 mt-6">
                              <VIcon color="primary" icon="mdi-postage-stamp" size="22"/>
                               <span class="ms-3">Gráfico: {{suggestion.URLSticker}}</span> 
                              
                              <img class="ms-3" :src="suggestion.URLSticker">
                            </p> -->

                            <p class="d-flex align-center mb-2">
                              <VIcon color="primary" icon="mdi-toggle-switch-outline" size="35"/>
                              <span class="ms-3">Status:</span>
                              <span class="ms-4"> {{ suggestion.statusDesafio ? 'Activo' : 'Inactivo' }}</span>
                              </p>

                            
                          </div>

                          <VDivider
                            v-if="$vuetify.display.smAndUp"
                            vertical
                            inset
                          />
                        </VCardText>
                      </VCol>

                    </VRow>
                  </VAlert>
                </VCol>
                
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
        frecuenciaDesafio: "",
        frecuenciaValor: "",
        tituloDesafio: "",
        descripcionDesafio: "",
        statusDesafio: "",
        tituloSticker: "",
        URLSticker: "",
       
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

    const usuarios = this.suggestion._id;
    this.usuariosSearch = usuarios;
    console.log(usuarios.length);
    await this.getDetallesDesafio();
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
    
    filteredDataUsers(){
      return this.dataUsers;
    }
  },

  methods: {
    
    //método que obtiene los detalles de la campaña y el listado de usuarios
   
    async getDetallesDesafio() {
      const respuesta = await fetch(`https://servicio-desafios.vercel.app/desafios/${this.id}`); 
      const datos = await respuesta.json();
      this.suggestion = datos.data;
      this.isLoadingContent = false;
      console.log(datos)
      return datos[0];
    },
    async obtenerDetalles() {

      this.isLoadingContent = true;
      this.cargandoData = true;
      let skip = 1;
      let batchSize = 20000;
      let dataFull = [];

      while (true) {
        const batchRegister = await this.getDetallesDesafio({limit:batchSize,page:skip});

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

.ms-4 {
 color: gray;

}

.ms-3 {
  color:#7365f0;
}
</style>