import axios from '@axios'
import { defineStore } from 'pinia'

export const usePaquetesListStore = defineStore('PaquetesListStore', {

    actions: {
      // 👉 Fetch users data
      fetchPaquetes() { return axios.get('https://ecuavisa-modulos.vercel.app/paquete') },
    

      fetchPaquete(id) {
        return new Promise((resolve, reject) => {
          axios.get(`https://ecuavisa-modulos.vercel.app/paquete/${id}`).then(response => resolve(response)).catch(error => reject(error))
        })
      },  

      addPaquete(data) {
        return new Promise((resolve, reject) => {
          axios.post('https://ecuavisa-modulos.vercel.app/paquete', 
            data,
          ).then(response => resolve(response))
            .catch(error => reject(error))
        })
      },
     
      deletePaquete(id) {
        return new Promise((resolve, reject) => {
          axios.delete(`https://ecuavisa-modulos.vercel.app/paquete/${id}`).then(response => resolve(response)).catch(error => reject(error))
        })
      },

      updatePaquete(id, data) {
        return new Promise((resolve, reject) => {
        axios.put(`https://ecuavisa-modulos.vercel.app/paquete/${id}`, data)
        .then(response => resolve(response))
        .catch(error => reject(error))
        })
      },
    },
  })