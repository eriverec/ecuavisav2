<script setup>
import { ref, computed, onMounted } from 'vue'

// Estados reactivos
const isDialogVisible = ref(false)
const link = ref('')
const description = ref('')
const countryStatus = ref('')
const generatedCode = ref('')
const generatedCodigoRojas = ref('')
const showPreview = ref(false)
const copied = ref(false)
const copiedCodigoRojas = ref(false)
const copyTimeout = ref(null)
const copyCodigoRojasTimeout = ref(null)

// Opciones para el VSelect
const items = ref([
  'Ecuador hoy es un mejor país por...',
  'Ecuador hoy no es un mejor país por...'
])

const htmlComponent = (params = {}) => {
    const {countryStatus, escapedLink, escapedDescription} = params;
    return `<div class=codigo_rojas><table border=0 cellpadding=0 cellspacing=0 style=border:0!important;margin:0!important;padding:0!important width=100%><tr style=border:0!important><td style=padding:20px!important;border:0!important align=center><table border=0 cellpadding=0 cellspacing=0 style=border:0!important;width:100%!important;background-color:#060026!important;background-image:url(https://estadisticas.ecuavisa.com/sites/gestor/Recursos/newsletterrojas/fondo-azul.png);border-radius:10px!important width=100%><tr style=border:0!important><td style=padding:15px!important;border:0!important><img alt="Newsletter Rojas"src=https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/news-rojas-arriba.png style=display:block!important;border:0!important;height:auto!important;max-width:100%!important;width:100%!important><tr style=border:0!important><td style=padding-top:20px!important;padding-left:20px!important;padding-bottom:15px!important;padding-right:20px!important;border:0!important><table border=0 cellpadding=0 cellspacing=0 style=border:0!important width=100%><tr style=border:0!important><td style=border:0!important><p style="margin:0 0 10px 0!important;text-align:left;color:#009ded!important;font-family:'Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;font-weight:700!important;line-height:1.4!important">${countryStatus}<p style="text-align:left!important;margin:0!important;font-size:14px!important;color:#c0c9c9!important;font-family:'Lucida Sans Unicode','Lucida Grande',Arial,sans-serif;line-height:1.5!important"><a href=${escapedLink} style=color:#c0c9c9!important;text-align:left!important;text-decoration:none!important>${escapedDescription}</a></table><tr style=border:0!important><td style="padding:15px 35px!important;border:0!important"><img alt="Newsletter Footer"src=https://s7844538.sendpul.se/files/emailservice/userfiles/f7d451814eb533de3f3b83b6f72ec10c7844538/news-rojas-abajo.png style=display:block!important;border:0!important;height:auto!important;max-width:100%!important;width:100%!important></table></table></div>
`;
}

// Generar ambos formatos de código
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
  
  // 1. Generar código HTML con el estado del país (para vista previa)
//   generatedCode.value = `<div class="codigo_rojas ${statusClass}">
//   <div class="status-indicator">
//     ${statusIcon} ${countryStatus.value}
//   </div>
//   <a href="${escapedLink}" target="_blank" rel="noopener noreferrer">${escapedLink}</a>
//   <p>${escapedDescription}</p>
// </div>`
generatedCode.value = htmlComponent({
        countryStatus:countryStatus.value, escapedLink, escapedDescription
    });
  
  // 2. Generar código en formato [CodigoRojasEsMejor] (para copiar)
  generatedCodigoRojas.value = `[CodigoRojasEsMejor]
  [Link]
    ${link.value}
  [/Link]
  [Titulo]
    ${countryStatus.value}
  [/Titulo]
  [Descripcion]
    ${description.value}
  [/Descripcion]
[/CodigoRojasEsMejor]`
  
  showPreview.value = true
  copied.value = false
  copiedCodigoRojas.value = false
}

// Copiar código HTML al portapapeles
const copyToClipboard = async (format = 'html') => {
  const textToCopy = format === 'codigorojas' ? generatedCodigoRojas.value : generatedCode.value
  
  try {
    // Usar la Clipboard API moderna
    await navigator.clipboard.writeText(textToCopy)
    
    // Mostrar feedback visual
    if (format === 'codigorojas') {
      copiedCodigoRojas.value = true
      
      // Limpiar timeout anterior si existe
      if (copyCodigoRojasTimeout.value) {
        clearTimeout(copyCodigoRojasTimeout.value)
      }
      
      // Restablecer después de 2 segundos
      copyCodigoRojasTimeout.value = setTimeout(() => {
        copiedCodigoRojas.value = false
      }, 2000)
    } else {
      copied.value = true
      
      // Limpiar timeout anterior si existe
      if (copyTimeout.value) {
        clearTimeout(copyTimeout.value)
      }
      
      // Restablecer después de 2 segundos
      copyTimeout.value = setTimeout(() => {
        copied.value = false
      }, 2000)
    }
    
  } catch (err) {
    // Fallback para navegadores más antiguos o sin HTTPS
    fallbackCopyToClipboard(textToCopy, format)
  }
}

// Método fallback para copiar
const fallbackCopyToClipboard = (textToCopy, format) => {
  const textArea = document.createElement('textarea')
  textArea.value = textToCopy
  
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
      if (format === 'codigorojas') {
        copiedCodigoRojas.value = true
        
        if (copyCodigoRojasTimeout.value) {
          clearTimeout(copyCodigoRojasTimeout.value)
        }
        
        copyCodigoRojasTimeout.value = setTimeout(() => {
          copiedCodigoRojas.value = false
        }, 2000)
      } else {
        copied.value = true
        
        if (copyTimeout.value) {
          clearTimeout(copyTimeout.value)
        }
        
        copyTimeout.value = setTimeout(() => {
          copied.value = false
        }, 2000)
      }
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
const selectAll = (format = 'html') => {
  const selector = format === 'codigorojas' ? '.codigo-rojas-textarea' : '.code-textarea'
  const textarea = document.querySelector(selector)
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
  generatedCodigoRojas.value = ''
  showPreview.value = false
  copied.value = false
  copiedCodigoRojas.value = false
  
  if (copyTimeout.value) {
    clearTimeout(copyTimeout.value)
    copyTimeout.value = null
  }
  
  if (copyCodigoRojasTimeout.value) {
    clearTimeout(copyCodigoRojasTimeout.value)
    copyCodigoRojasTimeout.value = null
  }
}

// Vista previa del código generado
const previewHtml = computed(() => {
  if (!generatedCode.value) return ''
  
  // Crear un div temporal para renderizar
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = generatedCode.value
  
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

// Limpiar los timeouts cuando el componente se desmonte
onMounted(() => {
  return () => {
    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value)
    }
    if (copyCodigoRojasTimeout.value) {
      clearTimeout(copyCodigoRojasTimeout.value)
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
          
          <!-- Formato [CodigoRojasEsMejor] -->
          <div class="codigo-rojas-format mb-6">
            <div class="d-flex justify-space-between align-center mb-2">
              <h6 class="text-h6">
                Formato [CodigoRojasEsMejor]:
                <VIcon 
                  icon="tabler-info-circle" 
                  size="18" 
                  color="info" 
                  class="ms-2 cursor-pointer"
                  title="Formato especial para uso en sistemas específicos"
                />
              </h6>
              <div class="d-flex gap-2">
                <VBtn
                  size="small"
                  color="info"
                  variant="tonal"
                  @click="selectAll('codigorojas')"
                >
                  <VIcon icon="tabler-select-all" size="20" class="me-1" />
                  Seleccionar Todo
                </VBtn>
                
                <VBtn
                  size="small"
                  :color="copiedCodigoRojas ? 'success' : 'primary'"
                  variant="tonal"
                  @click="copyToClipboard('codigorojas')"
                  class="success-animation"
                  :class="{ 'success-animation': copiedCodigoRojas }"
                >
                  <VIcon 
                    :icon="copiedCodigoRojas ? 'tabler-check' : 'tabler-copy'" 
                    size="20" 
                    class="me-1" 
                  />
                  {{ copiedCodigoRojas ? '¡Copiado!' : 'Copiar Formato' }}
                </VBtn>
              </div>
            </div>
            
            <VTextarea
              :model-value="generatedCodigoRojas"
              readonly
              auto-grow
              rows="8"
              class="codigo-rojas-textarea"
              variant="outlined"
              id="codigo-rojas-format"
            />
          </div>
          
          <!-- Vista previa HTML -->
          <div class="preview-container mb-6">
            <h6 class="text-h6 mb-2">Vista previa HTML:</h6>
            <VCard variant="outlined" class="preview-card">
              <VCardText>
                <div v-html="previewHtml" class="preview-content"></div>
              </VCardText>
            </VCard>
          </div>
          
          <!-- Código HTML Generado -->
          <div class="html-code-format d-none">
            <div class="d-flex justify-space-between align-center mb-2">
              <h6 class="text-h6">Código HTML Generado:</h6>
              <div class="d-flex gap-2">
                <VBtn
                  size="small"
                  color="info"
                  variant="tonal"
                  @click="selectAll('html')"
                >
                  <VIcon icon="tabler-select-all" size="20" class="me-1" />
                  Seleccionar Todo
                </VBtn>
                
                <VBtn
                  size="small"
                  :color="copied ? 'success' : 'primary'"
                  variant="tonal"
                  @click="copyToClipboard('html')"
                  class="success-animation"
                  :class="{ 'success-animation': copied }"
                >
                  <VIcon 
                    :icon="copied ? 'tabler-check' : 'tabler-copy'" 
                    size="20" 
                    class="me-1" 
                  />
                  {{ copied ? '¡Copiado!' : 'Copiar HTML' }}
                </VBtn>
              </div>
            </div>
            
            <VTextarea
              :model-value="generatedCode"
              readonly
              auto-grow
              rows="5"
              class="code-textarea"
              variant="outlined"
              id="html-code"
            />
          </div>
          
        </div>
      </VCardText>
    </VCard>

    <!-- Diálogo para vista previa grande -->
    <VDialog
      v-model="isDialogVisible"
      width="800"
    >
      <VCard>
        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogVisible = false" />

        <!-- Dialog Content -->
        <VCardTitle class="d-flex align-center pt-4">
          <VIcon icon="tabler-eye" class="me-2" />
          Vista Previa Completa
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
        
        <VCardText class="dialog-code pa-4">
          <!-- Tabs para navegar entre formatos -->
          <VTabs v-model="activeTab" class="mb-4">
            <VTab value="preview">
              <VIcon icon="tabler-eye" class="me-2" />
              Vista Previa
            </VTab>
            <VTab value="html" class="d-none">
              <VIcon icon="tabler-brand-html5" class="me-2" />
              Código HTML
            </VTab>
            <VTab value="codigorojas">
              <VIcon icon="tabler-code" class="me-2" />
              Formato CodigoRojas
            </VTab>
          </VTabs>
          
          <VWindow v-model="activeTab" class="mt-2">
            <!-- Vista previa renderizada -->
            <VWindowItem value="preview">
              <h6 class="text-h6 mb-2">Renderizado:</h6>
              <VCard variant="outlined" class="pa-4 mb-4">
                <div v-html="previewHtml" class="preview-content"></div>
              </VCard>
            </VWindowItem>
            
            <!-- Código HTML -->
            <VWindowItem value="html">
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
                    @click="copyToClipboard('html')"
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
                rows="10"
                class="code-textarea"
                variant="outlined"
                id="dialog-html-code"
              />
            </VWindowItem>
            
            <!-- Formato CodigoRojas -->
            <VWindowItem value="codigorojas">
              <div class="d-flex justify-space-between align-center mb-2">
                <h6 class="text-h6">Formato [CodigoRojasEsMejor]:</h6>
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
                    :color="copiedCodigoRojas ? 'success' : 'primary'"
                    variant="tonal"
                    @click="copyToClipboard('codigorojas')"
                    class="success-animation"
                    :class="{ 'success-animation': copiedCodigoRojas }"
                  >
                    <VIcon 
                      :icon="copiedCodigoRojas ? 'tabler-check' : 'tabler-copy'" 
                      size="20" 
                    />
                  </VBtn>
                </div>
              </div>
              
              <VTextarea
                :model-value="generatedCodigoRojas"
                readonly
                auto-grow
                rows="10"
                class="codigo-rojas-textarea"
                variant="outlined"
                id="dialog-codigo-rojas"
              />
            </VWindowItem>
          </VWindow>
        </VCardText>

        <VDivider />
        
        <VCardActions class="pa-4">
          <VSpacer />
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

<style scoped>
.code-textarea,
.codigo-rojas-textarea {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  transition: all 0.3s ease;
}

.code-textarea.selected,
.codigo-rojas-textarea.selected {
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
  word-break: break-all;
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

/* Estilos específicos para el formato CodigoRojas */
.codigo-rojas-textarea {
  background-color: #f8f9fa;
  border-left: 3px solid #6c757d;
}

.codigo-rojas-format {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.html-code-format {
  background: linear-gradient(135deg, #f0f8ff 0%, #e3f2fd 100%);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #bbdefb;
}

/* Estilo para el contenedor de código */
.code-output > div {
  margin-bottom: 24px;
}

.code-output > div:last-child {
  margin-bottom: 0;
}

/* Estilo para las tabs en el diálogo */
:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
}

:deep(.v-tab--selected) {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

/* Responsive */
@media (max-width: 960px) {
  .code-output > div {
    margin-bottom: 20px;
  }
  
  .codigo-rojas-format,
  .html-code-format {
    padding: 16px;
  }
}
</style>

<script>
// Agregamos activeTab al script
const activeTab = ref('preview')
</script>