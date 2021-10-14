/*
 * @Description: MySQL
 * @Author: zmt
 * @Date: 2021-09-27 13:33:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 11:24:21
 */
import { exportExcel, importExcel } from '../utils'

const mysql = require('mysql')
export default class MySQL {
  constructor (form) {
    this.connection = null
    this.form = form
  }

  // 链接数据库
  connect () {
    return new Promise((resolve, reject) => {
      this.connection = mysql.createConnection({
        host: this.form.host,
        port: this.form.port || '3306',
        user: this.form.user,
        password: this.form.password,
        database: this.form.connectString ? this.form.connectString : ''
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
  query (querySql) {
    return new Promise((resolve, reject) => {
      this.connection.query(querySql, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  async getTableName () {
    const res = await this.query('show tables')

    const result = []

    res.forEach(item => {
      result.push(item[`Tables_in_${this.form.connectString}`])
    })

    return result
  }

  async getColum (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SHOW COLUMNS FROM ${tabledName}`, (err, res) => {
        if (err) {
          reject(err)
        }
        const arr = []

        res.forEach(item => {
          arr.push(item.Field)
        })
        resolve(arr)
      })
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
      this.connection.query(`INSERT INTO ${tabledName} (${keys.join(',')}) VALUES (${data.join(',')})`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  insertBatch (tabledName, keys, data) {
    const sql = `INSERT INTO ${tabledName} (${keys.join(',')}) VALUES ?`
    return new Promise((resolve, reject) => {
      this.connection.query(sql, [data], (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  selectAll (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${tabledName}`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  selectLimit (tabledName, pageNum, pageSize) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${tabledName} LIMIT ${(pageNum - 1) * pageSize}, ${pageNum * pageSize}`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  // 关闭数据库链接
  close () {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          reject(err)
        }
        resolve()
        this.connection = null
      })
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
      const field = await this.query(`DESCRIBE ${tabledName}`)
      field.forEach(item => {
        conf.cols.push({
          caption: item.Field,
          type: 'string'
        })
      })

      conf.rows = []

      const data = await this.selectAll(tabledName)

      data.forEach(item => {
        const row = []
        conf.cols.forEach(key => {
          row.push(item[key.caption])
        })
        conf.rows.push(row)
      })

      const res = await exportExcel(conf)

      return res
    } catch (err) {
      return Promise.reject(err)
    }
  }

  /**
   * @description导入excel表数据
   * @param {String} tabledName
   */
  async importExcel (tabledName) {
    try {
      const result = importExcel()
      if (!result) return
      const { fields, data } = result
      const res = this.insertBatch(tabledName, fields, data)

      return res
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
