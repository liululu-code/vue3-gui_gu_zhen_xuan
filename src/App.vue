<template>
  <div>
    <!-- App -->
    <!-- <el-button type="primary">主线</el-button> -->
    <!-- <TestComponent/>
    <br>
    <SvgIcon name="house" fill="red" size="small"></SvgIcon> -->
      <router-view></router-view>
  </div>
</template>


<script setup lang="ts">
  // import TestComponent from '@/components/TestComponent.vue'
  

  
</script>



<style>
/* el-select行内宽度自动设置异常，手动设置宽度 */
.el-form--inline {
  .el-form-item {
    .el-input, .el-cascader, .el-select, .el-autocomplete {
      width: 120px;
    }
  }
}

.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table .info-row {
  --el-table-tr-bg-color: var(--el-color-info-light-9);
}
</style>
 