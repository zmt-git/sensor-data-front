/*
 * @Description: 日志解析
 * @Author: zmt
 * @Date: 2021-10-08 14:30:49
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 14:38:14
 */
import { ipcRenderer } from 'electron'
import eventBus from '@/util/eventBus'

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
  eventBus.$emit('parse', event, res)
}
