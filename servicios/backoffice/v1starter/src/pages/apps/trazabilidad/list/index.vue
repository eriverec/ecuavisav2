<script setup>
import { useUserListStore } from "@/views/apps/user/useUserListStore";


const userListStore = useUserListStore();
const userTab = ref(null);

const userej = [
  {
    user: 'Usuario 1',
    total: 1,
    prependIcon: 'tabler-user',
  },
  {
    user: 'Usuario 2',
    total: 2,
    prependIcon: 'tabler-user',
  }
]
const currentTab = ref('tab-fieles')
const tabItemContent = 'Candy canes donut chupa chups candy canes lemon drops oat cake wafer. <br> Second texto.'



</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-fieles">Fidelidad</VTab>
          <!-- <VTab value="tab-intereses">Intereses</VTab> -->
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-fieles">
                <VCardTitle>Lista de los 500 usuarios mas fieles a ecuavisa.com </VCardTitle>
                <VCardSubtitle> De click en el botón "ver perfil de usuario" para ver mas detalles del usuario </VCardSubtitle>
                <!-- inicio lista Usuarios -->
                
                  <VList lines="two" >
                    <template  v-for="(user, index) in datos" :key="user.total" >
                      <VListItem border>
                        <!-- <template #prepend>
                          <VIcon :icon="user.prependIcon" class="me-3" />
                        </template> -->

                        <VListItemTitle>
                          <span>Id: {{ user.user }}</span>
                        </VListItemTitle>
                        <VListItemSubtitle class="mt-1">
                          <span class="text-xs text-disabled">Usuario N° {{ index + 1 }}</span>
                        </VListItemSubtitle>
                        <template #append>
                          <VChip color="primary" class="mr-4" >{{ user.total }} Sesiones </VChip>
                          <!-- <VBtn size="small" href="/apps/user/view/"> Ver usuario </VBtn> -->
                          <RouterLink :to="{ name: 'apps-user-view-id',  params: { id: user.user }, }" class="font-weight-medium user-list-name" >
                            <VBtn size="small"> Ver Perfil de usuario <VIcon end icon="tabler-user" /></VBtn>
                          </RouterLink>
                        </template>
                      </VListItem>
                    </template>
                  </VList>
                
                <!-- fin lista usuarios -->
              </VWindowItem>

              <VWindowItem value="tab-intereses">
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
      datos: [],
      currentTab: 'tab-fieles'
    };
  },
  mounted() {
    this.obtenerDatos();
  },
  methods: {
    async obtenerDatos() {
      const respuesta = await fetch(`https://servicio-de-actividad.vercel.app/actividad/all`);
      const datos = await respuesta.json();
      const registros = datos.data;
      const sumatoriaPorUsuario = {};

      registros.forEach(registro => {
        const user = registro.user;
        const cantidad = 1;

        if (!sumatoriaPorUsuario[user]) {
          sumatoriaPorUsuario[user] = 0;
        }

        sumatoriaPorUsuario[user] += cantidad;
      });

      const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(user => ({ user, total: sumatoriaPorUsuario[user] }));

      sumatoriasArray.sort((a, b) => b.total - a.total);
      console.log(sumatoriasArray);
      // return sumatoriasArray;
      const maxRegistros = 500;
      const solo500 = sumatoriasArray.slice(0, maxRegistros);
      this.datos = solo500; // trae solo 500 registros y la asignamos a la variable datos principal
      // this.datos = sumatoriasArray; // trae todps 
    }
  },
};
</script>
