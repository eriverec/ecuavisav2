<script setup>
import { ref } from 'vue'
import AlertDialog from "./alert.vue";

// Dialog config
const dialogVisible = ref(false);
const dialogTipo = ref("success");
const dialogTitulo = ref("");
const dialogMensaje = ref("");

// Métodos para mostrar alertas
const mostrarExito = () => {
	// Opción 1
	dialogTipo.value = "success";
	dialogTitulo.value = "Operación Exitosa";
	dialogMensaje.value = "Los datos se han guardado correctamente.";
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

// Props y emits
const props = defineProps({
  // Puedes agregar props si necesitas valores iniciales
})

const emit = defineEmits(['buscar'])

// Data reactiva
const buscar = ref('')
const itemsTipoBuscar = ref([
  { value: 'por_texto', text: 'Por texto' },
  { value: 'por_path', text: 'Por url' },
])
const tipoBuscar = ref('por_path')

// Método para manejar la búsqueda
const handleBuscar = () => {
  // Validar que el campo no esté vacío
  if (!buscar.value.trim()) {
    // Puedes mostrar un mensaje de error si lo prefieres
    mostrarError('Por favor, ingresa un término de búsqueda')
    return
  }
  
  // Emitir el evento con los datos de búsqueda
  emit('buscar', {
    texto: buscar.value.trim(),
    tipo: tipoBuscar.value
  })
}

// Opcional: permitir búsqueda con Enter
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleBuscar()
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12" col-sm="4"> 
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
      <label for="buscar">{{ (tipoBuscar === 'por_texto' ? 'Buscar por el titular de la nota' : 'Buscar por la URL') }}</label>
      <div class="d-flex gap-1 align-center my-1 mb-3">
        <VTextField
          class="rounded-0"
          id="buscar"
          v-model="buscar"
          :placeholder="tipoBuscar === 'por_texto' ? 'Ingrese el titular del artículo' : 'Ponga la URL que desea buscar'"
          @keypress="handleKeyPress"
        />
        <div class="tipoBuscar">
          <VSelect
            v-model="tipoBuscar"
            :items="itemsTipoBuscar"
            item-title="text"
            item-value="value"
          />
        </div>
      </div>
      <VBtn 
        color="primary" 
        @click="handleBuscar"
      >
        <VIcon icon="tabler-search" />  Buscar Items
      </VBtn>
    </VCol>
  </VRow>
</template>

<style scoped>
.tipoBuscar {
  width: 150px;
}

.rounded-0 {
  border-radius: 0px;
}
</style>