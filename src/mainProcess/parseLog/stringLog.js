/*
 * @Description: 解析string类型日志
 * @Author: zmt
 * @Date: 2021-10-08 13:48:13
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 11:25:18
 */
import { getDate, getDeviceCode } from '../utils/parse'
// {
//   "type":"string",
//   "split":",",
//   "check":{"clazz":"laser.ServerHandler","head":"SYSINFO","end":"ENDP","length":20},
//   "column":{"battery_voltage":0,"power_voltage":1,"motherboard_temperature":5}
// }
const template = {
  time: '',
  deviceCode: '',
  type: 'string',
  column: { battery_voltage: 0, power_voltage: 1, motherboard_temperature: 5 }
}

export function parseStringLog (string) {
  template.time = new Date(getDate(string))
  template.deviceCode = getDeviceCode(string)
  const body = string.split('：').pop().split(',')
  body.shift()
  body.pop()
  // column
  template.column.battery_voltage = body[0]
  template.column.power_voltage = body[1]
  template.column.motherboard_temperature = body[5]
  return JSON.stringify(template)
}
