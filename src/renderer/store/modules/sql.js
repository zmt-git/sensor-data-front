/*
 * @Description: 数据库
 * @Author: zmt
 * @Date: 2021-09-29 15:25:29
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 15:29:33
 */
export default {
  state: {
    currentTableName: ''
  },

  mutations: {
    commitCurrentTableName (state, currentTableName) {
      state.currentTableName = currentTableName
    }
  },

  actions: {
    actionsCurrentTableName ({ commit }, currentTableName) {
      commit('commitCurrentTableName', currentTableName)
    }
  }
}
