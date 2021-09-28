/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-27 15:57:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 15:59:53
 */

import eventBus from '@/util/eventBus'
import { ipcRenderer } from 'electron'

function error (event, err) {
  eventBus.$emit('icpError', err)
}

function success (event, msg) {
  eventBus.$emit('icpSuccess', msg)
}

/**
 * @description 注册监听
 */
export function registerDatabaseIpcRenderer (e) {
  ipcRenderer.on('error', error)

  ipcRenderer.on('connectSuccess', success)
}

/**
 * @description 移除监听
 */
export function removeDatabaseIpcRenderer () {
  ipcRenderer.removeListener('error', error)
  ipcRenderer.removeListener('connectSuccess', success)
}

// --------------------------------ipcRender emit--------------------------------
/**
 * @param {String} type 数据库类型
 * @param {Object} form 链接数据form
 */
export function connection (type, form) {
  ipcRenderer.send('connect', type, form)
}
/**
 * @param {String} type 数据库类型
 * @param {} arg 插入语句
 */
export function query (type, ...arg) {
  ipcRenderer.send('query', type, ...arg)
}

/**
 * @param {String} type 数据库类型
 */
export function close (type) {
  ipcRenderer.send('close-database', type)
}
