<script setup>
// reactive state
const snacks = inject('snacks')
const route = useRoute()

const {data} = await useFetch(`/api/accessions/${route.params.id}`)

useHead({
  title: computed(() => `PDB ${data.value?.ID} ${data.value?.variety}` || 'Accession')
})

</script>

<template>
  <v-container>
    <v-card class="pa-2 my-4">
      <v-row>
        <v-col cols="12">
          <h1>PDB {{ data.ID }}</h1>
          <h3>variety: {{ data.variety }}</h3>
          <h4>{{ data.pollination }}</h4>
          <h4>user: {{ data.user }}</h4>
          <h4>xchange: {{ data.region }} {{ data.exchange }}</h4>
          <h4># packets: {{ data.quantity }}</h4>
          <h4>date: {{ new Date(data.sent).toLocaleString() }}</h4>
        </v-col>
        <v-col cols="12">
          {{ data.description }}
        </v-col>
        <v-col cols="12">
          <NuxtLink :to="i" class="d-inline-flex ma-2" v-for="i in data.images">
            <v-img :src="i" width="300"></v-img>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
