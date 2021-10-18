<!--
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-18 17:03:34
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-18 17:11:25
-->
<template>
  <div class='d-sql-footer'>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'sql-footer',

  props: {
    total: {
      type: Number,
      default: 0
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 100
    }
  },

  methods: {
    handleSizeChange (e) {
      this.$emit('handleSizeChange', e)
    },

    handleCurrentChange (e) {
      this.$emit('handleCurrentChange', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.d-sql-footer{
  flex-shrink: 0;
}
</style>
