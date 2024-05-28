<template>
  <div>
    <VTextField v-model="endpointUrl" label="Endpoint" />
    <br>

    <VBtn color="success" @click="exportToCSV" :disabled="loading || !endpointUrl">Exportar a CSV</VBtn>
    <p class="mt-3" v-if="loading">Leyendo los datos para la descarga...</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const loading = ref(false);
const endpointUrl = ref('');

const exportToCSV = async () => {
  if (!endpointUrl.value) {
    alert('Por favor ingrese la URL del endpoint.');
    return;
  }

  loading.value = true;
  let allData = [];

  try {
    const response = await axios.get(endpointUrl.value);
    allData = response.data.data;

    if (allData.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const csvContent = convertToCSV(allData);
    downloadCSV(csvContent);
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    alert('Hubo un error al cargar los datos. Por favor, intenta de nuevo.');
  } finally {
    loading.value = false;
  }
};

const convertToCSV = (data) => {
  // const keys = ['email', 'last_name'];
  const keys = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(keys.join(','));

  // Add data rows
  for (const row of data) {
    const values = keys.map(key => {
      const escapedValue = ('' + row[key]).replace(/"/g, '\\"');
      return `"${escapedValue}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

const downloadCSV = (csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'data.csv');
  a.click();
  window.URL.revokeObjectURL(url);
};
</script>
