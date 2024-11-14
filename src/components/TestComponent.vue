<template>
    <div>
        test
        <el-button type="primary" @click="testLogin">testLogin</el-button>
    </div>
</template>

<script setup lang="ts">
import {reqLogin} from '@/api/user'

    function testLogin() {
        reqLogin(
            {
                username: 'admin',
                password: '123456'
            }
        )
    }
</script>

<style scoped lang="scss">
    div {
        color: $color;
    }
</style>