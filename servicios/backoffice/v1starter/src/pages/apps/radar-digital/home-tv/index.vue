<script setup>
import tv from './components/tv/index.vue'
import web from './components/web/index.vue'
const isTV = ref(false)

onMounted(() => {
  const userAgent = navigator.userAgent.toLowerCase()
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  // Heurísticas comunes para TVs
  const tvPatterns = [
    'smart-tv',
    'smarttv',
    'appletv',
    'hbbtv',
    'netcast',
    'tizen',
    'webos',
    'viera',
    'aquos',
    'philips',
    'roku',
    'pov_tv',
    'aoc-tv',
    'tv safari',
  ]

  const isTVUA = tvPatterns.some(pattern => userAgent.includes(pattern))
  // Algunos TVs tienen pantallas grandes pero con poca densidad de píxeles
  const isLargeScreen = screenWidth <= 1030 && screenHeight >= 720

  // No suelen tener eventos táctiles
  const isNotTouch = !('ontouchstart' in window)

  isTV.value = isTVUA || (isLargeScreen && isNotTouch)
})
</script>

<template>
	<tv v-if="isTV" />
	<web v-else />
</template>
