<template>
  <div class="json-display">
    <div class="button-group">
      <button class="action-button preview-button" @click="togglePreview">
        Vista Previa JSON
      </button>
      <button class="action-button download-button" @click="downloadJSON">
        Descargar JSON
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
          <pre>{{ formattedJSON }}</pre>
        </div>
        <div class="modal-footer">
          <button class="copy-button" @click="copyToClipboard">
            {{ copySuccess ? 'Copiado!' : 'Copiar JSON' }}
          </button>
          <button class="close-modal-button" @click="togglePreview">Cerrar</button>
        </div>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading">
      Cargando datos...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else v-for="(value, key, index) in jsonData" :key="index" class="json-item">
      <div class="json-header" @click="toggleItem(index)">
        <span class="toggle-icon">{{ isExpanded[index] ? '▼' : '▶' }}</span>
        <template v-if="isObject(value)">
          <div v-for="(propValue, propKey) in getObjectProperties(value)" 
               :key="propKey" 
               class="json-property"
               v-show="!isArray(propValue) && !isObject(propValue)">
            <span class="key">{{ propKey }}:</span>
            <input
              v-model="value[propKey]"
              :class="['value', getValueType(propValue)]"
              @click.stop
            />
          </div>
        </template>
        <template v-else>
          <span class="key">{{ key }}:</span>
          <input
            v-model="value[key]"
            :class="['value', getValueType(value)]"
            @click.stop
          />
        </template>
      </div>
      
      <div v-if="hasNestedContent(value)" v-show="isExpanded[index]">
        <template v-for="(nestedValue, nestedKey) in getNestedContent(value)" :key="nestedKey">
          <div v-if="isArray(nestedValue)" class="json-array">
            <div class="array-header" @click="toggleNested(`${index}-${nestedKey}`)">
              <span class="toggle-icon">{{ isNestedExpanded[`${index}-${nestedKey}`] ? '▼' : '▶' }}</span>
              <span class="key">{{ nestedKey }} ({{ nestedValue.length }}):</span>
            </div>
            
            <ul v-show="isNestedExpanded[`${index}-${nestedKey}`]" class="array-list">
              <li v-for="(item, itemIndex) in nestedValue" 
                  :key="itemIndex" 
                  class="array-item">
                <div class="item-header" @click="toggleItem(`${index}-${nestedKey}-${itemIndex}`)">
                  <span class="toggle-icon">{{ isExpanded[`${index}-${nestedKey}-${itemIndex}`] ? '▼' : '▶' }}</span>
                  <span class="value">{{ getItemPreview(item) }}</span>
                </div>
                
                <div v-show="isExpanded[`${index}-${nestedKey}-${itemIndex}`]" class="item-content">
                  <!-- <div v-for="(itemValue, itemKey) in item" 
                       :key="itemKey"
                        v-show="itemKey !== getPreviewKey(item)"
                       class="json-property"> -->
                  <div v-for="(itemValue, itemKey) in item" 
                       :key="itemKey"
                       class="json-property">
                    <input
                      :value="itemKey"
                      class="key-input"
                      @change="updateKey(item, itemKey, $event.target.value)"
                      @click.stop
                    />
                    <span class="separator">:</span>
                    <input
                      v-model="item[itemKey]"
                      :class="['value', getValueType(itemValue)]"
                      :type="getInputType(itemValue)"
                      @click.stop
                    />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <div v-else-if="isObject(nestedValue)" class="json-object">
            <!-- Manejo recursivo de objetos anidados si es necesario -->
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'

const jsonData = ref([])
const isLoading = ref(false)
const error = ref(null)

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await axios.get('https://services.ecuavisa.com/gestor/competencias/mirrordt.php')
    jsonData.value = response.data
  } catch (e) {
    error.value = 'Error al cargar los datos: ' + e.message
    console.error('Error:', e)
  } finally {
    isLoading.value = false
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  fetchData()
})

const isExpanded = reactive({})
const isNestedExpanded = reactive({})

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isArray = (value) => Array.isArray(value)

const getObjectProperties = (obj) => {
  return Object.entries(obj)
    .filter(([_, value]) => !isArray(value) && !isObject(value))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

const hasNestedContent = (value) => {
  if (!isObject(value)) return false
  return Object.values(value).some(v => isArray(v) || isObject(v))
}

const getNestedContent = (value) => {
  if (!isObject(value)) return {}
  return Object.entries(value)
    .filter(([_, v]) => isArray(v) || isObject(v))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

const getItemPreview = (item) => {
  const previewKey = getPreviewKey(item)
  return item[previewKey] || JSON.stringify(item)
}

const getPreviewKey = (item) => {
  // Prioriza campos comunes para mostrar como vista previa
  const previewKeys = ['titulo', 'name', 'title', 'id', 'key']
  return previewKeys.find(key => key in item) || Object.keys(item)[0]
}

const toggleItem = (key) => {
  isExpanded[key] = !isExpanded[key]
}

const toggleNested = (key) => {
  isNestedExpanded[key] = !isNestedExpanded[key]
}

const getValueType = (value) => {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  return 'string'
}

const getInputType = (value) => {
  if (typeof value === 'boolean') return 'checkbox'
  if (typeof value === 'number') return 'number'
  return 'text'
}

const showPreview = ref(false)
const copySuccess = ref(false)

const formattedJSON = computed(() => {
  return JSON.stringify(jsonData.value, null, 2)
})

const togglePreview = () => {
  showPreview.value = !showPreview.value
  copySuccess.value = false
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedJSON.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const updateKey = (obj, oldKey, newKey) => {
  if (oldKey === newKey || newKey === '') return
  
  // Verificar si la nueva clave ya existe
  if (obj.hasOwnProperty(newKey)) {
    alert('Esta clave ya existe')
    return
  }

  // Función recursiva para actualizar todas las claves coincidentes
  const updateKeysRecursively = (data) => {
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          if (item.hasOwnProperty(oldKey)) {
            item[newKey] = item[oldKey]
            delete item[oldKey]
          }
          updateKeysRecursively(item)
        }
      })
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object' && data[key] !== null) {
          if (data[key].hasOwnProperty(oldKey)) {
            data[key][newKey] = data[key][oldKey]
            delete data[key][oldKey]
          }
          updateKeysRecursively(data[key])
        }
      })
    }
  }

  // Actualizar la clave actual
  obj[newKey] = obj[oldKey]
  delete obj[oldKey]

  // Actualizar todas las claves coincidentes en el JSON
  updateKeysRecursively(jsonData.value)
}

const downloadJSON = () => {
  try {
    // Crear el contenido del archivo
    const jsonString = JSON.stringify(jsonData.value, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    
    // Crear URL temporal
    const url = window.URL.createObjectURL(blob)
    
    // Crear elemento de descarga
    const link = document.createElement('a')
    link.href = url
    
    // Generar nombre del archivo con fecha y hora
    const date = new Date()
    const fileName = `json_backup_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}.json`
    
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    
    // Simular clic y limpiar
    link.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al descargar el JSON:', error)
    alert('Error al descargar el archivo')
  }
}
</script>

<style scoped>
.json-display {
  padding: 20px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}

.json-item {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}
.key-input{
  color: darkcyan;
}

.json-header, .array-header, .item-header {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.json-header:hover, .array-header:hover, .item-header:hover {
  background-color: #e9e9e9;
}

.toggle-icon {
  font-size: 12px;
  color: #666;
  width: 16px;
  display: inline-block;
  text-align: center;
}

.json-property {
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 0;
}

.key {
  color: #881391;
  margin-right: 8px;
}

.value {
  color: #1a1aa6;
}

.json-array {
  margin: 10px 0;
  padding-left: 20px;
}

.array-list {
  list-style-type: none;
  margin: 0;
  padding-left: 20px;
}

.array-item {
  border-left: 2px solid #ccc;
  padding-left: 10px;
  margin: 10px 0;
}

.item-content {
  padding-left: 24px;
}

.array-item:hover {
  border-left-color: #007bff;
}

.value.boolean {
  color: #0000ff;
}

.value.number {
  color: #098658;
}

.value.string {
  color: #a31515;
}

.save-button {
  display: none;
}

input.value {
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 2px;
  width: auto;
  min-width: 50px;
}

input.value:hover {
  border-color: #ddd;
}

input.value:focus {
  border-color: #007bff;
  outline: none;
  background-color: white;
}

input[type="checkbox"].value {
  width: auto;
  margin: 0 0 0 8px;
  cursor: pointer;
}

input[type="number"].value {
  width: 80px;
}

.key-input {
  color: #881391;
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: 2px;
  width: auto;
  min-width: 50px;
}

.key-input:hover {
  border-color: #ddd;
}

.key-input:focus {
  border-color: #007bff;
  outline: none;
  background-color: white;
}

.separator {
  margin: 0 8px;
  color: #666;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error {
  padding: 20px;
  text-align: center;
  color: #dc3545;
  background-color: #ffe6e6;
  border-radius: 4px;
  margin-bottom: 15px;
}

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

.modal-body pre {
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.copy-button, .close-modal-button {
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

.button-group {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease;
}

.preview-button {
  background-color: #007bff;
  color: white;
}

.preview-button:hover {
  background-color: #0056b3;
}

.download-button {
  background-color: #28a745;
  color: white;
}

.download-button:hover {
  background-color: #218838;
}
</style>
