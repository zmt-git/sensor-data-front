<!--
 * @Description: 数据实时转发
 * @Author: zmt
 * @Date: 2021-10-08 09:17:40
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-13 10:09:10
-->
<template>
  <div class="d-update-data">
    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">源数据库</h3>
      <froward-form :form='source'></froward-form>
    </div>

    <div class="d-update-data-center center">
      <el-button type="primary" @click="submitForm" class="width-100" round>转发</el-button>
    </div>

    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">目标数据库</h3>
      <froward-form :form='target'></froward-form>
    </div>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import { message } from '@/util'
import eventBus from '@/util/eventBus'
import { onForward } from '@/ipc/updateData'
import FrowardForm from '../components/FrowardForm.vue'
export default {
  name: 'update-data',

  components: { FrowardForm },

  computed: {
    databaseType () {
      return navList.filter(item => item.check)
    }
  },

  data () {
    return {
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

  created () {
    eventBus.$on('forward', this.forward)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('forward', this.forward)
    })
  },

  methods: {
    submitForm () {
      console.log(this.source, this.target)
      onForward(this.source, this.target)
    },

    forward (res) {
      this.loading = false
      message(res)
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.d-update-data{
  width: 100%;
  height: 100%;
  display: flex;
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
