/*
 * @Description:dialog
 * @Author: zmt
 * @Date: 2021-10-08 10:40:55
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 11:54:56
 */
import { ipcMain } from 'electron'
import { openFileSync } from '../utils/file'

/**
 * @Description打开弹框
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('onDialog', (event, type) => {
    let properties = ['openDirectory']
    let filters = []
    if (type === 'exportDirectory') {
      properties = ['openFile']
      filters = [
        { name: 'Txt', extensions: ['txt'] }
      ]
    }
    const result = openFileSync({ filters, properties })

    mainWindow.webContents.send('onDialog', type, result)
  })
}
