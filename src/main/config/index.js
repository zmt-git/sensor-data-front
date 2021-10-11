export const config = {
  // 导出文件位置
  savePath: 'D:/detector',
  // 日志导出文件名
  logFileName: 'deviceLog',
  // 数据库链接host
  host: 'localhost',
  // 数据库链接端口
  port: '3306',
  // 实时转发数据库配置
  forward: {
    MySQL: {
      host: 'localhost',
      user: 'root',
      password: '123456789'
    },
    Oracle: {
      user: 'root',
      password: '123456789'
    },
    SQLite: {}
  }
}
