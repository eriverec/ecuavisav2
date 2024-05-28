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

    <div>{{ totalRegistrosHtml }}</div>

    <VPagination
      :total-visible="5"
      v-model="currentPage"
      :length="totalRegistros"
      class="mt-4"
      @click="handlePaginationClick"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const fechaIngresada = ref(null);
const data = ref([]);
const currentPage = ref(1);
const totalRegistros = ref(1);
const itemsPerPage = 10;
const totalRegistrosHtml = ref(1);
const paginatedData = ref([]);

const fechaIngesada = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().slice(0, 10), // 3 días antes de la fecha actual
  end: new Date().toISOString().slice(0, 10) // Fecha actual
});

onMounted(() => {
  // getCampaigns(1, 10, fechaIngesada.value.start, fechaIngesada.value.end);
  fetchData(currentPage.value, 10,fechaIngesada.value.start, fechaIngesada.value.end);
});



// const paginatedData = computed(() => {
//   const startIndex = (currentPage.value - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   return data.value.slice(startIndex, endIndex);
// });

// const handlePaginationClick = (page) => {
//   currentPage.value = page;
//   console.log(currentPage.value);
// };

const handlePaginationClick = async () => {
  await fetchData(currentPage.value, 10, fechaIngesada.value.start, fechaIngesada.value.end);

};

const resolveFechaSelected = (fechas) => {
  if (fechas && fechas.length === 2) {
    const [start, end] = fechas;

    fechaIngesada.value = {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };

    // const fechaInicialFormateada = fechaInicial.toISOString().split('T')[0];
    // const fechaFinalFormateada = fechaFinal.toISOString().split('T')[0];
    fetchData(currentPage.value, 10,fechaIngesada.value.start, fechaIngesada.value.end);
  }
};

const fetchData = async (page = 1, limit = 10, fechaInicial, fechaFinal) => {
  const url = `https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados?fechai=${fechaInicial}&fechaf=${fechaFinal}&limit=${limit}&page=${page}&idCurso=664e32d4fa50c162c4a2e5c8`;

  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    data.value = jsonData.data;
    totalRegistrosHtml.value = jsonData.total;
    paginatedData.value = jsonData.data;
    // totalRegistros.value = jsonData.total;
    totalRegistros.value = Math.ceil(jsonData.total / jsonData.limit);
    console.log(jsonData.limit);
    console.log(jsonData.total);

  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};


</script>