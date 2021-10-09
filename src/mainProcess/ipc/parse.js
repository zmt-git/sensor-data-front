/*
 * @Description: 日志解析
 * @Author: zmt
 * @Date: 2021-10-08 14:34:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 15:24:31
 */
import { ipcMain } from 'electron'
import { parse } from '../parseLog/index'
/**
 * @Description日志解析
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('parse', async (event, form) => {
    const res = await parse(form)
    mainWindow.webContents.send('onDialog', res)
  })
}
