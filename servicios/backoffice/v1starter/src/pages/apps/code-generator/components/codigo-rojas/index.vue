<script setup>
import { ref, computed, onMounted } from 'vue'

// Estados reactivos
const isDialogVisible = ref(false)
const link = ref('')
const description = ref('')
const countryStatus = ref('')
const generatedCode = ref('')
const showPreview = ref(false)
const copied = ref(false)
const copyTimeout = ref(null)

// Opciones para el VSelect
const items = ref([
  'Ecuador hoy es un mejor país por...',
  'Ecuador hoy no es un mejor país por...'
])

const htmlComponent = (params = {}) => {
    const {countryStatus, escapedLink, escapedDescription} = params;
    return `<div class="codigo_rojas_ampliada"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="fondo_codigo_rojas"><tr><td><hr class="news-rojas-arriba"><tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td><div class="titulo_codigo_rojas">${countryStatus}</div><a class="link_codigo_rojas" href="${escapedLink}">${escapedDescription}</a></table><tr><td><hr class="news-rojas-abajo"></table></table></div>`;
}

// Generar el código HTML
const generateCode = () => {
  // Validar todos los campos
  if (!link.value.trim() || !description.value.trim() || !countryStatus.value) {
    alert('Por favor, completa todos los campos')
    return
  }
  
  // Escapar caracteres especiales para HTML
  const escapedLink = link.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  
  const escapedDescription = description.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  
  // Determinar el ícono y color basado en la selección
  let statusIcon = ''
  let statusClass = ''
  
  if (countryStatus.value === 'Ecuador hoy es un mejor país por...') {
    statusIcon = '✅'
    statusClass = 'status-positive'
  } else {
    statusIcon = '❌'
    statusClass = 'status-negative'
  }
  
  // Generar código HTML con el estado del país
//   generatedCode.value = `<div class="codigo_rojas ${statusClass}">
//   <div class="status-indicator">
//     ${statusIcon} ${countryStatus.value}
//   </div>
//   <a href="${escapedLink}">${escapedLink}</a>
//   <p>${escapedDescription}</p>
// </div>`

    generatedCode.value = htmlComponent({
        countryStatus:countryStatus.value, escapedLink, escapedDescription
    });
  
  showPreview.value = true
  copied.value = false
}

// Copiar al portapapeles usando la API nativa
const copyToClipboard = async () => {
  try {
    // Usar la Clipboard API moderna
    await navigator.clipboard.writeText(generatedCode.value)
    
    // Mostrar feedback visual
    copied.value = true
    
    // Limpiar timeout anterior si existe
    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value)
    }
    
    // Restablecer después de 2 segundos
    copyTimeout.value = setTimeout(() => {
      copied.value = false
    }, 2000)
    
  } catch (err) {
    // Fallback para navegadores más antiguos o sin HTTPS
    fallbackCopyToClipboard()
  }
}

// Método fallback para copiar
const fallbackCopyToClipboard = () => {
  const textArea = document.createElement('textarea')
  textArea.value = generatedCode.value
  
  // Evitar desplazamiento
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  
  document.body.appendChild(textArea)
  
  // Seleccionar y copiar
  textArea.focus()
  textArea.select()
  
  try {
    const successful = document.execCommand('copy')
    
    if (successful) {
      copied.value = true
      
      if (copyTimeout.value) {
        clearTimeout(copyTimeout.value)
      }
      
      copyTimeout.value = setTimeout(() => {
        copied.value = false
      }, 2000)
    } else {
      alert('No se pudo copiar el código. Por favor, selecciona y copia manualmente.')
    }
  } catch (err) {
    alert('Error al copiar: ' + err)
  }
  
  // Limpiar
  document.body.removeChild(textArea)
}

// Seleccionar todo el texto
const selectAll = () => {
  const textarea = document.querySelector('.code-output textarea')
  if (textarea) {
    textarea.select()
    textarea.focus()
    
    // Feedback visual
    textarea.classList.add('selected')
    setTimeout(() => {
      textarea.classList.remove('selected')
    }, 300)
  }
}

// Seleccionar todo desde el diálogo
const selectAllFromDialog = () => {
  const textarea = document.querySelector('.dialog-code textarea')
  if (textarea) {
    textarea.select()
    textarea.focus()
    
    // Feedback visual
    textarea.classList.add('selected')
    setTimeout(() => {
      textarea.classList.remove('selected')
    }, 300)
  }
}

// Resetear formulario
const resetForm = () => {
  link.value = ''
  description.value = ''
  countryStatus.value = ''
  generatedCode.value = ''
  showPreview.value = false
  copied.value = false
  
  if (copyTimeout.value) {
    clearTimeout(copyTimeout.value)
    copyTimeout.value = null
  }
}

// Vista previa del código generado
const previewHtml = computed(() => {
  if (!generatedCode.value) return ''
  
  // Crear un div temporal para renderizar
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = generatedCode.value
  
  // Añadir target="_blank" a los enlaces
  const linkElement = tempDiv.querySelector('a')
  if (linkElement) {
    linkElement.setAttribute('target', '_blank')
    linkElement.setAttribute('rel', 'noopener noreferrer')
  }
  
  return tempDiv.innerHTML
})

// Determinar el color del estado para visualización
const statusColor = computed(() => {
  if (countryStatus.value === 'Ecuador hoy es un mejor país por...') {
    return 'success'
  } else if (countryStatus.value === 'Ecuador hoy no es un mejor país por...') {
    return 'error'
  }
  return 'primary'
})

// Determinar el ícono para visualización
const statusIcon = computed(() => {
  if (countryStatus.value === 'Ecuador hoy es un mejor país por...') {
    return 'tabler-circle-check'
  } else if (countryStatus.value === 'Ecuador hoy no es un mejor país por...') {
    return 'tabler-circle-x'
  }
  return 'tabler-circle'
})

// Verificar si el formulario está completo
const isFormComplete = computed(() => {
  return link.value.trim() && description.value.trim() && countryStatus.value
})

// Limpiar el timeout cuando el componente se desmonte
onMounted(() => {
  return () => {
    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value)
    }
  }
})
</script>

<template>
  <div class="container">
    <VCard class="rounded-2" flat>
      <VCardTitle class="pb-0 mb-0">
        <div class="d-flex align-center justify-space-between w-100">
          <h4 class="text-h5">
            Generador de código
          </h4>
          <VChip
            v-if="countryStatus"
            :color="statusColor"
            size="small"
            class="ml-2"
          >
            <VIcon :icon="statusIcon" size="16" class="me-1" />
            {{ countryStatus.includes('es un mejor país') ? 'Positivo' : 'Negativo' }}
          </VChip>
        </div>
      </VCardTitle>

      <VCardText class="pt-4">
        <!-- Formulario para ingresar datos -->
        <VRow>
          <VCol cols="12" md="4">
            <VSelect
              v-model="countryStatus"
              :items="items"
              label="Estado del país"
              placeholder="Selecciona una opción"
              :rules="[v => !!v || 'Este campo es requerido']"
              clearable
            />
          </VCol>
          
          <VCol cols="12" md="4">
            <VTextField
              v-model="link"
              label="Link/Enlace"
              placeholder="https://ejemplo.com"
              :rules="[
                v => !!v || 'El link es requerido',
                v => (v && (v.startsWith('http://') || v.startsWith('https://'))) || 'Debe comenzar con http:// o https://'
              ]"
              type="url"
            />
          </VCol>
          
          <VCol cols="12" md="4">
            <VTextField
              v-model="description"
              label="Descripción"
              placeholder="Descripción del enlace"
              :rules="[v => !!v || 'La descripción es requerida']"
              counter="700"
              maxlength="700"
            />
          </VCol>
        </VRow>

        <!-- Indicador de estado -->
        <VRow v-if="countryStatus" class="mt-2">
          <VCol cols="12">
            <VAlert
              :color="statusColor"
              variant="tonal"
              density="compact"
              class="mb-0"
            >
              <div class="d-flex align-center">
                <VIcon :icon="statusIcon" class="me-2" />
                <span><strong>Estado seleccionado:</strong> {{ countryStatus }}</span>
              </div>
            </VAlert>
          </VCol>
        </VRow>

        <!-- Botones de acción -->
        <VRow class="mt-4">
          <VCol cols="12" class="d-flex gap-4 flex-wrap">
            <VBtn
              color="primary"
              @click="generateCode"
              :disabled="!isFormComplete"
              class="success-animation"
              :class="{ 'success-animation': copied }"
            >
              <VIcon icon="tabler-code" class="me-2" />
              Generar Código
            </VBtn>
            
            <VBtn
              color="secondary"
              variant="outlined"
              @click="resetForm"
            >
              <VIcon icon="tabler-refresh" class="me-2" />
              Limpiar Todo
            </VBtn>
            
            <VBtn
              v-if="generatedCode"
              color="success"
              variant="outlined"
              @click="isDialogVisible = true"
            >
              <VIcon icon="tabler-eye" class="me-2" />
              Vista Previa Completa
            </VBtn>
          </VCol>
        </VRow>

        <!-- Sección del código generado -->
        <div v-if="showPreview" class="code-output mt-6">
          <div class="d-flex justify-space-between align-center mb-2">
            <h6 class="text-h6">Código Generado:</h6>
            <div class="d-flex gap-2">
              <VBtn
                size="small"
                color="info"
                variant="tonal"
                @click="selectAll"
              >
                <VIcon icon="tabler-select-all" size="20" class="me-1" />
                Seleccionar Todo
              </VBtn>
              
              <VBtn
                size="small"
                :color="copied ? 'success' : 'primary'"
                variant="tonal"
                @click="copyToClipboard"
                class="success-animation"
                :class="{ 'success-animation': copied }"
              >
                <VIcon 
                  :icon="copied ? 'tabler-check' : 'tabler-copy'" 
                  size="20" 
                  class="me-1" 
                />
                {{ copied ? '¡Copiado!' : 'Copiar Código' }}
              </VBtn>
            </div>
          </div>
          
          <VTextarea
            :model-value="generatedCode"
            readonly
            auto-grow
            rows="3"
            class="code-textarea"
            variant="outlined"
            id="generated-code"
          />
          
          <!-- Vista previa pequeña -->
          <div class="preview-container mt-4">
            <h6 class="text-h6 mb-2">Vista previa:</h6>
            <VCard variant="outlined" class="preview-card">
              <VCardText>
                <div v-html="previewHtml" class="preview-content"></div>
              </VCardText>
            </VCard>
          </div>
        </div>
      </VCardText>
    </VCard>

    <!-- Diálogo para vista previa grande -->
    <VDialog
      v-model="isDialogVisible"
      width="700"
    >
      <VCard>
        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = false" />

        <!-- Dialog Content -->
        <VCardTitle class="d-flex align-center pt-4">
          <VIcon icon="tabler-eye" class="me-2" />
          Vista Previa del Código
          <VChip
            v-if="countryStatus"
            :color="statusColor"
            size="small"
            class="ml-3"
          >
            <VIcon :icon="statusIcon" size="16" class="me-1" />
            {{ countryStatus.includes('es un mejor país') ? 'Positivo' : 'Negativo' }}
          </VChip>
        </VCardTitle>
        
        <VCardText class="dialog-code">
          <!-- Vista previa renderizada -->
          <div class="preview-large mb-4">
            <h6 class="text-h6 mb-2">Renderizado:</h6>
            <VCard variant="outlined" class="pa-4 mb-4">
              <div v-html="previewHtml" class="preview-content"></div>
            </VCard>
          </div>
          
          <!-- Código HTML -->
          <div>
            <div class="d-flex justify-space-between align-center mb-2">
              <h6 class="text-h6">Código HTML:</h6>
              <div class="d-flex gap-2">
                <VBtn
                  size="small"
                  color="info"
                  variant="tonal"
                  @click="selectAllFromDialog"
                >
                  <VIcon icon="tabler-select-all" size="20" />
                </VBtn>
                
                <VBtn
                  size="small"
                  :color="copied ? 'success' : 'primary'"
                  variant="tonal"
                  @click="copyToClipboard"
                  class="success-animation"
                  :class="{ 'success-animation': copied }"
                >
                  <VIcon 
                    :icon="copied ? 'tabler-check' : 'tabler-copy'" 
                    size="20" 
                  />
                </VBtn>
              </div>
            </div>
            
            <VTextarea
              :model-value="generatedCode"
              readonly
              auto-grow
              rows="7"
              class="code-textarea"
              variant="outlined"
              id="dialog-code"
            />
          </div>
        </VCardText>

        <VDivider />
        
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn
            color="primary"
            variant="outlined"
            @click="selectAllFromDialog"
            :disabled="!generatedCode"
          >
            <VIcon icon="tabler-select-all" class="me-2" />
            Seleccionar
          </VBtn>
          <VBtn
            color="success"
            @click="isDialogVisible = false"
          >
            Cerrar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style>
.code-textarea {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
}

.code-textarea.selected {
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.3);
  border-color: rgb(var(--v-theme-primary)) !important;
}

.preview-content {
  padding: 16px;
}

.preview-card {
  min-height: 120px;
}

.codigo_rojas {
  border-left: 4px solid rgb(var(--v-theme-primary));
  padding: 16px;
  margin: 8px 0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.codigo_rojas.status-positive {
  border-left-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.codigo_rojas.status-negative {
  border-left-color: #f44336;
  background-color: rgba(244, 67, 54, 0.05);
}

.status-indicator {
  font-weight: 600;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-block;
}

.codigo_rojas.status-positive .status-indicator {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.codigo_rojas.status-negative .status-indicator {
  background-color: rgba(244, 67, 54, 0.1);
  color: #c62828;
}

.codigo_rojas a {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 8px;
}

.codigo_rojas a:hover {
  text-decoration: underline;
}

.codigo_rojas p {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  margin: 0;
  line-height: 1.5;
}

/* Animación para el botón de copiado */
.success-animation {
  transition: all 0.3s ease;
}

.success-animation:active {
  transform: scale(0.95);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Estilos para el VSelect personalizado */
.v-select-list .v-list-item {
  min-height: 48px;
}

.v-select-list .v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.1);
}



.codigo_rojas_ampliada table, .codigo_rojas_ampliada tr, .codigo_rojas_ampliada td {
    border: 0px!important;
    margin: 0px!important;
    padding: 0px!important;
}

.codigo_rojas_ampliada .fondo_codigo_rojas {
    background-color: #060026;
    background-image: url('https://estadisticas.ecuavisa.com/sites/gestor/Recursos/newsletterrojas/fondo-azul.png');
    border-radius:10px;
}

.codigo_rojas_ampliada  .news-rojas-arriba {
    background-image: url(https://estadisticas.ecuavisa.com/sites/gestor/Recursos/2026/news-rojas-arriba.png);
    padding: 25px;
    height: 25px;
    display: block!important;
    border: 0px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 90%;
    margin-top:15px;
}

.codigo_rojas_ampliada  .news-rojas-abajo {
    background-image: url(https://estadisticas.ecuavisa.com/sites/gestor/Recursos/2026/news-rojas-abajo.png);
    padding: 18px;
    height: 22px;
    display: block!important;
    border: 0px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 80%;
}

.codigo_rojas_ampliada {
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
}

.codigo_rojas_ampliada .titulo_codigo_rojas {
    color: #009ded;
    text-align: left;
    font-weight: bold;
    line-height: 1.4;
    padding: 10px 25px;
    font-size: 15px;
}

.codigo_rojas_ampliada a.link_codigo_rojas {
    color: #c0c9c9!important;
    line-height: 1.4;
    padding: 10px 25px;
    font-size: 15px;
    text-decoration: none!important;
    text-align: left;
    display: block;
}
</style>