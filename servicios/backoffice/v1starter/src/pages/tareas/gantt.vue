<template>
  <div class="pa-4">
    <!-- Header -->
    <VRow align="center" class="mb-3">
      <VCol cols="12" md="6" class="d-flex align-center">
        <VAvatar color="teal" rounded size="40" class="me-3">
          <VIcon size="24" icon="mdi-chart-gantt" />
        </VAvatar>
        <div>
          <h1 class="text-h6 font-weight-bold">Diagrama de Gantt</h1>
          <p class="text-caption text-medium-emphasis">Visualización de la línea de tiempo de las tareas.</p>
        </div>
      </VCol>
      <VCol cols="12" md="6" class="d-flex gap-2 justify-end">
        <VBtn color="secondary" variant="tonal" size="small" to="/tareas">
          <VIcon icon="mdi-arrow-left" size="small" class="me-1" />
          Volver al Tablero
        </VBtn>
      </VCol>
    </VRow>

    <!-- Filters Card -->
    <VCard class="mb-3 pa-3">
      <VRow>
        <VCol cols="12" md="3">
          <VSelect
            v-model="selectedProject"
            :items="['all', ...projectNames]"
            label="Proyecto"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="applyFiltersAndRender"
          >
            <template #selection="{ item }">
              {{ item.value === 'all' ? 'Todos los proyectos' : item.value }}
            </template>
            <template #item="{ item, props }">
              <VListItem v-bind="props" :title="item.value === 'all' ? 'Todos los proyectos' : item.value" />
            </template>
          </VSelect>
        </VCol>
        <VCol cols="12" md="3">
          <VSelect
            v-model="selectedResponsible"
            :items="['all', ...responsibleNames]"
            label="Responsable"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="applyFiltersAndRender"
          >
            <template #selection="{ item }">
              {{ item.value === 'all' ? 'Todos' : item.value }}
            </template>
            <template #item="{ item, props }">
              <VListItem v-bind="props" :title="item.value === 'all' ? 'Todos' : item.value" />
            </template>
          </VSelect>
        </VCol>
        <VCol cols="12" md="2">
          <VSelect
            v-model="selectedPeriod"
            :items="periodOptions"
            item-title="label"
            item-value="value"
            label="Periodo"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="applyFiltersAndRender"
          />
        </VCol>
        <VCol cols="12" md="2">
          <VTextField
            v-model="filterStartDate"
            label="Desde"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            @change="applyFiltersAndRender"
          />
        </VCol>
        <VCol cols="12" md="2">
          <VTextField
            v-model="filterEndDate"
            label="Hasta"
            type="date"
            variant="outlined"
            density="compact"
            hide-details
            @change="applyFiltersAndRender"
          />
        </VCol>
      </VRow>
    </VCard>

    <!-- Gantt Chart Card -->
    <VCard class="pa-4">
      <div class="d-flex justify-end mb-4">
        <div class="d-flex gap-2">
          <VBtn icon size="small" @click="zoomIn" variant="tonal">
            <VIcon icon="mdi-magnify-plus-outline" />
          </VBtn>
          <VBtn icon size="small" @click="zoomOut" variant="tonal">
            <VIcon icon="mdi-magnify-minus-outline" />
          </VBtn>
        </div>
      </div>
      <div ref="ganttChartContainer" id="gantt-chart" class="gantt-container"></div>
      
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="text-center">
          <VProgressCircular indeterminate color="primary" size="64" />
          <p class="mt-4 text-h6">Cargando diagrama…</p>
          <p class="text-caption text-medium-emphasis">Obteniendo las tareas y preparando la visualización.</p>
        </div>
      </div>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Gantt from 'frappe-gantt'

const ganttContainer = ref(null)
const ganttChartContainer = ref(null)
const isLoading = ref(false)
const allTasks = ref([])
const projectNames = ref([])
const responsibleNames = ref([])
const selectedProject = ref('all')
const selectedResponsible = ref('all')
const selectedPeriod = ref('')
const filterStartDate = ref('')
const filterEndDate = ref('')
let gantt = null
const projectColorMap = {}

const periodOptions = [
  { label: 'Todos', value: '' },
  { label: 'Semana', value: 'week' },
  { label: '15 días', value: '15days' },
  { label: 'Mes', value: 'month' }
]

const SESSION_STORAGE_KEY = "kanban-user-session"

const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    return stored ? JSON.parse(stored).username : null
  } catch (error) {
    console.warn("Error al leer sesión:", error)
    return null
  }
}

const parseRemoteDate = (raw) => {
  if (!raw) return null
  const normalized = String(raw).replace(/de/gi, "").trim()
  const datePart = normalized.split(/[ T]/)[0]
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(datePart)
  if (!match) return null
  const day = Number.parseInt(match[1], 10)
  const month = Number.parseInt(match[2], 10)
  const year = Number.parseInt(match[3], 10)
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

const subtractWorkDays = (date, days) => {
  let newDate = new Date(date)
  let daysSubtracted = 0
  while (daysSubtracted < days) {
    newDate.setDate(newDate.getDate() - 1)
    if (newDate.getDay() !== 0 && newDate.getDay() !== 6) {
      daysSubtracted++
    }
  }
  return newDate
}

const getTodayLocal = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const getPeriodRange = (periodKey) => {
  if (!periodKey) return { start: null, end: null }

  const today = getTodayLocal()

  if (periodKey === 'week') {
    const day = today.getDay()
    const diffToMonday = day === 0 ? -6 : 1 - day
    const start = new Date(today)
    start.setDate(today.getDate() + diffToMonday)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start, end }
  }

  if (periodKey === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return { start, end }
  }

  if (periodKey === '15days') {
    const start = new Date(today)
    const end = new Date(today)
    end.setDate(end.getDate() + 14)
    return { start, end }
  }

  return { start: null, end: null }
}

const projectColors = ['#4A90E2', '#50E3C2', '#F5A623', '#F8E71C', '#D0021B', '#BD10E0', '#9013FE', '#B8E986', '#7ED321', '#417505']

const getProjectColor = (projectName) => {
  if (!projectColorMap[projectName]) {
    const colorIndex = Object.keys(projectColorMap).length % projectColors.length
    projectColorMap[projectName] = projectColors[colorIndex]
  }
  return projectColorMap[projectName]
}

const applyDynamicStyles = () => {
  let styles = ''

  for (const projectName in projectColorMap) {
    const colorProject = projectColorMap[projectName]
    const colorProjectWithOpacity = projectColorMap[projectName] + '90'
    const colorTask = projectColorMap[projectName] + 'cc'
    const colorTaskWithOpacity = projectColorMap[projectName] + '52'
    const projectId = `proj_${projectName.replace(/\s+/g, '_')}`

    styles += `
    .gantt .bar-wrapper[data-id="${projectId}"] .bar {
        fill: ${colorProjectWithOpacity} !important;
    }
    .gantt .bar-wrapper[data-id="${projectId}"] .bar-progress {
        fill: ${colorProject} !important;
    }
    .gantt .bar-wrapper[data-id^="task_${projectName.replace(/\s+/g, '_')}_"] .bar {
        fill: ${colorTaskWithOpacity} !important;
    }
    .gantt .bar-wrapper[data-id^="task_${projectName.replace(/\s+/g, '_')}_"] .bar-progress {
        fill: ${colorTask} !important;
    }    
    `
  }

  const styleSheetId = 'gantt-dynamic-styles'
  let styleSheet = document.getElementById(styleSheetId)

  if (!styleSheet) {
    styleSheet = document.createElement("style")
    styleSheet.id = styleSheetId
    styleSheet.type = 'text/css'
    document.head.appendChild(styleSheet)
  }

  styleSheet.appendChild(document.createTextNode(styles))
}

const renderGantt = (tasks) => {
  if (!ganttChartContainer.value) return
  
  ganttChartContainer.value.innerHTML = ''
  if (!tasks || tasks.length === 0) {
    ganttChartContainer.value.innerHTML = '<p class="text-slate-500 text-center">No hay tareas para mostrar.</p>'
    return
  }

  const projects = {}
  for (const task of tasks) {
    const projectName = task.Proyecto || 'Sin Proyecto'
    if (!projects[projectName]) {
      projects[projectName] = []
    }
    projects[projectName].push(task)
  }

  const ganttTasks = []

  for (const projectName in projects) {
    const projectTasks = projects[projectName]
    const validTasks = projectTasks.map(task => ({ ...task, endDate: parseRemoteDate(task["Fecha de Entrega"]) })).filter(task => task.endDate)

    if (validTasks.length === 0) continue

    const projectStartDate = new Date(Math.min(...validTasks.map(t => subtractWorkDays(t.endDate, 2))))
    const projectEndDate = new Date(Math.max(...validTasks.map(t => t.endDate)))
    const projectEndDateForGantt = new Date(
      projectEndDate.getFullYear(),
      projectEndDate.getMonth(),
      projectEndDate.getDate() + 1
    )

    let totalProgress = 0
    const taskObjects = []

    for (const [index, task] of validTasks.entries()) {
      const taskProgress = task.Estado === 'Completado' ? 100 : 5
      totalProgress += taskProgress

      const taskEndDate = task.endDate
      const taskEndDateForGantt = new Date(
        taskEndDate.getFullYear(),
        taskEndDate.getMonth(),
        taskEndDate.getDate() + 1
      )
      const taskStartDate = subtractWorkDays(taskEndDate, 2)
      
      taskObjects.push({
        id: `task_${projectName}_${index}`,
        name: `${task.Tarea} <i>(${task.Responsable || 'N/A'})</i>`,
        start: taskStartDate,
        end: taskEndDateForGantt,
        progress: taskProgress,
        dependencies: `proj_${projectName.replace(/\s+/g, '_')}`,
        custom_class: 'bar-task'
      })
    }

    const projectProgress = validTasks.length > 0 ? totalProgress / validTasks.length : 5
    getProjectColor(projectName)
    const projectId = `proj_${projectName.replace(/\s+/g, '_')}`

    ganttTasks.push({
      id: projectId,
      name: `${projectName}`,
      start: projectStartDate,
      end: projectEndDateForGantt,
      progress: projectProgress,
      custom_class: 'bar-project'
    })

    ganttTasks.push(...taskObjects)
  }

  if (ganttTasks.length === 0) {
    ganttChartContainer.value.innerHTML = '<p class="text-slate-500 text-center">No hay tareas con fechas válidas para mostrar.</p>'
    return
  }

  applyDynamicStyles()

  ganttChartContainer.value.innerHTML = '<svg id="gantt"></svg>'
  gantt = new Gantt("#gantt", ganttTasks, {
    header_height: 50,
    column_width: 30,
    step: 24,
    view_modes: ['Day', 'Week', 'Month'],
    bar_height: 22,
    bar_corner_radius: 3,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Week',
    language: 'es',
    custom_popup_html: function(task) {
      return (
        `<div class="gantt-popup-content p-4 bg-white rounded-lg shadow-lg">
          <h4 class="text-base font-semibold mb-2">${task.name.replace(/<\/?[^>]+(>|$)/g, "")}</h4>
          <p class="text-sm text-slate-600"><b>Desde:</b> ${task._start.toLocaleDateString()}</p>
          <p class="text-sm text-slate-600"><b>Hasta:</b> ${task._end.toLocaleDateString()}</p>
        </div>`
      )
    }
  })
}

const getDateFromValue = (value) => {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

const applyFiltersAndRender = () => {
  const filterStart = getDateFromValue(filterStartDate.value)
  const filterEnd = getDateFromValue(filterEndDate.value)

  const { start: periodStart, end: periodEnd } = getPeriodRange(selectedPeriod.value)

  let filteredTasks = allTasks.value

  if (selectedProject.value && selectedProject.value !== 'all') {
    filteredTasks = filteredTasks.filter(
      t => (t.Proyecto || 'Sin Proyecto') === selectedProject.value
    )
  }

  if (selectedResponsible.value && selectedResponsible.value !== 'all') {
    const target = selectedResponsible.value.toLowerCase()
    filteredTasks = filteredTasks.filter(task => {
      const raw = (task.Responsable || '').toString().toLowerCase()
      if (!raw) return false
      return raw.split(/[,/]/).some(part => part.trim() === target) || raw.includes(target)
    })
  }

  if (periodStart && periodEnd) {
    filteredTasks = filteredTasks.filter(task => {
      const endDate = parseRemoteDate(task["Fecha de Entrega"])
      if (!endDate) return false
      const startDate = subtractWorkDays(endDate, 2)
      return endDate >= periodStart && startDate <= periodEnd
    })
  }

  if (filterStart || filterEnd) {
    filteredTasks = filteredTasks.filter(task => {
      const endDate = parseRemoteDate(task["Fecha de Entrega"])
      if (!endDate) return false
      const startDate = subtractWorkDays(endDate, 2)

      if (filterStart && filterEnd) {
        return endDate >= filterStart && startDate <= filterEnd
      }
      if (filterStart) {
        return endDate >= filterStart
      }
      if (filterEnd) {
        return startDate <= filterEnd
      }
      return true
    })
  }

  renderGantt(filteredTasks)
}

const populateProjectFilter = (tasks) => {
  const names = [...new Set(tasks.map(t => t.Proyecto || 'Sin Proyecto'))]
  names.sort()
  projectNames.value = names
}

const populateResponsibleFilter = (team) => {
  const names = [...new Set(
    (team || [])
      .map(member => (member.Responsables || member.responsables || '').trim())
      .filter(Boolean)
  )]

  names.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
  responsibleNames.value = names
}

const fetchTasks = async () => {
  isLoading.value = true
  const user = getCurrentUser()
  
  if (!user) {
    console.error("No hay un usuario en sesión.")
    isLoading.value = false
    return
  }

  try {
    const readApiUrl = `https://n8n.fastcloudbox.cloud/webhook/tareas-ecuavisa-v2?panel=${encodeURIComponent(user)}`
    const response = await fetch(readApiUrl)
    const payload = await response.json()
    const data = payload[0]?.data || {}
    allTasks.value = data.tareas || []
    const team = data.equipo || []
    console.log("allTasks", allTasks.value)
    populateProjectFilter(allTasks.value)
    populateResponsibleFilter(team)
    renderGantt(allTasks.value)
  } catch (error) {
    console.error('Error al obtener las tareas para el Gantt:', error)
  } finally {
    isLoading.value = false
  }
}

const getNextViewMode = (currentMode, direction) => {
  const modes = ['Day', 'Week', 'Month']
  const currentIndex = modes.indexOf(currentMode)
  if (direction === 'in') {
    return modes[Math.max(0, currentIndex - 1)]
  } else {
    return modes[Math.min(modes.length - 1, currentIndex + 1)]
  }
}

const zoomIn = () => {
  if (gantt) {
    gantt.change_view_mode(getNextViewMode(gantt.options.view_mode, 'in'))
  }
}

const zoomOut = () => {
  if (gantt) {
    gantt.change_view_mode(getNextViewMode(gantt.options.view_mode, 'out'))
  }
}

onMounted(() => {
  fetchTasks()
})

onBeforeUnmount(() => {
  const styleSheet = document.getElementById('gantt-dynamic-styles')
  if (styleSheet) {
    styleSheet.remove()
  }
})
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.css';

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 4px;
}

/* Gantt Container */
.gantt-container {
  min-height: 500px;
  overflow-x: auto;
  position: relative;
}

/* Estilos del Gantt Chart */
.gantt .bar {
  rx: 3;
  ry: 3;
}

.gantt .bar-label {
  font-size: 12px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
}

.gantt .bar-project .bar-label {
  text-anchor: start;
  font-weight: 600;
  font-size: 13px;
}

.gantt .arrow {
  fill: none;
  stroke: #d1d1d1;
  stroke-width: 1.5;
}

.gantt .bar-wrapper {
  cursor: pointer;
}

.gantt .bar-wrapper:hover .bar-group {
  opacity: 0.85;
}

.gantt .bar-wrapper:hover .bar-label {
  font-weight: 600;
}

.gantt .lower-text,
.gantt .upper-text {
  font-size: 12px;
  font-weight: 500;
  fill: #64748b;
}

.gantt .date_highlight {
  fill: #fff4e6;
}

.gantt .today-highlight {
  fill: #fef3c7;
  opacity: 0.5;
}

/* Grid styles */
.gantt .grid-header {
  font-size: 11px;
  font-weight: 600;
  fill: #475569;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.gantt .grid-row {
  fill: transparent;
}

.gantt .grid-row:nth-child(even) {
  fill: #f8fafc;
}

.gantt .row-line {
  stroke: #e2e8f0;
  stroke-width: 1;
}

.gantt .tick {
  stroke: #cbd5e1;
  stroke-width: 0.5;
}

.gantt .tick.thick {
  stroke: #94a3b8;
  stroke-width: 1;
}

/* Popup personalizado */
.gantt-popup-wrapper {
  position: absolute;
  background: white;
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  min-width: 200px;
  z-index: 10000;
}

.gantt-popup-wrapper .pointer {
  display: none;
}

.gantt-popup-content {
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
}

.gantt-popup-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.4;
}

.gantt-popup-content p {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
  line-height: 1.5;
}

.gantt-popup-content p b {
  font-weight: 600;
  color: #475569;
}

/* Scrollbar personalizado */
.gantt-container::-webkit-scrollbar {
  height: 10px;
}

.gantt-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 5px;
}

.gantt-container::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 5px;
}

.gantt-container::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}
</style>
