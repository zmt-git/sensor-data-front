<!--
 * @Description: 窗口
 * @Author: zmt
 * @Date: 2021-09-27 08:54:37
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 15:37:32
-->
<template>
  <header class="d-header" :style="{ backgroundColor: bg }">
    <div class="d-header-item">
      <div class="d-header-item-avatar" v-show="!isLogin">
        <span @click="onShowInfo" class="d-header-item-avatar-inner" slot="reference">
          <el-avatar icon="el-icon-user-solid" size='small'></el-avatar>
        </span>
        <transition name="el-zoom-in-top">
          <ul v-show="show" class="d-header-item-avatar-info">
            <li v-for="item in fnList" :key="item.id" @click="onClickInfo(item)">{{item.title}}</li>
          </ul>
        </transition>
      </div>
    </div>
    <div class="d-header-item d-header-right">
      <span v-if="!isLogin" class="d-header-item-icon" title="最小化" @click='headerControl("window-min")'>
        <base-svg-icon iconName='icon-zuixiaohua' font-size="14px"></base-svg-icon>
      </span>
      <span v-if="!isLogin" class="d-header-item-icon" :title="maxTitle" @click='headerControl("window-max")'>
        <base-svg-icon :iconName='isMaxIcon' font-size="14px"></base-svg-icon>
      </span>
      <span class="d-header-item-icon" title='关闭' @click='headerControl("window-close")'>
        <base-svg-icon v-if="!isLogin" iconName='icon-guanbi' font-size="14px"></base-svg-icon>
        <base-svg-icon v-else iconName='icon-guanbi-copy' font-size="14px"></base-svg-icon>
      </span>
    </div>
  </header>
</template>

<script>
import BaseSvgIcon from './BaseSvgIcon.vue'
import eventBus from '@/util/eventBus'
import { headerIpc } from '@/ipc/header'
import { removeToken } from '@/util/auth/token'
export default {
  name: 'd-header',

  props: {
    bg: {
      type: String,
      default: ''
    },
    isLogin: {
      type: Boolean,
      default: false
    }
  },

  components: { BaseSvgIcon },

  computed: {
    isMaxIcon () {
      return this.isMax ? 'icon-huanyuan' : 'icon-zuidahua'
    },

    maxTitle () {
      return this.isMax ? '还原' : '最大化'
    }
  },

  data () {
    return {
      isMax: false,
      show: false,
      fnList: [
        { title: '设置', id: 1, name: 'setting' },
        { title: '退出', id: 2, name: 'layout' }
      ]
    }
  },

  created () {
    eventBus.$on('isMax', (val) => {
      this.isMax = val
    })
    this.$once('hook:beforeDestroy', () => {
      eventBus.$off('isMax')
    })
  },

  mounted () {
    document.addEventListener('click', this.onHiddenInfo)

    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('click', this.onHiddenInfo)
    })
  },

  methods: {
    // 头部操作
    headerControl (type) {
      headerIpc(type)
    },
    // 隐藏程序
    onHiddenInfo () {
      this.show = false
    },
    // 显示程序
    onShowInfo (event) {
      this.show = !this.show
      event.stopPropagation()
    },
    // 头像点击
    onClickInfo (item) {
      if (item.title === '退出') {
        this.logout()
      } else {
        this.$emit('onClick', item)
      }
    },
    // 退出登录
    logout () {
      this.$confirm('确认退出该账号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: true
      }).then(async () => {
        removeToken()
        await this.$store.dispatch('actionClearAllState')
        this.$router.push('/login')
      }).catch(() => {
        console.log('cancel')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/handle.scss';

.d-header{
  z-index: 3000px;
  -webkit-app-region: drag;
  width: 100%;
  height: 40px;
  display: flex;
  justify-content:space-between;
  align-items: center;
  flex-shrink: 0;
  @include bg-color('header-bg');
  &-right{
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  &-item{
    height: 100%;
    box-sizing: border-box;
    padding: 5px;
    display: flex;
    align-items: center;
    &-icon{
      padding: 5px 8px;
      cursor: pointer;
      border-radius: 5px;
      transition: all 0.3s;
    }
    &-icon:hover{
      background-color: rgba(255,255,255,0.2)
    }
    &-avatar{
      width: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      &-inner{
        -webkit-app-region: no-drag;
        padding: 3px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;
      }
      &-inner:hover{
        background-color: rgba(255,255,255,0.2)
      }
      &-info{
        width: 200px;
        position: absolute;
        top: 37px;
        left: -5px;
        box-shadow: 3px 3px 10px 1px #f0f0f0;
        @include bg-color('info-bg');
        box-sizing: border-box;
        padding: 5px;
        z-index: 3000;
        & li{
          font-size: 13px;
          line-height: 40px;
          box-sizing: border-box;
          padding: 0 10px;
          border-radius: 5px;
          @include color('info-color');
          transition: all 0.3s;
          cursor: pointer;
        }
        & li:hover{
          background-color: rgba(0,0,0,0.1)
        }
      }
    }
  }
}
</style>
