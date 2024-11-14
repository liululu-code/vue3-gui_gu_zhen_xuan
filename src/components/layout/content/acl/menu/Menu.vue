<template>
    <el-table :data="tableData" style="width: 100%" row-key="id" border>
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="code" label="权限值" />
        <el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip />
        <el-table-column label="操作" width="220px">
            <template #default="scope">
                <el-button @click="addMenu(scope.row)" v-show="scope.row.level < 4" size="small">{{scope.row.level === 3 ? '添加功能' : '添加菜单'}}</el-button>
                <el-button @click="editMenu(scope.row)" v-show="scope.row.level > 1" type="primary" size="small">编辑</el-button>
                <el-button @click="deleteMenu(scope.row)" v-show="scope.row.level > 1" type="danger" size="small">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- edit or add dialog -->
    <el-dialog v-model="isShowDialog" title="添加菜单" @closed="dialogClosed">
        <template #default>
            <el-form :model="menuData" ref="updateOrAddRoleForm">
                <el-form-item label="名称">
                    <el-input v-model="menuData.name" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-input v-model="menuData.code" placeholder="请输入权限数值"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="dialogCancelClick">取消</el-button>
                <el-button type="primary" @click="dialogConfirmClick">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    reqAllPermission,
    reqUpdateMenu, reqSaveMenu, 
    reqDeleteRole
} from '@/api/acl/menu/index'
import { reqAndMessage } from '@/utils/commonFunction'
import { ElMessage } from 'element-plus'
import type { PermissionListData } from '@/api/acl/role/type'
// import { ElTree } from 'element-plus'

const tableData = ref<PermissionListData[]>([])



//edit or add dialog
const isShowDialog = ref(false)
const menuData = ref<PermissionListData>({
    pid: -1,
    level: -1,
    name: '',
    code: '',
})


async function updateView() {
    const result = await reqAllPermission()
    if (result.code === 200) {
        tableData.value = result.data
    } else {
        ElMessage('请求权限数据错误')
    }
}

onMounted(() => {
    updateView()
})

function addMenu(row: PermissionListData) {
    menuData.value.pid = row.id as number
    menuData.value.level = row.level + 1

    console.log('row: ', row);
    console.log('menuData: ', menuData.value);
    
    openDialog()
}
function editMenu(row: PermissionListData) {
    Object.assign(menuData.value, row)
    openDialog()
}
async function deleteMenu(row: PermissionListData) {
    reqAndMessage(await reqDeleteRole(row.id as number), '删除菜单')
    updateView()
}


//dialog
function closeDialog() {
    isShowDialog.value = false
}
function openDialog() {
    isShowDialog.value = true
}

function clearDialogData() {
    menuData.value = {
        pid: -1,
        level: -1,
        name: '',
        code: '',
    }
}

function dialogClosed() {
    clearDialogData()
}

function dialogCancelClick() {
    closeDialog()
}

async function dialogConfirmClick() {
    if (menuData.value.id) {
        reqAndMessage(await reqUpdateMenu(menuData.value), '更新菜单')
    } else {
        reqAndMessage(await reqSaveMenu(menuData.value), '添加菜单')
    }
    closeDialog()
    updateView()
}


</script>

<style scoped></style>