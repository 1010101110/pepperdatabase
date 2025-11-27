<script setup>
// reactive state
const snacks = inject("snacks");

const regions = ref(["US", "EU"]);
const selRegion = ref(null);
const selXchange = ref(null);
const { data: xchanges } = await useFetch("/api/xchange");
let accessions = ref([]);
const getting = ref(false);
const hasSearched = ref(false);
const availableUsers = ref([]);
let requestCounter = 0;

// Filter and sort state
const filterSortState = ref({
  sortBy: 'newest',
  filters: {
    variety: '',
    user: '',
    generation: '',
    pollination: ''
  }
});

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
  const currentRequest = ++requestCounter;
  
  try {
    // Fetch users and accessions in parallel
    const [usersList, accessionsList] = await Promise.all([
      $fetch("/api/xaccession/users", {
        params: {
          region: selRegion.value,
          exchange: selXchange.value
        }
      }),
      $fetch("/api/xaccession/list", {
        method: "post",
        body: {
          region: selRegion.value,
          exchange: selXchange.value,
          sortBy: filterSortState.value.sortBy,
          filters: filterSortState.value.filters
        }
      })
    ]);
    
    // Only update if this is still the most recent request
    if (currentRequest === requestCounter) {
      availableUsers.value = usersList;
      accessions.value = accessionsList;
      hasSearched.value = true;
    }
  } catch (error) {
    // Only show error if this is the most recent request
    if (currentRequest === requestCounter) {
      console.error('Failed to fetch accessions:', error);
      snacks.value.push("Failed to load accessions. Please try again.");
    }
  } finally {
    // Only clear loading if this is the most recent request
    if (currentRequest === requestCounter) {
      getting.value = false;
    }
  }
}

useHead({
  title: "PDB Xchange Browser",
});


const itemsPerPage = shallowRef(20)
function onClickSeeAll () {
  itemsPerPage.value = itemsPerPage.value === 20 ? accessions.value.length : 20
}

// Calculate unique users from filtered accessions
const filteredUserCount = computed(() => {
  const uniqueUsers = new Set(accessions.value.map(acc => acc.user));
  return uniqueUsers.size;
});

</script>

<template>
  <v-container fluid>
    <v-row>
      <!-- Sidebar Column -->
      <v-col cols="12" md="3" lg="2">
        <div class="mb-3">
          <v-select
            :items="regions"
            v-model="selRegion"
            label="region"
            density="compact"
            variant="outlined"
          ></v-select>
          <v-select
            :items="xchanges"
            item-title="exchange"
            item-value="exchange"
            v-model="selXchange"
            label="exchange"
            density="compact"
            variant="outlined"
            class="mt-2"
          ></v-select>
          <v-btn @click="getAccessions" color="primary" block class="mt-2">
            Get Accessions
          </v-btn>
        </div>

        <!-- Filter Sidebar - Show after first search -->
        <FilterSidebar 
          v-if="hasSearched"
          v-model="filterSortState"
          :available-users="availableUsers"
          @apply="getAccessions"
        />
      </v-col>

      <!-- Main Content Column -->
      <v-col cols="12" md="9" lg="10">
        <!-- Loading spinner -->
        <div v-if="getting" class="d-flex justify-center align-center pa-8">
          <v-progress-circular 
            color="primary" 
            indeterminate 
            size="64"
          ></v-progress-circular>
        </div>

        <!-- No results message -->
        <v-alert 
          v-else-if="hasSearched && accessions.length === 0" 
          type="info" 
          variant="tonal"
          class="mb-4"
        >
          No accessions found matching your criteria. Try adjusting your filters.
        </v-alert>

        <div v-show="accessions.length > 0">
          <v-data-iterator :items="accessions" :items-per-page="itemsPerPage">
            <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
              <h1
                class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center"
              >
                <div class="text-truncate">
                  Accessions <span class="text-body-2">∑ {{ accessions.length }}</span>
                  <span class="text-body-2 mx-2">•</span>
                  <span class="text-body-2">Users: {{ filteredUserCount }}</span>
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
                <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" lg="4">
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
      </v-col>
    </v-row>
  </v-container>
</template>
