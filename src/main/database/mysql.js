/*
 * @Description: MySQL
 * @Author: zmt
 * @Date: 2021-09-27 13:33:58
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-05 09:16:47
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
          console.error(err)
          if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            reject(new Error('账号或密码错误'))
          } else {
            reject(new Error('链接数据库失败'))
          }
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
          console.error(err)
          if (err.code === 'ER_PARSE_ERROR') {
            reject(new Error('语法错误'))
          } else {
            reject(err)
          }
          return
        }
        resolve(result)
      })
    })
  }

  update (tableName, keys, data, whereKey = 'id') {
    return new Promise((resolve, reject) => {
      const keysStr = keys.join(' = ?,') + ' = ?'
      this.connection.query(`UPDATE ${tableName} SET ${keysStr} WHERE ${whereKey} = ?`, data, (err, result) => {
        if (err) {
          console.error(err)
          if (err.code === 'ER_PARSE_ERROR') {
            reject(new Error('语法错误'))
          } else {
            reject(err)
          }
          return
        }
        resolve(result)
      })
    })
  }

  async getTableName () {
    try {
      const res = await this.query('show tables')

      const result = []

      res.forEach(item => {
        result.push(item[`Tables_in_${this.form.connectString}`])
      })

      return result
    } catch (err) {
      console.error(err)
      throw new Error(`获取${this.form.connectString}表名失败`)
    }
  }

  async getColum (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SHOW COLUMNS FROM ${tabledName}`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`获取${tabledName}列名失败`))
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
      this.connection.query(`INSERT INTO ${tabledName} (${keys.join(',')}) VALUES ("${data.join(',').replace(/,/g, '","')}")`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}添加数据失败`))
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
          console.error(err)
          reject(new Error(`${tabledName}批量添加数据失败`))
        }
        resolve(res)
      })
    })
  }

  selectAll (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${tabledName}`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}获取数据失败`))
        }
        resolve(res)
      })
    })
  }

  selectLimit (tabledName, pageNum, pageSize) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${tabledName} LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}分页获取数据失败`))
        }
        resolve(res)
      })
    })
  }

  getRows (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT COUNT(1) AS COUNT FROM ${tabledName}`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}获取总条数数据失败`))
        }
        resolve(res.pop().COUNT)
      })
    })
  }

  // 关闭数据库链接
  close () {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          console.error(err)
          reject(new Error(`${this.form.type}断开链接失败`))
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
      const res = await this.insertBatch(tabledName, fields, data)

      return res
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
