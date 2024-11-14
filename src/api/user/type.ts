
export interface LoginFormData {
    username: string,
    password: string
}

type ResponseData= {
    code: number,
    message: string
    ok: boolean
}



export interface LoginResponseData extends ResponseData{
    data: string
}



export interface UserInfoResponseData extends ResponseData {
    data: {
        routes: string[],
        buttons: string[],
        roles: string[],
        name: string,
        avatar: string
    }
}

export interface LogoutResponseData extends ResponseData {
    data: any
}
