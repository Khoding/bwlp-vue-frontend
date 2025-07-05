<template>
  <div>
  <div class="login-view">
    <h2>Login</h2>
    <p> Loggen Sie sich hier mit Ihrem Hochschulaccount über Shibboleth ein:</p>
    <button @click="login()">
      Login via Shibboleth
    </button>
  </div>
  <div class="login-view">
    <h2>Login via Test-Account</h2>
    <p> Melden Sie sich hier mit Ihrem Test-Account und Passwort direkt an</p>

    <form @submit.prevent="localAccountLogin()">
      <div class="field label round border">
        <input type="text" id="username" v-model="username"  required/>
        <label>Username</label>
      </div>

      <div class="field label round border">
        <input type="password" id="password" v-model="password" required />
        <label>Password</label>
      </div>

      <button type="submit">Login</button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ClientSessionData, generateLoginURL, getUserAuthInfoFromClientSessionData } from "@/auth/auth"

import { useAuthStore } from '@/stores/auth-store';

import { ref } from 'vue';
import {MasterServerClient} from '@/assets/js/bwlp/bwlp.js';
import {Thrift} from '@/assets/js/thrift/thrift.js';

const router = useRouter()
const authStore = useAuthStore()

const redirectTo=  window.location.origin + "/suite/auth" // todo change to host

let token: string | null
token = router.currentRoute.value.fullPath


const username = ref('')
const password = ref('')
const error = ref('')

const mainServer = 'bwlp-masterserver.ruf.uni-freiburg.de';
const proto = new Thrift.Protocol(new Thrift.Transport(`https://${mainServer}/thrift/`))
const main = new MasterServerClient(proto)


const login = async () => {
  const redirectUrl = generateLoginURL({
    MasterServerURL: "https://bwlp-masterserver.ruf.uni-freiburg.de/webif/shib/",
    Params: new Map<string, string>().set("do", "SuiteLogin").set("url", redirectTo)
  })
  window.location.replace(redirectUrl)
};

const localAccountLogin = async () => {
  try {
    const response: ClientSessionData = await main.localAccountLogin(username.value, password.value)

    const userAuthInfo = getUserAuthInfoFromClientSessionData(response)
    const data = JSON.stringify(userAuthInfo)

    authStore.setToken(response.authToken)
    await router.push({path: `/auth`, query: {"data": data}})
    router.go(0)
  }
 catch (e) {
   error.value = e.message
 }

}

</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-inline: auto;
  margin-top: 5vw;
  button {
    display: flex;
    margin-inline: auto;
  }
}
</style>
