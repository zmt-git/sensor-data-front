/*
 * @Description: 日志解析
 * @Author: zmt
 * @Date: 2021-10-08 14:30:49
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 13:40:21
 */
import { ipcRenderer } from 'electron'
import eventBus from '@/util/eventBus'
import { Message } from 'element-ui'

function message (res) {
  Message({
    type: res.code === 1 ? 'success' : 'error',
    message: res.msg
  })
}
export function register () {
  ipcRenderer.on('parse', onParseEmitter)
}

export function remove () {
  ipcRenderer.removeListener('parse', onParseEmitter)
}

export function onParse (form) {
  ipcRenderer.send('parse', form)
}

function onParseEmitter (event, res) {
  message(res)
  eventBus.$emit('parse', res)
}
