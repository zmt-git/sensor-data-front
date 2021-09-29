/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-28 09:56:26
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 16:58:59
 */
import { connectMySQL, queryMySQL, closeMySQL, exportMySQL, importMySQL } from './mysql'
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
  },
  exportExcel: {
    MySQL: exportMySQL
  },
  importExcel: {
    MySQL: importMySQL
  }
}

/**
 * @description链接数据库
 * @param {String} type 数据库类型
 * @param {Object} from 链接数据库config
 */
export function connectDatabase (type, from) {
  return new Promise((resolve, reject) => {
    SQL.connection[type](from, err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}

/**
 * @description查询数据
 * @param {String} type 数据库类型
 * @param {String, Number} sign 标识码
 * @param {String} statement 语句
 */
export function queryDatabase (type, sign, statement) {
  return new Promise((resolve, reject) => {
    SQL.query[type](sign, statement, err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}

/**
 * @description关闭数据库
 * @param {String} type 数据库类型
 */
export function closeDatabase (type) {
  return new Promise((resolve, reject) => {
    SQL.close[type](err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}

/**
 * @description导出数据excel
 * @param { String } 数据库类型
 * @param { String } 表名称
 */
export function exportExcel (type, name) {
  return new Promise((resolve, reject) => {
    SQL.exportExcel[type](name, err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}

/**
 * @description导入数据excel
 * @param { String } 数据库类型
 * @param { String } 表名称
 */
export function importExcel (type, name) {
  return new Promise((resolve, reject) => {
    SQL.importExcel[type](name, err => {
      reject(err)
    }, success => {
      resolve(success)
    })
  })
}
