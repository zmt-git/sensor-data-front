/*
 * @Description:
 * @Author: zmt
 * @Date: 2021-10-12 16:15:03
 * @LastEditors: zmt
 * @LastEditTime: 2021-10-12 16:26:34
 */
import { ipcMain } from 'electron'
import { openFileSync } from '../utils/file'
import { writeConfigFile } from '../utils'
export function ipc (mainWindow) {
  ipcMain.on('savePath', async (event, properties) => {
    console.log(properties)
    const result = openFileSync(properties)

    await writeConfigFile(result.pop())

    mainWindow.webContents.send('savePath', result)
  })
}
