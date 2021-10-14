/*
 * @Description: vue-cli配置文件
 * @Author: zmt
 * @Date: 2021-09-28 16:01:38
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-13 17:27:22
 */
const CopyPlugin = require('copy-webpack-plugin')
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
    },

    plugins: [
      new CopyPlugin([
        {
          // Copy the binary Oracle DB driver to dist.
          from: path.resolve(__dirname, 'node_modules/oracledb/build'),
          to: 'node_modules/oracledb/build'
        }
      ])
    ]
  }
}
