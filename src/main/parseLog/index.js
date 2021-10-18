/*
 * @Description: 解析日志文件
 * @Author: zmt
 * @Date: 2021-10-08 13:47:44
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-18 15:33:19
 */
// 选取目录 -> 获取目录.log文件 -> 读取文件
// 读取文件 -> 按行读取 -> 解析
// 解析 -> 解析类型 -> 入库/导出为excel
import { parseJsonLog } from './jsonLog'
import { parseStringLog } from './stringLog'
import { parseTlvLog } from './tlvLog'
import { config } from '../config'
import { isProtocolJson, isProtocolString, isProtocolTlv } from '../utils/parse'
import { connect } from '../database'

const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 判断是否为文件
// 1.获取目录文件 2.链接数据库 3.读取文件 4.入库/导出为txt文件，
// todo 导出为excel文件

export default class ParseLog {
  constructor (params) {
    this.params = params
    this.base = this.params.base
    this.databaseForm = this.params.database
    this.sql = null
    this.filePaths = []
    this.currentFile = ''
  }

  isFile (fileName) {
    return fs.lstatSync(fileName).isFile()
  }

  async parse () {
    try {
      if (this.base.type === 0) {
        await this.connect()
      }

      this.filePaths = await this.getFilePath()

      this.readFile()
    } catch (e) {
      throw new Error(e)
    }
  }

  async connect () {
    try {
      this.sql = await connect({
        type: this.databaseForm.databaseType,
        form: this.databaseForm
      }, true)
    } catch (e) {
      throw new Error(e)
    }
  }

  async getFilePath () {
    try {
      const arr = fs.readdirSync(this.base.importDirectory).map(fileName => {
        return path.join(this.base.importDirectory, fileName)
      })
        .filter(this.isFile)

      return arr.filter(item => path.extname(item) === '.log')
    } catch (e) {
      console.log(e)
      throw new Error('读取目录文件失败')
    }
  }

  readFile (cacheStringArr = []) {
    this.currentFile = this.filePaths.shift()

    if (!this.currentFile) {
      return
    }

    const stream = fs.createReadStream(this.currentFile)

    const rl = readline.createInterface({
      input: stream
    })

    rl.on('line', async (data) => {
      try {
        const stringObj = this.parseProtocol(data)

        stringObj && cacheStringArr.push(stringObj)

        if (cacheStringArr.length > 100) {
          await this.resolveData(cacheStringArr, rl)
          cacheStringArr = []
          rl.pause()
        }
      } catch (e) {
        throw new Error(e)
      }
    })

    stream.on('end', async () => {
      try {
        await this.resolveData(cacheStringArr, rl)
        rl.close()
        this.readFile()
      } catch (err) {
        throw new Error(err)
      }
    })
  }

  parseProtocol (string) {
    if (isProtocolJson(string)) {
      return parseJsonLog(string)
    }

    if (isProtocolString(string)) {
      return parseStringLog(string)
    }

    if (isProtocolTlv(string)) {
      return parseTlvLog(string)
    }
  }

  async resolveData (cacheStringArr, rl) {
    if (cacheStringArr.length === 0) {
      rl.resume()
      return
    }
    try {
      if (this.base.type === 1) {
        this.exportTxt(cacheStringArr)
      } else if (this.base.type === 0) {
        await this.intoDatabase(cacheStringArr)
      }
    } catch (err) {
      throw new Error(err)
    }

    rl.resume()
  }

  exportTxt (jsonStringArr) {
    const filename = this.base.exportDirectory ? this.base.exportDirectory : `${config.savePath}/${config.logFileName}.txt`

    const content = jsonStringArr.join('\n')
    try {
      if (!fs.existsSync(config.savePath)) {
        fs.mkdirSync(config.savePath)
        fs.appendFileSync(filename, `\n${content}`)
      } else {
        fs.appendFileSync(filename, `\n${content}`)
      }
    } catch (e) {
      console.error(e)

      fs.appendFileSync(`/${config.logFileName}.txt`, `\n${content}`)

      throw new Error(`导出文件${config.savePath}路径不存在, 请查看/${path.join(__dirname, config.logFileName)}.txt文件`)
    }
  }

  async intoDatabase (jsonStringArr) {
    if (!jsonStringArr || !Array.isArray(jsonStringArr) || jsonStringArr.length === 0) return
    try {
      const values = []

      let keys = []

      jsonStringArr.forEach(jsonString => {
        const res = JSON.parse(jsonString)

        const arr = []

        keys = Object.keys(res.column)

        keys.forEach(item => {
          arr.push(res.column[item])
        })

        values.push(arr)
      })

      await this.sql.insertBatch(this.databaseForm.tableName, keys, values)
    } catch (err) {
      const content = jsonStringArr.join('\n')
      try {
        if (!fs.existsSync(config.savePath)) {
          fs.mkdirSync(config.savePath)
          fs.appendFileSync(`${config.savePath}/unInsertData-log.txt`, content)
        } else {
          fs.appendFileSync(`${config.savePath}/unInsertData-log.txt`, content)
        }
      } catch (err) {
        fs.appendFileSync('/unInsertData-log.txt', content)

        throw new Error(`写入文件${config.savePath}路径不存在, 请查看/${path.join(__dirname, 'unInsertData-log')}.txt文件`)
      }
      throw new Error(`批量添加数据失败，查看${config.savePath}/unInsertData-log.txt}文件`)
    }
  }
}
