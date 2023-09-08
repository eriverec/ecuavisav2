<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const configSnackbar = ref({
  message:"Datos guardados",
  type:"success",
  model:false
});

const currentTab = ref('tab-lista');
const isDialogVisibleDelete = ref(false);
const checkbox = ref(1);
const dataNewsletter = ref([]);
const currentPage = ref(1);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const idNewsletter = ref("");
const mensajeHorario = ref("");
const disabledPagination = ref(false);
const disabledViewList = ref(false);
const switchOnDisabled = ref(false);
const checkboxEstado = ref(false);
const dataBookUserList = ref([]);
const dataBookUserData = ref([]);
const dataBookUserModel = ref([]);
const dataTemplateList = ref([]);
const dataTemplateData = ref([]);
const dataTemplateModel = ref([]);
const token_auth = ref('');

const radios = ref('2');
const panelSendpulse = ref(0)

const calendariosInputs = ref([
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
]);

const horaGeneral = ref('12:00');
const checkboxHorario = ref(true);
const checkboxHorarioDisabled = ref(false);

const dataHorariosModel = ref([]);
dataHorariosModel.value = [
  '2','3','4','5','6'
];

const dataHorariosList = ref([
    {title:'Lunes', value:'2', modelTime:null},
    {title:'Martes', value:'3', modelTime:null},
    {title:'Miércoles', value:'4', modelTime:null},
    {title:'Jueves', value:'5', modelTime:null},
    {title:'Viernes', value:'6', modelTime:null},
    {title:'Sábado', value:'7', modelTime:null},
    {title:'Domingo', value:'1', modelTime:null},
  ]);

const isDialogForm = ref(false)
const tituloForm = ref('Crear newsletter');
const nombre = ref('')
const descripcion = ref('')
const subject = ref('')
const pass = ref('')
const preview = ref('')
const accion = ref('')
const idAccion = ref('')

const interest = ref([])

const banderas = {
  "Ecuador":"EC",
  "Japan":"JP",
  "Cuba":"CU",
  "Colombia":"CU",
}

onMounted(async()=>{
  await getNewsletter();
  await sendpulseAuth();
  await getUserBook();
  await getListaPlantillasUser();
})

async function getNewsletter(page = null, limit= 10){
  try {
      if(page==null){
        page = currentPage.value;
      }
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://ads-service.vercel.app/newsletter/all?page=${page}&limit=${limit}`, requestOptions);
      const data = await response.json();

      var totalRegistro = data.total;
      var limit = data.limit;

      dataNewsletter.value = data.data;
      totalRegistrosHtml.value = totalRegistro;
      totalRegistros.value = Math.ceil(totalRegistro / limit);
  } catch (error) {
      return console.error(error.message);    
  }
}

// Función para manejar el cambio de paginación
const handlePaginationClick = async () => {
  // Aquí puedes realizar las acciones que deseas cuando se hace clic en la paginación
  // console.log('Se hizo clic en la paginación'+currentPage.value, totalRegistros.value);
  disabledPagination.value = true;
  await getNewsletter(currentPage.value)
  disabledPagination.value = false;
};

// Función para manejar el cambio de paginación
const eliminarRegistro = async (id) => {
  isDialogVisibleDelete.value = true;
  idNewsletter.value = id;
  // console.log(id)
};

const eliminarRegistroSi = async () => {
  try {
      isDialogVisibleDelete.value = false;
      disabledViewList.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://ads-service.vercel.app/newsletter/delete/${idNewsletter.value}`, requestOptions);
      const data = await response.json();

      disabledViewList.value = false;
      await getNewsletter(currentPage.value);

  } catch (error) {
      return console.error(error.message);    
  }
};

const handleSwitchChange = async (index) => {
  const news = dataNewsletter.value[index];
  const id = news._id;
  const estado = news.estado;
  switchOnDisabled.value = true;
  var jsonEnviar = {
        estado: estado
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(jsonEnviar),
    redirect: 'follow'
  };

  var response = await fetch(`https://ads-service.vercel.app/newsletter/update/status/${id}`, requestOptions);
  const data = await response.json();
  if(data.resp){
    // alert("Registro guardado");
    configSnackbar.value.message = "Dato editado";
    configSnackbar.value.model = true
  }else{
    alert("Un error se presentó: "+data.error);
    news.estado = !news.estado;
  };
  switchOnDisabled.value = false;
  // Realiza las operaciones necesarias con el ID y el estado
};

const showAddForm = async () => {
  isDialogForm.value = true;
  tituloForm.value = "Crear newsletter";
  accion.value = "add";
  dataBookUserModel.value = 574818;
  dataTemplateModel.value = 148832;
  panelSendpulse.value = 0;
  // await selectHorario();

  nombre.value = "";
  descripcion.value = "";
  subject.value = "";
  pass.value = "";
  preview.value = "";
  checkboxEstado.value = false;
  radios.value = '2';
}

const showEditForm = async (id) => {
  await getNewsletter();
  isDialogForm.value = true;
  accion.value = "edit";
  panelSendpulse.value = 0;

  const ins = dataNewsletter.value.find(objeto => objeto._id === id);
  tituloForm.value = "Editar | " + ins.nombre;
  idAccion.value = ins._id;
  nombre.value = ins.nombre;
  descripcion.value = ins.descripcion;
  subject.value = ins.subject;
  pass.value = ins.pass;
  preview.value = ins.preview;
  checkboxEstado.value = ins.estado;
  dataBookUserModel.value = ins.config.addressbook;
  dataTemplateModel.value = ins.config.template;

  if(ins.config.horarioEjecucion){
    // console.log(ins.config.horarioEjecucion.method)
    radios.value = ins.config.horarioEjecucion.method
    calendariosInputs.value = [
      {
        value:1,
        minutoModel: ins.config.horarioEjecucion.horario[0].minutoModel
      },
      {
        value:2,
        horaModel: ins.config.horarioEjecucion.horario[1].horaModel,
        minutoModel: ins.config.horarioEjecucion.horario[1].minutoModel,
      },
      {
        value:3,
        diaModel: ins.config.horarioEjecucion.horario[2].diaModel,
        horaModel: ins.config.horarioEjecucion.horario[2].horaModel,
        minutoModel: ins.config.horarioEjecucion.horario[2].minutoModel,
      },
      {
        value:4,
        diaModel: ins.config.horarioEjecucion.horario[3].diaModel,
        horaModel: ins.config.horarioEjecucion.horario[3].horaModel,
        mesModel:ins.config.horarioEjecucion.horario[3].mesModel,
        minutoModel: ins.config.horarioEjecucion.horario[3].minutoModel,
      },
      {
        value:5,
        diaModel: (ins.config.horarioEjecucion.horario.length > 4 ? ins.config.horarioEjecucion.horario[4].diaModel:null),
        horaModel: (ins.config.horarioEjecucion.horario.length > 4 ? ins.config.horarioEjecucion.horario[4].horaModel:null),
        mesModel: (ins.config.horarioEjecucion.horario.length > 4 ? ins.config.horarioEjecucion.horario[4].mesModel:null),
        minutoModel: (ins.config.horarioEjecucion.horario.length > 4 ? ins.config.horarioEjecucion.horario[4].minutoModel:null),
      }
    ];
  }
  
}

const accionForm = async () => {
  isDialogForm.value = true;
  if(nombre.value == '' || nombre.value.length < 1){
    alert("Debe ingresar un nombre");
    return false;
  }

  if(descripcion.value == '' || descripcion.value.length < 1){
    alert("Debe ingresar una descripción");
    return false;
  }

  if(subject.value == '' || subject.value.length < 1){
    alert("Debe ingresar un subject");
    return false;
  }

  if(pass.value == '' || pass.value.length < 1){
    alert("Debe ingresar una contraseña de seguridad");
    return false;
  }

  if(preview.value == '' || preview.value.length < 1){
    alert("Debe ingresar un preview");
    return false;
  }
  var calendarioHorario = await selectHorario();
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

  if(accion.value == 'edit'){
    await editRegister({
      nombre: nombre.value,
      descripcion: descripcion.value,
      subject : subject.value,
      pass: pass.value,
      preview: preview.value,
      estado: checkboxEstado.value,
      config:{
        addressbook: dataBookUserModel.value,
        template: dataTemplateModel.value,
        horarioEjecucion: calendarioHorario
      }
    }, idAccion.value);
  }

  if(accion.value == 'add'){
    await addRegister({
      nombre: nombre.value,
      descripcion: descripcion.value,
      subject : subject.value,
      pass: pass.value,
      preview: preview.value,
      estado: checkboxEstado.value,
      config:{
        addressbook: dataBookUserModel.value,
        template: dataTemplateModel.value,
        horarioEjecucion: calendarioHorario
      }
    });
  }
}

const addRegister = async (json) => {
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
  
  var response = await fetch(`https://ads-service.vercel.app/newsletter/create/`, requestOptions);
  const data = await response.json();
  if(data.resp){
    configSnackbar.value = {
      message:"Dato guardado",
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
        dataBookUserList.value.push({ title: `${consultaJson[i].name}`, value:consultaJson[i].id })
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

async function checkboxHorarioFuncion() {
  checkboxHorarioDisabled.value = checkboxHorario.value;
}

const horariosListDiaHora = ref([]);

async function selectHorario() {
  var idValueSeleccion = radios.value || 2;
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

  calendariosInputs.value.forEach((numero, index) => {
      if(index != (idValueSeleccion - 1)){
        calendariosInputs.value[index] = horario.horario[index];
      }
  });

  horario = {
    method: idValueSeleccion,
    horario: [
      {
        value:1,
        minutoModel: calendariosInputs.value[0].minutoModel
      },
      {
        value:2,
        horaModel: calendariosInputs.value[1].horaModel,
        minutoModel: calendariosInputs.value[1].minutoModel,
      },
      {
        value:3,
        diaModel: calendariosInputs.value[2].diaModel,
        horaModel: calendariosInputs.value[2].horaModel,
        minutoModel: calendariosInputs.value[2].minutoModel,
      },
      {
        value:4,
        diaModel: calendariosInputs.value[3].diaModel,
        horaModel: calendariosInputs.value[3].horaModel,
        mesModel: calendariosInputs.value[3].mesModel,
        minutoModel: calendariosInputs.value[3].minutoModel,
      },
      {
        value:5,
        diaModel: calendariosInputs.value[4].diaModel,
        horaModel: calendariosInputs.value[4].horaModel,
        mesModel: calendariosInputs.value[4].mesModel,
        minutoModel: calendariosInputs.value[4].minutoModel,
      }
    ]
  }
  return horario;
}

watch(radios, async(value)=>{
  // console.log(radios.value)
  mensajeHorario.value = null;
  watch(calendariosInputs.value[radios.value - 1], async(value2)=>{
    if(radios.value == 2 && value2.horaModel && value2.minutoModel){
      // console.log(value2)
      mensajeHorario.value = 'El newsletter se enviará todos los días a las '+value2.horaModel.toString().padStart(2, '0')+':'+value2.minutoModel.toString().padStart(2, '0');
    }
    if(radios.value == 3 && value2.diaModel && value2.horaModel && value2.minutoModel){
      // console.log(value2)
      mensajeHorario.value = 'El newsletter se enviará el '+value2.diaModel.toString().padStart(2, '0')+' de cada mes, a las '+" "+value2.horaModel.toString().padStart(2, '0')+":"+value2.minutoModel.toString().padStart(2, '0');
    }

    if(radios.value == 4 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
      // console.log(value2)
      mensajeHorario.value = 'El newsletter se enviará cada año, el '+value2.diaModel.toString().padStart(2, '0')+' de '+value2.mesModel.toString().padStart(2, '0')+" a las "+value2.horaModel.toString().padStart(2, '0')+":"+value2.minutoModel.toString().padStart(2, '0');
    }

    if(radios.value == 5 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
      // console.log(value2)
      mensajeHorario.value = 'El newsletter se enviará en los días de la semana: '+value2.diaModel.join(",")+' para los meses: '+" "+value2.mesModel.join(",")+" a las "+value2.horaModel.toString().padStart(2, '0')+":"+value2.minutoModel.toString().padStart(2, '0');
    }
  })
  await selectHorario();
})

</script>

<template>
  <section>
    <!-- tonal snackbar -->
    <VSnackbar
      v-model="configSnackbar.model"
      location="top end"
      variant="flat"
      :color="configSnackbar.type"
    >
      {{configSnackbar.message}}
    </VSnackbar>

    <VDialog
      v-model="isDialogVisibleDelete"
      persistent
      class="v-dialog-sm"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisibleDelete = false"
          >
            No, Cerrar
          </VBtn>
          <VBtn @click="eliminarRegistroSi">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="isDialogForm"
      persistent
      max-width="600"
    >

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogForm = !isDialogForm" />

    <!-- Dialog Content -->
    <VCard :title="tituloForm" :disabled="disabledViewList">
      <VCardText>
        
        <VExpansionPanels v-model="panelSendpulse">
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
                    v-model="nombre"
                    label="Nombre del Newsletter"
                    autocomplete="off"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <VTextField
                    v-model="descripcion"
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
                    v-model="subject"
                    label="Escribir el asunto"
                    persistent-hint
                    autocomplete="off"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="pass"
                    label="Escribe una contraseña"
                    type="password"
                    autocomplete="off"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <VTextField
                    v-model="preview"
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
                    v-model="dataBookUserModel"
                    :items="dataBookUserList"
                    label="Lista de usuarios"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="12"
                >
                  <VAutocomplete
                    v-model="dataTemplateModel"
                    :items="dataTemplateList"
                    label="Lista de plantillas del sendpulse"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="6"
                  md="12"
                >
                  <VCheckbox
                    v-model="checkboxEstado"
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
              <VIcon icon="mdi-clock-edit-outline" style="margin-right: 10px;" /> Calendario de ejecución
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow class="horario-ejecucion">
                <VCol cols="12" sm="6" md="12" >
                  <div class="d-flex justify-init align-items-center gap-3 flex-wrap active-items-cr">
                    <VRadioGroup v-model="radios" inline >
                        <VRadio
                          label="Todos los días a las"
                          value="2"
                        />
                    </VRadioGroup>
                    <div style="width: 60px;width: 60px;" title="Seleccione la hora">
                      <label class="label-radio" style="margin-top: -12px;">Horas</label>
                      <VAutocomplete
                          v-model="calendariosInputs[1].horaModel"
                          variant="underlined"
                          :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                          label=""
                      />
                    </div>
                    <span>:</span>
                    <div style="width: 60px;width: 60px;" title="Seleccione el minuto">
                      <label class="label-radio" style="margin-top: -12px;">Minutos</label>
                      <VAutocomplete
                          v-model="calendariosInputs[1].minutoModel"
                          variant="underlined"
                          :items="Array.from({ length: 60 - 1 + 1 }, (_, index) => 1 + index)"
                          label=""
                      />
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" sm="6" md="12" >
                  <div class="d-flex justify-init align-items-center gap-3 flex-wrap pt-2 no-active-items-cr">
                    <VRadioGroup v-model="radios" inline >
                      <VRadio
                        label="Cada"
                        value="3"
                      />
                    </VRadioGroup>

                    <div style="width: 60px;width: 60px;" title="Seleccione el día">

                      <label class="label-radio" style="margin-top: -12px;">Día</label>
                      <VAutocomplete
                          v-model="calendariosInputs[2].diaModel"
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
                            v-model="calendariosInputs[2].horaModel"
                            variant="underlined"
                            :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                            label=""
                        />
                      </div>
                      <span>:</span>
                      <div style="width: 60px;width: 60px;" title="Seleccione el minuto">

                        <label class="label-radio" style="margin-top: -12px;">Minuto</label>
                        <VAutocomplete
                            v-model="calendariosInputs[2].minutoModel"
                            variant="underlined"
                            :items="Array.from({ length: 60 - 1 + 1 }, (_, index) => 1 + index)"
                            label=""
                        />
                      </div>
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" sm="6" md="12">
                  <div class="active-items-cr">
                    <VRadioGroup v-model="radios" inline >
                      <VRadio
                        label="Cada año el:"
                        value="4"
                      />
                    </VRadioGroup>
                    <div class="d-flex justify-init align-items-center gap-3 flex-wrap pl-7 pt-2">
                      
                      <div style="width: 60px;width: 60px;" title="Seleccione el día">

                        <label class="label-radio" style="margin-top: -12px;">Día</label>
                        <VAutocomplete
                            v-model="calendariosInputs[3].diaModel"
                            variant="underlined"
                            :items="Array.from({ length: 31 - 1 + 1 }, (_, index) => 1 + index)"
                            label=""
                        />
                      </div>
                      <span>de</span>
                      <div style="min-width: 60px;" title="Seleccione el mes">

                        <label class="label-radio" style="margin-top: -12px;">Mes</label>
                        <VAutocomplete
                            v-model="calendariosInputs[3].mesModel"
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
                              v-model="calendariosInputs[3].horaModel"
                              variant="underlined"
                              :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                              label=""
                          />
                        </div>
                        <span>:</span>
                        <div style="width: 60px;width: 60px;" title="Seleccione el minuto">

                          <label class="label-radio" style="margin-top: -12px;">Minuto</label>
                          <VAutocomplete
                              v-model="calendariosInputs[3].minutoModel"
                              variant="underlined"
                              :items="Array.from({ length: 60 - 1 + 1 }, (_, index) => 1 + index)"
                              label=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </VCol>

                <VCol cols="12" sm="6" md="12" >
                  <VRadioGroup v-model="radios" inline >
                    <VRadio
                      label="Personalizado"
                      value="5"
                    />
                  </VRadioGroup>
                  
                  <div v-if="radios == '5'" class="d-flex justify-init align-items-center gap-3 flex-wrap pl-7 pt-4">
                    
                    <div style="min-width: 60px;max-width: 45%;" title="Seleccione el día de la semana">
                      <label class="label-radio" style="margin-top: -12px;">Días de la semana</label>
                      
                      <VAutocomplete
                          v-model="calendariosInputs[4].diaModel"
                          variant="underlined"
                          multiple
                          chips
                          :items="['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo']"
                          label=""
                      />
                    </div>
                    <div style="min-width: 60px;max-width: 45%;" title="Seleccione el mes">
                      <label class="label-radio" style="margin-top: -12px;">Meses</label>
                      <VAutocomplete
                          v-model="calendariosInputs[4].mesModel"
                          variant="underlined"
                          multiple
                          chips
                          :items="['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']"
                          label=""
                      />
                    </div>

                    <div class="d-flex justify-init align-items-center gap-3 flex-wrap">
                      <div style="min-width: 60px;max-width: 45%;" title="Seleccione la hora">
                        <label class="label-radio" style="margin-top: -12px;">Horas</label>
                        <VAutocomplete
                            v-model="calendariosInputs[4].horaModel"
                            variant="underlined"
                            :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                            label=""
                        />
                      </div>
                      <span>:</span>
                      <div style="min-width: 60px;max-width: 45%;" title="Seleccione el minuto">

                        <label class="label-radio" style="margin-top: -12px;">Minutos</label>
                        <VAutocomplete
                            v-model="calendariosInputs[4].minutoModel"
                            variant="underlined"
                            :items="Array.from({ length: 60 - 1 + 1 }, (_, index) => 1 + index)"
                            label=""
                        />
                      </div>
                    </div>
                  </div>
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

            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogForm = false"
        >
          Cerrar
        </VBtn>
        <VBtn @click="accionForm">
          Guardar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>


    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
        <VTabs
          v-model="currentTab"
          class="v-tabs-pill  d-none"
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
                      Listado de Newsletters
                    </VCardTitle>
                    <VCardSubtitle> E una herramienta que le permite a los usuarios explorar y gestionar una colección de boletines informativos de manera eficiente. </VCardSubtitle>
                  </div>
                </div>
                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <VCardText class="d-flex align-center flex-wrap gap-4 px-0 pb-0 pt-2">
                    <!-- 👉 Rows per page -->
                    <div lass="d-flex" >
                      <VBtn color="primary" class="mb-4" @click="showAddForm">
                        Crear newsletter
                        <VIcon
                          :size="22"
                          icon="tabler-plus"
                        />
                      </VBtn>
                      
                    </div>

                    <VSpacer />

                    <div class="d-flex align-center flex-wrap gap-4">
                      <!-- 👉 Select status -->
                      <div class="invoice-list-filter d-flex align-center flex-wrap">
                        <VBtn variant="text" icon="mdi-format-list-bulleted"  color="primary" class="mb-4" :to="{ name: 'apps-campaigns-create' }"/>
                        <VBtn color="secondary" variant="text" icon="mdi-view-comfy" class="mb-4" :to="{ name: 'apps-campaigns-create' }"/>
                      </div>
                    </div>
                  </VCardText>
                  <VList lines="two" border v-if="dataNewsletter.length < 1">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  <VList lines="two" border  v-if="dataNewsletter.length > 0">
                  <template
                    v-for="(c, index) of dataNewsletter"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <h6 class="text-base" style="cursor: pointer;">
                          <div
                            @click="showAddForm"
                            class="font-weight-medium user-list-name "
                            style="color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));"
                          >
                            <div class="nombre-campania">
                              <VIcon
                                size="22"
                                icon="mdi-email-open-outline"
                              /> {{ c.nombre }}
                            </div>
                          </div>
                        </h6>
                        
                      </VListItemTitle>

                      <VListItemSubtitle class="mt-0" title="Estado de campaña">
                        <div class="switch-estatus">
                          <VSwitch :disabled="switchOnDisabled" :loading="switchOnDisabled?'warning':false" :color="c.estado?'success':'error'" v-model="c.estado" size="x-small" class="custom-vswitch" @change="handleSwitchChange(index)" />
                          <VChip
                            title="Newsletter pausado"
                            size="x-small"
                            label
                            :color="c.estado == true?'success':'error'"
                          >
                            <span style="font-weight:medium">{{ c.estado==true?'Activo':'Inactivo' }}</span>
                          </VChip>
                          <span class="text-xs text-disabled" style="padding-left:5px">
                            <i>
                              - Última modificación: {{ moment(c.update_at).format("YYYY-MM-DD HH:mm:ss") }}
                            </i>
                          </span>
                        </div>

                        <span class="text-xs text-disabled">
                         <b><VIcon icon="mdi-account-group" /> Subject: </b> {{ c.subject }}
                        </span>
                      </VListItemSubtitle>

                      <template #append>
                        <div class="espacio-right-2">
                          
                          <VBtn
                            class=""
                            @click="showEditForm(c._id)"
                            variant="text"
                            icon="tabler-edit"
                            size="22"/>
                          
                          <VBtn
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="eliminarRegistro(c._id)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-trash"
                            />
                          </VBtn>

                          <VBtn
                            icon
                            variant="text"
                            color="default"
                            size="x-small"
                            :to="{ name: 'apps-campaigns-view-id', params: { id: c._id } }"
                          >
                            <VIcon
                              :size="22"
                              icon="tabler-eye"
                            />
                          </VBtn>
                        </div>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== dataNewsletter.length - 1" />
                  </template>
                </VList>
                <span class="text-sm text-disabled">
                  Total de registros {{ totalRegistrosHtml }}
                </span>
                <VPagination
                    :disabled="disabledPagination"
                    v-model="currentPage"
                    :length="totalRegistros"
                    class="mt-4"
                    @click="handlePaginationClick"
                  />
                </div>
                <!-- fin lista usuarios -->
              </VWindowItem>

              

              
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



<style >  
  .loading{
    border:2px solid #7367F0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border-right-color: transparent;
    animation: rot 1s linear infinite;
  }

  @keyframes rot {
    100%{
      transform: rotate(360deg);
    }
  }
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

.nombre-campania,
.espacio-right-2 {
    gap: 10px;
    display: flex;
    align-items: center;
}
.v-avatar {
  border-radius: initial !important;
}

.ava {
  margin-inline-end: 16px;
}

.paginador-campaign{
  display: flex;
}

.custom-vswitch  {
  transform: scale(0.55); /* Ajusta el valor según tus necesidades */
  transform-origin: left center;
}

.switch-estatus {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    padding-left: 5px;
}

.flatpickr-calendar,
.flatpickr-calendar.open {
    z-index: 9999!important;
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
</style>
