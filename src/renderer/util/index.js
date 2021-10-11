/*
 * @Description: g
 * @Author: zmt
 * @Date: 2021-10-11 17:13:41
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 17:14:15
 */
import { Message } from 'element-ui'

export function message (res) {
  Message({
    type: res.code === 1 ? 'success' : 'error',
    message: res.msg
  })
}
