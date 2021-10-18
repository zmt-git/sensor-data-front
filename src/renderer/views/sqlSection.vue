<!--
 * @Description:
 * @Author: zmt
 * @Date: 2021-09-29 09:02:28
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-18 17:25:29
-->
<template>
  <div class="d-sql" @mouseup="onCancelMove">
    <SQL-header
      @importExcel='onRefresh'
      @query='query'
      @refresh='onRefresh'
    ></SQL-header>
    <section ref='section' class="d-sql-section" @mousedown="onStartMove">
      <SQL-aside :list='tableList' :current='currentTableName' @onClick='onCurrentTable'></SQL-aside>
      <main class="d-sql-section-main">
        <SQL-query v-model="statement"></SQL-query>
        <SQL-table :tableData="tableData"></SQL-table>
        <SQL-footer :pageNum='pageNum' :total="total" :pageSize="pageSize" @handleSizeChange='handleSizeChange' @handleCurrentChange='handleCurrentChange'></SQL-footer>
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
import { ipcSend } from '@/ipc'
import { Message } from 'element-ui'
import SQLFooter from '../components/SQL/SQLFooter.vue'
export default {
  name: 'd-sql-section',

  components: { SQLHeader, SQLAside, SQLQuery, SQLTable, SQLFooter },

  computed: {
    ...mapGetters(['currentDataBase', 'currentTableName'])
  },

  data () {
    return {
      statement: '',
      tableList: [],
      tableData: [],
      pageNum: 1,
      pageSize: 100,
      total: 0
    }
  },

  created () {
    this.onShowTables()
  },

  methods: {
    handleSizeChange (e) {},
    handleCurrentChange (e) {},
    // ==========切换表==========
    async onCurrentTable (item) {
      await this.$store.dispatch('actionsCurrentTableName', item)
      await this.getTableData()
    },

    // ==========获取表名数据==========
    async onShowTables () {
      try {
        const res = await ipcSend({ sign: 'database/getTableName', params: { type: this.currentDataBase } })
        this.tableList = res
      } catch (e) {
        console.error(e)
      }
    },

    // ==========获取指定表数据==========
    async getTableData () {
      try {
        const res = await ipcSend({ sign: 'database/getTableData', params: { type: this.currentDataBase, tableName: this.currentTableName, pageNum: this.pageNum, pageSize: this.pageSize } })
        this.tableData = res.records
        this.total = res.total
      } catch (e) {
        console.error(e)
      }
    },

    // ==========刷新表list数据==========
    async onRefresh () {
      await this.getTableData()
    },

    // ==========执行sql自定义语句语句=========
    async query () {
      if (!this.statement) {
        Message({ type: 'info', message: '询问语句不能为空' })
        return
      }
      try {
        await ipcSend({ sign: 'database/query', params: { type: this.currentDataBase, statement: this.statement } })
      } catch (e) {
        console.error(e)
      }
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
  },

  watch: {
    async '$route' (to, from) {
      await this.$store.dispatch('actionsCurrentTableName', '')
      this.onShowTables()
      this.statement = ''
      this.tableData = []
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
