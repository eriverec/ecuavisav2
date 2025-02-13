<template>
  <div class="container">
    <h1>Editor JSON Interactivo</h1>

    <div class="controls">
      <button @click="fetchData">Cargar Datos</button>
      <button @click="sendData">Guardar Estructura</button>
    </div>

    <div v-if="editableData.length">
      <h2>Editar JSON</h2>
      <draggable v-model="editableData" item-key="id" class="json-list">
        <template #item="{ element, index }">
          <div class="json-item">
            <span @click="toggleExpand(index)">
              <i v-if="isObject(element.value)" class="arrow" :class="{ expanded: expanded[index] }"></i>
              <input v-model="element.key" class="key-input" />
            </span>

            <template v-if="isObject(element.value)">
              <button class="delete-btn" @click="deleteItem(editableData, index)">🗑</button>
              <div v-if="expanded[index]" class="nested">
                <draggable v-model="element.value" item-key="id" class="json-list">
                  <template #item="{ element: child, index: childIndex }">
                    <div class="json-item">
                      <input v-model="child.key" class="key-input" />
                      <input v-model="child.value" class="value-input" />
                      <button class="delete-btn" @click="deleteItem(element.value, childIndex)">🗑</button>
                    </div>
                  </template>
                </draggable>
              </div>
            </template>

            <template v-else>
              <input v-model="element.value" class="value-input" />
              <button class="delete-btn" @click="deleteItem(editableData, index)">🗑</button>
            </template>
          </div>
        </template>
      </draggable>
    </div>

    <h2>Vista Previa del JSON</h2>
    <pre>{{ JSON.stringify(reconstructJson(editableData), null, 2) }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Draggable from "vuedraggable";

const editableData = ref([]);
const expanded = ref({});

const fetchData = async () => {
  try {
    const response = await fetch("https://services.ecuavisa.com/gestor/competencias/mirrordt.php");
    const json = await response.json();
    editableData.value = transformJsonToEditable(json);
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
};

const sendData = async () => {
  const finalData = reconstructJson(editableData.value);
  try {
    await fetch("https://tu-endpoint-final.com/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalData),
    });
    alert("Datos enviados con éxito");
  } catch (error) {
    console.error("Error enviando datos:", error);
  }
};

const transformJsonToEditable = (json) => {
  const parseObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item, index) => ({
        id: Math.random(),
        key: index.toString(),
        value: isObject(item) ? parseObject(item) : item,
      }));
    } else if (isObject(obj)) {
      return Object.entries(obj).map(([key, value]) => ({
        id: Math.random(),
        key,
        value: isObject(value) ? parseObject(value) : value,
      }));
    }
    return obj;
  };
  return parseObject(json);
};

const reconstructJson = (list) => {
  if (Array.isArray(list)) {
    return list.map(({ value }) => (isObject(value) ? reconstructJson(value) : value));
  } else {
    const obj = {};
    list.forEach(({ key, value }) => {
      obj[key] = isObject(value) ? reconstructJson(value) : value;
    });
    return obj;
  }
};

const isObject = (val) => typeof val === "object" && val !== null;

const toggleExpand = (index) => {
  expanded.value[index] = !expanded.value[index];
};

const deleteItem = (array, index) => {
  array.splice(index, 1);
};

onMounted(fetchData);
</script>

<style>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}
.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.json-list {
  padding-left: 20px;
}
.json-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  gap: 5px;
}
.key-input, .value-input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.arrow {
  cursor: pointer;
  margin-right: 5px;
}
.expanded::before {
  content: "▼";
}
.nested {
  margin-left: 20px;
}
.delete-btn {
  background: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
}
pre {
  background: #222;
  color: #0f0;
  padding: 10px;
  overflow: auto;
  max-height: 300px;
}
</style>
