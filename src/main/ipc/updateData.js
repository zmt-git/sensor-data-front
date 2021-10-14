/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-09 15:19:54
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 14:11:16
 */
import ForwardsDatabase from '../forward'

/**
 * @Description数据实时转发
 * @param {BrowserWindow} mainWindow
 */
async function forward (params) {
  const { source, target } = params

  const forwardsDatabase = new ForwardsDatabase(source, target)

  await forwardsDatabase.connect()
}

export default {
  forward
}
