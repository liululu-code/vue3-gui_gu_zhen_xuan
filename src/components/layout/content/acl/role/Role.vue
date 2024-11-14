<template>
    <el-card>
        <div class="container">
            <div>
                <span>职位搜索: </span>
                <el-input v-model="searchKeyWord" clearable @keyup.enter="searchRole" placeholder="请输入搜索职位"
                    style="display: inline;"></el-input>
            </div>
            <div>
                <el-button type="primary" @click="searchRole">搜索</el-button>
                <el-button type="primary" @click="resetSearch">重置</el-button>
            </div>
        </div>
    </el-card>
    <el-card style="margin-top: 10px;">
        <el-button type="primary" @click="addRole">添加职位</el-button>
        <el-table :data="RoleTableData" :border="true" :show-overflow-tooltip="true" style="margin-top: 10px;">
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="id" prop="id"></el-table-column>
            <el-table-column label="职位名称" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="270px">
                <template #default="scope">
                    <el-button @click="assignRole(scope.row)" size="small" icon="User">分配角色</el-button>
                    <el-button @click="editRole(scope.row)" size="small" type="primary" icon="Edit">编辑</el-button>
                    <el-button @click="deleteRole(scope.row)" size="small" type="danger" icon="Delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizeList"
            :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="totalData"
            style="margin-top: 10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

    <!-- edit or add dialog -->
    <el-dialog v-model="isShowDialog" title="更新职位" @closed="dialogClosed">
        <template #default>
            <el-form :model="opreateRoleInfo" :rules="dialogRules" ref="updateOrAddRoleForm">
                <el-form-item label="职位姓名" prop="roleName">
                    <el-input v-model="opreateRoleInfo.roleName" placeholder="请输入职位姓名"></el-input>
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

    <!-- assign role drawer -->
    <el-drawer v-model="isShowAssignRoleDrawer" direction="rtl" title="分配权限" @closed="assignPermissionDrawerClosed">
        <template #default>
            <el-tree ref="assignPermissionTree" :data="permissionList" show-checkbox style="max-width: 600px" node-key="id" :default-expand-all="true"
                :default-checked-keys="selectPermissionIdList" :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="assignPermissionDrawerCancelClick">取消</el-button>
                <el-button type="primary" @click="assignPermissionDrawerConfirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'
import {
    reqRoleList, reqUpdateRole, reqSaveRole, reqDeleteRole, reqAssignRoleList, reqDoAssignRole
} from '@/api/acl/role/index'
import { reqAndMessage } from '@/utils/commonFunction'
import { ElMessage, FormRules, FormInstance } from 'element-plus'
import type { RoleData, PermissionListData } from '@/api/acl/role/type'
import { ElTree } from 'element-plus'


//pagination variable
const currentPage = ref(1)
const pageSize = ref(3)
const pageSizeList = ref([3, 5, 10, 15])
const totalData = ref(0)
//edit or add dialog
const isShowDialog = ref(false)
const updateOrAddRoleFormRef = useTemplateRef<FormInstance>('updateOrAddRoleForm')
const opreateRoleInfo = ref<RoleData>({
    id: undefined,
    roleName: '',
    remark: null,
})
const dialogRules = ref<FormRules<RoleData>>({
    roleName: [
        { required: true, message: 'Please input Activity name', trigger: 'change' },
        { min: 2, message: 'Length should bigger than 2', trigger: 'change' },
    ]
})
//show card
const RoleTableData = ref<RoleData[]>([])
// batch delete
// const batchDeleteIdList = ref<number[]>([])
//assign role drawer
const permissionList = ref<PermissionListData[]>([{
    id: -1,                      // 假设ID是一个数字类型
    pid: -1,                     // 假设父ID是一个数字类型
    name: '',                    // 假设名称是一个字符串类型
    type: -1,                    // 假设类型是一个数字类型
    level: -1,                   // 假设级别是一个数字类型
    select: false,
    children: [],  // 假设子节点是 PermissionListData 类型的数组
}])
const selectPermissionIdList = ref<number[]>([])
const isShowAssignRoleDrawer = ref(false)
const defaultProps = {
    children: 'children',
    label: 'name',
}
const assignPermissionTreeRef = useTemplateRef<InstanceType<typeof ElTree>>('assignPermissionTree')

// const assignRoleRoleName = ref('')
// const assignRoleRoleId = ref(-1)
// const isRoleCheckAll = ref(false)
// const isRoleCheckboxIndeterminate = ref(false)
// const checkedRoleIdList = ref<number[]>([])
//search
const searchKeyWord = ref('')


onMounted(() => {
    updateShowCard()
})

async function getRoleList() {
    const result = await reqRoleList(currentPage.value, pageSize.value, searchKeyWord.value)
    if (result.code === 200) {
        RoleTableData.value = result.data.records
        totalData.value = result.data.total
    }
}

function updateShowCard() {
    getRoleList()
}

function collectSelectedIds(list: PermissionListData[]) {
    const ids: number[] = []
    function traverse(nodes: PermissionListData[]) {
        for (const node of nodes) {

            if (node.select && node.children?.length === 0) {
                ids.push(node.id as number);
            }
            // 递归遍历子节点
            if (node.children && node.children.length > 0) {
                traverse(node.children);
            }
        }
    }
    // 开始遍历
    traverse(list);
    return ids;
}

//pagination
function handleCurrentChange() {
    updateShowCard()
}

function handleSizeChange() {
    currentPage.value = 1
    updateShowCard()
}


// search button
function searchRole() {
    getRoleList()
}

function resetSearch() {
    searchKeyWord.value = ''
    getRoleList()
}

//table button
async function assignRole(row: RoleData) {
    Object.assign(opreateRoleInfo.value, row)
    const result = await reqAssignRoleList(row.id as number)
    if (result.code === 200) {
        permissionList.value = result.data
        selectPermissionIdList.value = collectSelectedIds(permissionList.value)
    } else {
        ElMessage.error('请求权限失败')
    }
    console.log(selectPermissionIdList.value);

    openAssignPermissionDrawer()
}

function editRole(row: RoleData) {
    Object.assign(opreateRoleInfo.value, row)
    openDialog()
}
function addRole() {
    dialogClosed()
    openDialog()
}
async function deleteRole(row: RoleData) {
    reqAndMessage(await reqDeleteRole(row.id as number), '删除角色')
    updateShowCard()
}


//dialog
function closeDialog() {
    isShowDialog.value = false
}
function openDialog() {
    isShowDialog.value = true
}

function clearDialogData() {
    opreateRoleInfo.value = {
        id: undefined,
        roleName: '',
        remark: null,
    }
}

function dialogClosed() {
    clearDialogData()
    if (!updateOrAddRoleFormRef.value) return
    updateOrAddRoleFormRef.value.resetFields()
}

function dialogCancelClick() {
    closeDialog()
}

function dialogConfirmClick() {
    //发送请求
    if (!updateOrAddRoleFormRef.value) return
    updateOrAddRoleFormRef.value.validate(async (value) => {
        if (value) {
            console.log('发送请求');
            if (opreateRoleInfo.value.id) {
                reqAndMessage(await reqUpdateRole(opreateRoleInfo.value), '更新角色')
            } else {
                reqAndMessage(await reqSaveRole(opreateRoleInfo.value), '添加角色')
            }
        } else {
            ElMessage.error('输入不符合条件')
        }
    })
    closeDialog()
    updateShowCard()
}

//assign permission drawer
function assignPermissionDrawerClosed() {
    selectPermissionIdList.value = []
}

function openAssignPermissionDrawer() {
    isShowAssignRoleDrawer.value = true
}
function closeAssignPermissionDrawer() {
    isShowAssignRoleDrawer.value = false
}

function assignPermissionDrawerCancelClick() {
    closeAssignPermissionDrawer()
}

async function assignPermissionDrawerConfirmClick() {
    //发送请求
    console.log('发送权限请求');
    console.log(selectPermissionIdList.value);
    if (!assignPermissionTreeRef.value) return
    selectPermissionIdList.value = assignPermissionTreeRef.value.getCheckedKeys().map(key => Number(key))
    reqAndMessage(await reqDoAssignRole(opreateRoleInfo.value.id as number, selectPermissionIdList.value), '更新角色')
    closeAssignPermissionDrawer()
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