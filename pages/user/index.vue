<script setup>
import { useAuth } from '~/composables/auth'

// reactive state
const snacks = inject('snacks')
const route = useRoute()
const txtHash = ref('')
const displayLogin = ref('login')
const txtUser = ref('')
const txtEmail = ref('')
const { user, clearUser } = useAuth()

useHead({
  title: computed(() => 'User')
})

async function login(){
  try{
    const data = await $fetch(
      '/api/user/login',
      {method:'POST', body:{activation_hash:txtHash.value}
    });
    const { setUser } = useAuth()
    setUser(data)
    snacks.value.push('logged in ' + data.name)
  }catch(err){
    snacks.value.push('login error')
  }
}

async function logout(){
  await $fetch('/api/user/logout');
  clearUser();
}

async function register(){
  try{
    const data = await $fetch(
      '/api/user/register',
      {method:'POST', body:{username: txtUser.value, email:txtEmail.value}}
    );

    console.log(data);
    snacks.value.push('user registerd, check your email')
  }catch(err){
    snacks.value.push('registration error ' + err)
  }
}

function cancel(){
  displayLogin.value = 'login'
  txtEmail.value = ''
  txtUser.value = ''
}

</script>

<template>
  <v-card v-if="user" class="pa-2 ma-2">
    {{ user }}
    <v-btn @click="logout">logout</v-btn>
  </v-card>
  <v-card v-else class="pa-2 ma-2">
    <div v-if="displayLogin === 'register'">
      <v-text-field v-model="txtUser" placeholder="username" autocomplete="username"></v-text-field>
      <v-text-field v-model="txtEmail" placeholder="email address" autocomplete="email"></v-text-field>
      <v-btn @click="register">submit</v-btn>
      <v-btn @click="cancel">cancel</v-btn>
    </div>
    <div v-if="displayLogin === 'login'">
      <v-text-field v-model="txtHash" placeholder="account secret from email"></v-text-field>
      <v-btn @click="login">login</v-btn>
      <v-btn @click="displayLogin = 'register'"> register a new account</v-btn>
    </div>
  </v-card>
</template>
