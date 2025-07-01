<script setup>
// reactive state
const snacks = inject('snacks')

const regions = ref(['US','EU'])
const selRegion = ref(null)
const selXchange = ref(null)
const {data: xchanges} = await useFetch('/api/xchange')
let accessions = ref([])

async function getAccessions(){
  if(!selRegion.value){
    snacks.value.push('select a region')
    return
  }
  if(!selXchange.value){
    snacks.value.push('select a xchange')
    return
  }

  accessions.value = await $fetch('/api/xaccession/list',{
    method:'post',
    body:{
        region: selRegion.value,
        exchange: selXchange.value,
    }
  })
}

useHead({
  title: 'PDB Xchange Browser'
})
</script>

<template>
  <v-container>
    <div class="mb-3">
        <v-select :items="regions" v-model="selRegion" label="region" density="compact"></v-select>
        <v-select :items="xchanges" item-title="exchange" item-value="exchange" v-model="selXchange" label="exchange" density="compact"></v-select>
        <v-btn @click="getAccessions">get accessions</v-btn>
    </div>
    <v-card v-for="a in accessions" class="pa-2 mb-3">
        <v-lazy>
            <v-row>
                <v-col cols="12">
                    PDB {{ a.ID }} {{ a.variety }} <v-btn :to="`/accessions/${a.ID}`">Details</v-btn>
                </v-col>
                <v-col v-for="img in a.images" cols="4" lg="2" class="pa-2">
                    <div style="position:relative;">
                        <NuxtLink :to="img">
                            <v-img :src="img" :to="img"></v-img>
                        </NuxtLink>
                    </div>
                </v-col>
            </v-row>
        </v-lazy>
    </v-card>
  </v-container>
</template>
