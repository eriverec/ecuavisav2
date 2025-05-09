<script setup>

import CursosTab from './CursosTab.vue';
import FidelizacionTab from './FidelizacionTab.vue';
import PrincipalTab from './PrincipalTab.vue';
import RadarDigitalTab from './RadarDigitalTab.vue';

const tabActual = ref('tab-lista')
const isDialogVisible = ref(false)
// const currentTab_fidelizacion = ref(0)
</script>

<template>
	<section>
		<VRow>
			<VCol class="mt-6" cols="12" md="12" lg="12">

				<VTabs v-model="tabActual" class="v-tabs-pill">
					<VTab value="tab-Principal" ><VIcon icon="mdi-settings" class="pe-1" size="25" />En vivo</VTab>
					<VTab value="tab-bo" ><VIcon icon="mdi-settings" class="pe-1" size="25" />Backoffice</VTab>
					<VTab value="tab-mail" ><VIcon icon="tabler-mail" class="pe-1" size="25" />Newsletter</VTab>
					<VTab value="tab-tools" ><VIcon icon="mdi-tools" class="pe-1" size="25" />Utilidades</VTab>
					<VTab value="tab-fidelizacion" ><VIcon icon="mdi-currency-sign" class="pe-1" size="25" />Fidelización</VTab>
					<VTab value="tab-radar-digital" ><VIcon icon="mdi-radar" class="pe-1" size="25" />Radar Digital</VTab>
					
				</VTabs>

				<VCard class="mt-5">
					<VCardText>
						<VWindow v-model="tabActual">
							<!-- $$$$$$$$$$$$$ tab1 $$$$$$$$$$$$$$ -->
							<PrincipalTab />

							<!-- $$$$$$$$$$$$$ tab2 $$$$$$$$$$$$$$ -->
							<VWindowItem value="tab-bo">
								<div class=" py-5 gap-4 align-items-center">   
									<VCardTitle >Configura el horario de las transmisiones en vivo de ecuavisa.com </VCardTitle>
									<VCardSubtitle> Escoge el ítem que deseas configurar </VCardSubtitle>
								</div>
								<!-- content here -->
								<VRow>
									<VCol cols="12" lg="10" class="mx-auto my-8 align-items-center" >
										<VRow>
											<VCol cols="12" md="6" >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-backoffice' })" >
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-account-group-outline"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															Usuarios Backoffice
														</h6>
														<!-- <p>mas info</p> -->
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-settings-menu' }" >
															Gestionar
														</VBtn>
													</VCardText>
												</VCard>
											</VCol>
											<VCol cols="12" md="6" >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-backoffice-actividad' })">
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-account-clock-outline"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															Actividad de Usuarios
														</h6>
														<!-- <p>mas info</p> -->
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-settings-menu' }" >
															Ver Reportes
														</VBtn>
													</VCardText>
												</VCard>
											</VCol>
											
										</VRow>
									</VCol>
								</VRow>
							</VWindowItem>
							<!-- $$$$$$$$$$$$$ tab3 $$$$$$$$$$$$$$ -->
							<VWindowItem value="tab-tools">
								<div class=" py-5 gap-4 align-items-center">   
									<VCardTitle >Activa el radar digital y gestiona los archivos de ecuavisa.com </VCardTitle>
									<VCardSubtitle> Escoge el ítem que deseas configurar </VCardSubtitle>
								</div>
								<!-- content here -->
								<VRow>
									<VCol cols="12" lg="10" class="mx-auto my-8 align-items-center" >
										<VRow>
											<VCol cols="12" md="6" center >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-apicustom' })" >
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="tabler-api"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															Apis de Configuración
														</h6>
														<!-- <p>mas info</p> -->
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-settings-menu' }" >
															Gestionar
														</VBtn>
													</VCardText>
												</VCard>

												

											</VCol>
											<VCol cols="12" md="6" >
												<VCard  flat  border class=" cursor-pointer"  @click="clickButton">
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-folders"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															Gestor de archivos
														</h6>
														    <!-- Dialog Activator -->

														<VBtn size="small" variant="tonal"  >
															abrir gestor
														</VBtn>
													</VCardText>
												</VCard>
											</VCol>
											
										</VRow>
									</VCol>
								</VRow>
							</VWindowItem>

							<!-- $$$$$$$$$$$$$ tab4 $$$$$$$$$$$$$$ -->
							<VWindowItem value="tab-mail">
								<div class=" py-5 gap-4 align-items-center">   
									<VCardTitle >Configurar el envío de campañas de emails</VCardTitle>
									<VCardSubtitle>  <vBtn variant="tonal" color="warning"><VIcon icon="mdi-info"  size="20" /> Advertencia de configuraciones sensibles, como eliminar una campaña </vBtn> </VCardSubtitle>
								</div>
								<!-- content here -->
								<VRow>
									<VCol cols="12" lg="10" class="mx-auto my-8 align-items-center" >
										<VRow>
											<VCol cols="12" md="12" center >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-mailing-list' })" >
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-email"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															Listado de Boletines
														</h6>
														<!-- <p>mas info</p> -->
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-settings-menu' }" >
															Configurar
														</VBtn>
													</VCardText>
												</VCard>
											</VCol>
										</VRow>
									</VCol>
								</VRow>
							</VWindowItem>

							<!-- $$$$$$$$$$$$$ tab5 $$$$$$$$$$$$$$ -->
							<FidelizacionTab />

							<RadarDigitalTab />
							
						</VWindow>
					</VCardText>
				</VCard>

			</VCol>
		</VRow>
		
  <VDialog
    v-model="isDialogVisible"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <template #activator="{ props }">
      <VBtn v-bind="props" ref="myButton" class="d-none">
        Open Dialog
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard>
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          

          <VToolbarTitle>Gestor de archivos</VToolbarTitle>

          <VSpacer />

          <VToolbarItems>
            <VBtn icon variant="plain" @click="isDialogVisible = false" >
            	<VIcon color="white" icon="tabler-x" />
          	</VBtn>
          </VToolbarItems>
        </VToolbar>
      </div>

      <!-- List -->
      <iframe src="https://estadisticas.ecuavisa.com/sites/gestor/index.php" frameborder="0"></iframe>
    </VCard>
  </VDialog>
	</section>


</template>
<style scoped>  
/*.v-card.v-theme--dark .iframe-dark {  display: block; }*/
</style>
<style lang="scss">
	.dialog-bottom-transition-enter-active,
	.dialog-bottom-transition-leave-active {
	  transition: transform 0.2s ease-in-out;
	}
	iframe {
      	height: 90vh;
    }
</style>
<script>


export default {
	components: {
    FidelizacionTab,
    RadarDigitalTab,
    PrincipalTab,
    CursosTab
    // Otros componentes si los hubiera
  },
	data() {
		return {
			datos: []
		};
	},

	watch: {
		// async usuarioFielModel(newVal, oldVal) {
		//   this.maxRegistros = newVal;
			// this.obtenerDatos();
		// }
		
	},
  	computed: {
    	columns() {
      		return store.state.columns;
    	}
  	},
	async mounted() {
		this.obtenerDatos();
		//await this.accionBackoffice();
	},

	methods: {
		clickButton() {
	       this.$refs.myButton.$el.click();
	    },
		async obtenerDatos() {
			const respuesta = await fetch(`https://estadisticas.ecuavisa.com/sites/services/global/datareader.php`);
			const datos = await respuesta.json();
			// const registros = datos; //datos.data;
			// const sumatoriaPorUsuario = {};
			this.datos = datos; // eljson de datos lo hacemos el nuevo valor del app this.datos
		},

		//journal de usuarios del backoffice
		async accionBackoffice (){
			let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
			let userData = JSON.parse(localStorage.getItem('userData'));
			if(userData.email !== 'admin@demo.com' ){
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
					var log = JSON.stringify({
							"usuario": userData.email,   
							"pagina": "ecuavisa.com-modulos",
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
		},

		authorizedCheck (){
			let rol = localStorage.getItem('role');
			if(rol !== 'administrador' && rol !== 'webmaster'){
				this.$router.push({ path: '/pages/errors/not-authorized' })
			}
		},
	},
};
</script>

<style>
#kanban {
  display: flex;
  justify-content: space-between;
}

.column {
  width: 200px;
  border: 1px solid #ccc;
  padding: 10px;
}

.card {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 5px;
}

.label {
  display: inline-block;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 2px 5px;
  margin-right: 5px;
}
</style>