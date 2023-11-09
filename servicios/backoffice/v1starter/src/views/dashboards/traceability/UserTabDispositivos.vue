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
        <ChartAreaDispositivosFecha />
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard>
        <VCardItem class="header_card_item">
            <div class="d-flex">
              <div class="descripcion">
                <VCardTitle>Plataformas</VCardTitle>
                <VCardSubtitle>Registro de actividad de los últimos  dispositivos.<br>mostrando data desde {{ selectedFecha.i.format("YYYY-MM-DD") }} hasta {{ selectedFecha.f.format("YYYY-MM-DD") }}</VCardSubtitle>
              </div>
            </div>

          <template #append>
            <div class="bg-ecuavisa py-2">
              <div class="date-picker-wrapper" style="width: 250px;">
                <VCombobox :disabled="isLoading" v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint
                  hide-selected hint="" />
              </div>
            </div>
          </template>
        </VCardItem>


        <VCardText class="d-flex flex-wrap justify-space-between gap-4" id="id-card-actividad"><!-- 
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Plataformas</VCardTitle>
            <VCardSubtitle> Registro de actividad de los últimos  dispositivos</VCardSubtitle>
          </VCardItem> -->
          
          <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
          <!-- <div class="date-picker-wrapper" style="width: 233px">
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
        </div> -->

        <VTable class="text-no-wrap w-100">
          <thead>
            <tr>
              <th scope="col">NAVEGADOR</th>
              <th scope="col">DISPOSITIVO</th>
              
              <th class="text-right" scope="col" align="right">SESIONES</th>
            </tr>
          </thead>
          <tbody v-if="visibleData.length">
            <tr v-for="(dat, index) in visibleData" :key="index">
              <td>
                 <span v-for="iconD in iconDevices" :key="iconD.browser">
                  <VAvatar v-if="(dat._id.os == 'Linux' & dat._id.device == 'movil' ? 'Android' : dat._id.os) === iconD.os" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ dat._id.browser || "Otro" }} on {{ (dat._id.os == 'Linux' & dat._id.device == 'movil' ? 'Android' : dat._id.os) || "SO indefinido" }}</span>
              </td>
              <td class="text-medium-emphasis">
                <span v-for="iconD in device" :key="iconD.name">
                  <VAvatar v-if="(iconD.name) === dat._id.device" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ dat._id.device }}</span>
              </td>
               <!--
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
               -->
              <td class="text-medium-emphasis" align="right">{{ dat.sesiones }}</td>
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
          <span class="px-2">{{ currentPage }} de {{ totalPages }} de un total de {{ datosGrouped.length }} registros</span>

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
  import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  import { ref, watch } from 'vue';  // Importa ref y watch desde Vue 3
//alert(moment(new Date(), "YYYY-MM-DD").format('YYYY-MM-DD'))
export default {
  data() {
    return {
      selectedFecha:useSelectValueCalendar("Hoy"),
      selectedfechaIniFin:"Hoy",
      fechaInicio: null,
      fechaFin: null,
      datos: [],
      datosFiltrados: [],
      datosGrouped: [],
      isLoading: true,
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
        {
          browser: "Chrome",
          os: "Linux",
          icon: "mdi-linux",
          color: "success",
        },
      ],
      device: [
        {
          name: "movil",
          icon: "mdi-cellphone-android",
        },
        {
          name: "desktop",
          icon: "mdi-laptop-chromebook",
        }
      ]
    };
  },
  computed: {
    totalPages() {
    //return Math.ceil(this.datosFiltrados.length / this.itemsPerPage);
      return Math.ceil(this.datosGrouped.length / this.itemsPerPage);
    },
    /*visibleData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.datosFiltrados.slice(start, end);
    },*/
    visibleData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.datosGrouped = this.datosFiltrados;
      // this.datosGrouped = this.datosFiltrados.reduce( (a,b) => {
      //  var i = a.findIndex( (x) => x.os == b.os & x.browser == b.browser & x.device == b.device );
      //  return i === -1 ? a.push({ os : b.os, browser: b.browser, device: b.device, sessions : 1 }) : a[i].sessions++, a;
      //  }, []);

      /* this.datosGrouped.sort((a, b)=> {
        if (a.browser === b.browser){
          if (a.os === b.os){
            return a.device < b.device ? -1 : 1  
          }
          return a.os < b.os ? -1 : 1
        } else {
          return a.browser < b.browser ? -1 : 1
        }
      });*/

      // this.datosGrouped.sort((a, b)=> {
      //   if (a.sessions > b.sessions){
      //       return -1;  
      //   }
      //   if (a.sessions < b.sessions){
      //       return 1;  
      //   }
      // });
      // console.log(this.datosGrouped)
      return this.datosGrouped.slice(start, end);
    },
  },
  async mounted() {
    this.selectedFecha = useSelectValueCalendar("Hoy");
    this.fechaIniFinList = useSelectCalendar();

    // this.filtrarDatos([]);
    this.fechaInicio = this.selectedFecha.i.format("MM/DD/YYYY");
    this.fechaFin = this.selectedFecha.f.format("MM/DD/YYYY");
    this.getData = await this.obtenerDatos(this.fechaInicio, this.fechaFin);
    this.accionBackoffice();
    this.isLoading = false;
  },
  methods: {
    async obtenerDatos(fechai, fechaf) {
      fechaf = moment(fechaf, "MM/DD/YYYY").add(1, 'days').format("MM/DD/YYYY");
      const respuesta = await fetch(`https://servicio-de-actividad.vercel.app/plataformas/v2/all?fechai=${fechai}&fechaf=${fechaf}`);
      const datos = await respuesta.json();
      this.datos = datos.data;
      this.datosFiltrados = this.datos;
      // this.datos.sort(function(a, b) {
      //   var timestampA = new Date(moment(a.timestamp, "DD-MM-YYYY"));
      //   var timestampB = new Date(moment(b.timestamp, "DD-MM-YYYY"));
      //   return  timestampB - timestampA;
      // });

      // this.datosFiltrados = this.datos.filter((dato) => {
      //   const timestamp = moment(dato.timestamp, "DD-MM-YYYY");
      //   var range = moment().range(fechai, fechaf);
      //   return range.contains(timestamp);
      // });
      this.currentPage = 1;

      var carActividad = document.querySelector("#id-card-actividad");
      carActividad.classList.remove("disabled");
      return datos.data;
    },
    // filtrarDatos(selectedDates, dateStr, instance) {
    //   var fechaInicio;
    //   var fechaFin;
    //   var existe = false;

    //   if(selectedDates.length > 1){
    //     fechaInicio = moment(selectedDates[0], "YYYY-MM-DD").format("MM/DD/YYYY");
    //     fechaFin = moment(selectedDates[1], "YYYY-MM-DD").format("MM/DD/YYYY");
    //     existe = true;
    //   }

    //   if(selectedDates.length == 0){
    //     fechaInicio = moment(new Date(), "YYYY-MM-DD").add(-7, 'days').format("MM/DD/YYYY");
    //     fechaFin = moment(new Date(), "YYYY-MM-DD").format("MM/DD/YYYY");
    //     existe = true;
    //   }

    //   if(existe){
    //     var carActividad = document.querySelector("#id-card-actividad");
    //     carActividad.classList.add("disabled");
    //     this.obtenerDatos(fechaInicio, fechaFin);
    //     //const inicio = (this.currentPage - 1) * this.itemsPerPage;
    //     //const fin = inicio + this.itemsPerPage;
    //     //this.datosFiltrados = datosFiltrados.slice(inicio, fin);
    //     //this.totalPaginas = Math.ceil(datosFiltrados.length / this.itemsPerPage);
    //   }
    // },
    async accionBackoffice (){
      let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
      let userData = JSON.parse(localStorage.getItem('userData'));
      if(userData.email !== 'admin@demo.com' ){
      var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "dashboard-dispositivos",
            "fecha": dateNow
					});
			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: log,
				redirect: 'follow'
			};
			await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
			.then(response =>{			
			}).catch(error => console.log('error', error));
    }
    }
  },

  watch: {
    async selectedfechaIniFin(newFecha, oldFecha) {
      this.selectedFecha = useSelectValueCalendar(newFecha);
      // console.log(selected)
      this.fechaInicio = this.selectedFecha.i.format("MM/DD/YYYY");
      this.fechaFin = this.selectedFecha.f.format("MM/DD/YYYY");
      
      // this.fechai = moment(selectedDates[0]).format('MM/DD/YYYY');
      // this.fechaf = moment(selectedDates[1]).format('MM/DD/YYYY');
      //var panelGrafico = document.querySelector("#apexchartscrejemplo");
      //panelGrafico.classList.add("disabled");

      this.isLoading = true;
      this.getData = await this.obtenerDatos(this.fechaInicio, this.fechaFin);
      this.isLoading = false;
    }
  }
};
</script>