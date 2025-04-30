<template>
  <div class="login-view">
    <h2>Login</h2>

    <button @click="login()">
      Login via Shibboleth
    </button>
  </div>
</template>

<script setup lang="ts">
import {defineComponent, onMounted, ref} from '@vue/runtime-core';
import {useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/auth-store';
import { generateLoginURL } from "@/auth/auth"

import {MasterServerClient} from '@/assets/js/bwlp/bwlp.js';
import {Thrift} from '@/assets/js/thrift/thrift.js';

const router = useRouter();
const authStore = useAuthStore();

const mainServer = 'bwlp-masterserver.ruf.uni-freiburg.de';
const redirectTo= 'http://localhost:5173/auth'
let token: string | null
token = router.currentRoute.value.fullPath


// https://bwlp-masterserver.ruf.uni-freiburg.de/webif/shib/client_auth.php?token=daas-schrott&dest=https://ca5.de/
const proto = new Thrift.Protocol(new Thrift.Transport(`https://${mainServer}/thrift/`));
const main = new MasterServerClient(proto);

const username = ref('');
const password = ref('');
const error = ref('');

const login = async () => {
  const redirectUrl = generateLoginURL({
    MasterServerURL: "https://bwlp-masterserver.ruf.uni-freiburg.de/webif/shib/client_auth.php",
    Params: new Map<string, string>().set("token", "daas-schrott").set("dest", redirectTo).set("response_type", "code")
  })
  console.log(redirectUrl)
  window.location.replace(redirectUrl);

  // try {
  //   const response = await main.localAccountLogin(username.value, password.value);

  //   authStore.setToken(response.authToken);

  //   router.push('/image');
  // } catch (e) {
  //   error.value = e.message;
  // }
};
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  inline-size: 320px;
  margin-inline: auto;

  button {
    display: flex;
    margin-inline: auto;
  }
}
</style>
