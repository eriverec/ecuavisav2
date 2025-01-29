<script setup>

const dataNewsletter = ref([]);
const disabledViewList = ref(false);
const dataBookUserList = ref([]);
const dataBookUserData = ref([]);
const dataTemplateList = ref([]);
const dataTemplateData = ref([]);

const dataSenderEmailList = ref([]);
const dataSenderEmailData = ref([]);

const mensajeHorario = ref([]);

const token_auth = ref('');

const panelSendpulse = ref([])

const dataHorariosModel = ref([]);
dataHorariosModel.value = [
  '2','3','4','5','6'
];

const horarios = ref([]);

// const dominioExterno = ref('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/sendpulsev3');
const dominioExterno = ref('https://services.ecuavisa.com/sendpulse');

const linkForzadoList = ref([
  {
    "id":"66146103d6d9f2e80323e95e",
    "name":"Última hora",
    "forzado": dominioExterno.value +"/boletin-ultimahora/forzado.php"
  },
  {
    "id":"64f9f5455c4a279b69ff2aca",
    "name":"Newsletter Opinión",
    "forzado": dominioExterno.value +"/opinion/forzado.php"
  }
]);

onMounted(async()=>{
  await getNewsletter();
  await sendpulseAuth();
  await getUserBook();
  await getListaPlantillasUser();
  await getListaSenderEmail();
})

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
      const ordenDias = {
        "Lunes": 1,
        "Martes": 2,
        "Miércoles": 3,
        "Jueves": 4,
        "Viernes": 5
      };
      let diasArray = diasString.split(',');
      diasArray.sort((a, b) => ordenDias[a] - ordenDias[b]);

      let mesesString = value2.mesModel.join(",");
      const ordenMeses = {
        "Enero": 1, "Febrero": 2, "Marzo": 3, "Abril": 4, "Mayo": 5, "Junio": 6,
        "Julio": 7, "Agosto": 8, "Septiembre": 9, "Octubre": 10, "Noviembre": 11, "Diciembre": 12
      };
      let mesesArray = mesesString.split(',');
      mesesArray.sort((a, b) => ordenMeses[a] - ordenMeses[b]);

      // Verificar si se cumplen todas las condiciones para mostrar el mensaje simplificado
      if (diasArray.length === 5 && mesesArray.length === 12) {
        return 'El newsletter se enviará de lunes a viernes, todos los meses del año, a las ' + value2.horaModel.toString().padStart(2, '0') + ':' + value2.minutoModel.toString().padStart(2, '0');
      } else {
        let diasOrdenadosString = diasArray.join(',');
        let mesesOrdenadosString = mesesArray.join(',');

        return 'El newsletter se enviará en los días de la semana: ' + diasOrdenadosString + ' para los meses de ' + mesesOrdenadosString + ' a las ' + value2.horaModel.toString().padStart(2, '0') + ':' + value2.minutoModel.toString().padStart(2, '0');
      }

    }
  }

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


      mensajeHorario.value = [];
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

          var mensajeTemp = "";
          const value2 = data.calendariosInputs[data.radios - 1];
          if(data.radios == 2 && value2.horaModel && value2.minutoModel){
            // console.log(value2)
            mensajeTemp = (getMensajeHorario(data.radios, value2));
          }
          if(data.radios == 3 && value2.diaModel && value2.horaModel && value2.minutoModel){
            mensajeTemp = (getMensajeHorario(data.radios, value2));
          }

          if(data.radios == 4 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
            mensajeTemp = (getMensajeHorario(data.radios, value2));
          }

          if(data.radios == 5 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
            mensajeTemp = (getMensajeHorario(data.radios, value2));
          }
          console.log(mensajeTemp, mensajeHorario.value)
          mensajeHorario.value.push(mensajeTemp);

       
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
      // pass: news.pass,
      // preview: news.preview,
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

const configSnackbar = ref({
  message:"Datos guardados",
  type:"success",
  model:false
});

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

const isDialogVisiblePreview = ref(false);
const iframePreview = ref('');

const onPreview = async (preview) => {
  isDialogVisiblePreview.value = true;
  iframePreview.value = dominioExterno.value+preview;
};


const isDialogForzado = ref(false);
const btnClickForzado = ref(null);
const disabledForzado = ref(false);
const linkForzado = ref(false);
const accion = ref('')

const forzadoClick = async () => {
  try {
      isDialogForzado.value = false;
      disabledViewList.value = true;

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(linkForzado.value, requestOptions);
      const data = await response.json();
      if(data.hasOwnProperty('resp')){
        if(data.resp){
          configSnackbar.value = {
            message:"Newsletter creado y enviado",
            type:"success",
            model:true
          };
        }else{
          configSnackbar.value = {
            message:"Un error se presentó: "+data.message,
            type:"error",
            model:true
          };
        }
      }else{
        configSnackbar.value = {
          message:"Un error se presentó: "+JSON.stringify(data),
          type:"error",
          model:true
        };
      }
      
      disabledViewList.value = false;
  } catch (error) {
      return console.error(error.message);    
  }
};

const showForzadoSendDialog = async (id) => {
  const ins = linkForzadoList.value.find(objeto => objeto.id === id);
  if(ins){
    if(ins.forzado != ''){
      isDialogForzado.value = true;
      accion.value = "forzado";
      linkForzado.value = ins.forzado;
    }
  }else{
    alert("El forzado no está configurado")
  }
}


const showForzadoBtn = (id) => {
  const ins = linkForzadoList.value.find(objeto => objeto.id === id);
  // console.log(id, ins)
  if(ins){
    return true;
  }else{
    return false;
  }
}

</script>

<template>
  <section>
    <VDialog
        v-model="isDialogForzado"
        persistent
        class="v-dialog-sm"
      >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogForzado = !isDialogForzado" />

      <!-- Dialog Content -->
      <VCard title="Forzado">
        <VCardText>
          ¿Desea enviar el Newsletter ahora?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogForzado = false"
          >
            No, enviar
          </VBtn>
          <VBtn @click="forzadoClick">
            Si, enviar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- tonal snackbar -->
    <VSnackbar
      v-model="configSnackbar.model"
      location="top end"
      variant="flat"
      :color="configSnackbar.type"
    >
      {{configSnackbar.message}}
    </VSnackbar>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
    <div class="demo-space-x">
          <VBtn color="primary" variant="text" class="mb-4 d-none" :to="{ name: 'apps-mailing-list' }">
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
        :class="`item-${item._id}`" 
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
                        
                      </VCol>
                      <VCol cols="12" sm="6" md="12" >
                        <VAlert
                          v-if="mensajeHorario[index] && item._id != '64f9f5455c4a279b69ff2aca'"
                          density="default"
                          color="success"
                          variant="tonal"
                        >
                          <VIcon icon="mdi-clock-time-eight-outline" /> {{mensajeHorario[index]}}
                        </VAlert>
                      </VCol>
                    </VRow>
                  </VExpansionPanelText>
                </VExpansionPanel>
                
              </VExpansionPanels>
              </VCardText>
              <VCardText class="d-flex justify-end flex-wrap gap-3">
              <VBtn
                v-if="showForzadoBtn(item._id) == true"
                :disabled="disabledForzado"
                :title="'Envío forzado: '+item.nombre"
                class=""
                @click="showForzadoSendDialog(item._id)"
              >
              Enviar forzado <VIcon size="22" icon="mdi-email-fast-outline" />
              </VBtn>

              <VBtn @click="onPreview(item.preview)">
                Vista previa
              </VBtn>
              <VBtn @click="accionForm(index)">
                Guardar
              </VBtn>
            </VCardText>
        </VCard>

      </VCol>
    </VRow>

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
  </section>

</template>



<style>
.item-663172463993551db1d50a76 {
  display: none;
}

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