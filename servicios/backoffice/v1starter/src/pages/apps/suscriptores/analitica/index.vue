<script setup>
import analitica_grafico_1 from '@/views/apps/suscripciones/analitica_grafico_1.vue';
import analitica_grafico_2_pago_dia from '@/views/apps/suscripciones/analitica_grafico_2_pago_dia.vue';
import analitica_grafico_barras_pagos from '@/views/apps/suscripciones/analitica_grafico_barras_pagos.vue';
import analitica_grafico_barras_suscritos from '@/views/apps/suscripciones/analitica_grafico_barras_suscritos.vue';
import analitica_grafico_suscritos_dia from '@/views/apps/suscripciones/analitica_grafico_suscritos_dia.vue';
import Datos from '@/views/apps/suscripciones/datos.vue';
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
		<Datos />

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
      	<analitica_grafico_2_pago_dia />

    	</VCol>
    </VRow>

	<VRow>
    	<VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="6"
      >
      	<analitica_grafico_barras_pagos />

    	</VCol>

		<VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="6"
      >
      	<analitica_grafico_barras_suscritos />

    	</VCol>

    </VRow>

	<VRow>
    	<VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="6"
      >
      	<analitica_grafico_suscritos_dia />

    	</VCol>

		

    </VRow>
	</section>
</template>

<style scoped>

</style>

