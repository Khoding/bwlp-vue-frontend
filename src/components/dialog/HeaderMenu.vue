<template>
  <div>
    User Information:
  </div>
  <div v-if="userInfoStore.userInfo" class="s m l info-container" >
    <p>{{ userInfoStore.userInfo.firstName }} {{ userInfoStore.userInfo.lastName }} ({{  userInfoStore.userInfo.email ?? userInfoStore.userInfo.mail  }})</p>
    <p>{{ userInfoStore.userInfo.organizationId }}</p>
    <button
   @click="logout" data-ui="#user-info-dialog">
      <i>logout</i>
      Ausloggen
    </button>

  </div>
  
  <div>
    Ausgewählter Satellitenserver:
  </div>
  <div v-if="satStore.selectedSatellite" class="p-2 m-1 info-container">
  <p>{{ satStore.selectedSatellite.name ?? "Eigener Satellitenserver"}}</p>
  
  <ul v-for="serverAddress in satStore.selectedSatellite.addresses">
    {{ serverAddress }}
  </ul>
  <button @click="emit('openSatelliteModal')">
    <i>storage</i>
    Satellitenserver auswählen
  </button>
  </div>
</template>


<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { useSatelliteStore } from '@/stores/satellites';
import { useUserInfoStore } from '@/stores/userInfo';
import { useRouter, Router } from 'vue-router';

import {MasterServerClient} from '@/assets/js/bwlp/bwlp.js';
import {Thrift} from '@/assets/js/thrift/thrift.js';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';
import { LocalUserInfo, UserAuthInfo } from '@/auth/auth';

const router: Router = useRouter()
const authStore = useAuthStore()
const userInfoStore = useUserInfoStore()
const satStore = useSatelliteStore()

const mainServer = 'bwlp-masterserver.ruf.uni-freiburg.de';
const proto = new Thrift.Protocol(new Thrift.Transport(`https://${mainServer}/thrift/`))
const main = new MasterServerClient(proto)


const logout = async () => {
  await main.invalidateSession(authStore.authToken)
  authStore.clearToken()
  useUserInfoStore().clearUserInfo()
  satStore.clearSatellites()
  satStore.clearSelectedSatellite()
  router.push('/login')
};

const emit = defineEmits(['openSatelliteModal', 'closeMenu']);
</script>

<style scoped>
.info-container {
  background-color: var(--surface-container-low);
  padding: 1vh;
}
</style>