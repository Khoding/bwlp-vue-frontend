<template>
  <header>
    <nav>
      <MobileNavigation v-if="authStore.authToken" />

      <h5 class="l max center-align">Baden-Württemberg Lehrpool</h5>
      <div class="m max center-align"></div>
      <nav class="s max center-align">
        <img class="small" src="@/assets/img/bwLogo/bwLehrpool_small.png" alt="BWLP Logo" />
        <h5>BW Lehrpool</h5>
      </nav>
      <button data-ui="#theme-dialog" class="circle transparent">
        <i>palette</i>
      </button>

      <button class="m l border secondary-border secondary-text">
        <span>Menu</span>
        <i>arrow_drop_down</i>
        <menu class="border">
          <li v-if="authStore.authToken">
            <a href="#" @click.prevent="logout"> Logout </a><
          </li>
          <li v-if="authStore.authToken">
            <a @click="openSatelliteSelection"> Satellitenserver auswählen </a>
          </li>
        </menu>
      </button>
    <button v-if="authStore.authToken" data-ui="#user-info-dialog" class="button transparent">
      <i>account_box</i>
    </button>
    </nav>
  </header>

  <dialog id="theme-dialog" class="medium right">
    <header class="fixed">
      <nav>
        <h5 class="max">Themes</h5>
        <button class="transparent circle small" data-ui="#theme-dialog">
          <i>close</i>
        </button>
      </nav>
    </header>

    <ThemeSwitcher />
  
  </dialog>
    <dialog id="user-info-dialog" class="medium right">
    <header class="fixed">
      <nav>
        <h5 class="max">Informationen</h5>
        <button class="transparent circle small" data-ui="#user-info-dialog">
          <i>close</i>
        </button>
        
      </nav>
    </header>

    <Menu />
  </dialog>

  <SatelliteSelectionModal
        :isVisible="showModal"
        :options="options"
        @close="closeModal"
        @submit="submitChoice"
        @custom-ip-submit="submitCustomIp"
  />
</template>

<script setup lang="ts">
import {useRouter, Router} from 'vue-router';
import {useAuthStore} from '@/stores/auth-store';

import MobileNavigation from '@/components/navigation/MobileNavigation.vue';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher.vue';
import { useSatelliteStore } from '@/stores/satellites';
import SatelliteSelectionModal from './SatelliteSelectionModal.vue';
import { ref } from '@vue/runtime-core';
import { SatelliteServer } from '@/satellites/satellite';
import Menu from './dialog/Menu.vue';

const router: Router = useRouter();
const authStore = useAuthStore();
const satelliteStore = useSatelliteStore();

let showModal = ref<boolean>(false)
let options = ref<Record<string, SatelliteServer> | null>(null)

const logout = (): void => {
  authStore.clearToken();
  router.push('/login');
};
  
function openSatelliteSelection() {
  if (!options) {
    options.value = createOptions(satelliteStore.satellites)
    showModal.value = true
  }
  showModal.value = true
  options.value = createOptions(satelliteStore.satellites)
}

function createOptions(satellites: SatelliteServer[]): Record<string, SatelliteServer> {
  let sats: Record<string, SatelliteServer> = {}
  satellites.forEach((sat) => {
    sats[sat.name] = sat
  })
  return sats
}

function submitChoice() {
  showModal.value = false
  window.location.replace("/login")
}

function closeModal() {
  showModal.value = false
}

function submitCustomIp() {
  showModal.value = false
  router.go(0)
}

</script>
