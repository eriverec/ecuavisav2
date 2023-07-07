<script setup>
import ChartAreaDispositivosFecha from "@/views/charts/apex-chart/ChartDispositivosExtra.vue";
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
          <VDivider />

          <ChartAreaDispositivosFecha @activityData="getActivity" /> 

        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard>
        <VCardText class=" flex-wrap justify-space-between gap-4" id="id-card-actividad">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Usuarios</VCardTitle>
            <VCardSubtitle> Registro de actividad de los usuarios</VCardSubtitle>
          </VCardItem>
          
          <VCardItem class="pt-0 pb-0">
            <div class="dataTable d-none">No se encontraron datos.</div>
          </VCardItem>


          <VTable class="text-no-wrap w-100 px-4 tableDataUser" >
            <thead>
              <tr>
                <th scope="col">USUARIO</th>
                <th scope="col">DISPOSITIVO</th>
                <th scope="col">OS</th>
                <th scope="col">BROWSER</th>
                <th scope="col">ACTIVIDAD</th>
              </tr>
            </thead>


            <tbody v-if="visibleData.length">
              <tr v-for="(dat, index) in visibleData" :key="index">

                <td class="text-medium-emphasis">{{ dat.first_name }} {{ dat.last_name }}</td>
                <td class="text-medium-emphasis">
                  <span v-for="iconD in device" :key="iconD.name">
                  <VAvatar v-if="(iconD.name) === dat.device" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ dat.device }}</span>
                </td>
                <td>
                  <span v-for="iconD in iconDevices" :key="iconD.browser">
                    <VAvatar v-if="(dat.os == 'Linux' & dat.device == 'movil' ? 'Android' : dat.os) === iconD.os"
                      :size="22" class="me-3">
                      <VIcon :color="iconD.color" :icon="iconD.icon" />
                    </VAvatar>
                  </span>
                  <span class="font-weight-medium">{{ dat.os == 'Linux' & dat.device == 'movil' ? 'Android' : dat.os
                  }}</span>
                </td>
                <td class="text-medium-emphasis">{{ dat.browser }}</td>


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

                <td class="text-medium-emphasis">{{ dat.total }}</td>
              </tr>
            </tbody>
            <tbody class="tablaDatos" v-else>
              <tr>
                <td colspan="4">No se encontraron datos.</td>
              </tr>
            </tbody>
         
          </VTable>
          <div class="pagination px-4 pagtable">
            <v-btn :disabled="currentPage === 1" @click="currentPage -= 1" size="small" color="primary">
              Anterior
            </v-btn>
            <span class="px-2">{{ currentPage }} de {{ totalPages || 0 }} de un total de {{ datosGrouped.length || 0 }}
              registros</span>

            <v-btn :disabled="currentPage === totalPages" @click="currentPage += 1" size="small" color="primary">
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

//alert(moment(new Date(), "YYYY-MM-DD").format('YYYY-MM-DD'))
export default {
  data() {
    return {
      visita: true,
      fechaInicio: "",
      fechaFin: "",
      datos: [],
      isLoading: true,
      dataN: [],
      datosFiltrados: [],
      datosGrouped: [],
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
      this.isLoading = true;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      const arrayI = JSON.parse(JSON.stringify(this.dataN));
      const divText32 = document.querySelector('.dataTable');
      const divTable = document.querySelector('.tableDataUser');
      const divPageTable = document.querySelector('.pagtable');

      if(divText32){
        if (arrayI != 0) {
          console.log("lleno");
          divText32.classList.add('d-none');
          divTable.classList.remove('d-none');
          divPageTable.classList.remove('d-none');

        } else {
          console.log("vacio");
          divText32.classList.remove('d-none');
          divTable.classList.add('d-none');
          divPageTable.classList.add('d-none');

        }
      }


      

      if (arrayI.length !== 0) {
        this.isLoading = false;
        let arrayFixed = [];

        for (let j in arrayI) {
          //console.log('prueba', arrayI[j].users[0].first_name )
          let data = {
            device: arrayI[j].device,
            os: arrayI[j].os,
            browser: arrayI[j].browser,
            first_name: arrayI[j].users[0]?.first_name ? arrayI[j].users[0].first_name.trim() : "",
            last_name: arrayI[j].users[0]?.last_name ? arrayI[j].users[0].last_name.trim() : "",
            navigationRecord: arrayI[j].navigationRecord,
            total: 0

          }

          arrayFixed.push(data);
        }
        //console.log('fixed',arrayFixed);

        const final = arrayFixed.reduce((a, b) => {

          var i = a.findIndex((x) => x.first_name == b.first_name & x.last_name == b.last_name & x.os == b.os & x.browser == b.browser & x.device == b.device);
          return i === -1 ? a.push({
            os: b.os, browser: b.browser, device: b.device, navigationRecord: b.navigationRecord, first_name: b.first_name, last_name: b.last_name, total: b.navigationRecord, count: 1
          }) : (a[i].total += parseInt(a[i].navigationRecord), a[i].count++), a;
        }, []);

        //console.log('final', final);

        if (this.visita) {
          for (var i in final) {
            let count = final[i].count
            final[i].total = count;

          }
        }

        final.sort((a, b) => {
          if (a.total > b.total) {
            return -1;
          }
          if (a.total < b.total) {
            return 1;
          }
        });

        this.datosGrouped = final;

      }
      return this.datosGrouped.slice(start, end);
      //const final = JSON.parse(JSON.stringify(this.dataN));
      //const final = this.dataN.flat();      
      //let all = final.reduce((prev, next) => prev.concat(next.users), []);

      /*
     final = this.dataN.reduce( (a,b) => {
      var i = a.findIndex((x) => x.users[0].first_name == b.users[0].first_name & x.users[0].last_name == b.users[0].last_name);
      return i === -1 ? a.push({ os : b.os, browser: b.browser, device: b.device, sessions : 1 }) : a[i].sessions++, a;
      }, []);
      */


    },
  },
  mounted() {
    //this.filtrarDatos([]);
  },
  methods: {
    resolveActivity() {

    },
    getActivity(value) {
      this.dataN = value.data;
      this.visita = value.visita;
      this.isLoading = false;
      //console.log('llega',value); 
    }

  },
};
</script>