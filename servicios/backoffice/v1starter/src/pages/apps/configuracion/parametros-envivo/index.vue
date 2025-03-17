<template>
  <div>
    <VCard class="mt-5" title="Configuración de Redirección En Vivo">
      <VCardText>
        <form @submit.prevent="updateParameters">
          <VRow>
            <VCol cols="12" md="6">
              <label for="num_redireccion">Número de intentos permitidos:</label>
              <VTextField
                v-model="numRedireccion"
                type="number"
 
                id="num_redireccion"
                name="num_redireccion"
                min="0"
                required
              />
            </VCol>
            
            <VCol cols="12" md="6">
              <label for="tiempo">Tiempo en segundos antes de redirección:</label>
              <VTextField
                v-model="tiempoSegundos"
                type="number"
  
                id="tiempo"
                name="tiempo"
                min="0"
                required
              />
            </VCol>
          </VRow>

          <VBtn class="my-3" type="submit" color="success" variant="tonal">
            Actualizar Parámetros
          </VBtn>
        </form>
      </VCardText>
    </VCard>

    <VSnackbar
      v-model="configSnackbar.model"
      location="top end"
      variant="flat"
      :timeout="configSnackbar.timeout || 2000"
      :color="configSnackbar.type"
    >
      {{ configSnackbar.message }}
    </VSnackbar>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

// Variables
const numRedireccion = ref('');
const tiempoSegundos = ref('');

const apiUrl = 'https://micuenta.ecuavisa.com/en_vivo_num_redireccion/ajax/ajax_envivo.php';

const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false,
  timeout: 2000
});

// Obtener los parámetros actuales
const getParameters = async () => {
  try {
    const response = await axios.get(apiUrl, {
      params: { action: 'get_envivo' }
    });
    if (response.data.resp) {
      numRedireccion.value = response.data.data.num_redireccion;
      tiempoSegundos.value = response.data.data.tiempo_segundos;
    }
  } catch (error) {
    console.error('Error al obtener los parámetros:', error);
    configSnackbar.value = {
      message: "Error al obtener los datos",
      type: "error",
      model: true
    };
  }
};

// Actualizar los parámetros
const updateParameters = async () => {
  try {
    const response = await axios.post(apiUrl, {
      id: "1",
      action: "edit_envivo",
      tiempo_segundos: parseInt(tiempoSegundos.value),
      num_redireccion: parseInt(numRedireccion.value)
    });

    if (response.data.resp) {
      configSnackbar.value = {
        message: "Parámetros actualizados correctamente",
        type: "success",
        model: true
      };
    } else {
      configSnackbar.value = {
        message: "Error al actualizar los parámetros",
        type: "error",
        model: true
      };
    }
  } catch (error) {
    console.error('Error al actualizar los parámetros:', error);
    configSnackbar.value = {
      message: "Error en la actualización",
      type: "error",
      model: true
    };
  }
};

// Obtener los parámetros iniciales al montar el componente
onMounted(() => {
  getParameters();
});
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  width: fit-content;
}
</style>