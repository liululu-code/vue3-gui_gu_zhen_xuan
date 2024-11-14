<template>
    <el-card>
        <div class="container">
            <el-image :src="avatar" style="width: 100px; height: 100px; border-radius: 50%"></el-image>
            <div class="text-box">
                <div class="welcome">下午好~{{ name }}</div>
                <div class="title">{{ setting.logo.text }}</div>
            </div>
        </div>
    </el-card>
    <el-image class="middle-image" src="/public/img02.jpg"></el-image>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useUserStore from '@/stores/modules/user'
import setting from '@/setting.ts'
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const { avatar, name } = storeToRefs(userStore)
const router = useRouter()
console.log(router);


</script>

<style scoped lang="scss">
.container {
    display: flex;
    .text-box {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .welcome {
            font-size: 40px;
            font-weight: bold;
        }
        .title {
            font-style: italic;
            color: #ccc;
        }
    }
}

.middle-image {
    width: 800px;
    display: flex;
    align-content: center;
    margin: 20px auto;
}
</style>