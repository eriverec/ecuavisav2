<script setup>
import { useRoute } from "vue-router";
import NewsletterTabs from "./components/NewsletterTabs.vue";
import newsletter_7_am from "./components/newsletters/ecuavisa-informa-7am.vue";

const route = useRoute();
</script>

<template>
	<div class="d-flex gap-4">
		<!-- Tabs como navegación -->
		<NewsletterTabs :active-index="0" />

		<!-- Contenido principal -->
		<div class="content">
			<!-- Componente para newsletter de las 7am -->
			<newsletter_7_am />
		</div>
	</div>
</template>