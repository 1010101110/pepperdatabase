<template>
  <v-app :theme="theme">
    <v-navigation-drawer v-model="drawer" fixed clipped app>
        <v-list dense>
            <v-list-item v-for="item in menu" :key="item.text" :to="item.href">
              <v-list-item-title>
                  {{item.text}}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-btn variant="outlined" class="mt-1 ml-2" label="change theme" @click="toggleTheme" color="indigo">change theme</v-btn>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat color="indigo" dark dense fixed clipped-left>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <router-link to="/" class="text-white text-decoration-none">
        <v-toolbar-title class="cursor-pointer">PepperDatabase</v-toolbar-title>
      </router-link>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar-queue v-model="snacks"></v-snackbar-queue>
  </v-app>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { RouterLink } from 'vue-router';

const drawer = ref(false)
const menu = [
  {text:"Species",href:"/species"},
  {text:"Varieties",href:"/varieties"},
  {text:"Users",href:"/users"},
  {text:"Activity",href:"/history"},
  {text:"Exchange",href:"/xchange"},
]

const theme = ref('dark');
function toggleTheme(){
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('vtheme',theme.value)
}

const snacks = ref([])
provide('snacks',snacks)

onMounted(()=>{
  const vtheme = localStorage.getItem('vtheme')
  if (vtheme) {
    theme.value = vtheme
  }
})

</script>

<style>
/* You can include global styles here or import from a file */
</style>