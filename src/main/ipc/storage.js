/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-19 09:48:05
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-19 09:55:36
 */
import { app } from 'electron'

export const config = { savePath: app.getAppPath(), logFileName: 'deviceLog' }

function setStorage (params) {
  if (params.savePath) {
    config.savePath = params.savePath
  }

  if (params.logFileName) {
    config.logFileName = params.logFileName
  }

  return config
}

export default {
  setStorage
}
