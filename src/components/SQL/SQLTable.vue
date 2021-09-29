<!--
 * @Description: 表数据
 * @Author: zmt
 * @Date: 2021-09-29 08:57:28
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 11:43:22
-->
<template>
  <div class="d-sql-table">
     <el-table
      :data="tableData"
      size='mini'
      stripe
      header-cell-class-name='table-header'
      style="width: 100%">
      <template v-for="key in keys">
        <el-table-column
          :key="key"
          :prop="key"
          :label="key"
        >
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'd-sql-table',

  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    keys () {
      if (this.tableData.length) {
        return Object.keys(this.tableData[0])
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/handle.scss';
.d-sql-table{
  flex: 1;
  height: 0;
  overflow: auto;
}
</style>
<style lang="scss">
@import '~@/styles/handle.scss';

.table-header{
  background-color: #F2F6FC!important;
}
</style>
