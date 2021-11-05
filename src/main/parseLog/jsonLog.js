/*
 * @Description:解析json类型日志
 * @Author: zmt
 * @Date: 2021-10-08 13:48:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-05 09:01:00
 */
// {
//   "type":"json",
//   "check":{"clazz":"core.DataDecoder"},
//   "column":{"id":"body.deviceCode","mode_num":"modeNum","sig_num":"sigNum"}
// }
import { getDate, getDeviceCode } from '../utils/parse'
const template = {
  time: '',
  origin: '',
  deviceCode: '',
  type: 'json',
  column: { id: '', mode_num: '', sig_num: '' }
}
export function parseJsonLog (string) {
  template.time = new Date(getDate(string))
  template.deviceCode = getDeviceCode(string)
  template.origin = string
  const info = string.split('：').pop()
  const body = JSON.parse(info)
  template.column.id = body.body.deviceCode
  template.column.mode_num = body.modeNum
  template.column.sig_num = body.sigNum
  return JSON.stringify(template)
}
