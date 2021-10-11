/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-09 15:19:54
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 16:58:56
 */
import { ipcMain } from 'electron'
import { forward } from '../forward'

/**
 * @Description数据实时转发
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('forward', async (event, form) => {
    try {
      await forward(form)
      mainWindow.webContents.send('forward', { code: 1, msg: '转发成功', result: null })
    } catch (e) {
      mainWindow.webContents.send('forward', { code: 0, msg: '转发失败', result: e })
    }
  })
}
