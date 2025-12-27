<script setup>
import SeleccionadorManager from "../SeleccionadorManager.vue";
import AlertDialog from "../alert.vue";

const dominio_prod = ref('https://jsonhtml-ecuavisa.vercel.app');
// Nombre del newsletter
const newsletter = ref("boletin-entretenimiento");
const newsletterTitle = ref("Entretenimiento Ecuavisa");
const dataNewsletter = ref([]);
const loadingGeneral = ref(false);
const fechaUltimaModificacion = ref("");

// Dialog config
const dialogVisible = ref(false);
const dialogTipo = ref("success");
const dialogTitulo = ref("");
const dialogMensaje = ref("");

// Métodos para mostrar alertas
const mostrarExito = (titulo, mensaje) => {
	// Opción 1
	dialogTipo.value = "success";
	dialogTitulo.value = titulo;
	dialogMensaje.value = mensaje;
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



// Dartos del newsletter, en el servidor
const getItemsServer = async (newsletter = "") => {
	try {
		if (!newsletter) {
			throw new Error("No se proporciono un newsletter");
		}

		const response = await fetch(
			"https://micuenta.ecuavisa.com/servicio-php-newsletter-cms-react/newsletter/list.php?newsletter=" +
				newsletter
		);
		if (!response.ok) {
			throw new Error("Error al obtener los items");
		}
		const data = await response.json();
		return data ?? [];
	} catch (error) {
		console.error("Error:", error);
		mostrarError(
			error?.message || "Error al obtener los items, intente nuevamente"
		);
		return [];
	}
};

// Manejar guardado de items

const handleGuardarItems = async (items, json = {}) => {
  loadingGeneral.value = true
  const { showModal =  true } = json;
  
  try {
    // Simular llamada a API
    // await new Promise(resolve => setTimeout(resolve, 1500))
    
    // console.log('Items a guardar:', items)
    
    // Aquí harías la llamada real a tu API
    // const response = await fetch('/api/guardar-items', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ items })
    // })
	if(!newsletter.value){
		throw new Error('No se proporciono un newsletter');
	}

	if(!Array.isArray(items)){
		throw new Error('No se proporciono un newsletter');
	}

	// Aquí llamas a tu endpoint
	const response = await fetch('https://micuenta.ecuavisa.com/servicio-php-newsletter-cms-react/newsletter/add.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ newsletter:newsletter.value, item:items }),
	});

	if (!response.ok) {
		throw new Error('No se pudieron guardar los items. Intente nuevamente.');
	}
    
    if(showModal){
		mostrarExito('¡Éxito!', `Se guardaron ${items.length} items correctamente`)
	}
    
    // Opcional: hacer algo con los items guardados
    // itemsIniciales.value = items // Actualizar items iniciales
    
  } catch (error) {
    console.error('Error al guardar items:', error)
    mostrarError('No se pudieron guardar los items')
  } finally {
    loadingGeneral.value = false
  }
}

onMounted(async () => {
	loadingGeneral.value = true;
	const data = (await getItemsServer(newsletter.value ?? "")) ?? [];
    const { item = [], ultima_modificacion = "" } = data ?? [];
    fechaUltimaModificacion.value = ultima_modificacion;
    dataNewsletter.value = item;
	loadingGeneral.value = false;
});
</script>

<template>
	<AlertDialog
		v-model="dialogVisible"
		:tipo="dialogTipo"
		:titulo="dialogTitulo"
		:mensaje="dialogMensaje"
		texto-boton-confirmar="Entendido"
		@confirmar="handleConfirmar"
		@cancelar="handleCancelar"
	/>
	<!-- Dialogo loading -->
	<VDialog v-model="loadingGeneral" width="300" persistent>
		<VCard color="primary" width="300">
			<VCardText class="pt-3">
				Espere por favor
				<VProgressLinear indeterminate color="white" class="mb-0" />
			</VCardText>
		</VCard>
	</VDialog>
	<VRow>
		<VCol cols="12">
            <SeleccionadorManager
                :on-guardar-items="handleGuardarItems"
				:titulo="newsletterTitle"
                :newsletter="newsletter"
                :loading-general="loadingGeneral"
                :items-init="dataNewsletter"
                :fecha-ultima-modificacion="fechaUltimaModificacion"
                
            />
			<!-- @guardar="handleGuardarItems" -->
        </VCol>
	</VRow>
</template>
