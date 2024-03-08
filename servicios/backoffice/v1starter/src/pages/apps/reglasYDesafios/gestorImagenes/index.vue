<template>
  <VSnackbar v-model="isSnackbarVisible" location="top" color="success">
    Enviado!
  </VSnackbar>

  <VSnackbar v-model="isRegistroEliminado" location="top" color="success">
    Registro eliminado!
  </VSnackbar>

  <VSnackbar v-model="isSnackbarError" location="top" color="error">
    Error al enviar datos
  </VSnackbar>
  <VDialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>¿Estás seguro de eliminar la imagen?</v-card-title>
      <v-card-actions>
        <v-btn text @click="deleteImage">Sí</v-btn>
        <v-btn color="red darken-1" text @click="dialog = false">No</v-btn>
      </v-card-actions>
    </v-card>
  </VDialog>
  <VRow>
    <VCol cols="12" md="12" lg="12">
      <VCard title="Formulario de imágenes" class="card_form">
        <VCardText>
          <form @submit.prevent="handleSubmit">
            <VTextField prepend-icon="tabler-user" label="ID del Usuario" id="userId" v-model="userId" type="text"
              required />
            <br>

            <VCombobox label="Desafios" prepend-icon="tabler-list" v-model="selectedItem"
              :items="desafios.map(desafio => desafio.tituloDesafio)" @update:modelValue="handleSelectionChange" />
            <br>
            <VFileInput :rules="rules" accept="image/png, image/jpeg, image/webp" label="Sube tus imágenes" type="file"
              multiple @change="handleFileUpload" required />

            <br>
            <div style=" display: flex;justify-content: flex-end;">
              <VBtn variant="tonal" type="submit" :loading="loadings[0]" :disabled="loadings[0]" color="success">
                Enviar
              </VBtn>

            </div>
          </form>
        </VCardText>

      </VCard>



    </VCol>
    <VCol cols="12" md="12" lg="12">
      <h2 class="mb-3">Listado
        <p class="font-weight-medium text-base text-subtitle-2">
          Un total de {{ totalText }} registros
        </p>
      </h2>
      <div v-if="cargando">Cargando...</div>
      <div v-else class="list_items_registros">
        <VCard class="mb-4" :title="item.retoAssignment" :subtitle="moment(item.created_at).format('D/M/YYYY - HH:mm')"
          v-for="item in historico" :key="item._id">
          <VCardText>

            <!-- 👉 Header -->
            <div class="d-flex justify-space-between">
              <span class="text-sm text-disabled">{{ }}</span>
            </div>

            <!-- <div class="d-flex align-center parent_img">
              <div class="items-img " >
                <VAvatar :size="100" :image="urlBaseFiles + file" class="me-3" />
                <VBtn icon="tabler-x" size="x-small" color="error" @click="handleImageClick(urlBaseFiles + file)" />
              </div>
            </div> -->



            <VSlideGroup show-arrows mandatory>
              <!-- 👉 slider more -->
              <VSlideGroupItem v-for="file in item.files" :key="file">
                <div style=" width: 110px;height: 94px; position: relative;"
                  class="d-flex flex-column justify-center align-center rounded me-6">
                  <VAvatar rounded size="88" color="default" variant="tonal" class="text-disabled">
                    <div>
                      <VAvatar :size="100" :image="urlBaseFiles + file" class="me-3 items-img" />
                    </div>
                  </VAvatar>
                  <VBtn class="btn_delete_img" icon="tabler-x" size="x-small" color="secondary"
                    @click="handleImageClick(urlBaseFiles + file)" />
                </div>
              </VSlideGroupItem>
            </VSlideGroup>
          </VCardText>

          <VBtn icon="tabler-trash" block color="error" class="rounded-t-0 btn_delete_item"
            @click="handleDeleteClick(item._id)" />

        </VCard>

      </div>
      <VPagination v-if="total > limit" v-model="page" size="small" :total-visible="4" :length="totalPages"
        @update:model-value="updatePage" />

    </VCol>
  </VRow>

</template>

<style>
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

<script setup>
import { ref } from 'vue';
import moment from 'moment'

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
const limit = ref(6);
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

// Función para obtener los desafíos desde el endpoint
async function fetchDesafios() {
  try {
    const response = await fetch("https://servicio-desafios.vercel.app/desafios");
    const data = await response.json();
    desafios.value = data.data;
  } catch (error) {
    console.error("Error al obtener los desafíos:", error);
  }
}

// Llamar a la función de obtener desafíos al montar el componente
onMounted(fetchDesafios);

// Función para manejar el cambio de selección en el combo box
const handleSelectionChange = (selectedItem) => {
  const selectedDesafio = desafios.value.find(desafio => desafio.tituloDesafio === selectedItem);
  if (selectedDesafio) {
    selectedDesafioId.value = selectedDesafio._id;
    selectedDesafioTitulo.value = selectedDesafio.tituloDesafio;
    console.log(selectedDesafioId.value);
  }
}

const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 1500000 || '¡El tamaño del avatar debe ser inferior a 1.5 MB!']
const loadings = ref([]);
const cargando = ref(true);
const urlBaseFiles = "https://phpstack-1011861-4362286.cloudwaysapps.com/uploads";

async function fetchHistorico() {
  try {
    const response = await fetch(`https://servicio-niveles-puntuacion.vercel.app/historico/all?&page=${page.value}&limit=${limit.value}`);
    const data = await response.json();
    historico.value = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    total.value = data.total;
    totalText.value = data.total;
    cargando.value = false;
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    cargando.value = false;
  }
}

onMounted(fetchHistorico);

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

// Función para manejar el clic en el botón de eliminación de registro completo
const handleDeleteClick = async (_id) => {
  try {
    const response = await fetch(`https://servicio-niveles-puntuacion.vercel.app/historico/delete/${_id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      console.log('Registro eliminado exitosamente');
      isRegistroEliminado.value = true
      // Actualizar el historial después de eliminar el registro
      fetchHistorico();
    } else {
      console.error('Error al eliminar el registro');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

function handleFileUpload(event) {
  const fileList = event.target.files;
  files = Array.from(fileList);
}

async function handleSubmit() {
  const formData = new FormData();
  formData.append('userId', userId.value);
  formData.append('idRegla', selectedDesafioId.value);
  formData.append('retoAssignment', selectedDesafioTitulo.value);
  formData.append('reference', 'app-live-10min');
  formData.append('provider', 'app web nevera');

  console.log(selectedDesafioTitulo.value);

  loadings.value[0] = true;
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await fetch('https://servicio-niveles-puntuacion.vercel.app/historico/create', {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      console.log('Datos enviados exitosamente');
      isSnackbarVisible.value = true;
      userId.value = '';
      selectedItem.value = '';
      files = [];
      fetchHistorico();

    } else {
      console.error('Error al enviar datos');
      isSnackbarError.value = true;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);

  } finally {
    loadings.value[0] = false;
  }
}
</script>
