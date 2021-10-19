/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-19 09:43:04
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-19 09:44:34
 */
export function setStorage (key, value) {
  localStorage.setItem(key, value)
}

export function getStorage (key) {
  return localStorage.getItem(key)
}

export function removeStorage (key) {
  localStorage.removeItem(key)
}
