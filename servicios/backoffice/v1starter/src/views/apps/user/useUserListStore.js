import axios from '@axios'
import { defineStore } from 'pinia'

export const useUserListStore = defineStore('UserListStore', {
  actions: {
    // 👉 Fetch users data
    fetchUsers(params) { return axios.get('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/get', { params }) },

    countUsers() { return axios.get('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/count') },

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
      axios.put(`https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/update?id=${id}`,
          userData,).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // 👉 fetch single user
    fetchUser(id) {
      return new Promise((resolve, reject) => {
        axios.get(`https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
