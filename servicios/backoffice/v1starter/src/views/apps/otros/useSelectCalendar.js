import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const valoresFechas = [
  {
    name:"Hoy",
    limit:2000,
    config:{
      title: "hoy",
      i: moment(),
      f: moment()
    }
  },
  {
    name:"Ayer",
    limit:4000,
    config:{
      i: moment().add(-1, 'days'),
      f: moment().add(-1, 'days'),
      title:"hoy"
    }
  },
  {
    name:"Hace una semana",
    limit:5000,
    config:{
      i: moment().add(-7, 'days'),
      f: moment(),
      title:"hace una semana"
    }
  },
  {
    name:"15 días atrás",
    limit:6000,
    config:{
      i: moment().add(-15, 'days'),
      f: moment(),
      title:"hace 15 días"
    }
  }
];

export const useSelectCalendar = () =>{
  const nombres = valoresFechas.map((valor) => {
    return valor.name;
  });
  return nombres;
};

export const useSelectValueCalendar = (selectedCombo = "Hoy") => {
  const fechaEncontrada = valoresFechas.find(fecha => fecha.name.toLowerCase() === selectedCombo.toLowerCase()) || null;
  // console.log(fechaEncontrada)
  if(fechaEncontrada){
    return {
      i: fechaEncontrada.config.i,
      title: fechaEncontrada.title,
      limit: fechaEncontrada.limit,
      f: fechaEncontrada.config.f
    }
  }
  return {
    i: null,
    f: null
  };
}

export const getTranscursoDeFechas = (fechai, fechaf, pagina, pagina_next = null) => {
  const fechaFinal = moment(fechaf, 'DD/MM/YYYY HH:mm:ss');
  const fechaActual = moment(fechai, 'DD/MM/YYYY HH:mm:ss');

  const segundosTranscurridos = fechaActual.diff(fechaFinal, 'seconds');

  // let texto_pagina = "";
  // if(pagina_old){
  //   if(pagina.title == pagina_old.title){
  //     texto_pagina = "Usuario se mantiene en la misma página";
  //   }
  // }

  if (segundosTranscurridos < 60 && segundosTranscurridos > -1) {
    if(segundosTranscurridos < 50){
      if(segundosTranscurridos==0){
        return  {
          tiempoTranscurrido: `El usuario recargó la página`,
          fechai:fechaf,
          fechaf:fechai,
          tipo: ""
        }
      }

      if(pagina_next){
        if(pagina_next.title.includes(pagina.title)){
          return  {
            tiempoTranscurrido: `El usuario recargó la página luego de ${segundosTranscurridos} segundos`,
            fechai:fechaf,
            fechaf:fechai,
            tipo: ""
          }
        }else{
          return  {
            tiempoTranscurrido: `El usuario tuvo una actividad de ${segundosTranscurridos} segundos y luego cambió de página`,
            fechai:fechaf,
            fechaf:fechai,
            tipo: ""
          }
        }
      }
    }

    return  {
      tiempoTranscurrido: `El usuario tuvo una actividad de ${segundosTranscurridos} segundos`,
      fechai:fechaf,
      fechaf:fechai,
      tipo: "Segundos"
    }
  }else{
    const minutosTranscurridos = fechaActual.diff(fechaFinal, 'minutes');
    if (minutosTranscurridos < 60 && minutosTranscurridos > -1) {
      var title = `El usuario tuvo una actividad de ${minutosTranscurridos} ${minutosTranscurridos>1?"minutos":"minuto"}`;

      if(minutosTranscurridos > 11){
        title = `El usuario tuvo una actividad de 10 minutos y una inactividad de ${minutosTranscurridos - 10} minutos`;
        
        if(pagina.title.includes("En Vivo")){
          title = `El usuario navegó en el envivo, durante ${minutosTranscurridos} ${minutosTranscurridos>1?"minutos":"minuto"}`;
        }
      }

      if(pagina_next){
        if(pagina_next.title.includes(pagina.title)){
          return  {
            tiempoTranscurrido: `El usuario recargó la página luego de ${minutosTranscurridos} ${minutosTranscurridos>1?"minutos":"minuto"}`,
            fechai:fechaf,
            fechaf:fechai,
            tipo: ""
          }
        }
      }

      return  {
        tiempoTranscurrido: `${title}`,
        fechai:fechaf,
        fechaf:fechai,
        tipo: "Minutos"
      }

    }else{
      const horasTranscurridas = fechaActual.diff(fechaFinal, 'hours');

      if (horasTranscurridas < 24 && horasTranscurridas > -1) {
        const horasTemp = parseInt(moment.duration(minutosTranscurridos - 10, 'minutes').asHours());
        var title = ``;
        if(horasTemp > 0){
          title = `El usuario tuvo una actividad de 10 minutos y una inactividad aproximadamente de ${horasTemp} ${horasTemp > 1 ? `horas`:`hora`} `;
        }else{
          title = `El usuario tuvo una actividad de 10 minutos y una inactividad aproximadamente de ${minutosTranscurridos - 10} minutos`;
        }

        if(horasTemp < 5){
          if(pagina.title.includes("En Vivo")){
            title = `El usuario navegó en el envivo, durante ${horasTemp} ${horasTemp>0?"horas":"hora"}`;
          }
        }

        if(pagina_next){
          if(pagina_next.title.includes(pagina.title)){
            if(horasTemp > 8){
              return  {
                tiempoTranscurrido: `El usuario recargó la página`,
                fechai:fechaf,
                fechaf:fechai,
                tipo: ""
              }
            }

            return  {
              tiempoTranscurrido: `El usuario recargó la página luego de ${horasTemp} ${horasTemp > 1 ? `horas`:`hora`}`,
              fechai:fechaf,
              fechaf:fechai,
              tipo: ""
            }
          }
        }

        // if(minutosTranscurridos > 11 && minutosTranscurridos < 61){
        //   title = `El usuario tuvo una actividad de 10 minutos y una inactividad de ${ minutosTranscurridos - 10 } minutos`;
        // }

        // if(minutosTranscurridos > 11 && minutosTranscurridos > 60){
        //   title = `El usuario tuvo una actividad de 10 minutos y una inactividad de ${moment.duration(minutosTranscurridos - 10, 'minutes').asHours()} horas`;
        // }

        return  {
          tiempoTranscurrido: title,
          fechai:fechaf,
          fechaf:fechai,
          tipo: "Horas"
        }

      } else {
        const diasTranscurridos = fechaActual.diff(fechaFinal, 'days');

        const diasTemp = parseInt(moment.duration(minutosTranscurridos - 10, 'minutes').asDays());
        const horasTemp = parseInt(moment.duration(minutosTranscurridos - 10, 'minutes').asHours());

        var title = ``;
        if(diasTemp > 0){
          title = `El usuario tuvo una actividad de 10 minutos y una inactividad aproximadamente de ${diasTemp} ${diasTemp > 1 ? `días`:`día`} `;
        }else{
          title = `El usuario tuvo una actividad de 10 minutos y una inactividad aproximadamente de ${horasTemp} horas`;
        }

        if(horasTemp > 5){
          if(pagina.title.includes("En Vivo | Ecuavisa")){
            title = `El usuario navegó en el envivo, tuvo una actividad de más de 5 horas`;
          }
        }

        if(pagina_next){
          if(pagina_next.title.includes(pagina.title)){
            return  {
              tiempoTranscurrido: `El usuario recargó la página luego de ${diasTemp} ${diasTemp > 1 ? `días`:`día`}`,
              fechai:fechaf,
              fechaf:fechai,
              tipo: ""
            }
          }
        }

        return  {
          tiempoTranscurrido: title,
          fechai:fechaf,
          fechaf:fechai,
          tipo: "Días"
        }
      }
    }
    
  }

  

  // if (segundosTranscurridos < 60 && segundosTranscurridos > -1) {
  //   // return 'Hace ' + segundosTranscurridos + ' segundos';

  //   if(segundosTranscurridos < 5){
  //     return `El usuario recargó la página`;
  //   }
    
  //   // if(pagina_old){
  //   //   if(pagina.title == pagina_old.title){
  //   //     return "El usuario se mantiene en la misma página";
  //   //   }
  //   // }

  //   return `Usuario conectado, durante ${segundosTranscurridos} segundo(s)`;
  //   // return { cantidad: segundosTranscurridos, tipo: 'segundos' };
  // } else {
  //   const minutosTranscurridos = fechaActual.diff(fechaFinal, 'minutes');

  //   if (minutosTranscurridos < 60 && minutosTranscurridos > -1) {

  //     if(minutosTranscurridos > 30 && pagina.title.includes("En Vivo") == false){
  //       return `Usuario desconectado, duración ${minutosTranscurridos} minuto(s)`;
  //     }

  //     // // return 'Hace ' + minutosTranscurridos + ' minutos';
  //     if(minutosTranscurridos < 2){

  //       // if(pagina_old){
  //       //   if(pagina.title == pagina_old.title){
  //       //     return "El usuario se mantiene en la misma página";
  //       //   }
  //       // }

  //       return `Usuario conectado, durante ${minutosTranscurridos} minuto`;
  //     }

  //     if(minutosTranscurridos > 30 && pagina.title.includes("En Vivo") == true){
  //       // if(pagina_old){
  //       //   if(pagina.title == pagina_old.title){
  //       //     return "El usuario se mantiene en la misma página";
  //       //   }
  //       // }

  //       return `Usuario conectado, duración ${minutosTranscurridos} minuto(s)`;
  //     }

  //     return `Usuario conectado, durante ${minutosTranscurridos} minutos`;
  //     // return { cantidad: minutosTranscurridos, tipo: 'minutos' };
  //   } else {
  //     const horasTranscurridas = fechaActual.diff(fechaFinal, 'hours');

  //     if (horasTranscurridas < 24 && horasTranscurridas > -1) {

  //       if(horasTranscurridas < 2 && pagina.title.includes("En Vivo") == false){
  //         return `Usuario desconectado, duración ${horasTranscurridas} hora(s)`;
  //       }

  //       if(horasTranscurridas < 7 && pagina.title.includes("En Vivo") == true){
  //         // if(pagina_old){
  //         //   if(pagina.title == pagina_old.title){
  //         //     return "El usuario se mantiene en la misma página";
  //         //   }
  //         // }
  //         return `Usuario conectado al en vivo, duración ${horasTranscurridas} hora(s)`;
  //       }

  //       // return 'Hace ' + horasTranscurridas + ' horas';
  //       return `Usuario desconectado, duración ${horasTranscurridas} hora(s)`;
  //       // return { cantidad: horasTranscurridas, tipo: 'horas' };
  //     } else {
  //       const diasTranscurridos = fechaActual.diff(fechaFinal, 'days');
  //       // return { cantidad: diasTranscurridos, tipo: 'días' };
  //       // return 'Hace ' + diasTranscurridos + ' días';
  //       if(diasTranscurridos > 1){
  //         return `Usuario desconectado, duración ${diasTranscurridos} día(s)`;
  //       }
  //       return `Usuario desconectado, duración ${diasTranscurridos} día(s)`;
  //     }
  //   }
  // }
  // return 'Hace un momento';

}