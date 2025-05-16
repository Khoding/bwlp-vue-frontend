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
            v-for="(value, key) in keyValuePairs"
            :key="key"
            @click="selectOption(key)"
          >
            {{ key }} - {{ value }}
          </div>
        </div>
      </div>
      <button @click="submitChoice">Server auswählen</button>
      <button @click="closeModal">Schließen</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SatelliteServer } from '@/satellites/satellite';
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps<{
  isVisible: boolean;
  keyValuePairs: Record<string, SatelliteServer>;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'selected', key: string): void;
  (e: 'choiceSumbit'): void;
}>();

const selectedKey = ref<string>('');
const isDropdownOpen = ref<boolean>(false);

function closeModal() {
  emit('close');
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectOption(key: string) {
  selectedKey.value = key;
  isDropdownOpen.value = false;
  emitSelection();
}

function emitSelection() {
  emit('selected', selectedKey.value);
}

function submitChoice() {
  emit('choiceSumbit');
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

</style>
