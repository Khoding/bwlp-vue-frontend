import { encode } from "punycode"

type AuthLogin = {
    Login: string,
    Password: string,
    Token: string
}

type AuthProps = {
    AuthServerBaseURL: string,
    AuthPath?: string,
    RedirectURL?: string,
    Token?: string,
}

export class Auth {
    private authServerBaseURL: string
    private authPath: string
    private token: string
    private redirectURL?: string
    private entityID: string

    constructor(authProps: AuthProps) {
        this.authServerBaseURL = authProps.AuthServerBaseURL
        this.authPath = authProps.AuthPath
    }


    public setAuth(props: AuthProps) {
        this.authServerBaseURL = props.AuthServerBaseURL
        this.token = props.Token
    }

    public generateLoginURL(): string {
        const base = "https://" + this.authServerBaseURL
        const authPath = base + this.authPath

        if (!this.redirectURL) {
            throw new Error("No redirect given")
        }
        if (!this.entityID) {
            throw new Error("No entityId was given")
        }

        const entityIDEncoded = encodeURIComponent(this.entityID)
        const redirectEncoded = encodeURIComponent(this.redirectURL)

        const url =  authPath + `?entityID=${entityIDEncoded}&return=${redirectEncoded}`
        console.log("URL:::    ", url)
        return url
    }
    public setUserLogin() {}
    public setUserPw(pw:string) {}
    public setEntityId(entityID: string) {
        this.entityID = entityID
    }

    public setRedirectUrl(redirectURL: string) {
        this.redirectURL = redirectURL
    }

}