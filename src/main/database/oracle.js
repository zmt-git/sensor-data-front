/*
 * @Description: 链接oracle数据库
 * @Author: zmt
 * @Date: 2021-09-27 13:55:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-19 11:14:12
 */
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
        connectString: `${this.form.host}:${this.form.port || 1521}/${this.form.connectString}`
      }, (err, connection) => {
        if (err) {
          console.error(err)
          reject(new Error('链接数据库失败'))
          return
        }
        this.connection = connection
        resolve(connection)
      })
    })
  }

  query (querySql) {
    return new Promise((resolve, reject) => {
      this.connection.execute(querySql, (err, result) => {
        if (err) {
          console.error(err)

          reject(err)
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
      const res = await this.query('select table_name from user_tables')

      const result = []
      // todo
      res.forEach(item => {
        result.push(item.Tables_in_test)
      })

      return result
    } catch (err) {
      console.error(err)
      throw new Error(`获取${this.form.connectString}表名失败`)
    }
  }

  getColum (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`select * from user_tab_columns where Table_Name=${tabledName}`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`获取${tabledName}列名失败`))
        }

        const arr = []
        // todo
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
      this.connection.execute(`INSERT INTO ${tabledName} (${keys.join(',')}) VALUES (${data.join(',')})`, (err, res) => {
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
      this.connection.execute(sql, [data], (err, res) => {
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
      this.connection.execute(`SELECT * FROM ${tabledName}`, (err, res) => {
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
      this.connection.execute(`SELECT * FROM ${tabledName} LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}`, (err, res) => {
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
        resolve(res.COUNT)
      })
    })
  }

  // 关闭数据库链接
  close () {
    return new Promise((resolve, reject) => {
      this.connection.close((err) => {
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
      const field = await this.getColum(tabledName)
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
