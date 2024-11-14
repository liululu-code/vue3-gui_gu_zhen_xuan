import type { GeneralResponseData } from "@/api/generalType";

// export interface RoleData {
//     id?: number;
//     name: string;
//     rolename: string;
//     password: string;
//     phone?: string | null;
//     roleName?: string;
//     createTime?: string;
//     updateTime?: string;
// }

export interface RoleData {
    id?: number,
    roleName: string,
    remark: null
}

export interface RoleListResponseData extends GeneralResponseData {
    data: {
        records: RoleData[],
        total: number,
    }

}

// export interface OneRoleRoleData {
//     assignRoles: RoleData[],
//     allRolesList: RoleData[],
// }

// export interface RoleListResponseData extends GeneralResponseData {
//     data: OneRoleRoleData,
// }

export interface DoAssignRoleData {
    roleId: number,
    roleIdList: number[]
}

export interface PermissionData {
    roleId: number,
    roleIdList: number[]
}

export interface PermissionListData {
    id?: number;                      // 假设ID是一个数字类型
    // createTime: string;              // 假设时间是以字符串形式的日期时间
    // updateTime: string;              // 同样假设为字符串形式的日期时间
    pid: number;                     // 假设父ID是一个数字类型
    name: string;                    // 假设名称是一个字符串类型
    code?: string ;             // 假设代码可以为字符串或者 null
    // toCode: string | null;           // 同样假设可以为字符串或者 null
    type?: number;                    // 假设类型是一个数字类型
    // status: number | null;           // 假设状态可以为数字或者 null
    level: number;                   // 假设级别是一个数字类型
    select?: boolean;
    children?: PermissionListData[];  // 假设子节点是 PermissionListData 类型的数组

}

export interface PermissionListResponseData extends GeneralResponseData{
    data: PermissionListData[]
}
