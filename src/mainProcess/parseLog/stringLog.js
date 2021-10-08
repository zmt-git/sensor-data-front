/*
 * @Description: 解析string类型日志
 * @Author: zmt
 * @Date: 2021-10-08 13:48:13
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 17:07:20
 */
import { getDate, getDeviceCode } from '../utils/parse'

const template = {
  time: '',
  deviceCode: '',
  type: 'string',
  split: ',',
  check: { class: 'laser.ServerHandler', head: '', end: '', length: 0 },
  column: { battery_voltage: 0, power_voltage: 1, motherboard_temperature: 5 }
}

export function parseStringLog (string) {
  template.time = new Date(getDate(string))
  template.deviceCode = getDeviceCode(string)
  // check
  const info = string.split('：').pop()
  template.check.head = getHead(info)
  template.check.end = getEnd(info)
  template.check.length = getLength(info)
  // column
  template.column.battery_voltage = getBatteryVoltage(info)
  template.column.power_voltage = getPowerVoltage(info)
  template.column.motherboard_temperature = getMotherboardTemperature(info)
  return JSON.stringify(template)
}

function getHead (string) {
  return string.split(',').shift()
}

function getEnd (string) {
  return string.split(',').pop()
}

// todo
function getLength (string) {

}

// todo
function getBatteryVoltage (string) {}

// todo
function getPowerVoltage (string) {}

// todo
function getMotherboardTemperature (string) {}
