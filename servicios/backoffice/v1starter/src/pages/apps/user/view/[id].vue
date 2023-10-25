<script setup>
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import UserBioPanel from '@/views/apps/user/view/UserBioPanel.vue'
import UserNotifications from '@/views/apps/user/view/UserNotifications.vue'
import UserSugerencias from '@/views/apps/user/view/UserSugerencias.vue'
import UserTabOverview from '@/views/apps/user/view/UserTabOverview.vue'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import esLocale from "moment/locale/es"

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const userListStore = useUserListStore()
const route = useRoute()
const userData = ref()

const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());
const userBackoffice = ref(JSON.parse(localStorage.getItem('userData')));

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
  console.log(response.data);
})
};
watchEffect(fetchId); 

async function accionBackoffice (logData){
	if(userBackoffice.value.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify(logData);
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
};

accionBackoffice({
  "usuario": userBackoffice.value.email,   
  "pagina": "lista-usuarios-usuario"+route.params.id,
  "fecha": dateNowF.value
})



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
    <!-- <UserTemas /> -->
  </VCol>

  <VCol
      cols="12"
      md="7"
      lg="12"
    >
    <UserNotifications/>
    
  </VCol>
  
    <UserSugerencias/>
    
    
 
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
