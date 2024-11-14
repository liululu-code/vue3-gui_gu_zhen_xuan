<template>
    <el-form :inline="true">
        <el-form-item label="一级分类">
            <el-select v-model="c1Id" placeholder="Select" class="select" @change="c1Change">
                <el-option v-for="item in c1Arr" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
            <el-select v-model="c2Id" placeholder="Select" class="select" @change="c2Change" :disabled="disableC2">
                <el-option v-for="item in c2Arr" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item label="三级分类">
            <el-select v-model="c3Id" placeholder="Select" class="select" @change="c3Change" :disabled="disableC3">
                <el-option v-for="item in c3Arr" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqCategory, reqCategory2, reqCategory3 } from '@/api/good/attribution/index'
import type { CategoryData } from '@/api/good/attribution/type'
import { ElMessage } from 'element-plus'


const emit = defineEmits(['getAttributionInfoList'])

// const idList: any = defineModel()
const c1Arr = ref<CategoryData[]>([])
const c1Id = ref<number>()
const c2Arr = ref<CategoryData[]>([])
const c2Id = ref<number>()
const c3Arr = ref<CategoryData[]>([])
const c3Id = ref<number>()
const disableC2 = ref(true)
const disableC3 = ref(true)
// const { c1Id, c2Id, c3Id } = toRefs(idList.value)


onMounted(async () => {    
    try {
        const result = await reqCategory()
        if (result.code === 200) {
            c1Arr.value = result.data
            disableC2.value = true
            disableC3.value = true
        }
    } catch (error) {
        ElMessage.error('请求一级分类信息失败')
    }
})

function c1ChangeStateHandle() {
    c2Id.value = undefined
    c2Arr.value = []
    c3Id.value = undefined
    c3Arr.value = []
    disableC2.value = true
    disableC3.value = true
}

function c2ChangeStateHandle() {
    c3Arr.value = []
    c3Id.value = undefined
    disableC3.value = true
}


async function c1Change() {
    c1ChangeStateHandle()
    try {
        const result = await reqCategory2(c1Id.value as number)
        if (result.code === 200) {
            c2Arr.value = result.data
            disableC2.value = false
        }
    } catch (error) {
        ElMessage.error('请求二级分类信息失败')
    }
}

async function c2Change() {
    c2ChangeStateHandle()
    try {
        const result = await reqCategory3(c2Id.value as number)
        if (result.code === 200) {
            c3Arr.value = result.data
            disableC3.value = false
        }
    } catch (error) {
        ElMessage.error('请求三级分类信息失败')
    }
}

async function c3Change() {
    emit('getAttributionInfoList', c1Id.value, c2Id.value, c3Id.value)
}




</script>

<style scoped>
.select {
    width: 180px;
}
</style>