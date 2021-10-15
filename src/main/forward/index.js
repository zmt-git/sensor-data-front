/*
 * @Description:数据实时转发
 * @Author: zmt
 * @Date: 2021-10-09 15:21:49
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-15 10:04:34
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
export default class ForwardsDatabase {
  constructor (source, target) {
    this.sourceForm = source
    this.targetForm = target
    this.sourceConnection = null
    this.targetConnection = null
    this.sourceColumn = []
    this.targetColumn = []
    this.unInsertData = []
    this.pageNum = 1
    this.pageSize = 100
  }

  async connect () {
    try {
      // 链接源数据库
      this.sourceConnection = await connect({ type: this.sourceForm.databaseType, form: this.sourceForm }, true)
      // 链接目标数据库
      this.targetConnection = await connect({ type: this.targetForm.databaseType, form: this.targetForm }, true)

      await this.startForward()
    } catch (e) {
      // 链接异常
      throw new Error(e)
    }
  }

  async startForward () {
    try {
      this.sourceColumn = await this.sourceConnection.getColum(this.sourceForm.tableName)

      this.targetColumn = await this.targetConnection.getColum(this.targetForm.tableName)
    } catch (e) {
      // 获取列表名异常处理
      throw new Error('获取列表名称异常')
    }

    if (this.sourceColumn.length === 0 || this.targetColumn.length === 0) return

    if (!this.isSame()) {
      throw new Error(`${this.sourceForm.tableName} and ${this.targetForm.tableName} fields do not match`)
    }

    await this.insertData()
  }

  isSame () {
    if (this.sourceColumn.length !== this.targetColumn.length) return false

    for (const obj of this.sourceColumn) {
      const res = this.targetColumn.find(item => item === obj)
      if (!res) {
        return false
      }
    }

    return true
  }

  async insertData () {
    const cacheArr = []
    try {
      const res = await this.sourceConnection.selectLimit(this.sourceForm.tableName, this.pageNum, this.pageSize)
      res.forEach(item => {
        const arr = []
        Object.keys(item).forEach(key => {
          arr.push(item[key])
        })
        cacheArr.push(arr)
      })

      if (res.length !== 0) {
        this.pageNum++

        await this.insertBatchData(cacheArr)

        await this.insertData()
      } else {
        await this.sourceConnection.close()
        await this.handleUnInsertData()
      }
    } catch (e) {
      // 查询异常处理
      const obj = {
        time: new Date().toLocaleTimeString(),
        database: `${this.sourceForm.connectString}-${this.sourceForm.tableName}`,
        position: { pageNum: this.pageNum, pageSize: this.pageSize }
      }
      fs.appendFileSync(`${config.savePath}/selectData-forward.log`, JSON.stringify(obj))
    }
  }

  async insertBatchData (cacheArr) {
    try {
      await this.targetConnection.insertBatch(this.targetForm.tableName, this.targetColumn, cacheArr)
    } catch (e) {
      // 入库异常处理
      this.unInsertData.push(cacheArr)
      // throw new Error(e)
    }
  }

  async handleUnInsertData () {
    if (this.unInsertData.length === 0) return
    try {
      await this.targetConnection.insertBatch(this.targetForm.tableName, this.targetColumn, this.unInsertData)
      await this.targetConnection.close()
      this.unInsertData = []
    } catch (e) {
      // 查询异常处理
      const obj = {
        time: new Date().toLocaleTimeString(),
        database: `${this.targetForm.connectString}-${this.targetForm.tableName}`,
        data: this.unInsertData
      }
      fs.appendFileSync(`${config.savePath}/unInsertData-forward.txt`, JSON.stringify(obj))
    }
  }
}
