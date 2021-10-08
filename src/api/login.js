/*
 * @Description: 登录api
 * @Author: zmt
 * @Date: 2021-09-26 14:30:22
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 11:53:31
 */
import request from '@/util/http/axios'
/**
 * @Description登录api
 * @param {Object} params { username: String, password: String }
 */
export function loginRequest (params) {
  return request({
    url: '/system/login',
    params,
    method: 'POST'
  })
}
