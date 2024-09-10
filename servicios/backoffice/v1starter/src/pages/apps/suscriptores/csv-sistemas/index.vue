<script setup>
  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";
  import { parseISO } from 'date-fns';
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);

  const dominio = "https://ecuavisa-suscripciones.vercel.app";

  const configSnackbar = ref({
      message: "Datos guardados",
      type: "success",
      model: false
  });

  const btnLoadingDescargar = ref(false);

  const isLoading = ref(false);
  const fechaHoy = moment().format("YYYY-MM-DD");
  const yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");

  const selectModelFechas = ref([parseISO(yesterday), parseISO(fechaHoy)]);
  const comboFechaModel = ref("Hoy");
  const comboFechaItems = ref(["Hoy", "Ayer", "Anteayer"]);
  const fechas = ref({
    fechai: yesterday + " 17:30:00", 
    fechaf: fechaHoy + " 17:30:00"
  });

  const headersGlobal = ref({
    idSuscripciones: "idSuscripciones",
    wylexId: "wylexId",
    nombres: "nombres",
    email: "email",
    apellidos: "apellidos",
    cedula: "cedula",
    telefono: "telefono",
    pais: "pais",
    ciudad: "ciudad",
    direccion: "direccion",
    transaction_id: "transaction_id",
    authorization_code: "authorization_code",
    fecha_pago: "fecha_pago",
    localizacion_usuario: "localizacion_usuario",
    update_at_billing: "update_at_billing",
  });

  function obtenerFechas(selectedDates, dateStr, instance) {
      if (selectedDates.length > 1) {
        fechas.value.fechai = moment(selectedDates[0]).format('YYYY-MM-DD');
        fechas.value.fechaf = moment(selectedDates[1]).format('YYYY-MM-DD'); 
      }

      if(selectedDates.length == 1){
        fechas.value.fechai = yesterday;
        fechas.value.fechaf = fechaHoy;
      }
  }

  function obtenerFechasCombo(seleccion) {
      let fechai, fechaf;

      switch (seleccion) {
          case "Hoy":
              fechai = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD');
              fechaf = moment().endOf('day').format('YYYY-MM-DD');
              break;
          case "Ayer":
              fechai = moment().subtract(2, 'days').startOf('day').format('YYYY-MM-DD');
              fechaf = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD');
              break;
          case "Anteayer":
              fechai = moment().subtract(3, 'days').startOf('day').format('YYYY-MM-DD');
              fechaf = moment().subtract(2, 'days').endOf('day').format('YYYY-MM-DD');
              break;
          default:
              console.log("Selección no válida");
              return;
      }

      return { fechai, fechaf };
  }

  watch(async () => comboFechaModel.value, async () => {
    if(comboFechaModel.value){
      const fechasTemp = obtenerFechasCombo(comboFechaModel.value);
      fechas.value.fechai = fechasTemp.fechai + " 17:30:00";
      fechas.value.fechaf = fechasTemp.fechaf + " 17:30:00"; 
    }
  });

  // DESCARGAR
  const dataFullExportar = ref([]);
  const urlApiExport = ref(dominio + "/sistemas/pagos-realizados/eliminatorias-sud-2026");
  const urlTitleExport = ref("transacciones_");

  const docsExportNumberLength = ref({
    tamanioActual : 0,
    tamanioTotal : 0
  });

  // PASO 7
  function convertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
          var line = "";
          for (var index in array[i]) {
              if (line != "") line += ",";

              // Envolver valores que contienen comas entre comillas dobles
              var value = array[i][index];
              if (typeof value === "string" && value.includes(",")) {
                  value = `"${value}"`;
              }

              line += value;
          }

          str += line + "\r\n";
      }

      return str;
  }

  // PASO 6
  function exportCSVFile(headers, items, fileTitle) {
    // if (headers && items[0].wylexId !== "wylexId") {
    //   items.unshift(headers);
    // }

    items.unshift(headers);
    console.log("items", items)

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + ".csv" || "export.csv";

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilenmae);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  // PASO 5
  function generateSlug(text) {
      // Crear un mapa de caracteres con tilde y ñ a sus reemplazos
      const map = {
          'á': 'a',
          'é': 'e',
          'í': 'i',
          'ó': 'o',
          'ú': 'u',
          'Á': 'A',
          'É': 'E',
          'Í': 'I',
          'Ó': 'O',
          'Ú': 'U',
          'ñ': 'n',
          'Ñ': 'N'
      };

      // Reemplazar cada carácter del mapa en el texto
      const slug = text.split('').map(char => map[char] || char).join('');

      // Convertir a minúsculas, eliminar caracteres no deseados y reemplazar espacios por guiones
      return slug.toLowerCase()
                 .replace(/[^a-z0-9\s-]/g, '-') // Eliminar caracteres que no sean letras, números, espacios o guiones
                 .replace(/\s+/g, '-')         // Reemplazar espacios por guiones
                 .replace(/-+/g, '-')+"-";         // Reemplazar múltiples guiones por uno solo
  }

  // PASO 3
  async function getDataExportarServer(page = 1, limit = 10, estado = 1) {
    try {

      if(!fechas.value.fechai){
        return false;
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer 3CUAVISaNhWVCRNPofjXtWMk1D99LOoFzMf6LfoNlkiN8dGDkd");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`${urlApiExport.value}?page=${page}&limit=${limit}&fechai=${fechas.value.fechai}&fechaf=${fechas.value.fechaf}`, requestOptions);
      
      const data = await response.json();

      if(data.resp){
        return data;
      }else{
        configSnackbar.value = {
            message: "No se pudo recuperar las transacciones, recargue de nuevo.",
            type: "error",
            model: true
        };
        btnLoadingDescargar.value = false;
        return null;
      }
    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar las transacciones, recargue de nuevo",
          type: "error",
          model: true
      };
      console.error(error.message);
      btnLoadingDescargar.value = false;
      return null;
    }
  }

  // PASO 4
  function eliminarDuplicadosPorWylexId(array) {
      const vistos = new Set();
      return array.filter(item => {
          if (vistos.has(item.wylexId)) {
              return false; // Eliminar duplicado
          } else {
              vistos.add(item.wylexId);
              return true; // Mantener el primer encuentro
          }
      });
  }

  // PASO 2
  async function fetchFullDescargar(){
    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    dataFullExportar.value = [];
    var estado = 1;
    var pages = 1;
    while(true){
      const res = await getDataExportarServer(
        pages,
        500,
        estado
      );

      const responseData = res.data;
      const totalDataExportar = "-";

      for(var keyTransaccion in responseData){
        const transaccionesData = responseData[keyTransaccion];

        // Nuevo objeto para cada elemento de responseData
        let newItem = {}; 

        // Recorremos las claves de usuarios
        for (let key in headersGlobal.value) {
            // Verificamos si la clave existe en item y la agregamos al nuevo objeto
            if (transaccionesData.hasOwnProperty(key)) {
              newItem[key] = transaccionesData[key];
            }else{
              newItem[key] = "";
            }
        }

        // newItem["reembolso_created_at"] = transaccionesData.created_at;
        // newItem["reembolso_estado"] = transaccionesData.estado;
        // newItem["created_at_reembolso"] = transaccionesData.created_at;
        
        // Agregamos el nuevo objeto a dataFullExportar.value
        dataFullExportar.value.push(newItem);
      }

      // responseData.forEach((transacciones_realizadas) => {
        
      // });

      docsExportNumberLength.value.tamanioActual = dataFullExportar.value.length;
      docsExportNumberLength.value.tamanioTotal = totalDataExportar;

      pages++;

      if(responseData.length < 1){
        break;
      }
    }

    // console.log(dataFullExportar.value)

    return true;
  };

  // PASO 1
  async function downloadSearch() {
    try {

      btnLoadingDescargar.value=true;
      await fetchFullDescargar();
      btnLoadingDescargar.value=false;

      let doc = [];
      doc = dataFullExportar.value;
      var title = `${urlTitleExport.value}`+ generateSlug(fechas.value.fechai)+"_hasta_"+ generateSlug(fechas.value.fechaf);

      exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

    } catch (error) {
        console.log(error)
        configSnackbar.value = {
            message: "No se pudo recuperar los datos de registros para exportar, recargue de nuevo.",
            type: "error",
            model: true
        };
        return false;
    }
  };
  // FIN DESCARGAR
</script>

<template>
  <section>
    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type">
        {{ configSnackbar.message }}
    </VSnackbar>
    <VRow>
      <VCol
        class="mt-0"
        cols="6"
        md="6"
        lg="6"
      >
        
        <VCard>
          <VCardItem>
            <div class="p-0 d-flex flex-column align-items-start">
              <VCardTitle>
                Bajar datos de pagos exitosos para <br>eliminatorias sud 2026.
              </VCardTitle>
              <VCardSubtitle>
                Debes seleccionar la fecha inicial y la fecha final del combo.
              </VCardSubtitle>
            </div>
          </VCardItem>

          <VCardText>
            <div class="d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0 mb-5">
              <VCombobox 
                v-model="comboFechaModel" 
                :items="comboFechaItems" 
                label="Seleccione la fecha"
                :menu-props="{ maxHeight: '300' }" 
                :disabled="btnLoadingDescargar"
                />
              <AppDateTimePicker 
                label="Fecha de inicio y fin del curso" 
                prepend-inner-icon="tabler-calendar" 
                density="compact" 
                class="d-none"
                v-model="selectModelFechas"
                show-current=true 
                @on-change="obtenerFechas" 
                :config="{
                    position: 'auto right',
                    mode: 'range',
                    altFormat: 'd F j, Y',
                    dateFormat: 'l, j \\d\\e F \\d\\e Y',
                    valueFormat: 'd-m-Y',
                    reactive: true
                }" />
                <small class="mb-2">La hora para las fechas serán 17:30</small>
                <hr>
                <small class="py-3">
                  <b>Fecha inicio: </b> {{ fechas.fechai }}<br>
                  <b>Fecha inicio: </b> {{ fechas.fechaf }}
                </small>
            </div>

            <div class="d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
              <VBtn
                :loading="btnLoadingDescargar"
                :disabled="btnLoadingDescargar"
                color="primary"
                @click="downloadSearch"
              >
                Descargar datos de facturación
                <VIcon
                  end
                  icon="tabler-cloud-download"
                />
              </VBtn>
              <small class="px-0 py-1 text-disabled" v-if="btnLoadingDescargar">
                Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
              </small>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>