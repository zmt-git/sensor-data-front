/*
 * @Description: g
 * @Author: zmt
 * @Date: 2021-10-11 17:13:41
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-13 14:54:59
 */
import { Message } from 'element-ui'

export function message (res) {
  if (res.code === 1 || res.code === 0) {
    Message({
      type: res.code === 1 ? 'success' : 'error',
      message: res.msg
    })
  }
}
