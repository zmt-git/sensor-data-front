/*
 * @Description:数据实时转发
 * @Author: zmt
 * @Date: 2021-10-09 15:21:49
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 16:48:13
 */
/**
 * 1.链接数据库
 * 2.源数据库读取数据
 * 3.缓存数据
 * 4.目标数据库入库
 */
import { connect } from '../database'
import { config } from '../config'
const fs = require('fs')
let pageSize = 100
let pageNum = 1
let form
let sourceColumn = []
let targetColumn = []
let keys = []
let unInsertData = []
/**
 * @description数据实时转发
 * @param {Object} form {
 *      sourceDatabaseType: '',
        sourceConnectString: '',
        sourceTableName: '',
        targetDatabaseType: '',
        targetConnectString: '',
        targetTableName: ''
      }
 */
export async function forward (f) {
  form = f
  unInsertData = []
  try {
    pageSize = 100
    pageNum = 1
    // 链接源数据库
    const source = await connect(form.sourceDatabaseType, { ...config.forward[form.sourceDatabaseType], database: form.sourceConnectString })
    // 链接目标数据库
    const target = await connect(form.targetDatabaseType, { ...config.forward[form.sourceDatabaseType], database: form.sourceConnectString })
    startForward(source, target, form)
  } catch (e) {
    console.warn(e)
  }
}

async function startForward (source, target, form) {
  keys = []

  sourceColumn = await source.getColum(form.sourceTableName)

  targetColumn = await source.getColum(form.targetTableName)

  if (sourceColumn.length === 0 || targetColumn.length === 0) return

  if (!isSame(sourceColumn, targetColumn)) {
    throw new Error(`${form.sourceTableName} and ${form.targetTableName} fields do not match`)
  }

  targetColumn.forEach(item => {
    keys.push(item.Field)
  })

  await insertData(source, target)
}

function isSame (source, target) {
  if (source.length !== target.length) return false

  for (const obj of source) {
    const res = target.find(item => item.Field === obj.Field)
    if (!res) {
      return false
    }
  }

  return true
}

/**
 * @description插入数据
 * @param { Connection } target
 */
async function insertData (source, target) {
  const cacheArr = []
  try {
    const res = await source.selectLimit(form.sourceTableName, pageNum, pageSize)

    res.forEach(item => {
      const arr = []
      Object.keys(item).forEach(key => {
        arr.push(item[key])
      })
      cacheArr.push(arr)
    })

    if (res.length !== 0) {
      pageNum++

      await insertBatchData(target, cacheArr)

      await insertData(source, target)
    } else {
      await handleUnInsertData(target)
    }
  } catch (e) {
    console.error(e)
    throw new Error(`${form.sourceConnectString}-${form.sourceTableName} select data error, reason: ${e}`)
  }
}

/**
 * @description批量插入数据
 * @param {Connection} target
 * @param {Array} cacheArr
 */
async function insertBatchData (target, cacheArr) {
  try {
    await target.insertBatch(form.targetTableName, keys, cacheArr)
  } catch (e) {
    console.error(123)
    console.error(e)
    unInsertData.push(cacheArr)
  }
}

/**
 * @description 插入数据一次处理 重新插入一次，报错则写入文件
 * @param {Connection} target
 */
async function handleUnInsertData (target) {
  if (unInsertData.length === 0) return
  try {
    await target.insertBatch(form.targetTableName, keys, unInsertData)
  } catch (e) {
    console.error(e)
    fs.writeFileSync(`${config.savePath}/unInsertData.txt`, JSON.stringify(unInsertData))
  }
}
