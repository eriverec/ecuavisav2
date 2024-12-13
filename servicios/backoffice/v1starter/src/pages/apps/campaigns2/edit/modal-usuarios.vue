<template>
  <div>
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="top"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <VCardTitle class="px-0">Esta es la lista de usuarios de la campaña "{{campaignTitle}}":</VCardTitle>
    <VCardSubtitle></VCardSubtitle>

    <!-- Campo de búsqueda y botones -->
    <VRow justify="space-between" class="my-4">
      <VCol cols="3">
        <div class="">
          <VTextField 
            append-inner-icon="tabler-user-search" 
            @input="filtrarUsuarios" 
            v-model="filterLocal" 
            label="Buscar usuarios dentro del listado"
          />
        </div>
      </VCol>
      <VCol cols="auto">
        <div class="d-flex gap-3 flex-wrap">
          <VBtn color="info" @click="$emit('export')">
            Descargar Usuarios<VIcon end icon="tabler-download" />
          </VBtn>
          <VBtn color="success" @click="handleAddUser">
            Añadir usuarios<VIcon end icon="mdi-account-plus" />
          </VBtn>
          <VBtn color="primary" @click="$refs.fileInput.click()">
            Importar CSV<VIcon end icon="mdi-file-upload" />
          </VBtn>
          <input
            ref="fileInput"
            type="file"
            accept=".csv"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
      </VCol>
    </VRow>

    <!-- Lista de usuarios -->
    <VList lines="two">
      <template v-for="(user, index) in currentUsers" :key="index">
        <VListItem border>
          <VListItemTitle>
            <span>{{ user.firstname || user.first_name }} {{ user.lastname || user.last_name }}</span>
          </VListItemTitle>
          <VListItemSubtitle class="mt-1" color="info">
            <span class="text-xs text-disabled">Correo: {{ user.email }}</span>
          </VListItemSubtitle>
          <template #append>
            <div class="espacio-right-2">
              <VBtn
                icon
                size="x-small"
                color="error"
                variant="text"
                @click="handleDeleteUser(user.wylexId)"
              >
                <VIcon size="22" icon="tabler-trash" />
              </VBtn>
            </div>
          </template>
        </VListItem>
      </template>
    </VList>

    <!-- Paginación -->
    <VBtn 
      variant="tonal" 
      @click="currentPageLocal--" 
      :disabled="currentPageLocal <= 1" 
      size="small" 
      color="primary"
    >
      <VIcon start icon="tabler-arrow-left" /> Anterior
    </VBtn>
    <VBtn 
      variant="tonal" 
      @click="currentPageLocal++" 
      :disabled="currentPageLocal >= totalPages" 
      size="small" 
      color="primary" 
      class="ma-3"
    >
      Siguiente <VIcon end icon="tabler-arrow-right" />
    </VBtn>

    <!-- Modal de búsqueda -->
    <VDialog v-model="showSearchDialog" max-width="800px">
      <VCard>
        <VCardTitle>Buscar Usuarios</VCardTitle>
        <VCardText>
          <VTextField
            v-model="searchQuery"
            @input="handleSearch"
            label="Buscar por nombre, correo o teléfono (mínimo 4 caracteres)"
            append-inner-icon="tabler-search"
            :loading="isSearching"
          />
          
          <VTable v-if="searchResults.length > 0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in searchResults" :key="user.wylexId">
                <td>{{ user.first_name }} {{ user.last_name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <VBtn
                    size="small"
                    color="primary"
                    @click="handleAddSpecificUser(user)"
                    :loading="loadingAdd"
                  >
                    Agregar
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            text
            @click="closeSearchDialog"
          >
            Cerrar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import Papa from 'papaparse'

export default {
  name: 'UserList',
  emits: ['delete-user', 'add-user', 'export', 'update-users', 'close'],
  props: {
    users: {
      type: Array,
      required: true
    },
    campaignTitle: {
      type: String,
      required: true
    },
    usersPerPage: {
      type: Number,
      default: 10
    },
    campaignId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      filterLocal: '',
      currentPageLocal: 1,
      timeoutId: null,
      filteredUsers: [],
      showSearchDialog: false,
      searchQuery: '',
      searchResults: [],
      isSearching: false,
      searchTimeout: null,
      loadingAdd: false,
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      }
    }
  },
  watch: {
    users: {
      immediate: true,
      handler(newUsers) {
        this.filteredUsers = newUsers
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.usersPerPage)
    },
    currentUsers() {
      const start = (this.currentPageLocal - 1) * this.usersPerPage
      const end = start + this.usersPerPage
      return this.filteredUsers.slice(start, end)
    }
  },
  methods: {
    async refreshCampaignData() {
      try {
        const response = await fetch(`https://ads-service.vercel.app/campaign/${this.campaignId}/user`);
        const data = await response.json();
        if (data && data[0]) {
          this.filteredUsers = data[0].userId;
        }
      } catch (error) {
        console.error('Error al actualizar datos:', error);
      }
    },

    async handleAddSpecificUser(user) {
      this.loadingAdd = true;
      try {
        const response = await fetch(`https://ads-service.vercel.app/campaign/add-user/${this.campaignId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.wylexId
          })
        });

        const data = await response.json();
        if (data.resp) {
          this.snackbar = {
            show: true,
            text: 'Usuario agregado exitosamente',
            color: 'success'
          };
          await this.refreshCampaignData();
        } else {
          throw new Error(data.error || 'Error al agregar usuario');
        }
      } catch (error) {
        this.snackbar = {
          show: true,
          text: `Error: ${error.message}`,
          color: 'error'
        };
      } finally {
        this.loadingAdd = false;
      }
    },

    async handleDeleteUser(userId) {
      try {
        const response = await fetch(`https://ads-service.vercel.app/campaign/delete-user/${this.campaignId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        });

        const data = await response.json();
        if (data.resp) {
          this.snackbar = {
            show: true,
            text: 'Usuario eliminado exitosamente',
            color: 'success'
          };
          await this.refreshCampaignData();
        }
      } catch (error) {
        this.snackbar = {
          show: true,
          text: 'Error al eliminar usuario',
          color: 'error'
        };
      }
    },

    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        this.snackbar = {
          show: true,
          text: 'Por favor, selecciona un archivo CSV',
          color: 'error'
        };
        event.target.value = '';
        return;
      }

      try {
        Papa.parse(file, {
          header: true,
          complete: async (result) => {
            try {
              if (!result.data || !result.data.length) {
                throw new Error('El archivo está vacío');
              }

              const userIds = result.data
                .filter(row => row.id && row.id.trim() !== '')
                .map(row => parseInt(row.id))
                .filter(id => !isNaN(id));

              if (userIds.length === 0) {
                throw new Error('No se encontraron IDs válidos');
              }

              if (userIds.length > 30000) {
                throw new Error('El máximo es 30,000 usuarios');
              }

              // Actualizar usuarios uno por uno
              for (const userId of userIds) {
                await this.handleAddSpecificUser({ wylexId: userId });
              }

              this.snackbar = {
                show: true,
                text: `${userIds.length} usuarios procesados exitosamente`,
                color: 'success'
              };

              await this.refreshCampaignData();
            } catch (error) {
              this.snackbar = {
                show: true,
                text: `Error: ${error.message}`,
                color: 'error'
              };
            }
          }
        });
      } catch (error) {
        this.snackbar = {
          show: true,
          text: `Error: ${error.message}`,
          color: 'error'
        };
      } finally {
        event.target.value = '';
      }
    },

    async handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(async () => {
        if (!this.searchQuery || this.searchQuery.length < 4) {
          this.searchResults = [];
          return;
        }

        this.isSearching = true;
        try {
          const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${encodeURIComponent(this.searchQuery)}`);
          const data = await response.json();
          
          if (data.resp) {
            this.searchResults = data.data;
          } else {
            this.searchResults = [];
            this.snackbar = {
              show: true,
              text: data.error || 'Error en la búsqueda',
              color: 'error'
            };
          }
        } catch (error) {
          console.error('Error en búsqueda:', error);
          this.searchResults = [];
          this.snackbar = {
            show: true,
            text: 'Error en la búsqueda',
            color: 'error'
          };
        } finally {
          this.isSearching = false;
        }
      }, 500);
    },

    handleAddUser() {
      this.searchQuery = '';
      this.searchResults = [];
      this.showSearchDialog = true;
    },

    closeSearchDialog() {
      this.showSearchDialog = false;
      this.refreshCampaignData();
    },

    filtrarUsuarios() {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        const search = this.filterLocal.toLowerCase();
        this.filteredUsers = this.users.filter(usuario => {
          const nombreCompleto = `${usuario.firstname || usuario.first_name} ${usuario.lastname || usuario.last_name}`.toLowerCase();
          
          if (nombreCompleto.includes(search)) {
            return true;
          }

          return Object.keys(usuario).some(key => {
            return key !== "wylexId" && usuario[key].toString().toLowerCase().includes(search);
          });
        });
        this.currentPageLocal = 1;
      }, 300);
    }
  }
}
</script>

<style scoped>
.v-dialog {
  max-height: 90vh;
  overflow-y: auto;
}
</style>