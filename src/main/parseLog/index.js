/*
 * @Description: 解析日志文件
 * @Author: zmt
 * @Date: 2021-10-08 13:47:44
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 11:59:23
 */
// 选取目录 -> 获取目录.log文件 -> 读取文件
// 读取文件 -> 按行读取 -> 解析
// 解析 -> 解析类型 -> 入库/导出为excel
import { parseJsonLog } from './jsonLog'
import { parseStringLog } from './stringLog'
import { parseTlvLog } from './tlvLog'
import { config } from '../config'
import { isProtocolJson, isProtocolString, isProtocolTlv } from '../utils/parse'
import { connect } from '../database'

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 判断是否为文件
const isFile = fileName => {
  return fs.lstatSync(fileName).isFile()
}

export async function parse (form) {
  const pathArr = getFilePath(form.importDirectory)

  const p = []

  pathArr.forEach(filePath => {
    p.push(readFile(filePath, form))
  })

  return Promise.all(p)
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
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath)

    const rl = readline.createInterface({
      input: stream
    })

    rl.on('line', (data) => {
      parseProtocol(data, form)
    })

    stream.on('end', () => {
      resolve('读取完成' + filePath)
    })

    stream.on('error', (err) => {
      reject(err)
    })
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

/**
 * @description插入数据库
 * @param {JsonString} jsonString
 * @param {Object} form { importDirectory: '', type: 1, exportDirectory: '', databaseType: '',connectString: '' }
 */
export async function intoDatabase (jsonString, form) {
  try {
    const res = JSON.parse(jsonString)
    const sql = await connect(form.databaseType, { username: 'root', password: '123456789', database: form.connectString })
    const keys = Object.keys(res.column)

    const values = []
    Object.keys(res.column).forEach(item => {
      values.push(res.column[item])
    })

    await sql.insertOne('device_log', keys, values)
  } catch (err) {
    throw new Error(err)
  }
}
