import { ref } from 'vue';

// Generar un id unico
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Colección reactiva
const notasSEO = ref(JSON.parse(localStorage.getItem('notasSEO')) || []);

const LocalStorageCRUD = {
  collection: notasSEO,

  // Sincroniza con localStorage
  sync() {
    localStorage.setItem('notasSEO', JSON.stringify(notasSEO.value));
  },

  // Agregar un nuevo item
  add(newItem) {
    newItem.id = generateId();
    notasSEO.value.push(newItem);
    this.sync();
  },

  // Leer (opcional si ya usas `collection` directamente)
  read() {
    return notasSEO.value;
  },

  // Actualizar por ID
  updateById(id, newData) {
    const index = notasSEO.value.findIndex(item => item.id === id);
    if (index !== -1) {
      notasSEO.value[index] = { ...notasSEO.value[index], ...newData };
      this.sync();
    }
  },

  // Eliminar por ID
  deleteById(id) {
    notasSEO.value = notasSEO.value.filter(item => item.id !== id);
    this.sync();
  },

  // Eliminar todo
  deleteAll() {
    notasSEO.value = [];
    localStorage.removeItem('notasSEO');
  }
};

export { LocalStorageCRUD };
