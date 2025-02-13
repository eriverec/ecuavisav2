<script setup>
import { ref, onMounted } from 'vue'

const originalJSON = ref(null)
const jsonKeys = ref([])
const editedKeys = ref({})
const showSaveButton = ref(false)
const isLoading = ref(false)
const error = ref(null)
const showPreview = ref(false)

const extractUniqueKeys = (obj, keysSet = new Set()) => {
  if (Array.isArray(obj)) {
    obj.forEach(item => extractUniqueKeys(item, keysSet))
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      keysSet.add(key)
      extractUniqueKeys(obj[key], keysSet)
    })
  }
  return Array.from(keysSet)
}

const processJSON = (jsonData) => {
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
    originalJSON.value = parsedData
    const keys = extractUniqueKeys(parsedData)
    // Inicializar editedKeys con un objeto que contiene la clave original y la nueva
    keys.forEach(key => {
      editedKeys.value[key] = {
        newKey: key,
        originalKey: key
      }
    })
    return keys
  } catch (error) {
    console.error('Error procesando JSON:', error)
    return []
  }
}

const updateKey = (originalKey, newKey) => {
  editedKeys.value[originalKey] = {
    ...editedKeys.value[originalKey],
    newKey: newKey
  }
  showSaveButton.value = true
}

const deleteKey = (keyToDelete) => {
  // Confirmar antes de eliminar
  if (!confirm(`¿Estás seguro de eliminar el parámetro "${keyToDelete}"?`)) {
    return
  }

  // Eliminar la key de editedKeys
  delete editedKeys.value[keyToDelete]

  // Actualizar jsonKeys eliminando la key
  jsonKeys.value = jsonKeys.value.filter(key => key !== keyToDelete)

  // Marcar que hay cambios
  showSaveButton.value = true
}


const replaceKeysInObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(item => replaceKeysInObject(item))
  }

  if (obj && typeof obj === 'object') {
    const newObj = {}
    Object.entries(obj).forEach(([key, value]) => {
      // Solo incluir la key si no ha sido eliminada
      if (editedKeys.value[key]) {
        const keyInfo = editedKeys.value[key]
        const newKey = keyInfo ? keyInfo.newKey : key
        newObj[newKey] = replaceKeysInObject(value)
      }
    })
    return newObj
  }

  return obj
}

const fetchData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://services.ecuavisa.com/gestor/competencias/scrappin/mirrordt.php')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    jsonKeys.value = processJSON(data)
  } catch (e) {
    error.value = `Error al cargar datos: ${e.message}`
    console.error('Error fetching data:', e)
  } finally {
    isLoading.value = false
  }
}

const saveChanges = () => {
  try {
    const updatedJSON = replaceKeysInObject(originalJSON.value)
    console.log('JSON actualizado:', updatedJSON)

    // Actualizar el JSON original con los nuevos cambios
    originalJSON.value = updatedJSON

    // Actualizar las claves
    const newKeys = extractUniqueKeys(updatedJSON)
    jsonKeys.value = newKeys

    // Actualizar editedKeys con las nuevas claves
    const newEditedKeys = {}
    newKeys.forEach(key => {
      newEditedKeys[key] = {
        newKey: key,
        originalKey: key
      }
    })
    editedKeys.value = newEditedKeys

    showSaveButton.value = false
    alert('Cambios guardados exitosamente')
  } catch (error) {
    console.error('Error al guardar cambios:', error)
    alert('Error al guardar los cambios')
  }
}


const previewJSON = computed(() => {
  if (!originalJSON.value) return ''
  const updatedJSON = replaceKeysInObject(originalJSON.value)
  return JSON.stringify(updatedJSON, null, 2)
})

const copyStatus = ref('')

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(previewJSON.value)
    copyStatus.value = 'Copiado!'
    setTimeout(() => {
      copyStatus.value = ''
    }, 2000)
  } catch (err) {
    copyStatus.value = 'Error al copiar'
    console.error('Error al copiar:', err)
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}


const isSaving = ref(false)
const saveError = ref(null)

const saveToServer = async () => {
  isSaving.value = true
  saveError.value = null

  console.log(JSON.stringify(previewJSON.value));

  try {
    const response = await fetch('/api/gestor/competencias/scrappin/save-json.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: "follow",
      body: previewJSON.value
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Error al guardar')
    }

    alert('JSON guardado exitosamente en el servidor')

  } catch (error) {
    console.error('Error:', error)
    saveError.value = error.message
    alert('Error al guardar el JSON: ' + error.message)
  } finally {
    isSaving.value = false
  }
}


onMounted(() => {
  fetchData()
})
</script>



<template>
  <VRow>
    <VCol cols="12" md="12" :lg="12">
      <VCard>
        <VCardItem>
          <div class="d-flex content-title flex-wrap">
            <div class="d-flex gap-3">
              <div class="d-flex flex-column">
                Editor JSON Dinámico
              </div>
            </div>
          </div>
        </VCardItem>
        <VDivider />
        <VCardText>

          <div class="json-editor">
            <h2>Editor de Claves JSON</h2>

            <div v-if="isLoading" class="loading--">
              Cargando datos...
            </div>


            <div v-else-if="error" class="error">
              {{ error }}
              <button @click="fetchData" class="retry-button">
                Reintentar
              </button>
            </div>

            <div v-else>
              <div class="keys-container ">
                <VRow>
                  <VCol v-for="key in jsonKeys" :key="key" class="key-item" cols="12" sm="6" md="4" :lg="3">

                    <div>
                      <div class="key-pair">
                        <!-- <span class="original-key">{{ editedKeys[key]?.originalKey }}:</span> -->
                        <VTextField :value="editedKeys[key]?.newKey" @input="(e) => updateKey(key, e.target.value)"
                          class="key-input" />
                        <button @click="deleteKey(key)" class="delete-button" title="Eliminar parámetro">
                          <VIcon color="error" icon="tabler-trash" size="22" />
                        </button>
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </div>

              <!-- Botón de guardar fijo -->
              <div class="fixed-buttons">
                <button @click="togglePreview" class="preview-button" :class="{ 'active': showPreview }">
                  {{ showPreview ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa' }}
                </button>

                <button @click="saveToServer" class="save-server-button" :disabled="isSaving"
                  :class="{ 'saving': isSaving }">
                  <span v-if="isSaving">Guardando...</span>
                  <span v-else>Guardar en Servidor</span>
                </button>

                <button v-if="showSaveButton" @click="saveChanges" class="save-button">
                  Guardar Cambios
                </button>
              </div>

              <!-- Modal de Vista Previa -->
              <div v-if="showPreview" class="modal-overlay" @click="togglePreview">
                <div class="modal-content" @click.stop>
                  <div class="modal-header">
                    <h3>Vista Previa del JSON</h3>
                    <button class="close-button" @click="togglePreview">&times;</button>
                  </div>
                  <div class="modal-body">
                    <pre class="json-preview">{{ previewJSON }}</pre>
                  </div>
                  <div class="modal-footer">
                    <button @click="copyToClipboard" class="copy-button"
                      :class="{ 'copied': copyStatus === 'Copiado!' }">
                      <span class="copy-icon">📋</span>
                      {{ copyStatus || 'Copiar JSON' }}
                    </button>
                    <button class="close-modal-button" @click="togglePreview">Cerrar</button>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

</template>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-body pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 15px;
  border-radius: 4px;

  background: #222;
  color: #0f0;
  overflow: auto;
  max-height: 300px;
}


.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.copy-button,
.close-modal-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: none;
}

.copy-button {
  background-color: #28a745;
  color: white;
}

.copy-button:hover {
  background-color: #218838;
}

.close-modal-button {
  background-color: #6c757d;
  color: white;
}

.close-modal-button:hover {
  background-color: #5a6268;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 4px;
}

.error {
  background-color: #ffebee;
  color: #c62828;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.keys-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.key-item {
  padding: 10px;
  /* border: 1px solid #ddd; */
  border-radius: 4px;
}

.key-pair {
  display: flex;
  align-items: center;
  gap: 10px;
}

.original-key {
  min-width: 120px;
  font-weight: bold;
}

.save-button:hover {
  background-color: #45a049;
}

.fixed-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.preview-button {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.preview-button:hover {
  background-color: #1976D2;
}

.preview-button.active {
  background-color: #1565C0;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.preview-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 1200px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.json-preview {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  overflow-x: auto;
}

.save-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #45a049;
}

.save-server-button {
  background-color: #673AB7;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.save-server-button:hover:not(:disabled) {
  background-color: #5E35B1;
}

.save-server-button:disabled {
  background-color: #9575CD;
  cursor: not-allowed;
}

.save-server-button.saving {
  position: relative;
  pointer-events: none;
}

.error-message {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: #ffebee;
  color: #c62828;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .error-message {
    bottom: 140px;
    right: 10px;
    left: 10px;
    text-align: center;
  }
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .preview-content {
    width: 95%;
    margin: 10px;
  }

  .fixed-buttons {
    bottom: 10px;
    right: 10px;
    flex-direction: column;
  }

  .json-preview {
    font-size: 12px;
  }
}
</style>