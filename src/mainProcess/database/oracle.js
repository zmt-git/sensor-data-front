/*
 * @Description: 链接oracle数据库
 * @Author: zmt
 * @Date: 2021-09-27 13:55:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-27 14:39:18
 */
import { oracleConfig } from './config.js'

const oracle = require('oracledb')

let connection

export function connectOracle (form, errFn, successFn) {
  oracle.getConnection({
    user: form.username,
    password: form.password,
    connectString: `${oracleConfig.host}:${oracleConfig.port}/${form.database}`
  }, (err, c) => {
    if (err) {
      errFn(err)
      return
    }
    connection = c
  })
}

export function queryOracle (statement, errFn, successFn) {
  if (connection) {
    connection.execute(statement, (err, result) => {
      if (err) {
        errFn(err)
        return
      }
      successFn(result)
    })
  }
}

export function closeOracle (errFn, successFn) {
  if (connection) {
    connection.close((err) => {
      if (err) {
        errFn(err)
        return
      }
      successFn()
    })
  } else {
    errFn('Oracle未连接')
  }
}
