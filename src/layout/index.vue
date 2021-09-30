<!--
 * @Description: 基础布局
 * @Author: zmt
 * @Date: 2021-09-26 11:56:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-30 15:48:10
-->
<template>
  <div class="d-layout">
    <d-header></d-header>
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
    </section>
  </div>
</template>

<script>
import { navList, iconList } from '@/common/aside'
import { removeToken } from '@/util/auth/token'
import { mapGetters } from 'vuex'
import AsideNavItem from '@/components/AsideNavItem.vue'
import DHeader from '@/components/Header.vue'
import { ipcRenderer } from 'electron'

export default {
  name: 'd-layout',

  components: { AsideNavItem, DHeader },

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
      iconList: iconList
    }
  },

  mounted () {
    ipcRenderer.send('changeSize', 1)
  },

  methods: {
    async setValue (e) {
      if (this.currentDataBase === e.id) return
      await this.$store.dispatch('actionCurrentDataBase', e.id)
      if (this.isLogin) {
        this.$router.push({ path: '/querySQL', query: { type: e.id } })
      } else {
        this.$router.push({ path: '/', query: { type: e.id } })
      }
    },

    onClickIcon (e) {
      this.iconValue = e.id
      removeToken()
      this.$router.push('/login')
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
  }
}
</style>
