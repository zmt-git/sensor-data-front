/*
 * @Description: 链接sqlite数据库
 * @Author: zmt
 * @Date: 2021-09-27 14:13:59
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 17:23:52
 */
const initSqlJs = require('sql.js')
let connection

export async function connectSQLite (filePth, errFn, successFn) {
  try {
    const SQL = await initSqlJs({ locateFile: file => `../assets/${file}` })

    connection = new SQL.Database(filePth)

    successFn()
  } catch (err) {
    console.log(err)
    errFn(err)
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
