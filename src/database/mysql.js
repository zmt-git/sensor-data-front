/*
 * @Description: MySQL
 * @Author: zmt
 * @Date: 2021-09-27 13:33:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 17:01:06
 */
import { mysqlConfig } from './config'

const mysql = require('mysql')

let connection

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

export function queryMySQL (statement, errFn, successFn) {
  if (connection) {
    connection.query(statement, (err, result) => {
      if (err) {
        errFn(err)
        return
      }
      successFn(result)
    })
  } else {
    errFn('mysql未连接')
  }
}

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

export function showTables (errFn, successFn) {
  queryMySQL('show tables', errFn, successFn)
}
