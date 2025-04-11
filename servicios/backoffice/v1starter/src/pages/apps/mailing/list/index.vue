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

// const dominioExterno = ref('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/sendpulsev3');
const dominioExterno = ref('https://services.ecuavisa.com/sendpulse');
const currentTab = ref('tab-lista');
const isDialogVisibleDelete = ref(false);
const isDialogVisiblePreview = ref(false);
const nombrePreview = ref('');
const iframePreview = ref('');
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
const userCountMessage = ref('');
const dataTemplateList = ref([]);
const dataTemplateData = ref([]);
const dataTemplateModel = ref([]);
const dataTemplateView = ref("");

const dataSenderEmailList = ref([]);
const dataSenderEmailData = ref([]);
const dataSenderEmailModel = ref([]);

const isDialogForzado = ref(false);
const btnClickForzado = ref(null);
const disabledForzado = ref(false);
const linkForzado = ref(false);
const linkForzadoList = ref([
  {
    "id":"66146103d6d9f2e80323e95e",
    "name":"Última hora",
    "forzado": dominioExterno.value+"/boletin-ultimahora/forzado.php"
  },
  {
    "id":"660f09cc2a53044cbb5c3495",
    "name":"Estadio",
    "forzado":dominioExterno.value+"/boletin-estadio/forzado.php"
  },
  {
    "id":"66043d5421c9f3dc3c353987",
    "name":"Gente",
    "forzado":dominioExterno.value+"/boletin-entretenimiento/forzado.php"
  },
  {
    "id":"64f9f5225c4a279b69ff2ac8",
    "name":"Boletín diario 7am",
    "forzado":dominioExterno.value+"/boletin-diario/forzado.php"
  },
  {
    "id":"64f9f5455c4a279b69ff2aca",
    "name":"Newsletter Opinión",
    "forzado":dominioExterno.value+"/opinion/forzado.php"
  },
  {
    "id":"655e5a43de6d5e1206632e25",
    "name":"Boletín diario 5pm",
    "forzado":dominioExterno.value+"/boletin-diario-5pm/forzado.php"
  }
]);

const sender_name = ref([]);
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
    horaModel: 10,
    minutoModel: 10,
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
const pass = ref('asdfg12345')
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
  await getListaSenderEmail();
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

      for(var i in data.data){
        data.data[i]["prox_envio"] = calcularProximaEjecucion(data.data[i].config.horarioEjecucion)
      }

      // console.log("data.data", data.data)

      data.data.sort((a, b) => {
        const fechaA = moment(a.prox_envio, "DD MMM YYYY, hh:mm a");
        const fechaB = moment(b.prox_envio, "DD MMM YYYY, hh:mm a");
        return fechaA - fechaB; // ASC
      });
      
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

// Función para manejar el cambio de paginación
const previewNeswletterIframe = async (preview) => {
  isDialogVisiblePreview.value = true;
  iframePreview.value = dominioExterno.value+preview;
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
  dataSenderEmailModel.value = "ecuavisainforma@ecuavisa.com";
  panelSendpulse.value = 0;
  // await selectHorario();

  nombre.value = "";
  descripcion.value = "";
  subject.value = "";
  sender_name.value = "";
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
  sender_name.value = ins.sender_name || "";
  dataSenderEmailModel.value = ins.sender_email || "ecuavisainforma@ecuavisa.com";

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

  if(sender_name.value == '' || sender_name.value.length < 1){
    alert("Debe ingresar un nombre del remitente");
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
      sender_email:dataSenderEmailModel.value,
      sender_name:sender_name.value,
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
      sender_email:dataSenderEmailModel.value,
      sender_name:sender_name.value,
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
        dataBookUserList.value.push({ title: `${consultaJson[i].name} - ${consultaJson[i].id}`, value:consultaJson[i].id, all_email_qty:consultaJson[i].all_email_qty })
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
          dataTemplateList.value.push({ title: `${consultaJson[i].name}`, value:consultaJson[i].real_id, preview:consultaJson[i].preview })
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
    // console.log(value2)
    return 'El newsletter se enviará en los días de la semana: '+value2.diaModel.join(",")+' para los meses: '+" "+value2.mesModel.join(",")+" a las "+value2.horaModel.toString().padStart(2, '0')+":"+value2.minutoModel.toString().padStart(2, '0');
  }
}

function calcularProximaEjecucion(horarioEjecucion) {
  const fechaActual = new Date();
  const diaActual = fechaActual.getDate();
  const mesActual = fechaActual.getMonth();
  const horaActual = fechaActual.getHours();
  const minutoActual = fechaActual.getMinutes();


  let proximaEjecucion = new Date();

  var index = horarioEjecucion.method - 1;
  var horario = horarioEjecucion.horario[index];
  switch (parseInt(horarioEjecucion.method)) {
    case 1:
      // Ejecución cada día
      proximaEjecucion = new Date(
        proximaEjecucion.getTime() + 24 * 60 * 60 * 1000
      );
      break;
    case 2:
      if (
        horaActual > horario.horaModel ||
        (horaActual === horario.horaModel &&
          minutoActual >= horario.minutoModel)
      ) {
        proximaEjecucion = new Date(
          proximaEjecucion.getTime() +
            ((horario.horaModel - horaActual + 24) % 24 * 60 +
              horario.minutoModel - minutoActual) *
              60 *
              1000
        );
      } else {
        proximaEjecucion.setHours(horario.horaModel, horario.minutoModel);
      }
      break;
    case 3:
      // console.log(horario)
      // Ejecución cada día del mes
      var diaEjecucion = horario.diaModel;
      proximaEjecucion.setDate(diaEjecucion);
      if (proximaEjecucion <= fechaActual) {
        proximaEjecucion.setMonth(proximaEjecucion.getMonth() + 1);
        proximaEjecucion.setHours(horario.horaModel, horario.minutoModel);
      }

      break;
    case 4:
      // Ejecución cada mes
      var diaEjecucion = horario.diaModel;
      const mesEjecucion = horario.mesModel;
      proximaEjecucion.setDate(diaEjecucion);
      proximaEjecucion.setMonth(mesEjecucion);
      if (proximaEjecucion <= fechaActual) {
        proximaEjecucion.setFullYear(proximaEjecucion.getFullYear() + 1);
      }
      break;
    case 5:
      // Ejecución en días de la semana y meses específicos
      const diasSemana = horario.diaModel.map((dia) =>
        getDiaSemanaIndex(dia)
      );
      // return "";
      const meses = horario.mesModel.map((mes) => getNombreMesIndex(mes));
      let encontrado = false;
      var existe = false;

      if(diasSemana.includes(fechaActual.getDay())){
        if(meses.includes(fechaActual.getMonth())){
          if(horario.horaModel >= fechaActual.getHours()){
            if(horario.minutoModel >= fechaActual.getMinutes()){
              proximaEjecucion.setDate(proximaEjecucion.getDate());
              existe = true;
            }
          }
        }
      }

      if(!existe){
        while (!encontrado) {
          proximaEjecucion.setDate(proximaEjecucion.getDate() + 1);

          const diaEjecucion = proximaEjecucion.getDay();
          const mesEjecucion = proximaEjecucion.getMonth();

          if(diasSemana.includes(diaEjecucion)){
            if(meses.includes(mesEjecucion)){
              encontrado = true;
            }
          }
        }
      }

      
      proximaEjecucion.setHours(horario.horaModel, horario.minutoModel);
      break;
  }

  const proximaEjecucionFormat = `${proximaEjecucion.getFullYear()}-${(
    proximaEjecucion.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${proximaEjecucion
    .getDate()
    .toString()
    .padStart(2, "0")} ${proximaEjecucion
    .getHours()
    .toString()
    .padStart(2, "0")}:${proximaEjecucion
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return moment(proximaEjecucionFormat, "YYYY-MM-DD HH:mm:ss").locale('es').format("Do MMM YYYY, HH:mm a");
}

function getDiaSemanaIndex(dia) {
  const diasSemana = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return diasSemana.indexOf(dia);
}

function getNombreMesIndex(mes) {
  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return nombresMeses.indexOf(mes);
}

watch(radios, async(value)=>{
  // console.log(radios.value)
  mensajeHorario.value = null;
  watch(calendariosInputs.value[radios.value - 1], async(value2)=>{
    if(radios.value == 2 && value2.horaModel && value2.minutoModel){
      // console.log(value2)
      mensajeHorario.value = getMensajeHorario(radios.value, value2);
    }
    if(radios.value == 3 && value2.diaModel && value2.horaModel && value2.minutoModel){
      mensajeHorario.value = getMensajeHorario(radios.value, value2);
    }

    if(radios.value == 4 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
      mensajeHorario.value = getMensajeHorario(radios.value, value2);
    }

    if(radios.value == 5 && value2.diaModel && value2.mesModel && value2.horaModel && value2.minutoModel){
      mensajeHorario.value = getMensajeHorario(radios.value, value2);
    }
  })
  await selectHorario();
})

watch(dataBookUserModel, async(value)=>{
  const instancia = dataBookUserList.value.find(objeto => objeto.value === value);
  userCountMessage.value = instancia.all_email_qty;
})

watch(dataTemplateModel, async(value)=>{
  const instancia = dataTemplateList.value.find(objeto => objeto.value === value);
  dataTemplateView.value = instancia.preview;
});

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
                  <VCol cols="12" class="d-none">
                    <VTextField
                      v-model="pass"
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
                    <small title="Usuarios afectados" v-if="userCountMessage" style="
                        line-height: 1.2;
                        display: block;
                        font-size: 10px;
                        padding-top: 4px;
                        padding-left: 4px;
                    "><VIcon icon="mdi-account-multiple-outline" size="13px" /> {{ userCountMessage }}</small>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VAutocomplete
                      v-model="dataTemplateModel"
                      :items="dataTemplateList"
                      label="Lista de plantillas del sendpulse"
                    />
                    <small v-if="dataTemplateView" title="Ver vista previa" style="
                        line-height: 1.2;
                        display: block;
                        font-size: 10px;
                        padding-top: 4px;
                        padding-left: 4px;
                    "><a :href="dataTemplateView" target="_blank"><VIcon icon="mdi-image-search-outline" size="13px" /> vista previa de la plantilla seleccionada</a> </small>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                    md="5"
                  >
                    <VTextField
                      v-model="sender_name"
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
                      v-model="dataSenderEmailModel"
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
                <VIcon icon="mdi-clock-edit-outline" style="margin-right: 10px;" /> Frecuencia de ejecución
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
                            :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
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
                              :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
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
                                :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
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
                      
                      <div style="min-width: 45%;max-width: 45%;" title="Seleccione el día de la semana">
                        <label class="label-radio" style="margin-top: -12px;">Días de la semana</label>
                        
                        <VAutocomplete
                            v-model="calendariosInputs[4].diaModel"
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
                            v-model="calendariosInputs[4].mesModel"
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
                              v-model="calendariosInputs[4].horaModel"
                              variant="underlined"
                              :items="Array.from({ length: 23 - 0 + 1 }, (_, index) => 0 + index)"
                              label=""
                          />
                        </div>
                        <span>:</span>
                        <div style="min-width: 30%;max-width: 45%;" title="Seleccione el minuto">

                          <label class="label-radio" style="margin-top: -12px;">Minutos</label>
                          <VAutocomplete
                              v-model="calendariosInputs[4].minutoModel"
                              variant="underlined"
                              :items="Array.from({ length: 61 - 1 + 0 }, (_, index) => 0 + index)"
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

    <VRow>
      <VCol
          class="mt-0"
          cols="12"
          md="12"
          lg="12"
        >
        <div class="demo-space-x">
          <VBtn color="primary" class="mb-4 d-none" :to="{ name: 'apps-mailing-list' }">
            Lista de Newsletter
          </VBtn>
          <VBtn color="primary" variant="text" class="mb-4" :to="{ name: 'apps-mailing-forzado' }">
            Enviar Forzado
          </VBtn>
          <VBtn color="primary" variant="text" class="mb-4" :to="{ name: 'apps-mailing-tabs-edit' }">
            Editar newsletter
          </VBtn>
        </div>
        

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
                    <VCardSubtitle> Es una herramienta que le permite a los usuarios explorar y gestionar una colección de boletines informativos de manera eficiente. </VCardSubtitle>
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

                    <div class="d-flex align-center flex-wrap gap-4 d-none">
                      <!-- 👉 Select status -->
                      <div class="invoice-list-filter d-flex align-center flex-wrap">
                        <VBtn variant="text" icon="mdi-format-list-bulleted"  color="primary" class="mb-4  " :to="{ name: 'apps-mailing-list' }"/>
                        <VBtn color="secondary" variant="text" icon="mdi-view-comfy" class="mb-4" :to="{ name: 'apps-mailing-tabs-edit' }"/>
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
                  <template v-for="(c, index) of dataNewsletter" :key="`item-${index}`" >
                    <VListItem :disabled="disabledViewList" :class="`item-${c._id}`">
                      <VListItemTitle>
                        <h6 class="text-base" style="cursor: pointer;">
                          <div
                            @click="showEditForm(c._id)"
                            class="font-weight-medium user-list-name d-flex gap-1 align-items-center"
                            style="color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));"
                          >
                            <div class="nombre-campania">
                              <VIcon
                                size="22"
                                icon="mdi-email-open-outline"
                              /> {{ c.nombre }}
                            </div>
                            <div variant="text" style="padding-bottom: 2px;">
                              <VIcon
                                size="small"
                                color="primary"
                                icon="mdi-information-outline"
                              />
                              <VTooltip
                                open-delay="500"
                                location="top"
                                activator="parent"
                              >
                                <span>{{ getMensajeHorario(c.config.horarioEjecucion.method, c.config.horarioEjecucion.horario[c.config.horarioEjecucion.method - 1]) }}</span>
                              </VTooltip>
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

                        <div class="d-bloc">
                          <span class="text-xs text-disabled">
                           <b><VIcon icon="mdi-account-group" /> Subject: </b> {{ c.subject }}
                          </span>
                          <span class="text-xs text-disabled mt-1">
                           <b><VIcon size="15" icon="mdi-email-open-multiple-outline" /> Sender Name: </b> {{ c.sender_name }}, {{ c.sender_email }}
                          </span>
                          <span class="text-xs text-disabled mt-1">
                           <VChip  color="success">
                            <b><VIcon style="margin-top: -2px;" icon="mdi-email-fast-outline" /> Próximo envío: </b>  {{calcularProximaEjecucion(c.config.horarioEjecucion)}}
                          </VChip>
                          </span>
                        </div>
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
                            title="Vista previa del Newsletter"
                            class=""
                            variant="text"
                            @click="previewNeswletterIframe(c.preview)"
                            color="success"
                            icon="mdi-file-eye-outline"
                            size="22"/>


                          <VBtn
                            :disabled="disabledForzado"
                            :title="'Envío forzado: '+c.nombre"
                            class=""
                            @click="showForzadoSendDialog(c._id)"
                            color="success"
                            icon="mdi-email-fast-outline"
                            size="37"/>

                        </div>
                      </template>
                    </VListItem>
                    <VDivider :class="`xyz-${c._id}`" v-if="index !== dataNewsletter.length - 1" />
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

<style scoped>
.item-663172463993551db1d50a76{
  display: none;
}
.xyz-663172463993551db1d50a76{
  border: none;
}
</style>

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
