import request from "@/utils/request";

import type {
    UserData,
    UserListResponseData,
    RoleListResponseData,
    DoAssignRoleData,
} from './type'

enum API {
    USER_LIST_URL = '/admin/acl/user',
    UPDATE_USER_URL = '/admin/acl/user/update',
    SAVE_USER_URL = '/admin/acl/user/save',
    DELETE_USER_URL = '/admin/acl/user/remove',
    BATCH_DELETE_USER_URL = '/admin/acl/user/batchRemove',
    ASSIGN_ROLE_URL = '/admin/acl/user/toAssign',
    DO_ASSIGN_ROLE_URL = '/admin/acl/user/doAssignRole'
}


export function reqUserList(currentPage: number, pageSize: number, searchKeyWord: string='') {
    if (searchKeyWord) {
        return request.get<any, UserListResponseData>(API.USER_LIST_URL + `/${currentPage}` + `/${pageSize}` + `/?username=${searchKeyWord}` )
    } else {
        return request.get<any, UserListResponseData>(API.USER_LIST_URL + `/${currentPage}` + `/${pageSize}`)
    }
}
export function reqUpdateUser(userInfo: UserData) {
    return request.put<any, any>(API.UPDATE_USER_URL, userInfo)
}
export function reqSaveUser(userInfo: UserData) {
    return request.post<any, any>(API.SAVE_USER_URL, userInfo)
}
export function reqDeleteUser(userId: number) {
    return request.delete<any, any>(API.DELETE_USER_URL + `/${userId}` )
}
export function reqBatchDeleteUser(userIdList: number[]) {
    return request.delete<any, any>(API.BATCH_DELETE_USER_URL, { data: userIdList } )
}
export function reqAssignRoleList(userId: number) {
    return request.get<any, RoleListResponseData>(API.ASSIGN_ROLE_URL + `/${userId}`)
}
export function reqDoAssignRole(doAssignRoleObj: DoAssignRoleData) {
    return request.post<any, RoleListResponseData>(API.DO_ASSIGN_ROLE_URL,  doAssignRoleObj)
}
