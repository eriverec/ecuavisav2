<script setup>
import { ref, onMounted, computed } from "vue";

// Configuración de la API
const API_BASE_URL =
	"https://services.ecuavisa.com/servicio-elcholito/api-v3.php";
const FOLDER_NAME = "listado";

// Estado de la aplicación
const loading = ref(false);
const estructura = ref(null);
const selectedCategoria = ref("los_que_vuelven");
const showModal = ref(false);
const modalMode = ref("add");
const editingIndex = ref(-1);
const notification = ref({ show: false, message: "", type: "success" });
const apiResponse = ref(null);

// Formulario simplificado
const formData = ref({
	titulo: "",
	descripcion: "",
	imagen: "",
	demo: "",
	categoria: "los_que_vuelven",
});

// Categorías disponibles
const categorias = [
	{ title: "Los que vuelven", value: "los_que_vuelven" },
	{ title: "El mundo de Pepita", value: "el_mundo_de_pepita" },
	{ title: "El mundo de Óliver", value: "el_mundo_de_oliver" },
	{ title: "Los del barrio del Carmen", value: "los_del_barrio_del_carmen" },
	{ title: "Entre sombras y la ley", value: "entre_sombras_y_la_ley" },
];

// ========== FUNCIONES DE API ==========

async function getAllData() {
	try {
		const url = `${API_BASE_URL}?api=web&key=getlistado&folder=${FOLDER_NAME}`;
		console.log("Llamando a la API:", url);

		const response = await fetch(url);
		const data = await response.json();

		console.log("Respuesta de la API:", data);
		apiResponse.value = data;

		if (data.success) {
			return data.data;
		}
		throw new Error(data.message || "Error al obtener los datos");
	} catch (error) {
		console.error("Error en getAllData:", error);
		apiResponse.value = { error: error.message };
		throw error;
	}
}

async function saveData(estructuraData) {
	try {
		const payload = {
			key: "getlistado",
			estructura: estructuraData,
			folder: FOLDER_NAME,
		};

		console.log("Guardando datos:", payload);

		const response = await fetch(`${API_BASE_URL}?api=update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		const data = await response.json();
		console.log("Respuesta de saveData:", data);
		apiResponse.value = data;

		if (data.success) {
			return data;
		}
		throw new Error(data.message || "Error al guardar los datos");
	} catch (error) {
		console.error("Error en saveData:", error);
		apiResponse.value = { error: error.message };
		throw error;
	}
}

// ========== FUNCIONES DE CARGA Y GESTIÓN ==========

onMounted(async () => {
	await loadData();
});

async function loadData() {
	loading.value = true;
	try {
		const data = await getAllData();
		console.log("Datos recibidos:", data);

		if (data && Array.isArray(data) && data.length > 0) {
			estructura.value = data[0];
		} else if (data && typeof data === "object" && !Array.isArray(data)) {
			estructura.value = data;
		} else {
			initializeEmptyStructure();
			showNotification(
				'No hay datos guardados. Usa el botón "Inicializar Datos" para crear la estructura.',
				"info"
			);
		}
	} catch (error) {
		console.error("Error completo:", error);

		if (error.message.includes("No se encontró")) {
			initializeEmptyStructure();
			showNotification(
				'No se encontró el archivo. Usa el botón "Inicializar Datos" para crearlo.',
				"info"
			);
		} else {
			showNotification("Error al cargar los datos: " + error.message, "error");
			initializeEmptyStructure();
		}
	} finally {
		loading.value = false;
	}
}

function initializeEmptyStructure() {
	estructura.value = {
		los_que_vuelven: [],
		el_mundo_de_pepita: [],
		el_mundo_de_oliver: [],
		los_del_barrio_del_carmen: [],
		entre_sombras_y_la_ley: [],
	};
}

async function initializeData() {
	if (
		!confirm(
			"¿Estás seguro de que deseas crear la estructura de datos inicial?"
		)
	) {
		return;
	}

	loading.value = true;
	try {
		const estructuraInicial = {
			los_que_vuelven: [],
			el_mundo_de_pepita: [],
			el_mundo_de_oliver: [],
			los_del_barrio_del_carmen: [],
			entre_sombras_y_la_ley: [],
		};

		await saveData([estructuraInicial]);
		showNotification("Estructura de datos creada exitosamente", "success");
		await loadData();
	} catch (error) {
		showNotification("Error al inicializar datos: " + error.message, "error");
	} finally {
		loading.value = false;
	}
}

// Computed para obtener items de la categoría actual
const currentItems = computed(() => {
	if (!estructura.value) return [];
	return estructura.value[selectedCategoria.value] || [];
});

// Verificar si necesita inicialización
const needsInitialization = computed(() => {
	return !estructura.value || Object.keys(estructura.value).length === 0;
});

// Abrir modal para agregar
function openAddModal() {
	modalMode.value = "add";
	resetForm();
	formData.value.categoria = selectedCategoria.value;
	showModal.value = true;
}

// Abrir modal para editar
function openEditModal(index) {
	modalMode.value = "edit";
	editingIndex.value = index;
	const item = currentItems.value[index];

	// Asignar la categoría actual (ya que no se guarda en el item)
	formData.value = {
		...item,
		categoria: selectedCategoria.value,
	};
	showModal.value = true;
}

// Resetear formulario
function resetForm() {
	formData.value = {
		titulo: "",
		descripcion: "",
		imagen: "",
		demo: "",
		categoria: selectedCategoria.value,
	};
	editingIndex.value = -1;
}

// Cerrar modal
function closeModal() {
	showModal.value = false;
	resetForm();
}

// Guardar item (agregar o editar)
async function saveItem() {
	loading.value = true;
	try {
		const categoria = formData.value.categoria;

		// Crear una copia profunda de la estructura
		const nuevaEstructura = JSON.parse(JSON.stringify(estructura.value));

		// Asegurar que existe la categoría
		if (!nuevaEstructura[categoria]) {
			nuevaEstructura[categoria] = [];
		}

		// Crear objeto sin el campo categoria (no se guarda en el item)
		const { categoria: _, ...itemData } = formData.value;

		if (modalMode.value === "add") {
			// Agregar nuevo item
			nuevaEstructura[categoria].push({ ...itemData });
			showNotification("Item agregado exitosamente", "success");
		} else {
			// Si se cambió de categoría, eliminar del anterior
			const oldCategoria = selectedCategoria.value;

			if (oldCategoria !== categoria) {
				// Eliminar de la ubicación anterior
				nuevaEstructura[oldCategoria].splice(editingIndex.value, 1);
				// Agregar en la nueva ubicación
				nuevaEstructura[categoria].push({ ...itemData });
			} else {
				// Editar en la misma ubicación
				nuevaEstructura[categoria][editingIndex.value] = { ...itemData };
			}
			showNotification("Item actualizado exitosamente", "success");
		}

		// Guardar en la API
		await saveData([nuevaEstructura]);

		// Recargar datos
		await loadData();
		closeModal();
	} catch (error) {
		showNotification("Error al guardar: " + error.message, "error");
	} finally {
		loading.value = false;
	}
}

// Eliminar item
async function deleteItem(index) {
	if (!confirm("¿Estás seguro de que deseas eliminar este item?")) {
		return;
	}

	loading.value = true;
	try {
		// Crear una copia profunda de la estructura
		const nuevaEstructura = JSON.parse(JSON.stringify(estructura.value));

		// Eliminar el item
		nuevaEstructura[selectedCategoria.value].splice(index, 1);

		// Guardar en la API
		await saveData([nuevaEstructura]);

		showNotification("Item eliminado exitosamente", "success");

		// Recargar datos
		await loadData();
	} catch (error) {
		showNotification("Error al eliminar: " + error.message, "error");
	} finally {
		loading.value = false;
	}
}

// Mostrar notificación
function showNotification(message, type = "success") {
	notification.value = { show: true, message, type };
	setTimeout(() => {
		notification.value.show = false;
	}, 3000);
}
</script>

<template>
	<section class="mediakit-manager">
		<!-- Notificaciones -->
		<VSnackbar
			v-model="notification.show"
			:color="notification.type"
			location="top end"
			:timeout="3000"
		>
			{{ notification.message }}
		</VSnackbar>

		<!-- Loading Overlay -->
		<VOverlay v-model="loading" class="align-center justify-center" persistent>
			<VProgressCircular color="primary" indeterminate size="64" />
		</VOverlay>

		<!-- Header -->
		<div class="d-flex justify-space-between align-center mb-6">
			<h1 class="text-h4 font-weight-bold">Gestor de El Cholito</h1>
			<div class="d-flex gap-3">
				<VBtn
					v-if="needsInitialization"
					color="warning"
					variant="tonal"
					@click="initializeData"
				>
					<VIcon icon="tabler-settings" start />
					Inicializar Datos
				</VBtn>
				<VBtn
					color="primary"
					@click="openAddModal"
					:disabled="needsInitialization"
				>
					<VIcon icon="tabler-plus" start />
					Agregar Item
				</VBtn>
			</div>
		</div>

		<!-- Selector de Categoría -->
		<VCard class="mb-6">
			<VCardText>
				<VSelect
					v-model="selectedCategoria"
					label="Seleccionar Categoría"
					:items="categorias"
					variant="outlined"
					density="comfortable"
					prepend-inner-icon="tabler-category"
				/>
			</VCardText>
		</VCard>

		<!-- Lista de items -->
		<VRow>
			<VCol
				v-for="(item, index) in currentItems"
				:key="index"
				cols="12"
				md="3"
				lg="4"
			>
				<VCard hover class="h-100">
					<!-- Imagen -->
					<div v-if="item.imagen" class="image-container">
						<VImg
							:src="item.imagen"
							:alt="item.titulo"
							height="240"
							cover
							class="rounded-t"
						/>
					</div>
					<div
						v-else
						class="d-flex align-center justify-center bg-surface-variant rounded-t"
						style="height: 240px"
					>
						<VIcon icon="tabler-photo-off" size="48" color="disabled" />
					</div>

					<!-- Contenido -->
					<VCardText class="flex-grow-1">
						<h3 class="text-h6 mb-2">
							{{ item.titulo }}
						</h3>
						<p class="text-body-2 text-medium-emphasis">
							{{ item.descripcion }}
						</p>
					</VCardText>

					<!-- Acciones -->
					<VCardActions class="px-4 pb-4">
						<VBtn
							v-if="item.demo"
							:href="item.demo"
							target="_blank"
							variant="tonal"
							color="primary"
							size="small"
						>
							<VIcon icon="tabler-external-link" start />
							Link
						</VBtn>
						<VSpacer />
						<VBtn
							icon="tabler-pencil"
							variant="text"
							color="secondary"
							size="small"
							@click="openEditModal(index)"
						/>
						<VBtn
							icon="tabler-trash"
							variant="text"
							color="error"
							size="small"
							@click="deleteItem(index)"
						/>
					</VCardActions>
				</VCard>
			</VCol>

	

			<!-- Empty State -->
			<VCol v-if="currentItems.length === 0 && !needsInitialization" cols="12">
				<VCard class="text-center pa-10">
					<VIcon icon="tabler-inbox" size="64" color="disabled" class="mb-4" />
					<h3 class="text-h6 mb-2">No hay items en esta categoría</h3>
					<p class="text-body-2 text-medium-emphasis mb-4">
						Comienza agregando tu primer item a "{{
							categorias.find((c) => c.value === selectedCategoria)?.title
						}}"
					</p>
					<VBtn color="primary" @click="openAddModal">
						<VIcon icon="tabler-plus" start />
						Agregar primer item
					</VBtn>
				</VCard>
			</VCol>
		</VRow>

		<!-- Modal para agregar/editar -->
		<VDialog v-model="showModal" max-width="600" persistent>
			<VCard>
				<VCardTitle class="d-flex justify-space-between align-center pa-6">
					<div>
						<h2 class="text-h5">
							{{ modalMode === "add" ? "Agregar Item" : "Editar Item" }}
						</h2>
						<p class="text-body-2 text-medium-emphasis mt-1">
							{{
								modalMode === "add"
									? "Completa la información del nuevo item"
									: "Modifica la información del item"
							}}
						</p>
					</div>
					<VBtn
						icon="tabler-x"
						variant="text"
						size="small"
						@click="closeModal"
					/>
				</VCardTitle>

				<VDivider />

				<VCardText class="pa-6">
					<VForm @submit.prevent="saveItem">
						<VRow>
							<VCol cols="12">
								<VTextField
									v-model="formData.titulo"
									label="Título *"
									placeholder="Ej: El Cholito"
									required
									variant="outlined"
									prepend-inner-icon="tabler-text"
								/>
							</VCol>

							<VCol cols="12">
								<VTextarea
									v-model="formData.descripcion"
									label="Descripción *"
									placeholder="Breve descripción del contenido..."
									required
									variant="outlined"
									prepend-inner-icon="tabler-file-text"
									rows="3"
								/>
							</VCol>

							<VCol cols="12">
								<VSelect
									v-model="formData.categoria"
									label="Categoría *"
									:items="categorias"
									required
									variant="outlined"
									prepend-inner-icon="tabler-category"
								/>
							</VCol>

							<VCol cols="12">
								<VTextField
									v-model="formData.imagen"
									label="URL de Imagen"
									placeholder="https://ejemplo.com/imagen.jpg"
									type="url"
									variant="outlined"
									prepend-inner-icon="tabler-photo"
								/>
							</VCol>

							<VCol cols="12">
								<VTextField
									v-model="formData.demo"
									label="Link del Artículo"
									placeholder="https://ejemplo.com/articulo"
									type="url"
									variant="outlined"
									prepend-inner-icon="tabler-link"
								/>
							</VCol>
						</VRow>
					</VForm>
				</VCardText>

				<VDivider />

				<VCardActions class="pa-6">
					<VSpacer />
					<VBtn color="secondary" variant="outlined" @click="closeModal">
						Cancelar
					</VBtn>
					<VBtn color="primary" @click="saveItem">
						<VIcon
							:icon="modalMode === 'add' ? 'tabler-plus' : 'tabler-check'"
							start
						/>
						{{ modalMode === "add" ? "Agregar" : "Guardar Cambios" }}
					</VBtn>
				</VCardActions>
			</VCard>
		</VDialog>
	</section>
</template>

<style scoped>
.mediakit-manager {
	padding: 1.5rem;
}

.image-container {
	position: relative;
	overflow: hidden;
}

.image-container .v-img {
	transition: transform 0.3s ease;
}

.v-card:hover .image-container .v-img {
	transform: scale(1.05);
}

.gap-3 {
	gap: 0.75rem;
}
</style>
