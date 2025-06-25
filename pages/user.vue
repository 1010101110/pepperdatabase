<script setup>
// reactive state
const snacks = inject('snacks')
const route = useRoute()

//check if they are logged in
// show profile, preferences, xregs, history

//if not logged in
// show registraion form

useHead({
  title: computed(() => 'User')
})

</script>

<template>
  <v-container>
    users coming soon :)
  </v-container>
</template>
