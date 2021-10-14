/*
 * @Description: 链接sqlite数据库
 * @Author: zmt
 * @Date: 2021-09-27 14:13:59
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 14:06:57
 */
import { exportExcel, importExcel } from '../utils'
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

export default class SQLite {
  constructor (form) {
    this.connection = null
    this.form = form
  }

  connect () {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.form.connectString)) {
        this.connection = new sqlite3.Database(this.form.connectString)
        resolve(this.connection)
      } else {
        return reject(new Error(`${this.form.connectString} is not exist`))
      }
    })
  }

  query (querySql) {
    return new Promise((resolve, reject) => {
      this.connection.all(querySql, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  }

  async getTableName () {
    const res = await this.query('SELECT name FROM sqlite_master where type="table" order by name')
    const result = []

    res.forEach(item => {
      result.push(item.name)
    })

    return result
  }

  getColum (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.all(`PRAGMA table_info(${tabledName})`, (err, res) => {
        if (err) {
          reject(err)
        }
        const arr = []

        res.forEach(item => {
          arr.push(item.name)
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
      this.connection.all(`INSERT INTO ${tabledName} (${keys.join(',')}) VALUES (${data.join(',')})`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  /**
   * @description批量插入数据
   * @param {String} tabledName
   * @param {Array} keys
   * @param {Array} data
   */
  insertBatch (tabledName, keys, data) {
    let values = ''
    data.forEach(item => {
      values += `(${item.join(',')}),`
    })
    values = values.slice(0, -1)
    const sql = `INSERT INTO ${tabledName} (${keys.join(',')}) VALUES ${values}`
    return new Promise((resolve, reject) => {
      this.connection.all(sql, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  selectAll (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.all(`SELECT * FROM ${tabledName}`, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  /**
 * @description分页查询
 * @param {String} tabledName
 * @param {Number} pageNum 当前页
 * @param {Number} pageSize 条数
 */
  selectLimit (tabledName, pageNum, pageSize) {
    return new Promise((resolve, reject) => {
      this.connection.all(`SELECT * FROM ${tabledName} LIMIT ${(pageNum - 1) * pageSize}, ${pageNum * pageSize}`, (err, res) => {
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
      const field = await this.query(`PRAGMA table_info(${tabledName})`)
      field.forEach(item => {
        conf.cols.push({
          caption: item.name,
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
      throw new Error(err)
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
