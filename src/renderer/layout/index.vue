<!--
 * @Description: 基础布局
 * @Author: zmt
 * @Date: 2021-09-26 11:56:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-03 14:15:39
-->
<template>
  <div class="d-layout">
    <d-header @onClick="onClickHeader"></d-header>
    <section class="d-layout-section">
      <aside class="d-layout-aside">
        <div class="d-layout-aside-top">
          <aside-nav-item @onClick="setValue" :key="item.id" :value="currentDataBase" :nav='item' v-for="item in navList"></aside-nav-item>
        </div>
        <div class="d-layout-aside-bottom">
        </div>
      </aside>

      <main class="d-layout-content">
        <router-view></router-view>
      </main>
      <transition name="el-fade-in-linear">
        <d-setting v-show="drawer" :visible.sync='drawer' :config='config' @change='change'></d-setting>
      </transition>
    </section>
  </div>
</template>

<script>
import { navList, iconList } from '@/common/aside'
import { mapGetters } from 'vuex'
import AsideNavItem from '@/components/AsideNavItem.vue'
import DHeader from '@/components/Header.vue'
import DSetting from '../components/Setting.vue'
import { ipcSend } from '@/ipc'
import { ipcRenderer } from 'electron'
import { setStorage, getStorage } from '@/util/cache/cacheConfig'
export default {
  name: 'd-layout',

  components: { AsideNavItem, DHeader, DSetting },

  computed: {
    ...mapGetters(['Oracle', 'MySQL', 'SQLite', 'currentDataBase']),

    isLogin () {
      return this[this.currentDataBase]
    }
  },

  data () {
    return {
      iconValue: '',
      navList: navList,
      iconList: iconList,
      drawer: false,
      config: { savePath: '', logFileName: '' }
    }
  },

  async created () {
    ipcRenderer.once('created', this.ready)

    await this.changeSize()

    await this.getStorage()
  },

  methods: {
    async change (arg) {
      const { type, result } = arg
      switch (type) {
        case 'savePath' : result && setStorage('savePath', result)
          break
        default : result && setStorage()
      }

      await this.getStorage()
    },

    async ready () {
      await this.changeSize()
      await this.getStorage()
    },

    async changeSize () {
      try {
        await ipcSend({ sign: 'window/changeSize', params: { type: 1 } })
      } catch (e) {
        console.error(e)
      }
    },
    async getStorage () {
      const savePath = getStorage('savePath')

      const logFileName = getStorage('logFileName')

      const oracleInstallPath = getStorage('oracleInstallPath')

      const res = await ipcSend({ sign: 'storage/setStorage', params: { savePath, logFileName, oracleInstallPath } })

      setStorage('savePath', res.savePath)

      setStorage('logFileName', res.logFileName)

      setStorage('oracleInstallPath', res.oracleInstallPath)

      this.config = res
    },

    // 侧边栏切换
    async setValue (e) {
      if (this.currentDataBase === e.id) return
      await this.$store.dispatch('actionCurrentDataBase', e.id)
      if (e.check) {
        if (this.isLogin) {
          this.$router.push({ path: e.path, query: { type: e.id } })
        } else {
          this.$router.push({ path: '/', query: { type: e.id } })
        }
      } else {
        this.$router.push({ path: e.path, query: { type: e.id } })
      }
    },

    onClickHeader (item) {
      if (item.title === '设置') {
        this.drawer = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/handle.scss';
.d-layout{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &-section{
    flex: 1;
    width: 100%;
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
  }
  &-aside{
    -webkit-app-region: drag;
    width: 75px;
    height: 100%;
    @include bg-color('aside-bg');
    overflow: auto;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    &-top{
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 5px;
    }
    &-bottom{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      box-sizing: border-box;
      padding: 5px;
    }
  }
  &-content{
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>
