import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

import router from '@/router';
import axios from '@axios';

const userBackoffice = JSON.parse(localStorage.getItem('userData'));
export function logNav(to, from, next) {
    
    if(userBackoffice){

        if(userBackoffice.email !== 'admin@demo.com' ) {

            let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();

            let log = {
            usuario: userBackoffice.email,   
            pagina: to.path,
            fecha: dateNow
            };		

            //console.log(`Se accedió a la página: ${to.path}`); 
            //console.log(`Enviando`,log); 
            axios.post(`https://servicio-logs.vercel.app/accion`, log);
            
            
        }
    }   
    next();
}

export function logAction(accion, data = null) {
    if(userBackoffice){

        if(userBackoffice.email !== 'admin@demo.com' ) {

            let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();

            let log = {
            usuario: userBackoffice.email,   
            pagina: router.currentRoute.value.path,
            fecha: dateNow,
            accion: accion,
            data: data
            };		

            //console.log(`Se accedió a la página: ${to.path}`); 
            console.log(`Enviando`,log); 
            axios.post(`https://servicio-logs.vercel.app/accion`, log);
            
            
        }
    }      
}
  

