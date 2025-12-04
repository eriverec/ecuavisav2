<script setup>
import { useRoute } from "vue-router";
import NewsletterTabs from "./components/NewsletterTabs.vue";
import newsletter_entretenimiento from "./components/newsletters/ecuavisa-entretenimiento.vue";

const route = useRoute();
</script>

<template>
	<VRow>
		<VCol cols="12" md="3">
			<!-- Tabs como navegación -->
			<NewsletterTabs :active-index="3" />
		</VCol>
		<VCol cols="12" md="9">
			<!-- Contenido principal -->
			<div class="content">
				<!-- Componente para newsletter de las 7am -->
			<newsletter_entretenimiento />
			</div>
		</VCol>
	</VRow>
</template>