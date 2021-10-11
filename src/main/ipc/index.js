/*
 * @Description: 主进程ipc
 * @Author: zmt
 * @Date: 2021-10-08 10:12:45
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 11:50:49
 */
const events = require.context('.', false, /\.js$/)
const ipcs = []

events.keys().forEach(event => {
  if (event === './index.js') return
  ipcs.push(events(event).ipc)
})

export function registerIpcMain (mainWindow) {
  ipcs.forEach(ipc => ipc(mainWindow))

  mainWindow.webContents.send('created')
}
