export type SatelliteServer = {
    name?: string
    addresses: Array<string>
    certHash?: string
}

export type LocalLoginSatellites = {
    addressList: Array<string>
    certSha256: string
    displayName: string
}

export function getSatellitesFromLocalTestResponse(sats : Array<LocalLoginSatellites>): Array<SatelliteServer> {
    let result: Array<SatelliteServer> = []
    sats.forEach(sat => {
        result.push({
            name: sat.displayName,
            addresses: sat.addressList,
            certHash: sat.certSha256
        })
    })
    return result
} 


export function getSatellitesFromLocalStorage(satelliteString: string): Array<SatelliteServer> {
    return JSON.parse(satelliteString)
}