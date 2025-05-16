import { computed, getCurrentInstance } from 'vue';

import { SatelliteServerClient } from '@/assets/js/bwlp/bwlp.js';
import { Thrift } from '@/assets/js/thrift/thrift.js';
import { useSatelliteStore } from '@/stores/satellites';

export function useSatServer(): SatelliteServerClient {
  const app = getCurrentInstance()
  const serverAddress = getSelectedSatelliteAddress()
  if (!serverAddress) {
    return null
  }
  const proto = new Thrift.Protocol(new Thrift.Transport(`https://${serverAddress}/thrift/`))
  const satServerClient =  new SatelliteServerClient(proto)
  return satServerClient
}


export function useSatServerOSVDI() {
  const app = getCurrentInstance();
  const serverAddress = getSelectedSatelliteAddress()
  if (!serverAddress) {
    return null
  }
  return `dndb3://${serverAddress}/`;
}

function getSelectedSatelliteAddress(): string | undefined {
  const selected = computed(() => useSatelliteStore().selectedSatellite).value;

  //TODO: Find out which server to use in future
  return selected.addresses[0]
}