<script setup>
// reactive state
const snacks = inject("snacks");
const route = useRoute();

// get user public profile

useHead({
  title: computed(() => "User"),
});
</script>

<template>
  <v-container> users coming soon :) </v-container>
</template>
