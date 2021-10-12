/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-27 15:57:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 14:58:41
 */
import { ipcRenderer } from 'electron'
import eventBus from '@/util/eventBus'
import { message } from '@/util'

function onConnect (event, res) {
  message(res)
  eventBus.$emit('connect', res)
}

function onQuery (event, res) {
  eventBus.$emit('query', res)
}

function getTableName (event, res) {
  eventBus.$emit('getTableName', res)
}

function onClose (event, res) {
  eventBus.$emit('close', res)
}

function onExportExcel (event, res) {
  message(res)
  eventBus.$emit('exportExcel', res)
}

function onImportExcel (event, res) {
  message(res)
  eventBus.$emit('importExcel', res)
}
/**
 * @description 注册监听
 */
export function register (e) {
  ipcRenderer.on('connect', onConnect)

  ipcRenderer.on('query', onQuery)

  ipcRenderer.on('getTableName', getTableName)

  ipcRenderer.on('close', onClose)

  ipcRenderer.on('exportExcel', onExportExcel)

  ipcRenderer.on('importExcel', onImportExcel)
}

/**
 * @description 移除监听
 */
export function remove () {
  ipcRenderer.removeListener('connect', onConnect)
  ipcRenderer.removeListener('query', onQuery)
  ipcRenderer.removeListener('getTableName', getTableName)
  ipcRenderer.removeListener('close', onClose)
  ipcRenderer.removeListener('exportExcel', onExportExcel)
  ipcRenderer.removeListener('importExcel', onImportExcel)
}

// --------------------------------ipcRender emit--------------------------------
/**
 * @param {String} type 数据库类型
 * @param {Object} form 链接数据form
 */
export function emitConnect (type, form) {
  ipcRenderer.send('connect', type, form)
}
/**
 * @param {String} type 数据库类型
 * @param {String} sign 标记
 * @param {String} querySql 插入语句
 */
export function emitQuery (type, sign, querySql) {
  ipcRenderer.send('query', type, sign, querySql)
}

export function emitGetTableName (type) {
  ipcRenderer.send('getTableName', type)
}

/**
 * @param {String} type 数据库类型
 */
export function emitClose (type) {
  ipcRenderer.send('close', type)
}
/**
 * @description导出为excel
 * @param {String} type 数据库类型
 * @param {String} tabledName 表名称
 */
export function emitExportExcel (type, tabledName) {
  ipcRenderer.send('exportExcel', type, tabledName)
}

/**
 * @description导入excel
 * @param {String} type 数据库类型
 * @param {String} tabledName 表名称
 */
export function emitImportExcel (type, tabledName) {
  ipcRenderer.send('importExcel', type, tabledName)
}
