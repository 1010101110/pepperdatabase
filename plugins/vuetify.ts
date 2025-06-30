import { defineNuxtPlugin } from "nuxt/app"
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    ssr: true,
    theme: {
      defaultTheme: 'pdbdark',
      themes:{
        pdblight:{
          dark:false,
          colors:{
            primary: '#3f51b5',
            secondary: '#3f8cb5'
          }
        },
        pdbdark:{
          dark:true,
          colors:{
            primary: '#3f51b5',
            secondary: '#3f8cb5'
          }
        }
      }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})