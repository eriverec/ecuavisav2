import { ref, provide, inject } from 'vue';

const storeSymbol = Symbol();

export function createPaqueteStore() {
  const idPaquete = ref('651c9d012ff9fa09a75e6c16');

  const setIdPaquete = (newId) => {
    idPaquete.value = newId;
  };

  const store = {
    idPaquete,
    setIdPaquete
  };

  provide(storeSymbol, store);
}

export function usePaqueteStore() {
  const store = inject(storeSymbol);
  if (!store) {
    throw new Error('No paquete store provided');
  }
  return store;
}