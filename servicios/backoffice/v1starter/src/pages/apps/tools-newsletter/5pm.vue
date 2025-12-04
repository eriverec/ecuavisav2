<script setup>
import { useRoute } from "vue-router";
import NewsletterTabs from "./components/NewsletterTabs.vue";
import newsletter_5_am from "./components/newsletters/ecuavisa-informa-5pm.vue";

const route = useRoute();
</script>

<template>
	<VRow>
		<VCol cols="12" md="3">
			<!-- Tabs como navegación -->
			<NewsletterTabs :active-index="1" />
		</VCol>
		<VCol cols="12" md="9">
			<!-- Contenido principal -->
			<div class="content">
				<!-- Componente para newsletter de las 7am -->
			<newsletter_5_am />
			</div>
		</VCol>
	</VRow>
</template>
