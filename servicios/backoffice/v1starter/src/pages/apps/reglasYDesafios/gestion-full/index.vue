<script setup>
// import FidelizacionTab from './FidelizacionTab.vue';
import GestionDesafios from "@/views/apps/reglasYDesafios/GestionDesafios/index.vue";
import GestionSemanas from "@/views/apps/reglasYDesafios/GestionSemanas/index.vue";
import GestionCategorias from "@/views/apps/reglasYDesafios/GestionCategorias/index.vue";
import GestionTrivias from "@/views/apps/reglasYDesafios/GestionTrivias/index.vue";
import GestionVideosHistoricos from "@/views/apps/reglasYDesafios/GestionVideosHistoricos/index.vue";
import GestionSellosHistoricos from "@/views/apps/reglasYDesafios/GestionSellosHistoricos/index.vue";


const tabActual = ref('tab-lista')
const isDialogVisible = ref(false)
const currentTab_fidelizacion = ref(0)
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12" md="12" lg="12">

        <VCard class="mt-5">
          <VCardText>
            <!-- <FidelizacionTab /> -->

            <div class="py-5 gap-4 align-items-center">
              <VCardTitle>Módulos de Fidelización</VCardTitle>
            </div>
            <!-- content here -->
            <VRow>
              <VCol cols="12" lg="12" class="mx-auto px-7 my-3 mb-6 align-items-center">
                <div class="d-flex flex-row gap-4">
                  <VTabs v-model="currentTab_fidelizacion" direction="vertical" class="v-tabs-pill">
                    <VTab class="mb-2">
                      <VIcon start icon="mdi-mixer" />
                      Desafíos
                    </VTab>

                    <VTab class="mb-2">
                      <VIcon start icon="mdi-chemical-weapon" />
                      Semanas desafíos
                    </VTab>

                    <VTab class="mb-2">
                      <VIcon start icon="mdi-category" />
                      Categorías
                    </VTab>

                    <VTab class="mb-2">
                      <VIcon start icon="mdi-movie-roll" />
                      Trivias
                    </VTab>

                    <VTab class="mb-2">
                      <VIcon start icon="mdi-file-video" />
                      Videos Consumos
                    </VTab>

                    <VTab class="mb-2">
                      <VIcon start icon="mdi-weather-sunny" />
                      Sellos logrados
                    </VTab>
                  </VTabs>
                  <VDivider vertical />

                  <VWindow v-model="currentTab_fidelizacion" class="ms-3 ultimaSeccionLast">
                    <!-- DESAFÍOS -->
                    <VWindowItem>
                      <VRow>
                        <!-- texto, título y subtítulo -->
                        <VCol cols="12" sm="12" class="d-flex flex-column align-items-start justify-content-center">
                          <VCardTitle class="px-0 py-0 mb-2">Gestionar "Desafíos"</VCardTitle>
                          <VCardSubtitle class="px-0 py-0 mb-2">Gestiona tus desafíos semanales</VCardSubtitle>
                          <p class="pt-3 text-left">
                            El módulo "Desafíos" te permite gestionar los desafíos de una semana definida. Desde este
                            módulo,
                            puedes crear nuevos desafíos, establecer la hora y las fechas de cada uno, así como editar o
                            eliminar los desafíos existentes.
                            Mantén un control preciso sobre tus desafíos semanales y mantén tu rutina organizada con
                            esta útil
                            herramienta de gestión.
                          </p>

                          <!-- <VBtn class="mt-0" variant="tonal"
                            :to="{ name: 'apps-reglasYDesafios-GestionDesafios', params: { id: 0 } }">
                            Gestionar
                          </VBtn> -->
                          <GestionDesafios />
                        </VCol>

                   
                      </VRow>
                    </VWindowItem>

                    <!--SEMANA DASAFIOS--->

                    <VWindowItem>
                      <VRow>
                        <!-- texto, título y subtítulo -->
                        <VCol cols="12" sm="12" class="d-flex flex-column align-items-start justify-content-center">
                          <VCardTitle class="px-0 py-0 mb-2">Gestiona "Semanas de Desafíos"</VCardTitle>
                          <VCardSubtitle class="px-0 py-0 mb-2">Organiza tus desafíos por semana</VCardSubtitle>
                          <p class="pt-3 text-left">
                            El módulo de "Semanas de Desafíos" te permite administrar y organizar las semanas en las que
                            tendrán
                            lugar tus desafíos. Aquí podrás definir las semanas específicas en las que se llevarán a
                            cabo tus
                            desafíos y asociar múltiples desafíos a cada semana. Mantén un registro ordenado de tus
                            desafíos
                            semanales y planifica tus actividades con facilidad utilizando esta útil herramienta de
                            gestión.
                          </p>

                          <!-- <VBtn class="mt-0" variant="tonal" :to="{ name: 'apps-semana_desafios', params: { id: 0 } }">
                            Gestionar
                          </VBtn> -->

                          <GestionSemanas />
                        </VCol>


                      </VRow>
                    </VWindowItem>


                    <!-- CATEGORIAS -->
                    <VWindowItem>
                      <VRow>
                        <!-- texto, título y subtítulo -->
                        <VCol cols="12" sm="12" class="d-flex flex-column align-items-start justify-content-center">
                          <VCardTitle class="px-0 py-0 mb-2">Gestiona las categorías</VCardTitle>
                          <!-- <VCardSubtitle class="px-0 py-0 mb-2">Organiza tus desafíos por semana</VCardSubtitle> -->
                          <p class="pt-3 text-left">
                            Definir los objetivos específicos para cada categoría y las reglas que los participantes
                            deben
                            seguir. Esto puede incluir metas diarias o semanales, criterios de evaluación y pautas para
                            la
                            participación.
                          </p>

                          <GestionCategorias />
                        </VCol>

                      </VRow>
                    </VWindowItem>

                    <!--TRIVIAS-->

                    <VWindowItem>
                      <VRow>
                        <!-- texto, título y subtítulo -->
                        <VCol cols="12" sm="12" class="d-flex flex-column align-items-start justify-content-center">
                          <VCardTitle class="px-0 py-0 mb-2">Gestiona "Trvias"</VCardTitle>
                          <VCardSubtitle class="px-0 py-0 mb-2">Crea y gestiona las trivias para cada desafío
                          </VCardSubtitle>
                          <p class="pt-3 text-left">
                            El módulo de Trivias se integra estrechamente con el módulo de Desafíos. Aquí puedes crear
                            trivias
                            que complementan tus desafíos principales.
                            Desde preguntas de opción múltiple hasta verdadero o falso, este módulo te permite
                            personalizar el
                            tipo de trivia que deseas incluir en tus desafíos.
                          </p>

                          <GestionTrivias />

                        </VCol>

                      </VRow>
                    </VWindowItem>

                    <!--VIDEOS CONSUMO-->

                    <VWindowItem>
                      <VRow>
                        <!-- texto, título y subtítulo -->
                        <VCol cols="12" sm="12" class="d-flex flex-column align-items-start justify-content-center">
                          <VCardTitle class="px-0 py-0 mb-2">Gestiona "Video Consumo"</VCardTitle>
                          <VCardSubtitle class="px-0 py-0 mb-2">Controla el tiempo de visualización con el Módulo de
                            Video
                            Consumo</VCardSubtitle>
                          <p class="pt-3 text-left">
                            El módulo de Video Consumo te permite gestionar y monitorear el tiempo de visualización de
                            videos dentro de tus desafíos. <br>on este módulo, puedes establecer desafíos específicos
                            que
                            requieren que los participantes vean videos durante ciertos períodos de tiempo.
                            Por ejemplo, podrías crear desafíos que incentiven a los usuarios a ver un video completo
                            durante al
                            menos 2 minutos.
                            <br>Con esta funcionalidad, puedes medir y recompensar el tiempo dedicado a la visualización
                            de
                            contenido multimedia, lo que garantiza un compromiso efectivo con tus actividades y
                            desafíos.
                          </p>

                          <GestionVideosHistoricos />

                        
                        </VCol>

                  
                        
                      </VRow>
                    </VWindowItem>


                    <VWindowItem>
                     
                        <!-- texto, título y subtítulo -->
                    
                          <VCardTitle class="px-0 py-0 mb-2">Gestiona los Sellos Logrados</VCardTitle>
                          <VCardSubtitle class="px-0 py-0 mb-2">Organiza y Gestiona los sellos logrados de usuarios
                          </VCardSubtitle>
                          <p class="pt-3 text-left">
                            Verifica los sellos ganados de usuarios con su respectiva semana.
                            
                          </p>

                          <GestionSellosHistoricos />
                       

                 
                    </VWindowItem>

                  </VWindow>
                </div>
              </VCol>
            </VRow>

          </VCardText>
        </VCard>

      </VCol>
    </VRow>

  </section>


</template>
<style scoped>
/*.v-card.v-theme--dark .iframe-dark {  display: block; }*/
</style>
<style lang="scss">
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.ultimaSeccionLast {
  width: 100%;
}

iframe {
  height: 90vh;
}
</style>
<script>


export default {
  components: {
    GestionDesafios,
    GestionSemanas,
    GestionCategorias,
    GestionTrivias,
    GestionVideosHistoricos,
    GestionSellosHistoricos,
    // Otros componentes si los hubiera
  },
  data() {
    return {
      datos: []
    };
  },


};
</script>

<style scoped>
#kanban {
  display: flex;
  justify-content: space-between;
}

.column {
  width: 200px;
  border: 1px solid #ccc;
  padding: 10px;
}

.card {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 5px;
}

.label {
  display: inline-block;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 2px 5px;
  margin-right: 5px;
}
</style>