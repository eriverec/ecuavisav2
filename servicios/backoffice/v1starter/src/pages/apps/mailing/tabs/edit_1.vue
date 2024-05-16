<script setup>
  const dataNewsletter = ref([]);
  const panelModel = ref(0)
  const disabledViewList = ref(false);
  const dataBookUserList = ref([]);
  const dataBookUserData = ref([]);
  const dataTemplateList = ref([]);
  const dataTemplateData = ref([]);
  const mensajeHorario = ref("");

  const dataSenderEmailList = ref([]);
  const dataSenderEmailData = ref([]);
  const dataNewsletterObject = ref({});
  const accion = ref('')
  const idAccion = ref('')
  const nombre = ref('')
  const descripcion = ref('')
  const subject = ref('')
  const pass = ref('asdfg12345')

  const token_auth = ref('');

  const panelSendpulse = ref([]);

  const dataNewsletterModel = ref([]);
  const dataNewsletterItems = ref([]);

  const dataHorariosModel = ref([]);

  const configSnackbar = ref({
    message:"Datos guardados",
    type:"success",
    model:false
  });

  dataHorariosModel.value = [
    '2','3','4','5','6'
  ];

  const horarios = ref([]);

  onMounted(async()=>{
    await getNewsletterAll();
    await sendpulseAuth();
    await getUserBook();
    await getListaPlantillasUser();
    await getListaSenderEmail();
  })

  async function getNewsletter(){
    try {
        
        let arr= [];
        // let page = 1;
        // let limit = 10;
        // while (true) {
        //   var myHeaders = new Headers();
        // myHeaders.append("Content-Type", "application/json");

        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   redirect: 'follow'
        // };
        // //console.log('pagina ',page);
        // var response = await fetch(`https://ads-service.vercel.app/newsletter/all?page=${page}&limit=${limit}`, requestOptions);
        // const data = await response.json();
        // if (data.data.length === 0) {
        //           break;
        //   }
        //   arr.push(...data.data);
          
        //   page += 1;
        // }
        // dataNewsletter.value = Array.from(arr);
       // console.log('config ',item);
        //console.log('arr ',arr);
        
        //var totalRegistro = data.total;
        //var limit = data.limit;

        //totalRegistrosHtml.value = totalRegistro;
        //totalRegistros.value = Math.ceil(totalRegistro / limit);

        horarios.value = [];

        for (const item of dataNewsletter.value){
            let data = {
              radios: item.config.horarioEjecucion?.method,
              calendariosInputs: [
                {
                  value: 1,
                  minutoModel: item.config.horarioEjecucion?.horario[0].minutoModel
                },
                {
                  value: 2,
                  horaModel: item.config.horarioEjecucion?.horario[1].horaModel,
                  minutoModel: item.config.horarioEjecucion?.horario[1].minutoModel,
                },
                {
                  value: 3,
                  diaModel: item.config.horarioEjecucion?.horario[2].diaModel,
                  horaModel: item.config.horarioEjecucion?.horario[2].horaModel,
                  minutoModel: item.config.horarioEjecucion?.horario[2].minutoModel,
                },
                {
                  value: 4,
                  diaModel: item.config.horarioEjecucion?.horario[3].diaModel,
                  horaModel: item.config.horarioEjecucion?.horario[3].horaModel,
                  mesModel: item.config.horarioEjecucion?.horario[3].mesModel,
                  minutoModel: item.config.horarioEjecucion?.horario[3].minutoModel,
                },
                {
                  value: 5,
                  diaModel: (item.config.horarioEjecucion?.horario.length > 4 ? item.config.horarioEjecucion.horario[4].diaModel : null),
                  horaModel: (item.config.horarioEjecucion?.horario.length > 4 ? item.config.horarioEjecucion.horario[4].horaModel : null),
                  mesModel: (item.config.horarioEjecucion?.horario.length > 4 ? item.config.horarioEjecucion.horario[4].mesModel : null),
                  minutoModel: (item.config.horarioEjecucion?.horario.length > 4 ? item.config.horarioEjecucion.horario[4].minutoModel : null),
                }
              ]
            }

            horarios.value.push(data);


            mensajeHorario.value = null;
            const value2 = data.calendariosInputs[data.radios - 1];
            if(data.radios == 2 && value2.horaModel && value2.minutoModel){
              // console.log(value2)
              mensajeHorario.value = getMensajeHorario(data.radios, value2);
            }
            if(data.radios == 3 && value2.diaModel && value2.horaModel && value2.minutoModel){
              mensajeHorario.value = getMensajeHorario(data.radios, value2);
            }

            if(data.radios == 4 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
              mensajeHorario.value = getMensajeHorario(data.radios, value2);
            }

            if(data.radios == 5 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
              mensajeHorario.value = getMensajeHorario(data.radios, value2);
            }


            // panelSendpulse.value.push(0);
         
        }
        //console.log('horarios ',horarios.value);
        
    } catch (error) {
        return console.error(error.message);    
    }
  }

  async function getNewsletterAll(){
    try {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        var response = await fetch(`https://ads-service.vercel.app/newsletter/all-select`, requestOptions);
        const data = await response.json();

        dataNewsletterItems.value = data.data.reduce((acumulador, actual) => {
          acumulador.push({
            title: `${actual.nombre}`,
            subject: `${actual.subject}`,
            value: actual._id,
          });
          return acumulador;
        }, []);

        if (dataNewsletterItems.value.length > 0) {
          dataNewsletterModel.value = dataNewsletterItems.value[0].value;
        }

    } catch (error) {
        return console.error(error.message);    
    }
  }

  async function getNewsletterOne(id){
    try {
        disabledViewList.value = true;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        var response = await fetch(`https://ads-service.vercel.app/newsletter/get/${id}`, requestOptions);
        const data = await response.json();

        dataNewsletterObject.value = data.data;
        dataNewsletter.value = [data.data];
        disabledViewList.value = false;
    } catch (error) {
        return console.error(error.message);    
    }
  }

  const accionForm = async (index) => {
    //isDialogForm.value = true;
    const news = dataNewsletter.value[index];
    if(news.nombre == '' || news.nombre.length < 1){
      alert("Debe ingresar un nombre");
      return false;
    }

    if(news.descripcion == '' || news.descripcion.length < 1){
      alert("Debe ingresar una descripción");
      return false;
    }

    if(news.subject == '' || news.subject.length < 1){
      alert("Debe ingresar un subject");
      return false;
    }

    if(news.sender_name == '' || news.sender_name.length < 1){
      alert("Debe ingresar un nombre del remitente");
      return false;
    }

    if(news.pass == '' || news.pass.length < 1){
      alert("Debe ingresar una contraseña de seguridad");
      return false;
    }


    var calendarioHorario = await selectHorario(index);
    var indiceCalendario = calendarioHorario.method - 1;
    var modelosHorarios = calendarioHorario.horario[indiceCalendario];
    Object.keys(modelosHorarios).forEach(key => {
      if(key != 'value'){
        if(modelosHorarios[key] == null){
          alert(`No hay valor para: ${key}`);
          return false;
        }
      }
    });

    await editRegister({
      nombre: news.nombre,
      descripcion: news.descripcion,
      subject : news.subject,
      pass: news.pass,
      preview: news.preview,
      // estado: news.estado,
      sender_email: news.sender_email || "ecuavisainforma@ecuavisa.com",
      sender_name: news.sender_name || "",
      // config:{
      //   addressbook: news.config.addressbook,
      //   template: news.config.template,
      //   horarioEjecucion: calendarioHorario
      // }
    }, news._id);
    

  }

  const editRegister = async (json, id) => {
    try {
      disabledViewList.value = true;
      var jsonEnviar = json

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(jsonEnviar),
        redirect: 'follow'
      };
      //console.log('id a enviar ',id); 
     // return console.log('datos a enviar ',json);

      var response = await fetch(`https://ads-service.vercel.app/newsletter/update/`+id, requestOptions);
      const data = await response.json();
      if(data.resp){
        configSnackbar.value = {
          message:"Dato editado",
          type:"success",
          model:true
        };
      }else{
        configSnackbar.value = {
          message:"Un error se presentó"+data.error,
          type:"error",
          model:true
        };
      };

      await getNewsletter();
      
      disabledViewList.value = false;
      // isDialogForm.value = false;
    } catch (error) {
        console.error(error.message); 
        configSnackbar.value = {
          message:"Un error se presentó"+error.message,
          type:"error",
          model:true
        };
    }
  }

  async function sendpulseAuth(){
      var raw = JSON.stringify({
      "grant_type": "client_credentials",
      "client_id": "c79f7382012df0ea4c6fa37afec6374e",
      "client_secret": "164551af334e1ec93e1b3099afd93a88"
      });

      var requestOptions = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: raw,
      redirect: 'follow'
      };

      const consulta = await fetch("https://api.sendpulse.com/oauth/access_token", requestOptions);
      const consultaJson = await consulta.json();
      token_auth.value = consultaJson.access_token;
  }

  async function getUserBook(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/addressbooks', requestOptions);
        const consultaJson = await consulta.json();
        dataBookUserData.value = consultaJson;

        for(var i in consultaJson){
          dataBookUserList.value.push({ title: `${consultaJson[i].name} - ${consultaJson[i].id}`, value:consultaJson[i].id })
        }

        dataBookUserList.value.sort((a, b) => a.title.localeCompare(b.title));

        // console.log(consultaJson, dataBookUserList.value)
    } catch (error) {
        console.error(error.message);   
    }
  }

  async function getListaPlantillasUser(){
      try {       
          if(!token_auth.value) return false;

          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer "+token_auth.value);

          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

          const consulta = await fetch('https://api.sendpulse.com/templates/?owner=me', requestOptions);
          const consultaJson = await consulta.json();
          dataTemplateData.value = consultaJson;
          // console.log(consultaJson)
          for(var i in consultaJson){
            dataTemplateList.value.push({ title: `${consultaJson[i].name}`, value:consultaJson[i].real_id })
          }

          dataTemplateList.value.sort((a, b) => a.title.localeCompare(b.title));

      } catch (error) {
          console.error(error.message);   
      }
  }

  async function getListaSenderEmail(){
      try {       
          if(!token_auth.value) return false;

          var myHeaders = new Headers();
          myHeaders.append("Authorization", "Bearer "+token_auth.value);

          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

          const consulta = await fetch('https://api.sendpulse.com/senders', requestOptions);
          const consultaJson = await consulta.json();
          dataSenderEmailData.value = consultaJson;
          // console.log(consultaJson)
          for(var i in consultaJson){
            dataSenderEmailList.value.push({ title: `${ consultaJson[i].email }`, value:consultaJson[i].email })
          }

          dataSenderEmailList.value.sort((a, b) => a.title.localeCompare(b.title));

      } catch (error) {
          console.error(error.message);   
      }
  }

  async function selectHorario(indexP) {
    console.log('indexP ', indexP);
    var idValueSeleccion = horarios.value[indexP].radios || 2;
    var horario = {
      method: idValueSeleccion,
      horario: [
        {
          value:1,
          minutoModel: null
        },
        {
          value:2,
          horaModel: null,
          minutoModel: null,
        },
        {
          value:3,
          diaModel: null,
          horaModel: null,
          minutoModel: null,
        },
        {
          value:4,
          diaModel: null,
          horaModel: null,
          mesModel:null,
          minutoModel: null,
        },
        {
          value:5,
          diaModel: null,
          horaModel: null,
          mesModel:null,
          minutoModel: null,
        }
      ]
    }

    horarios.value[indexP].calendariosInputs.forEach((numero, index) => {
        if(index != (idValueSeleccion - 1)){
          horarios.value[indexP].calendariosInputs[index] = horario.horario[index];
        }
    });

    horario = {
      method: idValueSeleccion,
      horario: [
        {
          value:1,
          minutoModel: horarios.value[indexP].calendariosInputs[0].minutoModel
        },
        {
          value:2,
          horaModel: horarios.value[indexP].calendariosInputs[1].horaModel,
          minutoModel: horarios.value[indexP].calendariosInputs[1].minutoModel,
        },
        {
          value:3,
          diaModel: horarios.value[indexP].calendariosInputs[2].diaModel,
          horaModel: horarios.value[indexP].calendariosInputs[2].horaModel,
          minutoModel: horarios.value[indexP].calendariosInputs[2].minutoModel,
        },
        {
          value:4,
          diaModel: horarios.value[indexP].calendariosInputs[3].diaModel,
          horaModel: horarios.value[indexP].calendariosInputs[3].horaModel,
          mesModel: horarios.value[indexP].calendariosInputs[3].mesModel,
          minutoModel: horarios.value[indexP].calendariosInputs[3].minutoModel,
        },
        {
          value:5,
          diaModel: horarios.value[indexP].calendariosInputs[4].diaModel,
          horaModel: horarios.value[indexP].calendariosInputs[4].horaModel,
          mesModel: horarios.value[indexP].calendariosInputs[4].mesModel,
          minutoModel: horarios.value[indexP].calendariosInputs[4].minutoModel,
        }
      ]
    }
    return horario;
  }

  const isDialogVisiblePreview = ref(false);
  const iframePreview = ref('');

  const onPreview = async (preview) => {
    isDialogVisiblePreview.value = true;
    iframePreview.value = preview;
  };

  watch(async () => dataNewsletterModel.value, async () => {
    if(dataNewsletterModel.value){
      await getNewsletterOne(dataNewsletterModel.value);
      await getNewsletter();
      panelModel.value = 0;
    }
  });

  function getMensajeHorario(value, value2){
    if(value == 2){
      // console.log(value2)
      return 'El newsletter se enviará todos los días a las '+value2.horaModel.toString().padStart(2, '0')+':'+value2.minutoModel.toString().padStart(2, '0');
    }
    if(value == 3){
      // console.log(value2)
      return 'El newsletter se enviará el '+value2.diaModel.toString().padStart(2, '0')+' de cada mes, a las '+" "+value2.horaModel.toString().padStart(2, '0')+":"+value2.minutoModel.toString().padStart(2, '0');
    }

    if(value == 4){
      // console.log(value2)
      return 'El newsletter se enviará cada año, el '+value2.diaModel.toString().padStart(2, '0')+' de '+value2.mesModel.toString().padStart(2, '0')+" a las "+value2.horaModel.toString().padStart(2, '0')+":"+value2.minutoModel.toString().padStart(2, '0');
    }

    if(value == 5){
      let diasString = value2.diaModel.join(",");
      // Define un objeto para asignar un valor numérico a cada día de la semana
      const ordenDias = {
        "Lunes": 1,
        "Martes": 2,
        "Miércoles": 3,
        "Jueves": 4,
        "Viernes": 5
      };

      // Convierte el string en un array utilizando el método split(',')
      let diasArray = diasString.split(',');

      // Ordena el array utilizando la función de comparación personalizada
      diasArray.sort((a, b) => ordenDias[a] - ordenDias[b]);

      // Convierte el array nuevamente en un string usando el método join(',')
      let diasOrdenadosString = diasArray.join(',');


      let mesesString = value2.mesModel.join(",");

      // Define un objeto para asignar un valor numérico a cada mes
      const ordenMeses = {
        "Enero": 1,
        "Febrero": 2,
        "Marzo": 3,
        "Abril": 4,
        "Mayo": 5,
        "Junio": 6,
        "Julio": 7,
        "Agosto": 8,
        "Septiembre": 9,
        "Octubre": 10,
        "Noviembre": 11,
        "Diciembre": 12
      };

      // Convierte el string en un array utilizando el método split(',')
      let mesesArray = mesesString.split(',');

      // Ordena el array utilizando la función de comparación personalizada
      mesesArray.sort((a, b) => ordenMeses[a] - ordenMeses[b]);

      // Convierte el array nuevamente en un string usando el método join(',')
      let mesesOrdenadosString = mesesArray.join(',');

      return 'El newsletter se enviará en los días de la semana: '+diasOrdenadosString+' para los meses: '+" "+mesesOrdenadosString+" a las "+value2.horaModel.toString().padStart(2, '0')+":"+value2.minutoModel.toString().padStart(2, '0');
    }
  }

</script>

<template>
  <VCard  class="pa-sm-14 pa-5">
    <!-- tonal snackbar -->
    <VSnackbar
      v-model="configSnackbar.model"
      location="top end"
      variant="flat"
      :color="configSnackbar.type"
    >
      {{configSnackbar.message}}
    </VSnackbar>
    <VCardTitle class="text-h5 mb-3">
        Gestión Newsletter
    </VCardTitle>
    <VCardText>
      <VRow>
        <VCol cols="12"
              sm="12"
              md="4" class="pb-0 mb-0">
          <VSelect 
            item-text="title"
            item-value="value"
            v-model="dataNewsletterModel" 
            :items="dataNewsletterItems"
            label="Seleccione el Newsletter"
            :menu-props="{ maxHeight: '400' }">
            <template #selection="{ item }">
                  <div>
                      {{ item.title }}
                  </div>
              </template>
              <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                      <v-list-item-content>
                          <v-list-item-subtitle>
                              <p>_id: {{ item.value }}</p>
                          </v-list-item-subtitle>
                      </v-list-item-content>
                  </v-list-item>
              </template>
          </VSelect>
        </VCol>
        <VCol cols="12"
              sm="12"
              md="12"
              class="mt-0 py-0">
            
        </VCol>
        <VCol cols="12"
              sm="12"
              md="12">
          <VRow class="d-flex">
            <VCol       
              cols="12"
              class="container" 
              v-for=" item, index in dataNewsletter"
            >
              <VCard class="mt-5" :title="'Editar '+item.nombre">
                  <VCardText>
                    <VExpansionPanels v-model="panelModel">
                      <VExpansionPanel :disabled="disabledViewList">
                        <VExpansionPanelTitle>Formulario</VExpansionPanelTitle>
                        <VExpansionPanelText>
                          <VRow>
                            <VCol
                                cols="12"
                                sm="6"
                                md="6"
                              >
                              <VTextField
                                v-model="item.nombre"
                                label="Nombre del Newsletter para SendPulse"
                                autocomplete="off"
                              />
                              <small style="
                                  line-height: 1.2;
                                  display: block;
                                  font-size: 10px;
                                  padding-top: 4px;
                                  padding-left: 4px;
                              "><VIcon icon="mdi-information-outline" size="13px" /> Nombre como se va a guardar en SendPulse</small>
                            </VCol>
                            <VCol
                                cols="12"
                                sm="6"
                                md="6"
                              >
                              <VTextField
                                v-model="item.descripcion"
                                label="Escribir descripción corta"
                                placeholder="Ayuda dar al correo una descripción breve"
                                autocomplete="off"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              sm="6"
                              md="12"
                            >
                              <VTextField
                                v-model="item.subject"
                                label="Escribir el asunto"
                                persistent-hint
                                autocomplete="off"
                              />
                            </VCol>
                             <!--
                            <VCol cols="12" class="d-none">
                              <VTextField
                                v-model="item.pass"
                                label="Escribe una contraseña"
                                type="password"
                                autocomplete="off"
                              />
                            </VCol>
                           
                            <VCol
                              cols="12"
                              sm="12"
                            >
                              <VTextField
                                v-model="item.preview"
                                label="Link de vista previa"
                                type="Ingrese el link de la vista previa"
                                autocomplete="off"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              sm="6"
                            >
                              <VAutocomplete
                                v-model="item.config.addressbook"
                                :items="dataBookUserList"
                                label="Lista de usuarios"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              sm="6"
                            >
                              <VAutocomplete
                                v-model="item.config.template"
                                :items="dataTemplateList"
                                label="Lista de plantillas del sendpulse"
                              />
                            </VCol>
                            -->
                            <VCol
                              cols="12"
                              sm="6"
                              md="5"
                            >
                              <VTextField
                                v-model="item.sender_name"
                                label="Nombre del remitente"
                                persistent-hint
                                autocomplete="off"
                              />
                            </VCol>
                            <VCol
                              cols="12"
                              sm="7"
                            >
                              <VAutocomplete
                                v-model="item.sender_email"
                                :items="dataSenderEmailList"
                                label="Lista de remitentes disponible"
                              />
                            </VCol>
                            <!-- <VCol
                              cols="12"
                              sm="6"
                              md="12"
                            >
                              <VCheckbox
                                v-model="item.estado"
                                label="Estado del Newsletter"
                              />
                            </VCol> -->
                            <VCol
                              cols="12"
                              sm="6"
                              md="12"
                            >
                              
                            </VCol>
                          </VRow>
                        </VExpansionPanelText>
                      </VExpansionPanel>
                    </VExpansionPanels>
                  </VCardText>
                  <VCardText class="d-flex justify-end flex-wrap gap-3">
                    <VBtn :disabled="disabledViewList" @click="onPreview(item.preview)">
                      Vista previa
                    </VBtn>
                    <VBtn :disabled="disabledViewList" @click="accionForm(index)">
                      Guardar
                    </VBtn>
                </VCardText>
              </VCard>

            </VCol>
          </VRow>
        </VCol>
        
        <VCol cols="12" sm="6" md="12" >
          <VAlert
            v-if="mensajeHorario"
            density="default"
            color="success"
            variant="tonal"
          >
            <VIcon icon="mdi-clock-time-eight-outline" /> {{mensajeHorario}}
          </VAlert>
        </VCol>
      </VRow>
    </VCardText>
    <VDialog
        v-model="isDialogVisiblePreview"
        fullscreen
        :scrim="false"
        transition="dialog-bottom-transition"
      >
        <VCard>
          <!-- Toolbar -->
          <div>
            <VToolbar color="primary">
              <VBtn
                icon
                variant="plain"
                @click="isDialogVisiblePreview = false"
              >
                <VIcon
                  color="white"
                  icon="tabler-x"
                />
              </VBtn>

              <VToolbarTitle>Vista previa del Newsletter</VToolbarTitle>

              <VSpacer />

              <VToolbarItems>
                <VBtn
                  variant="text"
                  @click="isDialogVisiblePreview = false"
                >
                  Cerrar
                </VBtn>
              </VToolbarItems>
            </VToolbar>
          </div>
          <iframe loading="lazy" width="100%" height="2000px" :src="iframePreview" frameborder="0"></iframe>
        </VCard>
      </VDialog>
  </VCard>
</template>

<style>
@media screen and (max-width: 1000px) {
  .container {
   min-width: 90svw; 
  }
}

[disabled="true"] {
    opacity: .2;
    cursor: no-drop;
    pointer-events: none;
}
.align-items-center {
    align-items: center;
}

.label-radio{
    font-size: 11px;
    letter-spacing: 0.009375em;
    min-width: 0;
    line-height: 1.2;
    opacity: var(--v-medium-emphasis-opacity);
    display: block;
}

.horario-ejecucion .v-field__input {
    min-height: 30px;
    padding-top: 5px;
    padding-bottom: 5px;
}

.horario-ejecucion .v-field__append-inner {
    padding-top: 3px;
}

.horario-ejecucion .v-input{

}

.no-active-items-cr{
/*  padding-top: 20px; padding-bottom: 23px; padding-left: 15px; padding-right: 15px; border-radius: 7px;*/
}

.active-items-cr{
/*  background-color: rgb(233 232 235 / 26%); padding-top: 20px; padding-bottom: 23px; padding-left: 15px; padding-right: 15px; border-radius: 7px;*/
}

.horario-ejecucion .v-input.v-radio-group {
    display: contents;
}

.v-menu .v-overlay__content.v-autocomplete__content {
    max-height: calc(75vh - 250px);
}

.icon-spinner {
    animation: spin-animation 1.5s infinite;
    display: inline-block;
}

.d-bloc{
  display: flex;
  flex-direction: column;
  align-items: flex-start
}

@keyframes spin-animation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(359deg);
    }
}
.v-avatar--variant-tonal .v-avatar__underlay {
    background: transparent;
    background-color: transparent;
}
</style>