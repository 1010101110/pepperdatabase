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
          <v-btn :href="`/species/${name_to_url(i.name)}`">details</v-btn>
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
          <v-btn :href="`/variety/${name_to_url(i.name)}`">details</v-btn>
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
          <v-btn :href="`/accession/${i.ID}`">details</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// init
import { ref, inject } from 'vue';
import debounce from 'lodash.debounce';

// reactive state
const search = ref('');
const searchresults = ref({});
const snacks = inject('snacks')

// functions
const debounceSearch = debounce(apiSearch,500);

async function apiSearch(){
  if(search.value && search.value.length > 1){
    try {
      const encoded = btoa(search.value)
      const resp = await fetch('/api/search/' + encoded)
      console.log(resp)
      if(resp.ok){
        const results = await resp.json()
        console.log(results)
        searchresults.value = results
      }else{
        throw 'bad search call'
      }
    } catch (error) {
      snacks.value.push('search error: ' + error)
      searchresults.value = []
    }
  }else{
    searchresults.value = []
  }
}

function name_to_url(name){
  return name.replace(/ /g,"-").toLowerCase()
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