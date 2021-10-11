/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-10-08 10:19:05
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 12:02:02
 */
import { ipcMain } from 'electron'
import { connectDatabase, queryDatabase, importExcel, exportExcel } from '../database/index'
/**
 * @description数据库操作
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  // 链接数据库
  ipcMain.on('connect', async (event, type, from) => {
    try {
      await connectDatabase(type, from)
      mainWindow.webContents.send('connectSuccess', `${type}链接成功`)
    } catch (e) {
      mainWindow.webContents.send('error', e)
    }
  })

  // 数据库语句操作
  ipcMain.on('query', async (event, type, sign, statement) => {
    try {
      const result = await queryDatabase(type, sign, statement)
      mainWindow.webContents.send('querySuccess', result)
    } catch (e) {
      mainWindow.webContents.send('queryError', e)
    }
  })

  // excel导入数据库
  ipcMain.on('importExcel', async (event, type, name) => {
    try {
      const res = await importExcel(type, name)
      mainWindow.webContents.send('importSuccess', res)
    } catch (e) {
      mainWindow.webContents.send('importError', e)
    }
  })

  // 数据库导出为excel
  ipcMain.on('exportExcel', async (event, type, name) => {
    try {
      const res = await exportExcel(type, name)
      mainWindow.webContents.send('exportSuccess', res)
    } catch (e) {
      console.error(e)

      mainWindow.webContents.send('exportError', e)
    }
  })
}
