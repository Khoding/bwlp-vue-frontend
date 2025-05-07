import {defineStore} from 'pinia';
import {ref} from '@vue/runtime-core';
import { SatelliteSever } from '@/satellites/satellite';

export const useSatelliteStore = defineStore('satellites', () => {
  const satellites = ref(localStorage.getItem('satellites') || '');

  function setSatellites(satellites: Array<SatelliteSever>) {
    localStorage.setItem("satelliteServers",JSON.stringify(satellites))
  }

  function clearSatellites() {
    satellites.value = '';
    localStorage.removeItem('satellites');
  }

  return {satellites, setSatellites, clearSatellites};
});
