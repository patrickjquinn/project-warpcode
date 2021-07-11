import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import is_dev from 'electron-is-dev'
import dotenv from 'dotenv'
import Store from 'electron-store'
import pty from 'node-pty'
import defaultShell from 'default-shell'
import os from 'os'

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
	constructor() {
		win = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
				contextIsolation: false
			},
			show: false
		})

		win.maximize()
		win.show()

		const URL = is_dev
			? 'http://localhost:3000'
			: `file://${join(__dirname, '../../dist/index.html')}`

		win.loadURL(URL)

		console.log(`Warp dir: ${os.homedir()}/warpspace/Demo`)

		// const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
		const ptyProcess = pty.spawn(defaultShell, [], {
			name: 'xterm-color',
			cols: 80,
			rows: 24,
			cwd: `${os.homedir()}/warpspace/Demo`,
			env: process.env
		})

		ptyProcess.on('data', (data) => {
			win.webContents.send('terminal-incData', data)
		})

		ipcMain.on('terminal-into', (event, data) => {
			ptyProcess.write(data)
		})
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
