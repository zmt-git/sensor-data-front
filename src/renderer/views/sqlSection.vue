<!--
 * @Description:
 * @Author: zmt
 * @Date: 2021-09-29 09:02:28
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 11:17:30
-->
<template>
  <div class="d-sql" @mouseup="onCancelMove">
    <SQL-header
      @query='query'
      @refresh='onRefresh'
      :queryLoading='queryLoading'
      :refreshLoading='refreshLoading'
    ></SQL-header>
    <section ref='section' class="d-sql-section" @mousedown="onStartMove">
      <SQL-aside :list='tableList' :current='currentTableName' @onClick='onCurrentTable'></SQL-aside>
      <main class="d-sql-section-main">
        <SQL-query v-model="statement"></SQL-query>
        <SQL-table :tableData="tableData"></SQL-table>
      </main>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SQLAside from '@/components/SQL/SQLAside.vue'
import SQLHeader from '@/components/SQL/SQLHeader.vue'
import SQLQuery from '@/components/SQL/SQLQuery.vue'
import SQLTable from '@/components/SQL/SQLTable.vue'
import { emitQuery, emitGetTableName } from '@/ipc/database'
import eventBus from '@/util/eventBus'
import { Message } from 'element-ui'
export default {
  name: 'd-sql-section',

  components: { SQLHeader, SQLAside, SQLQuery, SQLTable },

  computed: {
    ...mapGetters(['currentDataBase', 'currentTableName'])
  },

  data () {
    return {
      refreshLoading: false,
      queryLoading: false,
      statement: '',
      tableList: [],
      tableData: []
    }
  },

  created () {
    this.onShowTables()

    eventBus.$on('query', this.onQuery)
    eventBus.$on('getTableName', this.getTableName)
    eventBus.$on('importExcel', this.onImportExcel)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('query', this.onQuery)
      eventBus.$off('importExcel', this.onImportExcel)
      eventBus.$off('getTableName', this.getTableName)
    })
  },

  methods: {
    // ==========切换表==========
    onCurrentTable (item) {
      this.$store.dispatch('actionsCurrentTableName', item)
      this.getTableData()
    },
    // ==========查询回调==========
    onQuery (res) {
      if (res.code === 1) {
        let fn
        switch (res.result.sign) {
          case 'selectAll' : fn = this.setTableData
            break
          case 'custom' : fn = this.getTableData
            break
          default : fn = undefined
        }
        fn && fn(res.result)
      } else {
        this.refreshLoading = false
        this.queryLoading = false
      }
    },

    getTableName (res) {
      console.log(res)
      this.tableList = res.result
    },

    // ==========导入数据成功==========
    importExcel (res) {
      if (res.code === 1) {
        this.onRefresh()
      }
    },

    // ==========获取表list数据==========
    onShowTables () {
      emitGetTableName(this.currentDataBase)
    },

    // ==========获取表指定表数据==========
    getTableData () {
      emitQuery(this.currentDataBase, 'selectAll', `select * from ${this.currentTableName}`)
    },

    // ==========设置表指定表数据==========
    setTableData (result) {
      this.refreshLoading = false
      this.queryLoading = false
      this.tableData = result.result
    },

    // ==========刷新表list数据==========
    onRefresh () {
      this.refreshLoading = true
      this.getTableData()
    },

    // ==========执行sql语句=========
    query () {
      if (!this.statement) {
        Message({ type: 'info', message: '询问语句不能为空' })
        return
      }
      this.queryLoading = true
      emitQuery(this.currentDataBase, 'custom', this.statement)
    },

    // ==========改变侧边栏大小 移动开始==========
    onStartMove (e) {
      if (e.target.id === 'resize' && e.button === 0) {
        this.$refs.section.addEventListener('mousemove', this.setElementWidth)
      }
    },

    // ==========改变侧边栏大小 移动结束==========
    onCancelMove (e) {
      this.$refs.section.removeEventListener('mousemove', this.setElementWidth)
    },

    // ==========获取侧边栏元素==========
    getElement () {
      return document.querySelector('#sqlAside')
    },

    // ==========设置侧边栏元素大小==========
    setElementWidth (e) {
      const element = this.getElement()
      element.style.width = e.clientX - element.getBoundingClientRect().left + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.d-sql{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  &-section{
    flex: 1;
    overflow: auto;
    display: flex;
    &-main{
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
