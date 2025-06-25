<script setup>
// reactive state
const snacks = inject('snacks')
const route = useRoute()

const {data:varieties} = await useFetch(`/api/varieties/${route.params.id}`)
// const varieties = ref([])
// if(species.value){
//   const {data:vdata} = await useFetch(`/api/varieties/species/${species.value?.ID}`)
//   varieties.value = vdata
// }

useHead({
  title: computed(() => varieties.value?.name || 'Varieties')
})

</script>

<template>
  <v-container>
    <v-card class="pa-2 my-4">
        {{ varieties }}
    </v-card>
    <!-- <h2>Varieties</h2>
    <v-card class="pa-2 my-2" v-for="v in varieties.value">
      {{ v }}
    </v-card> -->
  </v-container>
</template>
