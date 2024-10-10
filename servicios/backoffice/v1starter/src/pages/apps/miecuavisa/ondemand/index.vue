<template>

<VSnackbar
      :timeout="2000"
      v-model="isSave"
      color="success"
      transition="scale-transition"
      location="top end"
    >
      Datos actualizados correctamente
    </VSnackbar>

  <VCard class="mt-5 card" title="Modal Omdemand" subtitle="Ecuavisa">
    <VCardText>
      <VRow class="ml-2 mr-2 mb-2">
        <VCol cols="12" md="6" lg="6">
          <VRow id="modal">
            <VCol cols="12">
              <VSwitch v-model="estado" :label="capitalizedLabel(estado)" />
            </VCol>
            <VCol cols="12">
              <VTextarea  label="Contenido del modal" type="text" v-model="contenido" />
            </VCol>
            <VCol cols="12">
              <VTextarea  label="URL" type="text" v-model="url" />
            </VCol>
            <VCol cols="12">
              <VBtn @click="updateData" color="success" variant="tonal">
                Guardar
              </VBtn>
            </VCol>
          </VRow>
        </VCol>

        <VCol cols="12" md="6" lg="6"></VCol>

      </VRow>

    </VCardText>
  </VCard>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Variables reactivas
const estado = ref(false);
const contenido = ref('');
const url = ref('');
const isSave = ref(false);

// Función para obtener los datos del JSON
const fetchData = async () => {
  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/getData.php');
    const data = await response.json();
    estado.value = data.data.estado === "true";
    contenido.value = data.data.contenido;
    url.value = data.data.url;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Llamar a la función al montar el componente
onMounted(fetchData);

// Función para actualizar los datos
const updateData = async () => {
  const newData = {
    key: "modalondemand",
    data: {
      estado: estado.value ? "true" : "false",
      contenido: contenido.value,
      url: url.value
    }
  };

  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    });
    const data = await response.json();
    console.log("data", data);
    if (data.success) {
      isSave.value = true;
      fetchData(); // Refrescar los datos después de la actualización
    } else {
      console.error('Error actualizando:', data.error);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
};

// Función para capitalizar el label del switch
const capitalizedLabel = (estado) => {
  return estado ? 'Activo' : 'Inactivo';
};
</script>

<style scoped>
/* Estilos personalizados para el componente */
</style>