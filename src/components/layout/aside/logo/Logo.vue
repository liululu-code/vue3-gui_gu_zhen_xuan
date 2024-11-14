<template>
    <div class="logo-container">
        <img class="logo-image" :src=setting.logo.imageUrl alt="">
        <span class="logo-text">{{ setting.logo.text }}</span>
    </div>
</template>

<script setup lang="ts">
import setting from '@/setting.ts'

</script>

<style scoped lang="scss">
    .logo-container {
        width: 90%;
        height: $logo-container-height;
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 18px;
    }
    .logo-image {
        display: inline-block;
        width: calc($logo-container-height - 12px);
        height: calc($logo-container-height - 12px);
        border-radius: 20px;
        margin-left: 10px;
    }

    .logo-text {
        display: inline-block;
        margin-left: 10px;
        white-space: nowrap
    }
</style>