<script setup>
import { ref, onMounted, reactive, computed } from 'vue';

// --- CONSTANTS ---
const SESSION_STORAGE_KEY = "kanban-user-session";
const API_URL_GET = "https://n8n.fastcloudbox.cloud/webhook/tareas-ecuavisa-v2";
const API_URL_POST = "https://n8n.fastcloudbox.cloud/webhook/tareas-gestion-v2";

// --- STATE ---
const activeColumnMenu = ref(null);
const state = reactive({
  columns: [],
  currentUser: null,
  currentUserRole: null,
  filters: { search: "", project: "", assignee: "", dateFrom: "", dateTo: "" },
  team: [],
  projects: [],
  rawTasks: [],
  modules: [],
});

const isLoading = ref(true);
const isUserSelectionModalOpen = ref(false);
const isColumnModalOpen = ref(false);
const isTaskModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const isProjectsModalOpen = ref(false);
const isTeamModalOpen = ref(false);
const isModulesModalOpen = ref(false);
const isProjectFormModalOpen = ref(false);
const isTeamFormModalOpen = ref(false);
const isModuleFormModalOpen = ref(false);

const editingColumn = ref(null);
const editingTask = ref(null);
const itemToDelete = ref(null);
const draggedTask = ref(null);
const dragOverColumn = ref(null);

const taskForm = reactive({ id: null, title: '', description: '', project: '', module: '', status: 'Por hacer', assignee: '', endDate: '' });
const columnForm = reactive({ id: null, name: '' });

// Forms for modals
const projectForm = reactive({ id: null, name: '', description: '', modules: [] });
const moduleForm = reactive({ id: null, name: '' });
const teamForm = reactive({ id: null, name: '', roles: '', email: '', data: '' });

// Editing items
const editingProject = ref(null);
const editingModule = ref(null);
const editingTeamMember = ref(null);

// Delete confirmation
const deleteType = ref('');
const deleteItem = ref(null);

// Temp selection
const selectedModule = ref('');

// Snackbar for notifications
const snackbar = reactive({ show: false, message: '', color: 'success' });

// --- COMPUTED ---
const filteredBoard = computed(() => {
  const { search, project, assignee, dateFrom, dateTo } = state.filters;
  let tasks = [...state.rawTasks];

  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    tasks = tasks.filter(task =>
      (task.Tarea || '').toLowerCase().includes(lowerCaseSearch) ||
      (task.Proyecto || '').toLowerCase().includes(lowerCaseSearch) ||
      (task.Responsable || '').toLowerCase().includes(lowerCaseSearch)
    );
  }
  if (project) tasks = tasks.filter(task => task.Proyecto === project);
  if (assignee) tasks = tasks.filter(task => task.Responsable === assignee);
  if (dateFrom) tasks = tasks.filter(task => task['Fecha de Entrega'] && new Date(task['Fecha de Entrega']) >= new Date(dateFrom));
  if (dateTo) tasks = tasks.filter(task => task['Fecha de Entrega'] && new Date(task['Fecha de Entrega']) <= new Date(dateTo));
  
  return buildColumnsFromTasks(tasks, state.columns.map(c => ({ Etiqueta: c.name })));
});

// --- HELPERS ---
const createInitials = (name) => {
  if (!name) return '?';
  const words = name.trim().split(' ');
  if (words.length > 1) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

// --- DATA PROCESSING ---
const buildColumnsFromTasks = (tasks = [], columnMappings = []) => {
  const columnMap = new Map();
  const defaultColumns = ['Por hacer', 'En progreso', 'Revisión', 'Terminado', 'Aplazado', 'Cancelado'];
  
  // Obtener estados personalizados del API
  const customColumns = Array.isArray(columnMappings) 
    ? columnMappings.map(m => m.Etiqueta).filter(Boolean) 
    : [];
  
  const allColumnNames = [...new Set([...defaultColumns, ...customColumns])];

  allColumnNames.forEach(name => {
      const key = (name || 'sin estado').toLowerCase();
      if (!columnMap.has(key)) {
          columnMap.set(key, { id: `col-${key.replace(/\s+/g, '-')}`, name, tasks: [] });
      }
  });

  tasks.forEach(task => {
    const status = task.Estado || "Sin estado";
    const key = status.toLowerCase();
    const taskData = {
        id: task.row_number,
        title: task.Tarea,
        project: task.Proyecto,
        module: task.Módulo,
        assignees: [task.Responsable].filter(Boolean),
        description: task.Descripcion,
        endDate: task['Fecha de Entrega'],
        status: status,
      };
    if (columnMap.has(key)) {
      columnMap.get(key).tasks.push(taskData);
    } else {
      // Si la tarea tiene un estado que no está en el mapa, crear una columna para él
      if (!columnMap.has(key)) {
        columnMap.set(key, { id: `col-${key.replace(/\s+/g, '-')}`, name: status, tasks: [] });
      }
      columnMap.get(key).tasks.push(taskData);
    }
  });

  return Array.from(columnMap.values());
};

// --- API & SESSION ---
const fetchInitialData = async () => {
  isLoading.value = true;
  const user = getCurrentUser();
  if (!user) {
    isUserSelectionModalOpen.value = true;
    isLoading.value = false;
    try {
        const response = await fetch(`${API_URL_GET}?panel=Luis`);
        const payload = await response.json();
        state.team = (payload[0]?.data?.equipo || []).map(member => ({
            id: `member-${(member.Responsables || '').trim()}`,
            name: (member.Responsables || '').trim(),
            role: member.roles || ''
        }));
    } catch (error) { console.error("Failed to fetch team for user selection:", error); }
    return;
  }

  try {
    const response = await fetch(`${API_URL_GET}?panel=${encodeURIComponent(user)}`);
    const payload = await response.json();
    const data = payload[0]?.data || {};
    state.currentUser = payload[0]?.user_info?.usuario || user;
    state.currentUserRole = payload[0]?.user_info?.rol || 'dev';
    state.team = (data.equipo || []).map(m => ({ id: `member-${m.Responsables}`, name: m.Responsables, role: m.roles, Correo: m.Correo, Responsables: m.Responsables, Data: m.Data, row_number: m.row_number }));
    state.projects = data.proyectos || [];
    state.modules = data.modulos || [];
    state.rawTasks = data.tareas || [];
    state.columns = buildColumnsFromTasks(state.rawTasks, data.estado_mapeo);
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
  } finally {
    isLoading.value = false;
  }
};

const getCurrentUser = () => {
    try {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY);
        return stored ? JSON.parse(stored).username : null;
    } catch (e) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
    }
};

const setCurrentUser = (username) => {
    const session = { username, timestamp: Date.now() };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const handleUserSelected = (username) => {
  if (!username) return;
  setCurrentUser(username);
  isUserSelectionModalOpen.value = false;
  fetchInitialData();
};

const clearFilters = () => {
  state.filters.search = ""; state.filters.project = ""; state.filters.assignee = "";
  state.filters.dateFrom = ""; state.filters.dateTo = "";
};

// --- DRAG & DROP ---
const onDragStart = (task, fromColumn, event) => {
  draggedTask.value = { task, fromColumnId: fromColumn.id };
  // Agregar clase visual al elemento arrastrado
  if (event.target) {
    event.target.style.opacity = '0.5';
  }
};

const onDragEnd = (event) => {
  // Restaurar la opacidad cuando termine el drag
  if (event.target) {
    event.target.style.opacity = '1';
  }
  dragOverColumn.value = null;
};

const onDragOver = (column, event) => {
  event.preventDefault();
  dragOverColumn.value = column.id;
};

const onDragLeave = () => {
  dragOverColumn.value = null;
};

const onDrop = async (toColumn) => {
  dragOverColumn.value = null;
  if (!draggedTask.value) return;
  const { task, fromColumnId } = draggedTask.value;
  if (fromColumnId === toColumn.id) {
    draggedTask.value = null;
    return;
  }

  const originalStatus = task.status;
  task.status = toColumn.name;

  try {
    const response = await fetch(API_URL_POST, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: state.currentUser, hoja: 'Tarea', operacion: 'ACTUALIZAR',
        identificador: task.id, data: { Estado: toColumn.name }
      }),
    });
    if (!response.ok) throw new Error('API update failed');
    await fetchInitialData();
  } catch (error) {
    task.status = originalStatus;
    console.error('Error updating task:', error);
  } finally {
    draggedTask.value = null;
  }
};

// --- MODAL CONTROLS & HANDLERS ---
const openProjectsModal = () => isProjectsModalOpen.value = true;
const openTeamModal = () => isTeamModalOpen.value = true;
const openModulesModal = () => isModulesModalOpen.value = true;
const openColumnMenu = (columnId) => activeColumnMenu.value = activeColumnMenu.value === columnId ? null : columnId;

const openColumnModal = (column = null) => {
  editingColumn.value = column;
  columnForm.id = column ? column.id : null;
  columnForm.name = column ? column.name : '';
  isColumnModalOpen.value = true;
};

const closeColumnModal = () => {
  isColumnModalOpen.value = false;
  editingColumn.value = null;
  columnForm.id = null;
  columnForm.name = '';
};

const openTaskModal = (task = null, defaultStatus = 'Por hacer') => {
  editingTask.value = task;
  taskForm.id = task ? task.id : null;
  taskForm.title = task ? task.title : '';
  taskForm.description = task ? task.description : '';
  taskForm.project = task ? task.project : '';
  taskForm.module = task ? task.module : '';
  taskForm.status = task ? task.status : defaultStatus;
  taskForm.assignee = task && task.assignees.length > 0 ? task.assignees[0] : '';
  taskForm.endDate = task ? task.endDate : '';
  isTaskModalOpen.value = true;
};

const closeTaskModal = () => {
  isTaskModalOpen.value = false;
  editingTask.value = null;
  taskForm.id = null;
  taskForm.title = '';
  taskForm.description = '';
  taskForm.project = '';
  taskForm.module = '';
  taskForm.status = 'Por hacer';
  taskForm.assignee = '';
  taskForm.endDate = '';
};

const handleTaskSave = async () => {
  try {
    const isEditing = !!editingTask.value;
    const operation = isEditing ? 'ACTUALIZAR' : 'CREAR';
    
    const data = {
      Proyecto: taskForm.project,
      Módulo: taskForm.module,
      Tarea: taskForm.title,
      Estado: taskForm.status,
      Responsable: taskForm.assignee,
      Descripcion: taskForm.description,
      'Fecha de Entrega': taskForm.endDate
    };

    const body = {
      usuario: state.currentUser,
      hoja: 'Tarea',
      operacion: operation,
      data
    };

    if (isEditing && editingTask.value.id) {
      body.identificador = editingTask.value.id;
    }

    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Error al guardar tarea');
    
    await fetchInitialData();
    isTaskModalOpen.value = false;
    editingTask.value = null;
    showSnackbar(`Tarea ${isEditing ? 'actualizada' : 'creada'} exitosamente`, 'success');
  } catch (error) {
    console.error('Error saving task:', error);
    showSnackbar('Error al guardar la tarea', 'error');
  }
};

const handleColumnSave = async () => {
  try {
    const isEditing = !!editingColumn.value;
    const operation = isEditing ? 'ACTUALIZAR' : 'CREAR';
    
    const data = {
      Etiqueta: columnForm.name,
      Descripción: ''
    };
    
    if (isEditing && editingColumn.value.name) {
      data.EtiquetaOld = editingColumn.value.name;
    }

    const body = {
      usuario: state.currentUser,
      hoja: 'Estado',
      operacion: operation,
      data
    };

    if (editingColumn.value && editingColumn.value.id) {
      body.identificador = editingColumn.value.id;
    }

    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Error al guardar estado');
    
    await fetchInitialData();
    closeColumnModal();
    showSnackbar(`Estado ${isEditing ? 'actualizado' : 'creado'} exitosamente`, 'success');
  } catch (error) {
    console.error('Error saving column:', error);
    showSnackbar('Error al guardar el estado', 'error');
  }
};

const handleDelete = async () => {
    if (!itemToDelete.value) return;
    const { type, item } = itemToDelete.value;
    const hoja = type === 'task' ? 'Tareas' : 'Estado';
    try {
        await fetch(API_URL_POST, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario: state.currentUser, hoja, operacion: 'ELIMINAR', identificador: item.id,
            }),
        });
        await fetchInitialData();
        isConfirmModalOpen.value = false;
        itemToDelete.value = null;
    } catch (error) {
        console.error(`Error deleting ${type}:`, error);
    }
};

// --- PROJECTS HANDLERS ---
const openProjectFormModal = (project = null) => {
  editingProject.value = project;
  projectForm.id = project ? project.row_number : null;
  projectForm.name = project ? project.Proyectos : '';
  projectForm.description = project ? project.Descripción : '';
  projectForm.modules = project && project.Módulos ? project.Módulos.split(',').map(m => m.trim()).filter(Boolean) : [];
  isProjectFormModalOpen.value = true;
};

const handleProjectSave = async () => {
  try {
    const isEditing = !!editingProject.value;
    const operation = isEditing ? 'ACTUALIZAR' : 'CREAR';
    const data = {
      Proyectos: projectForm.name,
      Descripción: projectForm.description,
      Módulos: projectForm.modules.join(', ')
    };
    
    if (isEditing && editingProject.value.Proyectos) {
      data.ProyectosOld = editingProject.value.Proyectos;
    }

    const body = {
      usuario: state.currentUser,
      hoja: 'Proyectos',
      operacion: operation,
      data
    };

    if (projectForm.id) {
      body.identificador = parseInt(projectForm.id);
    }

    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Error al guardar proyecto');
    
    await fetchInitialData();
    isProjectFormModalOpen.value = false;
    editingProject.value = null;
    showSnackbar(`Proyecto ${isEditing ? 'actualizado' : 'creado'} exitosamente`, 'success');
  } catch (error) {
    console.error('Error saving project:', error);
    showSnackbar('Error al guardar el proyecto', 'error');
  }
};

const openProjectDeleteModal = (project) => {
  deleteType.value = 'project';
  deleteItem.value = project;
  isConfirmModalOpen.value = true;
};

const handleProjectDelete = async () => {
  try {
    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: state.currentUser,
        hoja: 'Proyectos',
        operacion: 'ELIMINAR',
        identificador: deleteItem.value.Proyectos
      })
    });

    if (!response.ok) throw new Error('Error al eliminar proyecto');
    
    await fetchInitialData();
    isConfirmModalOpen.value = false;
    showSnackbar('Proyecto eliminado exitosamente', 'success');
  } catch (error) {
    console.error('Error deleting project:', error);
    showSnackbar('Error al eliminar el proyecto', 'error');
  }
};

const addModuleToProject = (moduleName) => {
  if (moduleName && !projectForm.modules.includes(moduleName)) {
    projectForm.modules.push(moduleName);
  }
};

const removeModuleFromProject = (moduleName) => {
  const index = projectForm.modules.indexOf(moduleName);
  if (index > -1) {
    projectForm.modules.splice(index, 1);
  }
};

const openModuleFormModal = (module = null) => {
  editingModule.value = module;
  moduleForm.id = module ? module.row_number : null;
  moduleForm.name = module ? module.Nombre : '';
  isModuleFormModalOpen.value = true;
};

const handleModuleSave = async () => {
  try {
    const isEditing = !!editingModule.value;
    const operation = isEditing ? 'ACTUALIZAR' : 'CREAR';
    const data = { Nombre: moduleForm.name };
    
    if (isEditing && editingModule.value.Nombre) {
      data.NombreOld = editingModule.value.Nombre;
    }

    const body = {
      usuario: state.currentUser,
      hoja: 'Modulos',
      operacion: operation,
      data
    };

    if (moduleForm.id) {
      body.identificador = parseInt(moduleForm.id);
    }

    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Error al guardar módulo');
    
    await fetchInitialData();
    isModuleFormModalOpen.value = false;
    editingModule.value = null;
    showSnackbar(`Módulo ${isEditing ? 'actualizado' : 'creado'} exitosamente`, 'success');
  } catch (error) {
    console.error('Error saving module:', error);
    showSnackbar('Error al guardar el módulo', 'error');
  }
};

const openModuleDeleteModal = (module) => {
  deleteType.value = 'module';
  deleteItem.value = module;
  isConfirmModalOpen.value = true;
};

const handleModuleDelete = async () => {
  try {
    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: state.currentUser,
        hoja: 'Modulos',
        operacion: 'ELIMINAR',
        identificador: deleteItem.value.Nombre
      })
    });

    if (!response.ok) throw new Error('Error al eliminar módulo');
    
    await fetchInitialData();
    isConfirmModalOpen.value = false;
    showSnackbar('Módulo eliminado exitosamente', 'success');
  } catch (error) {
    console.error('Error deleting module:', error);
    showSnackbar('Error al eliminar el módulo', 'error');
  }
};

const openTeamFormModal = (member = null) => {
  editingTeamMember.value = member;
  teamForm.id = member ? member.row_number : null;
  teamForm.name = member ? member.Responsables : '';
  teamForm.roles = member ? member.roles : '';
  teamForm.email = member ? member.Correo : '';
  teamForm.data = member ? member.Data : '';
  isTeamFormModalOpen.value = true;
};

const handleTeamSave = async () => {
  try {
    const isEditing = !!editingTeamMember.value;
    const operation = isEditing ? 'ACTUALIZAR' : 'CREAR';
    const data = {
      Responsables: teamForm.name,
      roles: teamForm.roles,
      Correo: teamForm.email,
      Data: teamForm.data
    };
    
    if (isEditing && editingTeamMember.value.Responsables) {
      data.ResponsablesOld = editingTeamMember.value.Responsables;
    }

    const body = {
      usuario: state.currentUser,
      hoja: 'Equipo',
      operacion: operation,
      data
    };

    if (teamForm.id) {
      body.identificador = parseInt(teamForm.id);
    }

    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) throw new Error('Error al guardar miembro');
    
    await fetchInitialData();
    isTeamFormModalOpen.value = false;
    editingTeamMember.value = null;
    showSnackbar(`Miembro ${isEditing ? 'actualizado' : 'creado'} exitosamente`, 'success');
  } catch (error) {
    console.error('Error saving team member:', error);
    showSnackbar('Error al guardar el miembro', 'error');
  }
};

const openTeamDeleteModal = (member) => {
  deleteType.value = 'team';
  deleteItem.value = member;
  isConfirmModalOpen.value = true;
};

const handleTeamDelete = async () => {
  try {
    const response = await fetch(API_URL_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: state.currentUser,
        hoja: 'Equipo',
        operacion: 'ELIMINAR',
        identificador: deleteItem.value.Responsables
      })
    });

    if (!response.ok) throw new Error('Error al eliminar miembro');
    
    await fetchInitialData();
    isConfirmModalOpen.value = false;
    showSnackbar('Miembro eliminado exitosamente', 'success');
  } catch (error) {
    console.error('Error deleting team member:', error);
    showSnackbar('Error al eliminar el miembro', 'error');
  }
};

// --- UNIFIED DELETE HANDLER ---
const handleConfirmDelete = async () => {
  if (deleteType.value === 'project') {
    await handleProjectDelete();
  } else if (deleteType.value === 'module') {
    await handleModuleDelete();
  } else if (deleteType.value === 'team') {
    await handleTeamDelete();
  } else {
    await handleDelete();
  }
};

// --- SNACKBAR ---
const showSnackbar = (message, color = 'success') => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

onMounted(fetchInitialData);
</script>

<template>
  <div class="pa-4">
    <!-- Header -->
    <VRow align="center" class="mb-3">
      <VCol cols="12" md="6" class="d-flex align-center">
        <VAvatar color="primary" rounded size="40" class="me-3"><VIcon size="24" icon="mdi-view-dashboard-outline" /></VAvatar>
        <div><h1 class="text-h6 font-weight-bold">Roadmap de Tareas</h1></div>
      </VCol>
      <VCol cols="12" md="6" class="d-flex gap-2 justify-end align-center">
         <div v-if="state.currentUser" class="d-flex align-center gap-2 pa-2 rounded-lg" style="background-color: #f8f8f8;">
            <VAvatar color="primary" size="32"><span class="white--text text-caption">{{ createInitials(state.currentUser) }}</span></VAvatar>
            <div>
                <div class="font-weight-medium text-body-2">{{ state.currentUser }}</div>
                <VChip size="x-small" :color="state.currentUserRole && state.currentUserRole.includes('manager') ? 'purple' : 'blue'" label>{{ state.currentUserRole || 'dev' }}</VChip>
            </div>
         </div>
         <VBtn color="primary" size="small" @click="openColumnModal()"><VIcon icon="mdi-plus" size="small" class="me-1" />Nuevo Estado</VBtn>
      </VCol>
    </VRow>

    <!-- Navigation & Filters -->
    <VCard class="mb-3 pa-3">
      <VRow>
        <VCol cols="12" class="d-flex gap-2 flex-wrap">
            <VBtn color="primary" variant="tonal" size="small" @click="openProjectsModal"><VIcon icon="mdi-folder-multiple-outline" size="small" class="me-1"/>Proyectos</VBtn>
            <VBtn color="secondary" variant="tonal" size="small" @click="openTeamModal"><VIcon icon="mdi-account-group-outline" size="small" class="me-1"/>Equipo</VBtn>
            <VBtn color="info" variant="tonal" size="small" @click="openModulesModal"><VIcon icon="mdi-puzzle-outline" size="small" class="me-1"/>Módulos</VBtn>
            <VBtn color="success" variant="tonal" size="small" to="/tareas/gantt"><VIcon icon="mdi-chart-gantt" size="small" class="me-1"/>Diagrama de Gantt</VBtn>
        </VCol>
      </VRow>
      <VRow class="mt-2">
        <VCol cols="12" md="4"><VTextField v-model="state.filters.search" label="Buscar..." prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" clearable hide-details /></VCol>
        <VCol cols="6" md="2"><VSelect v-model="state.filters.project" :items="state.projects.map(p => p.Proyectos)" label="Proyecto" variant="outlined" density="compact" clearable hide-details /></VCol>
        <VCol cols="6" md="2"><VSelect v-model="state.filters.assignee" :items="state.team.map(t => t.name)" label="Responsable" variant="outlined" density="compact" clearable hide-details /></VCol>
        <VCol cols="12" md="4" class="d-flex gap-2">
            <VTextField v-model="state.filters.dateFrom" label="Desde" type="date" variant="outlined" density="compact" hide-details />
            <VTextField v-model="state.filters.dateTo" label="Hasta" type="date" variant="outlined" density="compact" hide-details />
            <VBtn icon size="small" @click="clearFilters" variant="text"><VIcon icon="mdi-close-circle-outline" size="small" /></VBtn>
        </VCol>
      </VRow>
    </VCard>

    <!-- Kanban Board -->
    <div class="kanban-board-container">
        <div v-if="isLoading && !isUserSelectionModalOpen" class="text-center pa-16"><VProgressCircular indeterminate color="primary" size="64" /><p class="mt-4">Cargando tareas...</p></div>
        <div v-else class="d-flex gap-3 overflow-x-auto pb-3 kanban-scroll-container">
            <div v-for="column in filteredBoard" :key="column.id" class="kanban-column" :class="{ 'drag-over': dragOverColumn === column.id }" @dragover="onDragOver(column, $event)" @dragleave="onDragLeave" @drop="onDrop(column)">
                <VCard class="pa-3 bg-grey-lighten-4" elevation="0">
                    <div class="d-flex justify-space-between align-center mb-2">
                        <h4 class="text-subtitle-2 font-weight-bold text-uppercase">{{ column.name }} <VChip size="x-small" color="primary" class="ml-1">{{ column.tasks.length }}</VChip></h4>
                        <VMenu><template #activator="{ props }"><VBtn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small" /></template>
                            <VList>
                                <VListItem @click="openColumnModal(column)"><VListItemTitle>Editar</VListItemTitle></VListItem>
                                <VListItem @click="openConfirmModal('column', column)"><VListItemTitle class="text-error">Eliminar</VListItemTitle></VListItem>
                            </VList>
                        </VMenu>
                    </div>
                    <div class="tasks-container">
                        <VCard v-for="task in column.tasks" :key="task.id" class="mb-3" draggable="true" @dragstart="onDragStart(task, column, $event)" @dragend="onDragEnd" @click="openTaskModal(task)">
                            <VCardText>
                                <VChip v-if="task.project" size="small" color="primary" label class="mb-2">{{ task.project }}</VChip>
                                <p class="font-weight-bold mb-2">{{ task.title }}</p>
                                <div class="d-flex justify-space-between align-center">
                                    <span class="text-caption">{{ task.endDate }}</span>
                                    <VAvatar v-for="assignee in task.assignees" :key="assignee" size="24"><img :src="`https://ui-avatars.com/api/?name=${assignee}&background=random`" :alt="assignee"></VAvatar>
                                </div>
                            </VCardText>
                        </VCard>
                    </div>
                    <VBtn @click="openTaskModal(null, column.name)" block variant="text" size="small" class="mt-2">+ Agregar Tarea</VBtn>
                </VCard>
            </div>
        </div>
    </div>
    
    <!-- Modals -->
    <VDialog v-model="isUserSelectionModalOpen" persistent max-width="500">
      <VCard class="pa-8 text-center">
        <VAvatar color="primary" size="64" class="mb-4"><VIcon size="40" icon="mdi-account-circle-outline" /></VAvatar>
        <VCardTitle class="text-h5">Selecciona tu usuario</VCardTitle>
        <VCardText><VSelect :items="state.team.map(m => m.name)" label="Usuario" variant="outlined" @update:modelValue="handleUserSelected" no-data-text="Cargando usuarios..."/></VCardText>
      </VCard>
    </VDialog>
    
   <!-- Projects Modal -->
<VDialog v-model="isProjectsModalOpen" max-width="1000">
    <VCard class="pa-4">
        <VCardTitle class="d-flex justify-space-between align-center mb-4">
            <span class="text-h5">Gestión de Proyectos</span>
            <div class="d-flex gap-2">
                <VBtn color="primary" prepend-icon="mdi-plus" @click="openProjectFormModal()">Nuevo Proyecto</VBtn>
                <VBtn icon="mdi-close" variant="text" @click="isProjectsModalOpen = false"/>
            </div>
        </VCardTitle>
        <VCardText>
            <div v-if="state.projects && state.projects.length > 0">
                <VTable>
                    <thead>
                        <tr>
                            <th class="text-left">PROYECTO</th>
                            <th class="text-left">DESCRIPCIÓN</th>
                            <th class="text-left">MÓDULOS</th>
                            <th class="text-right">OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in state.projects" :key="item.row_number">
                            <td>{{ item.Proyectos }}</td>
                            <td>{{ item.Descripción }}</td>
                            <td>
                                <div class="d-flex flex-wrap gap-1">
                                    <VChip v-for="mod in (item.Módulos || '').split(',').map(m => m.trim()).filter(Boolean)" :key="mod" size="small" label>
                                        {{ mod }}
                                    </VChip>
                                </div>
                            </td>
                            <td class="text-right">
                                <VBtn icon="mdi-pencil" variant="text" size="small" color="info" @click="openProjectFormModal(item)"></VBtn>
                                <VBtn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="openProjectDeleteModal(item)"></VBtn>
                            </td>
                        </tr>
                    </tbody>
                </VTable>
            </div>
            <div v-else class="text-center pa-4">
                <p>No hay proyectos registrados</p>
            </div>
        </VCardText>
    </VCard>
</VDialog>

<!-- Project Form Modal -->
<VDialog v-model="isProjectFormModalOpen" max-width="600">
    <VCard class="pa-4">
        <VCardTitle class="d-flex justify-space-between align-center">
            <span class="text-h5">{{ editingProject ? 'Editar' : 'Nuevo' }} Proyecto</span>
            <VBtn icon="mdi-close" variant="text" @click="editingProject = null; isProjectFormModalOpen = false"/>
        </VCardTitle>
        <VCardText>
            <VForm @submit.prevent="handleProjectSave">
                <VTextField v-model="projectForm.name" label="Nombre del Proyecto" variant="outlined" density="compact" class="mb-4" required />
                <VTextarea v-model="projectForm.description" label="Descripción" variant="outlined" density="compact" rows="3" class="mb-4" />
                
                <div class="mb-2">
                    <label class="text-subtitle-2 mb-2 d-block">Módulos</label>
                    <div class="d-flex gap-2 mb-3">
                        <VSelect :items="state.modules.map(m => m.Nombre)" label="Seleccionar módulo" variant="outlined" density="compact" v-model="selectedModule" hide-details />
                        <VBtn color="primary" @click="addModuleToProject(selectedModule); selectedModule = ''" :disabled="!selectedModule">Añadir</VBtn>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <VChip v-for="mod in projectForm.modules" :key="mod" closable @click:close="removeModuleFromProject(mod)" color="primary" size="small">{{ mod }}</VChip>
                    </div>
                </div>
                
                <VCardActions class="px-0 pt-4">
                    <VSpacer />
                    <VBtn @click="editingProject = null; isProjectFormModalOpen = false">Cancelar</VBtn>
                    <VBtn color="primary" type="submit" variant="elevated">Guardar</VBtn>
                </VCardActions>
            </VForm>
        </VCardText>
    </VCard>
</VDialog>

    <!-- Team Modal (List View) -->
<VDialog v-model="isTeamModalOpen" max-width="1000">
    <VCard class="pa-4">
        <VCardTitle class="d-flex justify-space-between align-center mb-4">
            <span class="text-h5">Gestión de Equipo</span>
            <div class="d-flex gap-2">
                <VBtn color="primary" prepend-icon="mdi-plus" @click="openTeamFormModal()">Nuevo Miembro</VBtn>
                <VBtn icon="mdi-close" variant="text" @click="isTeamModalOpen = false"/>
            </div>
        </VCardTitle>
        <VCardText>
            <div v-if="state.team && state.team.length > 0">
                <VTable>
                    <thead>
                        <tr>
                            <th class="text-left">NOMBRE</th>
                            <th class="text-left">ROL</th>
                            <th class="text-left">CORREO</th>
                            <th class="text-right">OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in state.team" :key="item.id">
                            <td>{{ item.name }}</td>
                            <td>{{ item.role }}</td>
                            <td>{{ item.Correo }}</td>
                            <td class="text-right">
                                <VBtn icon="mdi-pencil" variant="text" size="small" color="info" @click="openTeamFormModal(item)"></VBtn>
                                <VBtn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="openTeamDeleteModal(item)"></VBtn>
                            </td>
                        </tr>
                    </tbody>
                </VTable>
            </div>
            <div v-else class="text-center pa-4">
                <p>No hay miembros registrados</p>
            </div>
        </VCardText>
    </VCard>
</VDialog>

<!-- Team Form Modal -->
<VDialog v-model="isTeamFormModalOpen" max-width="600">
    <VCard class="pa-4">
        <VCardTitle class="d-flex justify-space-between align-center">
            <span class="text-h5">{{ editingTeamMember ? 'Editar' : 'Nuevo' }} Miembro</span>
            <VBtn icon="mdi-close" variant="text" @click="editingTeamMember = null; isTeamFormModalOpen = false"/>
        </VCardTitle>
        <VCardText>
            <VForm @submit.prevent="handleTeamSave">
                <VTextField v-model="teamForm.name" label="Nombre" variant="outlined" density="compact" class="mb-4" required />
                <VTextField v-model="teamForm.roles" label="Roles" variant="outlined" density="compact" class="mb-4" />
                <VTextField v-model="teamForm.email" label="Correo" type="email" variant="outlined" density="compact" class="mb-4" />
                <VTextarea v-model="teamForm.data" label="Información Adicional" variant="outlined" density="compact" rows="3" class="mb-4" />
                
                <VCardActions class="px-0 pt-4">
                    <VSpacer />
                    <VBtn @click="editingTeamMember = null; isTeamFormModalOpen = false">Cancelar</VBtn>
                    <VBtn color="primary" type="submit" variant="elevated">Guardar</VBtn>
                </VCardActions>
            </VForm>
        </VCardText>
    </VCard>
</VDialog>

    <!-- Modules Modal (List View) -->
<VDialog v-model="isModulesModalOpen" max-width="800">
    <VCard class="pa-4">
        <VCardTitle class="d-flex justify-space-between align-center mb-4">
            <span class="text-h5">Gestión de Módulos</span>
            <div class="d-flex gap-2">
                <VBtn color="primary" prepend-icon="mdi-plus" @click="openModuleFormModal()">Nuevo Módulo</VBtn>
                <VBtn icon="mdi-close" variant="text" @click="isModulesModalOpen = false"/>
            </div>
        </VCardTitle>
        <VCardText>
            <div v-if="state.modules && state.modules.length > 0">
                <VTable>
                    <thead>
                        <tr>
                            <th class="text-left">NOMBRE</th>
                            <th class="text-right">OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in state.modules" :key="item.row_number">
                            <td>{{ item.Nombre }}</td>
                            <td class="text-right">
                                <VBtn icon="mdi-pencil" variant="text" size="small" color="info" @click="openModuleFormModal(item)"></VBtn>
                                <VBtn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="openModuleDeleteModal(item)"></VBtn>
                            </td>
                        </tr>
                    </tbody>
                </VTable>
            </div>
            <div v-else class="text-center pa-4">
                <p>No hay módulos registrados</p>
            </div>
        </VCardText>
    </VCard>
</VDialog>

<!-- Module Form Modal -->
<VDialog v-model="isModuleFormModalOpen" max-width="500">
    <VCard class="pa-4">
        <VCardTitle class="d-flex justify-space-between align-center">
            <span class="text-h5">{{ editingModule ? 'Editar' : 'Nuevo' }} Módulo</span>
            <VBtn icon="mdi-close" variant="text" @click="editingModule = null; isModuleFormModalOpen = false"/>
        </VCardTitle>
        <VCardText>
            <VForm @submit.prevent="handleModuleSave">
                <VTextField v-model="moduleForm.name" label="Nombre del Módulo" variant="outlined" density="compact" class="mb-4" required />
                
                <VCardActions class="px-0 pt-4">
                    <VSpacer />
                    <VBtn @click="editingModule = null; isModuleFormModalOpen = false">Cancelar</VBtn>
                    <VBtn color="primary" type="submit" variant="elevated">Guardar</VBtn>
                </VCardActions>
            </VForm>
        </VCardText>
    </VCard>
</VDialog>

    <!-- Task Modal -->
    <VDialog v-model="isTaskModalOpen" max-width="700">
        <VCard class="pa-4">
            <VCardTitle class="d-flex justify-space-between align-center">
                <span class="text-h5">{{ editingTask ? 'Editar' : 'Nueva' }} Tarea</span>
                <VBtn icon="mdi-close" variant="text" @click="closeTaskModal"/>
            </VCardTitle>
            <VCardText>
                <VForm @submit.prevent="handleTaskSave">
                    <VTextField 
                        v-model="taskForm.title" 
                        label="Título" 
                        variant="outlined" 
                        density="compact" 
                        class="mb-4" 
                        required 
                    />
                    
                    <VTextarea 
                        v-model="taskForm.description" 
                        label="Descripción" 
                        variant="outlined" 
                        density="compact" 
                        rows="3" 
                        class="mb-4" 
                    />
                    
                    <VRow class="mb-3">
                        <VCol cols="12" md="6">
                            <VSelect 
                                v-model="taskForm.project" 
                                :items="state.projects.map(p => p.Proyectos)" 
                                label="Proyecto" 
                                variant="outlined" 
                                density="compact" 
                                clearable 
                            />
                        </VCol>
                        <VCol cols="12" md="6">
                            <VSelect 
                                v-model="taskForm.module" 
                                :items="state.modules.map(m => m.Nombre)" 
                                label="Módulo" 
                                variant="outlined" 
                                density="compact" 
                                clearable 
                            />
                        </VCol>
                    </VRow>
                    
                    <VRow class="mb-3">
                        <VCol cols="12" md="6">
                            <VSelect 
                                v-model="taskForm.status" 
                                :items="state.columns.map(c => c.name)" 
                                label="Estado" 
                                variant="outlined" 
                                density="compact" 
                            />
                        </VCol>
                        <VCol cols="12" md="6">
                            <VSelect 
                                v-model="taskForm.assignee" 
                                :items="state.team.map(t => t.name)" 
                                label="Responsable" 
                                variant="outlined" 
                                density="compact" 
                            />
                        </VCol>
                    </VRow>
                    
                    <VTextField 
                        v-model="taskForm.endDate" 
                        label="Fecha de Entrega" 
                        type="date" 
                        variant="outlined" 
                        density="compact" 
                        class="mb-4" 
                    />
                    
                    <VCardActions class="px-0 pt-4">
                        <VSpacer />
                        <VBtn @click="closeTaskModal">Cancelar</VBtn>
                        <VBtn color="primary" type="submit" variant="elevated">Guardar</VBtn>
                    </VCardActions>
                </VForm>
            </VCardText>
        </VCard>
    </VDialog>

    <!-- Column/Estado Modal -->
    <VDialog v-model="isColumnModalOpen" max-width="500">
        <VCard class="pa-4">
            <VCardTitle class="d-flex justify-space-between align-center">
                <span class="text-h5">{{ editingColumn ? 'Editar' : 'Nuevo' }} Estado</span>
                <VBtn icon="mdi-close" variant="text" @click="closeColumnModal"/>
            </VCardTitle>
            <VCardText>
                <VForm @submit.prevent="handleColumnSave">
                    <VTextField 
                        v-model="columnForm.name" 
                        label="Nombre del Estado" 
                        variant="outlined" 
                        density="compact" 
                        class="mb-4" 
                        required 
                        placeholder="Ej: Por hacer, En progreso, etc." 
                    />
                    
                    <VCardActions class="px-0 pt-4">
                        <VSpacer />
                        <VBtn @click="closeColumnModal">Cancelar</VBtn>
                        <VBtn color="primary" type="submit" variant="elevated">Guardar</VBtn>
                    </VCardActions>
                </VForm>
            </VCardText>
        </VCard>
    </VDialog>

    <VDialog v-model="isConfirmModalOpen" max-width="400">
        <VCard class="pa-4 text-center">
            <VAvatar color="error" size="64" class="mb-4"><VIcon size="40" icon="mdi-alert-circle-outline" /></VAvatar>
            <VCardTitle class="text-h5">Confirmar Eliminación</VCardTitle>
            <VCardText>¿Estás seguro? Esta acción no se puede deshacer.</VCardText>
            <VCardActions>
                <VSpacer />
                <VBtn @click="isConfirmModalOpen = false">Cancelar</VBtn>
                <VBtn color="error" @click="handleConfirmDelete">Eliminar</VBtn>
            </VCardActions>
        </VCard>
    </VDialog>

    <!-- Snackbar for notifications -->
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top right">
      {{ snackbar.message }}
      <template #actions>
        <VBtn color="white" variant="text" @click="snackbar.show = false">Cerrar</VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<style scoped>
.kanban-board-container { 
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  padding-top: 16px;
  position: relative;
  transform: rotateX(180deg);
}

/* Scrollbar horizontal personalizado - MÁS VISIBLE ARRIBA */
.kanban-board-container::-webkit-scrollbar {
  height: 14px;
}

.kanban-board-container::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 7px;
  border: 1px solid #d0d0d0;
}

.kanban-board-container::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 7px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.kanban-board-container::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.kanban-board-container::-webkit-scrollbar-thumb:active {
  background: #4338ca;
}

.kanban-scroll-container {
  display: inline-flex;
  min-width: max-content;
  transform: rotateX(180deg);
}

.kanban-column { 
  width: 280px; 
  min-width: 280px;
}

.tasks-container { 
  /* Sin restricciones de altura - permite crecimiento natural */
}

/* Estilos mejorados para las cards de tareas */
.tasks-container .v-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: grab;
  background: white;
}

.tasks-container .v-card:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
  border-color: rgba(99, 102, 241, 0.4);
}

/* Estado durante drag */
.tasks-container .v-card:active {
  cursor: grabbing;
  opacity: 0.6;
  transform: scale(1.01);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Efecto visual para la columna objetivo durante drag */
.kanban-column.drag-over {
  background: rgba(99, 102, 241, 0.08);
  border: 2px dashed rgba(99, 102, 241, 0.4);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.kanban-column.drag-over .v-card {
  background: rgba(99, 102, 241, 0.02) !important;
}

/* Estilos compactos globales */
:deep(.v-card-text) {
  padding: 10px 12px !important;
  font-size: 0.875rem;
}

:deep(.text-h5) {
  font-size: 1.15rem !important;
}

:deep(.text-subtitle-1) {
  font-size: 0.9rem !important;
}

:deep(.v-chip) {
  font-size: 0.75rem !important;
}

:deep(.v-btn) {
  font-size: 0.85rem !important;
}
</style>