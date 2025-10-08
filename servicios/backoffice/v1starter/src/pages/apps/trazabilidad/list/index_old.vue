<script setup>
import { useUserListStore } from "@/views/apps/user/useUserListStore";

import UserTabNavegacion from "@/views/dashboards/traceabilityGlobal/UserTab1.vue";
import UserTabDispositivos from "@/views/dashboards/traceabilityGlobal/UserTab2.vue";
import UserTabIntereses from "@/views/dashboards/traceabilityGlobal/UserTab3.vue";
import UserTabUbicacion from "@/views/dashboards/traceabilityGlobal/UserTab4.vue";

const userListStore = useUserListStore();

const userTab = ref(null);
const tabs = [
  {
    icon: "tabler-abc",
    title: "item1",
  },
  {
    icon: "tabler-abc",
    title: "Item2",
  },
  {
    icon: "tabler-abc",
    title: "Item3",
  },
  {
    icon: "tabler-abc",
    title: "Item4",
  },
];
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
// async function sumarRegistrosPorUsuario() {
//   try {
//     const response = await axios.get('https://servicio-de-actividad.vercel.app/actividad/all');

//     const registros = response.data.data; // Obtener el array de registros del response (usando .data.data)

//     const sumatoriaPorUsuario = {};

//     registros.forEach(registro => {
//       const user = registro.user;
//       const cantidad = 1;

//       if (!sumatoriaPorUsuario[user]) {
//         sumatoriaPorUsuario[user] = 0;
//       }

//       sumatoriaPorUsuario[user] += cantidad;
//     });

//     const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(user => ({ user, total: sumatoriaPorUsuario[user] }));

//     sumatoriasArray.sort((a, b) => b.total - a.total);

//     return sumatoriasArray;
//   } catch (error) {
//     console.error(error);
//   }
// }

// sumarRegistrosPorUsuario()
//   .then(sumatoriasArray => console.log(sumatoriasArray))
//   .catch(error => console.error(error));
const currentTab = ref('tab-fieles')
const tabItemContent = 'Candy canes donut chupa chups candy canes lemon drops oat cake wafer. <br> Second texto .'


</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs  v-model="currentTab" class="v-tabs-pill" >
          <VTab value="tab-fieles">Lista de Usuarios Más Fieles</VTab>
          <!-- <VTab value="tab-intereses">Intereses</VTab> -->
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-fieles">
                <p>De click para visitar detalles del usuario</p>
                <!-- inicio lista Usuarios -->
                <VList nav :lines="true" >
                  <VListItem class="border-solid border-double" v-for="user in userej" :key="user.total" :value="user.total" >
                    <!-- <template #prepend>
                      <VIcon :icon="user.prependIcon" class="me-3" />
                    </template> -->

                    <VListItemTitle>
                      {{ user.user }}
                    </VListItemTitle>
                    <template #append>
                      <VBtn size="small" href="/apps/user/view/"> Ver usuario </VBtn>
                      <RouterLink  :to="{ name: 'apps-user-view-id',  params: { id: user.user }, }" class="font-weight-medium user-list-name" >
                      <VBtn size="small"> Ver usuario </VBtn>
                    </RouterLink>
                    </template>
                    
                  </VListItem>
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

        <!-- tabs dinamicos -->
        <!-- <VTabs v-model="userTab" class="">
          <VTab v-for="tab in tabs" :key="tab.icon">
            <VIcon :size="18" :icon="tab.icon" class="me-1" />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs> -->
        <!-- contenido de tabs dinamicos -->
        <VWindow v-model="userTab" class="mt-6 disable-tab-transition d-none"  :touch="false" >
          <!-- NAVEGACION -->
          <VWindowItem>
            <UserTabNavegacion />
          </VWindowItem>

          <!-- DISPOSITIVOS -->
          <VWindowItem>
            <UserTabDispositivos />
          </VWindowItem>

          <!-- INTERESES -->
          <VWindowItem>
            <UserTabIntereses />
          </VWindowItem>

          <!-- UBICACIONES -->
          <VWindowItem>
            <UserTabUbicacion />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

svg {
  vertical-align: middle;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.loader-section {
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  //background-color: rgba(114, 111, 116, 0.2);
  margin-top: -5%;
  z-index: 999;
  //transition: all 1s 1s ease-out;
  opacity: 1;
}
.loaded {
  opacity: 0;
  z-index: -1;
}
</style>

<script>
export default {
  data() {
    return {
      datos: [],
    };
  },
  computed: {
    // totalPages() {
    //   return Math.ceil(this.datosFiltrados.length / this.itemsPerPage);
    // }
    // obtenerDatos();
  },
  mounted() {
      this.obtenerDatos([]);
  },
  methods: {
    async obtenerDatos() {
      const respuesta = await fetch(`https://servicio-de-actividad.vercel.app/actividad/all`);
      const datos = await respuesta.json();
      // this.datos = datos.data;
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
    return sumatoriasArray;
      // return datos.data;
    }
  },
};
</script>