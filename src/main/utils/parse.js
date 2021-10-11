/*
 * @Description:日志解析工具
 * @Author: zmt
 * @Date: 2021-10-08 15:31:57
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 13:38:40
 */
export function getDate (string) {
  return string.slice(0, 19)
}

export function getDeviceCode (string) {
  const res = string.match(/<.*?>/)
  if (res && res.length >= 1) {
    return res[0].slice(1, -1)
  }
}
// {
//   "type":"string",
//   "split":",",
//   "check":{"clazz":"laser.ServerHandler","head":"SYSINFO","end":"ENDP","length":20},
//   "column":{"battery_voltage":0,"power_voltage":1,"motherboard_temperature":5}
// }
/**
 * @description判断是否为string
 * @param {String} string
 */
export function isProtocolString (string) {
  const body = string.split('：').pop().split(',')
  const len = body.length
  return string.includes('laser.ServerHandler') && body.shift() === 'SYSINFO' && body.pop() === 'ENDP' && len >= 20
}
// {
//   "type":"json",
//   "check":{"clazz":"core.DataDecoder"},
//   "column":{"id":"body.deviceCode","mode_num":"modeNum","sig_num":"sigNum"}
// }
/**
 * @description判断是否为json
 * @param {String} string
 */
const jsonReg = /\{.*?\}/g
export function isProtocolJson (string) {
  const body = string.split('：').pop()
  return string.includes('core.DataDecoder') && jsonReg.test(body)
}

// {
//   "type":"tlv",
//   "check":{"clazz":"tlv.DataDecoder","head":"EAEBECED02","end":"FAFBFCFD"},
//   "column":{"id":[0,13],"mode_num":[15,15],"sig_num":[20,20]}
// }
/**
 * @description判断是否为tlv
 * @param {String} string
 */
export function isProtocolTlv (string) {
  const body = string.split('：').pop()
  const head = body.slice(0, 10)
  const end = body.slice(-8)
  const len = body.slice(10, -8)
  return string.includes('tlv.DataDecoder') && head === 'EAEBECED02' && end === 'FAFBFCFD' && len.length >= 20
}
