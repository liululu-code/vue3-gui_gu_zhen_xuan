<template>
    <el-form :model="spuFormData" label-width="auto">
        <el-form-item label="SPU名称">
            <el-input v-model="spuFormData.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="spuFormData.tmId" placeholder="Select" style="width: 240px">
                <el-option v-for="item in spuFormData.spuPosterList" :key="item.id" :label="item.tmName" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" v-model="spuFormData.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图标">
            <el-upload v-model:file-list="formImageList" action="/api/admin/product/fileUpload"
                :on-success="handleUploadFileSuccess" list-type="picture-card">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-space direction="vertical" :fill="true" style="width: 100%">
                <el-space>
                    <el-select v-model="spuFormData.saleAttrId"
                        :placeholder="remainSaleAttr.length ? `未选择${remainSaleAttr.length}个` : '无'" style="width: 240px">
                        <el-option v-for="item in remainSaleAttr" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <el-button type="primary" icon="Plus" @click="addAttribution"
                        :disabled="!spuFormData.saleAttrId">添加属性</el-button>
                </el-space>
                <el-table border :data="spuFormData.spuSaleAttrList">
                    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                    <el-table-column label="销售属性名字" prop="saleAttrName" width="120px"></el-table-column>
                    <el-table-column label="销售属性值" prop="spuSaleAttrValueList" min-width="100px">
                        <template #default="scope">
                            <el-space>
                                <el-tag size="small" v-for="(item, index) in scope.row.spuSaleAttrValueList" :key="item.id"
                                    closable :disable-transitions="false" @close="removeAttrValueTag(scope.$index, index)">
                                    {{ item.saleAttrValueName }}
                                </el-tag>
                                <el-input v-if="scope.row.showInput" ref="InputRef" v-model="newTagValue" size="small"
                                    @keyup.enter="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)" />
                                <el-button v-else icon="Plus" size="small" @click="showTagInput(scope.row)">
                                </el-button>
                            </el-space>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100px">
                        <template #default="scope">
                            <el-button type="danger" icon="Delete" size="small"
                                @click="deleteSaleAttr(scope.$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-space>
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </el-space>
            </el-space>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import type { SpuData, SpuSaleAttribution } from '@/api/good/spu/type'
// import type { UploadFile } from 'element-plus'
import { ref, defineModel, computed } from 'vue'
import { UploadUserFile, ElMessage } from 'element-plus'
import { reqTrademarkList, reqSpuImageList, reqSpuSaleAttributionList, reqSpuBaseAttributionList, reqUpdateSpuInfo, reqSaveSpuInfo } from '@/api/good/spu/index'
import { SENCE } from '@/api/enum'


const emit = defineEmits(['updateShowCard'])
const CARD_SENCE = defineModel('CARD_SENCE')
const newTagValue = ref('')

const spuFormData = ref<SpuData>({
    id: null,
    spuName: '',
    description: '',
    category3Id: null,
    tmId: null,
    spuSaleAttrList: [],
    spuImageList: [],
    spuPosterList: [],
    baseAttributionList: [],
    saleAttrId: null,
})

const formImageList = ref<UploadUserFile[]>([])

// const formImageList = computed<UploadUserFile[]>(() => {
//     if (spuFormData.value.spuImageList) {
//         return spuFormData.value.spuImageList.map((item) => ({
//             name: item.imgName,
//             url: item.imgUrl
//         }))
//     } else {
//         return []
//     }
// })




const addSaleAttrName = computed(() => {
    return spuFormData.value.baseAttributionList.find(item => {
        return item.id === spuFormData.value.saleAttrId
    })?.name || ''
})

const remainSaleAttr = computed(() => {
    const saleAttrIdList = new Set(spuFormData.value.spuSaleAttrList?.map(item => item.baseSaleAttrId))
    if (spuFormData.value.baseAttributionList) {
        return spuFormData.value.baseAttributionList.filter(item => !saleAttrIdList.has(item.id))
    } else {
        return []
    }
})

function handleUploadFileSuccess(response: any) {
    formImageList.value[formImageList.value.length - 1].url = response.data
}

function clearSpuFormData() {
    Object.assign(spuFormData.value, {
        id: null,
        spuName: '',
        description: '',
        category3Id: 480,
        tmId: null,
        spuSaleAttrList: [],
        spuImageList: [],
        spuPosterList: [],
        baseAttributionList: [],
        saleAttrId: null,
    })
    formImageList.value = []
}


async function getFormData(spuData: SpuData) {
    clearSpuFormData()
    Object.assign(spuFormData.value, spuData)
    const result1 = await reqTrademarkList()
    if (result1.code === 200) {
        spuFormData.value.spuPosterList = result1.data
    }

    const result2 = await reqSpuImageList(spuData.id as number)
    if (result2.code === 200) {
        spuFormData.value.spuImageList = result2.data
    }
    const result3 = await reqSpuSaleAttributionList(spuData.id as number)
    if (result3.code === 200) {
        spuFormData.value.spuSaleAttrList = result3.data
    }
    const result4 = await reqSpuBaseAttributionList()
    if (result4.code === 200) {
        spuFormData.value.baseAttributionList = result4.data
    }

    if (spuFormData.value.spuImageList) {
        formImageList.value = spuFormData.value.spuImageList.map((item) => ({
            name: item.imgName,
            url: item.imgUrl
        }))
    }
}


async function addSpuInit() {
    clearSpuFormData()
    const result1 = await reqTrademarkList()
    if (result1.code === 200) {
        spuFormData.value.spuPosterList = result1.data
    }
    const result4 = await reqSpuBaseAttributionList()
    if (result4.code === 200) {
        spuFormData.value.baseAttributionList = result4.data
    }
}

function changeSenceToInfo() {
    CARD_SENCE.value = SENCE.INFO
    emit('updateShowCard')
}

function removeAttrValueTag(spuSaleAttrListIndex: number, spuSaleAttrValueListIndex: number) {
    if (spuFormData.value.spuSaleAttrList) {
        spuFormData.value.spuSaleAttrList[spuSaleAttrListIndex].spuSaleAttrValueList.splice(spuSaleAttrValueListIndex, 1)
    } else {
        console.log('spuFormData.value.spuSaleAttrList is null');
    }
}

function deleteSaleAttr(index: number) {
    spuFormData.value.spuSaleAttrList?.splice(index, 1)
}

function addAttribution() {
    spuFormData.value.spuSaleAttrList?.push({
        baseSaleAttrId: spuFormData.value.saleAttrId,
        spuId: spuFormData.value.id,
        saleAttrName: addSaleAttrName.value,
        spuSaleAttrValueList: [],
    })
    spuFormData.value.saleAttrId = null
}

function handleInputConfirm(spuSaleAttribution: SpuSaleAttribution) {
    spuSaleAttribution.showInput = false
    if (newTagValue.value.trim()) {
        spuSaleAttribution.spuSaleAttrValueList.push({
            baseSaleAttrId: spuSaleAttribution.baseSaleAttrId,
            saleAttrName: spuSaleAttribution.saleAttrName,
            spuId: spuSaleAttribution.spuId,
            saleAttrValueName: newTagValue.value,
        })
        newTagValue.value = ''
    }
}

function showTagInput(spuSaleAttribution: SpuSaleAttribution) {
    spuSaleAttribution.showInput = true
}



defineExpose({
    getFormData,
    addSpuInit,
})

function assembleData() {
    spuFormData.value.spuImageList = formImageList.value.map((value) => {
        return {
            spuId: spuFormData.value.id,
            imgName: value.name,
            imgUrl: value.url as string,
        }
    })
}

async function save() {
    assembleData()
    if (spuFormData.value.id) {
        const result = await reqUpdateSpuInfo(spuFormData.value)
        if (result.code === 200) {
            ElMessage.success('更新成功')
        } else {
            ElMessage.error('更新失败')
        }
    } else {
        const result = await reqSaveSpuInfo(spuFormData.value)
        if (result.code === 200) {
            ElMessage.success('添加成功')
        } else {
            ElMessage.error('添加失败')
        }
    }

    changeSenceToInfo()
}

function cancel() {
    changeSenceToInfo()
}


</script>

<style scoped></style>