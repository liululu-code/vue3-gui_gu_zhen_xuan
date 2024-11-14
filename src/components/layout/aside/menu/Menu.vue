<template>
    <template v-for="(item) in menuRoutes" :key="item.path">
        <el-menu-item v-if="!item.children && item.meta.show" :index="item.path">
            <el-icon>
                <component :is="item.meta.logo"></component>
            </el-icon>
            <template #title>
                {{ item.meta.title }}
            </template>
            
        </el-menu-item>

        <el-menu-item v-if="item.children && item.children.length == 1 && item.meta.show" :index="item.children[0].path">
            <el-icon>
                <component :is="item.children[0].meta.logo"></component>
            </el-icon>
            <template #title>
                {{ item.children[0].meta.title }}
            </template>

        </el-menu-item>

        <el-sub-menu v-if="item.children && item.children.length > 1 && item.meta.show" :index="item.path">
            <template #title>
                <el-icon>
                    <component :is="item.meta.logo"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <Menu :menuRoutes="item.children"></Menu>
        </el-sub-menu>
    </template>
</template>

<script setup lang="ts">
import Menu from './Menu.vue'
defineProps(['menuRoutes'])
</script>

<style scoped></style>



