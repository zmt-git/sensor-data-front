/*
 * @Description: 日志解析
 * @Author: zmt
 * @Date: 2021-10-08 14:34:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-15 09:22:56
 */
import ParseLog from '../parseLog/index'
/**
 * @Description日志解析
 * @param {BrowserWindow} mainWindow
 */

async function parse (params) {
  try {
    const p = new ParseLog(params)
    await p.parse()
  } catch (e) {
    throw new Error(e)
  }
}
export default {
  parse
}
