/*
 * @Description: MySQL
 * @Author: zmt
 * @Date: 2021-09-27 13:33:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 17:30:03
 */
import { mysqlConfig } from './config'

const mysql = require('mysql')
const nodeExcel = require('excel-export')
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
export function queryMySQL (sign, statement, errFn, successFn) {
  if (connection) {
    console.log(sign, statement)
    connection.query(statement, (err, result) => {
      if (err) {
        errFn(err)
        return
      }
      successFn({ result, sign })
    })
  } else {
    errFn('mysql未连接')
  }
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
export function importMySQL (name) {
  const conf = {}
  conf.stylesXmlFile = 'styles.xml'
  conf.name = name

  conf.cols = [{
    caption: 'string',
    type: 'string',
    beforeCellWrite: function (row, cellData) {
      return cellData.toUpperCase()
    }
  }, {
    caption: 'date',
    type: 'date',
    beforeCellWrite: (function () {
      var originDate = new Date(Date.UTC(1899, 11, 30))
      return function (row, cellData, eOpt) {
        if (eOpt.rowNum % 2) {
          eOpt.styleIndex = 1
        } else {
          eOpt.styleIndex = 2
        }
        if (cellData === null) {
          eOpt.cellType = 'string'
          return 'N/A'
        } else { return (cellData - originDate) / (24 * 60 * 60 * 1000) }
      }
    }())
  }, {
    caption: 'bool',
    type: 'bool'
  }, {
    caption: 'number',
    type: 'number'
  }]
  conf.rows = [
    ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
    ['e', new Date(2012, 4, 1), false, 2.7182],
    ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
    ['null date', null, true, 1.414]
  ]
}

/**
 * @description 导入excel数据
 * @param {String} name 表名称
 */
export function exportMySQL (name) {}
