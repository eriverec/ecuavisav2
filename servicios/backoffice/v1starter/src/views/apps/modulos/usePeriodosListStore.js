import axios from '@axios'
import { defineStore } from 'pinia'

export const usePeriodosListStore = defineStore('PeriodosListStore', {

    actions: {
      // 👉 Fetch users data
      fetchPeriodos() { return axios.get('https://ecuavisa-modulos.vercel.app/periodo') },
    

      fetchPeriodo(id) {
        return new Promise((resolve, reject) => {
          axios.get(`https://ecuavisa-modulos.vercel.app/periodo/${id}`).then(response => resolve(response)).catch(error => reject(error))
        })
      },  

      addPeriodo(data) {
        return new Promise((resolve, reject) => {
          axios.post('https://ecuavisa-modulos.vercel.app/periodo', 
            data,
          ).then(response => resolve(response))
            .catch(error => reject(error))
        })
      },
     
      deletePeriodo(id) {
        return new Promise((resolve, reject) => {
          axios.delete(`https://ecuavisa-modulos.vercel.app/periodo/${id}`).then(response => resolve(response)).catch(error => reject(error))
        })
      },

      updatePeriodo(id, data) {
        return new Promise((resolve, reject) => {
        axios.put(`https://ecuavisa-modulos.vercel.app/periodo/${id}`, data)
        .then(response => resolve(response))
        .catch(error => reject(error))
        })
      },
    },
  })