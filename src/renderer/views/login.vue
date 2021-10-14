<!--
 * @Description: 登录界面
 * @Author: zmt
 * @Date: 2021-09-26 11:59:49
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 11:39:00
-->

<template>
  <div class="d-login">
    <d-header :isLogin='true' bg='#fff'></d-header>
    <section class="d-login-section">
      <div
        class="d-login-form"
        v-loading='loading'
      >
        <div class="d-login-form-logo">
          <img class='' src="../assets/logo.png" alt="logo">
        </div>

        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off" class="el-input__inner-radius no-drag" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off" class="el-input__inner-radius no-drag" placeholder='密码'></el-input>
          </el-form-item>
          <el-form-item class="center">
            <el-button type="primary" class="no-drag" circle :disabled='disabled' @click="submitForm('ruleForm')" >
              <base-svg-icon iconName="icon-youjiantou" font-size="20px"></base-svg-icon>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="d-login-ad">
      </div> -->
    </section>
  </div>
</template>

<script>
import { loginRequest } from '@/api/login'
import { setToken } from '@/util/auth/token'
import BaseSvgIcon from '../components/BaseSvgIcon.vue'
import DHeader from '@/components/Header.vue'
import { ipcSend } from '@/ipc'

export default {
  name: 'd-login',

  components: { BaseSvgIcon, DHeader },

  computed: {
    disabled () {
      return !this.ruleForm.username || !this.ruleForm.password
    }
  },

  data () {
    return {
      rules: {},
      loading: false,
      ruleForm: {
        username: '',
        password: ''
      }
    }
  },

  async mounted () {
    try {
      await ipcSend({ sign: 'window/changeSize', params: { type: 0 } })
    } catch (e) {
      console.error(e)
    }
  },

  methods: {
    // 登录
    submitForm () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.loading = true

          await loginRequest(this.form)
            .then(() => {
              setToken('123')
              this.$router.push('/')
            })
            .catch((err) => console.log(err))

          this.loading = false

          setToken('123')

          this.$router.push('/')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.d-login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  -webkit-app-region: drag;
  &-section{
    display: flex;
    flex: 1;
  }
  &-form{
    width: 300px;
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &-title{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 40px;
    }
    &-logo{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40px;
      & img{
        width: 50px;
        height: 50px;
      }
    }
  }
  &-ad{
    flex: 1;
    height: 100%;
    background-color: #f0f0f0;
  }
}
</style>
