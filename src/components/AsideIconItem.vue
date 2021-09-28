<!--
 * @Description: 导航 bottom item
 * @Author: zmt
 * @Date: 2021-09-26 15:33:22
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-27 09:28:33
-->
<template>
  <div class="aside-icon-item" :class="active" @click="onClick">
    <base-svg-icon :iconName="icon.icon" font-size='25px'></base-svg-icon>
  </div>
</template>

<script>
import BaseSvgIcon from './BaseSvgIcon.vue'
export default {
  components: { BaseSvgIcon },
  name: 'd-aside-nav-item',

  props: {
    icon: {
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
      return this.icon[this.valueKey] && this.value === this.icon[this.valueKey] ? 'active' : ''
    }
  },

  methods: {
    onClick () {
      this.$emit('onClick', this.icon)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/handle.scss';
.aside-icon-item{
  -webkit-app-region: no-drag;

  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items:center;
  margin-bottom: 5px;
  border-radius: 5px;
  transition: all 0.3s;
  padding: 5px 0;
}
.active{
  background-color: rgba(0,0,0,0.1)
}
</style>
