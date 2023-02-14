<script setup>
import { useUserListStore } from "@/views/apps/user/useUserListStore";
const userListStore = useUserListStore();
const userTema = ref([]);
const route = useRoute();
const selected = ref([]);

const fetchTema = () => {
  userListStore.fetchTema(Number(route.params.id)).then((response) => {
    userTema.value = response.data.usuario.Temas;
    console.log("Temas", userTema.value);
  });
};
fetchTema();

const toggleSelected = (name) => {
  const temaIndex = selected.value.indexOf(name);
  if (temaIndex === -1) selected.value.push(name);
  else selected.value.splice(temaIndex, 1);
};

const selectAllCheckbox = computed(
  () => userTema.value.length && userTema.value.length === selected.value.length
);

const isSelectAllCheckboxIndeterminate = computed(
  () =>
    Boolean(selected.value.length) &&
    userTema.value.length !== selected.value.length
);

const selectAllCheckboxUpdate = () => {
  selected.value = !selectAllCheckbox.value
    ? userTema.value.map((tema) => tema.name)
    : [];
};

const resetTema = () => {
  selected.value = [];
  fetchTema();
}

const delTema = () => {
userListStore.deleteTema(Number(route.params.id), selected.value);
window.setTimeout(resetTema, 900);
};

</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Activity timeline -->
      <VCard  title="Temas del usuario"  >
        <VCardText>
          <VTable v-if="userTema.length" class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">
                  <VCheckbox
                    :model-value="selectAllCheckbox"
                    :indeterminate="isSelectAllCheckboxIndeterminate"
                    @update:model-value="selectAllCheckboxUpdate"
                  />
                </th>
                <th scope="col"><h6 class="text-base">Nombre</h6></th>

                <th scope="col">
                  <div style="text-align:right">
                    <VBtn
                      prepend-icon="tabler-trash"
                      color="error"
                      :style="{
                        visibility:
                          isSelectAllCheckboxIndeterminate || selectAllCheckbox
                            ? undefined
                            : 'hidden',
                      }"
                      @click="delTema"
                    >
                      Eliminar
                    </VBtn>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tema in userTema"
                :key="tema.name"
                style="height: 3.75rem"
              >
                <!-- 👉 User -->

                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      <VCheckbox
                        :model-value="selected.includes(tema.name)"
                        @update:model-value="toggleSelected(tema.name)"
                        @click.stop
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      {{ tema.name }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </VTable>
          <div v-if="!userTema.length">No hay temas que mostrar aún.</div>
        </VCardText>
      </VCard>
    </VCol>
    <!--
    <VCol cols="12">
      <UserInvoiceTable />
    </VCol>
     -->
  </VRow>
</template>
