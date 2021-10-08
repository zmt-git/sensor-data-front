/*
 * @Description: layout
 * @Author: zmt
 * @Date: 2021-10-08 11:45:53
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 12:03:54
 */

import eventBus from '@/util/eventBus'

import { ipcRenderer } from 'electron'

export function register (e) {
  ipcRenderer.on('created', created)
}

export function remove () {
  ipcRenderer.removeListener('created', created)
}

export function created (event) {
  eventBus.$emit('created')
}
