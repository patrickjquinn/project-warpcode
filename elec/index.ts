/**
 * electron 主文件
 */
import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'
import Store from 'electron-store'

const store = new Store()
ipcMain.on('store:set', async (e, args) => {
  store.set(args.key, args.value)
})
ipcMain.handle('store:get', async (e, args) => {
  const value = await store.get(args)
  return value
})
ipcMain.on('store:delete', async (e, args) => {
  store.delete(args)
})

dotenv.config({ path: join(__dirname, '../../.env') })

let win = null

class createWin {
  constructor () {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        enableRemoteModule: true,
      },
      show: false
    })

    win.maximize()
    win.show()
  
    const URL = is_dev
      ? 'http://localhost:3000' // vite 启动的服务器地址
      : `file://${join(__dirname, '../../dist/index.html')}` // vite 构建后的静态文件地址
  
    win.loadURL(URL)
  }
}

app.whenReady().then(() => new createWin())


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new createWin()
  }
})