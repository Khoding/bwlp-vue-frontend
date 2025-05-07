export type SatelliteSever = {
    name?: string
    addresses: Array<string>
    certHash?: string
}

export function getSatellitesFromLocalStorage(satelliteString: string): Array<SatelliteSever> {
    return JSON.parse(satelliteString)
}