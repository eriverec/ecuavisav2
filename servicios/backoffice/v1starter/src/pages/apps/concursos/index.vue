<script setup>
import TriviaEstadisticas from '@/pages/apps/concursos/tabs/estadisticas.vue';
import TriviaParticipantes from '@/pages/apps/concursos/tabs/participantes.vue';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
const userTab = ref(null)

const tabsTrivia = [
  {
    icon: 'tabler-chart-bar',
    title: 'Estadísticas',
  },
  {
    icon: 'tabler-friends',
    title: 'Participantes',
  }
  // {
  //   icon: 'tabler-sitemap',
  //   title: 'Extras',
  // }
]
onMounted(accionBackoffice)
async function accionBackoffice (){
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "concursos-clickclickboom",
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
</script>

<template>
  <div>

    <VTabs v-model="userTab" class="v-tabs-pill">
      <VTab v-for="tab in tabsTrivia" :key="tab.icon">
        <VIcon :size="18" :icon="tab.icon" class="me-1" />
        <span>{{ tab.title }}</span>
      </VTab>
    </VTabs>

    <VWindow v-model="userTab" class="disable-tab-transition" :touch="false">
      <!-- Estadísticas -->
      <VWindowItem>
        <TriviaEstadisticas/>
      </VWindowItem>
      <!-- Participantes -->
      <VWindowItem>
        <TriviaParticipantes/>
      </VWindowItem>

      <!-- Extras -->
      <VWindowItem>
      </VWindowItem>

    </VWindow>


  </div>
</template>
