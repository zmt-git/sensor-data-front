/*
 * @Description:数据实时转发
 * @Author: zmt
 * @Date: 2021-10-09 15:21:49
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-09 16:31:02
 */
/**
 * 1.链接数据库
 * 2.源数据库读取数据
 * 3.缓存数据
 * 4.目标数据库入库
 */
import { connectDatabase } from '../database/index'
/**
 * @description数据实时转发
 * @param {Object} form {sourceDatabaseType: '',sourceConnectString: '',targetDatabaseType: '',targetConnectString: '' }
 */
export async function forward (form) {
  try {
    // 链接源数据库
    const source = await connectDatabase(form.sourceDatabaseType, { username: 'root', password: '123456789', database: form.sourceConnectString })
    // 链接目标数据库
    const target = await connectDatabase(form.targetDatabaseType, { username: 'root', password: '123456789', database: form.targetConnectString })

    startForward(source, target)
  } catch (e) {
    console.error(e)
  }
}

// todo
function startForward (source, target) {
  selectData()

  cacheData()

  insertData()
}
/**
 * @description源数据库读取数据
 */
function selectData () {
}

// 缓存数据
function cacheData () {
}

// 入库
function insertData () {
}
