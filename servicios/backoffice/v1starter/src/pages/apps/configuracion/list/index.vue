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

                
                <!-- inicio lista Usuarios -->
                  
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
                          <span class="text-xs text-disabled">Item N° {{ index + 1 }}: {{ element.description }}</span>
                        </VListItemSubtitle>
                        <template #append>
                          <vSwitch
                            v-model="element.configuracionModuloSugerencias"
                            :label="element.configuracionModuloSugerencias ? 'Activo' : 'Inactivo'"
                          />
                          <!-- <VCheckbox v-model="{{element.configuracionModuloSugerencias}}" :label="capitalizedLabel(checkboxOne)" /> -->
                          <!-- <VChip :color="title.estado == true ? 'success' : 'warning'" class="mr-4" >{{ element.estado == true ? 'Activo' : 'Inactivo' }} </VChip> -->
                          <!-- <VChip :color="default" class="mr-4" >{{ element.users_suscribed }} Suscrito(s) </VChip> -->
                          <!-- <VBtn size="small" href="/apps/user/view/"> Ver usuario </VBtn> -->
                          <!-- <RouterLink :to="{ name: 'apps-sugerencias-slug-id',  params: { id: element._id }, }" class="font-weight-medium user-list-name" >
                            <VBtn  variant="text" rounded="pill">
                              <VIcon icon="mdi-pencil" /> 
                            </VBtn>
                          </RouterLink> -->
                        </template>
                      </VListItem>
                    </template>
                  </VList>
                  <VBtn class="mt-5" color="success" @click="load(0)"> Aplicar Cambios en Ecuavisa.com<VIcon end icon="tabler-cloud-upload" /> </VBtn>
                <!-- fin lista usuarios -->
              </VWindowItem>

              <VWindowItem value="tab-agregar">
                <!-- <p>Próximamente</p> -->
                <!-- <iframe src="http://localhost/ecuavisav2/servicios/embeds/sugerenciasAnalytics.html" frameborder="0"></iframe> -->
                <!-- <div>
                  <iframe style="background:#2f3349 ;" class="iframe-dark" src="https://ecuavisadev.netlify.app/servicios/embeds/suganalyticsdark.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>
                  <iframe class="iframe-light" src="https://ecuavisadev.netlify.app/servicios/embeds/suganalyticslight.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>

                </div> -->



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
  mounted() {
    this.obtenerDatos();
  },
  methods: {
    // direccionar() {
    //   window.location.href = 'https://servicio-de-actividad.vercel.app/actividad/users/fidelidad/export/excel?limit='+this.maxRegistros;
    // },
    async obtenerDatos() {
      const respuesta = await fetch(`https://estadisticas.ecuavisa.com/sites/services/global/datareader.php`);
      const datos = await respuesta.json();
      const registros = datos; //datos.data;
      const sumatoriaPorUsuario = {};

      registros.forEach(registro => {
        // const title = registro.urlactual;
        // const estado = registro.estado;

      });/**/

      // const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(title => ({ title, users_suscribed: sumatoriaPorUsuario[title] }));
      // const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(urlactual => ({ urlactual  })).map(milliseconds => ({ milliseconds }));

      // sumatoriasArray.sort((a, b) => b.title - a.title);
      //console.log(sumatoriasArray);
      // return sumatoriasArray;
      //const solo500 = sumatoriasArray.slice(0, maxRegistros);
      this.datos = registros; // trae solo 500 registros y la asignamos a la variable datos principal
      // this.datos = sumatoriasArray; // trae todos 
      // this.currentTab = 'tab-lista'; 
    },
    async handleSubmit() {
      try {
        const response = await axios.post(
          "https://sugerencias-ecuavisa.vercel.app/add",
          this.suggestion
        );
        window.location.reload();
        // this.$router.push("/apps/sugerencias/list");

        // this.currentTab = ref('tab-lista');
        
        // this.obtenerDatos(); 
        // this.currentTab = 'tab-lista'; // aquí se cambia el tab activo a 'tab-lista'
        // this.$forceUpdate()
        
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
