import type { GeneralResponseData } from "@/api/generalType";

export interface UserData {
    id?: number;
    name: string;
    username: string;
    password: string;
    phone?: string | null;
    roleName?: string;
    createTime?: string;
    updateTime?: string;
}

export interface RoleData {
    id: number,
    roleName: string,
    remark: null
}

export interface UserListResponseData extends GeneralResponseData {
    data: {
        records: UserData[],
        total: number,
    }

}

export interface OneUserRoleData {
    assignRoles: RoleData[],
    allRolesList: RoleData[],
}

export interface RoleListResponseData extends GeneralResponseData {
    data: OneUserRoleData,
}

export interface DoAssignRoleData {
    userId: number,
    roleIdList: number[]
}
