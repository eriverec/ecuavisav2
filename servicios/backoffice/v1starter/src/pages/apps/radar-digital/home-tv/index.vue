<script setup>
import tv from './components/tv/index.vue'
import web from './components/web/index.vue'
import { useDeviceDetection } from './components/useDeviceDetection'
const { isTV } = useDeviceDetection()
const screenWidth = ref(0)

// onMounted(() => {
  // const userAgent = navigator.userAgent.toLowerCase()
  // screenWidth.value = window.innerWidth
  // const screenHeight = window.innerHeight

  // // Heurísticas comunes para TVs
  // const tvPatterns = [
  //   'smart-tv',
  //   'smarttv',
  //   'appletv',
  //   'hbbtv',
  //   'netcast',
  //   'tizen',
  //   'webos',
  //   'viera',
  //   'aquos',
  //   'philips',
  //   'roku',
  //   'pov_tv',
  //   'aoc-tv',
  //   'tv safari',
  // ]

  // const isTVUA = tvPatterns.some(pattern => userAgent.includes(pattern))
  // // Algunos TVs tienen pantallas grandes pero con poca densidad de píxeles
  // const isLargeScreen = screenWidth.value <= 1130 && screenWidth.value >= 720;

  // // No suelen tener eventos táctiles
  // const isNotTouch = !('ontouchstart' in window) //&& isNotTouch

  // isTV.value = isTVUA || (isLargeScreen)
// })
</script>

<template>
  <tv />
</template>
