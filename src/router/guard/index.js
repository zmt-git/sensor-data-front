/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-09-26 13:34:54
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 12:05:18
 */
import { createPermission } from './createPermission'

/**
 * @description路由设置
 * @param {Router} router
 */
export function setupRouter (router) {
  createPermission(router)
}
