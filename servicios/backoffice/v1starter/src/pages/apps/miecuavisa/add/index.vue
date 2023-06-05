<script setup>
import axios from '@axios';
import {
  emailValidator,
  requiredValidator,
} from '@validators';

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
                    <VCardTitle v-if="usuarioFielModel">Agregar un banner </VCardTitle>
                    <VCardSubtitle> Añadir banner </VCardSubtitle>
                  </div>
                  
                </div>

                <VForm class="mt-2" @submit.prevent="handleSubmit">
                  <VRow>
                    <VCol md="6" cols="12" >
                      <VTextField v-model="suggestion.name" id="name" label="Nombre del banner" :rules="[requiredValidator]" />
                    </VCol>

                    <VCol md="6" cols="12" >
                      <VSelect style="width: 100%;" class="" v-model="selectedOption" :items="items_url" label="Donde visualizar"
                      clearable clear-icon="tabler-x" :searchable="false" />
                    </VCol>

                    <VCol md="6" cols="12" >
                      <VTextField label="URL de imagen para escritorio"  id="url_escritorio" v-model="suggestion.escritorio" :rules="[requiredValidator]"  />
                      <p>Tamaño recomendado: 1121x375 px</p>
                    </VCol>

                    <VCol md="6" cols="12" >
                      <VTextField label="URL de imagen para dispositivos móviles"  id="url_movil" v-model="suggestion.mobile" />
                    </VCol>
                    <!-- 👉 Checkbox -->

                    <VCol cols="12" md="9" >
                      <VCheckbox  v-model="suggestion.estado" id="estado" label="Publicado" />
                      

                    </VCol>
                    <VCol cols="12" md="9" >
                      <VBtn type="submit" class="mr-4"> Agregar item </VBtn>
                      <RouterLink to="./list">
                          <VBtn
                          color="primary"
                          variant="tonal"
                          >
                          Cancelar
                        </VBtn> 
                      </RouterLink>
                      
                    </VCol>
                  </VRow>
                </VForm>
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
      items_url: [
        { value: "https://www.ecuavisa.com/servicios/mi-ecuavisa/", title: 'Landgin Mi Ecuavisa' },
      ],
      selectedOption: null,
      usuarioFielModel:500,
      datos: [],
      suggestion: {
        name: "",
        url: "",
        escritorio: "",
        mobile: "",
        estado: true,
      },
      maxRegistros:500,
      currentTab: 'tab-agregar'
    };
  },
  watch: {
    async selectedOption(newVal, oldVal) {
      this.suggestion.url = newVal;
    }
  },
  mounted() {
  },
  methods: {

    async handleSubmit() {
      try {
        let data = JSON.stringify(this.suggestion);
        if(this.suggestion.name.length < 1){
          return false;
        }
        if(this.suggestion.escritorio.length < 1){
          return false;
        }
        var myHeaders = new Headers();
        var raw = data;
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("https://estadisticas.ecuavisa.com/sites/gestor/Tools/miecuavisa/ajax.php", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result)
            this.$router.push("/apps/miecuavisa/list");})
          .catch(error => console.log('error', error));
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
