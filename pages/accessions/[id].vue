<script setup>
// reactive state
const snacks = inject("snacks");
const route = useRoute();

const { data: accession } = await useFetch(
  `/api/xaccession/${route.params.id}`,
);
const coverimg = accession.value?.images ? accession.value.images[0] : "na";

useHead({
  title: computed(
    () =>
      `PDB ${accession.value?.ID} ${accession.value?.variety}` || "Accession",
  ),
  meta: [
    {
      property: "og:title",
      content: `PDB ${accession.value?.ID} ${accession.value?.variety}`,
    },
    {
      property: "og:description",
      content: `Check out this pepper accession from the pdb xchange! ${accession.value?.ID} ${accession.value?.variety}`,
    },
    {
      property: "og:image",
      content: coverimg,
    },
    {
      property: "og:url",
      content: `https://pepperdatabase.org/accessions/${accession.value?.ID}`,
    },
  ],
});
</script>

<template>
  <v-container>
    <v-card class="pa-2 my-4">
      <v-row>
        <v-col cols="12">
          <h1>PDB {{ accession.ID }}</h1>
          <h3>variety: {{ accession.variety }}</h3>
          <h4>{{ accession.pollination }}</h4>
          <h4>user: {{ accession.user }}</h4>
          <h4>xchange: {{ accession.region }} {{ accession.exchange }}</h4>
          <h4># packets: {{ accession.quantity }}</h4>
          <h4>date: {{ new Date(accession.sent).toLocaleString() }}</h4>
        </v-col>
        <v-col cols="12">
          {{ accession.description }}
        </v-col>
        <v-col cols="12">
          <a
            :href="i"
            class="d-inline-flex ma-2"
            v-for="i in accession.images"
          >
            <v-img :src="i" width="300"></v-img>
          </a>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
