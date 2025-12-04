<script setup>
import { useRoute } from "vue-router";
import NewsletterTabs from "./components/NewsletterTabs.vue";
import newsletter_estadio from "./components/newsletters/estadio.vue";

const route = useRoute();
</script>

<template>
	<VRow>
		<VCol cols="12" md="3">
			<!-- Tabs como navegación -->
			<NewsletterTabs :active-index="2" />
		</VCol>
		<VCol cols="12" md="9">
			<!-- Contenido principal -->
			<div class="content">
				<!-- Componente para newsletter de las 7am -->
			<newsletter_estadio />
			</div>
		</VCol>
	</VRow>
</template>