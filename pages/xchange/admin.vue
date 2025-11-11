<script setup>
import { useFetch } from "nuxt/app";
import { computed } from "vue";

// global snackbar
const snacks = inject("snacks");

//gobal user object
const { user } = useAuth();
const router = useRouter();

//
const regions = ref(["US", "EU"]);
const selRegion = ref(null);
const selXchange = ref(null);
const { data: xchanges } = await useFetch("/api/xchange");
let registrations = ref([]);
const getting = ref(false);
const showSent = ref(false);
const showReceived = ref(false);
const showReturned = ref(false);
const showAll = ref(false);

async function getRegistrations() {
  if (!selRegion.value) {
    snacks.value.push("select a region");
    return;
  }
  if (!selXchange.value) {
    snacks.value.push("select a xchange");
    return;
  }

  getting.value = true;
  registrations.value = await $fetch("/api/xregistration/list", {
    method: "post",
    body: {
      region: selRegion.value,
      exchange: selXchange.value,
    },
  });
  getting.value = false;
}

async function updateRegistration(r) {
  try {
    const data = await $fetch(`/api/xregistration`, { method: "PUT", body: r });
    if (data.success) {
      snacks.value.push("udpated registration");
    } else {
      snacks.value.push("error udpating");
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

async function updateRegistrationDate(r,field) {
  try {
    //change date field
    r[field] = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //ok do the update
    updateRegistration(r)
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

const filteredRegistrations = computed(()=>{
  let ret = [];
  if(registrations.value && registrations.value.length > 0){
    for (let i = 0; i < registrations.value.length; i++) {
      const r = registrations.value[i];
      if(showSent.value && r.sent){
        ret.push(r)
        continue;
      }
      if(showReceived.value && r.received){
        ret.push(r);
        continue;
      }
      if(showReturned.value && r.returned){
        ret.push(r);
        continue;
      }
      if(showAll.value){
        ret.push(r);
        continue;
      }
    }
  }
  return ret;
})

function formatDate(d) {
  return d ? new Date(d).toLocaleString() : '';
}

//meta
useHead({
  title: computed(() => "Xchange Admin"),
});
</script>

<template>
  <v-container>
    <div class="pa-2 mb-2" v-if="user && user.account_type === 3">
        <v-row class="mb-3">
            <v-col cols="4">
                <v-select
                    :items="regions"
                    v-model="selRegion"
                    label="region"
                    density="compact"
                ></v-select>
            </v-col>
            <v-col cols="4">
                <v-select
                    :items="xchanges"
                    item-title="exchange"
                    item-value="exchange"
                    v-model="selXchange"
                    label="exchange"
                    density="compact"
                ></v-select>
            </v-col>
            <v-col cols="4">
                <v-btn @click="getRegistrations">get xchange data</v-btn>
                <v-progress-circular v-if="getting" color="primary" indeterminate class="pa-1 mx-2"></v-progress-circular>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-model="showSent" label="show sent" density="compact" hide-details></v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-model="showReceived" label="show received" density="compact" hide-details></v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-model="showReturned" label="show returned" density="compact" hide-details></v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-model="showAll" label="show all" density="compact" hide-details></v-checkbox>
            </v-col>


        </v-row>

        <v-card class="pa-2 mb-3" v-for="r in filteredRegistrations">
          <v-row>
            <v-col cols="12" md="6">
                <v-text-field density="compact" hide-details class="mb-1"
                v-model="r.user"
                label="name on packets"
                ></v-text-field>
                <v-text-field density="compact" hide-details class="mb-1"
                readonly
                v-model="r.email"
                autocomplete="email"
                label="email address"
                ></v-text-field>
                <v-textarea density="compact" hide-details class="mb-1"
                v-model="r.address"
                label="mailing address"
                readonly
                ></v-textarea>
            </v-col>
            <v-col cols="12" md="6">
                <v-textarea density="compact" hide-details auto-grow
                v-model="r.wishlist"
                label="Wish list"
                ></v-textarea>
            </v-col>
            <v-col cols="12">
                user accessions: <br></br>
                <span v-for="a in r.accessions" class="text-caption">
                    PDB {{ a.ID }} - {{ a.variety }} - {{ a.quantity }} <br></br>
                </span>
            </v-col>
            <v-col cols="12">
                sent to exchange: {{ formatDate(r.sent) }} <v-btn @click="updateRegistrationDate(r,'sent')">mark sent</v-btn> <br></br>
                received by admin: {{ formatDate(r.received) }} <v-btn @click="updateRegistrationDate(r,'received')">mark received</v-btn> <br></br>
                returned to user: {{ formatDate(r.returned) }} <v-btn @click="updateRegistrationDate(r,'returned')">mark returned</v-btn> <br></br>
                <v-textarea density="compact" hide-details auto-grow
                v-model="r.return_note"
                label="return note"
                hint="tracking #, any comments from admin"
                ></v-textarea>
            </v-col>
          </v-row>
        </v-card>
        <v-card v-if="filteredRegistrations.length === 0">
          Get the data then select filter(s)
        </v-card>
    </div>

    <div v-else>
        <p>go away 🤨</p>
    </div>
  </v-container>
</template>
