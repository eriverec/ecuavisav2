<script setup>
import { useUserListStore } from "@/views/apps/user/useUserListStore";

import UserTabNavegacion from "@/views/dashboards/traceabilityGlobal/UserTab1.vue";
import UserTabDispositivos from "@/views/dashboards/traceabilityGlobal/UserTab2.vue";
import UserTabIntereses from "@/views/dashboards/traceabilityGlobal/UserTab3.vue";
import UserTabUbicacion from "@/views/dashboards/traceabilityGlobal/UserTab4.vue";

const userListStore = useUserListStore();

const userTab = ref(null);
const tabs = [
  {
    icon: "tabler-abc",
    title: "item1",
  },
  {
    icon: "tabler-abc",
    title: "Item2",
  },
  {
    icon: "tabler-abc",
    title: "Item3",
  },
  {
    icon: "tabler-abc",
    title: "Item4",
  },
];
</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">
        <VTabs v-model="userTab" class="">
          <VTab v-for="tab in tabs" :key="tab.icon">
            <VIcon :size="18" :icon="tab.icon" class="me-1" />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs>

        <VWindow
          v-model="userTab"
          class="mt-6 disable-tab-transition"
          :touch="false"
        >
          <!-- NAVEGACION -->
          <VWindowItem>
            <UserTabNavegacion />
          </VWindowItem>

          <!-- DISPOSITIVOS -->
          <VWindowItem>
            <UserTabDispositivos />
          </VWindowItem>

          <!-- INTERESES -->
          <VWindowItem>
            <UserTabIntereses />
          </VWindowItem>

          <!-- UBICACIONES -->
          <VWindowItem>
            <UserTabUbicacion />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
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

.loader-section {
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  //background-color: rgba(114, 111, 116, 0.2);
  margin-top: -5%;
  z-index: 999;
  //transition: all 1s 1s ease-out;
  opacity: 1;
}
.loaded {
  opacity: 0;
  z-index: -1;
}
</style>
