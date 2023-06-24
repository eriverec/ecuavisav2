<script setup>
import authV2ForgotPasswordIllustrationDark from '@/assets/images/pages/auth-v2-forgot-password-illustration-dark.png';
import authV2ForgotPasswordIllustrationLight from '@/assets/images/pages/auth-v2-forgot-password-illustration-light.png';
import authV2MaskDark from '@/assets/images/pages/misc-mask-dark.png';
import authV2MaskLight from '@/assets/images/pages/misc-mask-light.png';
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import {
emailValidator,
requiredValidator,
} from '@validators';
import { VForm } from 'vuetify/components';

const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const mensaje = ref('');
const isSuccess = ref(false);
const errorResponse = ref(false);
const refVForm = ref();
const email = ref('');


async function sendResetLink (){
  if(email.value){
  const raw = JSON.stringify({"email":email.value});
  //console.log('email',email.value);
  //isSuccess.value = true;
  //mensajeSuccess.value = "Siga las instrucciones enviadas a su email";
  
  await fetch('https://gestores-flax.vercel.app/forgotPassword' ,
          {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: raw
          })
        .then(response => response.json())
        .then(resp =>{          
            if(resp.mensaje == "Siga las instrucciones enviadas a su email"){ 
                mensaje.value = resp.mensaje;                  
                isSuccess.value = true;
                return true;
            }else if(resp.error == "El email no existe"){
                errorResponse.value = true;
                mensaje.value = resp.error;
                return false;
            }                    
        })
        .catch(error => {console.log(error) }); 
  }else{
    errorResponse.value = true;
    mensaje.value = "Debe ingresar un email";
  }   

};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
  if (isValid)
    sendResetLink();
})
};

</script>

<template>
  <VRow
    class="auth-wrapper"
    no-gutters
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="368"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          class="auth-footer-mask"
          :src="authThemeMask"
        />
      </div>
    </VCol>
    <VSnackbar
      v-model="isSuccess"
      color="primary"
      transition="scale-transition"
      location="top center"
    >
      <h3>{{ mensaje }}</h3>
    </VSnackbar>
    <VSnackbar
      v-model="errorResponse"
      color="error"
      transition="scale-transition"
      location="top center"
    >
      <h3>{{ mensaje }}</h3>
    </VSnackbar>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
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
            ¿Olvidó su contraseña? 🔒
          </h5>
          <p class="mb-0">
            Introduzca su email y le enviaremos instrucciones para restablecer su contraseña
          </p>
        </VCardText>

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
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                 
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                  Enviar enlace de restablecimiento
                </VBtn>
              </VCol>

              <!-- back to login -->
               <!--  
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'pages-authentication-login-v2' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    class="flip-in-rtl"
                  />
                  <span>Volver al login</span>
                </RouterLink>
              </VCol>
              -->
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
</route>
