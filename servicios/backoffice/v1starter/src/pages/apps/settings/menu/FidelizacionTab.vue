<script setup>

const tabActual = ref('tab-lista')
const isDialogVisible = ref(false)
const currentTab_fidelizacion = ref(0)
</script>
<template>
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
									          icon="mdi-chemical-weapon"
									        />
													Categorías
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

									      <!-- <VTab class="mb-2">
									        <VIcon
									          start
									          icon="mdi-folder-multiple"
									        />
													Archivos
									      </VTab> -->

									      <VTab class="mb-2">
									        <VIcon
									          start
									          icon="mdi-weather-sunny"
									        />
													Sellos logrados
									      </VTab>
									    </VTabs>
									    <VDivider vertical />

									    <VWindow v-model="currentTab_fidelizacion" class="ms-3" >
										<!-- DESAFÍOS -->
											<VWindowItem>
												<VRow>
												<!-- texto, título y subtítulo -->
												<VCol cols="12" sm="6" class="d-flex flex-column align-items-start justify-content-center">
													<VCardTitle class="px-0 py-0 mb-2">Gestionar "Desafíos"</VCardTitle>
													<VCardSubtitle class="px-0 py-0 mb-2">Gestiona tus desafíos semanales</VCardSubtitle>
													<p class="pt-3 text-left">
													El módulo "Desafíos" te permite gestionar los desafíos de una semana definida. Desde este módulo, puedes crear nuevos desafíos, establecer la hora y las fechas de cada uno, así como editar o eliminar los desafíos existentes. 
													Mantén un control preciso sobre tus desafíos semanales y mantén tu rutina organizada con esta útil herramienta de gestión.
													</p>
													
													<VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-reglasYDesafios-GestionDesafios', params: { id: 0 } }">
													Gestionar
													</VBtn>
												</VCol>
												
												<!-- GIF -->
												<VCol cols="12" sm="6" class="text-center">
											
													<img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2Ffidelizacion%2FDESAFIO.gif" alt="Ejemplo de Desafío" style="width: 55%; max-width: 100%;" />
												</VCol>
												</VRow>
											</VWindowItem>
											
										<!--SEMANA DASAFIOS--->

										<VWindowItem>
												<VRow>
												<!-- texto, título y subtítulo -->
												<VCol cols="12" sm="6" class="d-flex flex-column align-items-start justify-content-center">
													<VCardTitle class="px-0 py-0 mb-2">Gestiona "Semanas de Desafíos"</VCardTitle>
													<VCardSubtitle class="px-0 py-0 mb-2">Organiza tus desafíos por semana</VCardSubtitle>
													<p class="pt-3 text-left">
														El módulo de "Semanas de Desafíos" te permite administrar y organizar las semanas en las que tendrán lugar tus desafíos. Aquí podrás definir las semanas específicas en las que se llevarán a cabo tus desafíos y asociar múltiples desafíos a cada semana. Mantén un registro ordenado de tus desafíos 
														semanales y planifica tus actividades con facilidad utilizando esta útil herramienta de gestión.
													</p>
													
													<VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-semana_desafios', params: { id: 0 } }">
													Gestionar
													</VBtn>
												</VCol>
												
												<!-- GIF -->
												<VCol cols="12" sm="6" class="text-center">
											
													<img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2Ffidelizacion%2FSEMANA-DESAFIO.gif" alt="Semana de Desafíos" style="width: 55%; max-width: 100%;" />
												</VCol>
												</VRow>
										</VWindowItem>


										<!-- CATEGORIAS -->
										<VWindowItem>
												<VRow>
												<!-- texto, título y subtítulo -->
												<VCol cols="12" sm="6" class="d-flex flex-column align-items-start justify-content-center">
													<VCardTitle class="px-0 py-0 mb-2">Gestiona las categorías</VCardTitle>
													<!-- <VCardSubtitle class="px-0 py-0 mb-2">Organiza tus desafíos por semana</VCardSubtitle> -->
													<p class="pt-3 text-left">
														Definir los objetivos específicos para cada categoría y las reglas que los participantes deben seguir. Esto puede incluir metas diarias o semanales, criterios de evaluación y pautas para la participación.
													</p>
													
													<VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-reglasYDesafios-gestion-categorias', params: { id: 0 } }">
													Gestionar
													</VBtn>
												</VCol>
												
												<!-- GIF -->
												<VCol cols="12" sm="6" class="text-center">
											
													<img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2Fcategoria.png" alt="Categorías" style="width: 55%; max-width: 100%;" />
												</VCol>
												</VRow>
										</VWindowItem>

									   <!--TRIVIAS-->

									   <VWindowItem>
												<VRow>
												<!-- texto, título y subtítulo -->
												<VCol cols="12" sm="6" class="d-flex flex-column align-items-start justify-content-center">
													<VCardTitle class="px-0 py-0 mb-2">Gestiona "Trvias"</VCardTitle>
													<VCardSubtitle class="px-0 py-0 mb-2">Crea y gestiona las trivias para cada desafío</VCardSubtitle>
													<p class="pt-3 text-left">
														El módulo de Trivias se integra estrechamente con el módulo de Desafíos. Aquí puedes crear trivias que complementan tus desafíos principales. 
									          Desde preguntas de opción múltiple hasta verdadero o falso, este módulo te permite personalizar el tipo de trivia que deseas incluir en tus desafíos.
													</p>
													
													<VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-trivias', params: { id: 0 } }">
													Gestionar
													</VBtn>
												</VCol>
												
												<!-- GIF -->
												<VCol cols="12" sm="6" class="text-center">
											
													<img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2Ffidelizacion%2FTRIVIAS.gif" alt="Tipos de trivias disponibles" style="width: 55%; max-width: 100%;" />
												</VCol>
												</VRow>
										</VWindowItem>

										<!--VIDEOS CONSUMO-->
									   
										<VWindowItem>
												<VRow>
												<!-- texto, título y subtítulo -->
												<VCol cols="12" sm="6" class="d-flex flex-column align-items-start justify-content-center">
													<VCardTitle class="px-0 py-0 mb-2">Gestiona "Video Consumo"</VCardTitle>
													<VCardSubtitle class="px-0 py-0 mb-2">Controla el tiempo de visualización con el Módulo de Video Consumo</VCardSubtitle>
													<p class="pt-3 text-left">
														El módulo de Video Consumo te permite gestionar y monitorear el tiempo de visualización de 
									          videos dentro de tus desafíos. <br>on este módulo, puedes establecer desafíos específicos que 
									          requieren que los participantes vean videos durante ciertos períodos de tiempo. 
									          Por ejemplo, podrías crear desafíos que incentiven a los usuarios a ver un video completo durante al menos 2 minutos. 
									          <br>Con esta funcionalidad, puedes medir y recompensar el tiempo dedicado a la visualización de contenido multimedia, lo que garantiza un compromiso efectivo con tus actividades y desafíos.
													</p>
													
													<VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-reglasYDesafios-GestionVideosHistoricos', params: { id: 0 } }">
													Gestionar
													</VBtn>
												</VCol>
												
												<!-- GIF -->
												<VCol cols="12" sm="6" class="text-center">
											
													<img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2Ffidelizacion%2FVIDEOS-CONSUMO.gif" alt="Proceso de Ver video" style="width: 55%; max-width: 100%;" />
												</VCol>
												</VRow>
										</VWindowItem>

<!-- 									  
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
									      </VWindowItem> -->

										<!--SELLOS LOGRADOS-->

										<VWindowItem>
												<VRow>
												<!-- texto, título y subtítulo -->
												<VCol cols="12" sm="6" class="d-flex flex-column align-items-start justify-content-center">
													<VCardTitle class="px-0 py-0 mb-2">Gestiona los Sellos Logrados</VCardTitle>
													<VCardSubtitle class="px-0 py-0 mb-2">Organiza y Gestiona los sellos logrados de usuarios</VCardSubtitle>
													<p class="pt-3 text-left">
														Verifica los sellos ganados de usuarios con su respectiva semana. 
													</p>
													
													<VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-reglasYDesafios-GestionSellosHistoricos', params: { id: 0 } }">
													Gestionar
													</VBtn>
												</VCol>
												
												<!-- GIF -->
												<VCol cols="12" sm="6" class="text-center">
											
													<img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2Ffidelizacion%2FSELLOS-LOGRADOS.jpg" alt="Pantalla de Stickers y Tarjetas obtenidas" style="width: 55%; max-width: 100%;" />
												</VCol>
												</VRow>
										</VWindowItem>
									 
									    </VWindow>
									  </div>
									</VCol>
								</VRow>
							</VWindowItem>
</template>

<script>
export default {
  // Lógica y datos del componente de fidelización
}
</script>						