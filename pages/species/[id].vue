<script setup>
// reactive state
const snacks = inject("snacks");
const route = useRoute();
const { user } = useAuth();
const editable = ref(false);
const displayImage = ref(true);

if (user.value) {
  editable.value = true;
}

const { data: species } = await useFetch(`/api/species/${route.params.id}`);
const varieties = ref([]);
if (species.value) {
  const { data: vdata } = await useFetch(
    `/api/varieties/species/${species.value?.ID}`,
  );
  varieties.value = vdata;
}

useHead({
  title: computed(() => species.value?.name || "Species"),
  link:[
    {
      rel:'canonical',
      href:`https://pepperdatabase.org/species/${species.value.name}`
    },
  ],
  meta: [
    { property: "og:title", content: `${species.value.name}` },
    {
      property: "og:description",
      content: `Check out this pepper species and all the varieties it has! ${species.value.name}`,
    },
    {
      property: "og:image",
      content: `https://pepperdatabase.org/images/species/${species.value.ID}.webp`,
    },
    {
      property: "og:url",
      content: `https://pepperdatabase.org/species/${species.value.name}`,
    },
  ],
});

async function updateRecord() {
  try {
    const data = await $fetch(`/api/species`, {
      method: "PUT",
      body: species.value,
    });
    if (data.success) {
      snacks.value.push("udpated species");
    } else {
      throw "error updating species";
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err.toString(), color: "error" });
  }
}

async function uploadImage(e) {
  const fd = new FormData();

  if (species.value) {
    fd.append("filename", species.value.ID);
  } else {
    snacks.value.push("Invalid species for uploadImage");
    return;
  }

  // get image link or file
  if (typeof e === "string") {
    fd.append("link", e);
  } else if (e instanceof Event && e.target instanceof HTMLInputElement) {
    const file = e.target.files?.[0];
    if (file) {
      fd.append("image", file);
    } else {
      snacks.value.push("No file selected");
    }
  } else {
    snacks.value.push("Invalid input type for uploadImage");
    return;
  }

  try {
    const data = await $fetch("/api/species/upload-image", {
      method: "POST",
      body: fd,
    });

    if (data.success) {
      snacks.value.push("image uploaded");
      species.value.remoteimage = null;
      displayImage.value = true;
    } else {
      throw "failed upload";
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

async function deleteImage() {
  try {
    const data = await $fetch("/api/species/delete-image", {
      method: "POST",
      body: { id: species.value.ID },
    });
    if (data.success) {
      displayImage.value = false;
      snacks.value.push("deleted image");
    } else {
      snacks.value.push("error deleteing image");
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}
</script>

<template>
  <v-container>
    <v-card class="pa-2 my-4">
      <v-row v-if="species">
        <v-col cols="12" v-if="displayImage">
          <v-img
            :src="`/images/species/${species.ID}.webp`"
            width="300"
            @error="displayImage = false"
          >
            <v-btn
              absolute
              style="top: 10px; left: 10px"
              icon
              dark
              color="black"
              @click.prevent="deleteImage()"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-img>
        </v-col>
        <v-col cols="12" v-else>
          <v-card min-height="200px" color="indigo darken-4" class="ma-1">
            <div>
              <p>paste a link to an image</p>
              <v-text-field
                label="image url"
                density="compact"
                v-model="species.remoteimage"
                hint="link to image, jpg gif png"
                append-icon="mdi-check"
                @click:append="uploadImage(species.remoteimage)"
              ></v-text-field>
              <p>or upload an image file</p>
              <input @change="uploadImage($event)" type="file" />
            </div>
          </v-card>
        </v-col>
        <v-col>
          <v-text-field
            :readonly="!editable"
            v-model="species.name"
            label="name"
          ></v-text-field>
          <v-text-field
            :readonly="!editable"
            v-model="species.attribute"
            label="identifying attribute"
          ></v-text-field>
          <TipTapEditor
            v-model="species.description"
            :editable="editable"
            label="description"
          ></TipTapEditor>
          <v-btn v-if="editable" @click="updateRecord" color="secondary"
            >Update</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
    <h2>Varieties</h2>
    <v-lazy v-for="v in varieties.value">
      <v-card class="pa-2 my-2">
        <div class="d-inline-flex mx-2">
          <NuxtLink :to="`/varieties/${v.name}`">
            <v-img
              :width="100"
              cover
              :src="`/images/variety/${v.ID}.webp`"
            ></v-img>
          </NuxtLink>
        </div>
        <div class="d-inline-flex mx-2">
          <span>{{ v.name }}</span>
        </div>
        <div class="d-inline-flex mx-2">
          <v-btn :href="`/varieties/${v.name}`">details</v-btn>
        </div>
      </v-card>
    </v-lazy>
  </v-container>
</template>
