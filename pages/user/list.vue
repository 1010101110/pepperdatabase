<script setup>
// reactive state
const snacks = inject('snacks')

const {data} = await useFetch('/api/user/list')

useHead({
  title: 'PDB Users'
})
</script>

<template>
  <v-container>
        <v-row>
          <v-col cols="12" v-for="u in data" :key="u.id">
            <v-card class="pa-2 mb-2">
              <div class="d-inline-flex mx-2">
                  <v-img
                    :width="100"
                    cover
                    :src="u.avatar"
                  ></v-img>
              </div>
              <div class="d-inline-flex mx-2">
                <span>{{ u.name }}</span>
              </div>
              <!-- <div class="d-inline-flex mx-2">
                <v-btn :href="`/user/${u.id}`">details</v-btn>
              </div> -->
              <div class="d-clear"></div>
              <div class="d-inline-flex mx-2">
                <span>{{ u.bio }}</span>
              </div>
            </v-card>
          </v-col>
        </v-row>

  </v-container>
</template>
