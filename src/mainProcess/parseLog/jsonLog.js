/*
 * @Description:解析json类型日志
 * @Author: zmt
 * @Date: 2021-10-08 13:48:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 17:06:14
 */
import { getDate, getDeviceCode } from '../utils/parse'
const template = {
  time: '',
  deviceCode: '',
  type: 'json',
  check: { class: 'core.DataDecoder' },
  column: { id: '', mode_num: '', sig_num: '' }
}
export function parseJsonLog (string) {
  template.time = new Date(getDate(string))
  template.deviceCode = getDeviceCode(string)
  const info = string.split('：').pop()
  const obj = JSON.parse(info)
  template.column.id = obj.body.deviceCode
  template.column.mode_num = obj.modeNum
  template.column.sig_num = obj.sigNum
  return JSON.stringify(template)
}
