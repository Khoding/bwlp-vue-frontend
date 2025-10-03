<template>
  <div>
    User Information:
  </div>
  <div class="s m l info-container" >
    <p>{{ userInfo.userInfo.firstName }} {{ userInfo.userInfo.lastName }} ({{  userInfo.userInfo.email ?? userInfo.userInfo.mail  }})</p>
    <p>{{ userInfo.userInfo.organizationId }}</p>
    <button
   @click="logout">
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
  </div>
  <button @click="openSatelliteSelection">
    <i>storage</i>
    Satellitenserver auswählen
  </button>


  <SatelliteSelectionModal
        :isVisible="showModal"
        :options="options"
        @close="closeModal"
        @submit="submitChoice"
        @custom-ip-submit="submitCustomIp"
  />
</template>

<script setup lang="ts">
import { SatelliteServer } from '@/satellites/satellite';
import { useAuthStore } from '@/stores/auth-store';
import { useSatelliteStore } from '@/stores/satellites';
import { useUserInfoStore } from '@/stores/userInfo';
import { ref } from '@vue/runtime-core';
import { useRouter, Router } from 'vue-router';
import SatelliteSelectionModal from '../SatelliteSelectionModal.vue';

const router: Router = useRouter()
const authStore = useAuthStore()
const userInfo = useUserInfoStore()
const satStore = useSatelliteStore()


let showModal = ref<boolean>(false)
let options = ref<Record<string, SatelliteServer> | null>(null)


const logout = (): void => {
  authStore.clearToken()
  userInfo.clearUserInfo()
  satStore.clearSatellites()
  satStore.clearSelectedSatellite()
  router.push('/login')
};


function submitChoice() {
  showModal.value = false
  router.push("/login")
}

function closeModal() {
  showModal.value = false
}

function submitCustomIp() {
  showModal.value = false
  router.go(0)
}

function openSatelliteSelection() {
  if (!options) {
    options.value = createOptions(satStore.satellites)
    showModal.value = true
  }
  showModal.value = true
  options.value = createOptions(satStore.satellites)
}

function createOptions(satellites: SatelliteServer[]): Record<string, SatelliteServer> {
  let sats: Record<string, SatelliteServer> = {}
  satellites.forEach((sat) => {
    sats[sat.name] = sat
  })
  return sats
}

</script>

<style scoped>
.info-container {
  background-color: var(--surface-container-low);
  padding: 1vh;
}
</style>