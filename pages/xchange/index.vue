<script setup>
import { useFetch } from 'nuxt/app'

// global snackbar
const snacks = inject('snacks')

//gobal user object
const { user } = useAuth()
const router = useRouter()

//registration
const regions = ref(['US','EU'])
const selRegion = ref(null)
const {data: xchangeActive} = await useFetch('/api/xregistration/active')

const currentRegistration = ref(null)
const {data: registrations} = await useFetch('/api/xregistration/mine')
if(registrations.value){
  currentRegistration.value = registrations.value.find(r => r.exchange == xchangeActive.value)
}

async function register() {
  //region
  if(!selRegion.value){
    snacks.value.push('select a region')
    return
  }

  try{
    const regres = await $fetch('/api/xregistration',{
      method:'POST',
      body:{region:selRegion.value,exchange:xchangeActive.value}
    })
    if(regres.success){
      snacks.value.push('yay')
      router.push(`/xchange/${regres.result[0]?.ID}`)
    }else{
      throw regres
    }
  }catch(e){
    console.log(e)
    snacks.value.push({text:'error in registration',color:'error'})
  }
}

//meta
useHead({
  title: computed(() => 'PDB Xchange')
})

</script>

<template>
  <v-container>
    <!-- registration form included into seed exchange page for easier use -->
    <v-card class="pa-2 mb-2">
        <h3>How it works</h3>
        <p>
            - grow peppers this year <br>
            - take pictures, notes on how the peppers grow<br>
            - save the seeds<br><br>

            - register your info<br>
            - record what packets you are sending in<br>
            - package seeds with accession info<br>
            - register any wished for packets<br>
            - send your package to xchange admin when you're ready<br><br>

            - admin confirms package recieved<br>
            - admin xchanges all seed packets<br>
            - admin updates your registration when package is sent back
        </p>

        <h3 class="mt-3">faq</h3>
        <p>
            pepper seeds must be from peppers you grew this year<br>
            you must register here including all packet info<br>
            packets must include accession code from registration<br>
            package must be recieved on time
        </p>

        <h3 class="mt-3">help?!</h3>
        <p>
            ask in the discord server <a href="https://discord.gg/QD44vtCusv">https://discord.gg/QD44vtCusv</a>
        </p>
    </v-card>

    <v-card class="pa-2 mb-2" v-if="!xchangeActive">
        <h2>Registration opens in October!</h2>
        <p>
            Xchange registration opens every year in the autumn. <br>
            set a calendar reminder in october or follow the <br><br>
            <a href="https://reddit.com/r/hotpeppers">hotpeppers reddit</a> and / or
            <a href="https://discord.gg/QD44vtCusv"> xchange discord</a>
        </p>
    </v-card>

    <div class="pa-2 mb-2" v-if="xchangeActive">
      <h3>{{ xchangeActive }} Exchange</h3>
      <v-card v-if="user" class="pa-2 ma-2">
        <div v-if="currentRegistration">
          <v-btn :to="`/xchange/${currentRegistration.id}`" color="primary">go to my registration</v-btn>
        </div>
        <div v-if="!currentRegistration">
          <p>Do you want to join the {{ xchangeActive }} xchange?</p>
          <v-select :items="regions" v-model="selRegion" label="region"></v-select>
          <v-btn @click="register" color="primary">Join</v-btn>
        </div>
      </v-card>
      <v-card v-if="!user" class="pa-2 ma-2">
        you must <v-btn to="/user">login</v-btn> to join the xchange!
      </v-card>
    </div>

    <div class="pa-2 mb-2" v-if="user && registrations">
      <h3>my xchange registrations</h3>
      <v-card v-for="r in registrations" class="pa-2 ma-2">
        <div class="d-inline-flex mx-2">{{ r.exchange }} {{ r.region }}</div>
        <div class="d-inline-flex mx-2">
          <v-btn :to="`/xchange/${r.ID}`">details</v-btn>
        </div>
      </v-card>
    </div>
  </v-container>
</template>
