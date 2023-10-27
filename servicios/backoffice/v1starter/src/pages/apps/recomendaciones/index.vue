<script setup>
import ChartRecomendaciones from "@/views/charts/apex-chart/ChartRecomendaciones.vue";
</script>

<style type="text/css">
.disabled {
  opacity: 0.1;
  pointer-events: none;
}

.clickable {
  cursor: pointer;
}
</style>
<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class=" flex-wrap justify-space-between gap-4">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Recomendaciones por navegación</VCardTitle>
            <VCardSubtitle>Categoría de dispositivos de los últimos 7 días</VCardSubtitle>
          </VCardItem>
          <VDivider />

          <ChartRecomendaciones @activityData="getActivity" />

        </VCardText>
      </VCard>
    </VCol>


  </VRow>
</template>
<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
//alert(moment(new Date(), "YYYY-MM-DD").format('YYYY-MM-DD'))
export default {
  data() {
    return {
      userSelected: "",
      visita: true,
      fechaInicio: "",
      fechaFin: "",
      datos: [],
      isLoading: true,
      dataN: [],
      datosFiltrados: [],
      datosGrouped: [],
      currentPage: 1,
      itemsPerPage: 10,
      totalPaginas: 0,
      actividadUsuario: [],
      actividadUsuarioFull: [],
      actividadUsuarioVisible: false,
      verMas: false,
      dateNowF: moment().format("DD/MM/YYYY HH:mm:ss").toString(),
      userBackoffice: JSON.parse(localStorage.getItem('userData')),
      iconDevices: [
        {
          browser: "Chrome",
          os: "Windows",
          icon: "tabler-brand-windows",
          color: "info",
        },
        {
          browser: "Safari",
          os: "Mac OS",
          icon: "tabler-brand-apple",
          color: "secondary",
        },
        {
          browser: "Chrome",
          os: "Android",
          icon: "tabler-brand-android",
          color: "success",
        },
        {
          browser: "Chrome",
          os: "Linux",
          icon: "mdi-linux",
          color: "success",
        },
      ],
      device: [
        {
          name: "movil",
          icon: "mdi-cellphone-android",
        },
        {
          name: "desktop",
          icon: "mdi-laptop-chromebook",
        }
      ]
    };
  },
  computed: {
    totalPages() {
      //return Math.ceil(this.datosFiltrados.length / this.itemsPerPage);
      return Math.ceil(this.datosGrouped.length / this.itemsPerPage);
    },
    /*visibleData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.datosFiltrados.slice(start, end);
    },*/
    visibleData() {
      this.isLoading = true;
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      const arrayI = JSON.parse(JSON.stringify(this.dataN));


      const divText32 = document.querySelector('.dataTable');
      const divTable = document.querySelector('.tableDataUser');
      const divPageTable = document.querySelector('.pagtable');


      if (divText32) {
        if (arrayI != 0) {
          //console.log("lleno");
          divText32.classList.add('d-none');
          divTable.classList.remove('d-none');
          divPageTable.classList.remove('d-none');

        } else {
          //console.log("vacio");
          divText32.classList.remove('d-none');
          divTable.classList.add('d-none');
          divPageTable.classList.add('d-none');

        }
      }




      if (arrayI.length !== 0) {
        this.isLoading = false;
        let arrayFixed = [];

        for (let j in arrayI) {
          //console.log('prueba', arrayI[j].users[0].first_name )
          let data = {
            device: arrayI[j].device,
            os: arrayI[j].os,
            browser: arrayI[j].browser,
            first_name: arrayI[j].users[0]?.first_name ? arrayI[j].users[0].first_name.trim() : "",
            last_name: arrayI[j].users[0]?.last_name ? arrayI[j].users[0].last_name.trim() : "",
            navigationRecord: arrayI[j].navigationRecord,
            total: 0

          }

          arrayFixed.push(data);
        }
        //console.log('fixed',arrayFixed);

        const final = arrayFixed.reduce((a, b) => {

          var i = a.findIndex((x) => x.first_name == b.first_name & x.last_name == b.last_name & x.os == b.os & x.browser == b.browser & x.device == b.device);
          return i === -1 ? a.push({
            os: b.os, browser: b.browser, device: b.device, navigationRecord: b.navigationRecord, first_name: b.first_name, last_name: b.last_name, total: b.navigationRecord, count: 1
          }) : (a[i].total += parseInt(a[i].navigationRecord), a[i].count++), a;
        }, []);

        //console.log('final', final);

        if (this.visita) {
          for (var i in final) {
            let count = final[i].count
            final[i].total = count;

          }
        }

        final.sort((a, b) => {
          if (a.total > b.total) {
            return -1;
          }
          if (a.total < b.total) {
            return 1;
          }
        });

        this.datosGrouped = final;

      }
      return this.datosGrouped.slice(start, end);
      //const final = JSON.parse(JSON.stringify(this.dataN));
      //const final = this.dataN.flat();      
      //let all = final.reduce((prev, next) => prev.concat(next.users), []);

      /*
     final = this.dataN.reduce( (a,b) => {
      var i = a.findIndex((x) => x.users[0].first_name == b.users[0].first_name & x.users[0].last_name == b.users[0].last_name);
      return i === -1 ? a.push({ os : b.os, browser: b.browser, device: b.device, sessions : 1 }) : a[i].sessions++, a;
      }, []);
      */


    },
  },
  async mounted() {
    //this.filtrarDatos([]);
    await this.accionBackoffice({
      "usuario": this.userBackoffice.email,
      "pagina": "trazabilidad-dispositivos",
      "fecha": this.dateNowF
    });
  },
  methods: {
    //resolveActivity() {

    // },
    getActivity(value) {
      this.dataN = value.data;
      this.visita = value.visita;
      this.isLoading = false;
      //console.log('llega',value); 
    },
    resolveActividadUser(first, last) {

      const arrayI = JSON.parse(JSON.stringify(this.dataN));
      console.log('arrayI', arrayI);
      const inicio = [];
      arrayI.forEach(e => {
        let data = {
          first_name: e.users[0]?.first_name,
          last_name: e.users[0]?.last_name,
          navigationData: e.navigationData
        }
        inicio.push(data);
      });

      console.log('inicio', inicio);

      const arrayFiltro = [];
      this.userSelected = first + ' ' + last;
      let fullNameViene = first + ' ' + last;
      //console.log('name',fullNameViene);
      //console.log('inicio' ,inicio); 
      for (let p of inicio) {
        let fullName = p.first_name + ' ' + p.last_name;
        if (fullName == fullNameViene) {
          for (let i of p.navigationData) {

            var allowedDateFormats = ['DD/MM/YYYY', 'DD/M/YYYY', 'M/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'M/D/YYYY', 'D/M/YYYY'];
            var allowedFullDateFormats = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY H:mm:ss', 'DD/MM/YYYY H:mm:ss a', 'DD/MM/YYYY HH:mm:ss a'];
            let fechaFormat = moment(i.fecha, allowedDateFormats, true).format('DD/MM/YYYY');
            let horaFix = i.hora.split(':');
            if (horaFix[2].indexOf(' ') >= 0) {
              let slot3 = horaFix[2].split(' ');
              horaFix[2] = slot3[0];
            }
            let horaFinal = horaFix[0] + ':' + horaFix[1] + ':' + horaFix[2];
            let fullFecha = fechaFormat + ' ' + horaFinal;
            let fullFechaFormat = moment(fullFecha, allowedFullDateFormats, true).format();

            let data = {
              first_name: p.first_name,
              last_name: p.last_name,
              url: i.url,
              title: i.title,
              fecha: fechaFormat,
              fechaRaw: i.fecha,
              fullFecha: fullFechaFormat,
              hora: horaFinal
            }
            arrayFiltro.push(data);
          }
        }
      }

      arrayFiltro.sort((a, b) => {
        var timestampA = new Date(a.fullFecha);
        var timestampB = new Date(b.fullFecha);
        return timestampB - timestampA;
      });

      //console.log('Sorted F',arrayFiltro);
      this.actividadUsuario = arrayFiltro.slice(0, 10);
      this.actividadUsuarioFull = arrayFiltro;

      this.actividadUsuarioVisible = true;
    },
    convertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          if (line != "") line += ",";

          line += array[i][index];
        }

        str += line + "\r\n";
      }

      return str;
    },
    exportCSVFile(headers, items, fileTitle) {
      if (headers && items[0].wylexId !== "wylexId") {
        items.unshift(headers);
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items);

      var csv = this.convertToCSV(jsonObject);

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
    },
    async download() {
      const arrayI = JSON.parse(JSON.stringify(this.dataN));
      const arrayExport = [];
      for (let i of arrayI) {
        let user = i.users[0];
        let data = {
          userId: i.userId,
          first_name: user?.first_name,
          last_name: user?.last_name,
          phone_number: user?.phone_number,
          browser: i.browser,
          //city: i.city,
          created_at: i.created_at,
          device: i.device,
          //idActivity: i.idActivity,
          actividad: i.navigationRecord,
          os: i.os,
          timestamp: i.timestamp
        }
        arrayExport.push(data);
      }
      let headers = {
        userId: "userId",
        first_name: "first_name",
        last_name: "last_name",
        phone_number: "phone_number",
        browser: "browser",
        //city: "city",
        created_at: "created_at",
        device: "device",
        //idActivity: "idActivity",
        actividad: "actividad",
        os: "os",
        timestamp: "timestamp"
      };

      let title = "usuarios_dispositivos";

      await this.accionBackoffice({
        "usuario": this.userBackoffice.email,
        "pagina": "trazabilidad-dispositivos",
        "accion": "export",
        "fecha": this.dateNowF
      });
      //if(usersFull.length > totalUsers){
      //console.log("arrayExport", arrayExport);
      this.exportCSVFile(headers, arrayExport, title);
      // }
    },
    filtrarDatos() {
      this.isLoading = true;
      const arrayI = JSON.parse(JSON.stringify(this.dataN));
      const divText32 = document.querySelector('.dataTable');
      const divTable = document.querySelector('.tableDataUser');
      const divPageTable = document.querySelector('.pagtable');

    },
    async accionBackoffice(logData) {
      if (this.userBackoffice.email !== 'admin@demo.com') {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var log = JSON.stringify(logData);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: log,
          redirect: 'follow'
        };
        await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
          .then(response => {
          }).catch(error => console.log('error', error));
      }
    }
  },
};
</script>