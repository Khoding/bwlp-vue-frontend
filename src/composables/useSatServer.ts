import {getCurrentInstance} from 'vue';

import {Thrift} from '@/assets/js/thrift/thrift.js';
import {SatelliteServerClient} from '@/assets/js/bwlp/bwlp.js';
import {useSatelliteStore} from '@/stores/satellites'
import { SatelliteServer } from '@/satellites/satellite';

export function useSatServer(): SatelliteServerClient {
  const app = getCurrentInstance()
  const serverAddress = getFirstSatelliteServerURL()
  if (!serverAddress) {
    return null
  }
  const proto = new Thrift.Protocol(new Thrift.Transport(`https://${serverAddress}/thrift/`))
  const satServerClient =  new SatelliteServerClient(proto)
  return satServerClient

}


export function useSatServerOSVDI() {
  const app = getCurrentInstance();
  const serverAddress = getFirstSatelliteServerURL()
  if (!serverAddress) {
    return null
  }
  return `dndb3://${serverAddress}/`;
}

function getFirstSatelliteServerURL(): string | null {
  const satServers = useSatelliteStore()
  if (satServers.satellites !== '') {
    const serverObj = JSON.parse(satServers.satellites) as Array<SatelliteServer>
    if (serverObj.length > 0) {
      // get first satServer
      const serverAddress = serverObj[1].addresses[0]
      return serverAddress
    }
  }
  return null
}