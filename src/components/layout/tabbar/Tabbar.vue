<template lang="html">
    <div class="container">
        <div class="left-container">
            <el-icon @click="changeFold">
                <Fold />
            </el-icon>
            <el-breadcrumb class="breadcrubm" :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(item, index) in route.matched" :key="index" v-show="!item.meta.hideOnBreadcrumb"
                    :to="item.path">
                    <el-icon>
                        <component :is="item.meta.logo"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="right-container">

            <el-button class="button-color" @click="refreshContent" circle :icon="Refresh" />
            <el-button class="button-color" @click="fullScreen" circle :icon="FullScreen" />
            <el-popover placement="top-start" title="主题设置" :width="200" :visible="isSettingButtonVisible">
                <template #reference>
                    <el-button class="button-color" 
                        @click="isSettingButtonVisible = !isSettingButtonVisible" circle :icon="Setting" />
                </template>
                <el-space direction="vertical" :fill="true">
                    <div>
                        <span>主题颜色</span>
                        <el-color-picker v-model="themeColor" @change="themeColorChange" size="small"
                            style="margin-left: 10px;" />
                    </div>
                    <div>
                        <span>暗黑模式</span>
                        <el-switch v-model="isDark" class="mt-2" style="margin-left: 24px" inline-prompt active-icon="Moon"
                            inactive-icon="Sunny" />
                    </div>
                </el-space>
            </el-popover>

            <img class="avator" :src="avatar" alt="">
            <!-- <img class="avator" src="F:/dev_codes/html/vite-project/public/logo.png" alt=""> -->

            <el-dropdown>
                <span>
                    {{ name }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { Refresh, FullScreen, Setting } from '@element-plus/icons-vue'
import useLayoutSetting from '@/stores/modules/layoutSetting.ts'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { nextTick, ref } from 'vue'
import useUserStore from '@/stores/modules/user'
import { ElNotification } from 'element-plus'

const layoutSetting = useLayoutSetting()
const { isFold, refrush } = storeToRefs(layoutSetting)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { name, avatar } = storeToRefs(userStore)
// const avatar_url = userStore.avatar as string

//setting
const isSettingButtonVisible = ref(false)
const themeColor = ref('rgba(19, 206, 102, 0.8)')
import { useDark } from '@vueuse/core'
const isDark = useDark()

function themeColorChange() {
    const el = document.documentElement
    getComputedStyle(el).getPropertyValue(`--el-color-primary`)
    el.style.setProperty('--el-color-primary', themeColor.value)
}

function changeFold() {
    isFold.value = !isFold.value
}

function refreshContent() {
    refrush.value = true
    nextTick(() => {
        refrush.value = false
    })
}

function fullScreen() {
    const isFullScreen = document.fullscreenElement
    if (!isFullScreen) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

async function logout() {
    try {
        await userStore.userLogout()
        router.push({ path: '/login', query: { redirect: route.path } })
    } catch (error: any) {
        ElNotification({
            title: '退出失败',
            message: error.message
        })
    }
}
</script>


<style scoped lang="scss">
.container {
    // position: relative;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    align-items: center;
    font-size: 20px;

    .left-container {
        display: flex;
        // font-size: 10px;
        align-items: center;

        .breadcrubm {
            margin-left: 10px;
            vertical-align: center;
        }

    }

    .right-container {
        display: flex;
        align-items: center;

        .button-color {
            background-color: #f0f1f1;
        }

        .avator {
            width: 32px;
            height: 32px;
            border-radius: 16px;
            margin: 0px 10px;
        }
    }
}
</style>