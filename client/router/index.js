import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from 'vue-router';

import Splash from '../views/Splash.vue';
// import VarietiesList from '../views/VarietiesList.vue';
// import VarietyDetail from '../views/VarietyDetail.vue';
// import SpeciesList from '../views/SpeciesList.vue';
// import SpeciesDetail from '../views/SpeciesDetail.vue';
// import UserLogin from '../views/UserLogin.vue';
// import UserProfile from '../views/UserProfile.vue';

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      { path: '/', component: Splash },
    //   { path: '/varieties', component: VarietiesList },
    //   { path: '/varieties/:id', component: VarietyDetail },
    //   { path: '/species', component: SpeciesList },
    //   { path: '/species/:id', component: SpeciesDetail },
    //   { path: '/login', component: UserLogin },
    //   { path: '/user', component: UserProfile }
    ]
  });
}
