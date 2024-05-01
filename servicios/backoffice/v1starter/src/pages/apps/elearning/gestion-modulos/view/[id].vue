
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
                    <VCardTitle>Información sobre el módulo: <b>"{{suggestion._id}}"</b>
                    </VCardTitle>
                    <VCardSubtitle> Detalles
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
                                <strong>Título</strong>
                              </td>
                              <td scope="col">
                                {{ suggestion.titulo }}
                              </td>
                            </tr>
                            <tr>
                              <td scope="col">
                                <strong>Descripción</strong>
                              </td>
                              <td scope="col">
                                {{ suggestion.descripcion }}
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
      // datos: [],
      // files_csv:[],
      // isFlatSnackRespUserAddAndDelete:false,
      // isFlatSnackRespUserDelete:false,
      // isLoadingDialogUser:false,
      isLoadingContent:true,
      // files_csv_mensaje:"",
      // usuarios_traidos_del_csv:[],
      // files_loading:false,
      // isDialogVisibleDelete:false,
      // searchQuery:"",
      // dataUsers:[],
      // isDialogSearchUser:false,
      // csvData: [],
      // csvHeaders: [],
      // switchOnDisabled: false,
      // disabledBtnDialog: false,
      suggestion: {},
      // currentTab: 'tab-detalles',
      // currentPage: 1,
      // usersPerPage: 10,
      // labelError:{
      //   mensaje: "",
      //   visible: false
      // },
      // currentUsers: "",
      // timeoutId: null,
      // timeoutId_2: null,
      // cargandoData: false,
      // usuariosSearch:[],
      // filter: "", // Agregar un modelo de datos para el filtro
      // userIdSelected:0,
    };
  },
  watch: {
  },
  async mounted() {
    await this.getDetallesDesafio();
  },

  computed: {
    // totalPages() {
    //   return Math.ceil(this.usuariosSearch.length / this.usersPerPage);
    // },
    // currentUsers() {
    //   const start = (this.currentPage - 1) * this.usersPerPage;
    //   const end = start + this.usersPerPage;
    //   return this.usuariosSearch.slice(start, end);
    // },
    // Agregar una función computada para los usuarios filtrados
    
    // filteredDataUsers(){
    //   return this.dataUsers;
    // }
  },

  methods: {
    //método que obtiene los detalles de la campaña y el listado de usuarios
    async getDetallesDesafio() {
      const respuesta = await fetch(`https://servicio-elearning.vercel.app/modulo/get/${this.id}`); 
      const datos = await respuesta.json();
      this.suggestion = datos.data;
      this.isLoadingContent = false;
      return datos;
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