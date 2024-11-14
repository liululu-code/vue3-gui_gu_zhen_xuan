import request from '@/utils/request'

import type
{
    LoginFormData,
    LoginResponseData,
    UserInfoResponseData,
    LogoutResponseData,
} from './type'



enum API {
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout'
}

export function reqLogin(data: LoginFormData) {
    return request.post<any, LoginResponseData>(API.LOGIN_URL, data)
}

export function reqUserInfo() {
    return request.get<any, UserInfoResponseData>(API.USERINFO_URL)
}

export function reqLogout() {
    return request.post<any, LogoutResponseData>(API.LOGOUT_URL)
}