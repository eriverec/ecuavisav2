<script setup>
import { useUserListStore } from "@/views/apps/user/useUserListStore";
const userListStore = useUserListStore();
const userNotification = ref([]);
const route = useRoute();
const selectedN = ref([]);

const fetchNotification = () => {
  userListStore.fetchNotification(Number(route.params.id)).then((response) => {
    userNotification.value = response.data.usuario.Notificaciones;
    console.log("Notificaciones", userNotification.value);
  });
};
fetchNotification();

const toggleSelected = (title) => {
  const notificationIndex = selectedN.value.indexOf(title);
  if (notificationIndex === -1) selectedN.value.push(title);
  else selectedN.value.splice(notificationIndex, 1);
};

const selectAllCheckbox = computed(
  () => userNotification.value.length && userNotification.value.length === selectedN.value.length
);

const isSelectAllCheckboxIndeterminate = computed(
  () =>
    Boolean(selectedN.value.length) &&
    userNotification.value.length !== selectedN.value.length
);

const selectAllCheckboxUpdate = () => {
    selectedN.value = !selectAllCheckbox.value
    ? userNotification.value.map((notification) => notification.title)
    : [];
};

const resetNotification = () => {
    selectedN.value = [];
  fetchNotification();
}

const delNotification = () => {
userListStore.deleteNotification(Number(route.params.id), selectedN.value);
window.setTimeout(resetNotification, 900);
};

</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Activity timeline -->
      <VCard  title="Notificaciones del usuario"  >
        <VCardText>
          <VTable v-if="userNotification.length" class="text-no-wrap">
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
                      @click="delNotification"
                    >
                      Eliminar
                    </VBtn>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="notification in userNotification"
                :key="notification.title"
                style="height: 3.75rem"
              >
                <!-- 👉 User -->

                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      <VCheckbox
                        :model-value="selectedN.includes(notification.title)"
                        @update:model-value="toggleSelected(notification.title)"
                        @click.stop
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      {{ notification.title }}
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
          <div v-if="!userNotification.length">No hay notificaciones que mostrar.</div>
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
