<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal">
      <h2>Bitte wählen Sie einen Server aus:</h2>
      <div class="custom-select">
        <div class="select-selected" @click="toggleDropdown">
          {{ selectedKey || 'Option auswählen' }}
        </div>
        <div class="select-items" :class="{ show: isDropdownOpen }">
          <div
            v-for="(value, key) in options"
            :value="value"
            :key="key"
            @click="selectOption(key, value)"
          >
            {{ key }}
          </div>
        </div>
      </div>
      <button @click="submitChoice">Server auswählen</button>
      <button @click="closeModal">Schließen</button>
      <div class="own-ip-address">
        <p>
          Wenn Sie eine andere IP-Adresse eintragen möchten klicken sie <span class="open-form"  @click="toggleForm"> hier </span>
        </p>
        <form @submit.prevent="saveCustomIpAddress()" v-if="showForm">
          <div class="field label round border">
            <input type="text" id="username" v-model="customIpAddress"  required/>
            <label>Eigene IP Adresse Verwenden</label>
          </div>
          <button type="submit">Eigene IP-Adresse eingeben</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SatelliteServer } from '@/satellites/satellite';
import { useSatelliteStore } from '@/stores/satellites';
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  options: Record<string, SatelliteServer> | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: "custom-ip-submit"): void
}>();

const satelliteStore = useSatelliteStore()

const isDropdownOpen = ref<boolean>(false);

const satelliteSelected =  ref<boolean>(false)

const selectedKey = ref<string | null>(null)

const customIpAddress = ref<string | null>(null)

const showForm = ref<boolean>(false)

function closeModal() {
  emit('close');
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectOption(key: string, satServer: SatelliteServer) {
  selectedKey.value = key
  isDropdownOpen.value = false;
  satelliteStore.setSelectedSatellite(satServer)
  satelliteSelected.value = true
}

function submitChoice() {
  emit("submit")
}

function toggleForm() {
  showForm.value = !showForm.value
}

function saveCustomIpAddress() {
  if (customIpAddress.value) {
    const sat : SatelliteServer = {
      name: "Customserver",
      addresses: [customIpAddress.value],
    }
    satelliteStore.setSelectedSatellite(sat)
    emit("custom-ip-submit")
  } else {
    //TODO: Raise some Error here
  }
}


</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: var(--surface);
}

.open-form {
  color: var(--primary);
  cursor: pointer;
  text-decoration: underline;
}

.modal {
  background-color: var(--surface-container-low);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.custom-select {
  position: relative;
  display: inline-block;
  background-color: var(--surface);
  width: 100%;
  margin: 10px 0;
}

.select-selected {
  background-color: var(--surface);
  border: 1px solid #ccc;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.select-selected:after {
  position: absolute;
  content: "";
  top: 14px;
  right: 10px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-color: #000 transparent transparent transparent;
}

.select-items {
  display: none;
  position: absolute;
  background-color: var(--surface);
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.select-items div {
  padding: 10px;
  cursor: pointer;
}

.select-items div:hover {
  background-color: var(--secondary-container);
}

.select-items.show {
  display: block;
}

.own-ip-address {
  margin-top: 5vh;
}

</style>
