/*
 * @Description:主题
 * @Author: zmt
 * @Date: 2021-09-26 15:10:43
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-26 15:14:41
 */
import { getTheme, setTheme } from '@/util/cache/cacheTheme'

export function useTheme () {
  let currentTheme = 'light'
  getTheme() ? currentTheme = getTheme() : currentTheme = 'light'

  function setThemes () {
    window.document.documentElement.setAttribute('data-theme', currentTheme)
    setTheme(currentTheme)
  }

  return {
    currentTheme,
    setThemes
  }
}
