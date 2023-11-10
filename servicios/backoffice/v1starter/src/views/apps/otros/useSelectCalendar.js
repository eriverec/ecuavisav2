import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const valoresFechas = [
  {
    name:"Hoy",
    config:{
      title: "hoy",
      i: moment(),
      f: moment()
    }
  },
  {
    name:"Ayer",
    config:{
      i: moment().add(-1, 'days'),
      f: moment().add(-1, 'days'),
      title:"hoy"
    }
  },
  {
    name:"Hace una semana",
    config:{
      i: moment().add(-7, 'days'),
      f: moment(),
      title:"hace una semana"
    }
  },
  {
    name:"15 días atrás",
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
      f: fechaEncontrada.config.f
    }
  }
  return {
    i: null,
    f: null
  };
}

export const getTranscursoDeFechas = (fechai, fechaf, pagina) => {
  const fechaFinal = moment(fechaf, 'DD/MM/YYYY HH:mm:ss');
  const fechaActual = moment(fechai, 'DD/MM/YYYY HH:mm:ss');

  const segundosTranscurridos = fechaActual.diff(fechaFinal, 'seconds');

  if (segundosTranscurridos < 60 && segundosTranscurridos > -1) {
    // return 'Hace ' + segundosTranscurridos + ' segundos';
    if(segundosTranscurridos < 5){
      return `El usuario recargó la página`;
    }
    return `Usuario conectado, durante ${segundosTranscurridos} segundo(s)`;
    // return { cantidad: segundosTranscurridos, tipo: 'segundos' };
  } else {
    const minutosTranscurridos = fechaActual.diff(fechaFinal, 'minutes');

    if (minutosTranscurridos < 60 && minutosTranscurridos > -1) {

      if(minutosTranscurridos > 30){
        return `Usuario desconectado, duración ${minutosTranscurridos} minuto(s)`;
      }

      // // return 'Hace ' + minutosTranscurridos + ' minutos';
      if(minutosTranscurridos < 2){
        return `Usuario conectado, durante ${minutosTranscurridos} minuto`;
      }
      return `Usuario conectado, durante ${minutosTranscurridos} minutos`;
      // return { cantidad: minutosTranscurridos, tipo: 'minutos' };
    } else {
      const horasTranscurridas = fechaActual.diff(fechaFinal, 'hours');

      if (horasTranscurridas < 24 && horasTranscurridas > -1) {

        if(horasTranscurridas < 2 && pagina.title.includes("En Vivo") == false){
          return `Usuario desconectado, duración ${horasTranscurridas} hora(s)`;
        }

        if(horasTranscurridas < 7 && pagina.title.includes("En Vivo") == true){
          return `Usuario conectado al en vivo, duración ${horasTranscurridas} hora(s)`;
        }

        // return 'Hace ' + horasTranscurridas + ' horas';
        return `Usuario desconectado, duración ${horasTranscurridas} hora(s)`;
        // return { cantidad: horasTranscurridas, tipo: 'horas' };
      } else {
        const diasTranscurridos = fechaActual.diff(fechaFinal, 'days');
        // return { cantidad: diasTranscurridos, tipo: 'días' };
        // return 'Hace ' + diasTranscurridos + ' días';
        if(diasTranscurridos > 1){
          return `Usuario desconectado, duración ${diasTranscurridos} día(s)`;
        }
        return `Usuario desconectado, duración ${diasTranscurridos} día(s)`;
      }
    }
  }
  return 'Hace un momento';

}