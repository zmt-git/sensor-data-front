/*
 * @Description: vue-cli配置文件
 * @Author: zmt
 * @Date: 2021-09-28 16:01:38
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-11 09:02:51
 */
const path = require('path')
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.join(__dirname, 'src'),
        '@': path.join(__dirname, 'src/renderer'),
        '#': path.join(__dirname, 'src/main')
      }
    }
  }
}
