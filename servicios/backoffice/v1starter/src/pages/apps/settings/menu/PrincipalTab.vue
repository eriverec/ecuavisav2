<style scoped>
.text-h6 {
  font-size: 1.05rem !important;
}
</style>

<template>
							<VWindowItem value="tab-Principal">
								<div class=" py-5 gap-4 align-items-center">   
									<VCardTitle >Configura el horario de las transmisiones en vivo de ecuavisa.com </VCardTitle>
									<VCardSubtitle> Escoge el ítem que deseas configurar </VCardSubtitle>
								</div>
								<!-- content here -->
								<VRow>
									<VCol cols="12" lg="10" class="mx-auto my-8 align-items-center" >
										<VRow>
											<VCol cols="12" md="3" >
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
											<VCol cols="12" md="3" >
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
											<VCol cols="12" md="3" >
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
											<VCol cols="12" md="3" >
												<VCard  flat  border class=" cursor-pointer"  @click="$router.push({ name: 'apps-configuracion-parametros-envivo' })" >
													<VCardText class="text-center">
														<VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
															<VIcon icon="mdi-cogs"  size="45" />
														</VAvatar>
														<h6 class="text-h6 my-3">
															Parámetros En Vivo
														</h6>
														<!-- <p>mas info</p> -->
														<VBtn size="small" variant="tonal" :to="{  name: 'apps-configuracion-parametros-envivo' }" >
															Configurar
														</VBtn>
													</VCardText>
												</VCard>
											</VCol>
										</VRow>
									</VCol>
								</VRow>
							</VWindowItem>
</template>

<script>
export default {
  // Lógica y datos del componente de fidelización
}
</script>						