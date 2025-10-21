<script setup>
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';

const tasks = ref([]);
const team = ref([]);
const selectedUser = ref('Luis');
const draggedTask = ref(null);
const sourceColumn = ref(null);
const isAddTaskDialogVisible = ref(false);
const isEditTaskPanelVisible = ref(false);
const editingTask = ref(null);
const searchQuery = ref('');
const columnMenus = ref({});
const selectedColumn = ref('');
const isRenameDialogVisible = ref(false);
const isDeleteConfirmVisible = ref(false);
const newColumnName = ref('');
const isLoading = ref(false);
const toast = ref({
  show: false,
  message: '',
  color: 'success'
});
const kanbanBoard = ref(null);
const scrollIndicator = ref(null);
const isDragging = ref(false);

const newTask = reactive({
  Proyecto: '',
  Módulo: '',
  Tarea: '',
  Estado: 'Por hacer',
  Responsable: '',
  Descripcion: '',
  'Fecha de Entrega': '',
});

const editTask = reactive({
  Proyecto: '',
  Módulo: '',
  Tarea: '',
  Estado: 'Por hacer',
  Responsable: '',
  Descripcion: '',
  'Fecha de Entrega': '',
});

const columns = ref({
  'Por hacer': [],
  'En progreso': [],
  'Revisión': [],
  'Terminado': [],
  'Aplazado': [],
  'Cancelado': []
});

const showToast = (message, color = 'success') => {
  toast.value = {
    show: true,
    message,
    color
  };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const fetchTasks = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(`https://n8n.fastcloudbox.cloud/webhook/tareas-ecuavisa?panel=${selectedUser.value}`);
    const responseData = await response.json();

    // The actual data is in a stringified JSON inside the 'output' property.
    const outputString = responseData[0].output;
    const jsonString = outputString.substring(outputString.indexOf('{'), outputString.lastIndexOf('}') + 1);
    const innerData = JSON.parse(jsonString);

    tasks.value = innerData.data.tareas;
    if (innerData.data.equipo) {
      team.value = innerData.data.equipo;
    }
    organizeTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showToast('Error al cargar las tareas', 'error');
  } finally {
    isLoading.value = false;
  }
};

const organizeTasks = () => {
  // Clear all columns
  Object.keys(columns.value).forEach(col => {
    columns.value[col] = [];
  });
  
  tasks.value.forEach(task => {
    const status = task.Estado.trim();
    if (columns.value[status]) {
      columns.value[status].push(task);
    }
  });
  
  // Remove empty columns
  const columnsToShow = {};
  Object.keys(columns.value).forEach(col => {
    if (columns.value[col].length > 0) {
      columnsToShow[col] = columns.value[col];
    }
  });
  columns.value = columnsToShow;
  
  // Update scroll indicator after organizing tasks
  setTimeout(() => {
    updateScrollIndicator();
  }, 50);
};

const filteredColumns = computed(() => {
  if (!searchQuery.value.trim()) {
    return columns.value;
  }
  
  const filtered = {};
  Object.keys(columns.value).forEach(columnName => {
    filtered[columnName] = columns.value[columnName].filter(task => 
      task.Tarea.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.Proyecto.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.Módulo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.Responsable.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  return filtered;
});

const handleUserChange = () => {
  fetchTasks();
};

const onDragStart = (task, fromColumn) => {
  draggedTask.value = task;
  sourceColumn.value = fromColumn;
};

const handleAddTask = () => {
  if (columns.value[newTask.Estado]) {
    columns.value[newTask.Estado].push({ ...newTask });
    showToast('Tarea creada exitosamente', 'success');
  }
  isAddTaskDialogVisible.value = false;
  Object.assign(newTask, {
    Proyecto: '',
    Módulo: '',
    Tarea: '',
    Estado: 'Por hacer',
    Responsable: '',
    Descripcion: '',
    'Fecha de Entrega': '',
  });
};

const openEditTask = (task) => {
  editingTask.value = task;
  Object.assign(editTask, { ...task });
  isEditTaskPanelVisible.value = true;
};

const handleEditTask = () => {
  if (editingTask.value) {
    Object.assign(editingTask.value, editTask);
    organizeTasks();
    showToast('Tarea actualizada exitosamente', 'success');
  }
  closeEditPanel();
};

const deleteTask = () => {
  if (editingTask.value) {
    Object.keys(columns.value).forEach(columnName => {
      const taskIndex = columns.value[columnName].findIndex(t => t.Tarea === editingTask.value.Tarea);
      if (taskIndex > -1) {
        columns.value[columnName].splice(taskIndex, 1);
      }
    });
    showToast('Tarea eliminada exitosamente', 'success');
  }
  closeEditPanel();
};

const closeEditPanel = () => {
  isEditTaskPanelVisible.value = false;
  editingTask.value = null;
};

const getChipColor = (proyecto) => {
  const colors = {
    'UX': { bg: '#E8F5E8', text: '#2E7D32' },           // Light green bg, dark green text
    'Dashboard': { bg: '#E3F2FD', text: '#1565C0' },    // Light blue bg, dark blue text
    'App': { bg: '#F3E5F5', text: '#7B1FA2' },          // Light purple bg, dark purple text
    'Code Review': { bg: '#FFEBEE', text: '#C62828' },  // Light red bg, dark red text
    'Image': { bg: '#FFF3E0', text: '#E65100' },        // Light orange bg, dark orange text
    'Charts & Maps': { bg: '#E8EAF6', text: '#283593' }, // Light indigo bg, dark indigo text
    'automatizacion': { bg: '#F5F5F5', text: '#424242' }, // Light grey bg, dark grey text
    'Gestión de Proyectos': { bg: '#E1F5FE', text: '#0277BD' }, // Light cyan bg, dark cyan text
    'Talento Humano': { bg: '#FCE4EC', text: '#AD1457' } // Light pink bg, dark pink text
  };
  return colors[proyecto] || { bg: '#F5F5F5', text: '#424242' };
};

const getAvatarColor = (name) => {
  const colors = [
    '#f44336', // red
    '#e91e63', // pink
    '#9c27b0', // purple
    '#3f51b5', // indigo
    '#2196f3', // blue
    '#009688', // teal
    '#4caf50', // green
    '#ff9800'  // orange
  ];
  const index = name ? name.length % colors.length : 0;
  return colors[index];
};

const getInitials = (name) => {
  if (!name || name.trim() === '') return 'U';
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const openColumnMenu = (columnName) => {
  selectedColumn.value = columnName;
  // Close all other menus
  Object.keys(columnMenus.value).forEach(key => {
    columnMenus.value[key] = false;
  });
  // Open the specific menu
  columnMenus.value[columnName] = true;
};

const renameColumn = () => {
  newColumnName.value = selectedColumn.value;
  isRenameDialogVisible.value = true;
  columnMenus.value[selectedColumn.value] = false;
};

const confirmRename = () => {
  if (newColumnName.value.trim() && selectedColumn.value) {
    const oldName = selectedColumn.value;
    const newName = newColumnName.value.trim();
    
    // Update column structure
    columns.value[newName] = columns.value[oldName];
    delete columns.value[oldName];
    
    // Update tasks
    tasks.value.forEach(task => {
      if (task.Estado === oldName) {
        task.Estado = newName;
      }
    });
  }
  isRenameDialogVisible.value = false;
  newColumnName.value = '';
};

const deleteColumn = () => {
  isDeleteConfirmVisible.value = true;
  columnMenus.value[selectedColumn.value] = false;
};

const confirmDeleteColumn = () => {
  if (selectedColumn.value) {
    // Move tasks to 'Por hacer' before deleting column
    const tasksToMove = columns.value[selectedColumn.value] || [];
    tasksToMove.forEach(task => {
      task.Estado = 'Por hacer';
    });
    if (!columns.value['Por hacer']) {
      columns.value['Por hacer'] = [];
    }
    columns.value['Por hacer'].push(...tasksToMove);
    
    // Delete column
    delete columns.value[selectedColumn.value];
  }
  isDeleteConfirmVisible.value = false;
  selectedColumn.value = '';
};

const onDrop = (toColumn) => {
  if (!draggedTask.value || !sourceColumn.value) return;

  // Find and remove task from source column
  const taskIndex = columns.value[sourceColumn.value].findIndex(t => t.Tarea === draggedTask.value.Tarea);
  if (taskIndex > -1) {
    columns.value[sourceColumn.value].splice(taskIndex, 1);
  }

  // Add task to destination column and update its status
  draggedTask.value.Estado = toColumn;
  columns.value[toColumn].push(draggedTask.value);

  // Show success toast
  showToast(`Tarea movida a "${toColumn}" exitosamente`, 'success');

  // Reset drag state
  draggedTask.value = null;
  sourceColumn.value = null;
};

const updateScrollIndicator = () => {
  if (!kanbanBoard.value || !scrollIndicator.value) return;
  
  const board = kanbanBoard.value;
  const indicator = scrollIndicator.value;
  
  const scrollWidth = board.scrollWidth;
  const clientWidth = board.clientWidth;
  const scrollLeft = board.scrollLeft;
  
  // Calculate indicator width and position
  const indicatorWidth = (clientWidth / scrollWidth) * 100;
  const indicatorPosition = (scrollLeft / (scrollWidth - clientWidth)) * (100 - indicatorWidth);
  
  indicator.style.width = `${Math.max(indicatorWidth, 10)}%`;
  indicator.style.left = `${indicatorPosition}%`;
  
  // Show/hide indicator based on whether scrolling is needed
  const container = indicator.parentElement;
  if (scrollWidth > clientWidth) {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
};

const handleScrollIndicatorClick = (event) => {
  if (!kanbanBoard.value || !scrollIndicator.value) return;
  
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const containerWidth = rect.width;
  
  const board = kanbanBoard.value;
  const scrollWidth = board.scrollWidth;
  const clientWidth = board.clientWidth;
  const maxScroll = scrollWidth - clientWidth;
  
  // Calculate target scroll position
  const targetScrollLeft = (clickX / containerWidth) * maxScroll;
  
  // Smooth scroll to position
  board.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth'
  });
};

const handleKeyNavigation = (event) => {
  if (!kanbanBoard.value) return;
  
  const board = kanbanBoard.value;
  const scrollAmount = 300; // pixels to scroll
  
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      board.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      break;
    case 'ArrowRight':
      event.preventDefault();
      board.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      break;
    case 'Home':
      event.preventDefault();
      board.scrollTo({ left: 0, behavior: 'smooth' });
      break;
    case 'End':
      event.preventDefault();
      board.scrollTo({ left: board.scrollWidth, behavior: 'smooth' });
      break;
  }
};

const handleIndicatorMouseDown = (event) => {
  event.preventDefault();
  isDragging.value = true;
  document.addEventListener('mousemove', handleIndicatorMouseMove);
  document.addEventListener('mouseup', handleIndicatorMouseUp);
};

const handleIndicatorMouseMove = (event) => {
  if (!isDragging.value || !kanbanBoard.value || !scrollIndicator.value) return;
  
  const container = scrollIndicator.value.parentElement;
  const rect = container.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const containerWidth = rect.width;
  
  const board = kanbanBoard.value;
  const scrollWidth = board.scrollWidth;
  const clientWidth = board.clientWidth;
  const maxScroll = scrollWidth - clientWidth;
  
  // Calculate target scroll position
  const targetScrollLeft = Math.max(0, Math.min((mouseX / containerWidth) * maxScroll, maxScroll));
  
  // Direct scroll without animation for smooth dragging
  board.scrollLeft = targetScrollLeft;
};

const handleIndicatorMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleIndicatorMouseMove);
  document.removeEventListener('mouseup', handleIndicatorMouseUp);
};

onMounted(() => {
  fetchTasks();
  // Update scroll indicator after tasks are loaded
  setTimeout(() => {
    updateScrollIndicator();
  }, 100);
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyNavigation);
  
  // Add resize listener to update scroll indicator
  window.addEventListener('resize', updateScrollIndicator);
});

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyNavigation);
  window.removeEventListener('resize', updateScrollIndicator);
});
</script>

<template>
  <div class="kanban-container">
    <!-- Header -->
    <div class="kanban-header">
      <div class="header-left">
        <VTextField
          v-model="searchQuery"
          placeholder="Buscar tareas..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="search-field"
          clearable
        />
      </div>
      <div class="header-right">
        <VSelect
          v-model="selectedUser"
          :items="team.map(member => member.Responsables)"
          variant="outlined"
          density="compact"
          hide-details
          @update:modelValue="handleUserChange"
          class="user-select mr-3"
        />
        <VBtn 
          color="primary" 
          @click="isAddTaskDialogVisible = true"
          prepend-icon="mdi-plus"
          class="add-new-btn"
        >
          AGREGAR NUEVA
        </VBtn>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
      ></VProgressCircular>
      <p class="loading-text mt-4">Cargando tareas...</p>
    </div>

    <!-- Horizontal Scroll Indicator -->
    <div 
      v-if="!isLoading" 
      class="scroll-indicator-container"
      @click="handleScrollIndicatorClick"
      title="Haz clic para navegar o usa las flechas del teclado"
    >
      <div 
        class="scroll-indicator" 
        ref="scrollIndicator"
        @mousedown="handleIndicatorMouseDown"
        :class="{ 'dragging': isDragging }"
      ></div>
    </div>

    <!-- Kanban Board -->
    <div v-if="!isLoading" class="kanban-board" ref="kanbanBoard" @scroll="updateScrollIndicator">
      <div 
        v-for="(tasksInColumn, columnName) in filteredColumns" 
        :key="columnName" 
        class="kanban-column"
        @dragover.prevent 
        @drop="onDrop(columnName)"
      >
        <!-- Column Header -->
        <div class="column-header">
          <div class="column-title-wrapper">
            <VIcon 
              :icon="columnName === 'Por hacer' ? 'mdi-clock-outline' :
                    columnName === 'En progreso' ? 'mdi-progress-clock' : 
                    columnName === 'Revisión' ? 'mdi-eye-check' : 
                    columnName === 'Terminado' ? 'mdi-check-circle' :
                    columnName === 'Aplazado' ? 'mdi-pause-circle' :
                    'mdi-close-circle'"
              :color="columnName === 'Por hacer' ? 'blue' :
                     columnName === 'En progreso' ? 'orange' : 
                     columnName === 'Revisión' ? 'purple' : 
                     columnName === 'Terminado' ? 'green' :
                     columnName === 'Aplazado' ? 'amber' :
                     'red'"
              size="20"
              class="mr-2"
            />
            <h3 class="column-title">{{ columnName }}</h3>
          </div>
          <VMenu v-model="columnMenus[columnName]" :close-on-content-click="false">
            <template #activator="{ props }">
              <VBtn 
                v-bind="props"
                icon="mdi-dots-horizontal" 
                variant="text" 
                size="small"
                @click="openColumnMenu(columnName)"
              ></VBtn>
            </template>
            <VList>
              <VListItem @click="renameColumn">
                <template #prepend>
                  <VIcon icon="mdi-pencil" size="16"></VIcon>
                </template>
                <VListItemTitle>Renombrar</VListItemTitle>
              </VListItem>
              <VListItem @click="deleteColumn" class="text-error">
                <template #prepend>
                  <VIcon icon="mdi-delete" size="16"></VIcon>
                </template>
                <VListItemTitle>Eliminar</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>

        <!-- Tasks Container -->
        <div class="tasks-container">
          <VCard 
            v-for="task in tasksInColumn" 
            :key="task.Tarea" 
            class="task-card mb-3" 
            elevation="1"
            draggable="true" 
            @dragstart="onDragStart(task, columnName)"
            @click="openEditTask(task)"
          >
            <VCardText class="pa-3">
              <VChip 
                size="small"
                class="mb-2 custom-chip"
                :style="{ 
                  backgroundColor: getChipColor(task.Proyecto).bg, 
                  color: getChipColor(task.Proyecto).text 
                }"
              >
                {{ task.Proyecto }}
              </VChip>

              <h4 class="task-title mb-2">{{ task.Tarea }}</h4>
              <p class="task-module text-caption mb-3">{{ task.Módulo }}</p>

              <div class="task-meta d-flex align-center mb-3">
                <div class="d-flex align-center mr-4">
                  <VIcon icon="mdi-paperclip" size="14" class="mr-1 text-grey"></VIcon>
                  <span class="text-caption text-grey">0</span>
                </div>
                <div class="d-flex align-center">
                  <VIcon icon="mdi-comment-outline" size="14" class="mr-1 text-grey"></VIcon>
                  <span class="text-caption text-grey">0</span>
                </div>
              </div>

              <div class="task-footer d-flex justify-space-between align-center">
                <span class="text-caption text-grey-darken-1">{{ task['Fecha de Entrega'] }}</span>
                <div class="user-avatar">
                  <VAvatar 
                    :style="{ backgroundColor: getAvatarColor(task.Responsable) }"
                    size="28"
                    class="avatar-shadow"
                  >
                    <span class="text-white text-caption font-weight-bold">
                      {{ getInitials(task.Responsable) }}
                    </span>
                  </VAvatar>
                </div>
              </div>
            </VCardText>
          </VCard>
          
          <!-- Add New Item Text -->
          <div class="add-new-item-text" @click="isAddTaskDialogVisible = true">
            <VIcon icon="mdi-plus" size="16" class="mr-1"></VIcon>
            Agregar Nueva Tarea
          </div>
        </div>
      </div>
    </div>

    <!-- Add Task Dialog -->
    <VDialog v-model="isAddTaskDialogVisible" max-width="500px">
      <VCard class="dialog-card">
        <VCardTitle class="dialog-header pa-4">
          <VIcon icon="mdi-plus-circle" class="mr-2" color="white"></VIcon>
          <span class="text-h6">Agregar Nueva Tarea</span>
        </VCardTitle>
        <VCardText class="pa-4">
          <VTextField 
            v-model="newTask.Tarea" 
            label="Título"
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            class="mb-3"
          ></VTextField>
          
          <VSelect
            v-model="newTask.Proyecto"
            :items="['UX', 'Dashboard', 'App', 'Code Review', 'Image', 'Charts & Maps', 'Gestión de Proyectos', 'Talento Humano', 'automatizacion']"
            label="Etiqueta"
            variant="outlined"
            prepend-inner-icon="mdi-tag"
            class="mb-3"
          />
          
          <VTextField 
            v-model="newTask['Fecha de Entrega']" 
            label="Fecha de entrega"
            variant="outlined"
            prepend-inner-icon="mdi-calendar"
            class="mb-3"
          ></VTextField>
          
          <VSelect
            v-model="newTask.Responsable"
            :items="team.map(member => member.Responsables)"
            label="Asignado a"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            class="mb-3"
          />
          
          <VTextarea 
            v-model="newTask.Descripcion" 
            label="Comentario"
            variant="outlined"
            prepend-inner-icon="mdi-comment-text"
            rows="3"
          ></VTextarea>
        </VCardText>
        <VCardActions class="pa-4">
          <VSpacer></VSpacer>
          <VBtn variant="outlined" @click="isAddTaskDialogVisible = false">
            <VIcon icon="mdi-close" class="mr-1"></VIcon>
            Cancelar
          </VBtn>
          <VBtn color="primary" @click="handleAddTask">
            <VIcon icon="mdi-check" class="mr-1"></VIcon>
            Crear Tarea
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Rename Column Dialog -->
    <VDialog v-model="isRenameDialogVisible" max-width="400px">
      <VCard class="dialog-card">
        <VCardTitle class="dialog-header pa-4">
          <VIcon icon="mdi-pencil" class="mr-2" color="white"></VIcon>
          <span class="text-h6">Renombrar Columna</span>
        </VCardTitle>
        <VCardText class="pa-4">
          <VTextField
            v-model="newColumnName"
            label="Nombre de la Columna"
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            autofocus
          ></VTextField>
        </VCardText>
        <VCardActions class="pa-4">
          <VSpacer></VSpacer>
          <VBtn variant="outlined" @click="isRenameDialogVisible = false">
            <VIcon icon="mdi-close" class="mr-1"></VIcon>
            Cancelar
          </VBtn>
          <VBtn color="primary" @click="confirmRename">
            <VIcon icon="mdi-check" class="mr-1"></VIcon>
            Renombrar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Column Confirmation -->
    <VDialog v-model="isDeleteConfirmVisible" max-width="400px">
      <VCard class="dialog-card">
        <VCardTitle class="dialog-header pa-4" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
          <VIcon icon="mdi-alert" class="mr-2" color="white"></VIcon>
          <span class="text-h6">Eliminar Columna</span>
        </VCardTitle>
        <VCardText class="pa-4">
          <div class="text-center">
            <VIcon icon="mdi-delete-alert" size="48" color="error" class="mb-3"></VIcon>
            <p class="text-body-1 mb-2">¿Estás seguro de que quieres eliminar esta columna?</p>
            <p class="text-caption text-grey-darken-1">Todas las tareas se moverán a la columna "Por hacer".</p>
          </div>
        </VCardText>
        <VCardActions class="pa-4">
          <VSpacer></VSpacer>
          <VBtn variant="outlined" @click="isDeleteConfirmVisible = false">
            <VIcon icon="mdi-close" class="mr-1"></VIcon>
            Cancelar
          </VBtn>
          <VBtn color="error" @click="confirmDeleteColumn">
            <VIcon icon="mdi-delete" class="mr-1"></VIcon>
            Eliminar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Edit Task Side Panel -->
    <VNavigationDrawer
      v-model="isEditTaskPanelVisible"
      location="right"
      width="400"
      temporary
      class="edit-panel"
    >
      <div class="edit-panel-header">
        <h3 class="text-h6">Editar Tarea</h3>
        <VBtn 
          icon="mdi-close" 
          variant="text" 
          @click="closeEditPanel"
        ></VBtn>
      </div>

      <div class="edit-panel-content pa-4">
        <VTextField 
          v-model="editTask.Tarea" 
          label="Título"
          variant="outlined"
          class="mb-4"
        ></VTextField>
        
        <VTextField 
          v-model="editTask['Fecha de Entrega']" 
          label="Fecha de entrega"
          variant="outlined"
          class="mb-4"
        ></VTextField>
        
        <div class="mb-4">
          <label class="text-caption text-grey-darken-1 mb-2 d-block">Etiqueta</label>
          <VSelect
            v-model="editTask.Proyecto"
            :items="['UX', 'Dashboard', 'App', 'Code Review', 'Image', 'Charts & Maps', 'Gestión de Proyectos', 'Talento Humano', 'automatizacion']"
            variant="outlined"
            density="compact"
          />
        </div>
        
        <div class="mb-4">
          <label class="text-caption text-grey-darken-1 mb-2 d-block">Asignado a</label>
          <div class="d-flex align-center">
            <div class="user-avatar mr-2">
              <VAvatar 
                :style="{ backgroundColor: getAvatarColor(editTask.Responsable) }"
                size="28"
                class="avatar-shadow"
              >
                <span class="text-white text-caption font-weight-bold">
                  {{ getInitials(editTask.Responsable) }}
                </span>
              </VAvatar>
            </div>
            <VSelect
              v-model="editTask.Responsable"
              :items="team.map(member => member.Responsables)"
              variant="outlined"
              density="compact"
              hide-details
            />
          </div>
        </div>
        
        <div class="mb-4">
          <label class="text-caption text-grey-darken-1 mb-2 d-block">Comentario</label>
          <VTextarea 
            v-model="editTask.Descripcion" 
            variant="outlined"
            rows="4"
            hide-details
          ></VTextarea>
        </div>
      </div>

      <div class="edit-panel-actions pa-4">
        <VBtn 
          color="error" 
          variant="outlined"
          @click="deleteTask"
          class="mb-3 edit-delete-btn"
          block
        >
          Eliminar
        </VBtn>
        <VBtn 
          color="primary" 
          @click="handleEditTask"
          class="edit-update-btn"
          block
        >
          Actualizar
        </VBtn>
      </div>
    </VNavigationDrawer>

    <!-- Toast Notification -->
    <VSnackbar
      v-model="toast.show"
      :color="toast.color"
      location="top right"
      timeout="3000"
    >
      {{ toast.message }}
      <template #actions>
        <VBtn
          variant="text"
          @click="toast.show = false"
        >
          Cerrar
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<style lang="scss" scoped>
.kanban-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-background));
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-background), 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
  
  .loading-text {
    color: rgb(var(--v-theme-on-background));
    font-size: 1rem;
    font-weight: 500;
  }
}

.scroll-indicator-container {
  padding: 0 2rem;
  margin-bottom: 0.5rem;
  display: none; // Hidden by default, shown by JS when needed
  cursor: pointer;
  position: relative;
  height: 12px;
  background: rgba(var(--v-theme-outline-variant), 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(var(--v-theme-outline-variant), 0.3);
    
    .scroll-indicator {
      height: 6px;
      box-shadow: 0 2px 6px rgba(var(--v-theme-primary), 0.4);
    }
  }
  
  .scroll-indicator {
    height: 4px;
    background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), 0.8));
    border-radius: 3px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(var(--v-theme-primary), 0.3);
    min-width: 20px;
    cursor: grab;
    
    &:hover {
      background: rgb(var(--v-theme-primary));
      height: 6px;
    }
    
    &.dragging {
      cursor: grabbing;
      height: 6px;
      box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.5);
      background: rgb(var(--v-theme-primary));
      transition: none; // Disable transitions while dragging for smooth movement
    }
  }
}

.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
  
  .header-left {
    display: flex;
    align-items: center;
    
    .search-field {
      width: 300px;
      margin-left: 1rem;
      
      @media (max-width: 768px) {
        width: 200px;
        margin-left: 0;
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    
    .user-select {
      width: 200px;
      
      @media (max-width: 768px) {
        width: 120px;
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
}

.kanban-board {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 0; // Important for flex overflow
  
  // Custom scrollbar - always visible
  &::-webkit-scrollbar {
    height: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(var(--v-theme-surface-variant), 0.5);
    border-radius: 5px;
    margin: 0 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-outline), 0.8);
    border-radius: 5px;
    
    &:hover {
      background: rgb(var(--v-theme-on-surface-variant));
    }
  }
  
  // Touch scrolling for mobile
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  
  // Desktop specific - ensure scrolling works
  @media (min-width: 769px) {
    // Force scrollbar to always show when content overflows
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--v-theme-outline), 0.8) rgba(var(--v-theme-surface-variant), 0.5);
    
    // Add subtle scroll indicators
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 20px;
      pointer-events: none;
      z-index: 10;
    }
    
    &::before {
      left: 0;
      background: linear-gradient(to right, rgba(var(--v-theme-background), 0.8), transparent);
    }
    
    &::after {
      right: 0;
      background: linear-gradient(to left, rgba(var(--v-theme-background), 0.8), transparent);
    }
  }
  
  // Mobile specific
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
    
    // Show scrollbar on mobile for better UX
    &::-webkit-scrollbar {
      height: 6px;
      display: block;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(var(--v-theme-surface-variant), 0.5);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(var(--v-theme-outline), 0.7);
      border-radius: 3px;
    }
    
    // Ensure horizontal scrolling works
    scroll-snap-type: x mandatory;
  }
}

.kanban-column {
  min-width: 300px;
  width: 300px;
  background: transparent;
  border-radius: 8px;
  padding: 1rem;
  flex-shrink: 0;
  flex-grow: 0;
  
  // Mobile responsive
  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 280px;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
  
  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    .column-title {
      font-size: 1rem;
      font-weight: 700;
      color: rgb(var(--v-theme-on-surface));
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  .add-item-btn {
    border: 2px dashed #d1d5db;
    color: #6b7280;
    text-transform: none;
    font-weight: 500;
    
    &:hover {
      border-color: #9ca3af;
      background-color: rgba(0, 0, 0, 0.04);
    }
  }
  
  .tasks-container {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .column-title-wrapper {
    display: flex;
    align-items: center;
  }
}

.task-card {
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-outline-variant), 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .task-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(var(--v-theme-on-surface));
    line-height: 1.25;
    margin: 0;
  }
  
  .task-module {
    font-size: 0.75rem;
    color: rgb(var(--v-theme-on-surface));
    margin: 0;
    opacity: 0.8;
    font-weight: 500;
  }
  
  .task-meta {
    gap: 0;
  }
  
  .task-footer {
    margin-top: 0.5rem;
  }
}

// Custom Chip Styles
.custom-chip {
  border-radius: 6px !important;
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none !important;
}

// Avatar Styles
.user-avatar {
  .avatar-shadow {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.9);
    transition: all 0.2s ease;
    position: relative;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      transform: translateY(-1px);
    }
    
    // Ensure text is always visible
    span {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      font-weight: 700 !important;
      font-size: 0.7rem !important;
      line-height: 1;
    }
  }
}

// Edit Panel Styles
.edit-panel {
  .edit-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
    background: rgb(var(--v-theme-surface));
    
    h3 {
      margin: 0;
      font-weight: 600;
    }
  }
  
  .edit-panel-content {
    flex: 1;
    overflow-y: auto;
  }
  
  .edit-panel-actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid rgb(var(--v-theme-outline-variant));
    background: rgb(var(--v-theme-surface));
    
    .edit-delete-btn {
      border: 1px solid rgb(var(--v-theme-error)) !important;
      background-color: transparent !important;
      color: rgb(var(--v-theme-error)) !important;
      
      &:hover {
        background-color: rgba(var(--v-theme-error), 0.08) !important;
        border-color: rgb(var(--v-theme-error)) !important;
      }
    }
    
    .edit-update-btn {
      background-color: rgb(var(--v-theme-primary)) !important;
      color: rgb(var(--v-theme-on-primary)) !important;
      border: 1px solid rgb(var(--v-theme-primary)) !important;
      
      &:hover {
        background-color: rgba(var(--v-theme-primary), 0.9) !important;
        border-color: rgb(var(--v-theme-primary)) !important;
      }
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .kanban-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    
    .header-left,
    .header-right {
      width: 100%;
      justify-content: center;
    }
    
    .search-field {
      width: 100%;
      margin-left: 0;
    }
    
    .user-select {
      width: 100%;
    }
  }
}


// Add New Item Text
.add-new-item-text {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem;
  color: rgb(111 109 109);
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: rgba(var(--v-theme-on-surface), 0.04);
    color: rgb(var(--v-theme-on-surface));
  }
}

// Header Styles
.add-new-btn {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  
  &:hover {
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  }
}

// Dialog Styles
.dialog-card {
  border-radius: 12px;
  overflow: hidden;
  
  .dialog-header {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
  }
}
</style>
