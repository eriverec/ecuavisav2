<script setup>
import { ref, watch, computed } from 'vue';
import { loadRecords, saveRecords } from './utils/utils.js';

// Estados
const month = ref('');
const records = ref([]);
const newRecord = ref({ titulo: '', dia: '' });
const editingRecord = ref(null);
const toast = ref({ message: '', visible: false });
const loading = ref(false);
const changesMade = ref(false);
const dialogDelete = ref(false);
const itemToDelete = ref(null);


// Watcher para cargar records cuando cambia el mes
watch(month, async (newMonth) => {
  if (newMonth) {
    loading.value = true;
    records.value = await loadRecords(newMonth);
    loading.value = false;
    changesMade.value = false;
  } else {
    records.value = [];
  }
});

// Funciones
const showToast = (message) => {
  toast.value = { message, visible: true };
  setTimeout(() => {
    toast.value = { message: '', visible: false };
  }, 3000);
};

const addRecord = () => {
  if (!newRecord.value.titulo || !newRecord.value.dia) {
    showToast('Por favor complete todos los campos.');
    return;
  }
  const day = parseInt(newRecord.value.dia);
  if (isNaN(day) || day < 1 || day > 31) {
    showToast('El día debe ser un número entre 1 y 31.');
    return;
  }

  records.value.push({
    id: Date.now().toString(),
    titulo: newRecord.value.titulo,
    dia: day,
    mes: month.value,
    position: records.value.length + 1,
  });

  newRecord.value = { titulo: '', dia: '' };
  changesMade.value = true;
};

const removeRecord = (item) => {
  itemToDelete.value = item;
  dialogDelete.value = true;
};

const deleteItemConfirm = () => {
  records.value = records.value.filter(record => record.id !== itemToDelete.value.id)
    .map((record, index) => ({ ...record, position: index + 1 }));
  changesMade.value = true;
  closeDelete();
};

const closeDelete = () => {
  dialogDelete.value = false;
  itemToDelete.value = null;
};

const startEditing = (record) => {
  editingRecord.value = { ...record };
};

const cancelEditing = () => {
  editingRecord.value = null;
};

const updateRecord = () => {
  if (!editingRecord.value.titulo || !editingRecord.value.dia) {
    showToast('Por favor complete todos los campos.');
    return;
  }
  const day = parseInt(editingRecord.value.dia);
  if (isNaN(day) || day < 1 || day > 31) {
    showToast('El día debe ser un número entre 1 y 31.');
    return;
  }

  records.value = records.value.map(r => 
    r.id === editingRecord.value.id ? { ...editingRecord.value, dia: day } : r
  );
  editingRecord.value = null;
  changesMade.value = true;
};

const moveRecord = (item, direction) => {
  const index = records.value.findIndex(r => r.id === item.id);
  if (index === -1) return;

  const newIndex = direction === 'up' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= records.value.length) return;

  const recordsCopy = [...records.value];
  const [movedItem] = recordsCopy.splice(index, 1);
  recordsCopy.splice(newIndex, 0, movedItem);

  records.value = recordsCopy.map((record, i) => ({
    ...record,
    position: i + 1,
  }));

  changesMade.value = true;
};

const handleSave = async () => {
  loading.value = true;
  try {
    await saveRecords(month.value, records.value);
    showToast('Cambios guardados exitosamente');
    changesMade.value = false;
  } catch (error) {
    showToast(error.message);
  } finally {
    loading.value = false;
  }
};


const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

</script>

<template>
  <v-app>
    <v-main>
      <v-container class="mt-4">
        <v-card class="rounded-0" elevation="0">
          <v-card-title class="py-3">
            <v-row align="center" justify="space-between" class="flex-column flex-md-row">
              <v-col cols="12" md="auto">
                <h4 class="pb-0 mb-0 text-center text-md-left">Gestión de Agenda</h4>
              </v-col>
              <v-col cols="12" md="4" lg="3">
                <v-select
                  v-model="month"
                  :items="meses"
                  label="Seleccione un mes"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-select>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text class="pt-4 mb-4" v-if="month">
            <!-- Formulario para agregar -->
            <v-card class="mb-4">
              <v-card-title>
                <h5 class="text-subtitle-1 text-md-h5 text-wrap">
                  Añadir nuevo registro para 
                  <span class="text-primary d-block d-md-inline">{{ month }}</span>
                </h5>
              </v-card-title>
              <v-card-text>
                <v-row align="center">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newRecord.titulo"
                      label="Título de fecha"
                      placeholder="Ej: Día de la madre"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="newRecord.dia"
                      label="Día del mes"
                      placeholder="Ej: 14"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="auto" class="d-flex justify-start">
                    <v-btn color="primary" @click="addRecord" prepend-icon="mdi-plus">Añadir</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Lista de registros -->
            <v-card>
              <v-card-title class="d-flex justify-space-between align-center">
                <h5>Registros</h5>
                <v-btn 
                    color="success" 
                    @click="handleSave" 
                    :loading="loading" 
                    :disabled="!changesMade"
                    prepend-icon="mdi-content-save"
                >
                  <span class="d-none d-md-inline">Guardar Cambios</span>
                  <span class="d-md-none">Guardar</span>
                </v-btn>
              </v-card-title>
              <v-list>
                <div class="d-none d-md-flex px-4 py-2 font-weight-bold align-center">
                  <v-row class="flex-grow-1">
                    <v-col md="2" class="d-flex align-center">
                      Posición
                      <v-tooltip text="Usa las flechas para ordenar los items">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" size="16" class="ml-1">mdi-information-outline</v-icon>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col md="4">Título</v-col>
                    <v-col md="3">Fecha</v-col>
                    <v-col md="3" class="text-right">Acciones</v-col>
                  </v-row>
                </div>
                <v-list-item
                  v-for="(record, index) in records"
                  :key="record.id"
                  class="record-item"
                >
                  <div class="d-md-none">
                    <div v-if="editingRecord && editingRecord.id === record.id" class="pa-2">
                      <v-text-field v-model="editingRecord.titulo" density="compact" label="Título" class="mb-4"></v-text-field>
                      <v-text-field v-model="editingRecord.dia" type="number" density="compact" label="Día" class="mb-2"></v-text-field>
                      <div class="d-flex justify-end">
                        <v-btn icon="mdi-check" color="success" size="small" @click="updateRecord" class="mr-2"></v-btn>
                        <v-btn icon="mdi-close" color="secondary" size="small" @click="cancelEditing"></v-btn>
                      </div>
                    </div>
                    <div v-else>
                      <v-row>
                        <v-col cols="8">
                          <div class="font-weight-bold">{{ record.titulo }}</div>
                          <div class="text-caption">{{ record.dia }} de {{ record.mes }}</div>
                        </v-col>
                        <v-col cols="4" class="d-flex justify-end align-center">
                          <v-btn icon="mdi-pencil" color="primary" size="small" @click="startEditing(record)" class="mr-2"></v-btn>
                          <v-btn icon="mdi-delete" color="error" size="small" @click="removeRecord(record)"></v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </div>

                  <div class="d-none d-md-block">
                    <v-row align="center">
                      <v-col md="2" class="d-flex align-center">
                        <v-btn icon size="x-small" variant="text" @click="moveRecord(record, 'up')" :disabled="index === 0">
                          <v-icon>mdi-chevron-up</v-icon>
                        </v-btn>
                        <v-btn icon size="x-small" variant="text" @click="moveRecord(record, 'down')" :disabled="index === records.length - 1">
                          <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                        <span class="ml-2">{{ record.position }}</span>
                      </v-col>
                      <v-col md="4">
                        <template v-if="editingRecord && editingRecord.id === record.id">
                          <v-text-field v-model="editingRecord.titulo" density="compact" hide-details></v-text-field>
                        </template>
                        <template v-else>
                          {{ record.titulo }}
                        </template>
                      </v-col>
                      <v-col md="3">
                        <template v-if="editingRecord && editingRecord.id === record.id">
                          <v-text-field v-model="editingRecord.dia" type="number" density="compact" hide-details></v-text-field>
                        </template>
                        <template v-else>
                          {{ record.dia }} de {{ record.mes }}
                        </template>
                      </v-col>
                      <v-col md="3" class="text-md-right">
                        <template v-if="editingRecord && editingRecord.id === record.id">
                          <v-btn icon="mdi-check" color="success" size="small" @click="updateRecord" class="mr-2"></v-btn>
                          <v-btn icon="mdi-close" color="secondary" size="small" @click="cancelEditing"></v-btn>
                        </template>
                        <template v-else>
                          <v-btn icon="mdi-pencil" color="primary" size="small" @click="startEditing(record)" class="mr-2"></v-btn>
                          <v-btn icon="mdi-delete" color="error" size="small" @click="removeRecord(record)"></v-btn>
                        </template>
                      </v-col>
                    </v-row>
                  </div>
                </v-list-item>
                 <v-list-item v-if="records.length === 0 && !loading">
                    <v-list-item-title class="text-center text-grey">No hay registros para este mes.</v-list-item-title>
                </v-list-item>
                <v-list-item v-if="loading">
                     <v-progress-linear indeterminate></v-progress-linear>
                </v-list-item>
              </v-list>
            </v-card>

          </v-card-text>
          <v-card-text v-else class="text-center py-16">
            <v-icon size="48" color="grey">mdi-calendar-month-outline</v-icon>
            <p class="text-grey mt-4">Seleccione un mes para empezar a gestionar la agenda.</p>
          </v-card-text>

        </v-card>

        <v-snackbar v-model="toast.visible" :timeout="3000" location="top right">
          {{ toast.message }}
        </v-snackbar>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card class="rounded-lg pa-4">
            <v-card-title class="d-flex align-center">
              <v-icon color="warning" class="mr-2">mdi-alert-circle-outline</v-icon>
              <span class="text-h5">Confirmar Eliminación</span>
            </v-card-title>
            <v-card-text class="py-4">
              ¿Estás seguro de que deseas eliminar esta fecha? <br/>
              <small>Esta acción no se puede deshacer.</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="error" @click="deleteItemConfirm">Eliminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.record-item {
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 0;
}
</style>
