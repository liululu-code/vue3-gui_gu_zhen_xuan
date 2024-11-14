
import request from "@/utils/request";

import type {
    // RoleData,
    // RoleListResponseData,
    // PermissionListResponseData,
} from './type'

import type {
    PermissionListResponseData,
    PermissionListData,
} from '@/api/acl/role/type'

enum API {
    // ROLE_LIST_URL = '/admin/acl/role',
    // UPDATE_ROLE_URL = '/admin/acl/role/update',
    // SAVE_ROLE_URL = '/admin/acl/role/save',
    // DELETE_ROLE_URL = '/admin/acl/role/remove',
    // ASSIGN_PERMISSION_URL = '/admin/acl/permission/toAssign',
    // DO_ASSIGN_PERMISSION_URL = '/admin/acl/permission/doAssign'
    ALL_PERMISSION_URL = '/admin/acl/permission',
    SAVE_MENU_URL = 'admin/acl/permission/save',
    UPDATE_MENU_URL = 'admin/acl/permission/update',
    DELETE_MENU_URL = 'admin/acl/permission/remove',
}

export function reqAllPermission() {
    return request.get<any, PermissionListResponseData>(API.ALL_PERMISSION_URL)
}

export function reqUpdateMenu(permissionList: PermissionListData) {
    return request.put<any, any>(API.UPDATE_MENU_URL, permissionList)
}
export function reqSaveMenu(permissionList: PermissionListData) {
    return request.post<any, any>(API.SAVE_MENU_URL, permissionList)
}
export function reqDeleteRole(menuId: number) {
    return request.delete<any, any>(API.DELETE_MENU_URL + `/${menuId}` )
}






