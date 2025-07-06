<script setup>
// init
import debounce from "lodash.debounce";

// reactive state
const search = ref("");
const searchresults = ref({});
const snacks = inject("snacks");

useHead({
  title: "PepperDatabase",
});

// functions
const debounceSearch = debounce(apiSearch, 500);

async function apiSearch() {
  if (search.value && search.value.length > 2) {
    try {
      const encoded = btoa(search.value);
      const data = await $fetch("/api/search", { query: { s: encoded } });
      if (
        data.species.length ||
        data.varieties.length ||
        data.accessions.length
      ) {
        searchresults.value = data;
      } else {
        throw "no results";
      }
    } catch (error) {
      snacks.value.push("search: " + error);
      searchresults.value = [];
    }
  } else {
    searchresults.value = [];
  }
}

function accessionImage(a) {
  if (a && a.images) {
    var i = JSON.parse(a.images);
    if (i.length > 0) {
      return i[0];
    } else {
      return "";
    }
  } else {
    return "";
  }
}
</script>

<template>
  <v-container class="text-center">
    <v-row class="my-12" justify="center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">Welcome to PepperDatabase</h1>
        <p class="text-subtitle-1">
          Search and explore pepper species and varieties
        </p>
      </v-col>

      <v-col cols="12">
        <v-text-field
          label="Search peppers..."
          prepend-inner-icon="mdi-magnify"
          max-width="500"
          class="mx-auto"
          v-model="search"
          @input="debounceSearch"
        />
      </v-col>

      <v-col cols="6" sm="4" md="3" v-for="i in searchresults.species">
        <div class="d-inline-flex mx-2 w-100">
          <v-img
            cover
            aspect-ratio="1"
            :src="`https://pepperdatabase.org/images/species/${i.ID}.webp`"
          ></v-img>
        </div>
        <div class="d-inline-flex mx-2">
          <span>Species: {{ i.name }}</span>
        </div>
        <div class="d-flex mx-2">
          <v-btn :to="`/species/${i.name}`" class="mx-auto">details</v-btn>
        </div>
      </v-col>

      <v-col cols="6" sm="4" md="3" v-for="i in searchresults.varieties">
        <div class="d-inline-flex mx-2 w-100">
          <v-img
            cover
            aspect-ratio="1"
            :src="`https://pepperdatabase.org/images/variety/${i.ID}.webp`"
          ></v-img>
        </div>
        <div class="d-inline-flex mx-2">
          <span>Variety: {{ i.name }}</span>
        </div>
        <div class="d-flex mx-2">
          <v-btn :to="`/varieties/${i.name}`" class="mx-auto">details</v-btn>
        </div>
      </v-col>

      <v-col cols="6" sm="4" md="3" v-for="i in searchresults.accessions">
        <div class="d-inline-flex mx-2 w-100">
          <v-img
            cover
            aspect-ratio="1"
            :src="accessionImage(i)"
          ></v-img>
        </div>
        <div class="d-inline-flex mx-2">
          PDB# {{ i.ID }} <br>
          user: {{ i.user }} <br>
          {{ i.variety }}
        </div>
        <div class="d-flex">
          <v-btn :to="`/accessions/${i.ID}`" class="mx-auto">details</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
