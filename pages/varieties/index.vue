<script setup>
// reactive state
const snacks = inject("snacks");
const { user } = useAuth();
const router = useRouter();

const { data } = await useFetch("/api/varieties");
const { data: species } = await useFetch("/api/species");

const diagInsert = ref(false);
const txtName = ref("");
const selSpecies = ref(null);

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
      <v-col
        ><p>
          want to search? do that on the <NuxtLink to="/">homepage</NuxtLink>
        </p></v-col
      >
      <v-col cols="12" v-if="user">
        <v-btn density="compact" @click="diagInsert = true"
          >insert a new variety</v-btn
        >
      </v-col>
      <v-col cols="12" v-for="s in data" :key="s.ID">
        <v-lazy>
          <v-card class="pa-2 mb-2">
            <div class="d-inline-flex mx-2">
              <NuxtLink :to="`/varieties/${s.name}`">
                <v-img
                  :width="100"
                  cover
                  :src="`/images/variety/${s.ID}.webp`"
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
