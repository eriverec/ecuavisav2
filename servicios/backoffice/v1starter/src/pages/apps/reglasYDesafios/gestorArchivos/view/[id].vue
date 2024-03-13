<script setup>
  import Moment from 'moment'
  import { extendMoment } from 'moment-range'
  import esLocale from "moment/locale/es"
  import { useRoute } from 'vue-router';
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  const route = useRoute()

  const currentTab = ref('tab-detalles');
  const isLoadingContent = ref(true);
  const suggestion = ref({
    _id: "",
    frecuenciaDesafio: "",
    frecuenciaValor: "",
    tituloDesafio: "",
    descripcionDesafio: "",
    statusDesafio: "",
    tituloSticker: "",
    URLSticker: "",
  });

  async function getDetallesDesafio() {
    const respuesta = await fetch(`https://servicio-desafios.vercel.app/desafios/${route.params.id}`); 
    const datos = await respuesta.json();
    suggestion.value = datos.data;
    isLoadingContent.value = false;
    return datos[0];
  }

  const userId = ref('');
  const idRegla = ref('');
  const historico = ref([]);
  let files = [];
  const isSnackbarVisible = ref(false);
  const isSnackbarError = ref(false);
  const isRegistroEliminado = ref(false);

  const selectedItem = ref('');
  const desafios = ref([]);
  const selectedDesafioId = ref('');
  const selectedDesafioTitulo = ref('');
  const selectedImage = ref('');
  const dialog = ref(false);

  //paginador
  const page = ref(1);
  const limit = ref(9);
  const total = ref(0);
  const totalText = ref(0);
  const totalPages = computed(() => Math.ceil(total.value / limit.value));

  const updatePage = (newPage) => {
    page.value = newPage;
    fetchHistorico();
  };


  // Función para manejar el clic en la imagen
  const handleImageClick = (file) => {
    selectedImage.value = file;
    dialog.value = true; // Abre el modal al hacer clic en la imagen
  }

  // Llamar a la función de obtener desafíos al montar el componente
  onMounted(async () => {
    getDetallesDesafio();
    fetchHistorico();
  });

  const loadings = ref([]);
  const cargando = ref(true);
  const urlBaseFiles = "https://phpstack-1011861-4362286.cloudwaysapps.com/uploads";

  async function fetchHistorico() {
    try {
      const response = await fetch(`https://servicio-niveles-puntuacion.vercel.app/historico/files-list-id/?&page=${page.value}&limit=${limit.value}&idRegla=${route.params.id}`);
      const data = await response.json();
      historico.value = data.data;
      total.value = data.total;
      totalText.value = data.total;
      cargando.value = false;
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      cargando.value = false;
    }
  }

  // Función para manejar el clic en el botón de eliminación de imagen
  const deleteImage = async () => {
    const src = selectedImage.value;
    try {
      const response = await fetch('https://servicio-niveles-puntuacion.vercel.app/historico/delete-file/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ruta_archivo: src })
      });
      if (response.ok) {
        console.log('Imagen eliminada exitosamente');
        console.log(src);
        // Actualizar el historial después de eliminar la imagen
        fetchHistorico();
      } else {
        console.error('Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
    dialog.value = false;
  }

  function handleFileUpload(event) {
    const fileList = event.target.files;
    files = Array.from(fileList);
  }

</script>
<template>
  <section>
    <VDialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>¿Estás seguro de eliminar el archivo?</v-card-title>
        <v-card-actions>
          <v-btn text @click="deleteImage">Sí</v-btn>
          <v-btn color="red darken-1" text @click="dialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </VDialog>
    <VRow>
      <VCol class="" cols="12" md="12" lg="12" v-if="isLoadingContent">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <!-- <VTab value="tab-detalles">Detalles</VTab> -->
          <!-- <VTab value="tab-usuarios">Usuarios</VTab> -->
        </VTabs>

        <VCard class="">
          <VCardText>
            <div >Cargando datos, espere...</div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol class="pt-7" cols="12" md="12" lg="12" v-if="!isLoadingContent">
        <VBtn class="my-2" :to="{ name: 'apps-reglasYDesafios-gestorArchivos' }" >
          Regresar al listado
        </VBtn>

        <h2 class="mb-3">Archivos sobre: <b>"{{suggestion.tituloDesafio}}"</b>
          <p class="font-weight-medium text-base text-subtitle-2">
            Un total de {{ totalText }} registros
          </p>
        </h2>
        <div class="list_items_registros">
          <VCard class="mb-4 py-2"
            v-for="(item, index) in historico" :key="index">
            <VCardText>

              <a v-if="item.type=='image'" :href="urlBaseFiles + item.url" target="blank_" class="d-flex flex-column justify-center align-center rounded me-6">
                  <VAvatar :size="130" :image="urlBaseFiles + item.url" class="items-img" />
                  <small class="pt-2">* type: {{ item.type }}</small>
                  <small>* user: {{ item.idUser }}</small>
              </a>

              <a v-if="item.type=='video'" :href="urlBaseFiles + item.url" target="blank_" class="d-flex flex-column justify-center align-center rounded me-6">
                  <VIcon
                    :size="122"
                    class="px-1"
                    icon="mdi-file-video"
                  />
                  <small class="pt-2">* type: {{ item.type }}</small>
                  <small>* user: {{ item.idUser }}</small>
              </a>

            </VCardText>

            <VBtn icon="tabler-trash" block color="error" class="rounded-t-0 btn_delete_item"
              @click="handleImageClick(urlBaseFiles + item.url)" />

          </VCard>
        </div>
        <VPagination v-if="total > limit" v-model="page" size="small" :total-visible="4" :length="totalPages"
          @update:model-value="updatePage" />

        <VCard v-if="historico.length < 1">
          <VCardText>
            <div >No hay datos que mostrar... </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    
  </section>
</template>

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
  .v-img__img--contain {
    object-fit: cover !important;
  }


  .btn_delete_item {
    position: absolute;
    top: 0;
    right: 0;
    min-width: auto;
    border-radius: 0 0px 0px 20px;
  }

  .list_items_registros {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    column-gap: 15px;
    margin-bottom: 20px;
  }

  .items-img {
    border-radius: 0px !important;
  }

  .card_form {
    max-width: 500px;
    margin: auto;

  }

  .btn_delete_img {
    position: absolute;
    top: 0;
    right: 0;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
  }
</style>