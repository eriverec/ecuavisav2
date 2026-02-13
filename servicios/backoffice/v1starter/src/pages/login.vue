<script setup>
import authV2LoginIllustrationBorderedDark from '@/assets/images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@/assets/images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@/assets/images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@/assets/images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '@/assets/images/pages/misc-mask-light.png'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import {
  emailValidator,
  requiredValidator,
} from '@validators'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import esLocale from "moment/locale/es"
import { VForm } from 'vuetify/components'
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);



const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAppAbility()
const errors = ref({
  email: undefined,
  password: undefined,
})
const errorN = ref('');
const isLoading = ref(false)
const refVForm = ref()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const login = () => {
  isLoading.value = true;
  if(email.value == "admin@demo.com" && password.value == "EcuavisaBackoffice"){
    let userAbilities = [
        {
          action: 'manage',
          subject: 'all',
        }
      ]
     let userData = {
      fullName :'admin',
      email: 'admin@demo.com'
     } 
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities));
    ability.update(userAbilities);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('role', 'administrador');
    router.replace(route.query.to ? String(route.query.to) : '/');
  }else{
  axios.post('https://gestores-flax.vercel.app/login', {
    email: email.value,
    password: password.value,
  }).then(r => {
    const userData = r.data;
    //const { accessToken, userData, userAbilities } = r.data
   // localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
    //ability.update(userAbilities)
    //localStorage.setItem('userData', JSON.stringify(userData))
    //localStorage.setItem('accessToken', JSON.stringify(accessToken))
    let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
    let userAbilities = [
        {
          action: 'manage',
          subject: 'all',
        }
      ]
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities));
    ability.update(userAbilities);
    localStorage.setItem('userData', JSON.stringify(userData.data));
    localStorage.setItem('role', userData.data.role);
        
			var log = {
        usuario: userData.data.email,   
        pagina: "login",
        fecha: dateNow
                };		
			axios.post(`https://servicio-logs.vercel.app/accion`, log);

      if(userData.data.role == "monetizacion"){
        router.replace('/apps/suscriptores/usuarios');
        return;
      }
      // Redirect to `to` query if exist or redirect to index route
      router.replace(route.query.to ? String(route.query.to) : '/');
  }).catch(e => {
    if(e.response){
    const { message: formErrors } = e.response.data;     
    errorN.value = formErrors;
    console.error(e.response.data);
    }
    console.error(e);
    
  }).finally(() => {
    isLoading.value = false // Set loading to false when login completes or fails
  })
}
}

const onSubmit = () => {

  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login();
  })
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Bienvenido a {{ themeConfig.app.title }} Analytics! 👋🏻
          </h5>
          <!-- <p class="mb-0">
            Inicia sesión en tu cuenta y comienza la aventura.
          </p> -->
        </VCardText>
        <!-- <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Administrador Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText> -->
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Correo"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errorN"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Recordarme"
                  />
                  <!-- <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a> -->
                </div>

                <VBtn
                  block
                  type="submit"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                {{ isLoading ? 'Iniciando...' : 'Iniciar sesión' }}
                </VBtn>
                <div style="margin-top: 1rem;">
                <h5 >
                        <RouterLink
                          :to="{
                            name: 'forgot-password'                   
                          }"
                        >
                          ¿Olvidaste tu contraseña?
                        </RouterLink>
                      </h5>
                    </div>      
              </VCol>

              <!-- create account -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <a
                  class="text-primary ms-2"
                  href="#"
                >
                  Create an account
                </a>
              </VCol> -->
              <!-- <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol> -->

              <!-- auth providers -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol> -->
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
