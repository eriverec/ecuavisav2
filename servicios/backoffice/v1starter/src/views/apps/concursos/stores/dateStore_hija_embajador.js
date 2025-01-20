import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDateStore = defineStore('date', () => {
  const selectedDate = ref(null)

  function setDate(newDate) {
    selectedDate.value = newDate
  }

  return {
    selectedDate,
    setDate
  }
})