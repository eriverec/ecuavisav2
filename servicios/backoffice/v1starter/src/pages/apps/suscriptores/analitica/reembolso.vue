<script setup>
import analitica_grafico_1 from '@/views/apps/suscripciones/reembolso/analitica_grafico_1.vue';
import analitica_grafico_2_dia from '@/views/apps/suscripciones/reembolso/analitica_grafico_2_dia.vue';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
	const moment = extendMoment(Moment);
	moment.locale('es', [esLocale]);

	const configSnackbar = ref({
	    message: "Datos guardados",
	    type: "success",
	    model: false
	});

</script>


<template>
	<section>
		<VSnackbar 
			v-model="configSnackbar.model" 
			location="top end" 
			variant="flat" 
			:timeout="configSnackbar.timeout || 2000" 
			:color="configSnackbar.type">
        {{ configSnackbar.message }}
    </VSnackbar>

    <VRow>

    	<VCol
	        class="mt-0"
	        cols="12"
	        md="12"
	        lg="6"
	    >

      		<analitica_grafico_1 />

    	</VCol>

    	<VCol
	        class="mt-0"
	        cols="12"
	        md="12"
	        lg="6"
	    >

      		<analitica_grafico_2_dia />

    	</VCol>

    </VRow>

	</section>
</template>

<style scoped>

</style>

