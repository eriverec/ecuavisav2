<template>
  <VRow>
    <VCol cols="12" md="5" lg="5">
      <VCard title="Formulario de imágenes">
        <VCardText>
          <form @submit.prevent="handleSubmit">
            <VTextField prepend-icon="tabler-user" label="ID del Usuario" id="userId" v-model="userId" type="text"
              required />
            <br>
            <VFileInput :rules="rules" accept="image/png, image/jpeg, image/webp" label="Sube tus imágenes" type="file"
              multiple @change="handleFileUpload" required />
            <!-- <label for="idRegla">ID Regla:</label>
            <input id="idRegla" v-model="idRegla" type="text" >
            <br>
            <label for="retoAssignment">retoAssignment</label>
            <input id="retoAssignment" v-model="retoAssignment" type="text" >
            <br>
            <label for="reference">reference</label>
            <input id="reference" v-model="reference" type="text" >
            <br>
            <label for="provider">provider</label>
            <input id="provider" v-model="provider" type="text" >
            <br> -->
            <br>
            <!-- <button type="submit">Enviar</button> -->

            <VBtn variant="tonal" type="submit" :loading="loadings[0]" :disabled="loadings[0]" color="success">
              Enviar
            </VBtn>
          </form>
        </VCardText>

      </VCard>



    </VCol>
    <VCol cols="12" md="7" lg="7">
      <VCard class="mb-4 text-uppercase" title="Listado de registros">
      </VCard>
      <div v-if="cargando">Cargando...</div>
      <VCard class="mb-4" v-else :title="item.retoAssignment" :subtitle="moment(item.created_at).format('D/M/YYYY - HH:mm')" v-for="item in historico"
        :key="item._id">
        <VCardText>

          <!-- 👉 Header -->
          <div class="d-flex justify-space-between">
            <span class="text-sm text-disabled">{{  }}</span>
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
                <VBtn class="btn_delete_img" icon="tabler-x" size="x-small" color="error"
                  @click="handleImageClick(urlBaseFiles + file)" />
              </div>
            </VSlideGroupItem>
          </VSlideGroup>
        </VCardText>

        <VBtn block  class="rounded-t-0" @click="handleDeleteClick(item._id)">
          Eliminar
        </VBtn>

      </VCard>

    </VCol>
  </VRow>
  <VSnackbar v-model="isSnackbarVisible" location="top" color="success">
    Enviado!
  </VSnackbar>

  <VSnackbar v-model="isRegistroEliminado" location="top" color="success">
    Registro eliminado!
  </VSnackbar>

  <VSnackbar v-model="isSnackbarError" location="top" color="error">
    Error al enviar datos
  </VSnackbar>
</template>

<style>
.v-img__img--contain {
  object-fit: cover !important;
}

.items-img {
  border-radius: 0px !important;
}


.btn_delete_img {
  position: absolute;
  top: 0;
  right: 0;
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

const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 1500000 || '¡El tamaño del avatar debe ser inferior a 1.5 MB!']
const loadings = ref([]);
const cargando = ref(true);
const urlBaseFiles = "https://phpstack-1011861-4362286.cloudwaysapps.com/uploads";

const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

async function fetchHistorico() {
  try {
    const response = await fetch("https://servicio-niveles-puntuacion.vercel.app/historico/all");
    const data = await response.json();
    historico.value = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
    cargando.value = false;
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    cargando.value = false;
  }
}

onMounted(fetchHistorico);

// Función para manejar el clic en el botón de eliminación de imagen
const handleImageClick = async (src) => {
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
  formData.append('idRegla', '65df97a116ad3aa303920ee9');
  formData.append('retoAssignment', 'Responde una TRIVIA en Votaciones (Sobre Ecuador)');
  formData.append('reference', 'app-live-10min');
  formData.append('provider', 'app web nevera');

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
