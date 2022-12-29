<script setup>
import AddNewUserDrawer from "@/views/apps/user/list/AddNewUserDrawer.vue";
import { useUserListStore } from "@/views/apps/user/useUserListStore";
import { avatarText } from "@core/utils/formatters";


import avatar1 from "@/assets/images/avatars/avatar-1.png";
import avatar2 from "@/assets/images/avatars/avatar-2.png";
import avatar3 from "@/assets/images/avatars/avatar-3.png";
import avatar4 from "@/assets/images/avatars/avatar-4.png";
import avatar5 from "@/assets/images/avatars/avatar-5.png";
import avatar6 from "@/assets/images/avatars/avatar-6.png";
import avatar7 from "@/assets/images/avatars/avatar-7.png";
import avatar8 from "@/assets/images/avatars/avatar-8.png";

const userListStore = useUserListStore()
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const rowPerPage = ref(10);
const page = ref(1);
const totalPage = ref(1);
const totalUsers = ref(0);
const totalFacebook = ref(0);
const totalGoogle = ref(0);
const totalEmail = ref(0);
const users = ref([]);
const percentEmail = ref(0);
const percentFacebook = ref(0);
const percentGoogle = ref(0);

// 👉 Fetching users
const fetchUsers = () => {
  userListStore
    .fetchUsers({
      pageSize: rowPerPage.value,
      page: page.value,
    })
    .then((response) => {
      users.value = response.data.users;
      totalPage.value = response.data.totalPage;
      totalUsers.value = response.data.totalUsers;
    })
    .catch((error) => {
      console.error(error);
    });
};

const countUsers = () => {
  userListStore
    .countUsers()
    .then((response) => {
      let pE = ref(0);
      let pF = ref(0);
      let pG = ref(0);
      let total = totalUsers.value;
      totalEmail.value = response.data.totalEmail;
      totalFacebook.value = response.data.totalFacebook;
      totalGoogle.value = response.data.totalGoogle;

      pE.value = (totalEmail.value * 100 ) / total;
      percentEmail.value = Math.round((pE.value + Number.EPSILON) * 100) / 100;

      pF.value = (totalFacebook.value * 100 ) / total;
      percentFacebook.value = Math.round((pF.value + Number.EPSILON) * 100) / 100;

      pG.value = (totalGoogle.value * 100 ) / total;
      percentGoogle.value = Math.round((pG.value + Number.EPSILON) * 100) / 100;
      

    })
    .catch((error) => {
      console.error(error);
    });
};
countUsers();

watchEffect(fetchUsers)

// 👉 watching current page
watchEffect(() => {
  if (page.value > totalPage.value) page.value = totalPage.value;
});

// 👉 search filters
const roles = [
  {
    title: "Admin",
    value: "admin",
  },
  {
    title: "Author",
    value: "author",
  },
  {
    title: "Editor",
    value: "editor",
  },
  {
    title: "Maintainer",
    value: "maintainer",
  },
  {
    title: "Subscriber",
    value: "subscriber",
  },
];

const plans = [
  {
    title: "Basic",
    value: "basic",
  },
  {
    title: "Company",
    value: "company",
  },
  {
    title: "Enterprise",
    value: "enterprise",
  },
  {
    title: "Team",
    value: "team",
  },
];

const status = [
  {
    title: "Pending",
    value: "pending",
  },
  {
    title: "Active",
    value: "active",
  },
  {
    title: "Inactive",
    value: "inactive",
  },
];

const resolveUserRoleVariant = (provider) => {
  if (provider === "google")
    return {
      color: "warning",
      icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    };
  if (provider === "facebook")
    return {
      color: "success",
      icon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
    };

  return {
    color: "primary",
    icon: "tabler-user",
  };
};

const resolveUserStatusVariant = (stat) => {
  if (stat === "false") return "error";
  if (stat === "true") return "success";
  if (stat === "inactive") return "secondary";

  return "primary";
};

const isAddNewUserDrawerVisible = ref(false);

// 👉 watching current page
watchEffect(() => {
  if (page.value > totalPage.value) page.value = totalPage.value;
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length
    ? (page.value - 1) * rowPerPage.value + 1
    : 0;
  const lastIndex =
    users.value.length + (page.value - 1) * rowPerPage.value;

  return `Showing ${firstIndex} to ${lastIndex} of ${totalUsers.value} entries`;
});

const addNewUser = (userData) => {
  userListStore.addUser(userData);

  // refetch User
  fetchUsers();
};


// 👉 List
const userListMeta = [
  {
    icon: "tabler-user",
    color: "primary",
    title: "Total de Usuarios",
    stats: totalUsers,
    percentage: null ,
    subtitle: "",
  },
  {
    icon: "tabler-mail",
    color: "error",
    title: "Total con Email",
    stats: totalEmail,
    percentage: percentEmail,
    subtitle: "",
  },
  {
    icon: "tabler-brand-facebook",
    color: "success",
    title: "Total con Facebook",
    stats: totalFacebook,
    percentage: percentFacebook,
    subtitle: "",
  },
  {
    icon: "tabler-brand-google",
    color: "warning",
    title: "Total con Google",
    stats: totalGoogle,
    percentage: percentGoogle,
    subtitle: "",
  },
];

/*const usersData = [
  {
    wylexId: 1,
    first_name: 'Galen Slixby',
    last_name: 'Silid',
    provider: 'Google',
    country: 'El Salvador',
    phone_number: '(479) 232-9151',
    email: 'gslixby0@abc.net.au',
    newsletter_opt_in: 'true',
    avatar: '',

    // role: 'editor',
    // currentPlan: 'enterprise',
    // billing: 'Auto Debit',
  },
  {
    wylexId: 2,
    first_name: 'Halsey Redmore',
    last_name: 'Silid',
    provider: 'Facebook',
    country: 'Albania',
    phone_number: '(472) 607-9137',
    email: 'hredmore1@imgur.com',
    newsletter_opt_in: 'true',
    avatar: avatar1,

    // role: 'author',
   
  },
  {
    wylexId: 3,
    first_name: 'Maggy Hurran',
    last_name: 'Silid',
    provider: 'Google',
    country: 'Pakistan',
    phone_number: '(669) 914-1078',
    email: 'mhurran4@yahoo.co.jp',
    newsletter_opt_in: 'false',
    avatar: avatar1,

    // currentPlan: 'enterprise',
    // role: 'subscriber',
  },
  {
    wylexId: 4,
    first_name: 'Marjory Sicely',
    last_name: 'Silid',
    provider: 'Facebook',
    country: 'Russia',
    phone_number: '(321) 264-4599',
    email: 'msicely2@who.int',
    newsletter_opt_in: 'true',
    avatar: avatar1,

    // currentPlan: 'enterprise',
    // role: 'maintainer',
  },
  {
    wylexId: 5,
    first_name: 'Cyrill Risby',
    last_name: 'Silid',
    provider: 'Facebook',
    country: 'China',
    phone_number: '(923) 690-6806',
    email: 'crisby3@wordpress.com',
    newsletter_opt_in: 'true',
    avatar: avatar3,

    // currentPlan: 'team',
    // role: 'maintainer',
  },

]*/

</script>

<template>
  <section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h6">
                  {{ meta.stats }}
                </h6>
                <span
                  class="text-success" :hidden="meta.percentage ? false : true " 
                  >({{ meta.percentage }}%) </span
                >
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->
          <!--
            <VCardText>
            <VRow>
       
            <VCol
            cols="12"
            sm="4"
            >
            <VSelect
            v-model="selectedRole"
            label="Select Role"
            :items="roles"
            clearable
            clear-icon="tabler-x"
            />
            </VCol>
            <VCol
            cols="12"
            sm="4"
            >
            <VSelect
            v-model="selectedPlan"
            label="Select Plan"
            :items="plans"
            clearable
            clear-icon="tabler-x"
            />
            </VCol>
 
            <VCol
            cols="12"
            sm="4"
            >
            <VSelect
            v-model="selectedStatus"
            label="Select Status"
            :items="status"
            clearable
            clear-icon="tabler-x"
            />
            </VCol>
            </VRow>
            </VCardText> 
          -->

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3" style="width: 80px">
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div>

            <VSpacer />

            <div
              class="app-user-search-filter d-flex align-center flex-wrap gap-4"
            >
              <!-- 👉 Search  -->
              <div style="width: 10rem">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>

              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn>

              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New User
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">Nombres</th>
                <th scope="col">Proveedor</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Contacto</th>
                <th scope="col">Newsletter</th>
                <th scope="col">ACTIONS</th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="user in users"
                :key="user.wylexId"
                style="height: 3.75rem"
              >
                <!-- 👉 User -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar variant="tonal" class="me-3" size="38">
                      <VImg v-if="user.avatar" :src="user.avatar" />
                      <span v-else>{{ avatarText(user.first_name) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <RouterLink
                          :to="{
                            name: 'apps-user-view-id',
                            params: { id: user.wylexId },
                          }"
                          class="font-weight-medium user-list-name"
                        >
                          {{ user.first_name }} {{ user.last_name }}
                        </RouterLink>
                      </h6>
                      <span class="text-sm text-disabled"
                        >@{{ user.email }}</span
                      >
                    </div>
                  </div>
                </td>

                <!-- 👉 Provider -->
                <td>
                  <div class="d-flex align-center">
                    <span
                      class="me-3"
                      v-html="resolveUserRoleVariant(user.provider).icon"
                    />
                    <div class="d-flex flex-column">
                      <span class="text-capitalize text-base">{{
                        user.provider
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 Ciudad -->
                <td>
                  <span class="text-sm">{{ user.country }}</span>
                </td>

                <!-- 👉 Telefono -->
                <td>
                  <span class="text-base">{{ user.phone_number }}</span>
                </td>

                <!-- 👉 Newsletter -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(user.newsletter_opt_in)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ user.newsletter_opt_in }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          title="View"
                          :to="{
                            name: 'apps-user-view-id',
                            params: { id: user.id },
                          }"
                        />
                        <VListItem title="Suspend" href="javascript:void(0)" />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <!--
              <tfoot v-show="!users.length">
              <tr>
              <td
              colspan="7"
              class="text-center"
              >
              No data available
              </td>
              </tr>
              </tfoot> 
            -->
          </VTable>

          <VDivider />

          <VCardText
            class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
          >
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination
              v-model="page"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

svg {
  vertical-align: middle;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
