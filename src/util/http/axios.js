/*
 * @Description:axios二次封装
 * @Author: zmt
 * @Date: 2021-09-26 14:26:17
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-26 14:41:29
 */
import axios from 'axios'
import { getToken } from '@/util/auth/token'
const service = axios.create({
  baseURL: 'http://192.168.2.135:8080',
  timeout: 60 * 1000
})

service.interceptors.request.use(config => {
  const token = getToken()

  if (token) {
    config.headers.token = 123
  }

  return config
}, error => Promise.reject(error))

service.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

export default service
