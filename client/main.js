import { createSSRApp } from 'vue';
import App from './App.vue';
import { createRouter } from './router';

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export function createApp() {
  const app = createSSRApp(App);
  const router = createRouter();
  const vuetify = createVuetify({ components, directives });

  app.use(router);
  app.use(vuetify);

  return { app, router };
}
