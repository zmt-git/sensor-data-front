/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-19 09:48:05
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-03 14:15:31
 */
import { app } from 'electron'

export const config = {
  savePath: app.getAppPath(),
  logFileName: 'deviceLog'
}

function setStorage (params) {
  return new Promise((resolve, reject) => {
    if (params.savePath) {
      config.savePath = params.savePath
    }

    if (params.logFileName) {
      config.logFileName = params.logFileName
    }

    resolve(config)
  })
}

export default {
  setStorage
}
