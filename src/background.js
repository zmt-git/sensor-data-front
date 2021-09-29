'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { connectDatabase, queryDatabase } from './database/index'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let mainWindow
async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 480,
    width: 300,
    useContentSize: true,
    minHeight: 480,
    minWidth: 300,
    center: true,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegration: true,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      contextIsolation: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await mainWindow.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  await createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// ------------------------------- 改变窗口大小ipc --------------------------------------
ipcMain.on('changeSize', (event, type) => {
  console.log(type)
  let width = 1290
  let height = 720
  if (type === 0) {
    width = 300
    height = 480
  }
  mainWindow.setSize(width, height)
  mainWindow.center()
})
// ------------------------------------------------------------------------------------

// ------------------------------- 窗口 关闭 最小化 最大化 还原 ---------------------------
// 窗口 关闭 最小化 最大化 还原
ipcMain.on('window-min', (event) => {
  mainWindow.minimize()
})
ipcMain.on('window-max', (event) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }

  mainWindow.webContents.send('isMax', mainWindow.isMaximized())
})
ipcMain.on('window-close', (event) => {
  console.log('close')
  mainWindow.close()
})
// ------------------------------------------------------------------------------------

// ------------------------------- 数据库 操作 --------------------------------------
ipcMain.on('connect', async (event, type, from) => {
  try {
    await connectDatabase(type, from)
    mainWindow.webContents.send('connectSuccess', `${type}链接成功`)
  } catch (e) {
    mainWindow.webContents.send('error', e)
  }
})

ipcMain.on('query', async (event, type, sign, statement) => {
  try {
    const result = await queryDatabase(type, sign, statement)
    mainWindow.webContents.send('querySuccess', result)
  } catch (e) {
    mainWindow.webContents.send('queryError', e)
  }
})
