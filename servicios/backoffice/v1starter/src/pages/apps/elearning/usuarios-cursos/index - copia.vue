<template>
  <div>

    <AppDateTimePicker style="width: 400px;" prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaIngesada" show-current=true
      @on-change="resolveFechaSelected" :config="{
        position: 'auto right',
        mode: 'range',
        altFormat: 'F j, Y',
        dateFormat: 'd-m-Y',
        maxDate: new Date(),
        minDate: new Date('2023-04-09'),
        reactive: true,
        clearable: true

      }" />


    <VTable class="text-no-wrap tableNavegacion mt-5 mb-5">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col">Apellido</th>
          <th scope="col">Correo</th>

        </tr>
    </thead>

      <tbody>
        <tr v-for="(user, index) of dataCampaigns" :key="index">
          <td class="text-medium-emphasis">
            {{ user.first_name }}
          </td>
          <td class="text-medium-emphasis">
            {{ user.last_name }}
          </td>
          <td class="text-medium-emphasis">
            {{ user.email }}
          </td>
        </tr>
      </tbody>
    </VTable>


    <span class="text-sm text-disabled">
      Total de registros {{ totalRegistrosHtml }}
    </span>

    <VPagination :total-visible="5" v-model="currentPage" :length="totalRegistros" class="mt-4"
      @click="handlePaginationClick" />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const currentPage = ref(1);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const dataCampaigns = ref([]);

import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
moment.tz.setDefault('America/Guayaquil');

const fechaIngesada = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().slice(0, 10), // 3 días antes de la fecha actual
  end: new Date().toISOString().slice(0, 10) // Fecha actual
});

// onMounted(getCampaigns)

onMounted(() => {
  getCampaigns(1, 10, fechaIngesada.value.start, fechaIngesada.value.end);
});

async function getCampaigns(page = 1, limit = 10, fechai, fechaf) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    // https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados?fechai=2024-05-22&fechaf=2024-05-27&limit=500&page=1&idCurso=664e32d4fa50c162c4a2e5c8
    var response = await fetch(`https://servicio-elearning.vercel.app/grafico/exportar/usuarios/registrados?fechai=${fechai}&fechaf=${fechaf}&page=${page}&limit=${limit}&idCurso=664e32d4fa50c162c4a2e5c8`, requestOptions);
    const data = await response.json();

    console.log(data);

    dataCampaigns.value = data.data;
    totalRegistrosHtml.value = data.total;
    totalRegistros.value = Math.ceil(data.total / limit);
  } catch (error) {
    return console.error(error.message);
  }
}

const handlePaginationClick = async () => {
  await getCampaigns(currentPage.value, 10, fechaIngesada.value.start, fechaIngesada.value.end);

};

// const search = () => {
//   currentPage.value = 1; // Reset current page to 1 when searching
//   getCampaigns(currentPage.value, 10, fechaIngesada.value.start, fechaIngesada.value.end);
// };

// const filteredUsers = computed(() => {
//   return dataCampaigns.value.filter(user => {
//     return user.first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) || user.last_name.toLowerCase().includes(searchTerm.value.toLowerCase());
//   });
// });


const resolveFechaSelected = async (fechaSeleccionada) => {

  if (typeof fechaSeleccionada === 'string') {
    const [start, end] = fechaSeleccionada.split(' a ');

    fechaIngesada.value = {
      start: moment(start, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      end: moment(end, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    };

    await getCampaigns(1, 10, fechaIngesada.value.start, fechaIngesada.value.end);
  } else {
    console.error('El valor de fechaSeleccionada no es una cadena de texto');
  }

  console.log(fechaIngesada.value);
};

// const resolveFechaSelected = (fechaSeleccionada) => {
//   fechaIngesada.value = fechaSeleccionada;
//   // console.log(fechaIngesada.value);

//   console.log(fechaIngesada.value.start);
//   // getCampaigns(currentPage.value, 10, fechaIngesada.value.start, fechaIngesada.value.end);
// };
</script>