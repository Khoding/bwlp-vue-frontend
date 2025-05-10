export type SatelliteServer = {
    name?: string
    addresses: Array<string>
    certHash?: string
}

export function getSatellitesFromLocalStorage(satelliteString: string): Array<SatelliteServer> {
    return JSON.parse(satelliteString)
}