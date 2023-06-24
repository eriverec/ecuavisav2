<script setup>
import authV2ResetPasswordIllustrationDark from '@/assets/images/pages/auth-v2-reset-password-illustration-dark.png'
import authV2ResetPasswordIllustrationLight from '@/assets/images/pages/auth-v2-reset-password-illustration-light.png'
import authV2MaskDark from '@/assets/images/pages/misc-mask-dark.png'
import authV2MaskLight from '@/assets/images/pages/misc-mask-light.png'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import {
requiredValidator
} from '@validators'

const form = ref({
  newPassword: '',
  confirmPassword: '',
})

const authThemeImg = useGenerateImageVariant(authV2ResetPasswordIllustrationLight, authV2ResetPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const refVForm = ref();
const mensaje = ref('');
const isSuccess = ref(false);
const errorResponse = ref(false);

async function sendPassword (){
  if(form.value.newPassword == form.value.confirmPassword){ 

  const raw = JSON.stringify({"email":email.value});

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
    mensaje.value = "Las contraseñas deben coincidir";
  }   

};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
  if (isValid)
     sendPassword();
})
};

</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="400"
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
        width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 font-weight-semibold mb-1">
            Restablecer contraseña 🔒
          </h5>
          <!--
          <p class="mb-0">
            for <span class="font-weight-bold">john.doe@email.com</span>
          </p>
          -->
        </VCardText>

        <VCardText>
          <VForm 
          ref="refVForm"
          @submit.prevent="onSubmit">
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.newPassword"
                  label="Nueva contraseña"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Confirm Password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.confirmPassword"
                  label="Confirmar contraseña"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- Set password -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                >
                 Enviar
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
                  <span>Back to login</span>
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
