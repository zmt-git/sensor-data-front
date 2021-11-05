<!--
 * @Description: 数据库登录界面
 * @Author: zmt
 * @Date: 2021-09-26 16:28:18
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-04 16:26:18
-->
<template>
  <div class="login-data-base" v-loading='loading'>
    <base-svg-icon :iconName="iconName" font-size='140px'></base-svg-icon>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
      <el-form-item prop="host" v-if="!isSQLite">
        <el-input
          v-model="ruleForm.host"
          autocomplete="off"
          class="el-input__inner-radius"
          placeholder="主机"
          :style='style'
          ></el-input>
      </el-form-item>
      <el-form-item prop="port" v-if="!isSQLite">
        <el-input
          v-model="ruleForm.port"
          autocomplete="off"
          class="el-input__inner-radius"
          placeholder="端口"
          :style='style'
          ></el-input>
      </el-form-item>
      <el-form-item prop="user" v-if="!isSQLite">
        <el-input
          v-model="ruleForm.user"
          autocomplete="off"
          class="el-input__inner-radius"
          :placeholder="!isSQLite ? '用户名' : '文件地址'"
          :style='style'
          ></el-input>
      </el-form-item>
      <el-form-item prop="password" v-if="!isSQLite">
        <el-input
         type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          class="el-input__inner-radius"
          :style='style'
          placeholder='密码'></el-input>
      </el-form-item>
      <el-form-item prop="connectString">
        <div @click="openFileDB">
          <el-input
            ref='connectString'
            v-model="ruleForm.connectString"
            autocomplete="off"
            class="el-input__inner-radius"
            :style='style'
            :placeholder="!isSQLite ? '数据库名' : '文件地址'"></el-input>
          </div>
      </el-form-item>
      <el-form-item prop="serverName" v-if="isOracle">
        <el-input
          ref='connectString'
          v-model="ruleForm.serverName"
          autocomplete="off"
          class="el-input__inner-radius"
          :style='style'
          placeholder="服务名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled='disabled' @click="submitForm()" class="width-100">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import { mapGetters } from 'vuex'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { ipcSend } from '@/ipc'

export default {
  name: 'login-data-base',

  components: { BaseSvgIcon },

  computed: {
    ...mapGetters(['Oracle', 'MySQL', 'SQLite', 'currentDataBase']),

    iconName () {
      const obj = navList.find(item => item.id === this.currentDataBase)
      return obj ? obj.icon : ''
    },

    disabled () {
      if (this.isSQLite) {
        return !this.ruleForm.connectString
      }
      return !this.ruleForm.user || !this.ruleForm.password
    },

    isSQLite () {
      return this.currentDataBase === 'SQLite'
    },

    isOracle () {
      return this.currentDataBase === 'Oracle'
    }
  },

  data () {
    return {
      loading: false,
      rules: {
        host: [{ required: true, message: '请输入主机' }],
        port: [{ required: true, message: '请输入端口' }],
        user: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        connectString: [{ required: true, message: '请输入链接字符串' }],
        serverName: [{ required: true, message: '请输入服务名' }]
      },
      ruleForm: {
        host: '192.168.2.135',
        port: '1521',
        user: 'system',
        password: '123456',
        connectString: 'OUTLN',
        serverName: 'XE'
      },
      style: {
        width: '300px'
      }
    }
  },

  methods: {
    // 链接数据库
    submitForm () {
      this.$refs.ruleForm.validate(async vali => {
        if (vali) {
          this.loading = true
          try {
            await ipcSend({ sign: 'database/connect', params: { type: this.currentDataBase, form: this.ruleForm } })
            await this.$store.dispatch('actionSqlIsLogin', { type: this.currentDataBase, value: true })
            await this.$router.push({ path: '/querySQL', query: { type: this.currentDataBase } })
          } catch (e) {
            console.error(e)
          }
          this.loading = false
        }
      })
    },

    async openFileDB () {
      try {
        if (this.isSQLite) {
          const obj = {
            properties: ['openFile'],
            filters: [
              { name: '*', extensions: ['db'] }
            ]
          }
          const res = await ipcSend({ sign: 'dialog/openFile', params: obj })
          this.ruleForm.connectString = res.shift()
          this.$refs.connectString.blur()
        }
      } catch (e) {
        console.error(e)
      }
    }
  },

  watch: {
    '$route' (to, from) {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.login-data-base{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
.fs60{
  font-size: 120px;
}
</style>
