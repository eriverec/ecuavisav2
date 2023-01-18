<script setup>
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import UserBioPanel from '@/views/apps/user/view/UserBioPanel.vue'
//import UserTabBillingsPlans from '@/views/apps/user/view/UserTabBillingsPlans.vue'
//import UserTabConnections from '@/views/apps/user/view/UserTabConnections.vue'
//import UserTabNotifications from '@/views/apps/user/view/UserTabNotifications.vue'
import UserTabOverview from '@/views/apps/user/view/UserTabOverview.vue'
import UserTemas from '@/views/apps/user/view/UserTemas.vue'
//import UserTabSecurity from '@/views/apps/user/view/UserTabSecurity.vue'

const userListStore = useUserListStore()
const route = useRoute()
const userData = ref()

const userTab = ref(null)
/*
const tabs = [
  {
    icon: 'tabler-user-check',
    title: 'Overview',
  },
  {
    icon: 'tabler-lock',
    title: 'Security',
  },
  {
    icon: 'tabler-currency-dollar',
    title: 'Billing & Plan',
  },
  {
    icon: 'tabler-bell',
    title: 'Notifications',
  },
  {
    icon: 'tabler-link',
    title: 'Connections',
  },
]
*/

const fetchId = () => {
userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data;
  
})
};
watchEffect(fetchId); 





var timeoutID;

const delayed = () =>  {
  timeoutID = window.setTimeout(fetchId, 1000);
}

const reloadP = () =>  {
  window.location.reload();
  console.log("reload")
}


</script>

<template>
  <VRow v-if="userData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel :user-data="userData"
      @reload = "delayed"/>
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
    <UserTabOverview :user-data="userData"/>
    <UserTemas />
  </VCol>
 
    <!--
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
-->
<!--
      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabOverview />
        </VWindowItem>
      </VWindow>

        <VWindowItem>
          <UserTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <UserTabBillingsPlans />
        </VWindowItem>

        <VWindowItem>
          <UserTabNotifications />
        </VWindowItem>

        <VWindowItem>
          <UserTabConnections />
        </VWindowItem>
      </VWindow>
    -->
   
  </VRow>
</template>
