/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-19 09:43:04
 * @LastEditors: zmt
 * @LastEditTime: 2021-11-03 13:47:35
 */
export function setStorage (key, value) {
  if (key === undefined) return
  localStorage.setItem(key, value)
}

export function getStorage (key) {
  return localStorage.getItem(key)
}

export function removeStorage (key) {
  localStorage.removeItem(key)
}
