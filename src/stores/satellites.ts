import {defineStore} from 'pinia';
import {ref} from '@vue/runtime-core';
import { SatelliteServer } from '@/satellites/satellite';

export const useSatelliteStore = defineStore('satellites', () => {
  const satellites = ref(localStorage.getItem('satellitesServer') || '');

  function setSatellites(satellites: Array<SatelliteServer>) {
    localStorage.setItem("satellitesServer", JSON.stringify(satellites))
  }

  function clearSatellites() {
    satellites.value = '';
    localStorage.removeItem('satellitesServer');
  }

  return {satellites, setSatellites, clearSatellites};
});
