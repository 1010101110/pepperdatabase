<script setup>
// reactive state
const snacks = inject("snacks");

const regions = ref(["US", "EU"]);
const selRegion = ref(null);
const selXchange = ref(null);
const { data: xchanges } = await useFetch("/api/xchange");
let accessions = ref([]);
const getting = ref(false);


async function getAccessions() {
  if (!selRegion.value) {
    snacks.value.push("select a region");
    return;
  }
  if (!selXchange.value) {
    snacks.value.push("select a xchange");
    return;
  }

  getting.value = true;
  accessions.value = await $fetch("/api/xaccession/list", {
    method: "post",
    body: {
      region: selRegion.value,
      exchange: selXchange.value,
    },
  });
  getting.value = false;
}

useHead({
  title: "PDB Xchange Browser",
});
</script>

<template>
  <v-container fluid>
    <div class="mb-3">
      <v-select
        :items="regions"
        v-model="selRegion"
        label="region"
        density="compact"
      ></v-select>
      <v-select
        :items="xchanges"
        item-title="exchange"
        item-value="exchange"
        v-model="selXchange"
        label="exchange"
        density="compact"
      ></v-select>
      <v-btn @click="getAccessions">get accessions</v-btn>
      <v-progress-circular v-if="getting" color="primary" indeterminate class="pa-1 mx-2"></v-progress-circular>
    </div>
    <v-row>
      <v-col v-for="a in accessions" cols="12" sm="6" md="4">
        <v-card class="pa-2 mb-3">
          <v-lazy>
            <v-row wrap>
              <v-col cols="12" >
                <span class="text-subtitle-1 text-pink" >{{ a.ID }}</span> <span class="text-subtitle-1">{{ a.variety }}</span>
                <br></br>
                <span class="text-caption">{{ a.user }}</span>
                <br></br>
                <v-btn :href="`/accessions/${a.ID}`" color="primary"> details </v-btn>
              </v-col>
              <v-col v-for="img in a.images" cols="6" xl="4" class="pa-2">
                <div style="position: relative">
                  <NuxtLink :to="img" target="_blank">
                    <v-img :src="img" :to="img"></v-img>
                  </NuxtLink>
                </div>
              </v-col>
            </v-row>
          </v-lazy>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
