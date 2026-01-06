<script setup>
import { useRoute } from "vue-router";
import MenuTabs from "./components/MenuTabs.vue";
import Codigorojas from "./components/codigo-rojas/index.vue";

const route = useRoute();
</script>

<template>
    <VRow>
        <VCol cols="12" md="3">
            <!-- Tabs como navegación -->
            <MenuTabs :active-index="0" />
        </VCol>
        <VCol cols="12" md="9">
            <!-- Contenido principal -->
            <div class="content">
                <!-- Componente para newsletter de las 7am -->
                <Codigorojas />
            </div>
        </VCol>
    </VRow>
</template>