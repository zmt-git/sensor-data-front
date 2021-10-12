/*
 * @Description: 链接oracle数据库
 * @Author: zmt
 * @Date: 2021-09-27 13:55:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 10:57:47
 */
import { config } from '../config'
import { exportExcel, importExcel } from '../utils'

const oracle = require('oracledb')

export default class Oracle {
  constructor (form) {
    this.connection = null
    this.form = form
  }

  connect () {
    return new Promise((resolve, reject) => {
      oracle.getConnection({
        user: this.form.user,
        password: this.form.password,
        connectString: `${config.host}:${config.port}/${this.form.database}`
      }, (err, connection) => {
        if (err) {
          reject(err)
          return
        }
        this.connection = connection
        resolve(connection)
      })
    })
  }

  query (sign, querySql) {
    return new Promise((resolve, reject) => {
      this.connection.execute(querySql, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve({ sign, result })
      })
    })
  }

  async getTableName () {
    const res = this.query('show tables')

    const result = []

    console.log(res)

    res.forEach(item => {
      result.push(item.Tables_in_test)
    })

    return res
  }

  getColum (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`SHOW COLUMNS FROM ${tabledName}`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
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
      this.connection.execute(`INSERT INTO ${tabledName} (${keys.join(',')}) VALUES (${data.join(',')})`, (err, res) => {
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
      this.connection.execute(sql, [data], (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  selectAll (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`SELECT * FROM ${tabledName}`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  selectLimit (tabledName, pageNum, pageSize) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`SELECT * FROM ${tabledName} LIMIT ${(pageNum - 1) * pageSize}, ${pageNum * pageSize}`, (err, res) => {
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
      this.connection.close((err) => {
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
      const { fields, data } = importExcel()

      const res = this.insertBatch(tabledName, fields, data)

      return res
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
