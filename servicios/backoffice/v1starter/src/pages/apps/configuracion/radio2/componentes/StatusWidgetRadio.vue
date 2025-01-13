<script setup>
import { isEqual } from 'lodash';
import { onUnmounted, ref } from 'vue';

const props = defineProps({
  assetUrl: {
    type: String,
    required: true
  },
  pollInterval: {
    type: Number,
    default: 2000
  },
  maxAttempts: {
    type: Number,
    default: 30
  }
});

const emit = defineEmits(['progress', 'success', 'error', 'timeout']);

const currentData = ref(null);
const attempts = ref(0);
const checkInterval = ref(null);

const loadConfiguracion = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No se encontró el objeto de configuración');
    }
    
    const configText = text.substring(startIndex, endIndex + 1);
    try {
      return JSON.parse(configText);
    } catch (parseError) {
      const safeEval = new Function(`return ${configText}`);
      return safeEval();
    }
  } catch (error) {
    throw error;
  }
};

const startMonitoring = async () => {
  attempts.value = 0;
  try {
    // Datos iniciales
    currentData.value = await loadConfiguracion(props.assetUrl);
    emit('progress', {
      step: 1,
      message: 'Guardando cambios...',
      progress: 33
    });

    // Iniciar el monitoreo
    checkInterval.value = setInterval(async () => {
      attempts.value++;
      
      // Emitir progreso
      emit('progress', {
        step: 2,
        message: 'Verificando cambios...',
        progress: 66
      });
      
      // Verificar timeout
      if (attempts.value > props.maxAttempts) {
        stopMonitoring();
        emit('timeout');
        return;
      }

      try {
        const newData = await loadConfiguracion(props.assetUrl);
        
        // Comparar los datos actuales con los nuevos
        if (!isEqual(currentData.value, newData)) {
          stopMonitoring();
          emit('progress', {
            step: 3,
            message: 'Cambios verificados',
            progress: 100
          });
          emit('success', newData);
        }
      } catch (error) {
        stopMonitoring();
        emit('error', error);
      }
    }, props.pollInterval);
  } catch (error) {
    emit('error', error);
  }
};

const stopMonitoring = () => {
  if (checkInterval.value) {
    clearInterval(checkInterval.value);
    checkInterval.value = null;
  }
};

onUnmounted(() => {
  stopMonitoring();
});

defineExpose({
  startMonitoring,
  stopMonitoring
});
</script>