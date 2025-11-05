import { ref, onMounted, computed } from 'vue'

export function useDeviceDetection() {
  const isTV = ref(false)
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const deviceType = ref('unknown')
  const userAgent = ref('')

  // Detectar tipo de dispositivo
  const detectDevice = () => {
    const ua = navigator.userAgent.toLowerCase()
    userAgent.value = navigator.userAgent

    // Detectar TV
    isTV.value = detectTV(ua)
    
    if (isTV.value) {
      deviceType.value = 'tv'
      return
    }

    // Detectar otros dispositivos
    isMobile.value = /mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)
    isTablet.value = /tablet|ipad/i.test(ua) && !isMobile.value
    isDesktop.value = !isMobile.value && !isTablet.value && !isTV.value

    if (isMobile.value) deviceType.value = 'mobile'
    else if (isTablet.value) deviceType.value = 'tablet'
    else if (isDesktop.value) deviceType.value = 'desktop'
  }

  // Función principal para detectar TV
  const detectTV = (ua) => {
    // Lista de User Agents de Smart TVs conocidas
    const tvPatterns = [
      // Samsung Tizen
      /smart-tv|smarttv|tizen/i,
      /samsung.*tv/i,
      
      // LG WebOS
      /webos|web0s/i,
      /netcast/i,
      
      // Sony
      /sonydtv/i,
      /bravia/i,
      
      // Philips
      /philips.*tv/i,
      
      // Android TV
      /googletv/i,
      /android.*tv/i,
      
      // Apple TV
      /appletv/i,
      
      // Fire TV (Amazon)
      /aftt|aftb|aftm|afts/i,
      /kindle fire|silk-accelerated/i,
      
      // Roku
      /roku/i,
      
      // Chromecast
      /crkey/i,
      
      // Vizio
      /vizio/i,
      
      // Hisense
      /hisense/i,
      
      // TCL
      /tcl.*tv/i,
      
      // Otros indicadores genéricos
      /tv|television/i,
      /iptv|settopbox/i,
      /console|playstation|xbox/i
    ]

    // Verificar cada patrón
    const matchesPattern = tvPatterns.some(pattern => pattern.test(ua))
    
    // Verificación adicional por características
    const isLargeScreen = window.screen.width >= 1280 && window.screen.height >= 720
    const hasPointerCoarse = window.matchMedia('(pointer: coarse)').matches
    const isLandscape = window.innerWidth > window.innerHeight
    
    // Detectar si es TV por API específica
    const hasTVAPI = checkTVAPIs()

    return matchesPattern || hasTVAPI
  }

  // Verificar APIs específicas de TV
  const checkTVAPIs = () => {
    // Samsung Tizen
    if (typeof window.tizen !== 'undefined') return true
    
    // LG WebOS
    if (typeof window.webOS !== 'undefined') return true
    
    // Android TV
    if (typeof window.AndroidTV !== 'undefined') return true
    
    return false
  }

  // Obtener información específica de la TV
  const getTVInfo = computed(() => {
    if (!isTV.value) return null

    const ua = userAgent.value.toLowerCase()
    
    let brand = 'Unknown'
    let os = 'Unknown'

    // Detectar marca
    if (/samsung/i.test(ua)) {
      brand = 'Samsung'
      os = 'Tizen'
    } else if (/lg|webos|netcast/i.test(ua)) {
      brand = 'LG'
      os = 'WebOS'
    } else if (/sony|bravia/i.test(ua)) {
      brand = 'Sony'
      os = 'Android TV'
    } else if (/philips/i.test(ua)) {
      brand = 'Philips'
    } else if (/appletv/i.test(ua)) {
      brand = 'Apple'
      os = 'tvOS'
    } else if (/roku/i.test(ua)) {
      brand = 'Roku'
      os = 'Roku OS'
    } else if (/googletv|android.*tv/i.test(ua)) {
      brand = 'Android TV'
      os = 'Android TV'
    } else if (/aftt|aftb|aftm|afts/i.test(ua)) {
      brand = 'Amazon'
      os = 'Fire OS'
    }

    return {
      brand,
      os,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      userAgent: userAgent.value
    }
  })

  // Detectar tipo de entrada (control remoto vs mouse)
  const inputMethod = ref('unknown')
  
  const detectInputMethod = () => {
    // Verificar si hay puntero preciso (mouse)
    if (window.matchMedia('(pointer: fine)').matches) {
      inputMethod.value = 'mouse'
    }
    // Verificar si hay puntero grueso (touch/remote)
    else if (window.matchMedia('(pointer: coarse)').matches) {
      inputMethod.value = isTV.value ? 'remote' : 'touch'
    }
    else {
      inputMethod.value = 'keyboard'
    }
  }

  onMounted(() => {
    detectDevice()
    detectInputMethod()

    // Re-detectar en cambio de orientación/tamaño
    window.addEventListener('resize', detectDevice)
    window.addEventListener('orientationchange', detectDevice)
  })

  return {
    isTV,
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    userAgent,
    getTVInfo,
    inputMethod
  }
}