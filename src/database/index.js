/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-28 09:56:26
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 16:48:56
 */
import { connectMySQL, queryMySQL, closeMySQL } from './mysql'
import { connectSQLite, querySQLite, closeSQLite } from './sqlite'
import { connectOracle, queryOracle, closeOracle } from './oracle'

const SQL = {
  connection: {
    MySQL: connectMySQL,
    SQLite: connectSQLite,
    Oracle: connectOracle
  },
  query: {
    MySQL: queryMySQL,
    SQLite: querySQLite,
    Oracle: queryOracle
  },
  close: {
    MySQL: closeMySQL,
    SQLite: closeSQLite,
    Oracle: closeOracle
  }
}

export function connectDatabase (type, from) {
  return new Promise((resolve, reject) => {
    SQL.connection[type](from, err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}

export function queryDatabase (type, statement) {
  return new Promise((resolve, reject) => {
    SQL.query[type](statement, err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}

export function closeDatabase (type) {
  return new Promise((resolve, reject) => {
    SQL.close[type](err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}
