<script setup>
import { useRoute } from "vue-router";
import NewsletterTabs from "./components/NewsletterTabs.vue";
import newsletter_ultima_hora from "./components/newsletters/ultima-hora.vue";

const route = useRoute();
</script>

<template>
	<VRow>
		<VCol cols="12" md="3">
			<!-- Tabs como navegación -->
			<NewsletterTabs :active-index="4" />
		</VCol>
		<VCol cols="12" md="9">
			<!-- Contenido principal -->
			<div class="content">
				<!-- Componente para newsletter de las 7am -->
			<newsletter_ultima_hora />
			</div>
		</VCol>
	</VRow>
</template>