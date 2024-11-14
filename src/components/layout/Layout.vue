<template>
    <div class="common-layout">
        <el-container>
            <el-aside class="aside" :class="{ 'isFold': isFold }">
                <Logo></Logo>
                <el-scrollbar class="aside-menu">
                    <el-menu :collapse="isFold" class="el-menu-vertical-demo" :default-active="route.path"
                        style="border-right: 0px" background-color="#001529" text-color="#959ea6" :router="true">
                        <Menu :menuRoutes="userStore.menuRoutes"></Menu>
                    </el-menu>
                </el-scrollbar>
            </el-aside>
            <el-container class="content-container">
                <el-header class="header">
                    <Tabbar></Tabbar>
                </el-header>
                <el-main class="main">
                    <el-scrollbar>
                        <router-view v-slot="{ Component }">
                            <component :is="Component" v-if="!refrush">
                            </component>
                        </router-view>
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
    
    
<script setup lang="ts">
import Logo from '@/components/layout/aside/logo/Logo.vue'
import Menu from '@/components/layout/aside/menu/Menu.vue'
import Tabbar from '@/components/layout/tabbar/Tabbar.vue'
import useUserStore from '@/stores/modules/user.ts'
import useLayoutSetting from '@/stores/modules/layoutSetting.ts'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'


const userStore = useUserStore()
const route = useRoute()
const layoutSetting = useLayoutSetting()
const { isFold, refrush } = storeToRefs(layoutSetting)


</script>

<style scoped lang="scss">
.aside {
    width: $home-layout-aside-width;
    height: 100vh;
    background-color: #001529;
    color: #959ea6;
    transition: all 0.3s;
    overflow: hidden;

    .aside-menu {
        height: calc(100vh - $logo-container-height);
    }
}

.isFold {
    width: 56px;
}

.content-container {
    // position: relative;
    // width: calc(100% - $home-layout-aside-width);
    height: 100vh;

    .header {
        // position: relative;
        height: 50px;
        background-color: green;
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
        // padding: 0px;
    }

    // .main {
    //     background-color: pink;
    // }
}
</style>