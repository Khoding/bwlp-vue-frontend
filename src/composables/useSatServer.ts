import { getCurrentInstance } from 'vue';

import { Thrift } from '@/assets/js/thrift/thrift.js';
import { SatelliteServerClient } from '@/assets/js/bwlp/bwlp.js';
import { useSatelliteStore } from '@/stores/satellites';
import { SatelliteServer } from '@/satellites/satellite';

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
  const selected = JSON.parse(useSatelliteStore().selectedSatellite) as SatelliteServer

  //TODO: Find out which server to use in future
  return selected.addresses[0]
}