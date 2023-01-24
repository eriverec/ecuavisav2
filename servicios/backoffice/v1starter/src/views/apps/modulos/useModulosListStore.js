import axios from '@axios'
import { defineStore } from 'pinia'

export const useModulosListStore = defineStore('ModulosListStore', {

    actions: {
      // 👉 Fetch users data
      fetchModulosPaquetes() { return axios.get('https://ecuavisa-modulos.vercel.app/modulo') },
    

      fetchModuloPaquete(id) {
        return new Promise((resolve, reject) => {
          axios.get(`https://ecuavisa-modulos.vercel.app/modulo/${id}`).then(response => resolve(response)).catch(error => reject(error))
        })
      },  

      addModuloPaquete(data) {
        return new Promise((resolve, reject) => {
          axios.post('https://ecuavisa-modulos.vercel.app/modulo', 
            data,
          ).then(response => resolve(response))
            .catch(error => reject(error))
        })
      },
     
      deleteModuloPaquete(id) {
        return new Promise((resolve, reject) => {
          axios.delete(`https://ecuavisa-modulos.vercel.app/modulo/${id}`).then(response => resolve(response)).catch(error => reject(error))
        })
      },

      updateModuloPaquete(id, data) {
        return new Promise((resolve, reject) => {
        axios.put(`https://ecuavisa-modulos.vercel.app/modulo/${id}`, data)
        .then(response => resolve(response))
        .catch(error => reject(error))
        })
      },
    },
  })