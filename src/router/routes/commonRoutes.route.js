/*
 * @Description: 公共路由
 * @Author: zmt
 * @Date: 2021-09-26 12:01:21
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-29 09:57:50
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
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/',
        name: 'loginSQL',
        component: () => import('@/views/loginDataBase.vue')
      },
      {
        path: '/querySQL',
        name: 'querySQL',
        component: () => import('@/views/sqlSection.vue')
      }
    ]
  }
]
