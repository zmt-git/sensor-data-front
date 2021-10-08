/*
 * @Description:日志解析工具
 * @Author: zmt
 * @Date: 2021-10-08 15:31:57
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 17:09:43
 */
export function getDate (string) {
  return string.slice(0, 19)
}

export function getDeviceCode (string) {
  const res = string.match(/<.*?>/)
  if (res.length >= 1) {
    return res[0].slice(1, -1)
  }
}

export function getClassName (string) {

}
