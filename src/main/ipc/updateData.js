/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-09 15:19:54
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-13 10:11:24
 */
import { ipcMain } from 'electron'
import ForwardsDatabase from '../forward'

/**
 * @Description数据实时转发
 * @param {BrowserWindow} mainWindow
 */
export function ipc (mainWindow) {
  ipcMain.on('forward', async (event, source, target) => {
    try {
      const forwardsDatabase = new ForwardsDatabase(source, target)

      await forwardsDatabase.connect()

      mainWindow.webContents.send('forward', { code: 1, msg: '转发成功', result: null })
    } catch (e) {
      console.error(e)
      mainWindow.webContents.send('forward', { code: 0, msg: '转发失败', result: e })
    }
  })
}
