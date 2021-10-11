/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-09 15:19:54
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 15:22:50
 */
import { ipcMain } from 'electron'
import { forward } from '../forward'
/**
 * @Description数据实时转发
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('parse', async (event, form) => {
    const res = await forward(form)
    mainWindow.webContents.send('onForward', res)
  })
}
