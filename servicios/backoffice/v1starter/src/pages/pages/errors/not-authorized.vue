<script setup>
import pages401 from '@/assets/images/pages/401.png';
import miscMaskDark from '@/assets/images/pages/misc-mask-dark.png';
import miscMaskLight from '@/assets/images/pages/misc-mask-light.png';
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
    <VCard>
  <div class="misc-wrapper">
    <ErrorHeader
      error-title="Error 401: No Autorizado"
      error-description="No tiene permiso para ver esta página utilizando las credenciales que ha proporcionado al iniciar sesión.
Póngase en contacto con el administrador de su sitio."
    />
    <VBtn
      to="/"
      class="mb-12"
    >
    Volver al inicio
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="pages401"
        alt="Coming Soon"
        :max-width="170"
        class="mx-auto"
      />
    </div>

    <VImg
      :src="authThemeMask"
      class="misc-footer-img d-none d-md-block"
    />
  </div>
</VCard>
</template>

<style lang="scss">

  .misc-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    min-block-size: calc(var(--vh, 1vh) * 100);
  }

  .misc-avatar {
    z-index: 1;
  }

  .misc-footer-img {
    position: absolute;
    inline-size: 100%;
    inset-block-end: 0;
  }

</style>

<route lang="yaml">
meta:
  layout: blank
</route>
