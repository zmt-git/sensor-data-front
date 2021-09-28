/*
 * @Description: 注册 ipcRenderer
 * @Author: zmt
 * @Date: 2021-09-28 11:28:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 12:02:43
 */
import { registerDatabaseIpcRenderer, removeDatabaseIpcRenderer } from './database'
import { registerHeaderIpcRenderer, removeHeaderIpcRenderer } from './header'

export function registerIpcRenderer () {
  registerDatabaseIpcRenderer()
  registerHeaderIpcRenderer()
}

export function removeIpcRenderer () {
  removeDatabaseIpcRenderer()
  removeHeaderIpcRenderer()
}
