<template>
    <svg>
      <use :xlink:href="'#icon-'+name" :=rest></use>
    </svg>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

const $attrs = useAttrs()
const { name, ...rest} = $attrs
</script>

<style lang="scss" scoped>

</style>