<template>
    <el-card>

        <el-table :data="skuTableData" :border="true" :row-class-name="tableRowClassName">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="名称" prop="skuName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="描述" prop="skuDesc" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="图片">
                <template #default="scope">
                    <el-image :src="scope.row.skuDefaultImg" style="width:100px; height: 100px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="重量(g)" prop="weight"></el-table-column>
            <el-table-column label="价格(元)" prop="price"></el-table-column>
            <el-table-column label="操作" prop="" width="205px" fixed="right">
                <template #default="scope">
                    <el-button size="small" @click="skuLaunchOrDelist(scope.row)"
                        :icon="scope.row.isSale ? 'Bottom' : 'Top'"></el-button>
                    <el-button type="primary" size="small" @click="skuEdit" icon="Edit"></el-button>
                    <el-button type="info" size="small" @click="showSkuInfo(scope.row)" icon="InfoFilled"></el-button>
                    <el-button type="danger" size="small" @click="deleteSku(scope.row)" icon="Delete"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizeList"
            :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="totalData"
            style="margin-top: 10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>


    <el-drawer v-model="isShowDrawer" direction="rtl" title="商品详情">
        <template #default>
            <el-space direction="vertical" :fill="true">
                <el-row>
                    <el-col :span="8">名称</el-col>
                    <el-col :span="16">{{ drawerData.skuName }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">描述</el-col>
                    <el-col :span="16">{{ drawerData.skuDesc }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">价格</el-col>
                    <el-col :span="16">{{ drawerData.price }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">平台属性</el-col>
                    <el-col :span="16">
                        <el-space>
                            <el-tag v-for="item in drawerData.skuAttrValueList" type="primary">{{ item.valueName }}</el-tag>
                        </el-space>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">销售属性</el-col>
                    <el-col :span="16">
                        <el-space>
                            <el-tag v-for="item in drawerData.skuSaleAttrValueList" type="primary">{{ item.saleAttrValueName
                            }}</el-tag>
                        </el-space>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">商品图片</el-col>
                    <el-col :span="16">
                        <el-carousel :interval="2000" type="card" height="200px">
                            <el-carousel-item v-for="item in drawerData.skuImageList" :key="item.id">
                                <el-image :src="item.imgUrl" fit="fill" style="height: 100%; width: 100%;"></el-image>
                            </el-carousel-item>
                        </el-carousel>
                        <!-- {{ drawerData.skuImageList }} -->
                    </el-col>
                </el-row>
            </el-space>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSkuLaunch, reqSkuDelist, reqGetSkuInfo, reqDeleteSku } from '@/api/good/sku/index'
import { SkuInfoData } from '@/api/good/spu/type'
import { ElMessage } from 'element-plus'
import {reqAndMessage} from '@/utils/commonFunction'

//pagination variable
const currentPage = ref(1)
const pageSize = ref(3)
const pageSizeList = ref([3, 5, 10, 15])
const totalData = ref(0)
//table variable
const skuTableData = ref<SkuInfoData[]>([])
//drawer
const isShowDrawer = ref(false)
const drawerData = ref<SkuInfoData>({
    id: -1,
    skuName: '', // skuName 应为 string 类型
    price: '', // price 应为 string 类型，若需要可以考虑改为 number
    weight: '', // weight 应为 string 类型，若需要可以考虑改为 number
    skuDesc: '',// skuDesc 应为 string 类型
    category3Id: -1, // category3Id 为数字
    spuId: -1, // spuId 为数字
    tmId: -1, // tmId 为数字
    skuAttrValueList: [], // skuAttrValueList 应为 SkuAttrValue 对象的数组
    skuSaleAttrValueList: [], // skuSaleAttrValueList 应为 SkuAttrValue 对象的数组
    skuDefaultImg: '', // skuDefaultImg 应为 string 类型
    isSale: -1,
})

async function updateShowCard() {
    const result = await reqSkuList(currentPage.value, pageSize.value)
    if (result.code === 200) {
        skuTableData.value = result.data.records
        totalData.value = result.data.total
    }
}

onMounted(() => {
    updateShowCard()
})

const tableRowClassName = ({
    row,
}: {
    row: SkuInfoData
}) => {
    if (row.isSale === 1) {
        return 'info-row'
    }
    return ''
}


function handleCurrentChange() {
    updateShowCard()
}

function handleSizeChange() {
    currentPage.value = 1
    updateShowCard()
}


async function skuLaunchOrDelist(row: SkuInfoData) {
    if (row.isSale === 0) {
        reqAndMessage(await reqSkuLaunch(row.id as number), '上架')
    } else {
        reqAndMessage(await reqSkuDelist(row.id as number), '下架')
    }
    updateShowCard()
}

function skuEdit() {
    ElMessage.info('程序猿正在熬夜开发中...')
}

async function showSkuInfo(row: SkuInfoData) {
    isShowDrawer.value = true
    const result = await reqGetSkuInfo(row.id as number)
    if (result.code === 200) {
        drawerData.value = result.data
    } else {
        ElMessage.error('请求sku详情失败')
    }
}

async function deleteSku(row: SkuInfoData) {
    reqAndMessage(await reqDeleteSku(row.id as number), '删除sku')
    updateShowCard()
}


</script>

<style scoped></style>