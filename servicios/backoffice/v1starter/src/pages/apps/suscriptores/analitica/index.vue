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
      <VCol class="mt-6" cols="12" md="12" lg="12">
        <VTabs v-model="tabActual" class="v-tabs-pill">
          <VTab value="tab-general">
            <VIcon icon="mdi-chart-box" class="me-2" size="20" />
            General
          </VTab>
          <VTab value="tab-reembolsos">
            <VIcon icon="mdi-cash-refund" class="me-2" size="20" />
            Reembolsos
          </VTab>
        </VTabs>

        <VCard class="mt-5 card">
          <VCardText>
            <VWindow v-model="tabActual" >
              <!-- Tab General -->
              <VWindowItem value="tab-general" >
                <VCardTitle class="datos-titulo">Métricas de suscripciones generales</VCardTitle>
                <VCardSubtitle class="mb-5 datos-subt">Analíticas de suscripciones y pagos por mes y año.</VCardSubtitle>
               
                  <VRow class="ml-2 mr-2 mb-2">

                  <VCol class="mt-0" cols="12" md="12" lg="12" >
                    <analitica_suscripciones />
                  </VCol>

                  <VCol cols="12" md="6" lg="6">
                    <analitica_grafico_barras_semana_dia />
                  </VCol>

                  <VCol cols="12" md="6" lg="6">
                    <analitica_grafico_2_pago_dia />
                  </VCol>

                  <VCol cols="12" md="6" lg="6">
                    <analitica_grafico_1 />
                  </VCol>

                  <VCol cols="12" md="6" lg="6">
                    <analitica_grafico_barras_pagos />
                  </VCol>

                  <!-- <VCol cols="12" md="6" lg="6" >
                    <analitica_grafico_barras_suscritos />
                  </VCol> -->

                  <!-- <VCol cols="12" md="6" lg="6">
                    <analitica_grafico_suscritos_dia />
                  </VCol> -->
                </VRow>
               
                
              </VWindowItem>

              <!-- Tab Reembolsos -->
              <VWindowItem value="tab-reembolsos">
                <VCardTitle class="datos-titulo">Métricas de Reembolsos</VCardTitle>
                <VCardSubtitle class="mb-5 datos-subt">Analíticas de reembolsos por mes y año</VCardSubtitle>
          
                  <VRow class="ml-2 mr-2 mb-2">
                    <VCol cols="12" md="6" lg="6">
                      <r_analitica_grafico_1 />
                    </VCol>

                    <VCol cols="12" md="6" lg="6">
                      <r_analitica_grafico_2_dia />
                    </VCol>
                
                  </VRow>
 
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<script setup>
import analitica_grafico_1 from '@/views/apps/suscripciones/analitica_grafico_1.vue';
import analitica_grafico_2_pago_dia from '@/views/apps/suscripciones/analitica_grafico_2_pago_dia.vue';
import analitica_grafico_barras_pagos from '@/views/apps/suscripciones/analitica_grafico_barras_pagos.vue';
import analitica_grafico_barras_semana_dia from '@/views/apps/suscripciones/analitica_grafico_barras_semana_dia.vue';
import analitica_grafico_barras_suscritos from '@/views/apps/suscripciones/analitica_grafico_barras_suscritos.vue';
import analitica_grafico_suscritos_dia from '@/views/apps/suscripciones/analitica_grafico_suscritos_dia.vue';
import analitica_suscripciones from '@/views/apps/suscripciones/analitica_suscripciones.vue';
import Datos from '@/views/apps/suscripciones/datos.vue';
import r_analitica_grafico_1 from '@/views/apps/suscripciones/reembolso/r_analitica_grafico_1.vue';
import r_analitica_grafico_2_dia from '@/views/apps/suscripciones/reembolso/r_analitica_grafico_2_dia.vue';
import { default as moment } from 'moment';
import 'moment/locale/es';
import { ref } from 'vue';



moment.locale('es')

const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false,
  timeout: 2000
})

const tabActual = ref('tab-general')
const isDialogVisible = ref(false)
</script>


<style>
.datos-titulo {
color: #7367f0;
font-size: 25px;
}

.datos-subt {
color: #7367f0;
font-size: 16px;
}
</style>