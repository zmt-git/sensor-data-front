/*
 * @Description: file
 * @Author: zmt
 * @Date: 2021-10-08 10:06:59
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-08 12:04:23
 */
import { dialog } from 'electron'

/**
 * @description打开文件弹框
 * @param {Array} properties
 */
export function openFileSync (properties = ['openFile']) {
  const res = dialog.showOpenDialogSync({ properties: properties })
  return res
}
