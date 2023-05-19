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
        <VDivider/>
          
          <ChartAreaDispositivosFecha @activityData="getActivity"/>   
        
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4" id="id-card-actividad">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Usuarios</VCardTitle>
            <VCardSubtitle> Registro de actividad de los usuarios</VCardSubtitle>
          </VCardItem>
          
        <VTable class="text-no-wrap w-100 px-4">
          <thead>
            <tr>
              <th scope="col">USUARIO</th>
              <th scope="col">DISPOSITIVO</th>
              <th scope="col">OS</th>   
              <th scope="col">BROWSER</th>
              <th scope="col" >ACTIVIDAD</th>
            </tr>
          </thead>
          <tbody v-if="visibleData.length">
            <tr v-for="(dat, index) in visibleData" :key="index">
              
              <td class="text-medium-emphasis">{{ dat.users[0].first_name }} {{ dat.users[0].last_name }}</td>
              <td class="text-medium-emphasis">{{ dat.device }}</td>
              <td>
                 <span v-for="iconD in iconDevices" :key="iconD.browser">
                  <VAvatar v-if="(dat.os == 'Linux' & dat.device == 'movil' ? 'Android' : dat.os) === iconD.os" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ dat.os == 'Linux' & dat.device == 'movil' ? 'Android' : dat.os }}</span>
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
              
              <td class="text-medium-emphasis" >{{ dat.navigationRecord }}</td>
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
          <span class="px-2">{{ currentPage }} de {{ totalPages }} de un total de {{ dataN.length }} registros</span>

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

//alert(moment(new Date(), "YYYY-MM-DD").format('YYYY-MM-DD'))
export default {
  data() {
    return {
      visita: true,
      fechaInicio: "",
      fechaFin: "",
      datos: [],
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
      ]
    };
  },
  computed: {
    totalPages() {
    //return Math.ceil(this.datosFiltrados.length / this.itemsPerPage);
      return Math.ceil(this.dataN.length / this.itemsPerPage);
    },
    /*visibleData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.datosFiltrados.slice(start, end);
    },*/
    visibleData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      
      const final = JSON.parse(JSON.stringify(this.dataN));
      if(this.visita){
        
      for(var i in final){
        final[i].navigationRecord = 1;                           
      }     
      
      }else{

      final.sort((a, b)=> {
        if (a.navigationRecord > b.navigationRecord){
            return -1;  
        }
        if (a.navigationRecord < b.navigationRecord){
            return 1;  
        }
      });
      }
      this.datosGrouped = final;
      console.log('final',final);
      console.log('visita',this.visita);
      console.log('dataN',this.dataN);
      
      return this.datosGrouped.slice(start, end);
    },
  },
  mounted() {
    //this.filtrarDatos([]);
  },
  methods: {
    resolveActivity(){
     
    },
    getActivity(value) {
      this.dataN = value.data;
      this.visita = value.visita;
      console.log('llega',value); 
    }
  
  },
};
</script>