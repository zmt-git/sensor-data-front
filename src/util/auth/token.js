/*
 * @Description: token缓存
 * @Author: zmt
 * @Date: 2021-09-26 13:37:46
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-26 13:40:43
 */
const TOKEN_KEY = 'detector_token'
export function setToken (token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken () {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken () {
  localStorage.removeItem(TOKEN_KEY)
}
