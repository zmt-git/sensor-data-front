/*
 * @Description: vue-cli配置文件
 * @Author: zmt
 * @Date: 2021-09-28 16:01:38
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 17:08:59
 */
const path = require('path')
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
      // builderOptions: {
      //   win: {
      //     icon: './public/favicon.ico'// 安装包图标
      //   },
      //   mac: {
      //     icon: './public/app.png'
      //   },
      //   productName: 'detector'// 安装包名称
      // }
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
