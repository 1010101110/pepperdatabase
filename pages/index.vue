<script setup>
// init
import debounce from 'lodash.debounce';

// reactive state
const search = ref('');
const searchresults = ref({});
const snacks = inject('snacks')

useHead({
  title: 'PepperDatabase'
})


// functions
const debounceSearch = debounce(apiSearch,300);

async function apiSearch(){
  if(search.value && search.value.length > 1){
    try {
      const encoded = btoa(search.value)
      const data = await $fetch('/api/search', { query: { s : encoded}})
      if(data.species.length || data.varieties.length || data.accessions.length){
        searchresults.value = data
      }else{
        throw 'no results'
      }
    } catch (error) {
      snacks.value.push('search: ' + error)
      searchresults.value = []
    }
  }else{
    searchresults.value = []
  }
}

function accessionImage(a){
  if(a && a.images){
    var i = JSON.parse(a.images)
    if(i.length > 0){
      return i[0]
    }else{
      return ''
    }
  }else{
    return ''
  }
}
</script>

<template>
  <v-container class="text-center">
    <v-row class="my-12" justify="center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold">Welcome to PepperDatabase</h1>
        <p class="text-subtitle-1">Search and explore pepper species and varieties</p>
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field label="Search peppers..." prepend-inner-icon="mdi-magnify" v-model="search" @input="debounceSearch" />
      </v-col>

      <v-col cols="12" v-for="i in searchresults.species">
        <div class="d-inline-flex mx-2">
          <v-img
            :width="100"
            cover
            :src="`https://pepperdatabase.org/images/species/${i.ID}.jpg`"
          ></v-img>
        </div>
        <div class="d-inline-flex mx-2">
          <span>{{ i.name }}</span>
        </div>
        <div class="d-inline-flex mx-2">
          <v-btn :to="`/species/${i.name}`">details</v-btn>
        </div>
      </v-col>

      <v-col cols="12" v-for="i in searchresults.varieties">
        <div class="d-inline-flex mx-2">
          <v-img
            :width="100"
            cover
            :src="`https://pepperdatabase.org/images/variety/${i.ID}/${i.ID}.jpg`"
          ></v-img>
        </div>
        <div class="d-inline-flex mx-2">
          <span>{{ i.name }}</span>
        </div>
        <div class="d-inline-flex mx-2">
          <v-btn :to="`/varieties/${i.name}`">details</v-btn>
        </div>
      </v-col>

      <v-col cols="12" v-for="i in searchresults.accessions">
        <div class="d-inline-flex mx-2">
          <v-img
            :width="100"
            cover
            :src="accessionImage(i)"
          ></v-img>
        </div>
        <div class="d-inline-flex mx-2">
          <span>PDB {{ i.ID }} {{ i.variety }}</span>
        </div>
        <div class="d-inline-flex mx-2">
          <v-btn :to="`/accessions/${i.ID}`">details</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
