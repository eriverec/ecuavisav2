<script setup>
import { ref, onMounted } from 'vue'

// Configuración de la API
const API_BASE_URL = 'https://services.ecuavisa.com/servicio-mediakit/api-v3.php'
const FOLDER_NAME = 'metricas'

// Estado de la aplicación
const loading = ref(false)
const redesSociales = ref([])
const showModal = ref(false)
const modalMode = ref('add') // 'add' o 'edit'
const editingIndex = ref(-1)
const notification = ref({ show: false, message: '', type: 'success' })

// Formulario
const formData = ref({
  id: '',
  name: '',
  followers: '',
  followersLabel: 'Seguidores',
  engagement: '',
  alcance: '',
  icon: ''
})

// Iconos predefinidos para redes sociales
const socialIcons = {
  facebook: '<svg viewBox="0 0 666.667 666.667"><defs><clipPath id="facebook_icon__a" clipPathUnits="userSpaceOnUse"><path d="M0 700h700V0H0Z"/></clipPath></defs><g clip-path="url(#facebook_icon__a)" transform="matrix(1.33333 0 0 -1.33333 -133.333 800)"><path d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0" style="fill:#0866ff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(600 350)"/><path d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z" style="fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none" transform="translate(447.918 273.604)"/></g></svg>',
  instagram: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 264.583 264.583"><defs><radialGradient xlink:href="#instagram_icon__a" id="instagram_icon__f" cx="158.429" cy="578.088" r="52.352" fx="158.429" fy="578.088" gradientTransform="matrix(0 -4.03418 4.28018 0 -2332.227 942.236)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#instagram_icon__b" id="instagram_icon__g" cx="172.615" cy="600.692" r="65" fx="172.615" fy="600.692" gradientTransform="matrix(.67441 -1.16203 1.51283 .87801 -814.366 -47.835)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#instagram_icon__c" id="instagram_icon__h" cx="144.012" cy="51.337" r="67.081" fx="144.012" fy="51.337" gradientTransform="matrix(-2.3989 .67549 -.23008 -.81732 464.996 -26.404)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#instagram_icon__d" id="instagram_icon__e" cx="199.788" cy="628.438" r="52.352" fx="199.788" fy="628.438" gradientTransform="matrix(-3.10797 .87652 -.6315 -2.23914 1345.65 1374.198)" gradientUnits="userSpaceOnUse"/><linearGradient id="instagram_icon__d"><stop offset="0" stop-color="#ff005f"/><stop offset="1" stop-color="#fc01d8"/></linearGradient><linearGradient id="instagram_icon__c"><stop offset="0" stop-color="#780cff"/><stop offset="1" stop-color="#820bff" stop-opacity="0"/></linearGradient><linearGradient id="instagram_icon__b"><stop offset="0" stop-color="#fc0"/><stop offset="1" stop-color="#fc0" stop-opacity="0"/></linearGradient><linearGradient id="instagram_icon__a"><stop offset="0" stop-color="#fc0"/><stop offset=".124" stop-color="#fc0"/><stop offset=".567" stop-color="#fe4a05"/><stop offset=".694" stop-color="#ff0f3f"/><stop offset="1" stop-color="#fe0657" stop-opacity="0"/></linearGradient></defs><path fill="url(#instagram_icon__e)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)"/><path fill="url(#instagram_icon__f)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)"/><path fill="url(#instagram_icon__g)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)"/><path fill="url(#instagram_icon__h)" d="M204.15 18.143c-55.23 0-71.383.057-74.523.317-11.334.943-18.387 2.728-26.07 6.554-5.922 2.942-10.592 6.351-15.201 11.13-8.394 8.716-13.481 19.439-15.323 32.184-.895 6.188-1.156 7.45-1.209 39.056-.02 10.536 0 24.4 0 42.999 0 55.2.062 71.341.326 74.476.916 11.032 2.645 17.973 6.308 25.565 7 14.533 20.37 25.443 36.12 29.514 5.453 1.404 11.476 2.178 19.208 2.544 3.277.142 36.669.244 70.081.244 33.413 0 66.826-.04 70.02-.203 8.954-.422 14.153-1.12 19.901-2.606 15.852-4.09 28.977-14.838 36.12-29.575 3.591-7.409 5.412-14.614 6.236-25.07.18-2.28.255-38.626.255-74.924 0-36.304-.082-72.583-.26-74.863-.835-10.625-2.656-17.77-6.364-25.32-3.042-6.182-6.42-10.799-11.324-15.519-8.752-8.361-19.455-13.45-32.21-15.29-6.18-.894-7.41-1.158-39.033-1.213z" transform="translate(-71.816 -18.143)"/><path fill="#fff" d="M132.345 33.973c-26.716 0-30.07.117-40.563.594-10.472.48-17.62 2.136-23.876 4.567-6.47 2.51-11.958 5.87-17.426 11.335-5.472 5.464-8.834 10.948-11.354 17.412-2.44 6.252-4.1 13.397-4.57 23.858-.47 10.486-.593 13.838-.593 40.535 0 26.697.119 30.037.594 40.522.482 10.465 2.14 17.609 4.57 23.859 2.515 6.465 5.876 11.95 11.346 17.414 5.466 5.468 10.955 8.834 17.42 11.345 6.26 2.431 13.41 4.088 23.881 4.567 10.493.477 13.844.594 40.559.594 26.719 0 30.061-.117 40.555-.594 10.472-.48 17.63-2.136 23.888-4.567 6.468-2.51 11.948-5.877 17.414-11.345 5.472-5.464 8.834-10.949 11.354-17.412 2.419-6.252 4.079-13.398 4.57-23.858.472-10.486.595-13.828.595-40.525s-.123-30.047-.594-40.533c-.492-10.465-2.152-17.608-4.57-23.858-2.521-6.466-5.883-11.95-11.355-17.414-5.472-5.468-10.944-8.827-17.42-11.335-6.271-2.431-13.424-4.088-23.897-4.567-10.493-.477-13.834-.594-40.558-.594zm-8.825 17.715c2.62-.004 5.542 0 8.825 0 26.266 0 29.38.094 39.752.565 9.591.438 14.797 2.04 18.264 3.385 4.591 1.782 7.864 3.912 11.305 7.352 3.443 3.44 5.575 6.717 7.362 11.305 1.346 3.46 2.951 8.663 3.388 18.247.47 10.363.573 13.475.573 39.71 0 26.233-.102 29.346-.573 39.709-.44 9.584-2.042 14.786-3.388 18.247-1.783 4.587-3.919 7.854-7.362 11.292-3.443 3.441-6.712 5.57-11.305 7.352-3.463 1.352-8.673 2.95-18.264 3.388-10.37.47-13.486.573-39.752.573-26.268 0-29.38-.102-39.751-.573-9.592-.443-14.797-2.044-18.267-3.39-4.59-1.781-7.87-3.911-11.313-7.352-3.443-3.44-5.574-6.709-7.362-11.298-1.346-3.461-2.95-8.663-3.387-18.247-.472-10.363-.566-13.476-.566-39.726s.094-29.347.566-39.71c.438-9.584 2.04-14.786 3.387-18.25 1.783-4.588 3.919-7.865 7.362-11.305 3.443-3.441 6.722-5.57 11.313-7.357 3.468-1.351 8.675-2.949 18.267-3.389 9.075-.41 12.592-.532 30.926-.553zm61.337 16.322c-6.518 0-11.805 5.277-11.805 11.792 0 6.512 5.287 11.796 11.805 11.796 6.517 0 11.804-5.284 11.804-11.796 0-6.513-5.287-11.796-11.805-11.796zm-52.512 13.782c-27.9 0-50.519 22.603-50.519 50.482 0 27.879 22.62 50.471 50.52 50.471s50.51-22.592 50.51-50.471c0-27.879-22.613-50.482-50.513-50.482zm0 17.715c18.11 0 32.792 14.67 32.792 32.767 0 18.096-14.683 32.767-32.792 32.767-18.11 0-32.791-14.671-32.791-32.767 0-18.098 14.68-32.767 32.791-32.767z"/></svg>',
  x: '<svg fill="none" viewBox="0 0 1200 1227"><path fill="#fff" d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"/></svg>',
  youtube: '<svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 180"><path fill="red" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"/><path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z"/></svg>',
  tiktok: '<svg id="tiktok_icon_dark__Layer_2" viewBox="0 0 352.28 398.67"><g id="tiktok_icon_dark__Layer_1-2"><path d="M137.17 156.98v-15.56c-5.34-.73-10.76-1.18-16.29-1.18C54.23 140.24 0 194.47 0 261.13c0 40.9 20.43 77.09 51.61 98.97-20.12-21.6-32.46-50.53-32.46-82.31 0-65.7 52.69-119.28 118.03-120.81Z"/><path d="M140.02 333c29.74 0 54-23.66 55.1-53.13l.11-263.2h48.08c-1-5.41-1.55-10.97-1.55-16.67h-65.67l-.11 263.2c-1.1 29.47-25.36 53.13-55.1 53.13-9.24 0-17.95-2.31-25.61-6.34C105.3 323.9 121.6 333 140.02 333ZM333.13 106V91.37c-18.34 0-35.43-5.45-49.76-14.8 12.76 14.65 30.09 25.22 49.76 29.43Z"/><path d="M283.38 76.57c-13.98-16.05-22.47-37-22.47-59.91h-17.59c4.63 25.02 19.48 46.49 40.06 59.91ZM120.88 205.92c-30.44 0-55.21 24.77-55.21 55.21 0 21.2 12.03 39.62 29.6 48.86-6.55-9.08-10.45-20.18-10.45-32.2 0-30.44 24.77-55.21 55.21-55.21 5.68 0 11.13.94 16.29 2.55v-67.05c-5.34-.73-10.76-1.18-16.29-1.18-.96 0-1.9.05-2.85.07v51.49c-5.16-1.61-10.61-2.55-16.29-2.55Z"/><path d="M333.13 106v51.04c-34.05 0-65.61-10.89-91.37-29.38v133.47c0 66.66-54.23 120.88-120.88 120.88-25.76 0-49.64-8.12-69.28-21.91 22.08 23.71 53.54 38.57 88.42 38.57 66.66 0 120.88-54.23 120.88-120.88V144.33c25.76 18.49 57.32 29.38 91.37 29.38v-65.68c-6.57 0-12.97-.71-19.14-2.03Z"/><path d="M241.76 261.13V127.66c25.76 18.49 57.32 29.38 91.37 29.38V106c-19.67-4.21-37-14.77-49.76-29.43-20.58-13.42-35.43-34.88-40.06-59.91h-48.08l-.11 263.2c-1.1 29.47-25.36 53.13-55.1 53.13-18.42 0-34.72-9.1-44.75-23.01-17.57-9.25-29.6-27.67-29.6-48.86 0-30.44 24.77-55.21 55.21-55.21 5.68 0 11.13.94 16.29 2.55v-51.49C71.83 158.5 19.14 212.08 19.14 277.78c0 31.78 12.34 60.71 32.46 82.31C71.23 373.87 95.12 382 120.88 382c66.65 0 120.88-54.23 120.88-120.88Z" style="fill:#fff"/></g></svg>',
  linkedin: '<svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="#0A66C2"/></svg>',
  threads: '<svg aria-label="Threads" viewBox="0 0 192 192"><path fill="#fff" d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.189 18.963-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.553ZM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.114 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274Z"/></svg>'
}

// ========== FUNCIONES DE API ==========

async function getAllData() {
  try {
    const url = `${API_BASE_URL}?api=web&key=redesociales&folder=${FOLDER_NAME}`
    console.log('Llamando a la API:', url)
    
    const response = await fetch(url)
    const data = await response.json()
    
    console.log('Respuesta de la API:', data)
    
    if (data.success) {
      return data.data
    }
    throw new Error(data.message || 'Error al obtener los datos')
  } catch (error) {
    console.error('Error en getAllData:', error)
    throw error
  }
}

async function saveData(estructuraData) {
  try {
    const payload = {
      key: 'redesociales',
      estructura: estructuraData,
      folder: FOLDER_NAME
    }
    
    console.log('Guardando datos:', payload)
    
    const response = await fetch(`${API_BASE_URL}?api=update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    console.log('Respuesta de saveData:', data)
    
    if (data.success) {
      return data
    }
    throw new Error(data.message || 'Error al guardar los datos')
  } catch (error) {
    console.error('Error en saveData:', error)
    throw error
  }
}

// ========== FUNCIONES DE CARGA Y GESTIÓN ==========

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const data = await getAllData()
    console.log('Datos recibidos:', data)
    
    if (data && Array.isArray(data) && data.length > 0) {
      redesSociales.value = data[0]
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      redesSociales.value = [data]
    } else {
      redesSociales.value = []
      showNotification('No hay datos guardados. Usa el botón "Inicializar Datos" para crear la estructura.', 'info')
    }
  } catch (error) {
    console.error('Error completo:', error)
    
    if (error.message.includes('No se encontró')) {
      redesSociales.value = []
      showNotification('No se encontró el archivo. Usa el botón "Inicializar Datos" para crearlo.', 'info')
    } else {
      showNotification('Error al cargar los datos: ' + error.message, 'error')
      redesSociales.value = []
    }
  } finally {
    loading.value = false
  }
}

async function initializeData() {
  if (!confirm('¿Estás seguro de que deseas crear la estructura de datos inicial?')) {
    return
  }
  
  loading.value = true
  try {
    const estructuraInicial = [[
      {
        id: 'facebook',
        name: 'Facebook',
        followers: '0',
        followersLabel: 'Seguidores',
        engagement: '0%',
        alcance: '0/mes',
        icon: socialIcons.facebook
      }
    ]]
    
    await saveData(estructuraInicial)
    showNotification('Estructura de datos creada exitosamente', 'success')
    await loadData()
  } catch (error) {
    showNotification('Error al inicializar datos: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Abrir modal para agregar
function openAddModal() {
  modalMode.value = 'add'
  resetForm()
  showModal.value = true
}

// Abrir modal para editar
function openEditModal(index) {
  modalMode.value = 'edit'
  editingIndex.value = index
  const redSocial = redesSociales.value[index]
  
  formData.value = { ...redSocial }
  showModal.value = true
}

// Resetear formulario
function resetForm() {
  formData.value = {
    id: '',
    name: '',
    followers: '',
    followersLabel: 'Seguidores',
    engagement: '',
    alcance: '',
    icon: ''
  }
  editingIndex.value = -1
}

// Cerrar modal
function closeModal() {
  showModal.value = false
  resetForm()
}

// Guardar red social (agregar o editar)
async function saveRedSocial() {
  loading.value = true
  try {
    const nuevasRedes = [...redesSociales.value]
    
    // Si el icono está vacío y hay un icono predefinido para este ID, usarlo
    if (!formData.value.icon && socialIcons[formData.value.id.toLowerCase()]) {
      formData.value.icon = socialIcons[formData.value.id.toLowerCase()]
    }
    
    if (modalMode.value === 'add') {
      // Agregar nueva red social
      nuevasRedes.push({ ...formData.value })
      showNotification('Red social agregada exitosamente', 'success')
    } else {
      // Editar red social existente
      nuevasRedes[editingIndex.value] = { ...formData.value }
      showNotification('Red social actualizada exitosamente', 'success')
    }
    
    // Guardar en la API
    await saveData([nuevasRedes])
    
    // Recargar datos
    await loadData()
    closeModal()
  } catch (error) {
    showNotification('Error al guardar: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Eliminar red social
async function deleteRedSocial(index) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta red social?')) {
    return
  }
  
  loading.value = true
  try {
    const nuevasRedes = [...redesSociales.value]
    nuevasRedes.splice(index, 1)
    
    // Guardar en la API
    await saveData([nuevasRedes])
    
    showNotification('Red social eliminada exitosamente', 'success')
    
    // Recargar datos
    await loadData()
  } catch (error) {
    showNotification('Error al eliminar: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Aplicar icono predefinido
function applyPredefinedIcon(socialId) {
  if (socialIcons[socialId]) {
    formData.value.icon = socialIcons[socialId]
  }
}

// Mostrar notificación
function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}
</script>

<template>
  <section class="metricas-manager">
    <!-- Notificaciones -->
    <VSnackbar
      v-model="notification.show"
      :color="notification.type"
      location="top end"
      :timeout="3000"
    >
      {{ notification.message }}
    </VSnackbar>

    <!-- Loading Overlay -->
    <VOverlay
      v-model="loading"
      class="align-center justify-center"
      persistent
    >
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      />
    </VOverlay>

    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">
        Métricas de Redes Sociales
      </h1>
      <div class="d-flex gap-3">
        <VBtn
          v-if="!redesSociales || redesSociales.length === 0"
          color="warning"
          variant="tonal"
          @click="initializeData"
        >
          <VIcon
            icon="tabler-settings"
            start
          />
          Inicializar Datos
        </VBtn>
        <VBtn
          color="primary"
          @click="openAddModal"
        >
          <VIcon
            icon="tabler-plus"
            start
          />
          Agregar Red Social
        </VBtn>
      </div>
    </div>

    <!-- Lista de redes sociales -->
    <VRow>
      <VCol
        v-for="(red, index) in redesSociales"
        :key="red.id"
        cols="12"
        md="6"
        lg="4"
      >
        <VCard class="h-100">
          <VCardText>
            <div class="d-flex align-center mb-4">
              <div
                v-if="red.icon"
                class="me-3"
                v-html="red.icon"
              />
              <div v-else class="me-3">
                <VIcon
                  icon="tabler-brand-meta"
                  size="48"
                  color="disabled"
                />
              </div>
              <div>
                <h3 class="text-h6 mb-1">
                  {{ red.name }}
                </h3>
                <span class="text-caption text-medium-emphasis">{{ red.id }}</span>
              </div>
            </div>

            <VDivider class="my-4" />

            <div class="metrics-grid">
              <div class="metric-item">
                <VIcon
                  icon="tabler-users"
                  size="20"
                  color="primary"
                  class="me-2"
                />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    {{ red.followersLabel }}
                  </div>
                  <div class="text-h6">
                    {{ red.followers }}
                  </div>
                </div>
              </div>

              <div class="metric-item">
                <VIcon
                  icon="tabler-activity"
                  size="20"
                  color="success"
                  class="me-2"
                />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    Engagement
                  </div>
                  <div class="text-h6">
                    {{ red.engagement }}
                  </div>
                </div>
              </div>

              <div class="metric-item">
                <VIcon
                  icon="tabler-eye"
                  size="20"
                  color="info"
                  class="me-2"
                />
                <div>
                  <div class="text-caption text-medium-emphasis">
                    Alcance
                  </div>
                  <div class="text-h6">
                    {{ red.alcance }}
                  </div>
                </div>
              </div>
            </div>
          </VCardText>

          <VCardActions>
            <VSpacer />
            <VBtn
              variant="tonal"
              color="secondary"
              size="small"
              @click="openEditModal(index)"
            >
              <VIcon
                icon="tabler-edit"
                start
              />
              Editar
            </VBtn>
            <VBtn
              variant="tonal"
              color="error"
              size="small"
              @click="deleteRedSocial(index)"
            >
              <VIcon
                icon="tabler-trash"
                start
              />
              Eliminar
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>

      <!-- Empty State -->
      <VCol
        v-if="redesSociales.length === 0"
        cols="12"
      >
        <VCard class="text-center pa-10">
          <VIcon
            icon="tabler-chart-line"
            size="64"
            color="disabled"
            class="mb-4"
          />
          <p class="text-body-1 text-medium-emphasis mb-4">
            No hay redes sociales configuradas
          </p>
          <VBtn
            color="primary"
            @click="openAddModal"
          >
            Agregar primera red social
          </VBtn>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modal para agregar/editar -->
    <VDialog
      v-model="showModal"
      max-width="600"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>{{ modalMode === 'add' ? 'Agregar' : 'Editar' }} Red Social</span>
          <VBtn
            icon="tabler-x"
            variant="text"
            size="small"
            @click="closeModal"
          />
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VForm @submit.prevent="saveRedSocial">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="formData.id"
                  label="ID de la Red Social"
                  placeholder="Ej: facebook, instagram, tiktok"
                  required
                  variant="outlined"
                  density="compact"
                  hint="Usar minúsculas sin espacios"
                  persistent-hint
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="formData.name"
                  label="Nombre"
                  placeholder="Ej: Facebook, Instagram"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.followers"
                  label="Seguidores"
                  placeholder="Ej: 3.2M, 1500K"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.followersLabel"
                  label="Etiqueta de Seguidores"
                  placeholder="Ej: Seguidores, Suscriptores"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.engagement"
                  label="Engagement"
                  placeholder="Ej: 4.5%, 6.2%"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.alcance"
                  label="Alcance"
                  placeholder="Ej: 12M/mes, 5M vistas/mes"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol cols="12">
                <VSelect
                  label="Icono Predefinido"
                  :items="[
                    { title: 'Facebook', value: 'facebook' },
                    { title: 'Instagram', value: 'instagram' },
                    { title: 'X (Twitter)', value: 'x' },
                    { title: 'YouTube', value: 'youtube' },
                    { title: 'TikTok', value: 'tiktok' },
                    { title: 'LinkedIn', value: 'linkedin' },
                    { title: 'Threads', value: 'threads' }
                  ]"
                  variant="outlined"
                  density="compact"
                  clearable
                  hint="Selecciona un icono predefinido o usa uno personalizado abajo"
                  persistent-hint
                  @update:model-value="applyPredefinedIcon"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="formData.icon"
                  label="Icono SVG (Data URI)"
                  placeholder="data:image/svg+xml;utf8,<svg>...</svg>"
                  variant="outlined"
                  density="compact"
                  rows="3"
                  hint="SVG en formato Data URI. Deja vacío para usar icono genérico."
                  persistent-hint
                />
              </VCol>

              <VCol
                v-if="formData.icon"
                cols="12"
              >
                <div class="text-caption text-medium-emphasis mb-2">
                  Vista previa del icono:
                </div>
                <div
                  class="icon-preview"
                  v-html="formData.icon"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <!-- <VDivider /> -->
        <VCardActions>
          <!-- <VSpacer /> -->
          <VBtn
            color="secondary"
            variant="tonal"
            @click="closeModal"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="primary"
            @click="saveRedSocial"
          >
            {{ modalMode === 'add' ? 'Agregar' : 'Guardar Cambios' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>

<style scoped>
.metricas-manager {
  padding: 1.5rem;
}

.metrics-grid {
  display: grid;
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
}

.icon-preview {
  display: inline-flex;
  padding: 0.5rem;
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  border: 1px solid rgb(var(--v-border-color));
}
</style>