<script setup>
import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";

const categoriasListStore = useCategoriasListStore();
const categorias = ref([]);
const sendCategorias = ref([]);
const isCategoriasEditVisible = ref(false);
const isCategoriasAddVisible = ref(false);
const isCategoriasDeleteVisible = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const updateCategorias = ref({});
//const nuevaCategorias = ref("");
const updCategoriaPrimero = ref([]);
const newCategoriaPrimero = ref([]);

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

const totalPages = computed(() => {
	return Math.ceil(categorias.value.length / itemsPerPage.value);
});

// 👉 Computing pagination data
const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	return categorias.value.slice(start, end);
});

// Editar una categoría ----------------------------------------------

const onFormCategoriasActive = (data) => {
    console.log('data',data);
	//let index =  categorias.value.map((e) => e.id).indexOf(id);  	
	updateCategorias.value = data; 
	isCategoriasEditVisible.value = true;
	
    console.log("upd", updateCategorias.value);
    
};

const onFormCategoriasSubmit = (id) => {
	//resolveColeccionUpdateSend();

    //sendCategorias.value = categorias.value;
    let arrayFinal = [];
    arrayFinal = categorias.value;
    let index = categorias.value.map((e) => e.id).indexOf(id);  
    let data = {
              id:categorias.value[index].id,
              vn: categorias.value[index].vn,
              vid: categorias.value[index].vid,
              __text: categorias.value[index].__text,
              picImg: updateCategorias.value.picImg,
              feedUrl: categorias.value[index].feedUrl,
              description: updateCategorias.value.description,
              publicado: updateCategorias.value.publicado
            }     
    arrayFinal[index] = data;      

    console.log('sending ',arrayFinal );     
    
    
	categoriasListStore.sendCategorias(arrayFinal).catch((error) => {
		console.error(error);
	});
	window.setTimeout(fetchCategorias, 600);

	isCategoriasEditVisible.value = false;
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
</script>
<template>
	<section>
		<VRow>
			<VCol cols="12">
				<VCard title="Categorías">
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
					<VTable class="text-no-wrap">
						<!-- 👉 table head -->
						<thead>
							<tr>
								<th scope="col">Id</th>
								<th scope="col">Text</th>
								<th scope="col">Descripción</th>
								<th scope="col">ImgUrl</th>
								<th scope="col">Publicado</th>
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<!-- 👉 table body -->
						<tbody>
							<tr v-for="categoria in paginatedData" style="height: 3.5rem">
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

								<td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<h6 class="text-base">
												{{ categoria.picImg }}
											</h6>
										</div>
									</div>
								</td>
								<td>
									<div class="d-flex align-left">
										<div class="d-flex flex-column">
											<h6 class="text-base">
												{{ categoria.publicado }}
											</h6>
										</div>
									</div>
								</td>

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
                    
                
					<!--
            <VCardText
              class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
            >
              <span class="text-sm text-disabled">
                {{ paginationData }}
              </span>
  
              <VPagination
                v-model="page"
                size="small"
                :total-visible="5"
                :length="totalPage"
              />
            </VCardText>
             -->
				</VCard>
			</VCol>
		</VRow>

		<!-- 👉 Add New User -->
		<!--
      <AddNewUserDrawer
        v-model:isDrawerOpen="isAddNewUserDrawerVisible"
        @user-data="addNewUser"
      />-->
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
