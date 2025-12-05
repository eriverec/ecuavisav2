<script setup>
import { guardarData, loadConfiguracion } from "./utils/utils.js";
import Switch from "./components/Switch.vue";
import ConfirmationDialog from "./components/ConfirmationDialog.vue";

// Estados reactivos
const loadingGeneral = ref(false);
const cambios = ref(false);
const items = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const editingId = ref(null);

// Estado del diálogo
const dialogState = ref({
	isOpen: false,
	title: "",
	message: "",
	item: null,
	newStatus: null,
});

// Estado del formulario
const formData = ref({
	id: "",
	titulo: "",
	link: "",
	imagen: "",
	estado: "activo",
});

// Computed properties para paginación
const currentItems = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	return items.value.slice(start, end);
});

const totalPages = computed(() => {
	return Math.ceil(items.value.length / itemsPerPage.value);
});

// Cargar datos iniciales
onMounted(async () => {
	const data = await loadConfiguracion();
	items.value = data ?? [];
});

// Métodos
const generateId = () => {
	return Date.now().toString();
};

const handleAddItem = () => {
	if (
		!formData.value.titulo ||
		!formData.value.link ||
		!formData.value.imagen
	) {
		alert("Por favor complete todos los campos");
		return;
	}

	const newItem = {
		...formData.value,
		id: editingId.value || generateId(),
	};

	if (editingId.value) {
		// Editar item existente
		items.value = items.value.map((item) =>
			item.id === editingId.value ? newItem : item
		);
		editingId.value = null;
	} else {
		// Agregar nuevo item
		items.value = [...items.value, newItem];
	}

	// Resetear formulario
	formData.value = {
		id: "",
		titulo: "",
		link: "",
		imagen: "",
		estado: "activo",
	};

	cambios.value = true;
};

const handleEditItem = (item) => {
	formData.value = { ...item };
	editingId.value = item.id;
};

const handleDeleteItem = (id) => {
	if (confirm("¿Está seguro de eliminar este item?")) {
		items.value = items.value.filter((item) => item.id !== id);
		cambios.value = true;
	}
};

const handleCancelEdit = () => {
	formData.value = {
		id: "",
		titulo: "",
		link: "",
		imagen: "",
		estado: "activo",
	};
	editingId.value = null;
};

const handleSaveChanges = async () => {
	loadingGeneral.value = true;

	try {
		const enviado = await guardarData(items.value);

		cambios.value = false;
		alert("Cambios guardados exitosamente");
	} catch (error) {
		console.error("Error al guardar:", error);
		alert("Error al guardar los cambios");
	} finally {
		loadingGeneral.value = false;
	}
};

const handleStatusChange = (item) => {
	const newStatus = item.estado === "activo" ? "inactivo" : "activo";

	dialogState.value = {
		isOpen: true,
		title: "Confirmar Cambio de Estado",
		message: `¿Está seguro de que desea cambiar el estado a "${newStatus}"?`,
		item,
		newStatus,
	};
};

const openImage = (url) => {
	window.open(url, "_blank");
};

const handleImageError = (event) => {
	const img = event.target;
	img.src = "https://via.placeholder.com/150?text=Imagen+No+Disponible";
};

const closeDialog = () => {
	dialogState.value = {
		isOpen: false,
		title: "",
		message: "",
		item: null,
		newStatus: null,
	};
};

const confirmDialog = () => {
	if (dialogState.value.item && dialogState.value.newStatus) {
		items.value = items.value.map((item) =>
			item.id === dialogState.value.item.id
				? { ...item, estado: dialogState.value.newStatus }
				: item
		);
		cambios.value = true;
	}
	closeDialog();
};
</script>

<template>
	<v-app>
		<v-main>
			<v-container class="mt-4">
				<v-card class="rounded-0" elevation="0">
					<v-card-title class="py-3">
						<h4 class="pb-0 mb-0">Manejador de portadas del footer</h4>
					</v-card-title>

					<v-card-text class="pt-4 mb-4">
						<!-- Formulario -->
						<div class="row mb-4">
							<div class="col-md-12">
								<v-card>
									<v-card-title>
										<h5 class="mb-0">
											{{
												editingId ? "Editar Portada" : "Agregar Nueva Portada"
											}}
										</h5>
									</v-card-title>
									<v-card-text>
										<v-row>
											<v-col cols="12" md="6">
												<v-text-field
													v-model="formData.titulo"
													label="Título"
													placeholder="Ingrese el título"
													variant="outlined"
													density="comfortable"
												></v-text-field>
											</v-col>

											<v-col cols="12" md="6">
												<v-text-field
													v-model="formData.link"
													label="Link"
													placeholder="https://ejemplo.com"
													type="url"
													variant="outlined"
													density="comfortable"
												></v-text-field>
											</v-col>

											<v-col cols="12" md="6">
												<v-text-field
													v-model="formData.imagen"
													label="URL de la Imagen"
													placeholder="https://ejemplo.com/imagen.jpg"
													type="url"
													variant="outlined"
													density="comfortable"
												></v-text-field>
											</v-col>

											<v-col cols="12">
												<div class="d-flex gap-2">
													<v-btn
                                                        :disabled="(items.length == 4 && !editingId)"
														:color="editingId ? 'warning' : 'primary'"
														:prepend-icon="
															editingId ? 'mdi-pencil' : 'mdi-plus-circle'
														"
														@click="handleAddItem"
													>
														{{ editingId ? "Actualizar" : "Agregar" }}
													</v-btn>

													<v-btn
														v-if="editingId"
														color="secondary"
														prepend-icon="mdi-close-circle"
														@click="handleCancelEdit"
													>
														Cancelar
													</v-btn>
												</div>
                                                
                                                <div class="mt-3" v-if="(items.length == 4 && !editingId)">
                                                    <VIcon size="15">tabler-info-circle</VIcon><small>No se puede crear más de 4 elementos</small>
                                                </div>

											</v-col>
										</v-row>
									</v-card-text>
								</v-card>
							</div>
						</div>

						<!-- Listado -->
						<div class="row">
							<div class="col-md-12">
								<!-- Notificación de cambios no guardados -->
								<div
									v-if="cambios && items.length > 0"
									class="text-muted small mb-3"
								>
									<v-icon size="small" class="me-1">mdi-information</v-icon>
									Último cambio no guardado:
									<v-btn
										variant="text"
										size="small"
										color="primary"
										@click="handleSaveChanges"
										:disabled="loadingGeneral || items.length === 0"
										class="px-1"
									>
										{{ loadingGeneral ? "Guardando..." : "¿Guardar ahora?" }}
										<v-progress-circular
											v-if="loadingGeneral"
											indeterminate
											size="16"
											width="2"
											class="ml-1"
										></v-progress-circular>
									</v-btn>
								</div>

								<v-card>
									<v-card-title
										class="d-flex justify-space-between align-center"
									>
										<h5 class="mb-0">Lista de Portadas</h5>
										<v-badge
											:content="items.length"
											color="primary"
											inline
										></v-badge>
									</v-card-title>

									<v-card-text class="pa-0">
										<v-list v-if="currentItems.length > 0">
											<v-list-item
												v-for="item in currentItems"
												:key="item.id"
												class="border-bottom"
											>
												<v-row align="center" class="pa-3">
													<v-col cols="12" md="2" lg="2">
														<v-hover v-slot="{ isHovering, props }">
															<v-card
																v-bind="props"
																:elevation="isHovering ? 4 : 0"
																class="transition-elevation"
																@click="openImage(item.imagen)"
															>
																<v-img
																	:src="item.imagen"
																	:alt="item.titulo"
																	:aspect-ratio="16 / 9"
																	cover
																	class="rounded"
																	@error="handleImageError"
																>
																	<template v-slot:placeholder>
																		<v-row
																			class="fill-height ma-0"
																			align="center"
																			justify="center"
																		>
																			<v-progress-circular
																				indeterminate
																				color="grey-lighten-5"
																			></v-progress-circular>
																		</v-row>
																	</template>
																</v-img>
															</v-card>
														</v-hover>
													</v-col>

													<v-col cols="12" md="10" lg="10">
														<v-row align="center">
															<v-col cols="12" md="6">
																<h6 class="mb-1">{{ item.titulo }}</h6>
																<p class="mb-1 text-muted small">
																	<v-icon size="small" class="me-1"
																		>mdi-link</v-icon
																	>
																	{{ item.link }}
																</p>
																<div class="d-flex align-center">
																	<Switch
																		:model-value="item.estado === 'activo'"
																		@update:model-value="
																			handleStatusChange(item)
																		"
																		class="mr-2"
																	/>
																	<v-chip
																		:color="
																			item.estado === 'activo'
																				? 'success'
																				: 'secondary'
																		"
																		size="small"
																	>
																		{{ item.estado }}
																	</v-chip>
																</div>
															</v-col>

															<v-col cols="12" md="6" class="text-md-right">
																<v-btn-group
																	density="comfortable"
																	variant="outlined"
																>
																	<v-btn
																		color="primary"
																		prepend-icon="mdi-pencil"
																		@click="handleEditItem(item)"
																	>
																		Editar
																	</v-btn>
																	<v-btn
																		color="error"
																		prepend-icon="mdi-delete"
																		@click="handleDeleteItem(item.id)"
																	>
																		Eliminar
																	</v-btn>
																</v-btn-group>
															</v-col>
														</v-row>
													</v-col>
												</v-row>
											</v-list-item>
										</v-list>

										<!-- Estado vacío -->
										<div v-else class="text-center py-10">
											<v-icon size="64" class="text-muted mb-4"
												>mdi-inbox</v-icon
											>
											<p class="text-muted">No hay portadas registradas</p>
										</div>
									</v-card-text>
								</v-card>

								<!-- Paginación -->
								<v-pagination
									v-if="totalPages > 1"
									v-model="currentPage"
									:length="totalPages"
									:total-visible="7"
									class="mt-4"
								></v-pagination>
							</div>
						</div>

						<!-- Botón Guardar Cambios -->
						<div class="row mt-4">
							<div class="col-md-12">
								<div class="d-flex justify-end">
									<v-btn
										color="success"
										:disabled="loadingGeneral || items.length === 0 || !cambios"
										:loading="loadingGeneral"
										prepend-icon="mdi-check-circle"
										@click="handleSaveChanges"
									>
										{{ loadingGeneral ? "Guardando..." : "Guardar Cambios" }}
									</v-btn>
								</div>
							</div>
						</div>
					</v-card-text>
				</v-card>
			</v-container>
		</v-main>

		<ConfirmationDialog
			:is-open="dialogState.isOpen"
			@update:is-open="dialogState.isOpen = $event"
			:title="dialogState.title"
			:message="dialogState.message"
			@close="closeDialog"
			@confirm="confirmDialog"
		/>
	</v-app>
</template>

<style scoped>
.border-bottom {
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.text-muted {
	color: rgba(0, 0, 0, 0.6);
}

.rounded-0 {
	border-radius: 0 !important;
}

.gap-2 {
	gap: 8px;
}

.text-md-right {
	text-align: right;
}

@media (max-width: 960px) {
	.text-md-right {
		text-align: left;
	}
}
</style>
