import { SatelliteSever } from "@/satellites/satellite";

type AuthSettings = {
    MasterServerURL: string,
    Params: Map<string, string>
}

type UserAuthInfo = {
    status: "ok" | "error"
    firstname: string,
    lastname: string,
    email: string,
    userId: string,
    organizationId: string,
    satellites2: Array<SatelliteSever>;
    token: string,
    sessionId: string
}

export function generateLoginURL(settings: AuthSettings): string {
    return settings.MasterServerURL + "?" + getUrlParamsString(settings.Params)
}

export function getTokenFromUrl(url: string): string | null { 
    let keyVals = new Map<string, string>()
    const urlSplit = url.split("#")
    if (urlSplit.length == 2) {
        const params = urlSplit[1].split("&")
        params.forEach((keyValString) => {
            const splitted = keyValString.split("=")
            keyVals.set(splitted[0], splitted[1])
        })
        return keyVals.get("token")
    }
    else return null
}

function getUrlParamsString(params: Map<string, string>): string {
    let paramsString = ""
    params.forEach((value, key) => {
        const keyEncoded = encodeURI(key)
        const valEncoded = encodeURI(value)
        paramsString += keyEncoded + "=" + valEncoded + "&"
    })
    return paramsString.slice(0, -1)
}

export function getJsonFromURLParams(url: string): UserAuthInfo | null {
    const urlRegexPattern = RegExp("[#|?]")
    if (!url.match(urlRegexPattern)) {
        return null
    }
    let paramMap = new Map<string, string>()
    const urlParams = url.split(urlRegexPattern)[1].split("&")
    urlParams.forEach((keyValString) => {
        const keyValSplit = keyValString.split("=")
        const key = decodeURI(keyValSplit[0])
        const val = decodeURI(keyValSplit[1])
        paramMap.set(key, val)
    })

    if (!paramMap.has("data"))  {
        return null
    }
    const userAuthInfo = JSON.parse(paramMap.get("data")) as UserAuthInfo
    return userAuthInfo
}
