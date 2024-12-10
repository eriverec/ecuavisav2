<template>
  <div>
    <VCardTitle class="px-0">Esta es la lista de usuarios de la campaña "{{campaignTitle}}":</VCardTitle>
    <VCardSubtitle></VCardSubtitle>

    <!-- Campo de búsqueda -->
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
          <VBtn color="success" @click="$emit('add-user')">
            Añadir usuarios<VIcon end icon="mdi-account-plus" />
          </VBtn>
          
        </div>
      </VCol>
    </VRow>

    <!-- items -->
    <VList lines="two">
      <template v-for="(user, index) in currentUsers" :key="index">
        <VListItem border>
          <VListItemTitle>
            <span>{{ user.firstname }} {{ user.last_name }}</span>
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
                  @click="$emit('delete-user', user.wylexId)"
                >
                <VIcon size="22" icon="tabler-trash" />
              </VBtn>
            </div>
          </template>
        </VListItem>
      </template>
    </VList>

    <!-- botones paginado -->
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
  </div>
</template>

<script>
export default {
  name: 'UserList',
  emits: ['delete-user', 'add_user', 'export'], // Declarar los eventos que se emitirán
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
    }
  },
  data() {
    return {
      filterLocal: '',
      currentPageLocal: 1,
      timeoutId: null,
      filteredUsers: []
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
    async add_user(){
      this.isDialogSearchUser = true;
      this.isLoadingDialogUser = true;
      await this.obtenerDataUsers();
      this.isLoadingDialogUser = false;
    },
    
    filtrarUsuarios() {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        const search = this.filterLocal.toLowerCase()
        this.filteredUsers = this.users.filter(usuario => {
          const nombreCompleto = `${usuario.firstname} ${usuario.last_name}`.toLowerCase()
          
          if (nombreCompleto.includes(search)) {
            return true
          }

          return Object.keys(usuario).some(key => {
            return key !== "wylexId" && usuario[key].toString().toLowerCase().includes(search)
          })
        })
        this.currentPageLocal = 1
      }, 1000)
    }
  }
}



</script>