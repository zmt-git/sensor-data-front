/*
 * @Description: 解析tlv类型日志
 * @Author: zmt
 * @Date: 2021-10-08 13:48:20
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 11:39:46
 */
import { getDate, getDeviceCode } from '../utils/parse'
// {
//   "type":"tlv",
//   "check":{"clazz":"tlv.DataDecoder","head":"EAEBECED02","end":"FAFBFCFD"},
//   "column":{"id":[0,13],"mode_num":[15,15],"sig_num":[20,20]}
// }
const template = {
  time: '',
  deviceCode: '',
  type: 'tlv',
  column: { id: [], mode_num: [], sig_num: [] }
}
export function parseTlvLog (string) {
  template.time = new Date(getDate(string))
  template.deviceCode = getDeviceCode(string)

  const body = string.split('：').pop().slice(10, -8)

  // column
  template.column.id = body.slice(0, 13)
  template.column.mode_num = body.slice(15, 16)
  template.column.sig_num = body.slice(20, 21)
  return JSON.stringify(template)
}
