<script setup>
import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";
import chartIntereses from "@/views/charts/apex-chart/ChartInteresesAnalytics.vue";
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const categoriasListStore = useCategoriasListStore();
const categorias = ref([]);
const sendCategorias = ref([]);
const isCategoriasEditVisible = ref(false);
const isCategoriasAddVisible = ref(false);
const isCategoriasDeleteVisible = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
var totalPages = ref(1);
const updateCategorias = ref({});
//const nuevaCategorias = ref("");
const updCategoriaPrimero = ref([]);
const newCategoriaPrimero = ref([]);
const filteredData_2 = ref([]);
const currentTab = ref('tab-lista');
const fechaIngresada = ref('');

// Obtener las colecciones
const fetchCategorias = () => {
	categoriasListStore
		.fetchCategorias()
		.then((response) => {
			categorias.value = response.data;
		})
		.catch((error) => {
			console.error(error);
		});
};

watchEffect(fetchCategorias);

totalPages.value = computed(() => {
	return Math.ceil(categorias.value.length / itemsPerPage.value);
});

// 👉 Computing pagination data
/**/

// Editar una categoría ----------------------------------------------

const onFormCategoriasActive = (data) => {
		//let index =  categorias.value.map((e) => e.id).indexOf(id);  
		updateCategorias.value = Object.create(data); 
		isCategoriasEditVisible.value = true;
		//console.log('upd',updateCategorias.value);
    
    
};

async function onFormCategoriasSubmit (id){
	//resolveColeccionUpdateSend();

    //sendCategorias.value = categorias.value;
	let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
    let arrayFinal = [];
    arrayFinal = Array.from(categorias.value);
	
    let index = arrayFinal.map((e) => e.id).indexOf(id);  
	let data;
	//console.log('array',arrayFinal[index]);
	if(updateCategorias.value.publicado == true ){
		data = {
              id:categorias.value[index].id,
              vn: categorias.value[index].vn,
              vid: categorias.value[index].vid,
              __text: categorias.value[index].__text,
              picImg: updateCategorias.value.picImg,
              feedUrl: categorias.value[index].feedUrl,
              description: updateCategorias.value.description,
              publicado: updateCategorias.value.publicado,
			  fechaPublicado: dateNow 
            }  
	}else{
		data = {
              id:categorias.value[index].id,
              vn: categorias.value[index].vn,
              vid: categorias.value[index].vid,
              __text: categorias.value[index].__text,
              picImg: updateCategorias.value.picImg,
              feedUrl: categorias.value[index].feedUrl,
              description: updateCategorias.value.description,
              publicado: updateCategorias.value.publicado,
			  fechaPublicado: arrayFinal[index]?.fechaPublicado? arrayFinal[index].fechaPublicado : ""
            } 
	}
	let objectUpd = updateCategorias.value;
	let objectOg = Object.create(arrayFinal[index]);
	console.log(objectUpd);
	 
    arrayFinal[index] = data;    

		  
	var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

	var raw = JSON.stringify(arrayFinal);

		var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
		};

		await fetch("https://getmetadatos-service.vercel.app/send", requestOptions)
		.then(response => response.text())
		.then(async result => {		
			var myHeaders2 = new Headers();
				myHeaders2.append("Content-Type", "application/json");
			var log = JSON.stringify({
						"tipo": "intereses",
						"id": objectOg.id,
						"accion": "update",
						"campos": objectUpd,
						"fecha": dateNow,
						"usuario": ""
					});
			var requestOptions2 = {
				method: 'POST',
				headers: myHeaders2,
				body: log,
				redirect: 'follow'
			};
			await fetch(`https://servicio-logs.vercel.app/send`, requestOptions2)
			.then(response =>{			
			}).catch(error => console.log('error', error));
			
			fetchCategorias();
			isCategoriasEditVisible.value = false;
			return true
		})
		.catch(error => console.log('error', error));

	
};

const onFormCategoriasReset = () => {
    updateCategorias.value = {};
	isCategoriasEditVisible.value = false;	
    window.setTimeout(fetchCategorias, 300);
};

const dialogCategoriasValueUpdate = (val) => {
	if(val === false){
		window.setTimeout(fetchCategorias, 300);
	}
	isCategoriasEditVisible.value = val;
};

const searchKeyword = ref('');
/*var filteredData = computed(() => {
	var data = categorias.value;
	const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	var dataFiltrada = data.slice(start, end);
	totalPages.value = Math.ceil(categorias.value.length / itemsPerPage.value);
	//filteredData_2.value = filteredData
	return dataFiltrada;
});*/

var filteredData = computed(() => {
	var catag_list =  categorias.value.filter(item => {
		return (
      item.__text.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      item.id.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  });
  	/*
  	let filtroFecha;
	
  	if(fechaIngresada.value){
  	let fechaSelected = fechaIngresada.value.toString();
	//console.log(fechaSelected);
 	filtroFecha = catag_list.filter(item => {
		if(item.fechaPublicado){
			let array = item.fechaPublicado.split(' ');
			console.log('array',array)
			return array[0] == fechaSelected;
		}else{
			return false;
		}		
	});
	//console.log('filtroFecha',filtroFecha);
	}*/	
  const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	var dataFiltrada = catag_list.slice(start, end);
	totalPages.value = Math.ceil(catag_list.length / itemsPerPage.value);
	//filteredData =  catag_list;
	return dataFiltrada;
});


const resetFiltro =()=>{
	const iframeD = document.getElementById('iframeAnalyticsD');
	const iframeL = document.getElementById('iframeAnalyticsL');	
	fechaIngresada.value = '';
	iframeD.contentWindow.createChart();
}
const resolveFechaEstadisticas = (dates) =>{
	if(dates.length > 1){
		const iframeD = document.getElementById('iframeAnalyticsD');
		const iframeL = document.getElementById('iframeAnalyticsL');
		let fechas = dates.toString();

		iframeD.contentWindow.postMessage(fechas, '*');	
		iframeD.contentWindow.createChart();

	}

}

</script>


<style type="text/css">
	.p-10 {
	    padding: 12px;
	}
</style>

<template>
	<section>
		<VRow>
			<VCol class="mt-6" cols="12" md="12" lg="12">
				<VTabs v-model="currentTab" class="v-tabs-pill">
						<VTab value="tab-lista">Listado</VTab>
						<VTab value="tab-estadistica">Estadísticas</VTab>
						<!-- <VTab>Tab Three</VTab> -->
						</VTabs>
						
				<VCard class="mt-5" title="Intereses">	
					
					<VWindow v-model="currentTab">
						
             		 <VWindowItem value="tab-lista">
	
   
  
					<VCardText class="py-4 gap-0 w-100">	
				<div style="display: flex;" >
			      <div style="width: 30%" class="d-flex gap-1 px-0  position-relative">
			          <VTextField
			            v-model="searchKeyword"
			            pattern="\d*"
			            placeholder="Buscar por id o por nombre..."
			            class="ms-0 me-1 chat-list-search"
			          >
			          </VTextField>
			      </div>
				  
				</div>
			    </VCardText>
				
					<!--
					<VDivider />
                    
					<VCardText class="d-flex flex-wrap py-2 gap-2">
						<VSpacer />

						<div class="d-flex align-left flex-wrap gap-2">
							<VBtn
								prepend-icon="tabler-plus"
								@click="onFormAddCategoriasActive"
							>
								Agregar una categoría
							</VBtn>
						</div>
					</VCardText>

					<VDivider />
                    -->
					<VTable class="text-no-wrap p-10">
						<!-- 👉 table head -->
						<thead>
							<tr>
								<th scope="col">ID</th>
								<th scope="col">Nombre del interés</th>
								<th scope="col">Descripción</th>
								<!-- <th scope="col">IMG Url</th>								 -->
								<th scope="col">Publicado</th>
								<!-- <th scope="col">Fecha de publicación</th> -->
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<!-- 👉 table body -->
						<tbody>
							<tr v-for="categoria in filteredData" style="height: 3.5rem">
								<!-- 👉 nombre modulo -->
								<td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<h6 class="text-base">
												{{ categoria.id }}
											</h6>
										</div>
									</div>
								</td>

								<td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<h6 class="text-base">
												{{ categoria.__text }}
											</h6>
										</div>
									</div>
								</td>

								<td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<h6 class="text-base">
												{{ categoria.description }}
											</h6>
										</div>
									</div>
								</td>

								<!-- <td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<img v-if="categoria.picImg !== ''" :src="categoria.picImg" width="200" class="img-intereses">
										</div>
									</div>
								</td> -->

								<td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<!-- <h6 class="text-base"> {{ categoria.publicado }} </h6> -->
											<VChip :color="categoria.publicado == true ? 'success' : 'warning'" class="mr-4" >{{ categoria.publicado == true ? 'Activo' : 'Inactivo' }} </VChip>
										</div>
									</div>
								</td>
								<!-- <td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<h6 class="text-base">
												{{ categoria.fechaPublicado }}
											</h6>
										</div>
									</div>
								</td> -->
								<td class="text-center" style="width: 5rem">
									<VBtn
										icon
										size="x-small"
										color="default"
										variant="text"
										@click="onFormCategoriasActive(categoria)"
									>
										<VIcon size="22" icon="tabler-edit" />
									</VBtn>
								</td>
							</tr>
						</tbody>
					</VTable>
					<VDivider />

					<div class="px-4 py-4">
						<v-btn
							:disabled="currentPage === 1"
							@click="currentPage -= 1"
							size="small"
							color="primary"
						>
							Anterior
						</v-btn>
						<span class="px-2"
							>{{ currentPage }} de {{ totalPages }} de un total de
							{{ categorias.length }} registros</span
						>

						<v-btn
							:disabled="currentPage === totalPages"
							@click="currentPage += 1"
							size="small"
							color="primary"
						>
							Siguiente
						</v-btn>
					</div>

					<VDialog
						:width="$vuetify.display.smAndDown ? 'auto' : 700"
						:model-value="isCategoriasEditVisible"
						@update:model-value="dialogCategoriasValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogCategoriasValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3">
									Editar la categoría
								</VCardTitle>
							</VCardItem>

							<VCardText>
								<VTable class="text-no-wrap">
									<!-- 👉 table head -->
									<thead>
										<tr>
											<th scope="col">Id</th>
											<th scope="col">Text</th>
										</tr>
									</thead>
									<!-- 👉 table body -->
									<tbody>
										<tr style="height: 3.75rem">
											<!-- 👉 nombre modulo -->
											<td>
												<div class="d-flex align-center">
													<div class="d-flex flex-column">
														{{updateCategorias.id }}
													</div>
												</div>
											</td>
											<td>
												<div class="d-flex align-center">
													<div class="d-flex flex-column">
														{{ updateCategorias.__text }}
													</div>
												</div>
											</td>
										</tr>
									</tbody>
								</VTable>
                                <VDivider /> 
								<!-- 👉 Form -->
								<VForm
									class="mt-6"
									@submit.prevent="onFormCategoriasSubmit(updateCategorias.id)"
								>
									<VRow class="d-flex flex-wrap justify-center gap-4">
										<!-- 👉 Nombre -->
										<VCol cols="8">
											<VTextField
												v-model="updateCategorias.description"
												label="Nueva descripción"
											/>
										</VCol>

										<VCol cols="8">
											<VTextField
												v-model="updateCategorias.picImg"
												label="Nueva imgUrl"
											/>
										</VCol>
										<VCol cols="12" md="6">
											<VSwitch
												v-model="updateCategorias.publicado"
												density="compact"
												label="Publicado"
											/>
										</VCol>

										<!-- 👉 Submit and Cancel -->
										<VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
											<VBtn type="submit"> Enviar </VBtn>

											<VBtn
												color="secondary"
												variant="tonal"
												@click="onFormCategoriasReset"
											>
												Cancelar
											</VBtn>
										</VCol>
									</VRow>
								</VForm>
							</VCardText>
						</VCard>
					</VDialog>
                    	
			</VWindowItem>
						<VWindowItem value="tab-estadistica">
						
                <div>
				<chartIntereses/>
                 <!-- <iframe id= "iframeAnalyticsD" style="background:#2f3349 ;" class="iframe-dark" src="src\pages\apps\interesAnalyticsDark.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>
                  <iframe id= "iframeAnalyticsL" class="iframe-light" src="https://ecuavisadev.netlify.app/servicios/embeds/interesAnalyticsLight.html" width="100%" height="530px" frameborder="0" allow="autoplay; fullscreen;" allowfullscreen></iframe>
					-->
                </div>



              </VWindowItem>
					</VWindow>
				</VCard>
			</VCol>
		</VRow>
	
	</section>
</template>

<style lang="scss">
.app-user-search-filter {
	inline-size: 31.6rem;
}

svg {
	vertical-align: middle;
}

.text-capitalize {
	text-transform: capitalize;
}

.user-list-name:not(:hover) {
	color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
