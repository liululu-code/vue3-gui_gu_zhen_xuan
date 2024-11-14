<template>
  <el-space direction="vertical" :fill="true">
    <el-card shadow="always" >
      <Category @getAttributionInfoList="getAttributionInfoList"></Category>
    </el-card>

    <el-card shadow="never" >
      <el-button type="primary" icon="Plus" @click="addAttribution" :disabled="!attribution.categoryId">添加属性</el-button>
      <el-table :data="attributionInfoList" style="width: 100%">
        <el-table-column type="index" label="序号" width="180" />
        <el-table-column prop="attrName" label="属性" width="180" />
        <el-table-column label="属性值">
          <template #default="scope">
            <el-tag v-for="(attrValue, index) in scope.row.attrValueList" :key="attrValue.attrId"
              :type="elTagType[index]">
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template #default="scope">
            <el-button type="primary" icon="Edit" size="small" @click="editAttribution(scope.row)"></el-button>
            <el-button type="danger" icon="Delete" size="small" @click="deleteAttribution(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="showAddAttributionDialog" @close="closeDialog" title="请添加属性" width="800" align-center>
        <el-form :model="attribution">
          <el-form-item>
            <span>属性名称</span>
            <el-input v-model="attribution.attrName" style="width: 240px" placeholder="请输入属性名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Plus" @click="addAttributionValue" :disabled="!attribution.attrName">添加属性值</el-button>
            <el-button @click="cancelAddAttribution">取消</el-button>
          </el-form-item>
          <el-form-item>
            <el-table :data="attribution.attrValueList" style="width: 100%">
              <el-table-column type="index" label="序号" width="180" />
              <el-table-column label="属性值" >
                <template #default="scope" >
                  <el-input v-model="scope.row.valueName" placeholder="请输入属性值名称" :ref="(inp:any) => attributionValueListInputRefs[scope.$index]=inp" v-show="scope.row.showInput" @blur="inputBlur(scope.row, scope.$index)"></el-input>
                  <div v-show="!scope.row.showInput" @click="editInput(scope.row, scope.$index)">{{ scope.row.valueName }}</div>
                </template>
              </el-table-column>
              <el-table-column label="属性操作" width="180" >
                <template #default="scope">
                  <el-button type="danger" icon="Delete" size="small" @click="deleteAttributionValue(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-button type="primary" @click="saveAttribution">保存</el-button>
            <el-button @click="cancelDialog">取消</el-button>
          </el-form-item>
          <!-- <template #footer>
            <div class="dialog-footer">
              <el-button @click="showAddAttribution = false">Cancel</el-button>
              <el-button type="primary" @click="showAddAttribution = false">
                Confirm
              </el-button>
            </div>
          </template> -->
        </el-form>

      </el-dialog>

    </el-card>
  </el-space>
</template>

<script setup lang="ts">
import Category from '@/components/share/category/Category.vue'
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { reqAttributionInfoList, reqSaveAttributionInfo, reqDeleteAttribution } from '@/api/good/attribution/index'
import type { AttributionInfoData } from '@/api/good/attribution/type'

interface attributionValue {
  valueName: string,
  showInput: boolean,
}

interface attributionInterface {
  attrName: string,
  attrValueList: attributionValue[],
  categoryId: number | null,
  categoryLevel: number,
  id?: number,
}

const attributionValueListInputRefs = ref<any>([])



const elTagType = ['primary', 'success', 'info', 'warning', 'danger']
const attributionInfoList = ref<AttributionInfoData[]>([])
const showAddAttributionDialog = ref(false)
const attribution = ref<attributionInterface>({
  attrName: '',
  attrValueList: [],
  categoryId: null,
  categoryLevel: 3,
})

interface IdObjInterface {
  c1Id: number,
  c2Id: number,
  c3Id: number
}

const idObj = {
  c1Id: -1,
  c2Id: -1,
  c3Id: -1,
}

async function updateShowCard(idObj: IdObjInterface) {
  try {
    const result = await reqAttributionInfoList(idObj.c1Id, idObj.c2Id, idObj.c3Id)
    if (result.code === 200) {
      attributionInfoList.value = result.data
      attribution.value.categoryId = idObj.c3Id
    }
  } catch (error) {
    ElMessage.error('请求属性列表失败')
  }
}

function editInput(attrValue: attributionValue, index:number) {
  attrValue.showInput = true
  // console.log(attributionValueListInputRefs);
  nextTick(()=>{
    attributionValueListInputRefs.value[index].focus()
  })
  

}
 function getAttributionInfoList(c1Id: number, c2Id: number, c3Id: number) {
  idObj.c1Id = c1Id
  idObj.c2Id = c2Id
  idObj.c3Id = c3Id
  updateShowCard(idObj)
}

function editAttribution(attr: attributionInterface) {
  Object.assign(attribution.value, attr)
  console.log(attribution.value);
  showAddAttributionDialog.value = true
}

async function deleteAttribution(id: number) {
  try {
    const result = await reqDeleteAttribution(id)
    if (result.code === 200) {
      ElMessage.success('删除成功')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
  updateShowCard(idObj)
}

function addAttribution() {
  showAddAttributionDialog.value = true
}

function cancelAddAttribution() {
  showAddAttributionDialog.value = false
}

function closeDialog() {
  attribution.value.attrName = ''
  attribution.value.attrValueList = []
}

function addAttributionValue() {
  attribution.value.attrValueList.push({
    valueName:'',
    showInput: true,
  })
  nextTick(()=>{
    attributionValueListInputRefs.value[attribution.value.attrValueList.length - 1].focus()
  })
  
}

async function saveAttribution() {
  try {
    const result = await reqSaveAttributionInfo(attribution.value)
    if (result.code === 200) {
      ElMessage.success('添加成功')
    }
  } catch (error) {
    ElMessage.error('添加属性列表失败')
  }
  showAddAttributionDialog.value = false
  updateShowCard(idObj)
}
function inputBlur(attributionValue: attributionValue, index: number) {
  if (!attributionValue.valueName) {
    ElMessage.error('输入不能为空')
    attribution.value.attrValueList.splice(index, 1)
  }
  attributionValue.showInput = false
}

function deleteAttributionValue(index: number) {
  attribution.value.attrValueList.splice(index, 1)
}

function cancelDialog() {
  updateShowCard(idObj)
  showAddAttributionDialog.value = false
}
</script>

<style scoped>

</style>