<template>
  <div>
    <button @click="exportToCSV" :disabled="loading">Exportar a CSV</button>
    <p v-if="loading">Cargando datos para la descarga...</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const loading = ref(false);

const exportToCSV = async () => {
  loading.value = true;
  let allData = [];
  let page = 1;
  const limit = 100;
  const idCurso = '664e32d4fa50c162c4a2e5c8';
  const fechai = '2024-05-23';
  const fechaf = '2024-05-28';

  try {
    while (true) {
      const response = await axios.get('https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados', {
        params: { fechai, fechaf, limit, page, idCurso }
      });

      const jsonData = response.data.data;
      if (jsonData.length === 0) break;

      allData = allData.concat(jsonData);
      page++;
    }

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
