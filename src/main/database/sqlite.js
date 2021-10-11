/*
 * @Description: 链接sqlite数据库
 * @Author: zmt
 * @Date: 2021-09-27 14:13:59
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 09:26:06
 */
const sqlite3 = require('sqlite3').verbose()

let connection

export async function connectSQLite (filePth, errFn, successFn) {
  try {
    connection = new sqlite3.Database(filePth)
    successFn(connection)
  } catch (e) {
    errFn(e)
  }
}

export function querySQLite (statement, errFn, successFn) {
  if (connection) {
    connection.run(statement, (err) => {
      if (err) {
        errFn(err)
        return
      }
      successFn()
    })
  } else {
    errFn('SQLite未连接')
  }
}

export function closeSQLite (errFn, successFn) {
  if (connection) {
    connection.close(err => {
      if (err) {
        errFn(err)
        return
      }
      successFn()
    })
  } else {
    errFn('SQLite未连接')
  }
}
