<script setup>
import { computed } from "vue";

const dominio_prod = ref('https://www.ecuavisa.com');

// Props con TypeScript-like definitions
const props = defineProps({
	item: {
		type: Object,
		required: true,
		default: () => ({}),
	},
	seleccionado: {
		type: Boolean,
		default: false,
	},
	guardandoSeleccionado: {
		type: Boolean,
		default: false,
	},
});

// Emits
const emit = defineEmits(["seleccionar", "visualizar"]);

// Constantes
const imagenPorDefecto = "https://placehold.co/600x400?text=Not\nFound";
const dominio_prod_img = 'https://jsonhtml-ecuavisa.vercel.app';

// Computed properties
const titulo = computed(() => {
	return props.item.main?.title?.article || props.item.nombre || "Sin título";
});

const descripcion = computed(() => {
	return (
		props.item.main?.subtitle?.striped ||
		props.item.descripcion ||
		"Sin descripción"
	);
});

const categoria = computed(() => {
	return (
		props.item.info?.section?.name || props.item.categoria || "Sin categoría"
	);
});

const imagen = computed(() => {
	return `${dominio_prod_img}/image?url=${props.item.image?.url}` || props.item.imagen || imagenPorDefecto;
});

const imagenAlt = computed(() => {
	return props.item.imagenAlt || titulo.value;
});

const url = computed(() => {
	return `${dominio_prod.value}${props.item.info?.link?.url}` || "#";
});

// Métodos
const handleSeleccionar = () => {
	if (!props.guardandoSeleccionado) {
		emit("seleccionar", props.item);
	}
};

const handleVisualizar = () => {
	emit("visualizar", props.item);
};

const handleImageError = (event) => {
	event.target.src = imagenPorDefecto;
};
</script>

<template>
	<VCard
		class="mb-3"
		:variant="seleccionado ? 'outlined' : 'elevated'"
		:color="seleccionado ? 'primary' : undefined"
		:border="seleccionado"
	>
		<VRow no-gutters>
			<!-- Columna de la Imagen -->
			<VCol cols="12" md="3" class="d-flex align-center justify-center pa-3">
				<div class="image-container">
					<VImg
						:src="imagen"
						:alt="imagenAlt"
						:cover="true"
						:aspect-ratio="4 / 3"
						class="rounded-lg"
						@error="handleImageError"
						:transition="false"
					>
						<template #placeholder>
							<div class="d-flex align-center justify-center fill-height">
								<VIcon
									icon="tabler-photo"
									size="48"
									class="text-grey-lighten-2"
								/>
							</div>
						</template>
					</VImg>
				</div>
			</VCol>

			<!-- Columna del Contenido -->
			<VCol cols="12" md="9">
				<VCardText class="py-3">
					<div class="d-flex justify-space-between align-start mb-3">
						<div class="flex-grow-1 mr-3">
							<h5 class="text-h6 font-weight-medium mb-2">
								{{ titulo }}
							</h5>
							<p class="text-body-2 text-grey-darken-1 mb-0">
								{{ descripcion }}
							</p>
						</div>

						<VChip
							v-if="categoria"
							color="secondary"
							size="small"
							class="flex-shrink-0"
						>
							{{ categoria }}
						</VChip>
					</div>

					<div
						class="d-flex justify-space-between align-center flex-wrap gap-2"
					>
						<!-- Botón Visualizar (oculto como en el original) -->
						<VBtn
							color="info"
							size="small"
							variant="outlined"
							@click="handleVisualizar"
							class="d-none"
						>
							<VIcon icon="tabler-eye" size="16" start />
							Visualizar
						</VBtn>

						<!-- Botón Seleccionar -->
						<VBtn
							:color="seleccionado ? 'primary' : 'primary'"
							:variant="seleccionado ? 'flat' : 'outlined'"
							size="small"
							@click="handleSeleccionar"
							:loading="guardandoSeleccionado"
							:disabled="seleccionado || guardandoSeleccionado"
							class="flex-shrink-0"
						>
							<template v-if="!guardandoSeleccionado">
								<VIcon
									:icon="seleccionado ? 'tabler-check' : 'tabler-plus'"
									size="16"
									start
								/>
								{{ seleccionado ? "Seleccionado" : "Seleccionar" }}
							</template>
							<template v-else>
								<VProgressCircular
									indeterminate
									size="16"
									width="2"
									class="me-1"
								/>
								Procesando...
							</template>
						</VBtn>

						<!-- Botón Ver en Sitio -->
						<VBtn
							:href="url"
							target="_blank"
							rel="noopener noreferrer"
							color="primary"
							variant="text"
							size="small"
							class="flex-shrink-0"
						>
							<VIcon icon="tabler-external-link" size="16" start />
							Ver en sitio
						</VBtn>
					</div>
				</VCardText>
			</VCol>
		</VRow>
	</VCard>
</template>

<style scoped>
.image-container {
	width: 100%;
	max-height: 150px;
	overflow: hidden;
	border-radius: 8px;
}

.image-container .v-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

/* Efectos de hover */
.v-card {
	transition: all 0.2s ease;
}

.v-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Estado seleccionado */
.v-card--selected {
	border: 2px solid rgb(var(--v-theme-primary));
	background-color: rgba(var(--v-theme-primary), 0.05);
}

/* Responsive */
@media (max-width: 960px) {
	.image-container {
		max-height: 120px;
	}

	.v-row {
		flex-direction: column;
	}

	.v-col-md-3 {
		width: 100%;
	}

	.v-col-md-9 {
		width: 100%;
	}

	.d-flex.justify-space-between {
		flex-direction: column;
		gap: 12px;
	}

	.v-btn {
		width: 100%;
	}
}
</style>
