/*
 * @Description: 数据实时转发
 * @Author: zmt
 * @Date: 2021-10-09 15:14:54
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 14:37:51
 */
/*
 * @Description: dialog选择目录
 * @Author: zmt
 * @Date: 2021-10-08 10:44:15
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 11:50:27
 */
import eventBus from '@/util/eventBus'
import { ipcRenderer } from 'electron'

function onForwardRes (event, res) {
  eventBus.$emit('forward', res)
}

export function register () {
  ipcRenderer.on('forward', onForwardRes)
}

export function remove () {
  ipcRenderer.removeListener('onDialog', onForwardRes)
}

export function onForward (form) {
  ipcRenderer.send('forward', form)
}