<!--
 * @Description: 数据库登录界面
 * @Author: zmt
 * @Date: 2021-09-26 16:28:18
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 14:38:48
-->
<template>
  <div class="login-data-base" v-loading='loading'>
    <base-svg-icon :iconName="iconName" font-size='140px'></base-svg-icon>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
      <el-form-item prop="username">
        <el-input
          v-model="ruleForm.username"
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
       <el-form-item prop="database" v-if="!isSQLite">
        <el-input
          v-model="ruleForm.database"
          autocomplete="off"
          class="el-input__inner-radius"
          :style='style'
          placeholder="链接字符串"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled='disabled' @click="submitForm()" class="width-100" round>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { navList } from '@/common/aside'
import eventBus from '@/util/eventBus'
import { connection } from '@/ipc/database'
import { mapGetters } from 'vuex'
import BaseSvgIcon from '@/components/BaseSvgIcon.vue'
export default {
  name: 'login-data-base',

  components: { BaseSvgIcon },

  computed: {
    ...mapGetters(['currentDataBase']),

    iconName () {
      const obj = navList.find(item => item.id === this.currentDataBase)
      return obj ? obj.icon : ''
    },

    disabled () {
      if (this.isSQLite) {
        return !this.ruleForm.username
      }
      return !this.ruleForm.username || !this.ruleForm.password
    },

    isSQLite () {
      return this.currentDataBase === 'SQLite'
    }
  },

  created () {
    eventBus.$on('icpSuccess', this.connectSuccess)
    eventBus.$on('icpError', this.error)

    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('icpSuccess', this.connectSuccess)
      eventBus.$off('icpError', this.error)
    })
  },

  data () {
    return {
      loading: false,
      rules: {},
      ruleForm: {
        username: '',
        password: '',
        database: ''
      },
      style: {
        width: '300px'
      }
    }
  },

  methods: {
    submitForm () {
      this.loading = true
      if (this.currentDataBase === 'SQLite') {
        connection(this.currentDataBase, this.ruleForm.username)
      } else {
        connection(this.currentDataBase, this.ruleForm)
      }
    },

    connectSuccess () {
      this.loading = false
      switch (this.currentDataBase) {
        case 'MySQL' : this.$store.dispatch('actionMysqlIsLogin', true)
          break
        case 'Oracle' : this.$store.dispatch('actionOracleIsLogin', true)
          break
        case 'SQLite' : this.$store.dispatch('actionSqliteIsLogin', true)
          break
        default : this.$store.dispatch('actionMysqlIsLogin', true)
      }
      this.$router.push({ path: '/querySQL', query: { type: this[this.currentDataBase] } })
    },

    error () {
      this.loading = false
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
