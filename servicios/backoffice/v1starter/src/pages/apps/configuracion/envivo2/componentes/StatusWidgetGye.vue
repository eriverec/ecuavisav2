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
    default: 1000
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

const loadConfiguracion = async (url, noCache = true) => {
  try {
    const response = await fetch(`${url}${noCache ? '?t=' + Date.now() : ''}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No se encontró el objeto de configuración');
    }
    
    const configText = text.substring(startIndex, endIndex + 1);
    return JSON.parse(configText);
  } catch (error) {
    console.error('Error en loadConfiguracion:', error);
    throw error;
  }
};

const compareData = (oldData, newData) => {
  // Comparación específica
  const relevantOld = {
    forzado: oldData?.forzado,
    horarios: oldData?.horarios,
    html: oldData?.html
  };
  
  const relevantNew = {
    forzado: newData?.forzado,
    horarios: newData?.horarios,
    html: newData?.html
  };

  return !isEqual(relevantOld, relevantNew);
};

const startMonitoring = async () => {
  attempts.value = 0;
  
  try {
    //  estado inicial
    currentData.value = await loadConfiguracion(props.assetUrl, false);
    
    emit('progress', {
      step: 1,
      message: 'Guardando cambios...',
      progress: 33
    });

    // Iniciar verificación
    checkInterval.value = setInterval(async () => {
      try {
        attempts.value++;
        console.log(`Intento ${attempts.value} de verificación`);
        
        emit('progress', {
          step: 2,
          progress: Math.min(66 + (attempts.value * 2), 95)
        });

        const newData = await loadConfiguracion(props.assetUrl, true);
        const hasChanges = compareData(currentData.value, newData);
        console.log('Cambios detectados:', hasChanges);

        if (hasChanges) {
          console.log('Actualizando con nuevos datos');
          stopMonitoring();
          emit('progress', {
            step: 3,
            message: 'Cambios verificados',
            progress: 100
          });
          emit('success', newData);
          return;
        }

        if (attempts.value >= props.maxAttempts) {
          console.log('Máximo de intentos alcanzado');
          stopMonitoring();
          emit('timeout');
          return;
        }

      } catch (error) {
        console.error('Error en la verificación:', error);
        stopMonitoring();
        emit('error', error);
      }
    }, props.pollInterval);

  } catch (error) {
    console.error('Error inicial:', error);
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