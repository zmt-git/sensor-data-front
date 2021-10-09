/*
 * @Description: 解析日志文件
 * @Author: zmt
 * @Date: 2021-10-08 13:47:44
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 15:24:10
 */
// 选取目录 -> 获取目录.log文件 -> 读取文件
// 读取文件 -> 按行读取 -> 解析
// 解析 -> 解析类型 -> 入库/导出为excel
import { parseJsonLog } from './jsonLog'
import { parseStringLog } from './stringLog'
import { parseTlvLog } from './tlvLog'
import { config } from '../../../public/config'
import { isProtocolJson, isProtocolString, isProtocolTlv } from '../utils/parse'
import { connectDatabase, queryDatabase } from '../database'

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 判断是否为文件
const isFile = fileName => {
  return fs.lstatSync(fileName).isFile()
}

export async function parse (form) {
  const pathArr = getFilePath(form.importDirectory)
  pathArr.forEach(filePath => {
    readFile(filePath, form)
  })
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
function readFile (filePath, form) {
  const stream = fs.createReadStream(filePath)

  const rl = readline.createInterface({
    input: stream
  })

  rl.on('line', (data) => {
    parseProtocol(data, form)
  })

  stream.on('end', () => {
    console.log('读取完成' + filePath)
  })
}

/**
 * @description 解析协议
 * @param {String}} string
 */

function parseProtocol (string, form) {
  let res

  if (isProtocolJson(string)) {
    res = parseJsonLog(string)
  } else if (isProtocolString(string)) {
    res = parseStringLog(string)
  } else if (isProtocolTlv(string)) {
    res = parseTlvLog(string)
  }

  if (!res) return

  if (form.type === 1) {
    exportTxt(res, form)
  } else if (form.type === 0) {
    intoDatabase(res, form)
  }
}

/**
 * @description导出为txt
 * @param {JsonString} jsonString
 * @param {Object} form { importDirectory: '', type: 1, exportDirectory: '', databaseType: '',connectString: '' }
 */
function exportTxt (jsonString, form) {
  const filename = form.exportDirectory ? form.exportDirectory : `${config.savePath}/${config.logFileName}.txt`
  try {
    if (!fs.existsSync(config.savePath)) {
      fs.mkdirSync(config.savePath)
      fs.appendFileSync(filename, `\n${jsonString}`)
    } else {
      fs.appendFileSync(filename, `\n${jsonString}`)
    }
  } catch (e) {
    console.error(e)
  }
}

// TODO 入库异常处理
/**
 * @description插入数据库
 * @param {JsonString} jsonString
 * @param {Object} form { importDirectory: '', type: 1, exportDirectory: '', databaseType: '',connectString: '' }
 */
export async function intoDatabase (jsonString, form) {
  try {
    const res = JSON.parse(jsonString)
    await connectDatabase(form.databaseType, { username: 'root', password: '123456789', database: form.connectString })
    const keys = Object.keys(res.column).toString()

    const values = []
    Object.keys(res.column).forEach(item => {
      values.push(res.column[item])
    })

    await queryDatabase(form.databaseType, 'log', `INSERT INTO device_log (${keys}) VALUES (${values.join(',')})`)
  } catch (err) {
    console.error(err)
  }
}
