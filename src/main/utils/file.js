/*
 * @Description: file
 * @Author: zmt
 * @Date: 2021-10-08 10:06:59
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-15 09:04:28
 */
import { dialog } from 'electron'

/**
 * @description打开文件弹框
 * @param {Array} properties
 */
export function openFileSync (options) {
  const res = dialog.showOpenDialogSync(options)
  return res || ['']
}
