<template>
    <el-form :model="skuFormData">
        <el-form-item label="SKU名称">
            <el-input v-model="skuFormData.skuName" placeholder="SKU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input v-model="skuFormData.price" placeholder="价格(元)"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input v-model="skuFormData.weight" placeholder="重量(g)"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input v-model="skuFormData.skuDesc" placeholder="SKU描述" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="平台属性">
            <el-form :inline="true">
                <el-form-item v-for="item in attrInfoList" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.selectId" placeholder="select" @change="attrInfoSelectChange(item)">
                        <el-option v-for="elem in item.attrValueList" :key="elem.id" :label="elem.valueName"
                            :value="elem.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>

        <el-form-item label="销售属性">
            <el-form :inline="true">
                <el-form-item v-for="item in saleAttrInfoList" :key="item.id" :label="item.saleAttrName">
                    <el-select v-model="item.selectId" placeholder="select">
                        <el-option v-for="elem in item.spuSaleAttrValueList" :key="elem.id" :label="elem.saleAttrValueName"
                            :value="elem.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>

        <el-form-item label="图片名称">
            <el-space direction="vertical" :fill="true" style="width: 100%;">
                <el-table :data="imageList" @select="tableSelect" ref="pictureTableRef">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column label="图片">
                        <template #default="scope">
                            <el-image :src="scope.row.imgUrl" style="width: 100px; height: 100px;"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" prop="imgName"></el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="setImageAsDefault(scope.row)">设为默认</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div>
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </el-space>

        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import type { SkuInfoData, SpuData, SpuSaleAttribution, SpuImageData } from '@/api/good/spu/type'
import type { IdObjData } from '@/api/generalType'
import type { AttributionInfoData } from '@/api/good/attribution/type'
import type { TableInstance } from 'element-plus'
import { ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { reqSpuImageList, reqSpuSaleAttributionList, reqSaveSkuInfo } from '@/api/good/spu/index'
import { reqAttributionInfoList } from '@/api/good/attribution/index'

import { SENCE } from '@/api/enum'

const CARD_SENCE = defineModel('CARD_SENCE')

const skuFormData = ref<SkuInfoData>({
    skuName: "",
    price: "",
    weight: "",
    skuDesc: "",
    category3Id: -1,
    spuId: -1,
    tmId: -1,
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: "",
    isSale: 0,
})
const attrInfoList = ref<AttributionInfoData[]>([])
const saleAttrInfoList = ref<SpuSaleAttribution[]>([])
const imageList = ref<SpuImageData[]>([])
const pictureTableRef = useTemplateRef<TableInstance>('pictureTableRef')

async function getFormData(spuData: SpuData, idObj: IdObjData) {
    const result1 = await reqAttributionInfoList(idObj.c1Id, idObj.c2Id, idObj.c3Id)
    if (result1.code === 200) {
        attrInfoList.value = result1.data
    } else {
        console.log('网络请求失败');
    }

    const result2 = await reqSpuSaleAttributionList(spuData.id as number)
    if (result2.code === 200) {
        saleAttrInfoList.value = result2.data
    } else {
        console.log('网络请求失败');
    }
    const result3 = await reqSpuImageList(spuData.id as number)
    if (result3.code === 200) {
        imageList.value = result3.data
    } else {
        console.log('网络请求失败');
    }

    skuFormData.value.spuId = spuData.id as number
    skuFormData.value.tmId = spuData.tmId as number
}

function tableSelect(_: SpuImageData[], row: SpuImageData) {
    if (pictureTableRef.value) {
        pictureTableRef.value.clearSelection()
        pictureTableRef.value.toggleRowSelection(row)
        skuFormData.value.skuDefaultImg = row.imgUrl
    }
}

function setImageAsDefault(row: SpuImageData) {
    tableSelect([], row)
}

function attrInfoSelectChange(item: any) {
    console.log('item: ', item);

}



defineExpose({
    getFormData,
})

function changeSenceToInfo() {
    CARD_SENCE.value = SENCE.INFO
    // emit('updateShowCard')
}

function assembleData() {
    skuFormData.value.skuAttrValueList = attrInfoList.value.filter((item) => {
        return item.selectId !== undefined
    }).map((value) => {
        return {
            attrId: value.id as number,
            valueId: value.selectId as number,
        }
    })

    skuFormData.value.skuSaleAttrValueList = saleAttrInfoList.value.filter((item) => {
        return item.selectId !== undefined
    }).map((value) => {
        return {
            saleAttrId: value.id as number,
            saleAttrValueId: value.selectId as number,
        }
    })
}

async function save() {
    assembleData()
    const result = await reqSaveSkuInfo(skuFormData.value)
    if (result.code === 200) {
        ElMessage.success('添加sku成功')
    } else {
        ElMessage.success('添加sku失败')
    }
    changeSenceToInfo()
}
function cancel() {
    skuFormData.value = {
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        category3Id: -1,
        spuId: -1,
        tmId: -1,
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuDefaultImg: "",
        isSale: 0,
    }
    changeSenceToInfo()
}

</script>

<style scoped></style>