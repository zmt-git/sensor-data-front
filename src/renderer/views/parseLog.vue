<!--
 * @Description: 日志解析
 * @Author: zmt
 * @Date: 2021-10-08 09:18:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 14:18:57
-->
<template>
  <div class="d-parse-log center">
    <div class="d-parse-log-inner">
      <h3 class="d-parse-log-inner_title">日志解析</h3>
      <el-form :model='form'>
        <el-form-item>
          <div @click='onIpcDirectory("importDirectory")'>
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
        <el-form-item>
          <el-select
            class="el-input__inner-radius"
            placeholder="导出类型"
            :style="style"
            v-model="form.type">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isExcel">
          <div @click='onIpcDirectory("exportDirectory")'>
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
          <el-form-item>
            <el-select
              class="el-input__inner-radius"
              placeholder="数据库类型"
              :style="style"
              v-model="form.databaseType">
              <el-option v-for="item in databaseType" :key="item.id" :value="item.id">
                <base-svg-icon :iconName="item.icon" font-size="40px"></base-svg-icon>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div @click='openFileDB("connectString")'>
              <el-input
                class="el-input__inner-radius"
                v-model="form.connectString "
                :style="style"
                placeholder="链接字符串"></el-input>
            </div>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button :loading='loading' type="primary" @click="submitForm" class="width-100" round>{{btnName}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import eventBus from '@/util/eventBus'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { onDialog } from '@/ipc/dialog'
import { onParse } from '@/ipc/parse'
import { config } from '#/config/index'
export default {
  components: { BaseSvgIcon },
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
      form: {
        importDirectory: '',
        type: 1,
        exportDirectory: `${config.savePath}/${config.logFileName}.txt`,
        databaseType: '',
        connectString: ''
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

  created () {
    eventBus.$on('onDialog', this.setValue)
    eventBus.$on('parse', this.parse)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('onDialog', this.setValue)
      eventBus.$off('parse', this.parse)
    })
  },

  methods: {
    setValue (type, value) {
      if (Array.isArray(value) && value.length > 0) {
        this.form[type] = value.shift()
      }
      this.$refs[type].blur()
    },

    parse (res) {
      this.loading = false
    },

    onIpcDirectory (directory) {
      let properties = ['openDirectory']
      let filters = []
      if (directory === 'exportDirectory') {
        properties = ['openFile']
        filters = [
          { name: 'Txt', extensions: ['txt'] }
        ]
      }
      onDialog(directory, { properties, filters })
    },

    submitForm () {
      this.loading = true
      onParse(this.form)
    },

    openFileDB (type) {
      if (this.form.databaseType === 'SQLite') {
        const obj = {
          properties: ['openFile'],
          filters: [
            { name: 'db', extensions: ['db'] }
          ]
        }
        onDialog(type, obj)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.d-parse-log{
  width: 100%;
  height: 100%;
  &-inner{
    &_title{
      text-align:center;
      margin: 10px 0px;
    }
  }
}
</style>
