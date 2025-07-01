<script setup>
import { useFetch } from 'nuxt/app'

// global snackbar
const snacks = inject('snacks')

//xchange activation ('year')
const xchangeActive = ref(null)

//gobal user object
const { user } = useAuth()

//registration
const regions = ref(['US','EU'])
const selRegion = ref(null)

const currentRegistration = ref(null)
const registrations = ref(null)
if(user.value){
  const {data: rr} = await useFetch('/api/xregistration/mine')
  registrations.value = rr.value
  if(registrations.value){
    currentRegistration.value = registrations.value.find(r => r.year === xchangeActive.value)
  }
}

async function joinXchange() {
  //well they join or somethn

  return
}

//meta
useHead({
  title: computed(() => 'PDB Xchange')
})

</script>

<template>
  <v-container>
    <div>
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

        <v-card class="pa-2 mb-2 red" v-if="!xchangeActive">
            <h2>Registration opens in October!</h2>
            <p>
                Xchange registration opens every year in the autumn. <br>
                set a calendar reminder in october or follow the <br><br>
                <a href="https://reddit.com/r/hotpeppers">hotpeppers reddit</a> and / or
                <a href="https://discord.gg/QD44vtCusv"> xchange discord</a>
            </p>
        </v-card>

        <v-card class="pa-2 mb-2" v-if="xchangeActive">
            <div v-if="user">
              <div v-if="currentRegistration">
                <v-btn :to="`/xchange/${currentRegistration.id}`" color="primary">go to my registration</v-btn>
              </div>
              <div v-if="!currentRegistration">
                <p>Do you want to join the {{ xchangeActive }} xchange?</p>
                <v-select :items="regions" v-model="selRegion" label="region"></v-select>
                <v-btn @click="joinXchange" color="primary">Join</v-btn>
              </div>
            </div>
            <div v-if="!user">
              you must <v-btn to="/user">login</v-btn> to join the xchange!
            </div>
        </v-card>

        <div class="pa-2 mb-2" v-if="user && registrations">
          <h3>my xchange registrations</h3>
          <v-card v-for="r in registrations" class="pa-2 ma-2">
            <div class="d-inline-flex mx-2">{{ r.exchange }} {{ r.region }}</div>
            <div class="d-inline-flex mx-2">
              <v-btn :to="`/xchange/${r.ID}`">details</v-btn>
            </div>
          </v-card>
        </div>


    </div>
  </v-container>
</template>
