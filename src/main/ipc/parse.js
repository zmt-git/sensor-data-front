/*
 * @Description: 日志解析
 * @Author: zmt
 * @Date: 2021-10-08 14:34:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 12:01:59
 */
import { ipcMain } from 'electron'
import { parse } from '../parseLog/index'
/**
 * @Description日志解析
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('parse', async (event, form) => {
    try {
      const res = await parse(form)
      mainWindow.webContents.send('parse', { code: 1, msg: '解析日志成功！', result: res })
    } catch (e) {
      mainWindow.webContents.send('parse', { code: 0, msg: '解析日志失败！', result: e })
    }
  })
}
