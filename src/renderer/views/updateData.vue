<!--
 * @Description: 数据实时转发
 * @Author: zmt
 * @Date: 2021-10-08 09:17:40
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-18 16:08:34
-->
<template>
  <div class="d-update-data" v-loading='loading'>
    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">源数据库</h3>
      <froward-form :form='source'></froward-form>
    </div>

    <div class="d-update-data-center center">
      <el-button type="primary" @click="submitForm" class="width-100">
        <base-svg-icon iconName="icon-tongbu1" font-size="20px"></base-svg-icon>
      </el-button>
    </div>

    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">目标数据库</h3>
      <froward-form :form='target'></froward-form>
    </div>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import { ipcSend } from '@/ipc'
import FrowardForm from '../components/FrowardForm.vue'
import BaseSvgIcon from '../components/BaseSvgIcon.vue'
export default {
  name: 'update-data',

  components: { FrowardForm, BaseSvgIcon },

  computed: {
    databaseType () {
      return navList.filter(item => item.check)
    }
  },

  data () {
    return {
      loading: false,
      source: {
        databaseType: 'MySQL',
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123456789',
        connectString: 'test',
        tableName: 'test'
      },
      target: {
        databaseType: 'MySQL',
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123456789',
        connectString: 'test',
        tableName: 'test'
      },
      style: {
        width: '300px'
      }
    }
  },

  methods: {
    async submitForm () {
      this.loading = true
      try {
        await ipcSend({ sign: 'updateData/forward', params: { source: this.source, target: this.target } })

        this.$message({ type: 'success', message: '转发成功' })
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.d-update-data{
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  &-title{
    text-align:center;
    margin: 10px 0px;
  }
  &-item{
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  &-center{
    width: 100px;
  }
}
</style>
