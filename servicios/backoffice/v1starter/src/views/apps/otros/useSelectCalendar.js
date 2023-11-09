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