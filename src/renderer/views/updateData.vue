<!--
 * @Description: 数据实时转发
 * @Author: zmt
 * @Date: 2021-10-08 09:17:40
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-01 17:08:27
-->
<template>
  <div class="d-update-data" v-loading='loading'>
    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">源数据库</h3>
      <froward-form ref="source" :form='source' :rules='rules'></froward-form>
    </div>

    <div class="d-update-data-center center">
      <el-button type="primary" @click="submitForm" class="width-100">
        <base-svg-icon iconName="icon-tongbu1" font-size="20px"></base-svg-icon>
      </el-button>
    </div>

    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">目标数据库</h3>
      <froward-form ref="target" :form='target' :rules='rules'></froward-form>
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
      rules: {
        databaseType: [{ required: true, message: '请选择数据库类型' }],
        host: [{ required: true, message: '请输入主机' }],
        port: [{ required: true, message: '请输入端口' }],
        user: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        connectString: [{ required: true, message: '请输入链接字符串' }],
        tableName: [{ required: true, message: '请输入表名称' }]
      },
      source: {
        databaseType: 'MySQL',
        host: '',
        port: '',
        user: '',
        password: '',
        connectString: '',
        tableName: ''
      },
      target: {
        databaseType: 'MySQL',
        host: '',
        port: '',
        user: '',
        password: '',
        connectString: '',
        tableName: ''
      },
      style: {
        width: '300px'
      }
    }
  },

  methods: {
    submitForm () {
      this.$refs.target.$refs.form.validate(v => {
        if (v) {
          this.$refs.source.$refs.form.validate(async v2 => {
            if (v2) {
              this.loading = true
              try {
                await ipcSend({ sign: 'updateData/forward', params: { source: this.source, target: this.target } })

                this.$message({ type: 'success', message: '转发成功' })
              } catch (e) {
                console.error(e)
              }
              this.loading = false
            }
          })
        }
      })
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
