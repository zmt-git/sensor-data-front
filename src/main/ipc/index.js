/*
 * @Description: 主进程ipc
 * @Author: zmt
 * @Date: 2021-10-08 10:12:45
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 13:52:56
 */
import { ipcMain } from 'electron'

const handlers = require.context('.', false, /\.js$/)
const modules = {}

handlers.keys().forEach(handler => {
  if (handler === './index.js') return
  modules[handler.replace(/(\.\/|\.js)/g, '')] = handlers(handler).default
})

export function registerIpcMain (mainWindow) {
  ipcMain.on('rendererProcess', async (event, obj) => {
    const sign = obj.sign

    const [module, name] = sign.split('/')
    try {
      let data = null

      if (module === 'window') {
        data = await modules[module][name](mainWindow, obj.params)
      } else {
        data = await modules[module][name](obj.params)
      }

      const res = { code: 1, sign: obj.sign, msg: 'ok', data: data }

      mainWindow.webContents.send('rendererProcess', res)
    } catch (e) {
      console.error(e)
      mainWindow.webContents.send('rendererProcess', { code: 0, sign: obj.sign, msg: 'error', data: e })
    }
  })
}
