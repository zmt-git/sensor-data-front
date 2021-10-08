/*
 * @Description: 改变窗口大小ipc
 * @Author: zmt
 * @Date: 2021-10-08 10:15:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 12:01:40
 */
import { ipcMain } from 'electron'

/**
 * @description改变窗口
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('changeSize', (event, type) => {
    console.log(type)
    let width = 1290
    let height = 720
    if (type === 0) {
      width = 300
      height = 480
    }
    mainWindow.setSize(width, height)
    mainWindow.center()
  })
}
