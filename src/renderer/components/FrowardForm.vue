<!--
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-13 09:11:56
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-01 17:14:02
-->
<template>
  <el-form :model='form' :rules="rules" ref='form'>
    <el-form-item prop="databaseType">
      <el-select
        class="el-input__inner-radius"
        placeholder="源数据库类型"
        :style="style"
        v-model="form.databaseType">
        <el-option v-for="item in databaseType" :key="item.id" :value="item.id">
          <base-svg-icon :iconName="item.icon" font-size="40px"></base-svg-icon>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="host" v-if="!isSQLite">
      <el-input
        v-model="form.host"
        autocomplete="off"
        class="el-input__inner-radius"
        placeholder="主机"
        :style='style'
        ></el-input>
    </el-form-item>
    <el-form-item prop="port" v-if="!isSQLite">
      <el-input
        v-model="form.port"
        autocomplete="off"
        class="el-input__inner-radius"
        placeholder="端口"
        :style='style'
        ></el-input>
    </el-form-item>
    <el-form-item prop="user" v-if="!isSQLite">
      <el-input
        v-model="form.user"
        autocomplete="off"
        class="el-input__inner-radius"
        :placeholder="!isSQLite ? '用户名' : '文件地址'"
        :style='style'
        ></el-input>
    </el-form-item>
    <el-form-item prop="password" v-if="!isSQLite">
      <el-input
        type="password"
        v-model="form.password"
        autocomplete="off"
        class="el-input__inner-radius"
        :style='style'
        placeholder='密码'></el-input>
    </el-form-item>
    <el-form-item prop="connectString">
      <div @click='openFileDB'>
        <el-input
          ref='1'
          class="el-input__inner-radius"
          v-model="form.connectString "
          :style="style"
          placeholder="链接字符串"></el-input>
      </div>
    </el-form-item>
    <el-form-item prop="tableName">
      <el-input
        class="el-input__inner-radius"
        v-model="form.tableName "
        :style="style"
        placeholder="表名称"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { ipcSend } from '@/ipc'
import { navList } from '@/common/aside'
export default {
  name: 'd-forward-form',

  props: {
    form: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    }
  },

  components: { BaseSvgIcon },

  computed: {
    databaseType () {
      return navList.filter(item => item.check)
    },

    isSQLite () {
      return this.form.databaseType === 'SQLite'
    }
  },

  data () {
    return {
      style: {
        width: '300px'
      }
    }
  },

  methods: {
    async openFileDB () {
      try {
        if (this.form.databaseType === 'SQLite') {
          const obj = {
            properties: ['openFile'],
            filters: [
              { name: '*', extensions: ['db'] }
            ]
          }
          const res = await ipcSend({ sign: 'dialog/openFile', params: obj })
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
