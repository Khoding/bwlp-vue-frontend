import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SatelliteServer } from '@/satellites/satellite';

export const useSatelliteStore = defineStore('satellites', () => {
  const satellites = ref<SatelliteServer[]>(JSON.parse(localStorage.getItem('satellitesServer') || '[]'));
  const selectedSatellite = ref<SatelliteServer | null>(JSON.parse(localStorage.getItem("selectedSatelliteServer") || 'null'));

  function setSatellites(satellitesArray: Array<SatelliteServer>) {
    satellites.value = satellitesArray;
    localStorage.setItem("satellitesServer", JSON.stringify(satellitesArray));
  }

  function clearSatellites() {
    satellites.value = [];
    localStorage.removeItem('satellitesServer');
  }

  function setSelectedSatellite(satellite: SatelliteServer) {
    selectedSatellite.value = satellite;
    localStorage.setItem("selectedSatelliteServer", JSON.stringify(satellite));
  }

  function clearSelectedSatellite() {
    selectedSatellite.value = null;
    localStorage.removeItem('selectedSatelliteServer');
  }

  return { satellites, selectedSatellite, setSatellites, clearSatellites, setSelectedSatellite, clearSelectedSatellite };
});
