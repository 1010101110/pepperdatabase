<script setup>
// reactive state
const snacks = inject('snacks')
const route = useRoute()
const { user } = useAuth()
const editable = ref(false)

if(user.value){
  editable.value = true;
}

const {data:species} = await useFetch(`/api/species/${route.params.id}`)
console.log(species)
const varieties = ref([])
if(species.value){
  const {data:vdata} = await useFetch(`/api/varieties/species/${species.value?.ID}`)
  varieties.value = vdata
}

useHead({
  title: computed(() => species.value?.name || 'Species')
})

async function updateRecord(){
  try{
    const data = await $fetch(`/api/species`,{method:'PUT',body: species.value});
    if(data.success){
        snacks.value.push('udpated species')
    }else{
        throw 'error updating species'
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
      <v-row v-if="species">
        <v-col>
          <v-text-field
            :readonly="!editable"
            v-model="species.name"
            label="name"
          ></v-text-field>
          <v-text-field
            :readonly="!editable"
            v-model="species.attribute"
            label="identifying attribute"
          ></v-text-field>
          <TipTapEditor v-model="species.description" :editable="editable" label="description"></TipTapEditor>
          <v-btn v-if="editable" @click="updateRecord" color="secondary">Update</v-btn>
        </v-col>
      </v-row>
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
