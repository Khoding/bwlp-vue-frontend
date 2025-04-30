
type AuthSettings = {
    MasterServerURL: string,
    Params: Map<string, string>
}

type Auth = {
    Username: string,
    Role:  string,
    Token: string,
}

export function generateLoginURL(settings: AuthSettings): string {
    return settings.MasterServerURL + "?" + getUrlParamsString(settings.Params)
}

export function getTokenFromUrl(url: string): string { 
    let keyVals = new Map<string, string>()
    const urlSplit = url.split("#")
    if (urlSplit.length == 2) {
        const params = urlSplit[1].split("&")
        
        params.forEach((keyValString) => {
            const splitted = keyValString.split("=")
            keyVals.set(splitted[0], splitted[1])
        })
    }
    return keyVals["token"]
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

