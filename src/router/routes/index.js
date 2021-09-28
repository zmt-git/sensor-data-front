/*
 * @Description: webpack自动加载routes目录下路由
 * @Author: zmt
 * @Date: 2021-09-26 12:02:06
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-26 16:41:46
 */
const files = require.context('.', false, /\.js$/)
const routes = []

files.keys().forEach(key => {
  if (key === './index.js') return
  routes.push(...files(key).default)
})

export default routes
