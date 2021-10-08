/*
 * @Description: 路由守卫 权限
 * @Author: zmt
 * @Date: 2021-09-26 13:34:43
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 12:04:51
 */
import { getToken } from '@/util/auth/token'
const WHITE_LIST = ['/login']

/**
 * @description 路由守卫
 * @param {Router} router
 */
export function createPermission (router) {
  router.beforeEach((to, from, next) => {
    if (getToken()) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      if (WHITE_LIST.includes(to.path)) {
        next()
      } else {
        next('/login')
      }
    }
  })
}
