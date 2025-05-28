
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

// Colección reactiva
const notasSEO = JSON.parse(localStorage.getItem('notasSEO')) || [];

const LocalStorageCRUD = {
  bd: notasSEO,
  key: 'notasSEO',
  // Sincroniza con localStorage
  sync() {
    this.bd = JSON.parse(localStorage.getItem(this.key)) || [];
  },

  // Crear o reemplazar toda la colección
  createCollection(key, dataArray) {
    localStorage.setItem(key, JSON.stringify(dataArray));
  },

  // Leer toda la colección
  readCollection(keyLocal = "") {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  },

  // Leer toda la colección
  findById(id) {
    const collection = this.readCollection(this.key);
    const index = collection.findIndex(item => item.id == id);
    return index !== -1 ? collection[index] : null;
  },

  // Leer toda la colección
  findArticleByURL(url) {
    const collection = this.readCollection(this.key);
    for(var i in collection){
      const articlesOld = collection[i].dataOld;
      for(var j in articlesOld){
        if(articlesOld[j].enlace == url){
          return articlesOld[j];
        }
      }
    }
    return null;
  },

  // Agregar un nuevo objeto a la colección
  addToCollection(newItem) {
    const key = this.key;
    newItem["id"] = generateId();
    const collection = this.readCollection(key);
    collection.push(newItem);
    this.createCollection(key, collection);
    this.sync();
    return newItem["id"];
  },

  // Actualizar un objeto por su ID
  updateById(id, newData) {
    const key = this.key;
    const collection = this.readCollection(key);
    const index = collection.findIndex(item => item.id === id);
    if (index === -1) return false;

    collection[index] = { ...collection[index], ...newData };
    this.createCollection(key, collection);
    this.sync();
    return true;
  },

  // Eliminar objeto por ID dentro de la colección
  deleteById(id) {
    const key = this.key;
    const collection = this.readCollection(key);
    const filtered = collection.filter(item => item.id !== id);
    this.createCollection(key, filtered);
    this.sync();
    return true;
  },

  // Eliminar toda la colección
  deleteCollection() {
    const key = this.key;
    localStorage.removeItem(key);
    this.sync();
    return true;
  },

  // Verificar si existe la colección
  exists(key) {
    return localStorage.getItem(key) !== null;
  }
};

export { LocalStorageCRUD };
