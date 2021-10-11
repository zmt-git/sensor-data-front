/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-28 09:56:26
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-30 14:00:52
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
export async function queryDatabase (type, sign, statement) {
  try {
    const res = await SQL.query[type](sign, statement)
    return res
  } catch (e) {
    throw new Error(e)
  }
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
 * @description导入数据excel
 * @param { String } 数据库类型
 * @param { String } 表名称
 */
export async function importExcel (type, name) {
  try {
    const res = await SQL.importExcel[type](name)
    return res
  } catch (err) {
    console.error(err)

    throw new Error(err)
  }
}

/**
 * @description导出数据excel
 * @param { String } 数据库类型
 * @param { String } 表名称
 */
export async function exportExcel (type, name) {
  try {
    const res = await SQL.exportExcel[type](name)
    return res
  } catch (err) {
    console.error(err)

    throw new Error(err)
  }
}
