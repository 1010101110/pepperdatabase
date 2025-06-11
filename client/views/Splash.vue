<template>
  <v-container class="text-center">
    <v-row class="my-12" justify="center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">Welcome to PepperDatabase</h1>
        <p class="text-subtitle-1">Search and explore pepper species and varieties</p>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field label="Search peppers..." prepend-inner-icon="mdi-magnify" v-model="search" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
const search = ref('');
</script>