<template>
  <v-app>
    <v-app-bar app flat color="primary" dark>
      <v-toolbar-title class="text-h6 font-weight-bold">PepperDatabase</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
// Nothing required here yet for basic layout
</script>

<style>
/* You can include global styles here or import from a file */
</style>