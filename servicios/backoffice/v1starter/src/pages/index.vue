<script setup>
import { useUserListStore } from "@/views/apps/user/useUserListStore";

const userListStore = useUserListStore();
const totalUsers = ref(0);
const totalFacebook = ref(0);
const totalGoogle = ref(0);
const totalEmail = ref(0);
const percentEmail = ref(0);
const percentFacebook = ref(0);
const percentGoogle = ref(0);

// 👉 Fetching users

const countUsers = () => {
  userListStore
    .countUsers()
    .then((response) => {
      let pE = ref(0);
      let pF = ref(0);
      let pG = ref(0);
      totalUsers.value = response.data.totalUsers;
      totalEmail.value = response.data.totalEmail;
      totalFacebook.value = response.data.totalFacebook;
      totalGoogle.value = response.data.totalGoogle;
      
      let total = totalUsers.value;

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
    </VRow>
  </section>
</template>
