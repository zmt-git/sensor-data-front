<!--
 * @Description: icon svg
 * @Author: zmt
 * @Date: 2021-09-26 16:08:41
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-27 09:28:27
-->
<template>
  <svg class="icon" :class="className" :style='{ fontSize: fontSize }' aria-hidden="true">
    <use :xlink:href="'#' + iconName"></use>
</svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      value: ''
    },
    className: {
      type: String,
      default: 'icon-svg'
    },
    fontSize: {
      type: String,
      default: '60px'
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  -webkit-app-region: no-drag;
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.icon-svg{
  font-size: 60px;
}
</style>
