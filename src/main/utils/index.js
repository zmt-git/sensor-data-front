/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-12 08:52:20
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-15 09:04:10
 */
import { config } from '../config'
import { openFileSync } from './file'
const fs = require('fs')
const path = require('path')
const nodeExcel = require('excel-export')
const xlsx = require('node-xlsx')

/**
 * @description导出为excel
 * @param {ArrayObject} cols
 * @param {Array} rows
 * @param {String} sheetName
 * @return {String} 导出文件地址
 */
export function exportExcel (conf) {
  try {
    const result = nodeExcel.execute(conf)

    if (!fs.existsSync(config.savePath)) {
      fs.mkdirSync(config.savePath)
    }

    fs.writeFileSync(`${config.savePath}/${conf.name}.xlsx`, result, 'binary')

    return `${config.savePath}/${conf.name}`
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * @description导入为excel
 * @return { Object } {data: Object, files: Array }
 */
export function importExcel () {
  try {
    const filePath = openFileSync()
    if (!filePath) {
      return
    }

    if (filePath && path.extname(filePath[0]) !== '.xlsx') {
      throw new Error('文件类型不是xlsx')
    }

    const workSheetsFromBuffer = xlsx.parse(filePath[0])

    if (!workSheetsFromBuffer.length) {
      return Promise.reject(new Error('未读取到数据源'))
    }

    const fields = workSheetsFromBuffer[0].data.shift()

    return { data: workSheetsFromBuffer[0].data, fields: fields }
  } catch (err) {
    throw new Error(err)
  }
}
