<script setup>
import axios from '@axios';

const currentTab = ref('tab-lista')
</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-lista">Listado</VTab>
          <VTab value="tab-agregar">Estadísticas</VTab>
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
                  <div>
                    <VCardTitle v-if="usuarioFielModel">Lista de temas a sugerir para los usuarios de ecuavisa.com </VCardTitle>
                    <VCardSubtitle> Al sugerir un tema nuevo y habilitarlo, aparecerá en el área de perfil del sitio </VCardSubtitle>
                  </div>
                  
                </div>

                
                <!-- inicio lista Usuarios -->
                  
                  <VList lines="two" >
                    <template  v-for="(title, index) in datos" :key="index" >
                      <VListItem border>
                        <!-- <template #prepend>
                          <VIcon :icon="user.prependIcon" class="me-3" />
                        </template> -->

                        <VListItemTitle>
                          <span>{{ title.title }}</span>
                        </VListItemTitle>
                        <VListItemSubtitle class="mt-1" color="info">
                          <span class="text-xs text-disabled">Item N° {{ index + 1 }}</span>
                        </VListItemSubtitle>
                        <template #append>
                          <!-- <VChip :color="user.navigationRecord < 50 ? 'default' : (title.navigationRecord < 100 ? 'warning' : 'success')" class="mr-4" >{{ title.navigationRecord }} Visitas </VChip> -->
                          <!-- <VChip :color="title.sesiones < 50 ? 'default' : (title.sesiones < 100 ? 'warning' : 'success')" class="mr-4" >{{ title.sesiones }} Sesiones </VChip> -->
                          <!-- <VBtn size="small" href="/apps/user/view/"> Ver usuario </VBtn> -->
                          <!-- <RouterLink :to="{ name: 'apps-user-view-id',  params: { id: user.userId }, }" class="font-weight-medium user-list-name" >
                            <VBtn size="small"> Ver Perfil de usuario <VIcon end icon="tabler-user" /></VBtn>
                          </RouterLink> -->
                        </template>
                      </VListItem>
                    </template>
                  </VList>
                
                <!-- fin lista usuarios -->
              </VWindowItem>

              <VWindowItem value="tab-agregar">
                <p>Próximamente</p>

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
      const respuesta = await fetch(`https://sugerencias-ecuavisa.vercel.app/all`);
      const datos = await respuesta.json();
      const registros = datos.data;
      const sumatoriaPorUsuario = {};

      registros.forEach(registro => {
        const title = registro.title;
        // const estado = registro.estado;
        const cantidad = 1;

        if (!sumatoriaPorUsuario[title]) {
          sumatoriaPorUsuario[title] = 0;
        }
        // if (!sumatoriaPorUsuario[estado]) {
        //   sumatoriaPorUsuario[estado] = 0;
        // }

        sumatoriaPorUsuario[title] += cantidad;
        // sumatoriaPorUsuario[estado] += cantidad;
      });/**/

      const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(title => ({ title, users_suscribed: sumatoriaPorUsuario[title] }));

      sumatoriasArray.sort((a, b) => b.title - a.title);
      //console.log(sumatoriasArray);
      // return sumatoriasArray;
      //const solo500 = sumatoriasArray.slice(0, maxRegistros);
      this.datos = registros; // trae solo 500 registros y la asignamos a la variable datos principal
      // this.datos = sumatoriasArray; // trae todps 
      this.currentTab = 'tab-lista'; 
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
