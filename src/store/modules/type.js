/*
 * @Description: 当前数据库类型， 链接状态
 * @Author: zmt
 * @Date: 2021-09-26 16:33:11
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 10:04:29
 */
export default {
  state: {
    oracleIsLogin: false,
    mysqlIsLogin: false,
    sqliteIsLogin: false,
    currentDataBase: 'MySQL'
  },

  mutations: {
    setOracleIsLogin (state, isLogin) {
      state.oracleIsLogin = isLogin
    },

    setMysqlIsLogin (state, isLogin) {
      state.mysqlIsLogin = isLogin
    },

    setSqliteIsLogin (state, isLogin) {
      state.sqliteIsLogin = isLogin
    },

    setCurrentDataBase (state, type) {
      state.currentDataBase = type
    }
  },

  actions: {
    actionOracleIsLogin ({ commit }, isLogin) {
      commit('setOracleIsLogin', isLogin)
    },
    actionMysqlIsLogin ({ commit }, isLogin) {
      commit('setMysqlIsLogin', isLogin)
    },
    actionSqliteIsLogin ({ commit }, isLogin) {
      commit('setSqliteIsLogin', isLogin)
    },
    actionCurrentDataBase ({ commit }, type) {
      commit('setCurrentDataBase', type)
    },
    actionClearAllState ({ commit }) {
      commit('setOracleIsLogin', false)
      commit('setMysqlIsLogin', false)
      commit('setSqliteIsLogin', false)
      commit('setCurrentDataBase', 'MySQL')
    }
  }
}
