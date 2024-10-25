<template>
  <div>
    <VCard class="mt-5 card" title="Actualizar Tiempo en Segundos">

      <VCardText>
        <form @submit.prevent="updateTime">
          <label for="tiempo">Tiempo en segundos:</label>
          <VTextField style="width: 300px;" v-model="tiempoSegundos" type="number" label="Tiempo" id="tiempo" name="tiempo" min="0"
            required />
          <VBtn class="my-3" type="submit" color="success" variant="tonal">
            Actualizar
          </VBtn>
        </form>

      </VCardText>
    </VCard>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat"
      :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>

  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Variables reactivas
const tiempoSegundos = ref('');
const apiUrl = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones_tiempo_parametrizable/ajax/ajax_parametrizable.php';

const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false,
  timeout: 2000
})

// Función para obtener el tiempo actual
const getTime = async () => {
  try {
    const response = await axios.get(apiUrl, {
      params: { action: 'get_time' }, // Dependiendo de si el backend necesita esta acción
    });
    if (response.data.resp) {
      tiempoSegundos.value = response.data.data.tiempo_segundos;
    }
  } catch (error) {
    console.error('Error al obtener el tiempo:', error);
  }
};

// Función para actualizar el tiempo
const updateTime = async () => {
  try {
    const response = await axios.post(apiUrl, {
      id: 1, // Puedes ajustar este valor según lo que se necesite
      action: 'edit_time',
      tiempo_segundos: parseInt(tiempoSegundos.value),
    });
    if (response.data.resp) {
      // alert('Tiempo actualizado correctamente');
      configSnackbar.value = {
        message: "Datos Actualizados",
        type: "success",
        model: true
      };
    } else {
      alert('Error al actualizar el tiempo');
    }
  } catch (error) {
    console.error('Error al actualizar el tiempo:', error);
  }
};

// Obtener el tiempo inicial al montar el componente
onMounted(() => {
  getTime();
});
</script>

<style scoped>
/* Aquí puedes agregar estilos para tu componente */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  width: fit-content;
}
</style>
