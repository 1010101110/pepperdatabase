// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  pages: true,
  ssr: true,

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  app:{
    head:{
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.ico' }],
      viewport:'width=device-width, initial-scale=1, maximum-scale=1',
      charset: 'utf-8',
      meta: [{ name: 'description', content: 'A community maintained pepper resource. Find information pepper varieties and species. Join the community and upload your pictures, reviews, and grows.' }],
    }
  },

  modules: ['nuxt-nodemailer'],

  nodemailer: {
    from: '"Pepper" <pepper@pepperdatabase.org>',
    host: 'localhost',
    port: 25,
    secure: false,
  },
})