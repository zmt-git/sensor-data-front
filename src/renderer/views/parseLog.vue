<!--
 * @Description: 日志解析
 * @Author: zmt
 * @Date: 2021-10-08 09:18:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-01 17:23:46
-->
<template>
  <div class="d-parse-log center">
    <div class="d-parse-log-inner">
      <h3 class="d-parse-log-inner_title">日志解析</h3>
      <el-form :model='form' :rules="rules2" ref="form">
        <el-form-item prop='importDirectory'>
          <div @click='openDirectory'>
          <el-input
            ref="importDirectory"
            class="el-input__inner-radius"
            placeholder="日志目录"
            v-model="form.importDirectory"
            :style="style"
            clearable
            ></el-input>
            </div>
        </el-form-item>
        <el-form-item prop='type'>
          <el-select
            class="el-input__inner-radius"
            placeholder="导出类型"
            :style="style"
            v-model="form.type">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isExcel" prop='exportDirectory'>
          <div @click='openFile'>
            <el-input
              ref="exportDirectory"
              class="el-input__inner-radius"
              clearable
              v-model="form.exportDirectory"
              :style="style"
              placeholder="导出文件"
            ></el-input>
          </div>
        </el-form-item>
        <template v-else>
          <froward-form ref='form1' :form='databaseForm' :rules='rules'></froward-form>
        </template>
        <el-form-item>
          <el-button :loading='loading' type="primary" @click="submitForm" class="width-100">{{btnName}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import { ipcSend } from '@/ipc'
import { getStorage } from '@/util/cache/cacheConfig'
import FrowardForm from '../components/FrowardForm.vue'
export default {
  components: { FrowardForm },
  name: 'parse-log',

  computed: {
    isExcel () {
      return this.form.type === 1
    },

    btnName () {
      return this.isExcel ? '开始导出' : '开始入库'
    },

    databaseType () {
      return navList.filter(item => item.check)
    }
  },

  data () {
    return {
      loading: false,
      rules2: {
        importDirectory: [{ required: true, message: '请选择导入目录' }],
        type: [{ required: true, message: '请选择导出方式' }],
        exportDirectory: [{ required: true, message: '请导出文件' }]
      },
      form: {
        importDirectory: '',
        type: 1,
        exportDirectory: `${getStorage('savePath')}/${getStorage('logFileName')}.txt`
      },
      rules: {
        databaseType: [{ required: true, message: '请选择数据库类型' }],
        host: [{ required: true, message: '请输入主机' }],
        port: [{ required: true, message: '请输入端口' }],
        user: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        connectString: [{ required: true, message: '请输入链接字符串' }],
        tableName: [{ required: true, message: '请输入表名称' }]
      },
      databaseForm: {
        databaseType: 'MySQL',
        host: '',
        port: '',
        user: '',
        password: '',
        connectString: '',
        tableName: ''
      },
      options: [
        { value: 0, label: '入库' },
        { value: 1, label: '导出为txt文件' }
      ],
      style: {
        width: '300px'
      }
    }
  },

  methods: {

    parse (res) {
      this.loading = false
    },

    async openFile () {
      const properties = ['openFile']
      const filters = [
        { name: 'Txt', extensions: ['txt'] }
      ]
      const res = await ipcSend({ sign: 'dialog/openFile', params: { properties, filters } })

      this.form.exportDirectory = res.shift()

      this.$refs.exportDirectory.blur()
    },

    async openDirectory () {
      const res = await ipcSend({ sign: 'dialog/openFile', params: { properties: ['openDirectory'] } })
      this.form.importDirectory = res.shift()

      this.$refs.importDirectory.blur()
    },

    submitForm () {
      this.$refs.form.validate(async v => {
        if (v) {
          if (this.isExcel) {
            await this.parseFn()
          } else {
            this.$refs.form1.$refs.form.validate(async v => {
              if (v) {
                await this.parseFn()
              }
            })
          }
        }
      })
    },

    async parseFn () {
      this.loading = true
      try {
        await ipcSend({ sign: 'parse/parse', params: { base: this.form, database: this.databaseForm } })
        let msg = '解析成功'
        this.form.connectString ? msg = '入库成功' : msg = '解析成功'
        this.$message({ type: 'success', message: msg })
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    },

    async openFileDB () {
      try {
        if (this.form.databaseType === 'SQLite') {
          const obj = {
            properties: ['openFile'],
            filters: [
              { name: '*', extensions: ['db'] }
            ]
          }
          const res = await ipcSend({ sign: 'opeFlie', params: obj })
          this.form.connectString = res.shift()
          this.$refs.connectString.blur()
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.d-parse-log{
  width: 100%;
  height: 100%;
  overflow: auto;
  &-inner{
    &_title{
      text-align:center;
      margin: 10px 0px;
    }
  }
}
</style>
