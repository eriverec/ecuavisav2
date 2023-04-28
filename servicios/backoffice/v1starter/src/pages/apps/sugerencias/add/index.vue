<script setup>
import axios from '@axios';

const currentTab = ref('tab-agregar')
</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill d-none">
          <VTab value="tab-agregar">Agregar</VTab>
          <VTab value="tab-lista">new tab</VTab>
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-agregar">
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
                  <div>
                    <VCardTitle v-if="usuarioFielModel">Agrega un temas de interés para sugerirlo en ecuavisa.com </VCardTitle>
                    <VCardSubtitle> Al sugerir un tema nuevo y habilitarlo, aparecerá en el área de perfil del sitio </VCardSubtitle>
                  </div>
                  
                </div>

                <VForm class="mt-2" @submit.prevent="handleSubmit">
                  <VRow>
                    <VCol md="6" cols="12" >
                      <VTextField v-model="suggestion.title" id="title" label="Título" />
                    </VCol>

                    <VCol md="6" cols="12" >
                      <VTextField label="Descripción"  id="description" v-model="suggestion.description" />
                    </VCol>
                    <!-- 👉 Checkbox -->
                    <VCol cols="12" md="9" >
                      <VCheckbox  v-model="suggestion.estado" id="estado" label="Publicado" />
                      <VBtn type="submit" class="mt-4"> Agregar item </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VWindowItem>

              <VWindowItem value="tab-lista">
                <p>Próximamente</p>
              </VWindowItem>


            </VWindow>
          </VCardText>
        </VCard>

      </VCol>
    </VRow>
  </section>
</template>

<script>
export default {
  data() {
    return {
      usuarioFielModel:500,
      datos: [],
      suggestion: {
        title: "",
        description: "",
        estado: true,
      },
      maxRegistros:500,
      currentTab: 'tab-agregar'
    };
  },
  watch: {
  },
  mounted() {
  },
  methods: {

    async handleSubmit() {
      try {
        const response = await axios.post(
          "https://sugerencias-ecuavisa.vercel.app/add",
          this.suggestion
        );
        this.$router.push("/apps/sugerencias/list");
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
