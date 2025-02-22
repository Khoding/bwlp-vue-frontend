"use-strict"

type AuthProps = {
    AuthServerBaseURL?: string,
    AuthPath?: string,
    RedirectURL?: string,
    Token?: string,
}

export class Auth {
    private authServerBaseURL: string
    private authPath: string
    private redirectURL: string
    private entityID: string
    private token: string

    constructor(authProps: AuthProps) {
        this.authServerBaseURL = authProps.AuthServerBaseURL ?? ""
        this.authPath = authProps.AuthPath ?? ""
        this.redirectURL = authProps.RedirectURL ?? ""
        this.token = authProps.Token ?? ""
    }


    public setAuth(props: AuthProps) {
        this.authServerBaseURL = props.AuthServerBaseURL
    }

    public generateLoginURL(): string {

        if (!this.redirectURL || this.redirectURL === "") {
            throw new Error("No redirect given")
        }
        if (!this.entityID || this.entityID === "") {
            throw new Error("No entityId was given")
        }
        if (!this.authServerBaseURL || this.authServerBaseURL === "") {
            throw new Error("No base url for auth was set")
        }
        if (!this.authPath || this.authPath === "") {
            throw new Error("No url path to auth was set")
        }

        const base = "https://" + this.authServerBaseURL
        const authPath = base + this.authPath

        

        const entityIDEncoded = encodeURIComponent(this.entityID)
        const redirectEncoded = encodeURIComponent(this.redirectURL)

        const url =  authPath + `?entityID=${entityIDEncoded}&return=${redirectEncoded}`
        return url
    }
    public setEntityId(entityID: string) {
        this.entityID = entityID
    }

    public setRedirectUrl(redirectURL: string) {
        this.redirectURL = redirectURL
    }

}