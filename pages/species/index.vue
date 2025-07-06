<script setup>
// reactive state
const snacks = inject("snacks");
const { user } = useAuth();
const router = useRouter();

const { data } = await useFetch("/api/species");

const diagInsert = ref(false);
const txtName = ref("");
const txtAttribute = ref("");

async function insertSpecies() {
  if (!user.value) {
    snacks.value.push({ text: "you must login", color: "error" });
    return;
  }
  if (!txtAttribute.value || !txtName.value) {
    snacks.value.push({ text: "you must specify all fields", color: "error" });
    return;
  }

  try {
    const data = await $fetch(`/api/species`, {
      method: "POST",
      body: {
        attribute: txtAttribute.value,
        name: txtName.value,
      },
    });
    if (data.success) {
      snacks.value.push("added");
      router.push(`/species/${txtName.value}`);
    } else {
      throw "error adding";
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

useHead({
  title: "Pepper Species",
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="user">
        <v-btn density="compact" @click="diagInsert = true"
          >insert a new species</v-btn
        >
      </v-col>
      <v-col cols="12" v-for="s in data" :key="s.ID">
        <v-card class="pa-2 mb-2">
          <div class="d-inline-flex mx-2">
            <NuxtLink :to="`/species/${s.name}`">
              <v-img
                :width="100"
                cover
                :src="`https://pepperdatabase.org/images/species/${s.ID}.webp`"
              ></v-img>
            </NuxtLink>
          </div>
          <div class="d-inline-flex mx-2">
            <span>{{ s.name }}</span>
          </div>
          <div class="d-inline-flex mx-2">
            <v-btn :to="`/species/${s.name}`">details</v-btn>
          </div>
          <div class="d-clear"></div>
          <div class="d-inline-flex mx-2">
            <span>{{ s.attribute }}</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="diagInsert" max-width="400">
      <v-card class="pa-2">
        <h3>insert a new species</h3>
        <v-text-field v-model="txtName" label="name"></v-text-field>
        <v-text-field v-model="txtAttribute" label="attribute"></v-text-field>
        <v-btn @click="insertSpecies"> Insert </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>
