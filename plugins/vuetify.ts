import { defineNuxtPlugin } from "nuxt/app";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: "pdbdark",
      themes: {
        pdblight: {
          dark: false,
          colors: {
            primary: "#3f51b5",
            secondary: "#3f8cb5",
          },
        },
        pdbdark: {
          dark: true,
          colors: {
            primary: "#3f51b5",
            secondary: "#3f8cb5",
          },
        },
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
