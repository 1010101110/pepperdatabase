import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  build: {
    ssrManifest: true,
    rollupOptions: {
      input: './client/index.html'
    },
  },
  ssr: {
    noExternal: [
      'vue',
      'vuetify'
    ]
  },
  optimizeDeps: {
    include: [
      'vue',
      'vuetify',
    ],
  },
});
