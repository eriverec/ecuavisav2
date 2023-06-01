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
                          <span class="text-xs text-disabled">Item N° {{ index + 1 }}: {{ title.description }}</span>
                        </VListItemSubtitle>
                        <template #append>
                          <VChip :color="title.estado == true ? 'success' : 'warning'" class="mr-4" >{{ title.estado == true ? 'Activo' : 'Inactivo' }} </VChip>
                          <VChip :color="default" class="mr-4" >{{ title.users_suscribed }} Suscrito(s) </VChip>
                          <!-- <VBtn size="small" href="/apps/user/view/"> Ver usuario </VBtn> -->
                          <RouterLink :to="{ name: 'apps-sugerencias-slug-id',  params: { id: title._id }, }" class="font-weight-medium user-list-name" >
                            <VBtn  variant="text" rounded="pill">
                              <VIcon icon="mdi-pencil" /> 
                            </VBtn>
                          </RouterLink>
                        </template>
                      </VListItem>
                    </template>
                  </VList>
                
                <!-- fin lista usuarios -->
              </VWindowItem>

              <VWindowItem value="tab-agregar">
                <div class="pt-4">
                  <div class="d-flex align-center flex-wrap gap-2">
                    <!-- 👉 Reset button -->
                    <VSelect style="width: 190px;" class="" v-model="usuarioFielModel" :items="listUsuarioFieles" label="Listado de sugerencias"
                      clearable clear-icon="tabler-x" :searchable="false" />
                    <!-- 👉 Export button -->
                    <VBtn variant="tonal" color="success" class="d-none" prepend-icon="mdi-file-excel" @click="direccionar">
                      Exportar usuarios
                    </VBtn>
                    <!-- 👉 Add user button -->
                  </div>
                </div>
                <!-- <p>Próximamente</p> -->
                <!-- <iframe src="http://localhost/ecuavisav2/servicios/embeds/sugerenciasAnalytics.html" frameborder="0"></iframe> -->
                <div>
                  <iframe style="background:#2f3349 ;" class="iframe-dark" src="https://ecuavisadev.netlify.app/servicios/embeds/suganalyticsdark.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>
                  <iframe class="iframe-light" src="https://ecuavisadev.netlify.app/servicios/embeds/suganalyticslight.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>

                </div>

                <div class="body" v-if="listUsuariosG.length > 0">
                  <VTable class="text-no-wrap p-10">
                    <!-- 👉 table head -->
                    <thead>
                      <tr>
                        <th scope="col">Usuario</th>
                        <th scope="col">N. Teléfono</th>
                        <th scope="col">último inicio</th>
                      </tr>
                    </thead>
                    <!-- 👉 table body -->
                    <tbody >
                      <tr v-for="usuario in listUsuariosG" style="height: 3.5rem">
                        <!-- 👉 nombre modulo -->
                        <td>
                          <div class="d-flex align-center">
                          <VAvatar variant="tonal" class="me-3" size="38">
                            <VImg  :src="usuario.avatar || 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/usuario.png' " />
                          </VAvatar>

                          <div class="d-flex flex-column">
                            <h6 class="text-base">
                              <RouterLink
                                :to="{
                                  name: 'apps-user-view-id',
                                  params: { id: usuario.wylexId },
                                }"
                                class="font-weight-medium user-list-name"
                              >
                                {{ usuario.first_name }} {{ usuario.last_name }}
                              </RouterLink>
                            </h6>
                            <span class="text-sm text-disabled">{{
                              usuario.email
                            }}</span>
                          </div>
                        </div>
                        </td>

                        <td>
                          <div class="d-flex align-left">
                            <div class="d-flex flex-column">
                              <span class="text-capitalize text-base">
                                {{ usuario.phone_number }}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div class="d-flex align-left">
                            <div class="d-flex flex-column">
                              <span class="text-capitalize text-base">
                                {{ usuario.logged_at }}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </VTable>
                </div>

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
      listUsuariosG:[],
      usuarioFielModel:"",
      listUsuarioFieles:[],
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
    async usuarioFielModel(newVal, oldVal) {
      //alert(newVal)
      //this.maxRegistros = newVal;
      this.obtenerDatosGrupoUsuarios(newVal);
    }
  },
  mounted() {
    this.obtenerDatos();
  },
  methods: {
    // direccionar() {
    //   window.location.href = 'https://servicio-de-actividad.vercel.app/actividad/users/fidelidad/export/excel?limit='+this.maxRegistros;
    // },

    async obtenerDatosGrupoUsuarios(id) {
      const respuesta = await fetch(`https://sugerencias-ecuavisa.vercel.app/sugerencia/group/usuario?idSugerencia=${id}`);
      const datos = await respuesta.json();
      this.listUsuariosG = datos.data;
    },
    async obtenerDatos() {
      const respuesta = await fetch(`https://sugerencias-ecuavisa.vercel.app/all`);
      const datos = await respuesta.json();
      const registros = datos.data;
      const sumatoriaPorUsuario = {};
      var nuevaListSelect = [];

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

        nuevaListSelect.push({title:title, value:registro._id });
      });/**/

      this.listUsuarioFieles = nuevaListSelect;

      // const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(title => ({ title, users_suscribed: sumatoriaPorUsuario[title] }));
      const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(title => ({ title  })).map(estado => ({ estado }));

      sumatoriasArray.sort((a, b) => b.title - a.title);
      //console.log(sumatoriasArray);
      // return sumatoriasArray;
      //const solo500 = sumatoriasArray.slice(0, maxRegistros);
      this.datos = registros; // trae solo 500 registros y la asignamos a la variable datos principal
      // this.datos = sumatoriasArray; // trae todos 
      //this.currentTab = 'tab-lista'; 
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
