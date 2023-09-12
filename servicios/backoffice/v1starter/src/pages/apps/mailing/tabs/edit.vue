<script setup>

const dataNewsletter = ref([]);
const disabledViewList = ref(false);
const dataBookUserList = ref([]);
const dataBookUserData = ref([]);
const dataTemplateList = ref([]);
const dataTemplateData = ref([]);

const dataSenderEmailList = ref([]);
const dataSenderEmailData = ref([]);

const token_auth = ref('');

const panelSendpulse = ref([])

const dataHorariosModel = ref([]);
dataHorariosModel.value = [
  '2','3','4','5','6'
];

const horarios = ref([]);

onMounted(async()=>{
  await getNewsletter();
  await sendpulseAuth();
  await getUserBook();
  await getListaPlantillasUser();
  await getListaSenderEmail();
})

async function getNewsletter(){
  try {
      
      let arr= [];
      let page = 1;
      let limit = 10;
      while (true) {
        var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      //console.log('pagina ',page);
      var response = await fetch(`https://ads-service.vercel.app/newsletter/all?page=${page}&limit=${limit}`, requestOptions);
      const data = await response.json();
      if (data.data.length === 0) {
                break;
        }
        arr.push(...data.data);
        
        page += 1;
      }
      dataNewsletter.value = Array.from(arr);
      //console.log('arr ',arr);
      
      //var totalRegistro = data.total;
      //var limit = data.limit;

      //totalRegistrosHtml.value = totalRegistro;
      //totalRegistros.value = Math.ceil(totalRegistro / limit);

      for (const item of dataNewsletter.value){
    
     //console.log('config ',item);
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
          panelSendpulse.value.push(0);
       
      }
      //console.log('horarios ',horarios.value);
      
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
      estado: news.estado,
      sender_email: news.sender_email || "ecuavisainforma@ecuavisa.com",
      sender_name: news.sender_name || "",
      config:{
        addressbook: news.config.addressbook,
        template: news.config.template,
        horarioEjecucion: calendarioHorario
      }
    }, news._id);
  

}

const editRegister = async (json, id) => {
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
  isDialogForm.value = false;
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


</script>

<template>
  <section>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
    <div class="demo-space-x">
          <VBtn color="primary" variant="text" class="mb-4" :to="{ name: 'apps-mailing-list' }">
            Lista de Newsletter
          </VBtn>
          <VBtn color="primary" variant="text" class="mb-4" :to="{ name: 'apps-mailing-forzado' }">
            Enviar Forzado
          </VBtn>
          <VBtn color="primary" class="mb-4" :to="{ name: 'apps-mailing-tabs-edit' }">
            Editar newsletter
          </VBtn>
    </div>

    </VCol>
    </VRow>
    <VRow class="d-flex">
      <VCol       
        cols="6"
        class="container" 
        v-for=" item, index in dataNewsletter"
      >
    <VCard class="mt-5" :title="'Editar '+item.nombre">
          <VCardText>
            <VExpansionPanels v-model="panelSendpulse[index]">
            <VExpansionPanel>
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
                  <VCol
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    <VCheckbox
                      v-model="item.estado"
                      label="Estado del Newsletter"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                    md="12"
                  >
                    
                  </VCol>
                </VRow>
              </VExpansionPanelText>
            </VExpansionPanel>
            <VExpansionPanel>
              <VExpansionPanelTitle>
                <VIcon icon="mdi-clock-edit-outline" style="margin-right: 10px;" /> Frecuencia de ejecución
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <VRow class="horario-ejecucion">
                  <VCol cols="12" sm="6" md="12" >
                    <div class="d-flex justify-init align-items-center gap-3 flex-wrap active-items-cr">
                      <VRadioGroup v-model="horarios[index].radios" inline >
                          <VRadio
                            label="Todos los días a las"
                            value="2"
                          />
                      </VRadioGroup>
                      <div style="width: 60px;width: 60px;" title="Seleccione la hora">
                        <label class="label-radio" style="margin-top: -12px;">Horas</label>
                        <VAutocomplete
                            v-model="horarios[index].calendariosInputs[1].horaModel"
                            variant="underlined"
                            :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                            label=""
                        />
                      </div>
                      <span>:</span>
                      <div style="width: 60px;width: 60px;" title="Seleccione el minuto">
                        <label class="label-radio" style="margin-top: -12px;">Minutos</label>
                        <VAutocomplete
                            v-model="horarios[index].calendariosInputs[1].minutoModel"
                            variant="underlined"
                            :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
                            label=""
                        />
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" sm="6" md="12" >
                    <div class="d-flex justify-init align-items-center gap-3 flex-wrap pt-2 no-active-items-cr">
                      <VRadioGroup v-model="horarios[index].radios" inline >
                        <VRadio
                          label="Cada"
                          value="3"
                        />
                      </VRadioGroup>

                      <div style="width: 60px;width: 60px;" title="Seleccione el día">

                        <label class="label-radio" style="margin-top: -12px;">Día</label>
                        <VAutocomplete
                            v-model="horarios[index].calendariosInputs[2].diaModel"
                            variant="underlined"
                            :items="Array.from({ length: 31 - 1 + 1 }, (_, index) => 1 + index)"
                            label=""
                        />
                      </div>
                      <span>del mes, a las</span>
                      <div class="d-flex justify-init align-items-center gap-3 flex-wrap">
                        <div style="width: 60px;width: 60px;" title="Seleccione la hora">

                          <label class="label-radio" style="margin-top: -12px;">Hora</label>
                          <VAutocomplete
                              v-model="horarios[index].calendariosInputs[2].horaModel"
                              variant="underlined"
                              :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                              label=""
                          />
                        </div>
                        <span>:</span>
                        <div style="width: 60px;width: 60px;" title="Seleccione el minuto">

                          <label class="label-radio" style="margin-top: -12px;">Minuto</label>
                          <VAutocomplete
                              v-model="horarios[index].calendariosInputs[2].minutoModel"
                              variant="underlined"
                              :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
                              label=""
                          />
                        </div>
                      </div>
                    </div>
                  </VCol>
                  <VCol cols="12" sm="6" md="12">
                    <div class="active-items-cr">
                      <VRadioGroup v-model="horarios[index].radios" inline >
                        <VRadio
                          label="Cada año el:"
                          value="4"
                        />
                      </VRadioGroup>
                      <div class="d-flex justify-init align-items-center gap-3 flex-wrap pl-7 pt-2">
                        
                        <div style="width: 60px;width: 60px;" title="Seleccione el día">

                          <label class="label-radio" style="margin-top: -12px;">Día</label>
                          <VAutocomplete
                              v-model="horarios[index].calendariosInputs[3].diaModel"
                              variant="underlined"
                              :items="Array.from({ length: 31 - 1 + 1 }, (_, index) => 1 + index)"
                              label=""
                          />
                        </div>
                        <span>de</span>
                        <div style="min-width: 60px;" title="Seleccione el mes">

                          <label class="label-radio" style="margin-top: -12px;">Mes</label>
                          <VAutocomplete
                              v-model="horarios[index].calendariosInputs[3].mesModel"
                              variant="underlined"
                              :items="['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']"
                              label=""
                          />
                        </div>
                        <span>a las</span>

                        <div class="d-flex justify-init align-items-center gap-3 flex-wrap">
                          <div style="width: 60px;width: 60px;" title="Seleccione la hora">

                            <label class="label-radio" style="margin-top: -12px;">Hora</label>
                            <VAutocomplete
                                v-model="horarios[index].calendariosInputs[3].horaModel"
                                variant="underlined"
                                :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                                label=""
                            />
                          </div>
                          <span>:</span>
                          <div style="width: 60px;width: 60px;" title="Seleccione el minuto">

                            <label class="label-radio" style="margin-top: -12px;">Minuto</label>
                            <VAutocomplete
                                v-model="horarios[index].calendariosInputs[3].minutoModel"
                                variant="underlined"
                                :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
                                label=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </VCol>

                  <VCol cols="12" sm="6" md="12" >
                    <VRadioGroup v-model="horarios[index].radios" inline >
                      <VRadio
                        label="Personalizado"
                        value="5"
                      />
                    </VRadioGroup>
                    
                    <div v-if="horarios[index].radios == '5'" class="d-flex justify-init align-items-center gap-3 flex-wrap pl-7 pt-4">
                      
                      <div style="min-width: 45%;max-width: 45%;" title="Seleccione el día de la semana">
                        <label class="label-radio" style="margin-top: -12px;">Días de la semana</label>
                        
                        <VAutocomplete
                            v-model="horarios[index].calendariosInputs[4].diaModel"
                            variant="underlined"
                            multiple
                            chips
                            :items="['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']"
                            label=""
                        />
                      </div>
                      <div style="min-width: 45%;max-width: 45%;" title="Seleccione el mes">
                        <label class="label-radio" style="margin-top: -12px;">Meses</label>
                        <VAutocomplete
                            v-model="horarios[index].calendariosInputs[4].mesModel"
                            variant="underlined"
                            multiple
                            chips
                            :items="['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']"
                            label=""
                        />
                      </div>

                      <div class="d-flex justify-init align-items-center gap-3 flex-wrap pt-3" style="width:100%">
                        <div style="min-width: 30%;max-width: 45%;" title="Seleccione la hora">
                          <label class="label-radio" style="margin-top: -12px;">Horas</label>
                          <VAutocomplete
                              v-model="horarios[index].calendariosInputs[4].horaModel"
                              variant="underlined"
                              :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                              label=""
                          />
                        </div>
                        <span>:</span>
                        <div style="min-width: 30%;max-width: 45%;" title="Seleccione el minuto">

                          <label class="label-radio" style="margin-top: -12px;">Minutos</label>
                          <VAutocomplete
                              v-model="horarios[index].calendariosInputs[4].minutoModel"
                              variant="underlined"
                              :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
                              label=""
                          />
                        </div>
                      </div>
                    </div>
                  </VCol>
                  <!--
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
                  -->
                </VRow>

              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
          </VCardText>
          <VCardText class="d-flex justify-end flex-wrap gap-3">
          
          <VBtn @click="accionForm(index)">
            Guardar
          </VBtn>
        </VCardText>
    </VCard>

      </VCol>
    </VRow>
  </section>

</template>

<style>
@media screen and (max-width: 1000px) {
  .container {
   min-width: 90svw; 
  }
}
</style>