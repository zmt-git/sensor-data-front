/*
 * @Description: 链接oracle数据库
 * @Author: zmt
 * @Date: 2021-09-27 13:55:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-05 09:41:36
 */
import { dialog } from 'electron'
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
        connectString: `(
          DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${this.form.host})(PORT=${this.form.port || 1521}))
          (CONNECT_DATA=
            (SERVER=DEDICATED)
            (SERVICE_NAME=${this.form.serverName || 'XE'})
          )
        )`
        // connectString: `${this.form.host}:${this.form.port || 1521}/${this.form.connectString}`
      }, (err, connection) => {
        if (err) {
          dialog.showMessageBoxSync({ message: err.message, type: 'error' })
          console.error(err)
          reject(new Error('连接数据库失败'))
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
      const res = await this.query(`SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER = '${this.form.connectString}'`)

      const result = []

      res.rows.forEach(item => {
        result.push(...item)
      })

      return result
    } catch (err) {
      console.error(err)
      throw new Error(`获取${this.form.connectString}表名失败`)
    }
  }

  getColum (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`SELECT C.COLUMN_NAME FROM "SYS"."ALL_TAB_COLS" C WHERE C.USER_GENERATED = 'YES' AND C.OWNER = '${this.form.connectString}' AND C.TABLE_NAME = '${tabledName}' ORDER BY C.TABLE_NAME, C.COLUMN_ID ASC`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`获取${tabledName}列名失败`))
        }
        const arr = []
        res.rows.forEach(item => {
          arr.push(...item)
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
    const key = keys.join(',').replace(/,/g, '","')

    return new Promise((resolve, reject) => {
      this.connection.execute(`INSERT INTO "${this.form.connectString}"."${tabledName}" ("${key}") VALUES (${data.join(',')})`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}添加数据失败`))
        }
        resolve(res)
      })
    })
  }

  async insertBatch (tabledName, keys, data) {
    const p = []

    data.forEach(item => {
      p.push(this.insertOne(tabledName, keys, item))
    })

    return Promise.all(p)
  }

  selectAll (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`SELECT * FROM ${this.form.connectString}.${tabledName}`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}获取数据失败`))
        }
        resolve(res.rows)
      })
    })
  }

  selectLimit (tabledName, pageNum, pageSize) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`SELECT ${this.form.connectString}.${tabledName}.* FROM ${this.form.connectString}.${tabledName} OFFSET ${(pageNum - 1) * pageSize} ROWS FETCH NEXT ${pageSize} ROWS ONLY`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}分页获取数据失败`))
        }
        const rowNames = []
        res.metaData.forEach(item => {
          rowNames.push(item.name)
        })
        const result = []
        res.rows.forEach(item => {
          const obj = {}
          item.forEach((el, index) => {
            obj[rowNames[index]] = el
          })
          result.push(obj)
        })

        resolve(result)
      })
    })
  }

  getRows (tabledName) {
    return new Promise((resolve, reject) => {
      this.connection.execute(`SELECT COUNT(1) AS COUNT FROM ${this.form.connectString}.${tabledName}`, (err, res) => {
        if (err) {
          console.error(err)
          reject(new Error(`${tabledName}获取总条数数据失败`))
        }
        resolve(res.rows.pop().pop())
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
      field.forEach(item => {
        conf.cols.push({
          caption: item,
          type: 'string'
        })
      })

      conf.rows = []

      const data = await this.selectAll(tabledName)

      data.forEach(item => {
        conf.rows.push(item)
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
