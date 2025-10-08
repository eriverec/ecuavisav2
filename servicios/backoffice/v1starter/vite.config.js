import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath } from 'url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.BASE_URL || '/',
    plugins: [
      vue(),
      vueJsx(),
      vuetify({
        styles: { configFile: 'src/styles/variables/_vuetify.scss' },
      }),
      Pages({ dirs: ['src/views'] }),
      Layouts(),
      Components({
        dirs: ['src/@core/components', 'src/views/demos'],
        dts: 'src/components.d.ts',
        include: [/\.vue$/, /\.vue\?vue/],
      }),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
        vueTemplate: true,
      }),
      DefineOptions(),
    ],

    define: { 'process.env': {} },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@themeConfig': fileURLToPath(new URL('./themeConfig.js', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./src/styles/variables/_template.scss', import.meta.url)),
        '@axios': fileURLToPath(new URL('./src/plugins/axios', import.meta.url)),
        '@validators': fileURLToPath(new URL('./src/@core/utils/validators', import.meta.url)),
        'apexcharts': fileURLToPath(new URL('node_modules/apexcharts-clevision', import.meta.url)),
      },
    },

    build: {
      minify: 'esbuild',
      sourcemap: false,
      chunkSizeWarningLimit: 15000,
    },

    optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue'],
    },
  }
})
