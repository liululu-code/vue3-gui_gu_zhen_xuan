
import request from "@/utils/request";

import type {
    RoleData,
    RoleListResponseData,
    PermissionListResponseData,
} from './type'

enum API {
    ROLE_LIST_URL = '/admin/acl/role',
    UPDATE_ROLE_URL = '/admin/acl/role/update',
    SAVE_ROLE_URL = '/admin/acl/role/save',
    DELETE_ROLE_URL = '/admin/acl/role/remove',
    ASSIGN_PERMISSION_URL = '/admin/acl/permission/toAssign',
    DO_ASSIGN_PERMISSION_URL = '/admin/acl/permission/doAssign'
}


export function reqRoleList(currentPage: number, pageSize: number, searchKeyWord: string = '') {
    if (searchKeyWord) {
        return request.get<any, RoleListResponseData>(API.ROLE_LIST_URL + `/${currentPage}` + `/${pageSize}` + `/?roleName=${searchKeyWord}`)
    } else {
        return request.get<any, RoleListResponseData>(API.ROLE_LIST_URL + `/${currentPage}` + `/${pageSize}`)
    }
}
export function reqUpdateRole(roleInfo: RoleData) {
    return request.put<any, any>(API.UPDATE_ROLE_URL, roleInfo)
}
export function reqSaveRole(roleInfo: RoleData) {
    return request.post<any, any>(API.SAVE_ROLE_URL, roleInfo)
}
export function reqDeleteRole(roleId: number) {
    return request.delete<any, any>(API.DELETE_ROLE_URL + `/${roleId}` )
}

export function reqAssignRoleList(roleId: number) {
    return request.get<any, PermissionListResponseData>(API.ASSIGN_PERMISSION_URL + `/${roleId}`)
}
export function reqDoAssignRole(roleId: number, permissionId: number[]) {
    return request.post<any, any>(API.DO_ASSIGN_PERMISSION_URL + `/?roleId=${roleId}` + `&permissionId=${permissionId}`)
}

