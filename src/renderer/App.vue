<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { useTheme } from '@/hook/theme'
export default {
  name: 'detector',

  mounted () {
    const { setThemes } = useTheme()

    setThemes()
  }
}
</script>

<style>
@import url('//at.alicdn.com/t/font_2835106_9g81hapy6cv.css');
#app{
  width: 100%;
  height: 100%;
}
</style>
