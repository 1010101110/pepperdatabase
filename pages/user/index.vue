<script setup>
import { useAuth } from '~/composables/auth'

// reactive state
const snacks = inject('snacks')
const route = useRoute()
const txtHash = ref('')
const displayLogin = ref('login')
const txtUser = ref('')
const txtEmail = ref('')
const { user, clearUser,setUser } = useAuth()

useHead({
  title: computed(() => 'User')
})

async function login(){
  try{
    const data = await $fetch(
      '/api/user/login',
      {method:'POST', body:{activation_hash:txtHash.value}
    });
    if(data){
      setUser(data)
      snacks.value.push('logged in')
    }else{
      throw 'user not populated'
    }
  }catch(err){
    console.log(err)
    snacks.value.push('login error')
  }
}

async function logout(){
  await $fetch('/api/user/logout');
  clearUser();
  cancel();
}

async function register(){
  try{
    const data = await $fetch(
      '/api/user/register',
      {method:'POST', body:{username: txtUser.value, email:txtEmail.value}}
    );
    if(data.success){
      cancel();

      snacks.value.push('user registerd, check your email')
    }else{
      throw data.error
    }
  }catch(err){
    snacks.value.push('registration error ' + err)
  }
}

function cancel(){
  displayLogin.value = 'login'
  txtEmail.value = ''
  txtUser.value = ''
  txtHash.value = ''
}

async function uploadImage(e){
    const fd = new FormData();

    console.log(user)
    // user
    if(user.value){
        fd.append('user',user.value.id);
    }else{
        snacks.value.push('Invalid user for uploadImage')
        return
    }

    // get image link or file
    if (typeof e === 'string') {
        fd.append('link', e)
    } else if (e instanceof Event && e.target instanceof HTMLInputElement) {
        const file = e.target.files?.[0]
        if (file) {
            fd.append('image', file)
        } else {
            snacks.value.push('No file selected')
        }
    } else {
        snacks.value.push('Invalid input type for uploadImage')
        return
    }

    try{
        const data = await $fetch('/api/user/upload-image',{
            method:'POST', body:fd
        });

        if(data.success){
            snacks.value.push('avatar uploaded')
            if(data.url){
                user.value.avatar = data.url
            }
        }else{
            throw 'failed upload'
        }
    }
    catch(err){
        console.log(err)
        snacks.value.push({text:err,color:'error'})
    }
}

async function deleteImage(){
    try{
        const data = await $fetch('/api/user/delete-image',{
            method:'POST',
            body:{ id: user.value.id, avatar: user.value.avatar}
        })
        if(data.success){
            user.value.avatar = null
            snacks.value.push('deleted image')
        }else{
            snacks.value.push('error deleteing image')
        }
    }
    catch(err){
        console.log(err)
        snacks.value.push({text:err,color:'error'})
    }
}

async function updateUser(){
  try{
    const data = await $fetch(`/api/user`,{method:'PUT',body: user.value});
    if(data.success){
        snacks.value.push('udpated user')
    }else{
        snacks.value.push('error udpating')
    }
}
catch(err){
    console.log(err)
    snacks.value.push({text:err,color:'error'})
}
}

</script>

<template>
  <v-card v-if="user" class="pa-2 ma-2">
    <div class="mb-4">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="user.name" density="compact" label="username"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="user.email" density="compact" label="email address"></v-text-field>
        </v-col>
        <v-col cols="12">
          <span>Avatar</span>
          <div v-if="user.avatar">
            <v-img :src="user.avatar" width="300" >
              <v-btn absolute style="top:10px;left:10px;" icon dark color="black" @click.prevent="deleteImage()">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-img>
          </div>
          <div v-else>
              <p>paste a link to an image </p>
              <v-text-field density="compact" dark label="image url" v-model="user.remoteimage" hint="link to image, jpg gif png" append-icon="mdi-check" @click:append="uploadImage(a.remoteimage,a)"></v-text-field>
              <p>or upload an image file</p>
              <input @change="uploadImage($event)" type="file">
          </div>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="user.bio" label="bio"></v-textarea>
        </v-col>
      </v-row>
    </div>
    <v-btn @click="updateUser" color="primary">Update</v-btn>
    <v-btn @click="logout" color="black" class="ml-3">logout</v-btn>
  </v-card>
  <v-card v-else class="pa-2 ma-2">
    <div v-if="displayLogin === 'register'">
      <v-text-field v-model="txtUser" placeholder="username" autocomplete="username"></v-text-field>
      <v-text-field v-model="txtEmail" placeholder="email address" autocomplete="email"></v-text-field>
      <v-btn @click="register" color="primary" class="mx-2">submit</v-btn>
      <v-btn @click="cancel" class="mx-2">cancel</v-btn>
    </div>
    <div v-if="displayLogin === 'login'">
      <v-text-field v-model="txtHash" placeholder="account secret from email"></v-text-field>
      <v-btn @click="login" color="primary" class="mx-2">login</v-btn>
      <v-btn @click="displayLogin = 'register'" color="secondary" class="mx-2"> register a new account</v-btn>
    </div>
  </v-card>
</template>
