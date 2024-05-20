<script setup>

const formData = ref({
  url: '',
  key: '',
  elimAttr: [],
  reemplazarAttr: [],
  elimElementos: []
})

const elimAttrInput = ref('')
const reemplazarAttrInput = ref('')
const elimElementosInput = ref('')
const elements = ref([])
const error = ref('')

const submitForm = async () => {


  if (elimAttrInput.value) {
    formData.value.elimAttr = elimAttrInput.value.split(',').map(attr => attr.trim());
  }

  if (reemplazarAttrInput.value) {
    formData.value.reemplazarAttr = reemplazarAttrInput.value.split(',').reduce((acc, val, index, array) => {
      if (index % 2 === 0) {
        acc.push({ buscar: array[index].trim(), reemplazar: array[index + 1]?.trim() || '' })
      }
      return acc
    }, []);
  }


  formData.value.elimElementos = elimElementosInput.value.split(',').map(element => element.trim())

  try {
    const response = await fetch('https://jsonhtml-ecuavisa.vercel.app/read/remap_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })

    if (!response.ok) {
      throw new Error('Error en la solicitud')
    }

    const responseData = await response.json()
    console.log('Response:', responseData)
    if (responseData && responseData.elements && responseData.elements.length > 0) {
      elements.value = responseData.elements
    } else {
      elements.value = []
      error.value = 'No se encontraron elementos'
    }
    error.value = ''
  } catch (error) {
    console.error('Error:', error)
    error.value = 'Ocurrió un error al enviar el formulario'
    elements.value = []
  }
}
</script>

<template>
  <section>
    <VCard class="mt-3">
      <div class="form-container">
        <h1 class="mb-3">Formulario Remap</h1>
        <VForm @submit.prevent="submitForm">
          <VRow>
            <VCol cols="12">
              <div class="form-group">
                <VTextField label="Url" id="url" v-model="formData.url" required />
              </div>
            </VCol>
  
            <VCol cols="6">
              <div class="form-group">
                <VTextField label="Key" id="key" v-model="formData.key" required />
              </div>
  
            </VCol>
            <VCol cols="6">
              <div class="form-group">
                <VTextField label="Eliminar Atributos (separados por coma)" id="elimAttr" v-model="elimAttrInput" />
              </div>
  
            </VCol>
  
            <VCol cols="6">
              <div class="form-group">
                <VTextField label="Reemplazar Atributos (buscar, reemplazar)" id="reemplazarAttr"
                  v-model="reemplazarAttrInput" />
              </div>
            </VCol>
  
            <VCol cols="6">
              <div class="form-group">
                <VTextField label="Eliminar Elementos HTML" id="elimElementos" v-model="elimElementosInput" />
              </div>
  
            </VCol>
          </VRow>
  
          <VBtn type="submit">
            Enviar
          </VBtn>
        </VForm>
        <br>
  
  
  
      </div>
    </VCard>
  
    <VCard v-if="elements.length > 0" class="mt-3">
      <VCardText class=" flex-wrap justify-space-between gap-4">
  
        <div class="">
          <h2>Respuesta:</h2>
          <div v-for="(element, index) in elements" :key="index" :class="`element _it-${index}`">
            <div v-html="element"></div>
          </div>
        </div>
  
      </VCardText>
    </VCard>
    <div v-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>


  </section>  


</template>



<style scoped>
.form-container {
  /* max-width: 600px;
  margin: 0 auto; */
  padding: 1em;
  /* background: #f9f9f9; */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input {
  width: calc(100% - 10px);
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 0.5em 1em;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.response-container {
  margin-top: 2em;
  padding: 1em;
  border-radius: 10px;
}

.element {
  border-bottom: solid 3px #e9ecef;
}

pre {
  overflow-x: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
