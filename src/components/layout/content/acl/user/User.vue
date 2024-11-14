<template>
    <el-card>
        <div class="container">
            <div>
                <span>用户名: </span>
                <el-input v-model="searchKeyWord" clearable @keyup.enter="searchUser" placeholder="请输入搜索用户名"
                    style="display: inline;"></el-input>
            </div>
            <div>
                <el-button type="primary" @click="searchUser">搜索</el-button>
                <el-button type="primary" @click="resetSearch">重置</el-button>
            </div>
        </div>
    </el-card>
    <el-card style="margin-top: 10px;">
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button type="danger" @click="batchDeleteUser">批量删除</el-button>
        <el-table :data="userTableData" :border="true" :show-overflow-tooltip="true"
            @selection-change="handleSelectionChange" style="margin-top: 10px;">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="用户名字" prop="username"></el-table-column>
            <el-table-column label="用户名称" prop="name"></el-table-column>
            <el-table-column label="用户角色" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="270px">
                <template #default="scope">
                    <el-button @click="assignRole(scope.row)" size="small" icon="User">分配角色</el-button>
                    <el-button @click="editUser(scope.row)" size="small" type="primary" icon="Edit">编辑</el-button>
                    <el-button @click="deleteUser(scope.row)" size="small" type="danger" icon="Delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizeList"
            :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="totalData"
            style="margin-top: 10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>


    <!-- edit or add drawer -->
    <el-drawer v-model="isShowDrawer" direction="rtl" title="更新用户" @closed="drawerClosed">
        <template #default>
            <el-form :model="userInfo" :rules="rules" ref="updateOrAddUserForm">
                <el-form-item label="用户姓名" prop="name">
                    <el-input v-model="userInfo.name" placeholder="请输入用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="username">
                    <el-input v-model="userInfo.username" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item v-if="!userInfo.id" label="用户密码" prop="password">
                    <el-input v-model="userInfo.password" placeholder="请输入用户密码"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>

    <!-- assign role drawer -->
    <el-drawer v-model="isShowAssignRoleDrawer" direction="rtl" title="分配角色" @closed="assignRoleDrawerClosed">
        <template #default>
            <el-form :model="userInfo" :rules="rules" ref="updateOrAddUserForm">
                <el-form-item label="用户姓名">
                    <el-input :placeholder="assignRoleUserName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox v-model="isRoleCheckAll" :indeterminate="isRoleCheckboxIndeterminate"
                        @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="oneUserRole.assignRoles" @change="handleCheckedRoleChange">
                        <el-checkbox v-for="role in oneUserRole.allRolesList" :key="role.id" :value="role">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="assignRoleDrawerCancelClick">取消</el-button>
                <el-button type="primary" @click="assignRoleDrawerConfirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, useTemplateRef, computed } from 'vue'
import {
    reqUserList, reqUpdateUser, reqSaveUser, reqDeleteUser,
    reqBatchDeleteUser, reqAssignRoleList, reqDoAssignRole,
} from '@/api/acl/user/index'
import { reqAndMessage } from '@/utils/commonFunction'

import type { UserData, OneUserRoleData } from '@/api/acl/user/type'
import type { FormRules, FormInstance } from 'element-plus'

//pagination variable
const currentPage = ref(1)
const pageSize = ref(3)
const pageSizeList = ref([3, 5, 10, 15])
const totalData = ref(0)
//edit or add drawer
const isShowDrawer = ref(false)
const updateOrAddUserFormRef = useTemplateRef<FormInstance>('updateOrAddUserForm')
const userInfo = ref<UserData>({
    id: undefined,
    name: '',
    username: '',
    password: '',
})
//show card
const userTableData = ref<UserData[]>([])
// batch delete
const batchDeleteIdList = ref<number[]>([])
//assign role drawer
const oneUserRole = ref<OneUserRoleData>({
    assignRoles: [],
    allRolesList: [],
})
const isShowAssignRoleDrawer = ref(false)
const assignRoleUserName = ref('')
const assignRoleUserId = ref(-1)
const isRoleCheckAll = ref(false)
const isRoleCheckboxIndeterminate = ref(false)
const checkedRoleIdList = ref<number[]>([])
//search
const searchKeyWord = ref('')

const allRoleIdList = computed(() => {
    return oneUserRole.value.allRolesList.map((item) => {
        return item.id
    })
})


const rules = reactive<FormRules<UserData>>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'change' },
        { min: 5, max: 20, message: 'Length should bigger than 5', trigger: 'change' },
    ],
    username: [
        { required: true, message: 'Please input Activity name', trigger: 'change' },
        { min: 5, max: 20, message: 'Length should bigger than 5', trigger: 'change' },
    ],
    password: [
        { required: true, message: 'Please input Activity name', trigger: 'change' },
        { min: 5, max: 20, message: 'Length should bigger than 5', trigger: 'change' },
    ],
})

function clearAssignDrawerData() {
    oneUserRole.value = {
        assignRoles: [],
        allRolesList: [],
    }
    assignRoleUserName.value = ''
}

const handleSelectionChange = (val: UserData[]) => {
    batchDeleteIdList.value = val.map((item) => {
        return item.id as number
    })
}

function clearUserInfo() {
    userInfo.value = {
        id: undefined,
        name: '',
        username: '',
        password: '',
    }
}

function updateShowCard() {
    getUserList()
}

onMounted(() => {
    updateShowCard()
})


function handleCurrentChange() {
    updateShowCard()
}

function handleSizeChange() {
    currentPage.value = 1
    updateShowCard()
}

function openDrawer() {
    isShowDrawer.value = true
}
function closeDrawer() {
    isShowDrawer.value = false
}
function openAssignRoleDrawer() {
    isShowAssignRoleDrawer.value = true
}
function closeAssignRoleDrawer() {
    isShowAssignRoleDrawer.value = false
}

async function getUserList() {
    const result = await reqUserList(currentPage.value, pageSize.value, searchKeyWord.value)
    if (result.code === 200) {
        userTableData.value = result.data.records
        totalData.value = result.data.total
    }
}

function searchUser() {
    getUserList()
}
function resetSearch() {
    searchKeyWord.value = ''
    getUserList()
}

const handleCheckAllChange = (val: boolean) => {
    console.log(val);

    isRoleCheckboxIndeterminate.value = false
    checkedRoleIdList.value = val ? allRoleIdList.value : []
}
const handleCheckedRoleChange = (value: string[]) => {
    const checkedCount = value.length
    isRoleCheckAll.value = checkedCount === oneUserRole.value.allRolesList.length
    isRoleCheckboxIndeterminate.value = checkedCount > 0 && checkedCount < oneUserRole.value.allRolesList.length
}


function addUser() {
    openDrawer()
}

function editUser(row: UserData) {
    Object.assign(userInfo.value, row)
    openDrawer()
}
async function assignRole(row: UserData) {
    const result = await reqAssignRoleList(row.id as number)
    if (result.code === 200) {
        oneUserRole.value.assignRoles = result.data.assignRoles
        oneUserRole.value.allRolesList = result.data.allRolesList
    }
    assignRoleUserName.value = row.name
    assignRoleUserId.value = row.id as number
    openAssignRoleDrawer()
}

async function batchDeleteUser() {
    reqAndMessage(await reqBatchDeleteUser(batchDeleteIdList.value as number[]), '删除用户')
    updateShowCard()
}

async function deleteUser(row: UserData) {
    reqAndMessage(await reqDeleteUser(row.id as number), '删除用户')
    updateShowCard()
}

function drawerClosed() {
    clearUserInfo()
    resetForm()
}

function cancelClick() {
    closeDrawer()
}

const resetForm = () => {
    if (!updateOrAddUserFormRef.value) return
    updateOrAddUserFormRef.value.resetFields()
}

async function confirmClick() {
    if (!updateOrAddUserFormRef.value) {
        return
    }
    updateOrAddUserFormRef.value.validate(async (valid) => {
        if (valid) {
            if (userInfo.value.id) {
                reqAndMessage(await reqUpdateUser(userInfo.value), '更新用户')
            } else {
                reqAndMessage(await reqSaveUser(userInfo.value), '添加用户')
            }
        } else {
            console.log('表单验证未通过!')
        }
    })
    closeDrawer()
    updateShowCard()
}


function assignRoleDrawerClosed() {
    clearAssignDrawerData()
}

function assignRoleDrawerCancelClick() {
    closeAssignRoleDrawer()
}


async function assignRoleDrawerConfirmClick() {
    checkedRoleIdList.value = oneUserRole.value.assignRoles.map((item) => {
        return item.id
    })
    reqAndMessage(await reqDoAssignRole({
        userId: assignRoleUserId.value,
        roleIdList: checkedRoleIdList.value,
    }), '分配角色')
    closeAssignRoleDrawer()
    updateShowCard()
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>