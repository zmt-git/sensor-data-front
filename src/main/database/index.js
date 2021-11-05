/*
 * @Description: 数据库操作
 * @Author: zmt
 * @Date: 2021-09-28 09:56:26
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-05 10:12:49
 */
import MySQL from './mysql'
import Oracle from './oracle'
import SQLite from './sqlite'

const sql = {
  MySQL: null,
  Oracle: null,
  SQLite: null
}

const SQL = { MySQL, Oracle, SQLite }

/**
 * @description链接数据库
 * @param {String} type 数据库类型
 * @param {Object} form 链接数据库config
 * @return {Connection}
 */
export async function connect (params, isReturn = false) {
  try {
    const { type, form } = params
    sql[type] = new SQL[type](form)
    await sql[type].connect()
    if (isReturn) return sql[type]
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}

/**
 * @description查询数据
 * @param {String} type 数据库类型
 * @param {*} sign 标识码
 * @param {String} statement 语句
 */
export async function query (params) {
  try {
    const { type, statement } = params
    const res = await sql[type].query(statement)
    return res
  } catch (e) {
    throw new Error(e)
  }
}

// 获取表名
export async function getTableName (params) {
  try {
    const { type } = params
    const res = await sql[type].getTableName()
    return res
  } catch (e) {
    throw new Error(e)
  }
}

// 获取表数据
export async function getTableData (params) {
  try {
    const { type, tableName, pageNum, pageSize } = params
    const count = await sql[type].getRows(tableName)
    const res = await sql[type].selectLimit(tableName, pageNum, pageSize)
    return { records: res, total: count }
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * @description关闭数据库
 * @param {String} type 数据库类型
 */
export async function close (params) {
  try {
    const { type } = params
    const res = await sql[type].close()
    return res
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * @description导入数据excel
 * @param { String } type 数据库类型
 * @param { String } tableName 表名称
 */
export async function importExcel (params) {
  try {
    const { type, tableName } = params
    const res = await sql[type].importExcel(tableName)
    return res
  } catch (e) {
    throw new Error(e)
  }
}

/**
 * @description导出数据excel
 * @param { String } type 数据库类型
 * @param { String } tableName 表名称
 */
export async function exportExcel (params) {
  try {
    const { type, tableName } = params
    const res = await sql[type].exportExcel(tableName)
    return res
  } catch (e) {
    throw new Error(e)
  }
}
