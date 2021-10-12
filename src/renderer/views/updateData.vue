<!--
 * @Description: 数据实时转发
 * @Author: zmt
 * @Date: 2021-10-08 09:17:40
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 14:07:14
-->
<template>
  <div class="d-update-data">
    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">源数据库</h3>
      <el-form :model='form'>
          <el-form-item>
            <el-select
              class="el-input__inner-radius"
              placeholder="源数据库类型"
              :style="style"
              v-model="form.sourceDatabaseType">
              <el-option v-for="item in databaseType" :key="item.id" :value="item.id">
                <base-svg-icon :iconName="item.icon" font-size="40px"></base-svg-icon>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div @click='openFileDB(1)'>
              <el-input
                ref='1'
                class="el-input__inner-radius"
                v-model="form.sourceConnectString "
                :style="style"
                placeholder="链接字符串"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-input
              class="el-input__inner-radius"
              v-model="form.sourceTableName "
              :style="style"
              placeholder="表名称"></el-input>
          </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm" class="width-100" round>{{btnName}}</el-button>
        </el-form-item> -->
      </el-form>
    </div>

    <div class="d-update-data-center center">
      <el-button type="primary" @click="submitForm" class="width-100" round>转发</el-button>
    </div>

    <div class="d-update-data-item center">
      <h3 class="d-update-data-title">目标数据库</h3>
      <el-form :model='form'>
          <el-form-item>
            <el-select
              class="el-input__inner-radius"
              placeholder="目标数据库类型"
              :style="style"
              v-model="form.targetDatabaseType">
              <el-option v-for="item in databaseType" :key="item.id" :value="item.id">
                <base-svg-icon :iconName="item.icon" font-size="40px"></base-svg-icon>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div @click='openFileDB(2)'>
              <el-input
                ref='2'
                class="el-input__inner-radius"
                v-model="form.targetConnectString "
                :style="style"
                placeholder="链接字符串"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-input
              class="el-input__inner-radius"
              v-model="form.targetTableName "
              :style="style"
              placeholder="表名称"></el-input>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { message } from '@/util'
import eventBus from '@/util/eventBus'
import { onForward } from '@/ipc/updateData'
import { onDialog } from '@/ipc/dialog'
export default {
  name: 'update-data',

  components: { BaseSvgIcon },

  computed: {
    databaseType () {
      return navList.filter(item => item.check)
    }
  },

  data () {
    return {
      form: {
        sourceDatabaseType: 'MySQL',
        sourceConnectString: 'test',
        sourceTableName: 'test',
        targetDatabaseType: 'MySQL',
        targetConnectString: 'test',
        targetTableName: 'test2'
      },
      style: {
        width: '300px'
      }
    }
  },

  created () {
    eventBus.$on('forward', this.forward)
    eventBus.$on('onDialog', this.setValue)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('forward', this.forward)
      eventBus.$off('onDialog', this.setValue)
    })
  },

  methods: {
    submitForm () {
      onForward(this.form)
    },

    forward (res) {
      this.loading = false
      message(res)
      console.log(res)
    },

    setValue (type, res) {
      const val = res.pop()
      type === 1 ? this.form.sourceConnectString = val : this.form.targetConnectString = val
      this.$refs[type].blur()
    },

    openFileDB (type) {
      if ((type === 1 && this.form.sourceDatabaseType === 'SQLite') || (type === 2 && this.form.targetDatabaseType === 'SQLite')) {
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
