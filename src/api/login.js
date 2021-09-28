/*
 * @Description: 登录api
 * @Author: zmt
 * @Date: 2021-09-26 14:30:22
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-26 14:31:41
 */
import request from '@/util/http/axios'

export function loginRequest (params) {
  return request({
    url: '/system/login',
    params,
    method: 'POST'
  })
}
