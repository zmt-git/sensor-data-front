/*
 * @Description: vuex getters
 * @Author: zmt
 * @Date: 2021-09-26 16:37:42
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-30 15:44:15
 */

export default {
  Oracle: state => state.type.Oracle,
  MySQL: state => state.type.MySQL,
  SQLite: state => state.type.SQLite,
  currentDataBase: state => state.type.currentDataBase,
  currentTableName: state => state.sql.currentTableName
}
