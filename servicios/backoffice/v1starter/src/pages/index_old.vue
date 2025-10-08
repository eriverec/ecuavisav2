<script setup>

import { useUserListStore } from "@/views/apps/user/useUserListStore";

import UserTabDispositivos from '@/views/dashboards/traceability/UserTabDispositivos.vue';
import UserTabIntereses from '@/views/dashboards/traceability/UserTabIntereses.vue';
import UserTabNavegacion from '@/views/dashboards/traceability/UserTabNavegacion.vue';
import UserTabUbicacion from '@/views/dashboards/traceability/UserTabUbicacion.vue';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { ref } from "vue";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const userListStore = useUserListStore();
const totalUsers = ref(0);
const totalAppUsers = ref(0);

const totalDevicesUser = ref(0);
const totalDevicesEmail = ref(0);
const totalDevicesFacebook = ref(0);
const totalDevicesGoogle = ref(0);
const totalDevicesApple = ref(0);

const totalFacebook = ref(0);
const totalGoogle = ref(0);
const totalEmail = ref(0);
const totalApple = ref(0);

const totalAppFacebook = ref(0);
const totalAppGoogle = ref(0);
const totalAppEmail = ref(0);
const totalAppApple = ref(0);

const percentEmail = ref(0);
const percentFacebook = ref(0);
const percentGoogle = ref(0);
const percentApple = ref(0);

const percentAppEmail = ref(0);
const percentAppFacebook = ref(0);
const percentAppGoogle = ref(0);
const percentAppApple = ref(0);

const isLoading = ref(true);

// 👉 Fetching users

const countUsers = () => {
  userListStore
    .countUsers()
    .then((response) => {
      const pE = ref(0);
      const pF = ref(0);
      const pG = ref(0);
      const pA = ref(0);

      const pAppE = ref(0);
      const pAppF = ref(0);
      const pAppG = ref(0);
      const pAppA = ref(0);

      totalUsers.value = (response.data.totalEmail) + (response.data.totalFacebook) + (response.data.totalGoogle)  + (response.data.totalApple);
      totalEmail.value = response.data.totalEmail;
      totalFacebook.value = response.data.totalFacebook;
      totalGoogle.value = response.data.totalGoogle;
      totalApple.value = response.data.totalApple;

      //DATOS DE APP
      totalAppUsers.value = (response.data.totalAppEmail) + (response.data.totalAppGoogle) + (response.data.totalAppFacebook) + (response.data.totalAppApple);
      totalAppEmail.value = response.data.totalAppEmail;
      totalAppFacebook.value = response.data.totalAppFacebook;
      totalAppGoogle.value = response.data.totalAppGoogle;
      totalAppApple.value = response.data.totalAppApple;
      
      let total = totalUsers.value;
      
      let totalApp = totalAppUsers.value;

      totalDevicesUser.value = (response.data.totalEmail) + (response.data.totalFacebook) + (response.data.totalGoogle) + (totalApp);
      totalDevicesEmail.value = (response.data.totalEmail) + (response.data.totalAppEmail);
      totalDevicesFacebook.value = (response.data.totalFacebook) + (response.data.totalAppFacebook);
      totalDevicesGoogle.value = (response.data.totalGoogle) + (response.data.totalAppGoogle);
      totalDevicesApple.value = (response.data.totalApple) + (response.data.totalAppApple);

      pE.value = (totalEmail.value * 100 ) / total;
      percentEmail.value = Math.round((pE.value + Number.EPSILON) * 100) / 100;

      pF.value = (totalFacebook.value * 100 ) / total;
      percentFacebook.value = Math.round((pF.value + Number.EPSILON) * 100) / 100;

      pG.value = (totalGoogle.value * 100 ) / total;
      percentGoogle.value = Math.round((pG.value + Number.EPSILON) * 100) / 100;

      pA.value = (totalApple.value * 100 ) / total;
      percentApple.value = Math.round((pA.value + Number.EPSILON) * 100) / 100;

      //DATOS DE APP
      pAppE.value = (totalAppEmail.value * 100 ) / totalApp;
      percentAppEmail.value = Math.round((pAppE.value + Number.EPSILON) * 100) / 100;

      pAppF.value = (totalAppFacebook.value * 100 ) / totalApp;
      percentAppFacebook.value = Math.round((pAppF.value + Number.EPSILON) * 100) / 100;

      pAppG.value = (totalAppGoogle.value * 100 ) / totalApp;
      percentAppGoogle.value = Math.round((pAppG.value + Number.EPSILON) * 100) / 100;

      pAppA.value = (totalAppApple.value * 100 ) / totalApp;
      percentAppApple.value = Math.round((pAppA.value + Number.EPSILON) * 100) / 100;

      isLoading.value = false;
      
      //accionBackoffice();

    })
    .catch((error) => {
      console.error(error);
    });
};
async function accionBackoffice (){
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "dashboard",
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
}

const route = useRoute()
const userData = ref()
const userTab = ref(null)

userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
})

const tabs = [
  
  {
    icon: 'tabler-devices',
    title: 'Dispositivos',
  },
  {
    icon: 'tabler-activity-heartbeat',
    title: 'Navegación',
  },
  {
    icon: 'tabler-map-2',
    title: 'Ubicaciones',
  },
  // {
  //   icon: 'tabler-hand-click',
  //   title: 'Intereses',
  // }
]



countUsers();
const userListMeta = [
{
  icon: '<svg xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#7367f0" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/></svg>',
  color: "primary",
  title: "Total de Usuarios",
  stats: totalUsers ,
  percentage: null ,
  percentageApp: null, 
  subtitle: totalAppUsers,
  total: totalDevicesUser
},

  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.39 14" width="1rem" height="1rem"><g id="Capa_2" data-name="Capa 2"><g id="logo"><path d="M14.19,12.16a1.66,1.66,0,0,0-1.66-1.66H1.66a1.66,1.66,0,0,0,0,3.32H12.53A1.66,1.66,0,0,0,14.19,12.16Z" style="fill:#7367f0"/><path d="M32.52.19a1.68,1.68,0,0,0-2.25.68L25.09,9.14,20.23.77A1.72,1.72,0,0,0,18.77.08H7.82a1.66,1.66,0,0,0,0,3.32h9.53a1,1,0,0,1,.78.36l5.39,9.3a1.71,1.71,0,0,0,.71.75,1.66,1.66,0,0,0,2.25-.68L33.19,2.44A1.67,1.67,0,0,0,32.52.19Z" style="fill:#7367f0"/><path d="M19.25,13.83a1.65,1.65,0,0,0,.79-2.2s-2.38-4-3.24-5.74a1.12,1.12,0,0,0-1-.63H4.48a1.66,1.66,0,0,0,0,3.32H14a.65.65,0,0,1,.58.29C15.41,10.55,17,13,17,13.05A1.65,1.65,0,0,0,19.25,13.83Z" style="fill:#7367f0"/></g></g></svg>',
    color: "error",
    title: "Total con Email",
    stats: totalEmail,
    percentage: percentEmail,
    percentageApp: percentAppEmail, 
    subtitle: totalAppEmail,
    total: totalDevicesEmail
  },
  {
    icon: '<svg width="1rem" height="1rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
    color: "success",
    title: "Total con Facebook",
    stats: totalFacebook,
    percentage: percentFacebook,
    percentageApp: percentAppFacebook, 
    subtitle: totalAppFacebook,
    total: totalDevicesFacebook
  },
  {
    icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="1rem" height="1rem" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    color: "warning",
    title: "Total con Google",
    stats: totalGoogle,
    percentage: percentGoogle,
    percentageApp: percentAppGoogle, 
    subtitle: totalAppGoogle,
    total: totalDevicesGoogle
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1rem" height="1rem"><path d="M11.6734 7.2221C10.7974 7.2221 9.44138 6.2261 8.01338 6.2621C6.12938 6.2861 4.40138 7.3541 3.42938 9.0461C1.47338 12.4421 2.92538 17.4581 4.83338 20.2181C5.76938 21.5621 6.87338 23.0741 8.33738 23.0261C9.74138 22.9661 10.2694 22.1141 11.9734 22.1141C13.6654 22.1141 14.1454 23.0261 15.6334 22.9901C17.1454 22.9661 18.1054 21.6221 19.0294 20.2661C20.0974 18.7061 20.5414 17.1941 20.5654 17.1101C20.5294 17.0981 17.6254 15.9821 17.5894 12.6221C17.5654 9.8141 19.8814 8.4701 19.9894 8.4101C18.6694 6.4781 16.6414 6.2621 15.9334 6.2141C14.0854 6.0701 12.5374 7.2221 11.6734 7.2221ZM14.7934 4.3901C15.5734 3.4541 16.0894 2.1461 15.9454 0.850098C14.8294 0.898098 13.4854 1.5941 12.6814 2.5301C11.9614 3.3581 11.3374 4.6901 11.5054 5.9621C12.7414 6.0581 14.0134 5.3261 14.7934 4.3901Z" fill="rgba(0,0,0,1)"></path></svg>`,
    color: "warning",
    title: "Total con Apple",
    stats: totalApple,
    percentage: percentApple,
    percentageApp: percentAppApple, 
    subtitle: totalAppApple,
    total: totalDevicesApple
  },
];


</script>
<style>
@media screen and (max-width: 1500px) and (min-width: 1280px) {
  .tarjeta {
    width: 185px;
  }
  .tarjeta svg {
   display: none;
  }
}

@media screen and (max-width: 3000px) and (min-width: 1501px) {
  .tarjeta {
    width: 215px;
  }
 
}

</style>
<template>

  <section>
    <VRow >
      <VCol class="mr-6"
    
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="12"
        lg="2"
      >

      
      <VCard class="col-12 col-sm- col-lg-2 tarjeta" >
  <VCardText class="d-flex justify-space-between" style="font-size:11px;">
    <div>
      <span>{{ meta.title }}</span>
      <div>
        <div class="d-flex align-center gap-2 my-1">
          <svg xmlns="http://www.w3.org/2000/svg" color="#7367F0" width="18" height="18" viewBox="0 0 256 256"><path fill="currentColor" d="M245.11 60.68c-7.65-13.19-27.84-16.16-58.5-8.66A95.93 95.93 0 0 0 32 128a98 98 0 0 0 .78 12.31C5.09 169 5.49 186 10.9 195.32C16 204.16 26.64 208 40.64 208a124.11 124.11 0 0 0 28.79-4A95.93 95.93 0 0 0 224 128a97.08 97.08 0 0 0-.77-12.25c12.5-13 20.82-25.35 23.65-35.92c1.95-7.32 1.36-13.76-1.77-19.15ZM128 48a80.11 80.11 0 0 1 78 62.2c-17.06 16.06-40.15 32.53-62.07 45.13c-27.55 15.81-51.45 25.67-70.51 31.07A79.94 79.94 0 0 1 128 48ZM24.74 187.29c-1.46-2.51-.65-7.24 2.22-13a79.05 79.05 0 0 1 10.29-15.05a96 96 0 0 0 18 31.32c-17.25 2.9-28.01 1.05-30.51-3.27ZM128 208a79.45 79.45 0 0 1-38.56-9.94a370 370 0 0 0 62.43-28.86c21.58-12.39 40.68-25.82 56.07-39.08A80.07 80.07 0 0 1 128 208ZM231.42 75.69c-1.7 6.31-6.19 13.53-12.63 21.13a95.69 95.69 0 0 0-18-31.35c14.21-2.35 27.37-2.17 30.5 3.24c.9 1.57.95 3.92.13 6.98Z"/></svg>
<!-- Ícono para "Web" -->
          <label class="text-primary">Web:</label>  {{ meta.stats }}
          <span class="text-success" :hidden="meta.percentage ? false : true " >({{ meta.percentage }}%) </span>
        </div>
        <div class="d-flex align-center gap-2 my-1">
          <svg xmlns="http://www.w3.org/2000/svg" color="#7367F0" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="m17.578 4.432l-2-1.05C13.822 2.461 12.944 2 12 2s-1.822.46-3.578 1.382l-.321.169l8.923 5.099l4.016-2.01c-.646-.732-1.688-1.279-3.462-2.21Zm4.17 3.532l-3.998 2V13a.75.75 0 0 1-1.5 0v-2.287l-3.5 1.75v9.441c.718-.179 1.535-.607 2.828-1.286l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.597-1.014.597-2.277.597-4.8v-.117c0-1.893 0-3.076-.252-3.978ZM11.25 21.904v-9.44l-8.998-4.5C2 8.866 2 10.05 2 11.941v.117c0 2.525 0 3.788.597 4.802c.598 1.015 1.674 1.58 3.825 2.709l2 1.049c1.293.679 2.11 1.107 2.828 1.286ZM2.96 6.641l9.04 4.52l3.411-1.705l-8.886-5.078l-.103.054c-1.773.93-2.816 1.477-3.462 2.21Z"/></svg>
 <!-- Ícono para "App" -->
          <label class="text-primary">App:</label> {{ meta.subtitle }} <span class="text-success" :hidden="meta.percentageApp ? false : true " >({{ meta.percentageApp }}%) </span>
        </div>
        <div class="d-flex align-center gap-2 my-1">
          <svg xmlns="http://www.w3.org/2000/svg" color="#7367F0" width="18" height="18" viewBox="0 0 26 26"><path fill="currentColor" d="M12.906-.031a1 1 0 0 0-.125.031A1 1 0 0 0 12 1v1H3a3 3 0 0 0-3 3v13c0 1.656 1.344 3 3 3h9v.375l-5.438 2.719a1.006 1.006 0 0 0 .875 1.812L12 23.625V24a1 1 0 1 0 2 0v-.375l4.563 2.281a1.006 1.006 0 0 0 .875-1.812L14 21.375V21h9c1.656 0 3-1.344 3-3V5a3 3 0 0 0-3-3h-9V1a1 1 0 0 0-1.094-1.031zM2 5h22v13H2V5zm18.875 1a1 1 0 0 0-.594.281L17 9.563L14.719 7.28a1 1 0 0 0-1.594.219l-2.969 5.188l-1.219-3.063a1 1 0 0 0-1.656-.344l-3 3a1.016 1.016 0 1 0 1.439 1.44l1.906-1.906l1.438 3.562a1 1 0 0 0 1.812.125l3.344-5.844l2.062 2.063a1 1 0 0 0 1.438 0l4-4A1 1 0 0 0 20.875 6z"/></svg>
 <!-- Ícono para "Total" -->
          <label class="text-primary">Total:</label> {{ meta.total }}
        </div>
      </div>
    </div>
    <VAvatar
      rounded
      variant="tonal"
      :color="meta.color"
      v-html="meta.icon"
       max-width="100%"
    />

  </VCardText>
</VCard>

      </VCol>
    </VRow>

    <VCol
      class="mt-5"
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
            :size="15"
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
        <!-- DISPOSITIVOS -->
        <VWindowItem>
          <UserTabDispositivos />
        </VWindowItem>
        <!-- NAVEGACION -->
        <VWindowItem>
          <UserTabNavegacion />
        </VWindowItem>
        <!-- UBICACIONES -->
        <VWindowItem>
          <UserTabUbicacion />
        </VWindowItem>


        <!-- INTERESES -->
        <VWindowItem>
          <UserTabIntereses />
        </VWindowItem>


   
      </VWindow>
    </VCol>
  </section>
</template>
