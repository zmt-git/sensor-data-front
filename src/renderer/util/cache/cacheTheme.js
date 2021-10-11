/*
 * @Description: 主题
 * @Author: zmt
 * @Date: 2021-09-26 13:37:46
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-26 15:12:33
 */
const THEME_KEY = 'detector_theme'
export function setTheme (theme) {
  localStorage.setItem(THEME_KEY, theme)
}

export function getTheme () {
  return localStorage.getItem(THEME_KEY)
}

export function removeTheme () {
  localStorage.removeItem(THEME_KEY)
}
