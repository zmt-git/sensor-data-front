/*
 * @Description: 公共路由
 * @Author: zmt
 * @Date: 2021-09-26 12:01:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-28 16:12:26
 */
export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue')
  }
]
