/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-27 15:57:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 11:34:13
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

// export error
function exportError (event, err) {
  Message({ type: 'error', message: err })
  eventBus.$emit('exportError', err)
}
// export success
function exportSuccess (event, msg) {
  Message({ type: 'success', message: `文件成功导出,位置：${msg}` })
  eventBus.$emit('exportSuccess', msg)
}

// export error
function importError (event, err) {
  Message({ type: 'error', message: err })
  eventBus.$emit('importError', err)
}
// export success
function importSuccess (event, res) {
  Message({ type: 'success', message: `文件导入${res.sign}数据成功` })
  eventBus.$emit('importSuccess', res)
}

/**
 * @description 注册监听
 */
export function register (e) {
  ipcRenderer.on('error', error)

  ipcRenderer.on('connectSuccess', success)

  ipcRenderer.on('queryError', queryError)

  ipcRenderer.on('querySuccess', querySuccess)

  ipcRenderer.on('exportError', exportError)

  ipcRenderer.on('exportSuccess', exportSuccess)

  ipcRenderer.on('importError', importError)

  ipcRenderer.on('importSuccess', importSuccess)
}

/**
 * @description 移除监听
 */
export function remove () {
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

export function exportExcel (type, name) {
  ipcRenderer.send('exportExcel', type, name)
}

export function importExcel (type, name) {
  ipcRenderer.send('importExcel', type, name)
}
