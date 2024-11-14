<template>
    <el-card shadow="always">
        <el-button type="primary" icon="Plus" @click="addBrand">添加品牌</el-button>

        <el-table :data="brandTableData" style="width: 100%; margin: 10px 0px" :border="true">
            <el-table-column label="序号" width="100" align="center" type="index" />
            <el-table-column prop="tmName" label="品牌名称" align="center" />
            <el-table-column label="品牌LOGO" align="center">
                <template #default="scope">
                    <div v-if="loading">加载中...</div>
                    <img v-else class="logo" :src="scope.row.logoUrl" alt="logo 加载失败">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="editBrand(scope)">Edit</el-button>
                    <el-popconfirm :title="`delete ${scope.row.tmName}?`" @confirm="deleteBrand(scope.row.id)">
                        <template #reference>
                            <el-button type="danger" size="small">Delete</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 15]"
            :background="true" layout="sizes, prev, pager, next, jumper, ->, total" :total="totalBrand"
            @current-change="currentChange" @size-change="sizeChange" />
    </el-card>

    <el-dialog v-model="dialogFormVisible" :title="`${dialogTitle}品牌`" width="500" @closed="dialogClosed">
        <el-form label-width="80" :rules="rules" :model="brandData" ref="dialogFormRef">
            <el-form-item label="品牌名称" prop="tmName">
                <el-input placeholder="请输入品牌名称" v-model="brandData.tmName" />
            </el-form-item>
            <el-form-item label="品牌Logo" prop="logoUrl">
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" drag :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="brandData.logoUrl && !logoIsLoading" :src="brandData.logoUrl" class="avatar" />
                    <div v-else-if="logoIsLoading">上传中...</div>
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogCancel">取消</el-button>
            <el-button type="primary" @click="dialogConfirm" :disabled="logoIsLoading">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqBrandInfo, reqAddBrand, reqUpdateBrand, reqDeleteBrand } from '@/api/good/brand/index'
import { RecordData } from '@/api/good/brand/type'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'


const currentPage = ref(1)
const pageSize = ref(3)
const totalBrand = ref(1)
const loading = ref(false)
let brandTableData = ref<RecordData[]>()
const dialogFormVisible = ref(false)
const logoIsLoading = ref(false)
const brandData = reactive<RecordData>({
    id: 0,
    tmName: '',
    logoUrl: ''
})
const dialogTitle = ref('')
const dialogFormRef = ref()

const rules = reactive({
    tmName: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 2, max: 10, message: 'length should be 2 to 10', trigger: ['change', 'blur'] }
    ],
    logoUrl: [
        { required: true },
        { validator: logoUrlValidator }
    ]
})



function logoUrlValidator(_: any, value: any, callback: any) {
    if (value) {
        callback()
    } else {
        callback(new Error('logo error'))
    }
}


async function getBrandData() {
    loading.value = true
    const result = await reqBrandInfo(currentPage.value, pageSize.value)
    if (result.code === 200) {
        totalBrand.value = result.data.total
        brandTableData.value = result.data.records
        loading.value = false
    }
}

onMounted(() => {
    getBrandData()
})


function currentChange() {
    getBrandData()
}

function sizeChange() {
    currentPage.value = 1
    getBrandData()
}

function addBrand() {
    dialogTitle.value = '添加'
    dialogFormVisible.value = true
    brandData.tmName = ''
    brandData.logoUrl = ''
}

function editBrand(scope: any) {
    dialogTitle.value = '修改'
    dialogFormVisible.value = true
    brandData.id = scope.row.id
    brandData.tmName = scope.row.tmName
    brandData.logoUrl = scope.row.logoUrl
}

async function deleteBrand(id:number) {
    try {
        const result = await reqDeleteBrand(id)
        if (result.code === 200) {
            ElMessage.success('删除成功')
        }
    } catch (error:any) {
        ElMessage.error(error.message)
    }
    getBrandData()
}

function dialogCancel() {
    dialogFormVisible.value = false
}

async function dialogConfirm() {
    if (!dialogFormRef) return

    dialogFormVisible.value = false
    try {
        await dialogFormRef.value.validate((valid: any, fields: any) => {
            console.log("valid:", valid);
            console.log("fields:", fields);

            if (valid) {
                console.log("brandForm submit");
            } else {
                return Promise.reject(new Error("输入不符合要求"))
            }
        })
        if (dialogTitle.value === '添加') {
            await reqAddBrand(brandData)
        } else if (dialogTitle.value === '修改') {
            await reqUpdateBrand(brandData)
        } else {
            ElMessage.error('未知错误')
        }
        ElMessage.success(`${dialogTitle.value}成功`)
    } catch (error: any) {
        // ElMessage.error(`${dialogTitle.value}失败`)
        ElMessage.error(error.message)
    }
    getBrandData()

}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, _) => {
    logoIsLoading.value = false
    brandData.logoUrl = response.data
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(rawFile.type)) {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 1) {
        ElMessage.error('Avatar picture size can not exceed 1MB!')
        return false
    }
    logoIsLoading.value = true
    return true
}

function dialogClosed() {
    dialogFormRef.value.clearValidate()
}
</script>



<style scoped lang="scss">
.logo {
    width: 80px;
    height: 80px;
}



.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.el-upload-dragger {
    padding: 10px;
    width: 200;
    height: 200px;
}
</style>