<template>
    <el-card shadow="always">
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select v-model="c1Id" placeholder="Select" class="select" @change="c1Change">
                    <el-option v-for="item in c1Arr" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类">
                <el-select v-model="c2Id" placeholder="Select"  class="select"  @change="c2Change">
                    <el-option v-for="item in c2Arr" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类">
                <el-select v-model="c3Id" placeholder="Select"  class="select"  @change="c3Change">
                    <el-option v-for="item in c3Arr" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>

    <el-card shadow="always">
        显示
    </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqCategory, reqCategory2, reqCategory3 } from '@/api/good/attribution/index'
import type { CategoryData } from '@/api/good/attribution/type'
import { ElMessage } from 'element-plus'

const c1Arr = ref<CategoryData[]>([])
const c1Id = ref<number>()
const c2Arr = ref<CategoryData[]>([])
const c2Id = ref<number>()
const c3Arr = ref<CategoryData[]>([])
const c3Id = ref<number>()


async function c1Change() {
    c2Id.value = undefined
    c3Id.value = undefined
    try {
        const result = await reqCategory2(c1Id.value as number)
        if (result.code === 200) {
            c2Arr.value = result.data
        }
    } catch (error) {
        ElMessage.error('请求一级分类信息失败')
    }
}

async function c2Change() {
    c3Id.value = undefined
    try {
        const result = await reqCategory3(c2Id.value as number)
        if (result.code === 200) {
            c3Arr.value = result.data
        }
    } catch (error) {
        ElMessage.error('请求一级分类信息失败')
    }
}

function c3Change() {
    console.info("c3Change");
    
}


onMounted(async () => {
    try {
        const result = await reqCategory()
        if (result.code === 200) {
            c1Arr.value = result.data
        }
    } catch (error) {
        ElMessage.error('请求一级分类信息失败')
    }
})
</script>

<style scoped>
.select {
    width: 180px;
}
</style>