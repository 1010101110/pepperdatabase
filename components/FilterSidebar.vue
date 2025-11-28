<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      sortBy: 'newest',
      filters: {
        variety: '',
        user: null,
        status:null,
        generation: null,
        pollination: null
      }
    })
  },
  availableUsers: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'apply']);

const localValue = ref({ ...props.modelValue });
const isInitialized = ref(false);

watch(() => props.modelValue, (newVal) => {
  localValue.value = { ...newVal };
}, { deep: true });

const sortOptions = [
  { title: 'Newest First', value: 'newest' },
  { title: 'Oldest First', value: 'oldest' },
  { title: 'Variety (A-Z)', value: 'variety-asc' },
  { title: 'Variety (Z-A)', value: 'variety-desc' },
  { title: 'User (A-Z)', value: 'user-asc' },
  { title: 'User (Z-A)', value: 'user-desc' },
  { title: 'Quantity (High-Low)', value: 'quantity-desc' },
  { title: 'Quantity (Low-High)', value: 'quantity-asc' }
];

const generationOptions = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'];
const pollinationOptions = ['open pollinated', 'hand pollinated', 'isolated'];

// Auto-apply filters
function applyFilters() {
  emit('update:modelValue', localValue.value);
  emit('apply');
}

// Track if this is a user-initiated change
let debounceTimer = null;
const triggerSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    if (isInitialized.value) {
      applyFilters();
    }
  }, 600);
};

// Watch sort changes - apply immediately
watch(() => localValue.value.sortBy, (newVal, oldVal) => {
  if (isInitialized.value && newVal !== oldVal) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    applyFilters();
  }
});

// Watch filter changes - apply with debounce
watch(() => JSON.stringify(localValue.value.filters), (newVal, oldVal) => {
  if (isInitialized.value && newVal !== oldVal) {
    triggerSearch();
  }
});

// Mark as initialized after component is mounted
onMounted(() => {
  setTimeout(() => {
    isInitialized.value = true;
  }, 200);
});

// Clean up timer on unmount
onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

function clearFilters() {
  localValue.value = {
    sortBy: 'newest',
    filters: {
      variety: '',
      user: null,
      generation: null,
      pollination: null,
      status:null,
    }
  };
  emit('update:modelValue', localValue.value);
  emit('apply');
}

const hasActiveFilters = computed(() => {
  const f = localValue.value.filters;
  return f.variety || f.user || f.generation || f.pollination || f.status;
});
</script>

<template>
  <v-card class="filter-sidebar" elevation="2">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Filters & Sort</span>
      <v-chip v-if="hasActiveFilters" color="primary" size="small">
        Active
      </v-chip>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <!-- Sort Section -->
      <div class="mb-6">
        <div class="text-subtitle-2 mb-2 font-weight-bold">Sort By</div>
        <v-select
          v-model="localValue.sortBy"
          :items="sortOptions"
          density="compact"
          variant="outlined"
          hide-details
        ></v-select>
      </div>

      <v-divider class="my-4"></v-divider>

      <!-- Filter Section -->
      <div class="mb-4">
        <div class="text-subtitle-2 mb-3 font-weight-bold">Filter By</div>

        <v-text-field
          v-model="localValue.filters.variety"
          label="Variety Name"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          class="mb-3"
        ></v-text-field>

        <v-select
          v-model="localValue.filters.status"
          :items="['sent','received','returned']"
          label="Status"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          class="mb-3"
        ></v-select>

        <v-select
          v-model="localValue.filters.user"
          :items="availableUsers"
          label="User"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          class="mb-3"
        ></v-select>

        <v-select
          v-model="localValue.filters.generation"
          :items="generationOptions"
          label="Generation"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          class="mb-3"
        ></v-select>

        <v-select
          v-model="localValue.filters.pollination"
          :items="pollinationOptions"
          label="Pollination Type"
          density="compact"
          variant="outlined"
          clearable
          hide-details
          class="mb-3"
        ></v-select>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex flex-column gap-2">
        <v-btn
          variant="outlined"
          block
          @click="clearFilters"
          :disabled="!hasActiveFilters && localValue.sortBy === 'newest'"
        >
          Clear All
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.filter-sidebar {
  position: sticky;
  top: 20px;
}
</style>
