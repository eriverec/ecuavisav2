<template>
  <div>

    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle>
            <h4 class="text-h5 mb-0">Analizador de Sitios Web</h4>
          </VCardTitle>

          <VCardText>
            <!-- Formulario de entrada -->
            <VForm @submit.prevent="analizarSitio" class="mb-4">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex gap-2">
                    <VTextField
                      v-model="url"
                      placeholder="Ingrese la URL del sitio a analizar (ej: https://www.eluniverso.com)"
                      :rules="urlRules"
                      :error-messages="errorMessage"
                      hide-details="auto"
                    />
                    <VBtn
                      type="submit"
                      :loading="loading"
                      :disabled="loading"
                      color="primary"
                    >
                      {{ loading ? 'Analizando...' : 'ANALIZAR' }}
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VForm>

            <!-- Alerta de error -->
            <VAlert
              v-if="error"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
              @click:close="error = null"
            >
              {{ error }}
            </VAlert>

            <!-- Resultados -->
            <div v-if="resultados && !error">
              <div class="d-flex flex-column mb-4">
                <div class="text-body-1 text-medium-emphasis mb-1">
                  Medio analizado: {{ resultados.source || url }}
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div class="text-body-1 text-medium-emphasis">Resultados del análisis</div>
                  <div class="text-primary">{{ resultados.total }} artículos</div>
                </div>
              </div>

              <!-- Lista de artículos -->
              <div class="article-list">
                <div 
                  v-for="(articulo, index) in resultados.articles" 
                  :key="index"
                  class="article-item"
                >
                  <div class="d-flex align-items-center gap-3 py-2 border-b">
                    <!-- Imagen o icono -->
                    <div class="article-image">
                      <VImg
                        v-if="articulo.image"
                        :src="articulo.image"
                        :alt="articulo.title"
                        width="50"
                        height="50"
                        cover
                        class="rounded"
                      />
                      <VIcon
                        v-else
                        icon="tabler-file-text"
                        size="32"
                        class="text-medium-emphasis"
                      />
                    </div>

                    <!-- Contenido del artículo -->
                    <div class="article-content flex-grow-1 min-w-0">
                      <div class="d-flex align-items-center gap-2 mb-1">
                        <VChip
                          v-if="articulo.category"
                          color="info"
                          size="x-small"
                          class="text-uppercase"
                        >
                          {{ articulo.category }}
                        </VChip>
                        <span class="text-caption text-medium-emphasis">
                          {{ articulo.timestamp || '' }}
                        </span>
                      </div>

                      <h6 class="text-subtitle-2 mb-1 text-truncate">{{ articulo.title }}</h6>
                      
                      <p v-if="articulo.summary" class="text-caption text-medium-emphasis mb-0 d-none d-sm-block text-truncate">
                        {{ articulo.summary }}
                      </p>
                    </div>

                    <!-- Botón Ver Artículo -->
                    <div class="article-action">
                      <VBtn
                        v-if="articulo.link"
                        :href="articulo.link"
                        target="_blank"
                        variant="text"
                        size="small"
                        color="primary"
                        class="d-none d-sm-flex"
                      >
                        <VIcon start icon="tabler-external-link" size="16" />
                        VER ARTÍCULO
                      </VBtn>
                      <VBtn
                        v-if="articulo.link"
                        :href="articulo.link"
                        target="_blank"
                        variant="text"
                        size="small"
                        color="primary"
                        icon
                        class="d-sm-none"
                      >
                        <VIcon icon="tabler-external-link" size="16" />
                      </VBtn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const url = ref('')
const loading = ref(false)
const error = ref(null)
const resultados = ref(null)
const errorMessage = ref('')

const urlRules = [
  v => !!v || 'La URL es requerida',
  v => /^(http|https):\/\/[^ "]+$/.test(v) || 'Ingrese una URL válida'
]

const analizarSitio = async () => {
  if (!urlRules.every(rule => rule(url.value) === true)) {
    error.value = 'Por favor ingrese una URL válida'
    return
  }

  loading.value = true
  error.value = null
  errorMessage.value = ''
  resultados.value = null

  try {
    const response = await axios.post('http://localhost:8080/analizar-sitio', {
      url: url.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    resultados.value = response.data
  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message || 
                 'Error al analizar el sitio. Por favor intente nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  .article-item {
    .article-image {
      min-width: 50px;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .article-content {
      min-width: 0; 
    }

    .article-action {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
  }
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 600px) {
  .article-list {
    .article-item {
      .article-image {
        min-width: 40px;
        width: 40px;
      }
    }
  }
}
</style>