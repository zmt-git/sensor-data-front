/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-27 15:57:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 17:16:40
 */
import { Message } from 'element-ui'
import eventBus from '@/util/eventBus'
import { ipcRenderer } from 'electron'
// connect err
function error (event, err) {
  Message({ type: 'error', message: err })
  eventBus.$emit('icpError', err)
}
// connect success
function success (event, msg) {
  eventBus.$emit('icpSuccess', msg)
}

// query err
function queryError (event, err) {
  Message({ type: 'error', message: err })
  eventBus.$emit('queryError', err)
}
// query success
function querySuccess (event, msg) {
  eventBus.$emit('querySuccess', msg)
}
/**
 * @description 注册监听
 */
export function registerDatabaseIpcRenderer (e) {
  ipcRenderer.on('error', error)

  ipcRenderer.on('connectSuccess', success)

  ipcRenderer.on('queryError', queryError)

  ipcRenderer.on('querySuccess', querySuccess)
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
 * @param {String} sign 标记
 * @param {} arg 插入语句
 */
export function query (type, sign, arg) {
  ipcRenderer.send('query', type, sign, arg)
}

/**
 * @param {String} type 数据库类型
 */
export function close (type) {
  ipcRenderer.send('close-database', type)
}
