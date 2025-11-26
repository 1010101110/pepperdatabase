<script setup lang="ts">
import { useTheme } from "vuetify";
import { onMounted } from "vue";
const router = useRouter();

const drawer = ref(null);
const menu = [
  { text: "Species", href: "/species" },
  { text: "Varieties", href: "/varieties" },
  { text: "Users", href: "/user/list" },
  { text: "Activity", href: "/history" },
  { text: "Xchange", href: "/xchange" },
];

const { user } = useAuth();

const theme = useTheme();
onMounted(() => {
  const savedTheme = localStorage.getItem("vtheme");
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark
    ? "pdblight"
    : "pdbdark";
  localStorage.setItem("vtheme", theme.global.name.value);
}

const snacks = ref([]);
provide("snacks", snacks);

useHead({
  title: "PepperDatabase",
});
</script>

<style>
.clickable {
  cursor: pointer;
}
</style>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" mobile-breakpoint="md">
      <v-list dense>
        <v-list-item v-for="item in menu" link @click="router.push(item.href)">
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-btn
            variant="outlined"
            class="w-100"
            label="change theme"
            @click="toggleTheme"
            color="indigo"
            >change theme</v-btn
          >
        </v-list-item>
      </v-list>
      <div class="position-absolute bottom-0 pa-2 w-100">
        <v-btn
          variant="outlined"
          density="compact"
          class="w-100"
          href="https://github.com/1010101110/pepperdatabase"
          >Contribute to Code!</v-btn
        >
      </div>
    </v-navigation-drawer>
    <v-app-bar color="indigo" dark>
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <NuxtLink to="/" class="text-white text-decoration-none">
        <v-toolbar-title class="cursor-pointer">PepperDatabase</v-toolbar-title>
      </NuxtLink>
      <v-spacer />
      <v-btn icon to="/user" v-if="user && user.avatar">
        <v-avatar :image="user.avatar"></v-avatar>
      </v-btn>
      <v-btn icon to="/user" v-else>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>

    <v-snackbar-queue v-model="snacks"></v-snackbar-queue>
  </v-app>
</template>
