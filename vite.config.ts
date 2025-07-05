import {fileURLToPath, URL} from 'node:url';

import {defineConfig, loadEnv} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import {VitePWA} from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix
  const env = loadEnv(mode, process.cwd(), '');
  return  {
    base: env.VITE_URL_PREFIX,
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'bwLehrpool',
          short_name: 'bwLP',
          description: 'The BWLP website but installed on your machine!',
          theme_color: '#a599e9',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        registerSW: {
          immediate: false,
        },
      }),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __URL_PREFIX__: JSON.stringify(env.VITE_URL_PREFIX)
    }
  }
});
