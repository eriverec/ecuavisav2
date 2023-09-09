<script setup>
import axios from '@axios';

const tabActual = ref('tab-lista')
</script>

<template>
	<section>
		<VRow>
			<VCol class="mt-6" cols="12" md="12" lg="12">

				<VTabs v-model="tabActual" class="v-tabs-pill">
					<VTab value="tab-Principal" ><VIcon icon="mdi-settings" class="pe-1" size="25" />En vivo</VTab>
					<VTab value="tab-bo" ><VIcon icon="mdi-settings" class="pe-1" size="25" />Backoffice</VTab>
					<VTab value="tab-tools" ><VIcon icon="mdi-tools" class="pe-1" size="25" />Utilidades</VTab>
				</VTabs>

				<VCard class="mt-5">
					<VCardText>
						<VWindow v-model="tabActual">
							<!-- $$$$$$$$$$$$$ tab1 $$$$$$$$$$$$$$ -->
							<VWindowItem value="tab-Principal">
								<div class=" py-5 gap-4 align-items-center">   
									<VCardTitle >Configura el horario de las transmisiones en vivo de ecuavisa.com </VCardTitle>
									<VCardSubtitle> Escoge el ítem que deseas configurar </VCardSubtitle>
								</div>
								<!-- content here -->
								<VRow>
									<VCol cols="12" lg="10" class="mx-auto my-8 align-items-center" >
										<VRow>
											<VCol cols="12" md="4" >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-configuracion-radio' })" >
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-cast-audio-variant"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															En Vivo Audio/Radio
														</h6>
														<!-- <p>mas info</p> -->
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-settings-menu' }" >
															Configurar
														</VBtn>
													</VCardText>
												</VCard>
											</VCol>
											<VCol cols="12" md="4" >
												<VCard  flat  border class=" cursor-pointer"   @click="$router.push({ name: 'apps-configuracion-envivo' })" >
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-access-point"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															En Vivo
														</h6>
														<!-- <p>mas info</p> -->
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-settings-menu' }" >
															Configurar
														</VBtn>
													</VCardText>
												</VCard>
											</VCol>
											<VCol cols="12" md="4" >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-configuracion-envivo-quito' })" >
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-access-point"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															En Vivo - Quito
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
									<VCardTitle >Configura el horario de las transmisiones en vivo de ecuavisa.com </VCardTitle>
									<VCardSubtitle> Escoge el ítem que deseas configurar </VCardSubtitle>
								</div>
								<!-- content here -->
								<VRow>
									<VCol cols="12" lg="10" class="mx-auto my-8 align-items-center" >
										<VRow>
											<VCol cols="12" md="12" center >
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
											<!-- <VCol cols="12" md="4" >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-backoffice-actividad' })">
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-account-clock-outline"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															Actividad de Usuarios
														</h6>
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-settings-menu' }" >
															Ver Reportes
														</VBtn>
													</VCardText>
												</VCard>
											</VCol> -->
											
										</VRow>
									</VCol>
								</VRow>
							</VWindowItem>

						</VWindow>
					</VCardText>
				</VCard>

			</VCol>
		</VRow>
	</section>
</template>
<style scoped>  
/*.v-card.v-theme--dark .iframe-dark {  display: block; }*/
</style>

<script>

export default {
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
	async mounted() {
		this.obtenerDatos();
		await this.accionBackoffice();
	},
	methods: {

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
