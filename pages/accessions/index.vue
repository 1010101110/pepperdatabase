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


const itemsPerPage = shallowRef(20)
function onClickSeeAll () {
  itemsPerPage.value = itemsPerPage.value === 20 ? accessions.value.length : 20
}

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
    <div v-show="accessions.length > 0">
<v-data-iterator :items="accessions" :items-per-page="itemsPerPage">
    <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
      <h1
        class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center"
      >
        <div class="text-truncate">
          Accessions <span class="text-body-2">∑ {{ accessions.length }}</span>
        </div>

        <div class="d-flex align-center">
          <div class="d-inline-flex">
            <span class="text-body-2"> {{ page }} / {{ pageCount }} </span>
          </div>
          <v-btn class="me-8" variant="text" @click="onClickSeeAll">
            <span class="text-decoration-underline text-none">See all</span>
          </v-btn>

          <div class="d-inline-flex">
            <v-btn
              :disabled="page === 1"
              class="me-2"
              icon="mdi-arrow-left"
              size="small"
              variant="tonal"
              @click="prevPage"
            ></v-btn>

            <v-btn
              :disabled="page === pageCount"
              icon="mdi-arrow-right"
              size="small"
              variant="tonal"
              @click="nextPage"
            ></v-btn>
          </div>
        </div>
      </h1>
    </template>
    <template v-slot:default="{ items }">
      <v-row>
        <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4">
          <v-card class="pa-2 mb-3">
            <v-row wrap>
              <v-col cols="12" >
                <span class="text-subtitle-1 text-pink" >{{ item.raw.ID }}</span> <span class="text-subtitle-1">{{ item.raw.variety }}</span>
                <br></br>
                <span class="text-caption">{{ item.raw.user }}</span>
                <br></br>
                <v-btn :href="`/accessions/${item.raw.ID}`" color="primary"> details </v-btn>
              </v-col>
              <v-col v-for="img in item.raw.images" cols="6" xl="4" class="pa-2">
                <div style="position: relative">
                  <NuxtLink :to="img" target="_blank">
                    <v-img :src="img" :to="img"></v-img>
                  </NuxtLink>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>

  </v-data-iterator>
    </div>


  </v-container>
</template>
