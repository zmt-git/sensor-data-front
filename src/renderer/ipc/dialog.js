/*
 * @Description: dialog选择目录
 * @Author: zmt
 * @Date: 2021-10-08 10:44:15
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 09:50:50
 */
import eventBus from '@/util/eventBus'
import { ipcRenderer } from 'electron'
function onDialogRes (event, type, res) {
  eventBus.$emit('onDialog', type, res)
}

export function register () {
  ipcRenderer.on('onDialog', onDialogRes)
}

export function remove () {
  ipcRenderer.removeListener('onDialog', onDialogRes)
}

export function onDialog (type, obj) {
  ipcRenderer.send('onDialog', type, obj)
}
