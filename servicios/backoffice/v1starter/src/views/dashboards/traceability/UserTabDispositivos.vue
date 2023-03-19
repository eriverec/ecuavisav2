<script setup>
import Moment from 'moment';
import esLocale from "moment/locale/es";
import { extendMoment } from 'moment-range';
import ChartAreaDispositivosFecha from "@/views/charts/apex-chart/ChartAreaDispositivosfecha.vue";
import ChartAreaDispositivos from "@/views/charts/apex-chart/ChartAreaDispositivos.vue";

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
            <VCardTitle>Actividad</VCardTitle>
            <VCardSubtitle>De dispositivos</VCardSubtitle>
          </VCardItem>
          <ChartAreaDispositivosFecha />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Actividad</VCardTitle>
            <VCardSubtitle>De dispositivos</VCardSubtitle>
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

        <VTable class="text-no-wrap w-100">
          <thead>
            <tr>
              <th scope="col">BROWSER</th>
              <th scope="col">DEVICE</th>
              <th scope="col">LOCATION</th>
              <th scope="col">RECENT ACTIVITY</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(dat, index) in datosFiltrados" :key="index">
              <td>
                 <span v-for="iconD in iconDevices" :key="iconD.browser">
                  <VAvatar v-if="dat.os === iconD.os" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ dat.browser }} on {{ dat.os }}</span>
              </td>
              <td class="text-medium-emphasis">{{ dat.device }}</td>
              <td class="text-medium-emphasis">{{ dat.country }}</td>
              <td class="text-medium-emphasis">{{ dat.timestamp }}</td>
            </tr>
          </tbody>
        </VTable>
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
  mounted() {
    this.obtenerDatos();
  },
  methods: {
    async obtenerDatos() {
      const respuesta = await fetch("https://servicio-de-actividad.vercel.app/dispositivos/all");
      const datos = await respuesta.json();
      this.datos = datos.data;
      this.filtrarDatos([]);
    },
    filtrarDatos(selectedDates, dateStr, instance) {
      if(selectedDates.length > 1){
        var fechaInicio = moment(selectedDates[0], "YYYY-MM-DD");
        var fechaFin = moment(selectedDates[1], "YYYY-MM-DD");
        this.datosFiltrados = this.datos.filter((dato) => {
          const timestamp = moment(dato.timestamp, "DD-MM-YYYY");
          var range = moment().range(fechaInicio, fechaFin);
          return range.contains(timestamp);
        });
      }
      if(selectedDates.length == 0){
        this.datosFiltrados = this.datos;
      }
    },
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
    },
    actualizarTabla() {
      // Actualizar el arreglo de datos
      this.personas = [
        { nombre: 'Ana', edad: 28 },
        { nombre: 'Luis', edad: 33 },
        { nombre: 'Sara', edad: 40 },
      ];
    },
  },
};
</script>