<script setup>

const tabActual = ref('tab-lista')
const isDialogVisible = ref(false)
const currentTab_fidelizacion = ref(0)
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
							<VWindowItem value="tab-fidelizacion">
								<div class="py-5 gap-4 align-items-center">   
									<VCardTitle >Módulos de Fidelización</VCardTitle>
								</div>
								<!-- content here -->
								<VRow>
									<VCol cols="12" lg="12" class="mx-auto px-7 my-3 mb-6 align-items-center" >
										<div class="d-flex flex-row gap-4">
									    <VTabs v-model="currentTab_fidelizacion" direction="vertical" class="v-tabs-pill">
									      <VTab class="mb-2">
									      	<VIcon start icon="mdi-mixer" />
									        Desafíos
									      </VTab>

									      <VTab class="mb-2">
									        <VIcon
									          start
									          icon="mdi-chemical-weapon"
									        />
													Semanas desafíos
									      </VTab>

									      <VTab class="mb-2">
									        <VIcon
									          start
									          icon="mdi-movie-roll"
									        />
													Trivias
									      </VTab>

									      <VTab class="mb-2">
									        <VIcon
									          start
									          icon="mdi-file-video"
									        />
													Videos Consumos
									      </VTab>

									      <VTab class="mb-2">
									        <VIcon
									          start
									          icon="mdi-folder-multiple"
									        />
													Archivos
									      </VTab>
									    </VTabs>
									    <VDivider vertical />

									    <VWindow v-model="currentTab_fidelizacion" class="ms-3" >
									      <VWindowItem>
								      		<VCardTitle class="px-0 py-0">Gestionar desafíos</VCardTitle>
													<VCardSubtitle class="px-0 py-0"> Gestiona tus desafíos semanales </VCardSubtitle>
									  			
									        <p class="pt-3">
									          El módulo "Desafíos" te permite gestionar los desafíos de una semana definida. Desde este módulo, puedes crear nuevos desafíos, establecer la hora y las fechas de cada uno, así como editar o eliminar los desafíos existentes. 
									          Mantén un control preciso sobre tus desafíos semanales y mantén tu rutina organizada con esta útil herramienta de gestión.
									        </p>

									        <VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-reglasYDesafios-GestionDesafios', params: { id: 0 } }" >
														Gestionar
													</VBtn>
									      </VWindowItem>

									      <VWindowItem>
									        <VCardTitle class="px-0 py-0">Gestionar semanas desafíos</VCardTitle>
													<VCardSubtitle class="px-0 py-0"> Organiza tus desafíos por semana </VCardSubtitle>
									  			
									        <p class="pt-3">
									          El módulo de "Semanas de Desafíos" te permite administrar y organizar las semanas en las que tendrán lugar tus desafíos. Aquí podrás definir las semanas específicas en las que se llevarán a cabo tus desafíos y asociar múltiples desafíos a cada semana. Mantén un registro ordenado de tus desafíos 
									        	semanales y planifica tus actividades con facilidad utilizando esta útil herramienta de gestión.
									        </p>
									        <VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-semana_desafios', params: { id: 0 } }" >
														Gestionar
													</VBtn>
									      </VWindowItem>

									      <VWindowItem>
									        <VCardTitle class="px-0 py-0">Gestionar de Trivias</VCardTitle>
													<VCardSubtitle class="px-0 py-0"> Trivias </VCardSubtitle>
									
									        <p class="pt-3">
									          El módulo de Trivias se integra estrechamente con el módulo de Desafíos. Aquí puedes crear trivias que complementan tus desafíos principales. 
									          Desde preguntas de opción múltiple hasta verdadero o falso, este módulo te permite personalizar el tipo de trivia que deseas incluir en tus desafíos.
									        </p>
									        <VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-trivias', params: { id: 0 } }" >
														Gestionar
													</VBtn>
									      </VWindowItem>

									      <VWindowItem>
									        <VCardTitle class="px-0 py-0">Gestionar de Video Consumo</VCardTitle>
													<VCardSubtitle class="px-0 py-0"> Controla tu Tiempo de Visualización con el Módulo de Video Consumo </VCardSubtitle>
									
									        <p class="pt-3">
									          El módulo de Video Consumo te permite gestionar y monitorear el tiempo de visualización de 
									          videos dentro de tus desafíos. Con este módulo, puedes establecer desafíos específicos que 
									          requieren que los participantes vean videos durante ciertos períodos de tiempo. 
									          Por ejemplo, podrías crear desafíos que incentiven a los usuarios a ver un video completo durante al menos 2 minutos. 
									          Con esta funcionalidad, puedes medir y recompensar el tiempo dedicado a la visualización de contenido multimedia, lo que garantiza un compromiso efectivo con tus actividades y desafíos.
									        </p>
									        <VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-reglasYDesafios-GestionVideosHistoricos', params: { id: 0 } }" >
														Gestionar
													</VBtn>
									      </VWindowItem>

									      <VWindowItem>
									        <VCardTitle class="px-0 py-0">Gestor de Archivos subidos por los usuarios</VCardTitle>
													<VCardSubtitle class="px-0 py-0"> Organiza y Gestiona Archivos con el Módulo de Archivos </VCardSubtitle>
									
									        <p class="pt-3">
									          El módulo de Archivos te permite administrar los archivos subidos por los usuarios como parte de ciertos desafíos. 
									          En particular, este módulo es fundamental para desafíos que requieren que los participantes suban imágenes u otros tipos de archivos. 

									        </p>
									        <VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-reglasYDesafios-gestorArchivos', params: { id: 0 } }" >
														Gestionar
													</VBtn>
									      </VWindowItem>
									    </VWindow>
									  </div>
									</VCol>
								</VRow>
							</VWindowItem>
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