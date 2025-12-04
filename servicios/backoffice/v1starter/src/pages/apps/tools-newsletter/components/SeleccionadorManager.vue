<script setup>
import { ref, watch, onMounted } from "vue";
import ModalResultados from "./ModalResultados.vue";
import ListadoPrincipal from "./ListadoPrincipal.vue";
import Buscador_general from "./buscador.vue";
import AlertDialog from "./alert.vue";

// Dialog config
const dialogVisible = ref(false);
const dialogTipo = ref("success");
const dialogTitulo = ref("");
const dialogMensaje = ref("");

// Métodos para mostrar alertas
const mostrarExito = (titulo, descripcion) => {
	// Opción 1
	dialogTipo.value = "success";
	dialogTitulo.value = titulo;
	dialogMensaje.value = descripcion;
	dialogVisible.value = true;
};

const mostrarError = (mensaje) => {
	dialogTipo.value = "error";
	dialogTitulo.value = "Error del Sistema";
	dialogMensaje.value = mensaje || "Ha ocurrido un error inesperado.";
	dialogVisible.value = true;
};

// Manejar confirmación del dialog
const handleConfirmar = () => {
	console.log("Usuario aceptó la alerta");
	// Aquí puedes agregar lógica adicional
};

const handleCancelar = () => {
	console.log("Usuario canceló");
};

const buscadorRef = ref(null);

const handleBusqueda = (busqueda) => {
	console.log("Busqueda:", busqueda);
};

// Props
const props = defineProps({
	onGuardarItems: {
		type: Function,
		required: true,
	},
	titulo: {
		type: String,
		default: "Seleccionador de Items",
	},
	newsletter: {
		type: String,
		default: "newsletter-5pm",
	},
	loadingGeneral: {
		type: Boolean,
		default: false,
	},
	itemsInit: {
		type: Array,
		default: () => [],
	},
	fechaUltimaModificacion: {
		type: String,
		default: "",
	},
});

// Emits
const emit = defineEmits(["guardar"]);

// Opciones para el selector
const OPCIONES_CATEGORIAS = [
	{ value: "noticias", text: "Noticias" },
	{ value: "deportes", text: "Estadio" },
	{ value: "entretenimiento", text: "Entretenimiento" },
];

// Estados para los filtros
const ultimoCambio = ref(false);
const filtroBusqueda = ref("");
const filtroBusquedaPath = ref("por_texto");
const filtroSelector = ref("");

// Estado para el modal
const mostrarModal = ref(false);

// Estado para los items seleccionados
const itemsSeleccionados = ref([]);

// Referencia para el modal
const modalResultadosRef = ref();

// Manejar cambios en los filtros
const handleBuscarChange = (valor) => {
	filtroBusqueda.value = valor?.texto ?? '';
	filtroBusquedaPath.value = valor?.tipo ?? 'por_texto';
	filtroSelector.value = '';
	mostrarModal.value = true;
};

// Manejar búsqueda
const handleBuscar = () => {
	if (filtroBusqueda.value.trim() === "" && filtroSelector.value === "") {
		// Podrías usar aquí el AlertDialog que creamos anteriormente
		mostrarError("Por favor, ingrese algún criterio de búsqueda");
		return;
	}
	mostrarModal.value = true;
};

// Manejar selección de item desde el modal
const handleSeleccionarItem = (item) => {
	// Verificar si el item ya está seleccionado
	const yaSeleccionado = itemsSeleccionados.value.some(
		(selectedItem) => selectedItem.info?.link?.url === item.info?.link?.url
	);

	if (!yaSeleccionado) {
		const nuevoItem = {
			...item,
			orden: itemsSeleccionados.value.length + 1,
		};
		itemsSeleccionados.value = [...itemsSeleccionados.value, nuevoItem];
		ultimoCambio.value = true;
	} else {
		// Aquí podrías usar el AlertDialog para mostrar el mensaje
		alert("Este item ya está seleccionado");
	}
};

// Manejar eliminación de item del listado principal
const handleEliminarItem = (link) => {
	itemsSeleccionados.value = itemsSeleccionados.value
		.filter((item) => item.info?.link?.url !== link)
		.map((item, idx) => ({
			...item,
			orden: idx + 1,
		}));
	ultimoCambio.value = true;
};

// Manejar vaciar todo
const handleVaciarTodo = () => {
	// Podrías usar un dialog de confirmación aquí
	const confirmar = window.confirm("¿Está seguro de vaciar todo?");
	if (confirmar) {
		itemsSeleccionados.value = [];
		props.onGuardarItems([]);
		ultimoCambio.value = true;
		emit("guardar", []);
		return true;
	}
	return false;
};

// Ordenar items
const handleOrdenarItems = (items) => {
	itemsSeleccionados.value = items.map((item, idx) => ({
		...item,
		orden: idx + 1,
	}));
	ultimoCambio.value = true;
};

// Manejar guardado final
const handleGuardarTodo = () => {
	if (itemsSeleccionados.value.length === 0) {
		mostrarError("No hay items para guardar");
		return;
	}

	props.onGuardarItems(itemsSeleccionados.value);
	emit("guardar", itemsSeleccionados.value);
	ultimoCambio.value = false;
};

// Inicializar con itemsInit
watch(
	() => props.itemsInit,
	(newItems) => {
		itemsSeleccionados.value = newItems;
		ultimoCambio.value = false;
	},
	{ immediate: true }
);

// Opcional: buscar con Enter
const handleKeyPress = (event) => {
	if (event.key === "Enter") {
		// handleBuscar();
	}
};
</script>

<template>
	<!-- Componente Dialog -->
	<AlertDialog
		v-model="dialogVisible"
		:tipo="dialogTipo"
		:titulo="dialogTitulo"
		:mensaje="dialogMensaje"
		texto-boton-confirmar="Entendido"
		@confirmar="handleConfirmar"
		@cancelar="handleCancelar"
	/>
	<div class="container">
		<VCard class="rounded-0" flat>
			<VCardTitle class="pb-0 mb-0">
				<h4 class="text-h5">{{ titulo }}</h4>
			</VCardTitle>

			<VCardText class="pt-4">
				<!-- Filtros -->
				<VRow>
					<VCol cols="12">
						<Buscador_general @buscar="handleBuscarChange" ref="buscadorRef" />
					</VCol>
				</VRow>

				<!-- Listado Principal -->
				<ListadoPrincipal
					:fecha-ultima-modificacion="fechaUltimaModificacion"
					:items-seleccionados="itemsSeleccionados"
					:ultimo-cambio="ultimoCambio"
					:loading-general="loadingGeneral"
					@eliminar-item="handleEliminarItem"
					@ordenar-items="handleOrdenarItems"
					@vaciar-todo="handleVaciarTodo"
					@guardarTodo="handleGuardarTodo"
				/>

				<!-- Botón de Guardar Todo -->
				<VCardActions v-if="itemsSeleccionados.length > 0" class="px-0">
					<VBtn
						color="success pe-5"
						@click="handleGuardarTodo"
						:loading="loadingGeneral"
						:disabled="loadingGeneral"
						variant="tonal"
					>
						<template v-if="!loadingGeneral">
							<VIcon icon="tabler-save" start />
							Guardar ({{ itemsSeleccionados.length }}) Items
						</template>
						<template v-else>
							<VProgressCircular
								indeterminate
								size="20"
								width="2"
								class="me-2"
							/>
							Guardando...
						</template>
					</VBtn>
				</VCardActions>
			</VCardText>
		</VCard>

		<!-- Modal de Resultados -->
		<ModalResultados
			ref="modalResultadosRef"
			v-model="mostrarModal"
			:filtros="{
				busqueda: filtroBusqueda,
				selector: filtroSelector,
				path: filtroBusquedaPath,
			}"
			:items-seleccionados="itemsSeleccionados"
			@seleccionar-item="handleSeleccionarItem"
			@cerrar="mostrarModal = false"
		/>
	</div>
</template>

<style scoped>
.container {
	max-width: 1200px;
}

.rounded-0 {
	border-radius: 0 !important;
}
</style>
