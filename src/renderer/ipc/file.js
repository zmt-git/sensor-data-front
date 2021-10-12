/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-12 16:16:59
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 16:28:13
 */

import eventBus from '@/util/eventBus'

import { ipcRenderer } from 'electron'

export function register (e) {
  ipcRenderer.on('savePath', savePath)
}

export function remove () {
  ipcRenderer.removeListener('savePath', savePath)
}

export function savePathIpc (properties) {
  ipcRenderer.send('savePath', properties)
}

export function savePath (event, val) {
  eventBus.$emit('savePath', val)
}
