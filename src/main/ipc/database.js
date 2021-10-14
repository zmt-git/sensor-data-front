/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-10-08 10:19:05
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 11:48:47
 */
import { connect, query, getTableName, getTableData, close, importExcel, exportExcel } from '../database'
/**
 * @description数据库操作
 * @param {BrowserWindow} mainWindow
 */
export default {
  connect,
  query,
  getTableName,
  getTableData,
  close,
  importExcel,
  exportExcel
}
