import axios from '@axios'
import { defineStore } from 'pinia'

export const useUserListStore = defineStore('UserListStore', {
  actions: {
    // 👉 Fetch users data
    fetchUsers(params) { return axios.get('https://usuarios-backoffice.vercel.app/all', { params }) },
    /*************CREADO EL 29 DE FEBRERO DEL 2024 - CR*************/
    fetchUsers_v2(params) { return axios.get('https://usuarios-backoffice.vercel.app/export', { params }) },
    /*************CREADO EL 29 DE FEBRERO DEL 2024 - CR*************/

    countPageUsers() { return axios.get('https://usuarios-backoffice.vercel.app/count') },

    fetchFullUsers(p) { return axios.get(`https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/fullUsers?page=${p}`) },

    countUsers() { return axios.get('https://usuarios-backoffice.vercel.app/count/all-providers') },

    // 👉 Add User
    addUser(userData) {
      return new Promise((resolve, reject) => {
        axios.post('/apps/users/user', {
          user: userData,
        }).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    updateUser(userData, id) {
      return new Promise((resolve, reject) => {
      axios.put(`https://ecuavisa-register.onrender.com/update?id=${id}`, new URLSearchParams(userData))
      .then(response => resolve(response))
      .catch(error => reject(error))
      })
    },

    fetchTema(id) {
      return new Promise((resolve, reject) => {
        axios.get(`https://ecuavisa-seguimiento-tema.onrender.com/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
    
    deleteTema(id, nombres) {
      return new Promise((resolve, reject) => {
        axios.delete(`https://ecuavisa-seguimiento-tema.onrender.com/delete`, { data: { idUser: id, nombreTema: nombres } }).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    fetchNotification(id) {
      return new Promise((resolve, reject) => {
        axios.get(`https://ecuavisa-notificaciones-local.vercel.app/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    deleteNotification(id, nombres) {
      return new Promise((resolve, reject) => {
        axios.delete(`https://ecuavisa-notificaciones-local.vercel.app/delete`, { data: { idUser: id, nombreNotificacion: nombres } }).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    
    // 👉 fetch single user
    fetchUser(id) {
      if(!id){
        return new Promise((resolve, reject) => {
          null
        })
      }
      return new Promise((resolve, reject) => {
        axios.get(`https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
