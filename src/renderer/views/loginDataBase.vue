<!--
 * @Description: 数据库登录界面
 * @Author: zmt
 * @Date: 2021-09-26 16:28:18
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-13 09:46:17
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
            :placeholder="!isSQLite ? '链接字符串' : '文件地址'"></el-input>
          </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled='disabled' @click="submitForm()" class="width-100" round>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import { emitConnect } from '@/ipc/database'
import { mapGetters } from 'vuex'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
import { onDialog } from '@/ipc/dialog'
import eventBus from '@/util/eventBus'

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
    }
  },

  created () {
    eventBus.$on('connect', this.onConnect)
    eventBus.$on('onDialog', this.setPath)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('connect', this.onConnect)
      eventBus.$off('onDialog', this.setPath)
    })
  },

  data () {
    return {
      loading: false,
      rules: {},
      ruleForm: {
        host: '',
        port: '',
        user: 'root',
        password: '123456789',
        connectString: 'test'
      },
      style: {
        width: '300px'
      }
    }
  },

  methods: {
    // 链接数据库
    submitForm () {
      this.loading = true
      emitConnect(this.currentDataBase, this.ruleForm)
    },

    async onConnect (res) {
      this.loading = false
      if (res.code === 1) {
        await this.$store.dispatch('actionSqlIsLogin', { type: this.currentDataBase, value: true })
        await this.$router.push({ path: '/querySQL', query: { type: this.currentDataBase } })
      }
    },

    openFileDB () {
      if (this.isSQLite) {
        const obj = {
          properties: ['openFile'],
          filters: [
            { name: 'Txt', extensions: ['db'] }
          ]
        }
        onDialog('sqlite', obj)
      }
    },

    setPath (type, value) {
      this.ruleForm.connectString = value.shift()
      this.$refs.connectString.blur()
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
}
.fs60{
  font-size: 120px;
}
</style>
