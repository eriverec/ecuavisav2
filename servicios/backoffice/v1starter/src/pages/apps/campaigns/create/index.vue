<script setup>
import {FormWizard,TabContent} from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css'
const currentTab = ref('tab-lista');
const checkbox = ref(false);
const loadingWizard = ref(false);
const loadingPanel = ref(false);
const dataCampaigns = ref([]);
const dataCountry = ref([]);
// const modelPaises = ref(null);
const cityList = ref([]);
const countryList = ref([]);
// const FormWizard = ref(false);
// const TabContent = ref(false);

const nombreCampania = ref('')
const codigoExternoModel = ref('')
const linkAds = ref('')
const linkImageEscritorio = ref('')
const linkImageMobile = ref('')
const languages = ref([])
const criterio = ref([])
const posicion = ref([]);
const selectedItem = ref([]);
const selectedItemCiudad = ref([]);
const dataUsuarios = ref({});
const selectItemParticipantes = ref(null);
const selectItemsList = ref([{ title:'Otro', value: 'Otro' },{ title:'100', value: '100' }]);

const languageList = [{
  title:'Imágenes locales',
  value:'imagen'
},{
  title:'Códigos externos',
  value:'html'
},{
  title:'Códigos ADS',
  value:'script'
}]

const criterioList = [{ title:'Geolocalización', value:'trazabilidad' }];//, { title:'Metadatos', value:'metadato' }

const posicionList = [
  'floating_ad',
  'RDTop1',
  'RDTop2',
  'RDTop3',
  'RDRDFloating',
]


onMounted(getCampaigns)

async function getCampaigns(){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var response = await fetch(`https://ads-service.vercel.app/campaign/get/all`, requestOptions);
  const data = await response.json();
  dataCampaigns.value = data.data;

}

async function getCountries(){
  var myHeaders = new Headers();
  loadingPanel.value=true;
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var response = await fetch(`https://ads-service.vercel.app/campaign/get/all/paisesyciudad`, requestOptions);
  const data = await response.json();
  dataCountry.value = data;
  loadingPanel.value=false;
}

async function getUsuarios(){
  var ciudad = selectedItemCiudad.value;
  var pais = selectedItem.value;

  if(ciudad != '' && ciudad != null && pais != '' && pais != null){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    var response = await fetch(`https://ads-service.vercel.app/campaign/get/user/total/${pais}/${ciudad}`, requestOptions);
    const data = await response.json();
    dataUsuarios.value = data;
  }
}

const consentimiento = ref(false);

async function onComplete() {
  if (checkbox.value) {
    alert("Formulario completado");
  } else {
    alert("Debes aceptar los términos y condiciones para continuar.");
  }
}

async function handleValidation(isValid, tabIndex) {
  if(tabIndex == 1 && isValid == true){
    await getCountries();

    var paises = [];
    for(var i in dataCountry.value){
      var ins = dataCountry.value[i];
      paises.push({ title:ins.country, value:ins.country });
    }

    // console.log(paises)
    countryList.value = paises;

  }
  // console.log('Tab: '+tabIndex+ ' valid: '+isValid)
  return false;
}

async function handleValidationChange(prevIndex, nextIndex) {
  // console.log('prevIndex: '+prevIndex+ ' nextIndex: '+nextIndex)
  return false;
}

async function setLoading(value) {
  loadingWizard.value = value
}

async function validateAsync() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;


  if(nombre.length < 1 || nombre.trim() == ""){
    alert("Debes añadir un nombre de campaña");
    return false;
  }

  if(tipoC.length < 1){
    alert("Debes añadir un tipo de contenido");
    return false;
  }

  if(crit.length < 1){
    alert("Debes añadir al menos un criterio");
    return false;
  }

  if(pos.length < 1){
    alert("Debes añadir la posicion del ads");
    return false;
  }

  return true;
}

async function validateAsyncInsercion() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;
  var codigoExterno = codigoExternoModel.value;
  var linkAdsL = linkAds.value;
  var linkImageEscritorioL = linkImageEscritorio.value;
  var linkImageMobileL = linkImageMobile.value;

  if(tipoC != "imagen"){
    if(codigoExterno.length < 1 || codigoExterno == ""){
      alert("Debe ingresar el código");
      return false;
    }
  }else{
    if(linkAdsL.length < 1 || linkAdsL == ""){
      alert("Debe ingresar el link");
      return false;
    }
    if(linkImageEscritorioL.length < 1 || linkImageEscritorioL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos de escritorio");
      return false;
    }
    if(linkImageMobileL.length < 1 || linkImageMobileL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos responsive");
      return false;
    }
  }

  return true;
}

async function validateAsyncCriterio() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;
  var codigoExterno = codigoExternoModel.value;
  var linkAdsL = linkAds.value;
  var linkImageEscritorioL = linkImageEscritorio.value;
  var linkImageMobileL = linkImageMobile.value;

  if(tipoC != "Local"){
    if(codigoExterno.length < 1 || codigoExterno == ""){
      alert("Debe ingresar el código");
      return false;
    }
  }else{
    if(linkAdsL.length < 1 || linkAdsL == ""){
      alert("Debe ingresar el link");
      return false;
    }
    if(linkImageEscritorioL.length < 1 || linkImageEscritorioL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos de escritorio");
      return false;
    }
    if(linkImageMobileL.length < 1 || linkImageMobileL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos responsive");
      return false;
    }
  }

  return true;
}

async function validateAsyncUsuarios() {
  
  return true;
}

function compareByTitle(a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}

watch(() => selectedItem.value, (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(selectedItem.value != null){

    selectedItemCiudad.value = [];
    selectItemParticipantes.value = [];
    var ciudades = [];
    for(var i in dataCountry.value){
      var ins = dataCountry.value[i];
      if(ins.country == newValue){
        for(var j in ins.data){
          var ins2 = ins.data[j];
          ciudades.push({ title:ins2.city, value:ins2.city });
        }
      }
    }


    cityList.value = ciudades.sort(compareByTitle);
  }else{
    selectedItemCiudad.value = [];
    selectItemParticipantes.value = [];
  }
});

function generateRandomIntegers(min, max, count) {
  const randomIntegers = [];
  
  for (let i = 0; i < count; i++) {
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    randomIntegers.push(randomInt);
  }
  
  return randomIntegers;
}


watch(async () => selectedItemCiudad.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(selectedItemCiudad.value != null){
    loadingPanel.value=true;
    await getUsuarios();
    loadingPanel.value=false;
    if(dataUsuarios.value.total < 100){
      selectItemsList.value = [{ title:'Todos', value: 'Todos' },{ title:'Otro valor', value: 'Otro' }];
    }else{
      var numeros = generateRandomIntegers(100, dataUsuarios.value.total, 3);
      var items = [];
      items.push({ title:'Otro valor', value: 'Otro' });
      if(dataUsuarios.value.total != 100){
        for(var i in numeros){
          items.push({ title:numeros[i], value: numeros[i] });
        }
      }
      items.push({ title:'Todos', value: 'Todos' });
      selectItemsList.value = items;
    }
  }else{
    dataUsuarios.value = {};
  }

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

</script>

<template>
  <section>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="8"
      >
        <VTabs
          v-model="currentTab"
          class="v-tabs-pill d-none"
        >
          <VTab
            value="tab-lista"
            class=" d-none"
          >
            Listado
          </VTab>
          <VTab
            value="tab-agregar"
            class=" d-none"
          >
            Estadísticas
          </VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div
                  class="d-flex flex-wrap py-4 gap-4 align-items-center"
                  style="justify-content: space-between;"
                >
                  <div>
                    <VCardTitle>
                      Crear campañas
                    </VCardTitle>
                    <VCardSubtitle> 
                      Elige la campaña sobre la que necesites información  
                    </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <form-wizard 
                  :class="loadingPanel?'disabled':''"
                  @on-complete="onComplete" 
                  @on-loading="setLoading"
                  color="#7367F0" 
                  @on-validate="handleValidation"
                  @on-change="handleValidationChange"
                  validate-on-back="true"
                  nextButtonText="Siguiente"
                  backButtonText="Anterior"
                >
                  <tab-content title="Detalles de la campaña" :before-change="validateAsync">
                   
                    <VRow class="pb-5">
                        <VCol cols="12">
                          <VRow no-gutters>
                            <!-- 👉 First Name -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="nombreCampania">Nombre de la campaña</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="nombreCampania"
                                v-model="nombreCampania"
                                placeholder="Nombre de la campaña"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="tipocontenido">Tipo de contenido</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="languages"
                                :items="languageList"
                                chips
                                clearable
                                label=""
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="email">Criterio</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="criterio"
                                :items="criterioList"
                                multiple
                                chips
                                clearable
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="12">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="email">Posición</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="posicion"
                                :items="posicionList"
                                chips
                                clearable
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                      </VRow>
                  
                  </tab-content>
                  <tab-content title="Inserción de código"  :before-change="validateAsyncInsercion">
                    
                    <VRow class="pb-5">
                      <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="tipocontenido">Tipo de contenido</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="languages"
                                :items="languageList"
                                chips
                                clearable
                                label=""
                              />

                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="12">
                          <hr>
                        </VCol>
                        <VCol cols="12" :class="(languages=='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="nombreCampania">Inserte el código</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextarea label="Código" v-model="codigoExternoModel" />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="12" :class="(languages!='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="nombreCampania">Link del ads</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="link"
                                v-model="linkAds"
                                placeholder="Link del ads"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="6"
                              md="12"
                            >
                              <label for="">URL imagen de escritorio</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="linkImageEscritorio"
                                v-model="linkImageEscritorio"
                                placeholder="Link imagen de escritorio"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="6"
                              md="12"
                            >
                              <label for="">URL imagen de móvil</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="linkImageEscritorio"
                                v-model="linkImageMobile"
                                placeholder="Link imagen de móvil"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                    </VRow>
                  

                  </tab-content>
                  <tab-content title="Criterio de búsqueda"  :before-change="validateAsyncUsuarios">
                      

                      <VRow class="pb-5">
                        <VCol col="6">
                          
                          <VRow class="pb-5">
                            <VCol cols="12" >
                              <VRow no-gutters>
                                <!-- 👉 Email -->
                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <label for="email">Criterio</label>
                                </VCol>

                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <VSelect
                                    v-model="criterio"
                                    :items="criterioList"
                                    multiple
                                    chips
                                    clearable
                                  />
                                </VCol>
                              </VRow>
                            </VCol>
                            <VCol cols="12">
                              <VRow no-gutters>
                                <!-- 👉 Email -->
                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <label for="email">Países</label>
                                </VCol>

                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <VSelect
                                    v-model="selectedItem"
                                    :items="countryList"
                                    
                                    chips
                                    clearable
                                  />
                                </VCol>
                              </VRow>
                            </VCol>
                            <VCol cols="12">
                              <VRow no-gutters>
                                <!-- 👉 Email -->
                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <label for="email">Ciudades</label>
                                </VCol>

                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <VSelect
                                    :items="cityList"
                                    v-model="selectedItemCiudad"
                                    chips
                                    clearable
                                  />
                                </VCol>
                              </VRow>
                            </VCol>
                            <VCol cols="12">
                              <VRow no-gutters>
                                <!-- 👉 Email -->
                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <label for="email">Seleccionar participantes</label>
                                </VCol>

                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <VSelect
                                    :items="selectItemsList"
                                    v-model="selectItemParticipantes"
                                    chips
                                    clearable
                                  />
                                </VCol>
                              </VRow>
                            </VCol>
                          </VRow>

                        </VCol>
                        <VCol col="6">
                          <VCardText class="text-center pt-15">
                            <!-- 👉 Avatar -->
                            <VAvatar
                              rounded
                              :size="120"
                              color="primary"
                              variant="tonal"
                            >
                              
                              <VIcon
                                :size="62"
                                icon="tabler-users"
                              />
                            </VAvatar>

                            <!-- 👉 User fullName -->
                            <h6 class="text-h6 mt-4">
                              Usuarios participantes
                            </h6>

                            <!-- 👉 Role chip -->
                            <VChip
                              label
                              :color="'success'"
                              size="large"
                              class="text-capitalize mt-4"
                            >
                              {{ dataUsuarios.total || "0" }}
                            </VChip>
                          </VCardText>
                        </VCol>
                      </VRow>
                  
                  </tab-content>

                <div class="loader" v-if="loadingWizard"></div>
                </form-wizard>
                <!-- fin lista usuarios -->
              </VWindowItem>

              

              
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



<style scoped>  
.v-card.v-theme--dark .iframe-dark {
  display: block;
}

.v-card.v-theme--dark .iframe-light {
  display: none;
}

.v-card.v-theme--light .iframe-dark {
  display: none;
}

.v-card.v-theme--light .iframe-light {
  display: block;
}
/* This is a css loader. It's not related to vue-form-wizard */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #e74c3c;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
