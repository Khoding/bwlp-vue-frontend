<template>
  <div class="login-view">
    <h2>Login</h2>

    <button v-on:click="login()"></button>
  </div>
</template>

<script setup lang="ts">
import {ref} from '@vue/runtime-core';
import {useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/auth-store';

import { Auth } from '@/utils/auth';

import {MasterServerClient} from '@/assets/js/bwlp/bwlp.js';
import {Thrift} from '@/assets/js/thrift/thrift.js';

// https://bwlp-masterserver.ruf.uni-freiburg.de/shibboleth-ds/?entityID=https%3A%2F%2Fbwlp-masterserver.ruf.uni-freiburg.de%2Fshibboleth&return=https%3A%2F%2Fbwlp-masterserver.ruf.uni-freiburg.de%2FShibboleth.sso%2FLogin%3FSAMLDS%3D1%26target%3Dss%253Amem%253A8040d1693065d7c5d28eed825d981f342d391d146e1dad4e834a7391c88a28bc

const authServer = 'bwlp-masterserver.ruf.uni-freiburg.de';
const authPath = "/shibboleth-ds"
const returnParameter = "http://localhost:51737"

const authHandler = new Auth({
  AuthServerBaseURL: authServer,
  AuthPath: authPath,
  RedirectURL: returnParameter,
}) 

authHandler.setEntityId('https://bwlp-masterserver.ruf.uni-freiburg.de/shibboleth')
const authUrl = authHandler.generateLoginURL()


const login = async () => {
  console.log(authUrl)
};
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 320px;
  margin-inline: auto;

  button {
    display: flex;
    margin-inline: auto;
  }
}
</style>
