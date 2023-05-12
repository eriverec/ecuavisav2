import axios from '@axios'
import { defineStore } from 'pinia'

export const useColeccionListStore = defineStore('ColeccionListStore', {

    actions: {
      
      fetchColecciones() { return axios.get('https://localhost:8080/lista') },

      addColeccion(data) {
        return new Promise((resolve, reject) => {
          axios.post('https://localhost:8080/crear', 
          data,
          ).then(response => resolve(response))
            .catch(error => reject(error))
        })
      },
     
      deleteColeccion(data) {
        return new Promise((resolve, reject) => {
          axios.delete(`https://localhost:8080/del`, data).then(response => resolve(response)).catch(error => reject(error))
        })
      },

      updateColeccion(data) {
        return new Promise((resolve, reject) => {
        axios.put(`https://localhost:8080/editar`,data)
        .then(response => resolve(response))
        .catch(error => reject(error))
        })
      },
    },
  })