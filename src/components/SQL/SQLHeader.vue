<!--
 * @Description: sql顶部操作栏
 * @Author: zmt
 * @Date: 2021-09-29 08:59:24
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 16:39:02
-->
<template>
  <div class="d-sql-header">
    <span class="d-sql-header-icon center" :class='refreshLoading ? "rotate disabled" : ""' title="刷新" @click="onClickRefresh">
      <base-svg-icon iconName="icon-tongbu" font-size="30px"></base-svg-icon>
    </span>
    <span class="d-sql-header-icon center" :class='queryLoading ? "rotate disabled" : ""' title="执行" @click="onClickQuery">
      <base-svg-icon iconName="icon-zhihang" font-size="30px"></base-svg-icon>
    </span>
    <span class="d-sql-header-icon center" title="导入excel" @click="onClickImport">
      <base-svg-icon iconName="icon-excel_in" font-size="30px"></base-svg-icon>
    </span>
    <span class="d-sql-header-icon center" title="导出为excel" @click="onClickExport">
      <base-svg-icon iconName="icon-excel_out" font-size="30px"></base-svg-icon>
    </span>
  </div>
</template>

<script>
import BaseSvgIcon from '../BaseSvgIcon.vue'
export default {
  name: 'd-sql-header',
  props: {
    refreshLoading: {
      type: Boolean,
      default: false
    },
    queryLoading: {
      type: Boolean,
      default: false
    }
  },
  components: { BaseSvgIcon },
  methods: {
    onClickQuery (type) {
      if (this.queryLoading) return
      this.$emit('query')
    },
    onClickRefresh () {
      if (this.refreshLoading) return
      this.$emit('refresh')
    },
    onClickImport () {

    },
    onClickExport () {

    }
  }
}
</script>

<style lang="scss" scoped>
.d-sql-header{
  height: 40px;
  display: flex;
  align-items:center;
  border-bottom: 1px solid #f0f0f0;
  &-icon{
    border-radius: 50%;
    height: 30px;
    width: 30px;
    margin: 0 5px;
    overflow: hidden;
    cursor: pointer;
    transition: all 1s;
  }
  &-icon:hover{
    background-color: rgba(0,0,0,0.1)
  }
}
.disabled{
  cursor: no-drop;
}
</style>
