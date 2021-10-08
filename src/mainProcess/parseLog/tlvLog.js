/*
 * @Description: 解析tlv类型日志
 * @Author: zmt
 * @Date: 2021-10-08 13:48:20
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 17:07:19
 */
import { getDate, getDeviceCode } from '../utils/parse'

const template = {
  time: '',
  deviceCode: '',
  type: 'tlv',
  check: { class: 'tlv.DataDecoder', head: '', end: '' },
  column: { id: [], mode_num: [], sig_num: [] }
}
export function parseTlvLog (string) {
  template.time = new Date(getDate(string))
  template.deviceCode = getDeviceCode(string)

  const info = string.split('：').pop()
  // check
  template.check.head = getHead(info)
  template.check.end = getEnd(info)
  // column
  template.column.id = getId(info)
  template.column.mode_num = getModeNum(info)
  template.column.sig_num = getSigNUM(info)

  console.log(JSON.stringify(template))
  return JSON.stringify(template)
}

function getHead (string) {
  return string.slice(0, 11)
}

function getEnd (string) {
  return string.slice(-8)
}
// TODO
function getId (string) {}
// TODO
function getModeNum (string) {}
// TODO
function getSigNUM (string) {}
