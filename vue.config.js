/*
 * @Description: vue-cli配置文件
 * @Author: zmt
 * @Date: 2021-09-28 16:01:38
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-14 17:21:59
 */
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        asar: false,
        // options placed here will be merged with default configuration and passed to electron-builder
        extraResources: { // 拷贝dll等静态文件到指定位置
          from: './build/oracledb',
          to: 'build'
        },
        appId: 'com.detector.app',
        productName: '检测仪数据管理', // 项目名，也是生成的安装文件名，即aDemo.exe
        copyright: 'Copyright © 2021' // 版权信息
        // nsis: {
        //   oneClick: false, // 是否一键安装
        //   allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
        //   allowToChangeInstallationDirectory: true, // 允许修改安装目录
        //   installerIcon: './src/assets/icon.ico', // 安装图标
        //   uninstallerIcon: './src/assets/icon.ico', // 卸载图标
        //   installerHeaderIcon: './src/assets/icon.ico', // 安装时头部图标
        //   createDesktopShortcut: true, // 创建桌面图标
        //   createStartMenuShortcut: true, // 创建开始菜单图标
        //   shortcutName: 'mine' // 图标名称
        // }
      }
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
          to: 'oracledb'
        }
      ])
    ]
  }
}
