<script setup>
import { useUserListStore } from "@/views/apps/user/useUserListStore";

import AnalyticsEarningReportsWeeklyOverview from '@/views/dashboards/analytics/AnalyticsEarningReportsWeeklyOverview.vue'
import AnalyticsSalesByCountries from '@/views/dashboards/analytics/AnalyticsSalesByCountries.vue'
import CrmProjectStatus from '@/views/dashboards/crm/CrmProjectStatus.vue'
import UserTabInteres from '@/views/apps/user/view/UserTabInteres.vue'
import UserTabNavegacion from '@/views/apps/user/view/UserTabNavegacion.vue'
import UserTabUbicacion from '@/views/apps/user/view/UserTabUbicacion.vue'
import UserTabDispositivos from '@/views/apps/user/view/UserTabDispositivos.vue'

const userListStore = useUserListStore();
const totalUsers = ref(0);
const totalFacebook = ref(0);
const totalGoogle = ref(0);
const totalEmail = ref(0);
const percentEmail = ref(0);
const percentFacebook = ref(0);
const percentGoogle = ref(0);

// 👉 Fetching users

const countUsers = () => {
  userListStore
    .countUsers()
    .then((response) => {
      const pE = ref(0);
      const pF = ref(0);
      const pG = ref(0);
      totalUsers.value = response.data.fullUsers;
      totalEmail.value = response.data.totalEmail;
      totalFacebook.value = response.data.totalFacebook;
      totalGoogle.value = response.data.totalGoogle;
      
      let total = totalUsers.value;

      pE.value = (totalEmail.value * 100 ) / total;
      percentEmail.value = Math.round((pE.value + Number.EPSILON) * 100) / 100;

      pF.value = (totalFacebook.value * 100 ) / total;
      percentFacebook.value = Math.round((pF.value + Number.EPSILON) * 100) / 100;

      pG.value = (totalGoogle.value * 100 ) / total;
      percentGoogle.value = Math.round((pG.value + Number.EPSILON) * 100) / 100;
      

    })
    .catch((error) => {
      console.error(error);
    });
};

const route = useRoute()
const userData = ref()
const userTab = ref(null)

userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
})

const tabs = [
  {
    icon: 'tabler-activity-heartbeat',
    title: 'Navegación',
  },
  {
    icon: 'tabler-devices',
    title: 'Dispositivos',
  },
  {
    icon: 'tabler-hand-click',
    title: 'Intereses',
  },
  {
    icon: 'tabler-map-2',
    title: 'Ubicaciones',
  }
]

countUsers();
const userListMeta = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#7367f0" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/></svg>',
    color: "primary",
    title: "Total de Usuarios",
    stats: totalUsers,
    percentage: null ,
    subtitle: "",
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.39 14" width="3rem" height="3rem"><g id="Capa_2" data-name="Capa 2"><g id="logo"><path d="M14.19,12.16a1.66,1.66,0,0,0-1.66-1.66H1.66a1.66,1.66,0,0,0,0,3.32H12.53A1.66,1.66,0,0,0,14.19,12.16Z" style="fill:#7367f0"/><path d="M32.52.19a1.68,1.68,0,0,0-2.25.68L25.09,9.14,20.23.77A1.72,1.72,0,0,0,18.77.08H7.82a1.66,1.66,0,0,0,0,3.32h9.53a1,1,0,0,1,.78.36l5.39,9.3a1.71,1.71,0,0,0,.71.75,1.66,1.66,0,0,0,2.25-.68L33.19,2.44A1.67,1.67,0,0,0,32.52.19Z" style="fill:#7367f0"/><path d="M19.25,13.83a1.65,1.65,0,0,0,.79-2.2s-2.38-4-3.24-5.74a1.12,1.12,0,0,0-1-.63H4.48a1.66,1.66,0,0,0,0,3.32H14a.65.65,0,0,1,.58.29C15.41,10.55,17,13,17,13.05A1.65,1.65,0,0,0,19.25,13.83Z" style="fill:#7367f0"/></g></g></svg>',
    color: "error",
    title: "Total con Email",
    stats: totalEmail,
    percentage: percentEmail,
    subtitle: "",
  },
  {
    icon: '<svg width="2rem" height="2rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
    color: "success",
    title: "Total con Facebook",
    stats: totalFacebook,
    percentage: percentFacebook,
    subtitle: "",
  },
  {
    icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="2rem" height="2rem" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    color: "warning",
    title: "Total con Google",
    stats: totalGoogle,
    percentage: percentGoogle,
    subtitle: "",
  },
];


</script>

<template>
  <section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h6">
                  {{ meta.stats }}
                </h6>
                <span
                  class="text-success" :hidden="meta.percentage ? false : true " 
                  >({{ meta.percentage }}%) </span
                >
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              v-html="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCol
      class="mt-6"
      cols="12"
      md="12"
      lg="12"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
      <!-- NAVEGACION -->
        <VWindowItem>
          <AnalyticsEarningReportsWeeklyOverview />
        </VWindowItem>

        <!-- DISPOSITIVOS -->
        <VWindowItem>
          <UserTabDispositivos />
        </VWindowItem>

        <!-- INTERESES -->
        <VWindowItem>
          <CrmProjectStatus />
        </VWindowItem>

        <!-- UBICACIONES -->
        <VWindowItem>
          <AnalyticsSalesByCountries />
        </VWindowItem>

   
      </VWindow>
    </VCol>
  </section>
</template>
