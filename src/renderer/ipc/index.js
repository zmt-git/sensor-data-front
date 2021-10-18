/*
 * @Description: 注册 ipcRenderer
 * @Author: zmt
 * @Date: 2021-09-28 11:28:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-18 13:58:02
 */
import { ipcRenderer } from 'electron'
import { Message } from 'element-ui'

/**
 * @param {Object} params { sign: 标识符号, body: {}}
 */
export function ipcSend (obj) {
  return new Promise((resolve, reject) => {
    let timer = null

    if (obj.sign === undefined) {
      reject(new Error('参数错误，sign不能为undefined'))
      Message({ type: 'error', message: '参数错误' })
    }

    ipcRenderer.send('rendererProcess', obj)

    function callBack (event, res) {
      clearTimeout(timer)
      if (res.sign === obj.sign) {
        if (res.code === 0) {
          reject(res)
          Message({ type: 'error', message: res.data.message.split('Error:').pop() })
        } else {
          resolve(res.data)
        }
        ipcRenderer.removeListener('rendererProcess', callBack)
      }
    }

    ipcRenderer.on('rendererProcess', callBack)

    timer = setTimeout(() => {
      reject(new Error(`${obj.sign}通讯超时`))
      Message({ type: 'error', message: '通讯超时' })
      clearTimeout(timer)
      ipcRenderer.removeListener('rendererProcess', callBack)
    }, 1000 * 60)
  })
}
