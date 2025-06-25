<script setup>
// reactive state
const snacks = inject('snacks')
const route = useRoute()

const {data:species} = await useFetch(`/api/species/${route.params.id}`)
const varieties = ref([])
if(species.value){
  const {data:vdata} = await useFetch(`/api/varieties/species/${species.value?.ID}`)
  varieties.value = vdata
}

useHead({
  title: computed(() => species.value?.name || 'Species')
})

</script>

<template>
  <v-container>
    <v-card class="pa-2 my-4">
        {{ species }}
    </v-card>
    <h2>Varieties</h2>
    <v-lazy v-for="v in varieties.value">
      <v-card class="pa-2 my-2">
        <div class="d-inline-flex mx-2">
          <NuxtLink :to="`/varieties/${v.name}`">
            <v-img
              :width="100"
              cover
              :src="`https://pepperdatabase.org/images/variety/${v.ID}/${v.ID}.jpg`"
            ></v-img>
          </NuxtLink>
        </div>
        <div class="d-inline-flex mx-2">
          <span>{{ v.name }}</span>
        </div>
        <div class="d-inline-flex mx-2">
          <v-btn :href="`/varieties/${v.name}`">details</v-btn>
        </div>

      </v-card>
      </v-lazy>
  </v-container>
</template>
