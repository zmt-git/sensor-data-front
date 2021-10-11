/*
 * @Description: 窗口 关闭 最小化 最大化 还原
 * @Author: zmt
 * @Date: 2021-10-08 10:17:05
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 12:02:29
 */
import { ipcMain } from 'electron'
/**
 * @description 窗口 关闭 最小化 最大化 还原
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('window-min', (event) => {
    mainWindow.minimize()
  })
  ipcMain.on('window-max', (event) => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }

    mainWindow.webContents.send('isMax', mainWindow.isMaximized())
  })
  ipcMain.on('window-close', (event) => {
    console.log('close')
    mainWindow.close()
  })
}
