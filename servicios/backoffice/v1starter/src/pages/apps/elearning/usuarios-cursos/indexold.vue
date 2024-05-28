



<template>
  <div>
    <AppDateTimePicker
      style="width: 400px"
      prepend-inner-icon="tabler-calendar"
      density="compact"
      v-model="fechaIngresada"
      show-current
      @on-change="resolveFechaSelected"
      :config="{
        position: 'auto right',
        mode: 'range',
        altFormat: 'F j, Y',
        dateFormat: 'd-m-Y',
        maxDate: new Date(),
        minDate: new Date('2023-04-09'),
        reactive: true,
        clearable: true,
      }"
    />

    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedData" :key="item._id">
          <td>{{ item.first_name }}</td>
          <td>{{ item.last_name }}</td>
        </tr>
      </tbody>
    </table>

    <div>Total de registros: {{ totalRegistros }}</div>

    <VPagination
      :total-visible="5"
      v-model="currentPage"
      :length="totalRegistros"
      class="mt-4"
      @click.native="handlePaginationClick"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const fechaIngresada = ref(null);
const data = ref([]);
const currentPage = ref(1);
const totalRegistros = ref(0);
const itemsPerPage = 10;


const paginatedData = computed(() => {
  if (data.value && data.value.length > 0) {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.value.slice(startIndex, endIndex);
  } else {
    return [];
  }
});

const handlePaginationClick = (page) => {
  console.log(page);
  currentPage.value = page;
  fetchData();
};

const resolveFechaSelected = (fechas) => {
  if (fechas && fechas.length === 2) {
    const [fechaInicial, fechaFinal] = fechas;
    const fechaInicialFormateada = fechaInicial.toISOString().split('T')[0];
    const fechaFinalFormateada = fechaFinal.toISOString().split('T')[0];
    fechaIngresada.value = fechas;
    fetchData(fechaInicialFormateada, fechaFinalFormateada);
  }
};

const fetchData = async (fechaInicial = '2024-05-22', fechaFinal = '2024-05-27') => {
  const url = `https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados?fechai=${fechaInicial}&fechaf=${fechaFinal}&limit=500&page=${currentPage.value}&idCurso=664e32d4fa50c162c4a2e5c8`;

  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    data.value = jsonData.data;
    totalRegistros.value = jsonData.total;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};

fetchData();
</script>