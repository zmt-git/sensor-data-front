/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-09-26 13:34:54
 * @LastEditors: zmt
 * @LastEditTime: 2021-09-26 13:44:09
 */
import { createPermission } from './createPermission'
export function setupRouter (router) {
  createPermission(router)
}
