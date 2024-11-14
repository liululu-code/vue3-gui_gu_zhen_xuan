<template>
  <el-space direction="vertical" :fill="true" style="width:100%">
    <el-card shadow="always">
      <Category @getAttributionInfoList="getAttributionInfoList"></Category>
    </el-card>

    <el-card shadow="always">
      <el-space direction="vertical" :fill="true" v-show="CARD_SENCE === SENCE.INFO" style="width:100%">
        <div>
          <el-button type="primary" icon="Plus" @click="addSpu">添加SPU</el-button>
        </div>
        <el-table :border="true" :data="spuTableData">
          <el-table-column label="序号" type="index" width="100" />
          <el-table-column prop="spuName" label="SPU名称" />
          <el-table-column prop="description" label="SPU描述" />
          <el-table-column label="SPU操作" min-width="100px">
            <template #default="scope">
              <el-button icon="Plus" size="small" @click="addSku(scope.row)"></el-button>
              <el-button type="primary" icon="Edit" size="small" @click="editSpu(scope.row)"></el-button>
              <el-button type="info" icon="View" size="small" @click="viewSpu(scope.row)"></el-button>
              <el-popconfirm title="Are you sure to delete this?" @confirm="deleteSpu(scope.row)">
                <template #reference>
                  <el-button type="danger" icon="Delete" size="small"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizeList"
          :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="totalData"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />

      </el-space>
      <SpuEdit v-show="CARD_SENCE === SENCE.EDIT" ref="spuEdit" v-model:CARD_SENCE="CARD_SENCE"
        @updateShowCard="updateShowCard"></SpuEdit>
      <SkuAdd v-show="CARD_SENCE === SENCE.ADD" ref="skuAdd" v-model:CARD_SENCE="CARD_SENCE"></SkuAdd>
    </el-card>

    <el-dialog v-model="isShowViewSkudialog" title="SKU列表">
      <el-table :data="skuTableData">
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="weight" label="重量"></el-table-column>
        <el-table-column label="图片">
          <template #default="scope">
            <el-image :src="scope.row.skuDefaultImg" style="width: 120px; height: 120px"></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-space>
</template>

<script setup lang="ts">

import Category from '@/components/share/category/Category.vue'
import SpuEdit from './SpuEdit.vue'
import SkuAdd from './SkuAdd.vue'
import { reqSpu, reqFindSkuBySpuId } from '@/api/good/spu/index'
import { reqDeleteAttribution } from '@/api/good/attribution/index'
import type { SpuData, SkuInfoData } from '@/api/good/spu/type'
import type { SpuEditComponent } from './spuEditType'
import type { SkuAddComponent } from './skuAddType'
import type { IdObjData } from '@/api/generalType'
import { SENCE } from '@/api/enum'
import { ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'

const spuTableData = ref<SpuData[]>([])
const CARD_SENCE = ref<SENCE>(SENCE.INFO)
const spuEditRef = useTemplateRef<SpuEditComponent>('spuEdit')
const skuAddRef = useTemplateRef<SkuAddComponent>('skuAdd')
const currentPage = ref(1)
const pageSize = ref(3)
const pageSizeList = ref([3, 5, 10, 15])
const totalData = ref(0)
const isShowViewSkudialog = ref(false)
const skuTableData = ref<SkuInfoData[]>([])


const idObj = ref<IdObjData>({
  c1Id: -1,
  c2Id: -1,
  c3Id: -1,
})


function handleSizeChange() {
  updateShowCard()
}

function handleCurrentChange() {
  updateShowCard()
}

function addSpu() {
  CARD_SENCE.value = SENCE.EDIT
  if (spuEditRef.value) {
    spuEditRef.value.addSpuInit();
  } else {
    console.error('spuEditRef is not initialized.');
  }
}

function addSku(spuData: SpuData) {
  CARD_SENCE.value = SENCE.ADD
  if (skuAddRef.value) {
    skuAddRef.value.getFormData(spuData, idObj.value);
  } else {
    console.error('skuAddRef is not initialized.');
  }
}

function editSpu(spuData: SpuData) {
  CARD_SENCE.value = SENCE.EDIT
  if (spuEditRef.value) {
    spuEditRef.value.getFormData(spuData);
  } else {
    console.error('spuEditRef is not initialized.');
  }
}
async function viewSpu(spuData: SpuData) {
  isShowViewSkudialog.value = true
  const result = await reqFindSkuBySpuId(spuData.id as number)
  if (result.code === 200) {
    skuTableData.value = result.data
  } else {
    ElMessage.error('请求sku列表失败')
  }
}
async function deleteSpu(row: SpuData) {
  if (row.id) {
    const result = await reqDeleteAttribution(row.id)
    if (result.code === 200) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  }
  updateShowCard()
}

async function updateShowCard() {
  const result = await reqSpu(currentPage.value, pageSize.value, idObj.value.c3Id)
  if (result.code === 200) {
    spuTableData.value = result.data.records
    totalData.value = result.data.total

  } else {
    ElMessage.error('请求spu信息失败!')
  }
}

function getAttributionInfoList(c1Id: number, c2Id: number, c3Id: number) {
  Object.assign(idObj.value, {
    c1Id,
    c2Id,
    c3Id,
  })
  updateShowCard()
}

</script>

<style scoped></style>