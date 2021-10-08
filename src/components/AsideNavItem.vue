<!--
 * @Description: 导航 top item
 * @Author: zmt
 * @Date: 2021-09-26 15:33:22
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 09:08:31
-->
<template>
  <div class="aside-nav-item" :class="active" @click="onClick" :title="nav.id">
    <base-svg-icon :iconName="nav.icon"></base-svg-icon>
    <span class="aside-nav-item-name">{{nav.name ? nav.name : ''}}</span>
  </div>
</template>

<script>
import BaseSvgIcon from './BaseSvgIcon.vue'
export default {
  components: { BaseSvgIcon },
  name: 'd-aside-nav-item',

  props: {
    nav: {
      type: Object,
      default: () => {}
    },
    value: {
      type: [String, Number],
      default: ''
    },
    valueKey: {
      type: String,
      default: 'id'
    }
  },

  computed: {
    active () {
      return this.nav[this.valueKey] && this.value === this.nav[this.valueKey] ? 'active' : ''
    }
  },

  methods: {
    onClick () {
      this.$emit('onClick', this.nav)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/handle.scss';
.aside-nav-item{
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items:center;
  margin-bottom: 5px;
  border-radius: 5px;
  transition: all 0.3s;
  -webkit-app-region: no-drag;
  &-icon{
    font-size: 30px;
    @include color('aside-color');
    margin-bottom: 10px;
  }
  &-name{
    font-size: 12px;
    text-align:center;
  }
}
.active{
  background-color: rgba(0,0,0,0.1)
}
</style>
