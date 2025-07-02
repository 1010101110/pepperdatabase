<script setup>
// reactive state
const snacks = inject("snacks");

const { data: history } = await useFetch("/api/history");

useHead({
  title: "PDB Activity",
});

function formatDate(d) {
  return new Date(d).toLocaleString();
}
</script>

<template>
  <v-container>
    <v-card v-for="h in history" class="ma-2 pa-2">
      {{ formatDate(h.action_on) }} {{ h.name ? h.name : h.user_name }}
      {{ h.action }}
    </v-card>
  </v-container>
</template>
