import {defineStore} from 'pinia';
import {ref} from '@vue/runtime-core';
import { SatelliteServer } from '@/satellites/satellite';

export const useSatelliteStore = defineStore('satellites', () => {
  const satellites = ref(localStorage.getItem('satellitesServer') || '');
  const selectedSatellite = ref(localStorage.getItem("selectedSatelliteServer") || '')

  function setSatellites(satellites: Array<SatelliteServer>) {
    localStorage.setItem("satellitesServer", JSON.stringify(satellites))
  }

  function clearSatellites() {
    satellites.value = '';
    localStorage.removeItem('satellitesServer');
  }

  function setSelectedSatellite(satellite: SatelliteServer) {
    localStorage.setItem("selectedSatelliteServer", JSON.stringify(satellite))
  }

  return {satellites, selectedSatellite, setSatellites, clearSatellites, setSelectedSatellite};
});
