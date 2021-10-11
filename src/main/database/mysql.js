/*
 * @Description: MySQL
 * @Author: zmt
 * @Date: 2021-09-27 13:33:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 16:51:37
 */
import { openFileSync } from '../utils/file'
import { config } from '../config'

const mysql = require('mysql')
const nodeExcel = require('excel-export')
const fs = require('fs')
const path = require('path')
const xlsx = require('node-xlsx')
export default class MySQL {
  constructor (form) {
    this.connection = null
    this.form = form
  }

  // 链接数据库
  connect () {
    return new Promise((resolve, reject) => {
      this.connection = mysql.createConnection({
        host: config.host,
        user: this.form.user,
        password: this.form.password,
        database: this.form.database ? this.form.database : ''
      })

      this.connection.connect((err) => {
        if (err) {
          reject(err)
          return
        }
        resolve(this.connection)
      })
    })
  }

  /**
   * @description 自定义语句
   * @param {*} sign
   * @param {String} querySql
   */
  query (sign, querySql) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(querySql, (err, result) => {
          if (err) {
            reject(err)
            return
          }
          resolve({ result, sign })
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  async getColum (tabledName) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(`SHOW COLUMNS FROM ${tabledName}`, (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @description 添加数据
   * @param {String} tabledName
   * @param {Array} keys
   * @param {Array} data
   */
  insertOne (tabledName, keys, data) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(`INSERT INTO ${tabledName} (${keys.join(',')}) VALUES (${data.join(',')})`, (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  insertBatch (tabledName, keys, data) {
    const sql = `INSERT INTO ${tabledName} (${keys.join(',')}) VALUES ?`
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(sql, [data], (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  selectAll (tabledName) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(`SELECT * FROM ${tabledName}`, (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  selectLimit (tabledName, pageNum, pageSize) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.query(`SELECT * FROM ${tabledName} LIMIT ${(pageNum - 1) * pageSize}, ${pageNum * pageSize}`, (err, res) => {
          if (err) {
            reject(err)
          }
          resolve(res)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  // 关闭数据库链接
  close () {
    return new Promise((resolve, reject) => {
      try {
        this.connection.end((err) => {
          if (err) {
            reject(err)
          }
          resolve()
          this.connection = null
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * @description导出表为excel
   * @param {String} tabledName
   */
  async exportExcel (tabledName) {
    const conf = {}
    conf.name = tabledName
    conf.cols = []
    // 获取数据库列名
    try {
      const field = await this.query('DESCRIBE', `DESCRIBE ${tabledName}`)
      field.result.forEach(item => {
        conf.cols.push({
          caption: item.Field,
          type: 'string'
        })
      })

      conf.rows = []

      const data = await this.selectAll(tabledName)

      data.result.forEach(item => {
        const row = []
        conf.cols.forEach(key => {
          row.push(item[key.caption])
        })
        conf.rows.push(row)
      })

      const result = nodeExcel.execute(conf)

      if (!fs.existsSync(config.savePath)) {
        fs.mkdirSync(config.savePath)
      }

      fs.writeFileSync(`${config.savePath}/${tabledName}.xlsx`, result, 'binary')

      return `/${config.savePath}/${tabledName}`
    } catch (err) {
      console.error(err)
      return Promise.reject(err)
    }
  }

  /**
   * @description导入excel表数据
   * @param {String} tabledName
   */
  async importExcel (tabledName) {
    try {
      const filePath = openFileSync()
      if (!filePath) {
        return Promise.reject(new Error('file is not exist'))
      }

      if (filePath && path.extname(filePath[0]) !== '.xlsx') {
        throw new Error('文件类型不是xlsx')
      }

      const workSheetsFromBuffer = xlsx.parse(filePath[0])
      if (!workSheetsFromBuffer.length) {
        return Promise.reject(new Error('未读取到数据源'))
      }

      const field = workSheetsFromBuffer[0].data.shift().toString()

      const p = []

      workSheetsFromBuffer[0].data.forEach(async item => {
        p.push(this.insertOne(tabledName, field, item))
      })

      return Promise.all(p)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
