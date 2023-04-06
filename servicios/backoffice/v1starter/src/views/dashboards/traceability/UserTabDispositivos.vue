<script setup>
import ChartAreaDispositivosFecha from "@/views/charts/apex-chart/ChartAreaDispositivosfecha.vue";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

import { Spanish } from 'flatpickr/dist/l10n/es.js';
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const smsVerificationNumber = ref("+1(968) 819-2547");
const isTwoFactorDialogOpen = ref(false);



// console.log(recentDevices);

// const listItems = ref([]);

/*
async function getData() {
  const res = await fetch(
    "https://servicio-de-actividad.vercel.app/dispositivos/all/X@2023"
  );
  const finalRes = await res.json();

  const nivelget = finalRes;
  // console.log(nivelget);

  listItems.value = nivelget;
}

getData();
*/



</script>

<style type="text/css">
.disabled {
  opacity: 0.1;
  pointer-events: none;
}
</style>
<template>
  <VRow>
    <!-- 👉  Area chart -->
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Resumen de Tecnología</VCardTitle>
            <VCardSubtitle>Categoría de dispositivos de los últimos 7 días</VCardSubtitle>
          </VCardItem>
          <ChartAreaDispositivosFecha />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4" id="id-card-actividad">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Plataformas</VCardTitle>
            <VCardSubtitle> Registro de actividad de los últimos  dispositivos</VCardSubtitle>
          </VCardItem>
          
          <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
          <div class="date-picker-wrapper" style="width: 233px">
            <AppDateTimePicker id="date-picker" placeholder="Seleccionar una fecha" prepend-inner-icon="tabler-calendar"
              density="compact" 
              @on-change="filtrarDatos"
              :config="{ 
                locale: Spanish,
                mode:'range',
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
                maxDate: new Date()
              }"
            />
        </div>

        <VTable class="text-no-wrap w-100 px-4">
          <thead>
            <tr>
              <th scope="col">NAVEGADOR</th>
              <th scope="col">DISPOSITIVO</th>
              <th scope="col">PAIS</th>
              <th class="text-right" scope="col" align="right">REGISTRO DE TIEMPO</th>
            </tr>
          </thead>
          <tbody v-if="visibleData.length">
            <tr v-for="(dat, index) in visibleData" :key="index">
              <td>
                 <span v-for="iconD in iconDevices" :key="iconD.browser">
                  <VAvatar v-if="dat.os === iconD.os" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ dat.browser }} on {{ dat.os }}</span>
              </td>
              <td class="text-medium-emphasis">{{ dat.device }}</td>
              <td class="text-medium-emphasis">
                <div style="
                          display: flex;
                          align-items: center;
                          flex-direction: revert;
                          gap: 5px;
                      ">
                  <img style="width: 27px;" v-bind:src="'https://www.countryflagicons.com/FLAT/64/' + dat.countryCode + '.png'">
                  <p class="py-0 my-0">{{ dat.country }}</p>
                </div>
              </td>
              <td class="text-medium-emphasis" align="right">{{ dat.timestamp }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4">No se encontraron datos.</td>
            </tr>
          </tbody>
        </VTable>
        <div class="pagination px-4">
          <v-btn
            :disabled="currentPage === 1" @click="currentPage -= 1"
            size="small"
            color="primary"
          >
            Anterior
          </v-btn>
          <span class="px-2">{{ currentPage }} de {{ totalPages }} de un total de {{ datos.length }} registros</span>

          <v-btn
            :disabled="currentPage === totalPages" @click="currentPage += 1"
            size="small"
            color="primary"
          >
            Siguiente
          </v-btn>
        </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- 👉 Enable One Time Password Dialog -->
  <EnableOneTimePasswordDialog v-model:isDialogVisible="isTwoFactorDialogOpen" :mobile-number="smsVerificationNumber" />
</template>
<script>

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
//alert(moment(new Date(), "YYYY-MM-DD").format('YYYY-MM-DD'))
export default {
  data() {
    return {
      fechaInicio: "",
      fechaFin: "",
      datos: [],
      datosFiltrados: [],
      currentPage: 1,
      itemsPerPage: 10,
      totalPaginas: 0,
      iconDevices: [
        {
          browser: "Chrome",
          os: "Windows",
          icon: "tabler-brand-windows",
          color: "info",
        },
        {
          browser: "Safari",
          os: "Mac OS",
          icon: "tabler-brand-apple",
          color: "secondary",
        },
        {
          browser: "Chrome",
          os: "Android",
          icon: "tabler-brand-android",
          color: "success",
        },
      ]
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.datosFiltrados.length / this.itemsPerPage);
    },
    visibleData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.datosFiltrados.slice(start, end);
    },
  },
  mounted() {
    this.filtrarDatos([]);
  },
  methods: {
    async obtenerDatos(fechai, fechaf) {
      fechaf = moment(fechaf, "MM/DD/YYYY").add(1, 'days').format("MM/DD/YYYY");
      const respuesta = await fetch(`https://servicio-de-actividad.vercel.app/dispositivos/all?fechai=${fechai}&fechaf=${fechaf}`);
      const datos = await respuesta.json();
      this.datos = datos.data;

      this.datos.sort(function(a, b) {
        var timestampA = new Date(moment(a.timestamp, "DD-MM-YYYY"));
        var timestampB = new Date(moment(b.timestamp, "DD-MM-YYYY"));
        return  timestampB - timestampA;
      });

      this.datosFiltrados = this.datos.filter((dato) => {
        const timestamp = moment(dato.timestamp, "DD-MM-YYYY");
        var range = moment().range(fechai, fechaf);
        return range.contains(timestamp);
      });
      this.currentPage = 1;

      var carActividad = document.querySelector("#id-card-actividad");
      carActividad.classList.remove("disabled");
      return datos.data;
    },
    filtrarDatos(selectedDates, dateStr, instance) {
      var fechaInicio;
      var fechaFin;
      var existe = false;

      if(selectedDates.length > 1){
        fechaInicio = moment(selectedDates[0], "YYYY-MM-DD").format("MM/DD/YYYY");
        fechaFin = moment(selectedDates[1], "YYYY-MM-DD").format("MM/DD/YYYY");
        existe = true;
      }

      if(selectedDates.length == 0){
        fechaInicio = moment(new Date(), "YYYY-MM-DD").add(-7, 'days').format("MM/DD/YYYY");
        fechaFin = moment(new Date(), "YYYY-MM-DD").format("MM/DD/YYYY");
        existe = true;
      }

      if(existe){
        var carActividad = document.querySelector("#id-card-actividad");
        carActividad.classList.add("disabled");
        this.obtenerDatos(fechaInicio, fechaFin);
        //const inicio = (this.currentPage - 1) * this.itemsPerPage;
        //const fin = inicio + this.itemsPerPage;
        //this.datosFiltrados = datosFiltrados.slice(inicio, fin);
        //this.totalPaginas = Math.ceil(datosFiltrados.length / this.itemsPerPage);
      }
    }
  },
};
</script>