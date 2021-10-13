/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-28 09:56:26
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-13 15:55:16
 */
import MySQL from './mysql'
// import Oracle from './oracle'
import SQLite from './sqlite'

const sql = {
  MySQL: null,
  Oracle: null,
  SQLite: null
}

const SQL = { MySQL, /* Oracle */ SQLite }

/**
 * @description链接数据库
 * @param {String} type 数据库类型
 * @param {Object} form 链接数据库config
 * @return {Connection}
 */
export async function connect (type, form) {
  try {
    sql[type] = new SQL[type](form)
    await sql[type].connect()
    return sql[type]
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * @description查询数据
 * @param {String} type 数据库类型
 * @param {*} sign 标识码
 * @param {String} statement 语句
 */
export async function query (type, sign, querySql) {
  try {
    const res = await sql[type].query(sign, querySql)
    return res
  } catch (e) {
    throw new Error(e)
  }
}

export async function getTableName (type) {
  try {
    const res = await sql[type].getTableName()
    return res
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * @description关闭数据库
 * @param {String} type 数据库类型
 */
export async function close (type) {
  try {
    const res = await sql[type].close()
    return res
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * @description导入数据excel
 * @param { String } type 数据库类型
 * @param { String } tabledName 表名称
 */
export async function importExcel (type, tabledName) {
  try {
    const res = await sql[type].importExcel(tabledName)
    return res
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * @description导出数据excel
 * @param { String } type 数据库类型
 * @param { String } tabledName 表名称
 */
export async function exportExcel (type, tabledName) {
  try {
    const res = await sql[type].exportExcel(tabledName)
    return res
  } catch (e) {
    throw new Error(e)
  }
}
