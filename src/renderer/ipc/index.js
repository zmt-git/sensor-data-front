/*
 * @Description: 注册 ipcRenderer
 * @Author: zmt
 * @Date: 2021-09-28 11:28:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 11:36:43
 */
const events = require.context('.', false, /\.js$/)
const registers = []
const removes = []

events.keys().forEach(event => {
  if (event === './index.js') return
  registers.push(events(event).register)
  removes.push(events(event).remove)
})

export function registerIpcRenderer () {
  registers.forEach(register => register())
}

export function removeIpcRenderer () {
  removes.forEach(remove => remove())
}
