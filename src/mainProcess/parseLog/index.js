/*
 * @Description: 解析日志文件
 * @Author: zmt
 * @Date: 2021-10-08 13:47:44
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 16:09:53
 */
// 选取目录 -> 获取目录.log文件 -> 读取文件
// 读取文件 -> 按行读取 -> 解析
// 解析 -> 解析类型 -> 入库/导出为excel
import { parseJsonLog } from './jsonLog'
import { parseStringLog } from './stringLog'
import { parseTlvLog } from './tlvLog'
import { config } from '../config'
const nodeExcel = require('excel-export')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const stringReg = /,+/
const jsonReg = /\{.*?\}/g
// 判断是否为文件
const isFile = fileName => {
  return fs.lstatSync(fileName).isFile()
}

export function parse (form) {
  if (form.type === 0) { // 入库

  } else if (form.type === 1) { // 导出问excel
    const pathArr = getFilePath(form.importDirectory)
    pathArr.forEach(filePath => {
      readFile(filePath)
    })
  }
}

/**
 * @description 获取目录.log文件
 * @param {Path} directory
 */
function getFilePath (directory) {
  try {
    const arr = fs.readdirSync(directory).map(fileName => {
      return path.join(directory, fileName)
    })
      .filter(isFile)

    return arr.filter(item => path.extname(item) === '.log')
  } catch (e) {
    console.log(e)
  }
}

/**
 * @description读取文件
 * @param {Path String} filePath
 */
function readFile (filePath) {
  const stream = fs.createReadStream(filePath)

  const rl = readline.createInterface({
    input: stream
  })

  rl.on('line', (data) => {
    parseProtocol(data)
  })
}

/**
 * @description 解析协议
 * @param {String}} string
 */

function parseProtocol (string) {
  const arr = string.split('：')
  const info = arr.pop()
  if (jsonReg.test(info.trim())) {
    parseJsonLog(string)
  } else if (stringReg.test(info.trim())) {
    parseStringLog(string)
  } else {
    parseTlvLog(string)
  }
}

/**
 * @description导出为excel
 * @param {*} data
 */
export function exportExcel (data) {
  const conf = {}

  conf.name = '日志'

  conf.cols = [
    { caption: 'time', type: 'string' },
    { caption: 'deviceCode', type: 'string' },
    { caption: 'type', type: 'string' },
    { caption: 'check', type: 'string' },
    { caption: 'column', type: 'string' }
  ]

  conf.rows = []
  // 获取数据库列名
  const result = nodeExcel.execute(conf)

  fs.writeFileSync(`${config}/${name}.xlsx`, result, 'binary')
}
/**
 * @description插入数据库
 */
export function intoDatabase () {

}
