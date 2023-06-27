<script setup>
import axios from '@axios';

const currentTab = ref('tab-lista')
const checkbox = ref(1)
</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-lista" class=" d-none">Listado</VTab>
          <VTab value="tab-agregar" class=" d-none">Estadísticas</VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
                  <div>
                    <VCardTitle v-if="usuarioFielModel">Configura los módulos eventuales de ecuavisa.com </VCardTitle>
                    <VCardSubtitle> Parametriza sus opciones para que los módulos funcionen correctamente  </VCardSubtitle>
                  </div>
                  
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                  <VList lines="two" >
                    <template  v-for="(element, index) in datos" :key="index" >
                      <VListItem border  v-if="element.nameModule"> <!--solo traemos módulos -->
                        <!-- <template #prepend>
                          <VIcon :icon="user.prependIcon" class="me-3" />
                        </template> -->

                        <VListItemTitle>
                          <span>{{ element.urlactual }}</span>
                          <span v-if="element.nameModule">Módulo de: {{ element.nameModule }}</span>
                          
                        </VListItemTitle>
                        <VListItemSubtitle class="mt-1" color="info">
                          <!-- <span class="text-xs text-disabled">Item N° {{ index + 1 }}: {{ element.description }}</span> -->
                        </VListItemSubtitle>
                        <template #append>
                          <vSwitch
                            v-model="element.configuracionModuloSugerencias"
                            :label="element.configuracionModuloSugerencias ? 'Activo' : 'Inactivo'"
                          />
                        </template>
                      </VListItem>
                    </template>
                  </VList>
                  <VBtn class="mt-5" color="success" @click="clicka()"> Aplicar Cambios en Ecuavisa.com<VIcon end icon="tabler-cloud-upload" /> </VBtn>
                <!-- fin lista usuarios -->
              </VWindowItem>

              <VWindowItem value="tab-agregar">
                <!-- <p>Próximamente</p> -->

              </VWindowItem>

              <!-- <VWindowItem v-for="item in 3" :key="item" >
                {{ tabItemContent }}
              </VWindowItem> -->
            </VWindow>
          </VCardText>
        </VCard>

      </VCol>
    </VRow>
  </section>
</template>
<style scoped>  
.v-card.v-theme--dark .iframe-dark {
  display: block;
}
.v-card.v-theme--dark .iframe-light{
  display: none;
}

.v-card.v-theme--light .iframe-dark{
  display: none;
}
.v-card.v-theme--light .iframe-light{
  display: block;
}
</style>

<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

export default {
  data() {
    return {
      usuarioFielModel:500,
      listUsuarioFieles:[
        {title:"20", value:20 },
        {title:"30", value:30 },
        {title:"50", value:50 },
        {title:"100", value:100 },
        {title:"300", value:300 },
        {title:"400", value:400 },
        {title:"500", value:500 },
        {title:"700", value:700 },
        ],
      datos: [],
      suggestion: {
        title: "",
        description: "",
        estado: true,
      },
      estado: "",
      maxRegistros:500,
      currentTab: 'tab-lista'
    };
  },
  watch: {
    // async usuarioFielModel(newVal, oldVal) {
    //   this.maxRegistros = newVal;
      // this.obtenerDatos();
    // }
    
  },
  async mounted() {
    this.authorizedCheck();
    this.obtenerDatos();
    await this.accionBackoffice();
  },
  methods: {
    async clicka(){
      console.log(JSON.stringify(this.datos));
      var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify(this.datos);
      var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
      await fetch('https://estadisticas.ecuavisa.com/sites/services/global/index.php',requestOptions)
      .then(response =>{			
      }).catch(error => console.log('error', error));
      await this.obtenerDatos();
      //console.log('presionaste el click');
      //console.log(JSON.stringify(this.datos));

    },
    async obtenerDatos() {
      const respuesta = await fetch(`https://estadisticas.ecuavisa.com/sites/services/global/datareader.php`);
      const datos = await respuesta.json();
      // const registros = datos; //datos.data;
      const sumatoriaPorUsuario = {};
      this.datos = datos; // eljson de datos lo hacemos el nuevo valor del app this.datos
    },

    async handleSubmit() {
      try {
        const response = await axios.post(
          "https://sugerencias-ecuavisa.vercel.app/add",
          this.suggestion
        );
        window.location.reload();
        // this.$router.push("/apps/sugerencias/list");
      } catch (error) {
        console.error(error);
      }
    },

    //journal de usuarios del backoffice
    async accionBackoffice (){
      let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
      let userData = JSON.parse(localStorage.getItem('userData'));
      if(userData.email !== 'admin@demo.com' ){
      var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
          var log = JSON.stringify({
                "usuario": userData.email,   
                "pagina": "ecuavisa.com-modulos",
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
      },
      authorizedCheck (){
      let rol = localStorage.getItem('role');
       if(rol !== 'administrador' && rol !== 'webmaster'){
      this.$router.push({ path: '/pages/errors/not-authorized' })
        }
      },
  },
};
</script>
