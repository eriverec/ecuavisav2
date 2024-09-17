<template>
  <VSelect
    v-model="selectedPaquete"
    :items="paquetes"
    item-title="nombre"
    item-value="_id"
    label="Seleccionar paquete"
    @update:model-value="updatePaquete"
    :loading="loading"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { usePaqueteStore } from './paqueteStore';

const { idPaquete, setIdPaquete } = usePaqueteStore();

const selectedPaquete = ref(idPaquete.value);
const paquetes = ref([]);
const loading = ref(true);

const fetchPaquetes = async () => {
  try {
    const response = await axios.get('https://ecuavisa-suscripciones.vercel.app/paquete/backoffice/display-all');
    if (response.data.resp && Array.isArray(response.data.data)) {
      paquetes.value = response.data.data;
    } else {
      console.error('Formato de respuesta inesperado:', response.data);
    }
  } catch (error) {
    console.error('Error al obtener los paquetes:', error);
  } finally {
    loading.value = false;
  }
};

const updatePaquete = (value) => {
  setIdPaquete(value);
};

onMounted(async () => {
  await fetchPaquetes();
  if (!selectedPaquete.value && paquetes.value.length > 0) {
    selectedPaquete.value = paquetes.value[0]._id;
    updatePaquete(selectedPaquete.value);
  }
});
</script>