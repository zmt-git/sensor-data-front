/*
 * @Description: renderer ipc
 * @Author: zmt
 * @Date: 2021-09-27 09:34:02
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 15:59:04
 */

import eventBus from '@/util/eventBus'

import { ipcRenderer } from 'electron'

export function registerHeaderIpcRenderer (e) {
  ipcRenderer.on('isMax', isMax)
}

export function removeHeaderIpcRenderer () {
  ipcRenderer.removeListener('isMax', isMax)
}

export function headerIpc (type) {
  ipcRenderer.send(type)
}

export function isMax (event, val) {
  eventBus.$emit('isMax', val)
}
