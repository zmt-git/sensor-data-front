/*
 * @Description: vuex getters
 * @Author: zmt
 * @Date: 2021-09-26 16:37:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 15:28:06
 */

export default {
  Oracle: state => state.type.oracleIsLogin,
  MySQL: state => state.type.mysqlIsLogin,
  SQLite: state => state.type.sqliteIsLogin,
  currentDataBase: state => state.type.currentDataBase,
  currentTableName: state => state.sql.currentTableName
}
