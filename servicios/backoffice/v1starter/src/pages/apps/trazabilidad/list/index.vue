<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
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
//onMounted(accionBackoffice);

async function accionBackoffice (){
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "trazabilidad-lista",
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
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
                  <div>
                    <VCardTitle v-if="usuarioFielModel">Lista de los {{usuarioFielModel}} usuarios mas fieles a ecuavisa.com </VCardTitle>
                    <VCardSubtitle> De click en el botón "ver perfil de usuario" para ver mas detalles del usuario </VCardSubtitle>
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2">
                  <!-- 👉 Reset button -->
                  <VSelect style="width: 190px;" class="d-none" v-model="usuarioFielModel" :items="listUsuarioFieles" label="Usuarios fieles"
                    clearable clear-icon="tabler-x" :searchable="true" />
                  <!-- 👉 Export button -->
                  <VBtn variant="tonal" color="success" class="d-none" prepend-icon="mdi-file-excel" @click="direccionar">
                    Exportar usuarios
                  </VBtn>
                  <!-- 👉 Add user button -->
                </div>
                </div>

                
                <!-- inicio lista Usuarios -->
                  
                  <VList lines="two" >
                    <VCardTitle v-if="datos.length === 0"> Cargando...</VCardTitle>
                    <template  v-for="(user, index) in datos" :key="index" v-else >
                      <VListItem border>
                        <!-- <template #prepend>
                          <VIcon :icon="user.prependIcon" class="me-3" />
                        </template> -->

                        <VListItemTitle class="d-none">
                          <span>{{ (user.users.length > 0)? user.users[0].first_name + " " + user.users[0].last_name : "" }}</span>
                        </VListItemTitle>
                        <VListItemSubtitle class="mt-1" color="info">
                          <span class="text-xs text-disabled">Usuario N° {{ index + 1 }}, Tel. {{ (user.users.length > 0 ? user.users[0].phone_number : "") }}, UserId. {{ user.userId }}</span>
                        </VListItemSubtitle>
                        <template #append>
                          <VChip :color="user.navigationRecord < 50 ? 'default' : (user.navigationRecord < 100 ? 'warning' : 'success')" class="mr-4" >{{ user.navigationRecord }} Visitas </VChip>
                          <VChip :color="user.sesiones < 50 ? 'default' : (user.sesiones < 100 ? 'warning' : 'success')" class="mr-4" >{{ user.sesiones }} Sesiones </VChip>
                          <!-- <VBtn size="small" href="/apps/user/view/"> Ver usuario </VBtn> -->
                          <RouterLink :to="{ name: 'apps-user-view-id',  params: { id: user.userId }, }" class="font-weight-medium user-list-name" >
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
      maxRegistros:500,
      currentTab: 'tab-fieles'
    };
  },
  watch: {
    async usuarioFielModel(newVal, oldVal) {
      this.maxRegistros = newVal;
      this.obtenerDatos();
    }
  },
  mounted() {
    this.obtenerDatos();
  },
  methods: {
    direccionar() {
      window.location.href = 'https://servicio-de-actividad.vercel.app/actividad/users/fidelidad/export/excel?limit='+this.maxRegistros;
    },
    async obtenerDatos() {
      const respuesta = await fetch(`https://servicio-de-actividad.vercel.app/actividad/users/fidelidad?limit=${this.maxRegistros}`);
      const datos = await respuesta.json();
      const registros = datos.data;
      //const sumatoriaPorUsuario = {};

      /*registros.forEach(registro => {
        const user = registro.user;
        const cantidad = 1;

        if (!sumatoriaPorUsuario[user]) {
          sumatoriaPorUsuario[user] = 0;
        }

        sumatoriaPorUsuario[user] += cantidad;
      });*/

      //const sumatoriasArray = Object.keys(sumatoriaPorUsuario).map(user => ({ user, total: sumatoriaPorUsuario[user] }));

      //sumatoriasArray.sort((a, b) => b.total - a.total);
      //console.log(sumatoriasArray);
      // return sumatoriasArray;
      //const solo500 = sumatoriasArray.slice(0, maxRegistros);
      this.datos = registros; // trae solo 500 registros y la asignamos a la variable datos principal
      // this.datos = sumatoriasArray; // trae todps 
    }
  },
};
</script>
