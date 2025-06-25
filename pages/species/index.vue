<script setup>
// reactive state
const snacks = inject('snacks')

const {data} = await useFetch('/api/species')

useHead({
  title: 'Pepper Species'
})
</script>

<template>
  <v-container>
        <v-row>
          <v-col cols="12" v-for="s in data" :key="s.ID">
            <v-card class="pa-2 mb-2">
              <div class="d-inline-flex mx-2">
                <NuxtLink :to="`/species/${s.name}`">
                  <v-img
                    :width="100"
                    cover
                    :src="`https://pepperdatabase.org/images/species/${s.ID}.jpg`"
                  ></v-img>
                </NuxtLink>
              </div>
              <div class="d-inline-flex mx-2">
                <span>{{ s.name }}</span>
              </div>
              <div class="d-inline-flex mx-2">
                <v-btn :href="`/species/${s.name}`">details</v-btn>
              </div>
              <div class="d-clear"></div>
              <div class="d-inline-flex mx-2">
                <span>{{ s.attribute }}</span>
              </div>
            </v-card>
          </v-col>
        </v-row>

  </v-container>
</template>
