// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  pages: true,
  ssr: true,

  routeRules: {
    "/xchange/accession/**": { redirect: "/accessions/**" },
    "/variety/show/**": { redirect: "/varieties/**" },
    "/species/show/**": { redirect: "/species/**" },
  },

  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  devtools: { enabled: true },

  build: {
    transpile: ["vuetify"],
  },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.ico" }],
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      charset: "utf-8",
      meta: [
        {
          name: "description",
          content:
            "A community maintained pepper resource. Find information pepper varieties and species. Join the community and upload your pictures, reviews, and grows.",
        },
      ],
    },
  },

  modules: [
    "nuxt-tiptap-editor",
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(
          vuetify({
            autoImport: true,
          })
        )
      })
    },
  ],

  tiptap: {
    prefix: "Tiptap",
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ['vuetify'], // Ensures Vuetify works correctly with SSR
    },
  },
});
