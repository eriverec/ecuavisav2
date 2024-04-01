
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
                    <VCardTitle>Información sobre el video histórico: <b>"{{suggestion._id}}"</b>
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
                        <VTable class="text-no-wrap">
                          <!-- 👉 table head -->
                          <thead>
                            <tr>
                              <td scope="col">
                                <strong>ID</strong>
                              </td>
                              <td scope="col">
                                {{suggestion._id}}
                              </td>
                            </tr>
                            <tr>
                              <td scope="col">
                                <strong>idVideo</strong>
                              </td>
                              <td scope="col">
                                <a class="pl-2" target="_blank" :href="suggestion.urlContent">
                                    <VIcon
                                      size="20"
                                      icon="tabler-link"
                                    />
                                  {{ suggestion.idVideo }}
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td scope="col">
                                <strong>Desafío</strong>
                              </td>
                              <td scope="col">
                                {{ suggestion.desafio[0].tituloDesafio }}
                              </td>
                            </tr>
                            <tr>
                              <td scope="col">
                                <strong>Tipo Evaluación</strong>
                              </td>
                              <td scope="col">
                                {{ suggestion.tipoEval == 'full' ? "Ver todo el video" : "Por tiempo definido" }}
                              </td>
                            </tr>
                            <tr>
                              <td scope="col">
                                <strong>Tiempo de evaluación</strong>
                              </td>
                              <td scope="col">
                                {{ suggestion.timeVal }} min
                              </td>
                            </tr>
                          </thead>
                        </VTable>
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
      suggestion: {},
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
      const respuesta = await fetch(`https://servicio-niveles-puntuacion.vercel.app/desafio-video-historico/get/${this.id}`); 
      const datos = await respuesta.json();
      this.suggestion = datos.data[0];
      this.isLoadingContent = false;
      return datos[0];
    } 
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