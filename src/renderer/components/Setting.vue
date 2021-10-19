<!--
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-12 15:28:36
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-19 10:25:39
-->
<template>
  <div class="d-setting" @click.self='close'>
    <transition enter-active-class="animate__animated animate__slideInRight" leave-active-class="animate__animated animate__slideOutRight">
      <div v-show="visible" class="d-setting-inner">
        <div class="d-setting-inner-item">
          <h4 class="title">文件</h4>
          <div class="d-setting-inner-item-save">
            <p class="d-setting-inner-item-save-title"><span>保存位置</span> <el-button size='mini' @click="onChangeSavePath">更改</el-button></p>
            <p class="d-setting-inner-item-save-value">{{config.savePath}}</p>
          </div>
          <el-divider></el-divider>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ipcSend } from '@/ipc'

export default {
  name: 'd-setting',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => ({
        savePath: '',
        logFileName: ''
      })
    }
  },

  methods: {
    close () {
      this.$emit('update:visible', false)
    },

    async onChangeSavePath () {
      try {
        const res = await ipcSend({ sign: 'dialog/openFile', params: { properties: ['openDirectory'] } })
        this.$emit('changeSavePath', res.pop())
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.d-setting{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  background-color: rgba(0,0,0,0.5);
  &-inner{
    width: 300px;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 10px;
    &-item{
      &-save{
      line-height: 20px;
      &-title{
        display: flex;
        justify-content: space-between;
      }
      &-value{
        color: #909399;
        font-size: 13px;
      }
    }
    }
  }
}
.title{
  padding-bottom: 10px;
}
</style>
