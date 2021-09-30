/*
 * @Description: MySQL
 * @Author: zmt
 * @Date: 2021-09-27 13:33:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-30 14:56:21
 */
import { mysqlConfig } from './config'
import { dialog } from 'electron'
const mysql = require('mysql')
const nodeExcel = require('excel-export')
const fs = require('fs')
const path = require('path')
const xlsx = require('node-xlsx')
let connection
// TODO 改为promise
/**
 * @description 链接MySQL数据库
 * @param {Object} form 登录config
 * @param {Function} errFn 错误回调
 * @param {Function} successFn 成功回调
 */
export function connectMySQL (form, errFn, successFn) {
  connection = mysql.createConnection({
    host: mysqlConfig.host,
    user: form.username,
    password: form.password,
    database: form.database ? form.database : ''
  })

  connection.connect((err) => {
    if (err) {
      errFn(err)
      return
    }
    successFn(connection.threadId)
  })
}
// TODO 改为promise
/**
 * @description 询问MySQL数据库
 * @param {String， Number} sign 标识符
 * @param {String，} statement 询问语句
 * @param {Function} errFn 错误回调
 * @param {Function} successFn 成功回调
 */
export function queryMySQL (sign, statement) {
  return new Promise(function (resolve, reject) {
    if (connection) {
      console.log(sign, statement)
      connection.query(statement, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve({ result, sign })
      })
    } else {
      reject(new Error('mysql未连接'))
    }
  })
}

// TODO 改为promise
/**
 * @description 关闭MySQL数据库
 * @param {Function} errFn 错误回调
 * @param {Function} successFn 成功回调
 */
export function closeMySQL (errFn, successFn) {
  if (connection) {
    connection.end(function (err) {
      if (err) {
        errFn(err)
        return
      }
      successFn()
    })
  } else {
    errFn('mysql未连接')
  }
}
/**
 * @description 导出数据为excel
 * @param {String} name 表名称
 */
export async function exportMySQL (name) {
  const conf = {}

  conf.name = name
  conf.cols = []
  // 获取数据库列名
  try {
    const field = await queryMySQL('DESCRIBE', `DESCRIBE ${name}`)
    field.result.forEach(item => {
      conf.cols.push({
        caption: item.Field,
        type: 'string'
      })
    })

    conf.rows = []

    const data = await queryMySQL('selectAll', `select * from ${name}`)

    data.result.forEach(item => {
      const row = []
      conf.cols.forEach(key => {
        row.push(item[key.caption])
      })
      conf.rows.push(row)
    })

    console.log(conf)

    const result = nodeExcel.execute(conf)

    fs.writeFileSync(`/electron/${name}.xlsx`, result, 'binary')

    return `/electron/${name}`
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}

/**
 * @description 导入excel数据
 * @param {String} name 表名称
 */
export async function importMySQL (name) {
  try {
    const filePath = dialog.showOpenDialogSync({ properties: ['openFile'] })
    if (!filePath) return
    if (filePath && path.extname(filePath[0]) !== '.xlsx') {
      throw new Error('文件类型不是xlsx')
    }
    const workSheetsFromBuffer = xlsx.parse(filePath[0])
    if (!workSheetsFromBuffer.length) {
      return Promise.reject(new Error('未读取到数据源'))
    }
    const field = workSheetsFromBuffer[0].data.shift().toString()
    const p = []
    workSheetsFromBuffer[0].data.forEach(async item => {
      p.push(queryMySQL('insert', `INSERT INTO ${name} (${field}) VALUES (${item.toString()})`))
    })

    return Promise.all(p)
  } catch (err) {
    return Promise.reject(err)
  }
}
