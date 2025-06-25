<script setup>
// reactive state
const snacks = inject('snacks')

const {data} = await useFetch('/api/varieties')

useHead({
  title: 'Pepper Varieties'
})
</script>

<template>
  <v-container>
        <v-row>
          <v-col><p>want to search? do that on the <NuxtLink to="/">homepage</NuxtLink> </p></v-col>
          <v-col cols="12" v-for="s in data" :key="s.ID">
            <v-lazy>
              <v-card class="pa-2 mb-2">
              <div class="d-inline-flex mx-2">
                <NuxtLink :to="`/varieties/${s.name}`">
                  <v-img
                    :width="100"
                    cover
                    :src="`https://pepperdatabase.org/images/variety/${s.ID}/${s.ID}.jpg`"
                  ></v-img>
                </NuxtLink>
              </div>
              <div class="d-inline-flex mx-2">
                <span>{{ s.name }}</span>
              </div>
              <div class="d-inline-flex mx-2">
                <span>{{ s.speciesname }}</span>
              </div>
              <div class="d-inline-flex mx-2">
                <v-btn :href="`/varieties/${s.name}`">details</v-btn>
              </div>
              </v-card>
            </v-lazy>
          </v-col>
        </v-row>

  </v-container>
</template>
