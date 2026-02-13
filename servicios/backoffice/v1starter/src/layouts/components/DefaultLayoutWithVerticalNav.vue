<script setup>
import navItemsA from '@/navigation/vertical';
import navItemsVA from '@/navigation/verticalAudiencia';
import navItemsM from '@/navigation/verticalMarketing';
import navItemsMon from '@/navigation/verticalMonetizacion';
import navItemsRadar from '@/navigation/verticalRadar';
import navItemsR from '@/navigation/verticalRedaccion';
import navItemsV from '@/navigation/verticalVisor';
import navItemsWm from '@/navigation/verticalWebmaster';
import { useThemeConfig } from '@core/composable/useThemeConfig';
import Pusher from 'pusher-js';
// Components
import Footer from '@/layouts/components/Footer.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import UserProfile from '@/layouts/components/UserProfile.vue';

// @layouts plugin
import { VerticalNavLayout } from '@layouts';
import { computed, onMounted } from 'vue';

const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig()
const { width: windowWidth } = useWindowSize()
const isNavDrawerOpen = ref(false);
const rol = localStorage.getItem('role');
const usersData = ref([]);


const pusher =() =>{
      //Pusher.logToConsole = true;
      
      let a =  JSON.parse(localStorage.getItem('userData'));
      let email = a.email;
      const pusher = new Pusher(
        "69f5e107f97ef8dcc25f", 
        {
          cluster: "us2", 
          forceTLS: true,
          channelAuthorization: {
            paramsProvider: () => { return { param1: email }; },
            endpoint: "https://pusher-auth-mocha.vercel.app/pusher/auth",
          }
        }
      );     
      const channel = pusher.subscribe("presence-backoffice");
      
      channel.bind("pusher:subscription_succeeded", () =>
        channel.members.each((member) => usersData.value.push({email: member.id}))
      );
      channel.bind("pusher:member_added", (member) =>{
        
        usersData.value.push({email: member.id})
      });
      
      channel.bind("pusher:member_removed", (member) => {
      
      let array = Array.from(usersData.value); 
      const index = array.findIndex(u => u.email === member.id);
      if (index !== -1) {
        usersData.value.splice(index, 1);
      }     
      });
      
};

onMounted(pusher);

const resolveRole = computed(() =>{

if(rol== 'administrador'){
  return navItemsA;
}else if(rol== 'webmaster'){
  return navItemsWm;  
}else if(rol== 'redaccion'){
  return navItemsR;  
}else if(rol== 'marketing'){
  return navItemsM;
}else if(rol== 'audiencia'){
  return navItemsVA;
}else if(rol== 'monetizacion'){
  return navItemsMon;
}else if(rol== 'radar'){
  return navItemsRadar;
}else{
  return navItemsV;
}
});


</script>

<template>
  <VBtn v-if="rol== 'administrador'"
      icon
      size="small"
      class="app-customizer-toggler rounded-s-lg rounded-0"
      style="z-index: 1001; display: none;"
      @click="isNavDrawerOpen = true"
    >
      <VIcon icon="tabler-settings" />
    </VBtn>

    <VNavigationDrawer
      v-if="rol== 'administrador'"
      v-model="isNavDrawerOpen"
      temporary
      location="end"
      width="400"
      :scrim="false"
      class="app-customizer"
    >
      <!-- 👉 Header -->
      <div class="customizer-heading d-flex align-center justify-space-between">
        <div>
          <h6 class="text-h6">
            Usuarios activos
          </h6>
          <span class="text-body-1"></span>
        </div>
        <VBtn
          icon
          variant="text"
          color="secondary"
          size="x-small"
          @click="isNavDrawerOpen = false"
        >
          <VIcon
            icon="tabler-x"
            size="20"
          />
        </VBtn>
      </div>

      <VDivider />
      <div style="padding: 1rem;">
      <PerfectScrollbar
        tag="ul"
        :options="{ wheelPropagation: false }"
      >
      
      <VList
    lines="two"
    border
  >
    <template
      v-for="(user, index) of usersData"
      :key="user.email"
    >
      <VListItem>
        <VListItemTitle>
          {{ user.email }}
        </VListItemTitle>
        <VListItemSubtitle class="mt-1">
          <VBadge
            dot
            location="start center"
            offset-x="2"
            color="success"
            class="me-3"
          >
            <span class="ms-4">Online</span>
          </VBadge>     
        </VListItemSubtitle>       
      </VListItem>
      <VDivider v-if="index !== usersData.length - 1" />
    </template>
  </VList>
  
      </PerfectScrollbar>
    </div>
    </VNavigationDrawer> 
  <VerticalNavLayout
    :nav-items="resolveRole"
  >
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <VBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          icon
          variant="text"
          color="default"
          class="ms-n3"
          size="small"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon
            icon="tabler-pin"
            size="24"
          />
        </VBtn>

        <NavbarThemeSwitcher />

        <VSpacer />

        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition
        :name="appRouteTransition"
        mode="out-in"
      >
        <Component :is="Component" />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
<style lang="scss">
.app-customizer {
  .customizer-section {
    padding: 1.25rem;
  }

  .customizer-heading {
    padding-block: 0.875rem;
    padding-inline: 1.25rem;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

.app-customizer-toggler {
  position: fixed !important;
  inset-block-start: 50%;
  inset-inline-end: 0;
  transform: translateY(-50%);

  &:active {
    transform: translateY(-50%) !important;
  }
}
</style>