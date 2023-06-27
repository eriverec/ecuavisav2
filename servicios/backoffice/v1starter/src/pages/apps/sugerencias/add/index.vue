<script setup>

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
import axios from '@axios';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]); 
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
  async mounted() {
    this.authorizedCheck();
    await this.accionBackoffice();
  },
  methods: {

    async handleSubmit() {
      try {
        const response = await axios.post(
          "https://sugerencias-ecuavisa.vercel.app/add",
          this.suggestion
        );
       
       let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
       let userData = JSON.parse(localStorage.getItem('userData'));
       var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			 var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "interesesSugerencias-agregar",
            "accion": "agregar",
            "data": this.suggestion,
            "fecha": dateNow
					});
			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: log,
				redirect: 'follow'
			};
			await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
			.then(response =>{			
			}).catch(error => console.log('error', error));
        this.$router.push("/apps/sugerencias/list");
      } catch (error) {
        console.error(error);
      }
    },
    authorizedCheck (){
    let rol = localStorage.getItem('role');
    if(rol !== 'administrador' && rol !== 'webmaster'){
      this.$router.push({ path: '/pages/errors/not-authorized' })
     }
    },
    async accionBackoffice (){
      let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
      let userData = JSON.parse(localStorage.getItem('userData'));
      if(userData.email !== 'admin@demo.com' ){
      var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
          var log = JSON.stringify({
                "usuario": userData.email,   
                "pagina": "interesesSugerencias-agregar",
                "fecha": dateNow
              });
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: log,
            redirect: 'follow'
          };
          await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
          .then(response =>{			
          }).catch(error => console.log('error', error));
        }
      }
  },
};
</script>
