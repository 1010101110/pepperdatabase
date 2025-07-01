<script setup>
// reactive state
const snacks = inject('snacks')
const route = useRoute()
const { user } = useAuth()
const editable = ref(false)
const heats = ["Sweet (0 shu)","Mild (100-5k shu)","Medium (5k-100k shu)","Hot (100k-500k shu)","SuperHot (500k+ shu)"]

if(user.value){
  editable.value = true;
}

const {data:varieties} = await useFetch(`/api/varieties/${route.params.id}`)
const {data:species} = await useFetch('/api/species')

useHead({
  title: computed(() => varieties.value?.name || 'Varieties')
})

async function updateRecord(){
  try{
    const data = await $fetch(`/api/varieties`,{method:'PUT',body: varieties.value});
    if(data.success){
        snacks.value.push('udpated varieties')
    }else{
        throw 'error updating varieties'
    }
  }
  catch(err){
    console.log(err)
    snacks.value.push({text:err.toString(),color:'error'})
  }
}
</script>

<template>
  <v-container>
    <v-card class="pa-2 my-4">
    <v-row v-if="varieties">
      <v-col>
        <v-text-field
          :readonly="!editable"
          v-model="varieties.name"
          label="name"
        ></v-text-field>
        <v-select
          v-model="varieties.species"
          :readonly="!editable"
          label="species"
          :items="species"
          item-title="name"
          item-value="ID">
        </v-select>
        <v-select
          :readonly="!editable"
          v-model="varieties.heat"
          :items="heats"
          label="heat"
        ></v-select>
        <v-text-field
          :readonly="!editable"
          v-model="varieties.podsize"
          label="podsize"
        ></v-text-field>
        <v-text-field
          :readonly="!editable"
          v-model="varieties.podcolor"
          label="podcolor"
        ></v-text-field>
        <v-text-field
          :readonly="!editable"
          v-model="varieties.plantcolor"
          label="plantcolor"
        ></v-text-field>
        <v-text-field
          :readonly="!editable"
          v-model="varieties.maturity"
          label="maturity (days)"
        ></v-text-field>
        <v-text-field
          :readonly="!editable"
          v-model="varieties.origin"
          label="origin"
        ></v-text-field>
        <v-text-field
          :readonly="!editable"
          v-model="varieties.accession"
          label="Related Accession"
        ></v-text-field>
        <TipTapEditor v-model="varieties.description" :editable="editable" label="description"></TipTapEditor>
        <v-btn @click="updateRecord" color="secondary">Update</v-btn>
      </v-col>
    </v-row>
  </v-card>
  </v-container>
</template>
