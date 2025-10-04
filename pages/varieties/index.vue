<script setup>
import debounce from "lodash.debounce";

// reactive state
const snacks = inject("snacks");
const { user } = useAuth();
const router = useRouter();

const { data: varieties } = await useFetch("/api/varieties");
const { data: species } = await useFetch("/api/species");

const diagInsert = ref(false);
const txtName = ref("");
const selSpecies = ref(null);

const txtSearch = ref("");
const debounceSearch = debounce(search, 500);
const filteredVarieties = ref([]);
filteredVarieties.value = varieties.value


async function search(){
  const uppsearch = (txtSearch.value || '').toUpperCase();

  if(uppsearch.length < 3){
    filteredVarieties.value = varieties.value
    return;
  }

  filteredVarieties.value = varieties.value.filter(v =>{
    let ret = false;

    ret = ret || v.name?.toUpperCase().includes(uppsearch)
    ret = ret || v.podcolor?.toUpperCase().includes(uppsearch)
    ret = ret || v.plantcolor?.toUpperCase().includes(uppsearch)
    ret = ret || v.heat?.toUpperCase().includes(uppsearch)
    ret = ret || v.speciesname?.toUpperCase().includes(uppsearch)

    return ret;
  })
}

async function insertVariety() {
  if (!user.value) {
    snacks.value.push({ text: "you must login", color: "error" });
    return;
  }
  if (!selSpecies.value || !txtName.value) {
    snacks.value.push({ text: "you must specify all fields", color: "error" });
    return;
  }

  try {
    const data = await $fetch(`/api/varieties`, {
      method: "POST",
      body: {
        species: selSpecies.value,
        name: txtName.value,
      },
    });
    if (data.success) {
      snacks.value.push("added");
      router.push(`/varieties/${txtName.value}`);
    } else {
      throw "error adding";
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

useHead({
  title: "Pepper Varieties",
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="user">
        <v-btn density="compact" @click="diagInsert = true"
          >insert a new varietys</v-btn
        >
      </v-col>
      <v-col cols="12">
        <v-text-field
         density="compact"
         label="search"
         hint="variety name, species, color, heat"
          prepend-inner-icon="mdi-magnify"
          v-model="txtSearch"
          @input="debounceSearch"
        >
        </v-text-field>
      </v-col>
      <v-col cols="6" sm="4" md="3" v-for="s in filteredVarieties" :key="s.ID">
        <v-lazy>
          <v-card class="pa-2 mb-2">
            <div class="d-inline-flex mx-2 w-100">
              <NuxtLink :to="`/varieties/${s.name}`" class="w-100" target="_blank">
                <v-img
                  cover
                  aspect-ratio="1"
                  :src="`https://pepperdatabase.org/images/variety/${s.ID}.webp`"
                ></v-img>
              </NuxtLink>
            </div>
            <div class="d-inline-flex mx-2">
              <span>{{ s.name }}</span>
            </div>
            <div class="d-inline-flex mx-2">
              <span>{{ s.speciesname }}</span>
            </div>
            <div class="d-inline-flex mx-2">
              <v-btn :to="`/varieties/${s.name}`">details</v-btn>
            </div>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
    <v-dialog v-model="diagInsert" max-width="400">
      <v-card class="pa-2">
        <h3>insert a new variety</h3>
        <v-text-field v-model="txtName" label="name"></v-text-field>
        <v-select
          v-model="selSpecies"
          label="species"
          :items="species"
          item-title="name"
          item-value="ID"
        ></v-select>
        <v-btn @click="insertVariety"> Insert </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>
