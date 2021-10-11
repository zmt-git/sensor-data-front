<!--
 * @Description: sql顶部操作栏
 * @Author: zmt
 * @Date: 2021-09-29 08:59:24
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 10:57:55
-->
<template>
  <div class="d-sql-header">
    <span class="d-sql-header-icon center" :class='refreshLoading ? "rotate disabled" : ""' title="刷新" @click="onClickRefresh">
      <base-svg-icon iconName="icon-tongbu" :font-size="fontSize"></base-svg-icon>
    </span>
    <span class="d-sql-header-icon center" :class='queryLoading ? "rotate disabled" : ""' title="执行" @click="onClickQuery">
      <base-svg-icon iconName="icon-zhihang" :font-size="fontSize"></base-svg-icon>
    </span>
    <span class="d-sql-header-icon center" title="导入excel" @click="onClickImport">
      <base-svg-icon iconName="icon-excel_in" :font-size="fontSize"></base-svg-icon>
    </span>
    <span class="d-sql-header-icon center" title="导出为excel" @click="onClickExport">
      <base-svg-icon iconName="icon-excel_out" :font-size="fontSize"></base-svg-icon>
    </span>
    <span class="d-sql-header-icon center" title="断开链接" @click="onClose">
      <base-svg-icon iconName="icon-duankailianjie" :font-size="fontSize"></base-svg-icon>
    </span>
  </div>
</template>

<script>
import { emitExportExcel, emitImportExcel } from '@/ipc/database'
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['currentDataBase', 'currentTableName'])
  },
  data () {
    return {
      fontSize: '24px'
    }
  },
  methods: {
    // 执行语句
    onClickQuery (type) {
      if (this.queryLoading) return
      this.$emit('query')
    },
    // 刷新
    onClickRefresh () {
      if (this.refreshLoading) return
      this.$emit('refresh')
    },
    // 导入excel
    onClickImport () {
      emitImportExcel(this.currentDataBase, this.currentTableName)
    },
    // 导出excel
    onClickExport () {
      emitExportExcel(this.currentDataBase, this.currentTableName)
    },
    // 断开链接
    onClose () {
      this.$confirm('确认断开当前数据库？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true
      }).then(async () => {
        await this.$store.dispatch('actionSqlIsLogin', { type: this.currentDataBase, value: false })
        this.$router.push({ path: '/', query: { type: this.currentDataBase } })
      }).catch(() => {})
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
