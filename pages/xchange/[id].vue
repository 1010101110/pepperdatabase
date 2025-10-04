<script setup>
// global snackbar
const snacks = inject("snacks");
const route = useRoute();
const { user } = useAuth();

//data from api
const { data: resp, error } = await useFetch(
  `/api/xregistration/${route.params.id}`,
);
const regions = ref(["US", "EU"]);
const { data: accessions} = await useFetch(
  `/api/xaccession/dropdown`,
);

useHead({
  title: computed(() => `xchange `),
});

onMounted(() => {
  if (error.value) {
    console.log(error);
    snacks.value.push(error.value.message);
  }
});

function toggleCollapse(e) {
  var o = e.target.nextElementSibling;
  var display = o.style.display === "none" ? "" : "none";
  while (o) {
    if (o.style.display !== display) {
      o.style.display = display;
      o = o.nextElementSibling;
    } else {
      o = false;
    }
  }
}

async function uploadImage(e, a) {
  const fd = new FormData();
  // accession
  if (a && a.ID) {
    fd.append("accession", a.ID);
  } else {
    snacks.value.push("Invalid accession for uploadImage");
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
    snacks.value.push("uploading...");
    const data = await $fetch("/api/xaccession/upload-image", {
      method: "POST",
      body: fd,
    });

    if (data.success) {
      snacks.value.push("image uploaded");
      if (data.url) {
        //make sure we have image array to insert
        if(!a.images){
          a.images = [];
        }
        a.images.push(data.url);
      }
    } else {
      throw "failed upload";
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

async function deleteImage(i, a) {
  try {
    const data = await $fetch("/api/xaccession/delete-image", {
      method: "POST",
      body: { deleteMe: i, updateMe: a },
    });
    if (data.success) {
      a.images = a.images.filter((x) => x !== i);
      snacks.value.push("deleted image");
    } else {
      snacks.value.push("error deleteing image");
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

async function rotateImage(i,a) {
  //remove image from array so it can be refreshed
  const imgagescopy = a.images.slice();
  a.images = a.images.filter((x) => x !== i);

  //rotate server
  try {
    const data = await $fetch("/api/image-rotate", {
      method: "POST",
      body: { rotateMe: i },
    });
    if (data.success) {
      console.log('rotated idiot')
      snacks.value.push("rotated image");
    } else {
      snacks.value.push("error rotating");
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  } finally {
    a.images = imgagescopy;
  }
}

async function updateAccession(a) {
  try {
    const data = await $fetch(`/api/xaccession`, { method: "PUT", body: a });
    if (data.success) {
      snacks.value.push("udpated accession");
    } else {
      snacks.value.push("error udpating");
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

async function addAccession() {
  try {
    const xregistration = resp.value.r.ID;
    const data = await $fetch(`/api/xaccession`, {
      method: "POST",
      body: { xregistration },
    });
    if (data.success) {
      snacks.value.push("added accession");
      resp.value.a.push(data.a);
    } else {
      snacks.value.push("error adding accession");
    }
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

async function deleteAccession(a) {
  const sure = confirm("are you sure want to DELETE this???");
  if (sure) {
    try {
      const data = await $fetch(`/api/xaccession`, {
        method: "DELETE",
        body: a,
      });
      if (data.success) {
        snacks.value.push("deleted accession");
        resp.value.a = resp.value.a.filter((x) => x.ID !== a.ID);
      } else {
        snacks.value.push("error udpating");
      }
    } catch (err) {
      console.log(err);
      snacks.value.push({ text: err, color: "error" });
    }
  }
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

async function sendPackage() {
  try {
    //validate before sending
    for (let i = 0; i < resp.value.a.length; i++) {
      const a = resp.value.a[i];
      if(!Array.isArray(a.images) || !a.images.length){
        throw 'all accessions must have images, if you don\'t have pictures then we don\'t want the seeds..'
      }
    }

    if(!resp.value.r.address){
      throw 'please provide your return address'
    }

    updateRegistration(resp.value.r)
  } catch (err) {
    console.log(err);
    snacks.value.push({ text: err, color: "error" });
  }
}

function formatDate(d) {
  return new Date(d).toLocaleString();
}
</script>

<template>
  <v-container v-if="resp && resp.r">
    <div class="pa-2 mb-2">
      <div
        class="clickable headline indigo white--text pa-2 mb-2"
        @click="toggleCollapse"
      >
        User
      </div>
      <v-card class="pa-2">
        <v-row>
          <v-col cols="12" sm="4" md="5" lg="4" class="pa-1">
            <v-text-field
              v-model="resp.r.user"
              label="name on packets"
              hint="the name your seed packs will be labeled with"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="5" lg="4" class="pa-1">
            <v-text-field
              readonly
              v-model="resp.r.email"
              autocomplete="email"
              label="email address"
              hint="notifications sent here"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" md="2" lg="2" class="pa-1">
            <v-select
              readonly
              :items="regions"
              v-model="resp.r.region"
              label="region"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4" md="2" lg="2" class="pa-1">
            <v-select
              readonly
              :bg-color="
                resp.r.exchange == new Date().getFullYear() ? null : 'error'
              "
              :items="regions"
              v-model="resp.r.exchange"
              label="year"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="resp.r.wishlist"
              label="Wish list"
              hint="varieties or categories (species, heat level, colors, etc)"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="resp.r.address"
              label="my address"
              hint="enter your address as if you were writing it on an envelope"
            ></v-textarea>
          </v-col>

          <v-col cols="12" class="pa-2">
            <v-btn
              icon
              dark
              color="primary"
              @click="updateRegistration(resp.r)"
            >
              <v-icon icon="mdi-content-save"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- <v-btn icon dark color="primary" @click="logout"><v-icon>save</v-icon></v-btn> -->
    </div>

    <div class="pa-2 mb-2">
      <div
        class="clickable headline indigo white--text pa-2"
        @click="toggleCollapse"
      >
        Package
      </div>
      <v-card class="pa-2">
        <div>
          <div v-if="resp.a.length > 0">
            <div v-if="resp.r.region === 'US'">
              <span class="font-weight-bold">address</span><br />
              <p>address will be available in novemeber 😘</p>

            </div>
            <div v-if="resp.r.region === 'EU'">
              <span class="font-weight-bold">address</span><br />
              <p>address will be available in novemeber 😘</p>

            </div>
            <div class="mt-2">
              When you have sent your package click the button, this will notify
              the admin and record your send date:
              <v-btn color="green" @click="sendPackage()">Sent package</v-btn>
            </div>
          </div>
          <div v-else>Add some accessions below!</div>
        </div>

        <div v-if="resp.r.sent">
          <!-- <div v-if="resp.r.region === 'US'">
                    please include paper money in your envelope to cover return shipping (id don't want coins)<br>
                    any questions or issues message /u/1010101110 on reddit
                </div>
                <div v-if="resp.r.region === 'EU'">
                <p>
                            <a href="https://www.paypal.com/paypalme/Vlammenzee?">PAYPAL Vlammenzee</a><br>
                            Postage is €6 (if there's a fee, make sure it's covered).<br><br>
                            If any questions, contact me on reddit or discord.<br>
                            /u/Vlammenzee<br>
                            Vlammenzee#2798<br>

                        </p>

                    <br><br>
                </div>
            -->
          Package sent to exchange:
          <span class="font-weight-bold">{{ formatDate(resp.r.sent) }}</span
          ><br /><br />
          Package recieved:
          <span v-if="resp.r.received" class="font-weight-bold">{{
            formatDate(resp.r.received)
          }}</span
          ><br /><br />
          Package returned to you:
          <span v-if="resp.r.returned" class="font-weight-bold">{{
            formatDate(resp.r.returned)
          }}</span
          ><br />
        </div>
      </v-card>
    </div>

    <div class="pa-2 mb-2">
      <div
        class="clickable headline indigo white--text pa-2"
        @click="toggleCollapse"
      >
        Accessions (seed packets)
      </div>

      <v-btn icon dark color="primary" @click="addAccession()"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
      <br />

      <v-card class="pa-4 my-5" elevation="3" v-for="a in resp.a">
        <v-row>
          <v-col cols="12" sm="6" md="4" class="pa-1">
            <v-text-field
              label="accession #"
              readonly
              v-model="a.ID"
              prefix="PDB"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="pa-1">
            <v-text-field
              label="variety name (required)"
              v-model="a.variety"
              hint="include variety name first, color/specialty second. examples: 7 Pot Red, Jalapeno Early, Aji Pineapple Purple"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="pa-1">
            <v-text-field
              label="# seed packets"
              v-model="a.quantity"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4"  class="pa-1">
            <v-select
              label="pollination"
              :items="['open pollinated', 'isolated']"
              clearable
              v-model="a.pollination"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="pa-1">
            <v-select
              label="cross generation (optional)"
              hint="Is this a cross? do you know its generation?"
              persistent-hint
              :items="['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7']"
              clearable
              v-model="a.generation"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="pa-1">
            <v-autocomplete
              label="ancestor pdb# (optional)"
              hint="Did you grow this from a previous xchange?"
              persistent-hint
              :items="accessions"
              clearable
              v-model="a.ancestor"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" class="pa-1">
            <v-textarea
              v-model="a.description"
              label="description (required)"
              hint="how did it grow? produce? taste? what did the plant, pods, flowers look like?"
            ></v-textarea>
          </v-col>
          <v-col cols="12" class="pa-2">
            <v-btn
              icon
              dark
              color="primary"
              class="mr-2"
              @click="updateAccession(a)"
              ><v-icon icon="mdi-content-save"></v-icon
            ></v-btn>
            <v-btn icon dark color="black" @click="deleteAccession(a)"
              ><v-icon icon="mdi-delete"></v-icon
            ></v-btn>
          </v-col>
          <v-col cols="12" class="pa-2">
            <h4>images (required)</h4>
            <v-row>
              <v-col cols="12" md="4" lg="3" xl="2">
                <v-card min-height="200px" color="indigo darken-4" class="ma-1">
                  <div v-if="a.busy">
                    <v-progress-circular size="100" indeterminate color="red">
                    </v-progress-circular>
                  </div>
                  <div v-else>
                    <p class="amber--text">paste a link to an image</p>
                    <v-text-field
                      dark
                      label="image url"
                      v-model="a.remoteimage"
                      hint="link to image, jpg gif png"
                      append-icon="mdi-check"
                      @click:append="uploadImage(a.remoteimage, a)"
                    ></v-text-field>
                    <p class="amber--text">or upload an image file</p>
                    <input
                      class="white--text"
                      @change="uploadImage($event, a)"
                      type="file"
                    />
                  </div>
                </v-card>
              </v-col>

              <v-col
                v-if="!a.images || a.images.length === 0"
                cols="12"
                md="4"
                lg="3"
                xl="2"
                class="pa-2 text-xs-center"
              >
                <v-card>
                  <v-progress-linear
                    indeterminate
                    color="red"
                  ></v-progress-linear>
                  <v-progress-linear
                    indeterminate
                    color="orange"
                  ></v-progress-linear>
                  <v-progress-linear
                    indeterminate
                    color="yellow"
                  ></v-progress-linear>
                  <p>please include at least one image from your grow 😳</p>
                  <v-progress-linear
                    indeterminate
                    color="green"
                  ></v-progress-linear>
                  <v-progress-linear
                    indeterminate
                    color="blue"
                  ></v-progress-linear>
                  <v-progress-linear
                    indeterminate
                    color="purple"
                  ></v-progress-linear>
                </v-card>
              </v-col>
              <v-col v-for="img in a.images" cols="4" lg="2" class="pa-2">
                <div style="position: relative">
                  <NuxtLink :to="img" target="_blank">
                    <v-img :src="img">
                      <v-btn
                        absolute
                        style="top: 10px; left: 10px"
                        icon
                        dark
                        color="black"
                        @click.prevent="deleteImage(img, a)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                      <v-btn
                        absolute
                        style="top: 10px; left: 30px"
                        icon
                        dark
                        color="orange"
                        @click.prevent="rotateImage(img, a)"
                        ><v-icon>mdi-rotate-right</v-icon></v-btn
                      >
                    </v-img>
                  </NuxtLink>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!--<v-card class="pa-2 mb-3">
       <div class="clickable headline indigo white--text pa-2" @click="toggleCollapse">All Accessions</div>
            <hr>
            <v-data-table :headers="allheaders" :items="allaccessions" :pagination.sync="allpagination" class="elevation-1">
                <template v-slot:items="props">
                    <td>PDB {{ props.item.ID }}</td>
                    <td class="text-xs-right">  {{ props.item.variety }} </td>
                    <td class="text-xs-right"> {{props.item.user}} </td>
                    <td><a :href="'/xchange/accession/' + props.item.ID">Page link</a> </td>
                    <td style="height:50px"> <img v-if="props.item.images && props.item.images.length > 0" :src="props.item.images[0]" style="max-width:200px; max-height:200px;"> </td>
                    <td></td>
                </template>
            </v-data-table> -->

      <!-- <v-row row wrap>
                <v-col cols="12" v-for="x in allaccessions">
                    <p>PDB{{x.ID}} from {{x.user}} {{x.quantity}}x {{x.variety}}</p>
                </v-col>
            </v-row>
    </v-card>-->

    <v-card class="pa-2 mb-3">
      <h3>help?!</h3>
      <p>create at ticket in discord or reddit message to /u/1010101110</p>
    </v-card>
  </v-container>
  <v-container v-else>
    <div v-if="!user">you must login to view your registration</div>
    <div v-else>invalid registration</div>
  </v-container>
</template>
