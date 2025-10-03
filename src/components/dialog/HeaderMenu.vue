<template>
  <div>
    User Information:
  </div>
  <div class="s m l info-container" >
    <p>{{ userInfo.userInfo.firstName }} {{ userInfo.userInfo.lastName }} ({{  userInfo.userInfo.email ?? userInfo.userInfo.mail  }})</p>
    <p>{{ userInfo.userInfo.organizationId }}</p>
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

const router: Router = useRouter()
const authStore = useAuthStore()
const userInfo = useUserInfoStore()
const satStore = useSatelliteStore()

const logout = (): void => {
  authStore.clearToken()
  userInfo.clearUserInfo()
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