<template>
  <div class="login-view">
    <h2>Login</h2>

    <button @click="login()">
      Login via Shibboleth
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth-store';
import { generateLoginURL } from "@/auth/auth"

const router = useRouter();
const authStore = useAuthStore();

const redirectTo= 'http://localhost:5173/auth' // todo change to host

let token: string | null
token = router.currentRoute.value.fullPath


const login = async () => {
  const redirectUrl = generateLoginURL({
    MasterServerURL: "https://bwlp-masterserver.ruf.uni-freiburg.de/webif/shib/",
    Params: new Map<string, string>().set("do", "SuiteLogin").set("url", redirectTo)
  })
  window.location.replace(redirectUrl);
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
