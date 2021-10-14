/*
 * @Description: 窗口 关闭 最小化 最大化 还原
 * @Author: zmt
 * @Date: 2021-10-08 10:17:05
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 12:03:42
 */

function min (mainWindow) {
  mainWindow.minimize()
}

function max (mainWindow) {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }

  return mainWindow.isMaximized()
}

function close (mainWindow) {
  mainWindow.destroy()
}

function changeSize (mainWindow, params) {
  const { type } = params
  let width = 1290
  let height = 720
  if (type === 0) {
    width = 300
    height = 480
  }
  mainWindow.setSize(width, height)
  mainWindow.center()
}

export default {
  min,
  max,
  close,
  changeSize
}
