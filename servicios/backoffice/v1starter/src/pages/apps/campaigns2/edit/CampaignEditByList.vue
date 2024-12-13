<script setup>
import { ref, computed, onMounted } from 'vue'
import Papa from 'papaparse'

const props = defineProps({
  campaignData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

// Estados
const users = ref([])
const filterLocal = ref('')
const currentPage = ref(1)
const usersPerPage = ref(10)
const showSearchDialog = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const loadingAdd = ref(false)
const fileInput = ref(null)

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Computed properties
const filteredUsers = computed(() => {
  const search = filterLocal.value.toLowerCase()
  return users.value.filter(user => {
    const fullName = `${user.firstname || user.first_name} ${user.lastname || user.last_name}`.toLowerCase()
    return fullName.includes(search) || user.email.toLowerCase().includes(search)
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage.value)
})

const currentUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage.value
  const end = start + usersPerPage.value
  return filteredUsers.value.slice(start, end)
})

// Métodos principales
const fetchUsers = async () => {
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/${props.campaignData._id}/user`)
    const data = await response.json()
    if (data && data[0]) {
      users.value = data[0].userId
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    snackbar.value = {
      show: true,
      text: 'Error al cargar usuarios',
      color: 'error'
    }
  }
}

const handleSearch = async () => {
  if (!searchQuery.value || searchQuery.value.length < 4) return

  isSearching.value = true
  try {
    const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${encodeURIComponent(searchQuery.value)}`)
    const data = await response.json()
    
    if (data.resp) {
      searchResults.value = data.data
    } else {
      throw new Error(data.error || 'Error en la búsqueda')
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: error.message,
      color: 'error'
    }
  } finally {
    isSearching.value = false
  }
}

const handleAddUser = async (user) => {
  loadingAdd.value = true
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/add-user/${props.campaignData._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.wylexId
      })
    })

    const data = await response.json()
    if (data.resp) {
      snackbar.value = {
        show: true,
        text: 'Usuario agregado exitosamente',
        color: 'success'
      }
      await fetchUsers()
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al agregar usuario',
      color: 'error'
    }
  } finally {
    loadingAdd.value = false
  }
}

const handleDeleteUser = async (userId) => {
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/delete-user/${props.campaignData._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })

    const data = await response.json()
    if (data.resp) {
      snackbar.value = {
        show: true,
        text: 'Usuario eliminado exitosamente',
        color: 'success'
      }
      await fetchUsers()
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al eliminar usuario',
      color: 'error'
    }
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.name.endsWith('.csv')) {
    snackbar.value = {
      show: true,
      text: 'Por favor, selecciona un archivo CSV',
      color: 'error'
    }
    return
  }

  Papa.parse(file, {
    header: true,
    complete: async (results) => {
      try {
        if (!results.data || !results.data.length) {
          throw new Error('El archivo está vacío')
        }

        const userIds = results.data
          .filter(row => row.id && row.id.trim() !== '')
          .map(row => parseInt(row.id))
          .filter(id => !isNaN(id))

        if (userIds.length === 0) {
          throw new Error('No se encontraron IDs válidos')
        }

        if (userIds.length > 30000) {
          throw new Error('El máximo es 30,000 usuarios')
        }

        for (const userId of userIds) {
          await handleAddUser({ wylexId: userId })
        }

        snackbar.value = {
          show: true,
          text: `${userIds.length} usuarios importados exitosamente`,
          color: 'success'
        }
      } catch (error) {
        snackbar.value = {
          show: true,
          text: error.message,
          color: 'error'
        }
      }
    }
  })
}

const exportToCSV = () => {
  const csvContent = [
    ['ID', 'Nombre', 'Apellido', 'Email'],
    ...users.value.map(user => [
      user.wylexId,
      user.firstname || user.first_name,
      user.lastname || user.last_name,
      user.email
    ])
  ]

  const csv = Papa.unparse(csvContent)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `usuarios_campaña_${props.campaignData._id}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Inicialización
onMounted(fetchUsers)
</script>

<template>
  <div>
    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <!-- Encabezado y controles -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h2 class="text-h5">{{ props.campaignData.campaignTitle }}</h2>
        <p class="text-subtitle-1">Gestión de usuarios</p>
      </div>
      
      <div class="d-flex gap-2">
        <VBtn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showSearchDialog = true"
        >
          Añadir usuarios
        </VBtn>
        <VBtn
          color="secondary"
          prepend-icon="mdi-upload"
          @click="$refs.fileInput.click()"
        >
          Importar CSV
        </VBtn>
        <VBtn
          color="info"
          prepend-icon="mdi-download"
          @click="exportToCSV"
        >
          Exportar
        </VBtn>
      </div>
    </div>

    <!-- Input oculto para archivo CSV -->
    <input
      ref="fileInput"
      type="file"
      accept=".csv"
      class="d-none"
      @change="handleFileUpload"
    >

    <!-- Buscador -->
    <VTextField
      v-model="filterLocal"
      prepend-inner-icon="mdi-magnify"
      label="Buscar usuarios"
      clearable
      class="mb-4"
    />

    <!-- Lista de usuarios -->
    <VTable>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in currentUsers" :key="user.wylexId">
          <td>{{ user.firstname || user.first_name }} {{ user.lastname || user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td class="text-center">
            <VBtn
              icon="mdi-delete"
              variant="text"
              color="error"
              size="small"
              @click="handleDeleteUser(user.wylexId)"
            />
          </td>
        </tr>
      </tbody>
    </VTable>

    <!-- Paginación -->
    <div class="d-flex justify-center mt-4">
      <VPagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
      />
    </div>

    <!-- Modal de búsqueda -->
    <VDialog
      v-model="showSearchDialog"
      max-width="800"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          Buscar usuarios
          <VBtn
            icon="mdi-close"
            variant="text"
            @click="showSearchDialog = false"
          />
        </VCardTitle>

        <VCardText>
          <VTextField
            v-model="searchQuery"
            label="Buscar por nombre o email"
            prepend-inner-icon="mdi-magnify"
            clearable
            @update:model-value="handleSearch"
            :loading="isSearching"
          />

          <VTable v-if="searchResults.length">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th class="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in searchResults" :key="user.wylexId">
                <td>{{ user.first_name }} {{ user.last_name }}</td>
                <td>{{ user.email }}</td>
                <td class="text-center">
                  <VBtn
                    color="primary"
                    size="small"
                    :loading="loadingAdd"
                    @click="handleAddUser(user)"
                  >
                    Agregar
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>

          <VAlert
            v-else-if="searchQuery && !isSearching"
            type="info"
            class="mt-4"
          >
            No se encontraron resultados
          </VAlert>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.v-table {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
}

.v-table th {
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.v-table td {
  height: 48px;
}
</style>