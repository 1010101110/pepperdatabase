<script setup>
// reactive state
const snacks = inject("snacks");
const route = useRoute();
const { user } = useAuth();
const editable = ref(false);
const heats = [
  "Sweet (0 shu)",
  "Mild (100-5k shu)",
  "Medium (5k-100k shu)",
  "Hot (100k-500k shu)",
  "SuperHot (500k+ shu)",
];
const displayImage = ref(true);

if (user.value) {
  editable.value = true;
}

const { data: varieties } = await useFetch(`/api/varieties/${route.params.id}`);
const { data: species } = await useFetch("/api/species");

useHead({
  title: computed(() => varieties.value?.name || "Varieties"),
  meta: [
    { property: "og:title", content: `${varieties.value.name}` },
    {
      property: "og:description",
      content: `Check out this pepper variety and see who's grown it! ${varieties.value.name}`,
    },
    {
      property: "og:image",
      content: `https://pepperdatabase.org/images/variety/${varieties.value.ID}.webp`,
    },
    {
      property: "og:url",
      content: `https://pepperdatabase.org/varieties/${varieties.value.name}`,
    },
  ],
});

async function updateRecord() {
  try {
    const data = await $fetch(`/api/varieties`, {
      method: "PUT",
      body: varieties.value,
    });
    if (data.success) {
      snacks.value.push("udpated varieties");
    } else {
      throw "error updating varieties";
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err.toString(), color: "error" });
  }
}

async function uploadImage(e) {
  const fd = new FormData();

  if (varieties.value) {
    fd.append("filename", varieties.value.ID);
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
    const data = await $fetch("/api/varieties/upload-image", {
      method: "POST",
      body: fd,
    });

    if (data.success) {
      snacks.value.push("image uploaded");
      varieties.value.remoteimage = null;
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
    const data = await $fetch("/api/varieties/delete-image", {
      method: "POST",
      body: { id: varieties.value.ID },
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
      <v-row v-if="varieties">
        <v-col cols="12" v-if="displayImage">
          <v-img
            :src="`/images/variety/${varieties.ID}.webp`"
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
                v-model="varieties.remoteimage"
                hint="link to image, jpg gif png"
                append-icon="mdi-check"
                @click:append="uploadImage(varieties.remoteimage)"
              ></v-text-field>
              <p>or upload an image file</p>
              <input @change="uploadImage($event)" type="file" />
            </div>
          </v-card>
        </v-col>
        <v-col>
          <v-text-field
            :readonly="!editable"
            v-model="varieties.name"
            label="name"
          ></v-text-field>
          <v-select
            v-model="varieties.species"
            :readonly="!editable"
            label="species"
            :items="species"
            item-title="name"
            item-value="ID"
          >
          </v-select>
          <v-select
            :readonly="!editable"
            v-model="varieties.heat"
            :items="heats"
            label="heat"
          ></v-select>
          <v-text-field
            :readonly="!editable"
            v-model="varieties.podsize"
            label="podsize"
          ></v-text-field>
          <v-text-field
            :readonly="!editable"
            v-model="varieties.podcolor"
            label="podcolor"
          ></v-text-field>
          <v-text-field
            :readonly="!editable"
            v-model="varieties.plantcolor"
            label="plantcolor"
          ></v-text-field>
          <v-text-field
            :readonly="!editable"
            v-model="varieties.maturity"
            label="maturity (days)"
          ></v-text-field>
          <v-text-field
            :readonly="!editable"
            v-model="varieties.origin"
            label="origin"
          ></v-text-field>
          <v-text-field
            :readonly="!editable"
            v-model="varieties.accession"
            label="Related Accession"
          ></v-text-field>
          <TipTapEditor
            v-model="varieties.description"
            :editable="editable"
            label="description"
          ></TipTapEditor>
          <v-btn v-if="editable" @click="updateRecord" color="secondary"
            >Update</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
